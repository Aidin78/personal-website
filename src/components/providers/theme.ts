const STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${STORAGE_KEY}")||"dark";if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t!=="light"&&t!=="dark"){t="dark"}d.classList.toggle("dark",t==="dark");d.style.colorScheme=t}catch(e){}})();`;

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "light" || value === "dark") return value;
  if (value === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export { STORAGE_KEY as themeStorageKey };
