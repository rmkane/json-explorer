const THEME_KEY = "json-extension-theme";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";

// Determine if the theme is dark
function isDarkMode(theme: string): boolean {
  return theme === THEME_DARK;
}

// Access the saved theme from Chrome sync storage if running in an extension
// Otherwise, use localStorage
async function getSavedTheme(): Promise<string | null> {
  if (chrome?.storage?.sync) {
    const result = await chrome.storage.sync.get(THEME_KEY);
    return result[THEME_KEY];
  }
  return localStorage.getItem(THEME_KEY);
}

// Determine if the user prefers dark mode
async function prefersDark(): Promise<boolean> {
  const savedTheme = await getSavedTheme();

  if (savedTheme !== null) {
    return isDarkMode(savedTheme);
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Save the theme to Chrome sync storage if running in an extension
// Otherwise, use localStorage
async function setTheme(theme: string, save: boolean = false): Promise<void> {
  if (save) {
    if (chrome?.storage?.sync) {
      console.log("Setting theme in sync storage");
      await chrome?.storage?.sync.set({ [THEME_KEY]: theme });
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  }
  const toggle = document.querySelector<HTMLInputElement>(
    ".json-explorer-switch input[type='checkbox']"
  );
  if (toggle) {
    const isDark = isDarkMode(theme);
    toggle.checked = isDark;
    toggle.setAttribute("aria-checked", String(isDark));
  }
  document.documentElement.dataset.theme = theme;
}

// Toggle the theme
function themeToggle(e: MouseEvent): void {
  const toggle = e.target as HTMLInputElement;
  const isDark = toggle.checked;
  (async () => {
    await setTheme(isDark ? THEME_DARK : THEME_LIGHT, true);
  })();
}

// Load the theme
async function loadTheme(): Promise<void> {
  setTheme((await prefersDark()) ? THEME_DARK : THEME_LIGHT);
}

// Detect theme change for extension popup and other components
async function themeWatcher() {
  if (!chrome?.storage?.sync) return;

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.theme) {
      loadTheme();
    }
  });
}

export {
  THEME_DARK,
  THEME_LIGHT,
  getSavedTheme,
  loadTheme,
  prefersDark,
  setTheme,
  themeToggle,
  themeWatcher,
};
