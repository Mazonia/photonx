"""
In-memory TTL cache for IRSA and external API responses.
"""

from __future__ import annotations

import time
from typing import Any


class TTLCache:
    """Thread-safe-ready in-memory cache with time-to-live expiration."""

    def __init__(self, ttl_seconds: int = 3600):
        self._store: dict[str, tuple[float, Any]] = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> Any | None:
        """Get a cached value if it exists and hasn't expired."""
        if key in self._store:
            timestamp, value = self._store[key]
            if time.time() - timestamp < self._ttl:
                return value
            else:
                del self._store[key]
        return None

    def set(self, key: str, value: Any) -> None:
        """Store a value with the current timestamp."""
        self._store[key] = (time.time(), value)

    def clear(self) -> None:
        """Clear all cached entries."""
        self._store.clear()

    def prune(self) -> int:
        """Remove expired entries. Returns count of pruned items."""
        now = time.time()
        expired = [k for k, (ts, _) in self._store.items() if now - ts >= self._ttl]
        for k in expired:
            del self._store[k]
        return len(expired)

    @property
    def size(self) -> int:
        return len(self._store)


# Global cache instances
sky_cache = TTLCache(ttl_seconds=3600)
cutout_cache = TTLCache(ttl_seconds=3600)
resolve_cache = TTLCache(ttl_seconds=86400)  # 24h for name resolution
