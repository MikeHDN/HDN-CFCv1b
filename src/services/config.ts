export const config = {
  ipApi: {
    key: import.meta.env.VITE_IPAPI_KEY || '',
    baseUrl: 'http://api.ipapi.com/v1',
  },
  map: {
    zoom: parseInt(import.meta.env.VITE_MAP_ZOOM || '2'),
    center: {
      lat: parseFloat(import.meta.env.VITE_MAP_CENTER_LAT || '0'),
      lng: parseFloat(import.meta.env.VITE_MAP_CENTER_LNG || '0'),
    },
  },
};