"""
Script kiểm tra Qdrant collection — chạy trước khi thay đổi embedding model
Usage: python scripts/check_collection.py
"""
import os
import sys

def main():
    qdrant_url = os.environ.get("QDRANT_URL", "http://localhost:6333")
    collection = os.environ.get("QDRANT_COLLECTION", "chillfilm_movies")

    print(f"Checking Qdrant collection '{collection}' at {qdrant_url}...")

    try:
        from qdrant_client import QdrantClient
        client = QdrantClient(url=qdrant_url, timeout=10)

        # List all collections
        collections = client.get_collections()
        print(f"\nAvailable collections:")
        for c in collections.collections:
            print(f"  - {c.name}")

        # Get specific collection info
        info = client.get_collection(collection)
        config = info.config.params.vectors

        print(f"\nCollection '{collection}' details:")
        print(f"  Vectors count: {info.vectors_count}")
        print(f"  Indexed vectors: {info.indexed_vectors_count}")

        if hasattr(config, 'size'):
            print(f"  Vector dimension: {config.size}")
            print(f"  Distance metric: {config.distance}")
            print(f"\n>>> IMPORTANT: Your embedding model MUST produce vectors of dimension {config.size}")
        else:
            # Named vectors
            print(f"  Named vectors: {config}")

        # Sample a point to see payload structure
        points = client.scroll(collection_name=collection, limit=1, with_payload=True, with_vectors=False)
        if points[0]:
            print(f"\nSample payload keys: {list(points[0][0].payload.keys())}")

    except ImportError:
        print("ERROR: qdrant-client not installed. Run: pip install qdrant-client")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Cannot connect to Qdrant: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
