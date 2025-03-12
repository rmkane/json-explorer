const THEME_KEY = "theme";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";

const toggle = document.getElementById("theme-toggle");

setTheme(prefersDark() ? THEME_DARK : THEME_LIGHT);

toggle.addEventListener("change", toggleTheme);

document.body.classList.add("json-explorer");

function toggleTheme(e) {
  const isDark = e.target.checked;
  setTheme(isDark ? THEME_DARK : THEME_LIGHT, true);
}

function isDarkMode(theme) {
  return theme === THEME_DARK;
}

function prefersDark() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme !== null) {
    return isDarkMode(savedTheme);
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function setTheme(theme, save) {
  if (save) {
    localStorage.setItem(THEME_KEY, theme);
  }
  const isDark = isDarkMode(theme);
  toggle.checked = isDark;
  toggle.setAttribute("aria-checked", isDark);
  document.documentElement.dataset.theme = theme;
}
