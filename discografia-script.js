class DiscografiaManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupThemeToggle()
    this.setupNavigation()
    this.setupAlbumInteractions()
    this.setupScrollEffects()
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    const body = document.body

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode")
      localStorage.setItem("darkMode", body.classList.contains("dark-mode"))
    })

    if (localStorage.getItem("darkMode") === "true") {
      body.classList.add("dark-mode")
    }
  }

  setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item")

    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const sectionId = item.getAttribute("data-section")
        const targetSection = document.getElementById(sectionId)

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
          })
        }

        navItems.forEach((nav) => nav.classList.remove("active"))
        item.classList.add("active")
      })
    })

    window.addEventListener("scroll", () => {
      const sections = document.querySelectorAll("section[id]")
      const scrollPos = window.scrollY + 200

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navItems.forEach((item) => {
            item.classList.remove("active")
            if (item.getAttribute("data-section") === sectionId) {
              item.classList.add("active")
            }
          })
        }
      })
    })
  }

  setupAlbumInteractions() {
    const albumCards = document.querySelectorAll(".album-card")

    albumCards.forEach((card) => {
      card.addEventListener("click", () => {
        const albumId = card.getAttribute("data-album")
        const albumTitle = card.querySelector(".album-title").textContent
        const albumYear = card.querySelector(".album-year").textContent
        const albumDescription = card.querySelector(".album-description").textContent

        this.showAlbumDetails(albumTitle, albumYear, albumDescription)
      })
    })
  }

  showAlbumDetails(title, year, description) {
    const modal = document.createElement("div")
    modal.className = "album-modal"
    modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">×</button>
                    <h2>${title}</h2>
                    <p class="modal-year">${year}</p>
                    <p class="modal-description">${description}</p>
                    <div class="modal-actions">
                        <button class="btn-primary">ASCOLTA SU SPOTIFY</button>
                        <button class="btn-secondary">APPLE MUSIC</button>
                    </div>
                </div>
            </div>
        `

    document.body.appendChild(modal)

    setTimeout(() => modal.classList.add("active"), 10)

    const closeModal = () => {
      modal.classList.remove("active")
      setTimeout(() => document.body.removeChild(modal), 300)
    }

    modal.querySelector(".modal-close").addEventListener("click", closeModal)
    modal.querySelector(".modal-overlay").addEventListener("click", (e) => {
      if (e.target === modal.querySelector(".modal-overlay")) {
        closeModal()
      }
    })

    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        closeModal()
        document.removeEventListener("keydown", escHandler)
      }
    })
  }

  setupScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    document.querySelectorAll(".album-card, .timeline-item").forEach((item) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"
      item.style.transition = "all 0.6s ease"
      observer.observe(item)
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DiscografiaManager();

  const navToggle = document.getElementById("navToggle");
  const body = document.body;

  function setInitialNavState() {
    if (window.innerWidth <= 900) {
      body.classList.add("nav-closed");
      body.classList.remove("nav-open");
    } else {
      body.classList.remove("nav-closed");
      body.classList.add("nav-open");
    }
  }

  setInitialNavState();

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    body.classList.toggle("nav-closed");
    body.classList.toggle("nav-open");
  });

  // Chiudi nav cliccando fuori dal menu su mobile
  document.addEventListener("click", (e) => {
    const nav = document.querySelector('.main-nav');
    if (
      window.innerWidth <= 900 &&
      body.classList.contains("nav-open") &&
      !nav.contains(e.target) &&
      e.target !== navToggle
    ) {
      body.classList.add("nav-closed");
      body.classList.remove("nav-open");
    }
  });

  window.addEventListener("resize", setInitialNavState);
});
