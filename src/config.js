// Central configuration. Change values here only.
export const CONFIG = {
  videoUrl: 'https://res.cloudinary.com/bvw3okdf/video/upload/v1793197102/New_Project_20F7837.mp4',
  appUrl: import.meta.env.VITE_APP_URL || '#categories',
  scrollSeconds: 30,    // film length under a normal scroll
  pxPerSecond: 600,     // assumed normal scroll speed
  smoothing: 9,         // frame easing; higher = snappier
  blend: false,         // true = crossfade neighbouring frames (softer)
  fit: 'cover',         // 'cover' = full screen, 'contain' = whole frame with bars
  focusX: 0.5,
  focusY: 0.5,
  maxDpr: 2,
  maxPixels: 2400000,   // canvas pixel cap; lower it if a phone still drops frames
  smoothQuality: 'high', // 'high' | 'medium' | 'low'
  concurrency: 6,       // parallel downloads
  windowMB: 220,        // memory budget for decoded frames
  maxInflight: 4,       // parallel decodes
  bg: '#000000',
  lenisLerp: 0.085,
  copyrightYear: new Date().getFullYear(),
};
