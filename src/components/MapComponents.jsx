import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Component to handle map center changes
export const MapCenterHandler = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Fit map to listing markers so none sit off-screen
export const MapBoundsHandler = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (!positions?.length) return;
    if (positions.length === 1) {
      map.setView(positions[0], Math.max(map.getZoom(), 11));
      return;
    }
    map.fitBounds(positions, { padding: [40, 40], maxZoom: 12 });
  }, [positions, map]);
  return null;
};

// Component to handle map resizing when toggled
export const MapResizer = ({ showMap }) => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(t);
  }, [showMap, map]);
  return null;
};
