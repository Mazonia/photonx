"""
PhotonX Backend Configuration
=============================
Centralized configuration for API keys, service URLs, and application settings.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from dotenv import load_dotenv

# Automatically load environment variables from .env in backend directory
_backend_env = Path(__file__).resolve().parent / ".env"
if _backend_env.exists():
    load_dotenv(_backend_env)
else:
    load_dotenv()


@dataclass(frozen=True)
class IRSAConfig:
    """NASA/IPAC IRSA service configuration."""

    sia2_url: str = "https://irsa.ipac.caltech.edu/SIA"
    tap_url: str = "https://irsa.ipac.caltech.edu/TAP"
    spherex_collection: str = "spherex"
    timeout_seconds: float = 30.0
    max_results: int = 100


@dataclass(frozen=True)
class SIMBADConfig:
    """SIMBAD astronomical database configuration."""

    base_url: str = "https://simbad.u-strasbg.fr/simbad/sim-id"
    tap_url: str = "https://simbad.cds.unistra.fr/simbad/sim-tap"
    timeout_seconds: float = 15.0


@dataclass(frozen=True)
class NASAConfig:
    """NASA open API configuration."""

    exoplanet_archive_url: str = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    neows_url: str = "https://api.nasa.gov/neo/rest/v1"
    apod_url: str = "https://api.nasa.gov/planetary/apod"
    donki_url: str = "https://api.nasa.gov/DONKI"
    epic_url: str = "https://api.nasa.gov/EPIC/api"
    api_key: str = field(default_factory=lambda: os.getenv("NASA_API_KEY", "87HcnBLCPJhH7MWptDkzqqzzfdtpdrWqcWfgJqpP"))


@dataclass(frozen=True)
class OpenWeatherConfig:
    """OpenWeather API configuration."""

    base_url: str = "https://api.openweathermap.org/data/2.5"
    onecall_url: str = "https://api.openweathermap.org/data/3.0/onecall"
    agro_key: str = field(default_factory=lambda: os.getenv("AGRO_API_KEY", ""))
    weather_key: str = field(default_factory=lambda: os.getenv("OPENWEATHER_API_KEY", ""))
    timeout_seconds: float = 10.0


@dataclass(frozen=True)
class MeteomaticsConfig:
    """Meteomatics & Open-Meteo astronomical meteorology configuration."""

    api_url: str = "https://api.meteomatics.com"
    username: str = field(default_factory=lambda: os.getenv("METEOMATICS_USERNAME", ""))
    password: str = field(default_factory=lambda: os.getenv("METEOMATICS_PASSWORD", ""))
    open_meteo_url: str = "https://api.open-meteo.com/v1/forecast"
    timeout_seconds: float = 8.0


@dataclass(frozen=True)
class CacheConfig:
    """In-memory cache configuration."""

    default_ttl_seconds: int = 3600  # 1 hour
    max_entries: int = 500


@dataclass(frozen=True)
class AppConfig:
    """Top-level application configuration."""

    app_name: str = "PhotonX Backend"
    version: str = "1.0.0"
    debug: bool = field(default_factory=lambda: os.getenv("DEBUG", "false").lower() == "true")
    host: str = field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))
    port: int = field(default_factory=lambda: int(os.getenv("PORT", "8000")))
    cors_origins: list[str] = field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ]
    )

    irsa: IRSAConfig = field(default_factory=IRSAConfig)
    simbad: SIMBADConfig = field(default_factory=SIMBADConfig)
    nasa: NASAConfig = field(default_factory=NASAConfig)
    openweather: OpenWeatherConfig = field(default_factory=OpenWeatherConfig)
    meteomatics: MeteomaticsConfig = field(default_factory=MeteomaticsConfig)
    cache: CacheConfig = field(default_factory=CacheConfig)


# Singleton configuration instance
settings = AppConfig()
