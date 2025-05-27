document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const body = document.body;
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const mobileSidebarToggle = document.querySelector('.mobile-sidebar-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const infoContainer = document.querySelector('.info-container');
  const timeDisplay = document.getElementById('current-time');

  // Icons
  const moonIcon = `<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />`;
  const sunIcon = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />`;

  // Theme functions
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    updateLogoColor(theme);
  }

  function updateThemeIcon(theme) {
    themeIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  }

  function updateLogoColor(theme) {
    const logo = document.querySelector('.logo-svg');
    if (logo) {
      const paths = logo.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('fill', theme === 'dark' ? '#ffffff' : '#000000');
      });
    }
  }

  function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Sidebar functions
  function toggleSidebar() {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    } else {
      sidebar.classList.toggle('closed');
    }
  }

  function handleResize() {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('closed');
      if (!sidebar.classList.contains('open')) {
        document.querySelector('.mobile-sidebar-toggle').style.display = 'flex';
      }
    } else {
      document.body.style.overflow = '';
      document.querySelector('.mobile-sidebar-toggle').style.display = 'none';
    }
  }

  // Time display function
  function updateTime() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString();
  }

  // Initialize
  function init() {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Initialize time display
    updateTime();
    setInterval(updateTime, 1000);

    // Event listeners
    sidebarToggle.addEventListener('click', toggleSidebar);
    mobileSidebarToggle.addEventListener('click', toggleSidebar);
    themeToggle.addEventListener('click', toggleTheme);
    window.addEventListener('resize', handleResize);

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (!infoContainer.contains(e.target)) {
        document.querySelector('.info-popup').style.opacity = '0';
        document.querySelector('.info-popup').style.visibility = 'hidden';
      }
    });
  }

  init();
});
