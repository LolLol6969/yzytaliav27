class YeezyTalia {
  constructor() {
      this.themeToggle = document.getElementById('themeToggle');
      this.sunIcon = document.getElementById('sunIcon');
      this.moonIcon = document.getElementById('moonIcon');
      this.themeLabel = document.getElementById('themeLabel');
      this.body = document.body;
      
      this.init();
  }

  init() {
      this.setupThemeToggle();
      this.setupNavigation();
      this.setupInteractions();
  }

  setupThemeToggle() {
      this.themeToggle.addEventListener('click', () => {
          this.toggleTheme();
      });

      // Keyboard accessibility
      this.themeToggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.toggleTheme();
          }
      });

      // Load saved theme
      this.loadSavedTheme();
      this.updateUI();
  }

  toggleTheme() {
      this.body.classList.toggle('dark-mode');
      this.saveTheme();
      this.updateUI();
      this.addRippleEffect();
  }

  saveTheme() {
      const isDarkMode = this.body.classList.contains('dark-mode');
      try {
          localStorage.setItem('darkMode', isDarkMode.toString());
      } catch (e) {
          console.warn('Unable to save theme preference:', e);
      }
  }

  loadSavedTheme() {
      try {
          const savedTheme = localStorage.getItem('darkMode');
          if (savedTheme === 'true') {
              this.body.classList.add('dark-mode');
          }
      } catch (e) {
          console.warn('Unable to load theme preference:', e);
      }
  }

  updateUI() {
      const isDarkMode = this.body.classList.contains('dark-mode');
      
      // Update label
      this.themeLabel.textContent = isDarkMode ? 'Dark Mode' : 'Light Mode';
      
      // Update aria-label for accessibility
      this.themeToggle.setAttribute('aria-label', 
          isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
      );
  }

  addRippleEffect() {
      // Add a subtle ripple effect on toggle
      const container = document.querySelector('.theme-toggle-container');
      container.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
          container.style.transform = 'scale(1)';
      }, 150);
  }

  setupNavigation() {
      const navLinks = document.querySelectorAll(".main-nav a");
      navLinks.forEach((link) => {
          link.addEventListener("click", (e) => {
              const href = link.getAttribute("href");
              // Check if it's an internal anchor link
              if (href.startsWith("#")) {
                  e.preventDefault();
                  const targetId = href.substring(1);
                  const targetSection = document.getElementById(targetId);
                  if (targetSection) {
                      targetSection.scrollIntoView({
                          behavior: "smooth",
                      });
                  }
                  navLinks.forEach((l) => l.classList.remove("active"));
                  link.classList.add("active");
              }
              // For external links (discografia.html, merch.html), let the default behavior happen
          });
      });

      // Keep the scroll listener for internal navigation
      window.addEventListener("scroll", () => {
          const sections = document.querySelectorAll("section[id]");
          const scrollPos = window.scrollY + 200;
          sections.forEach((section) => {
              const sectionTop = section.offsetTop;
              const sectionHeight = section.offsetHeight;
              const sectionId = section.getAttribute("id");
              if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                  navLinks.forEach((link) => {
                      link.classList.remove("active");
                      if (link.getAttribute("href") === `#${sectionId}`) {
                          link.classList.add("active");
                      }
                  });
              }
          });
      });
  }

  setupInteractions() {
      // Remove the alert functionality for social links since they now have real URLs
      console.log("YeezyTalia initialized with social links");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new YeezyTalia();
});

// Handle system preference changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('darkMode')) {
          if (e.matches) {
              document.body.classList.add('dark-mode');
          } else {
              document.body.classList.remove('dark-mode');
          }
      }
  });
}