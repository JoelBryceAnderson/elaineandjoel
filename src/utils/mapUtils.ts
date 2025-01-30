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
