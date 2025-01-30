import { Loader } from '@googlemaps/js-api-loader';

// Access environment variables
export const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
export const mapId = process.env.REACT_APP_GOOGLE_MAPS_ID || '';

// Create a singleton loader
export const loader = new Loader({
  apiKey,
  version: "weekly",
  libraries: ["places", "marker", "routes"],
  mapIds: [mapId]
});

// Custom map style to hide most labels and features
export const MAP_STYLES = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }]
  }
];