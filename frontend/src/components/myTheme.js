// myTheme.js
import { lightTheme } from "@mysten/dapp-kit";

export const myTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    outlineButton: "var(--site-bgr-color)",
    primaryButton: "var(--site-bgr-color)",
  },
  backgroundColors: {
    ...lightTheme.backgroundColors,
    primaryButton: "var(--site-font-dark-color)",
    outlineButtonHover: "#2a2a2d",
    primaryButtonHover: "#2a2a2d",
  },
  borderColors: {
    outlineButton: "var(--site-bgr-light)",
  },
  radii: {
    ...lightTheme.radii,
    medium: "8px",
  },
  shadows: {
    ...lightTheme.shadows,
    primaryButton: "none",
  },
  typography: {
    ...lightTheme.typography,
    fontFamily: "var(--font-family)",
    fontStyle: "normal",
    lineHeight: "1.3",
    letterSpacing: "1",
  },
};
