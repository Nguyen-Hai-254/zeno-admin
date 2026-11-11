// Keep the app usable when Google Fonts is unavailable (offline development,
// restricted CI, or a temporary fonts.gstatic.com outage). The theme files
// still refer to these variables, so provide system-font fallbacks instead of
// loading fonts at build time through next/font/google.
export const fontVariables = 'font-fallbacks';
