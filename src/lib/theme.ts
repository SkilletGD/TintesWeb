export const THEME_STORAGE_KEY = "tintes-theme";

export const themeInitScript = `(function(){try{var clave="${THEME_STORAGE_KEY}";var guardado=localStorage.getItem(clave);var oscuro=guardado?guardado==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var raiz=document.documentElement;raiz.classList.toggle("dark",oscuro);raiz.style.colorScheme=oscuro?"dark":"light";}catch(e){}})();`;
