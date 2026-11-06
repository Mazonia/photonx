/**
 * PhotonX API Client
 * Handles all communication with the FastAPI backend.
 */

const API_BASE = '/api';

async function request(endpoint, params = {}) {
  const url = new URL(`${window.location.origin}${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, val);
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.detail || err.error || `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request('/health'),

  sky: (ra, dec, radiusArcsec = 60, collection = 'spherex') =>
    request('/sky', { ra, dec, radius_arcsec: radiusArcsec, collection }),

  cutout: (ra, dec, channel = 42, sizeArcsec = 120, imageUrl = '') =>
    request('/cutout', { ra, dec, channel, size_arcsec: sizeArcsec, image_url: imageUrl }),

  spectra: (ra, dec, epoch = '2025-W18') =>
    request('/spectra', { ra, dec, epoch }),

  diff: (ra, dec, epochA = '2025-W18', epochB = '2025-W44', channel = 42) =>
    request('/diff', { ra, dec, epoch_a: epochA, epoch_b: epochB, channel }),

  objects: (ra, dec, epochA = '2025-W18', epochB = '2025-W44') =>
    request('/objects', { ra, dec, epoch_a: epochA, epoch_b: epochB }),

  resolve: (name) => request('/resolve', { name }),

  enrich: (ra, dec, radiusArcsec = 30) =>
    request('/enrich', { ra, dec, radius_arcsec: radiusArcsec }),

  observability: (ra, dec, lat = 0, lon = 0) =>
    request('/observability', { ra, dec, lat, lon }),

  featured: () => request('/featured'),

  skyview: (ra, dec, survey = 'dss', pixels = 400, sizeDeg = 0.5) =>
    request('/skyview', { ra, dec, survey, pixels, size_deg: sizeDeg }),
};

