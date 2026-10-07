// Detección e inicialización del tema antes de renderizar para evitar parpadeos
(function() {
    const savedTheme = localStorage.getItem('agenda-theme') || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

const sunIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

const moonIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

function updateThemeIcons() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const icons = document.querySelectorAll('.theme-toggle-icon');
    const texts = document.querySelectorAll('.theme-toggle-text');
    
    icons.forEach(icon => {
        icon.innerHTML = currentTheme === 'dark' ? sunIconSvg : moonIconSvg;
    });
    texts.forEach(text => {
        text.textContent = currentTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('agenda-theme', currentTheme);
    updateThemeIcons();
}

document.addEventListener('DOMContentLoaded', updateThemeIcons);
