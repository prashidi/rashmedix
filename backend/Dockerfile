# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Stage 2: Final image ──────────────────────────────────────────────────────
FROM python:3.12-slim AS final

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /install /usr/local

# Create user with explicit home dir that exists and is writable
RUN groupadd -r rashmedix \
    && useradd -r -g rashmedix -d /tmp -s /sbin/nologin rashmedix \
    && mkdir -p /app/staticfiles \
    && chown -R rashmedix:rashmedix /app

COPY --chown=rashmedix:rashmedix . .

RUN python manage.py collectstatic --noinput || true

USER rashmedix

EXPOSE 8000

CMD ["gunicorn", "rashmedix_backend.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--worker-tmp-dir", "/tmp", \
     "--worker-class", "sync"]
