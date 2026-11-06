"""
Observability Service — Weather & Sky Conditions
==================================================
Uses OpenWeather API to determine if a sky position
is observable from a given location tonight.
"""

from __future__ import annotations

import logging
import math
from datetime import datetime, timezone

import httpx

from config import settings

logger = logging.getLogger("photonx.observability")


async def check_observability(
    ra: float,
    dec: float,
    observer_lat: float = 0.0,
    observer_lon: float = 0.0,
) -> dict:
    """
    Check if a sky position is observable tonight from a location.

    Combines:
    - OpenWeather current conditions (clouds, visibility)
    - Simple altitude calculation for the target
    - Moon phase estimation

    Args:
        ra, dec: Target sky position in degrees
        observer_lat, observer_lon: Observer's geographic location

    Returns:
        Dictionary with observability assessment
    """
    weather = await _get_weather(observer_lat, observer_lon)
    altitude = _calculate_altitude(ra, dec, observer_lat, observer_lon)
    moon = _estimate_moon_phase()

    cloud_cover = weather.get("clouds", {}).get("all", 50)
    visibility_m = weather.get("visibility", 10000)
    visibility_km = visibility_m / 1000.0

    # Determine observability
    is_night = _is_nighttime(observer_lat, observer_lon)
    is_above_horizon = altitude > 10  # at least 10° above horizon
    is_clear = cloud_cover < 40
    is_visible = visibility_km > 5

    is_observable = is_night and is_above_horizon and is_clear and is_visible

    # Generate recommendation
    recommendation = _generate_recommendation(
        is_observable, altitude, cloud_cover, visibility_km, is_night, moon
    )

    return {
        "position": {"ra": ra, "dec": dec},
        "observer_lat": observer_lat,
        "observer_lon": observer_lon,
        "weather": {
            "temperature_c": weather.get("main", {}).get("temp"),
            "humidity_pct": weather.get("main", {}).get("humidity"),
            "description": weather.get("weather", [{}])[0].get("description", "unknown"),
            "wind_speed_ms": weather.get("wind", {}).get("speed"),
        },
        "cloud_cover_pct": cloud_cover,
        "visibility_km": round(visibility_km, 1),
        "target_altitude_deg": round(altitude, 1),
        "moon_phase": moon,
        "is_night": is_night,
        "is_observable": is_observable,
        "recommendation": recommendation,
    }


async def _get_weather(lat: float, lon: float) -> dict:
    """Fetch current weather from OpenWeather API."""
    try:
        async with httpx.AsyncClient(timeout=settings.openweather.timeout_seconds) as client:
            resp = await client.get(
                f"{settings.openweather.base_url}/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": settings.openweather.weather_key,
                    "units": "metric",
                },
            )
            if resp.status_code == 200:
                return resp.json()
            logger.warning(f"OpenWeather returned {resp.status_code}")
    except Exception as e:
        logger.warning(f"OpenWeather query failed: {e}")

    # Fallback
    return {
        "main": {"temp": 15, "humidity": 60},
        "clouds": {"all": 30},
        "visibility": 10000,
        "weather": [{"description": "clear sky"}],
        "wind": {"speed": 3.0},
    }


def _calculate_altitude(ra: float, dec: float, lat: float, lon: float) -> float:
    """
    Calculate the approximate altitude of a celestial object.

    Uses a simplified formula — accurate enough for observability.
    """
    now = datetime.now(timezone.utc)

    # Approximate Local Sidereal Time
    j2000 = datetime(2000, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
    days_since_j2000 = (now - j2000).total_seconds() / 86400.0
    lst_deg = (280.46061837 + 360.98564736629 * days_since_j2000 + lon) % 360

    # Hour angle
    ha = math.radians(lst_deg - ra)

    # Convert to radians
    dec_rad = math.radians(dec)
    lat_rad = math.radians(lat)

    # Altitude formula
    sin_alt = (
        math.sin(dec_rad) * math.sin(lat_rad)
        + math.cos(dec_rad) * math.cos(lat_rad) * math.cos(ha)
    )

    return math.degrees(math.asin(max(-1, min(1, sin_alt))))


def _is_nighttime(lat: float, lon: float) -> bool:
    """Check if it's approximately nighttime at the observer's location."""
    now = datetime.now(timezone.utc)
    # Approximate: convert UTC hour to local solar time
    local_hour = (now.hour + lon / 15) % 24
    return local_hour < 6 or local_hour > 18


def _estimate_moon_phase() -> str:
    """Estimate the current moon phase."""
    now = datetime.now(timezone.utc)
    # Known new moon: Jan 6, 2000
    ref = datetime(2000, 1, 6, 18, 14, 0, tzinfo=timezone.utc)
    days = (now - ref).total_seconds() / 86400.0
    phase = (days % 29.530588853) / 29.530588853

    if phase < 0.03 or phase > 0.97:
        return "New Moon 🌑"
    elif phase < 0.22:
        return "Waxing Crescent 🌒"
    elif phase < 0.28:
        return "First Quarter 🌓"
    elif phase < 0.47:
        return "Waxing Gibbous 🌔"
    elif phase < 0.53:
        return "Full Moon 🌕"
    elif phase < 0.72:
        return "Waning Gibbous 🌖"
    elif phase < 0.78:
        return "Last Quarter 🌗"
    else:
        return "Waning Crescent 🌘"


def _generate_recommendation(
    is_observable: bool,
    altitude: float,
    cloud_cover: float,
    visibility_km: float,
    is_night: bool,
    moon: str,
) -> str:
    """Generate a human-readable observability recommendation."""
    if not is_night:
        return "☀️ It's daytime at your location. Wait for nightfall to observe."

    if altitude < 0:
        return f"⬇️ Target is below the horizon (altitude: {altitude:.1f}°). Try again later or from a different location."

    if altitude < 10:
        return f"🌅 Target is very low (altitude: {altitude:.1f}°). Atmospheric extinction will be severe. Wait for it to rise higher."

    if cloud_cover > 80:
        return f"☁️ Heavy cloud cover ({cloud_cover}%). Observation is unlikely tonight."

    if cloud_cover > 40:
        if altitude > 30:
            return f"🌤️ Partial clouds ({cloud_cover}%). Target is well-placed at {altitude:.1f}° altitude — observe through breaks."
        return f"🌤️ Partial clouds ({cloud_cover}%) and target at {altitude:.1f}°. Marginal conditions."

    if "Full" in moon:
        return f"🌕 Clear skies! Target at {altitude:.1f}° altitude. Note: Full Moon may wash out faint sources."

    if altitude > 45:
        return f"✨ Excellent conditions! Clear skies, target at {altitude:.1f}° altitude. {moon}"

    return f"👍 Good conditions. Clear skies, target at {altitude:.1f}° altitude. {moon}"

