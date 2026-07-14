# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy và install requirements vào prefix riêng
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends wget curl && rm -rf /var/lib/apt/lists/*

# Run as non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy installed Python packages từ builder
COPY --from=builder /install /usr/local

# Copy application source (chỉ app code, không copy .env, venv/, __pycache__)
COPY app/ ./app/

# Set HuggingFace cache dir (sẽ được mount từ Docker volume)
ENV HF_HOME=/app/.cache/huggingface

# Tạo thư mục cache và chown cho appuser
RUN mkdir -p /app/.cache/huggingface && chown -R appuser:appuser /app

USER appuser

# Expose RAG service port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8000/health || exit 1

# Run với uvicorn production mode (không --reload)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
