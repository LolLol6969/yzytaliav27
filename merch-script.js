class MerchManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupThemeToggle()
    this.setupInteractions()
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

  setupInteractions() {
    document.querySelectorAll(".social-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const platform = link.textContent
        alert(`Seguici su ${platform} per essere notificato quando la sezione merch sarà disponibile!`)
      })
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MerchManager()
})
