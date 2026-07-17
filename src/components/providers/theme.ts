const STORAGE_KEY = "theme";

export type Theme = "light" | "dark" | "system";

export const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${STORAGE_KEY}")||"system",r=t;if(t==="system"){r=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.classList.toggle("dark",r==="dark");d.style.colorScheme=r}catch(e){}})();`;

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

export { STORAGE_KEY as themeStorageKey };
