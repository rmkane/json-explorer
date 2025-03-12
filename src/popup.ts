import { getSavedTheme, loadTheme, themeWatcher } from "./theme";

document.addEventListener("DOMContentLoaded", onLoad);

// Listen for theme changes
themeWatcher();

function onLoad() {
  const btn = document.querySelector<HTMLButtonElement>("#options-btn");
  if (!btn) {
    throw new Error("Could not find the options button");
  }
  btn.addEventListener("click", onOptionsClick);
  loadTheme();
}

function onOptionsClick() {
  // Close the popup
  globalThis.close();

  const savedTheme = getSavedTheme();

  alert(`Saved theme: ${savedTheme}`);
}
