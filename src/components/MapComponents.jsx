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
