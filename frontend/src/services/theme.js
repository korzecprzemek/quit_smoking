// Theme setting: "system" (follow the OS), "light" or "dark".
// The colours themselves live in index.css as light-dark() tokens; all this
// does is force `color-scheme` through a data-theme attribute on <html>.

export const THEMES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") {
    root.dataset.theme = theme;
  } else {
    // "system", or anything unexpected: no attribute, follow the OS.
    delete root.dataset.theme;
  }
}
