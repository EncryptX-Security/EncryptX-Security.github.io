const body = document.body;
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const mainContent = document.querySelector(".main");

const icons = {
  dark: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
           <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
         </svg>`,
  light: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>`
};

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode) {
  let effectiveMode = mode;
  if (mode === "auto") {
    effectiveMode = getSystemTheme();
  }

  body.classList.remove("dark", "light");
  body.classList.add(effectiveMode);

  sidebar.classList.remove("dark", "light");
  sidebar.classList.add(effectiveMode);

  if (effectiveMode === "dark") {
    themeToggleBtn.innerHTML = icons.light;
  } else {
    themeToggleBtn.innerHTML = icons.dark;
  }

  localStorage.setItem("theme", mode);
}

function closeSidebar() {
  // For desktop: add closed class to collapse sidebar and expand main
  if (window.innerWidth > 768) {
    sidebar.classList.add("closed");
    sidebar.classList.remove("open");
    mainContent.style.width = "100%";
  } else {
    // For mobile: remove open class to hide sidebar with slide
    sidebar.classList.remove("open");
  }
}

function openSidebar() {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("closed");
    sidebar.classList.remove("open");
    mainContent.style.width = "calc(100% - 260px)";
  } else {
    sidebar.classList.add("open");
  }
}

function toggleSidebar() {
  if (window.innerWidth > 768) {
    if (sidebar.classList.contains("closed")) {
      openSidebar();
    } else {
      closeSidebar();
    }
  } else {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
      removeOverlay();
    } else {
      openSidebar();
      addOverlay();
    }
  }
}

// Overlay to close sidebar on mobile by clicking outside
let overlay;
function addOverlay() {
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay active";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", () => {
      closeSidebar();
      removeOverlay();
    });
  } else {
    overlay.classList.add("active");
  }
}

function removeOverlay() {
  if (overlay) {
    overlay.classList.remove("active");
  }
}

// Event listeners
toggleBtn.addEventListener("click", toggleSidebar);

themeToggleBtn.addEventListener("click", () => {
  const current = localStorage.getItem("theme") || "auto";

  let next;
  if (current === "auto") next = "dark";
  else if (current === "dark") next = "light";
  else next = "auto";

  applyTheme(next);
});

// Handle system theme change if auto mode is enabled
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
  const saved = localStorage.getItem("theme") || "auto";
  if (saved === "auto") {
    applyTheme("auto");
  }
});

// On load apply theme and set sidebar open by default on desktop
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme") || "auto";
  applyTheme(savedTheme);

  if (window.innerWidth > 768) {
    openSidebar();
  } else {
    closeSidebar();
  }
});

// Also handle window resize to reset sidebar state accordingly
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    removeOverlay();
    openSidebar();
  } else {
    closeSidebar();
  }
});
