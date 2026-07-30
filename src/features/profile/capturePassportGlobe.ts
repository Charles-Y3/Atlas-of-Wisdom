import maplibregl from 'maplibre-gl';
import { LOCATION_BY_ID } from '../../data/locations';
import { OFFLINE_STYLE } from '../../components/map/offlineStyle';
import { ONLINE_PROBE_MS, ONLINE_STYLE_URL } from '../../components/map/onlineStyle';

const SIZE = 512;

async function probeOnline(): Promise<boolean> {
  try {
    const res = await fetch(ONLINE_STYLE_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(ONLINE_PROBE_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function waitForIdle(map: maplibregl.Map, ms = 2200): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const timer = setTimeout(done, ms);
    map.once('idle', () => {
      clearTimeout(timer);
      // One extra frame so tiles finish painting into the buffer.
      requestAnimationFrame(() => requestAnimationFrame(done));
    });
  });
}

/**
 * Render a real MapLibre globe (online Liberty tiles when reachable,
 * otherwise the offline basemap) and return a PNG data URL.
 */
export async function capturePassportGlobe(visitedIds: string[]): Promise<string | null> {
  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${SIZE}px;height:${SIZE}px;opacity:0;pointer-events:none;`;
  document.body.appendChild(host);

  const useOnline = await probeOnline();
  let map: maplibregl.Map | null = null;

  try {
    map = new maplibregl.Map({
      container: host,
      style: useOnline ? ONLINE_STYLE_URL : (OFFLINE_STYLE as maplibregl.StyleSpecification),
      center: [40, 18],
      zoom: 1.15,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      // Needed so getCanvas().toDataURL() is not blank after present.
      ...({ preserveDrawingBuffer: true } as object),
    });

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('map timeout')), 12000);
      map!.once('load', () => {
        clearTimeout(t);
        resolve();
      });
      map!.once('error', () => {
        /* style errors may still leave a usable canvas */
      });
    }).catch(() => undefined);

    try {
      map.setProjection({ type: 'globe' });
    } catch {
      // Some styles ignore projection; still capture the canvas.
    }

    const features = visitedIds
      .map((id) => LOCATION_BY_ID[id])
      .filter(Boolean)
      .map((loc) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: loc!.coords },
        properties: {},
      }));

    const addPins = () => {
      if (!map) return;
      if (!map.getSource('passport-pins')) {
        map.addSource('passport-pins', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features },
        });
      }
      if (!map.getLayer('passport-pins')) {
        map.addLayer({
          id: 'passport-pins',
          type: 'circle',
          source: 'passport-pins',
          paint: {
            'circle-radius': 4,
            'circle-color': '#b08a3c',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#fffdf6',
          },
        });
      }
    };

    if (map.isStyleLoaded()) addPins();
    else map.once('style.load', addPins);

    await waitForIdle(map, useOnline ? 2800 : 1200);

    const canvas = map.getCanvas();
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  } finally {
    map?.remove();
    host.remove();
  }
}
