// Central configuration. Change values here only.
export const CONFIG = {
  videoUrl: 'https://res.cloudinary.com/bvw3okdf/video/upload/v1793197102/New_Project_20F7837.mp4',
  appUrl: import.meta.env.VITE_APP_URL || '#categories',
  scrollSeconds: 30,
  pxPerSecond: 600,
  smoothing: 9,
  fit: 'cover',        // <-- Switched back to full screen
  maxDpr: 2,
  concurrency: 6,
  bg: '#F4F6FA',
  lenisLerp: 0.085,
  copyrightYear: new Date().getFullYear(),
};
