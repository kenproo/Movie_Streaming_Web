import os
import json
import sys
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.http.exceptions import UnexpectedResponse

def main():
    # Load configuration from environment variables or defaults
    import_dir = os.environ.get("CHILLFILM_IMPORT_DIR", "./import-data")
    qdrant_url = os.environ.get("QDRANT_URL", "http://localhost:6333")
    collection_name = os.environ.get("QDRANT_COLLECTION_NAME", "chillfilm_movies")
    recreate = os.environ.get("QDRANT_RECREATE", "false").lower() == "true"

    print(f"Connecting to Qdrant at {qdrant_url}...")
    try:
        client = QdrantClient(url=qdrant_url)
    except Exception as e:
        print(f"Error connecting to Qdrant: {e}", file=sys.stderr)
        sys.exit(1)

    points_file_path = os.path.join(import_dir, "qdrant_points.jsonl")
    config_file_path = os.path.join(import_dir, "qdrant_collection_config.json")

    if not os.path.exists(points_file_path):
        print(f"Points file not found at {points_file_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Reading points from {points_file_path}")

    # Read first line to detect vector size
    vector_size = None
    with open(points_file_path, "r", encoding="utf-8") as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                vector = data.get("vector")
                if isinstance(vector, list) and len(vector) > 0:
                    vector_size = len(vector)
                    break
            except Exception:
                continue

    if not vector_size:
        print("Could not automatically determine vector size from first point. Defaulting to 384.", file=sys.stderr)
        vector_size = 384

    # Load configuration if available
    vector_params = VectorParams(size=vector_size, distance=Distance.COSINE)
    if os.path.exists(config_file_path):
        print(f"Loading collection config from {config_file_path}")
        try:
            with open(config_file_path, "r", encoding="utf-8") as f:
                config_data = json.load(f)
                # Check for vector configuration
                # Format could be { "params": { "vectors": { "size": X, "distance": Y } } }
                # or { "vectors": { "size": X, "distance": Y } }
                vectors_cfg = config_data.get("vectors") or config_data.get("params", {}).get("vectors")
                if vectors_cfg:
                    size = vectors_cfg.get("size", vector_size)
                    dist_str = vectors_cfg.get("distance", "Cosine").upper()
                    distance = Distance.COSINE
                    if dist_str == "EUCLIDEAN":
                        distance = Distance.EUCLID
                    elif dist_str == "DOT":
                        distance = Distance.DOT
                    vector_params = VectorParams(size=size, distance=distance)
                    print(f"Using vector configuration: size={size}, distance={distance}")
        except Exception as e:
            print(f"Error parsing config file, using default vector parameters: {e}")

    # Collection existence check and creation
    collection_exists = False
    try:
        client.get_collection(collection_name=collection_name)
        collection_exists = True
    except UnexpectedResponse:
        # Collection does not exist
        pass
    except Exception as e:
        print(f"Error checking collection existence: {e}", file=sys.stderr)
        sys.exit(1)

    if collection_exists and recreate:
        print(f"Recreating collection '{collection_name}' as requested (QDRANT_RECREATE=true)...")
        client.delete_collection(collection_name=collection_name)
        client.create_collection(
            collection_name=collection_name,
            vectors_config=vector_params
        )
    elif not collection_exists:
        print(f"Creating collection '{collection_name}'...")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=vector_params
        )
    else:
        print(f"Collection '{collection_name}' already exists. Appending/upserting new points.")

    # Parse and upsert points in batches
    imported_count = 0
    skipped_count = 0
    failed_count = 0
    batch = []
    batch_size = 100

    def upsert_batch(pts):
        nonlocal imported_count, failed_count
        try:
            client.upsert(collection_name=collection_name, points=pts)
            imported_count += len(pts)
            print(f"Successfully upserted batch of {len(pts)} points. (Total imported: {imported_count})")
        except Exception as e:
            failed_count += len(pts)
            print(f"Failed to upsert batch of {len(pts)} points: {e}", file=sys.stderr)

    with open(points_file_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, start=1):
            line_str = line.strip()
            if not line_str:
                continue
            try:
                data = json.loads(line_str)
                # A point needs: id, vector, payload
                pt_id = data.get("id")
                vector = data.get("vector")
                payload = data.get("payload", {})

                if not pt_id or not vector:
                    print(f"Line {line_num} skipped: missing 'id' or 'vector'")
                    skipped_count += 1
                    continue

                point = PointStruct(id=pt_id, vector=vector, payload=payload)
                batch.append(point)

                if len(batch) >= batch_size:
                    upsert_batch(batch)
                    batch = []

            except Exception as e:
                print(f"Error parsing line {line_num}: {e}", file=sys.stderr)
                failed_count += 1
                continue

    if batch:
        upsert_batch(batch)

    print("\n--- Import Summary ---")
    print(f"Imported: {imported_count}")
    print(f"Skipped:  {skipped_count}")
    print(f"Failed:   {failed_count}")

if __name__ == "__main__":
    main()
