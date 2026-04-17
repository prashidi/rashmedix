# ── Stage 1: Builder ──────────────────────────────────────────────────────────
# Install build dependencies and compile Python packages
# This stage is discarded after build — not included in final image
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies in a single layer
# gcc and libpq-dev are needed to compile psycopg2
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a local directory
# Using --user avoids installing into system Python
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ── Stage 2: Final image ──────────────────────────────────────────────────────
# Clean slate — only runtime dependencies, no build tools
FROM python:3.12-slim AS final

WORKDIR /app

# Only install libpq (runtime) — no gcc, no build tools
# Single layer, nothing duplicated
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy compiled Python packages from builder stage only
# gcc, libpq-dev, and all build artifacts are left behind
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

CMD ["gunicorn", "rashmedix_backend.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3"]
