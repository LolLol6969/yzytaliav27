class MusicPlayer {
  constructor() {
    this.currentTrack = null
    this.currentAlbum = null
    this.isPlaying = false
    this.currentPlaylist = []
    this.currentTrackIndex = 0
    this.audioElement = document.getElementById("audioElement")
    this.init()
  }

  init() {
    this.setupThemeToggle()
    this.setupNavigation()
    this.setupAlbumInteractions()
    this.setupPlayerControls()
    this.setupAudioEvents()
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
    const expandBtns = document.querySelectorAll(".expand-btn")

    expandBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        const albumPlayer = btn.closest(".album-player")
        const tracklist = albumPlayer.querySelector(".tracklist")

        if (tracklist.classList.contains("expanded")) {
          tracklist.classList.remove("expanded")
          btn.textContent = "MOSTRA TRACKLIST"
        } else {
          document.querySelectorAll(".tracklist.expanded").forEach((tl) => {
            tl.classList.remove("expanded")
            tl.closest(".album-player").querySelector(".expand-btn").textContent = "MOSTRA TRACKLIST"
          })

          tracklist.classList.add("expanded")
          btn.textContent = "NASCONDI TRACKLIST"
        }
      })
    })

    document.addEventListener("click", (e) => {
      if (e.target.closest(".track-item")) {
        const trackItem = e.target.closest(".track-item")
        const trackPath = trackItem.getAttribute("data-track")
        const albumPlayer = trackItem.closest(".album-player")
        const albumTitle = albumPlayer.querySelector(".album-title").textContent
        const trackName = trackItem.querySelector(".track-name").textContent
        const albumCover = albumPlayer.querySelector(".album-cover img").src

        this.playTrack(trackPath, trackName, albumTitle, albumCover, trackItem)
        this.buildPlaylist(albumPlayer)
      }
    })
  }

  setupPlayerControls() {
    const playPauseBtn = document.getElementById("playPauseBtn")
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const progressBar = document.getElementById("progressBar")

    playPauseBtn.addEventListener("click", () => {
      this.togglePlayPause()
    })

    prevBtn.addEventListener("click", () => {
      this.previousTrack()
    })

    nextBtn.addEventListener("click", () => {
      this.nextTrack()
    })

    progressBar.addEventListener("click", (e) => {
      const rect = progressBar.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * this.audioElement.duration
      this.audioElement.currentTime = newTime
    })
  }

  setupAudioEvents() {
    this.audioElement.addEventListener("loadedmetadata", () => {
      this.updateTotalTime()
    })

    this.audioElement.addEventListener("timeupdate", () => {
      this.updateProgress()
    })

    this.audioElement.addEventListener("ended", () => {
      this.nextTrack()
    })

    this.audioElement.addEventListener("error", (e) => {
      console.log("Audio error:", e)
      this.showError("Errore nel caricamento del file audio")
    })
  }

  playTrack(trackPath, trackName, albumTitle, albumCover, trackElement) {
    document.querySelectorAll(".track-item.playing").forEach((item) => {
      item.classList.remove("playing")
    })

    if (trackElement) {
      trackElement.classList.add("playing")
    }

    document.getElementById("playerTitle").textContent = trackName
    document.getElementById("playerArtist").textContent = albumTitle
    document.getElementById("playerCover").src = albumCover

    this.audioElement.src = trackPath
    this.audioElement.load()

    this.audioElement
      .play()
      .then(() => {
        this.isPlaying = true
        this.updatePlayPauseButton()
      })
      .catch((error) => {
        console.log("Playback error:", error)
        this.showError("Impossibile riprodurre questa traccia")
      })

    this.currentTrack = trackElement
  }

  buildPlaylist(albumPlayer) {
    this.currentPlaylist = Array.from(albumPlayer.querySelectorAll(".track-item"))
    this.currentTrackIndex = this.currentPlaylist.indexOf(this.currentTrack)
  }

  togglePlayPause() {
    if (!this.audioElement.src) return

    if (this.isPlaying) {
      this.audioElement.pause()
      this.isPlaying = false
    } else {
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true
        })
        .catch((error) => {
          console.log("Playback error:", error)
          this.showError("Errore nella riproduzione")
        })
    }
    this.updatePlayPauseButton()
  }

  previousTrack() {
    if (this.currentPlaylist.length === 0) return

    this.currentTrackIndex = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : this.currentPlaylist.length - 1
    const prevTrack = this.currentPlaylist[this.currentTrackIndex]

    if (prevTrack) {
      prevTrack.click()
    }
  }

  nextTrack() {
    if (this.currentPlaylist.length === 0) return

    this.currentTrackIndex = this.currentTrackIndex < this.currentPlaylist.length - 1 ? this.currentTrackIndex + 1 : 0
    const nextTrack = this.currentPlaylist[this.currentTrackIndex]

    if (nextTrack) {
      nextTrack.click()
    }
  }

  updatePlayPauseButton() {
    const playPauseBtn = document.getElementById("playPauseBtn")
    playPauseBtn.textContent = this.isPlaying ? "⏸" : "▶"
  }

  updateProgress() {
    if (!this.audioElement.duration) return

    const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100
    document.getElementById("progressFill").style.width = progress + "%"

    const currentTime = this.formatTime(this.audioElement.currentTime)
    document.getElementById("currentTime").textContent = currentTime
  }

  updateTotalTime() {
    const totalTime = this.formatTime(this.audioElement.duration)
    document.getElementById("totalTime").textContent = totalTime
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00"

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  showError(message) {
    const errorDiv = document.createElement("div")
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #cd212a;
      color: white;
      padding: 15px 20px;
      border-radius: 4px;
      z-index: 9999;
      font-size: 14px;
      max-width: 300px;
    `
    errorDiv.textContent = message

    document.body.appendChild(errorDiv)

    setTimeout(() => {
      document.body.removeChild(errorDiv)
    }, 3000)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MusicPlayer()
})
