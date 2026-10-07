// Dark / Light Mode Switcher
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    updateToggleIcons('light');
  } else {
    document.body.classList.remove('light-theme');
    updateToggleIcons('dark');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (document.body.classList.contains('light-theme')) {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        updateToggleIcons('dark');
      } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        updateToggleIcons('light');
      }
    });
  });

  function updateToggleIcons(theme) {
    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.fa-sun');
      const moonIcon = btn.querySelector('.fa-moon');
      if (theme === 'light') {
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
      } else {
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
      }
    });
  }
});
