document.addEventListener("DOMContentLoaded", () => {
  // Crear estrellas
  createStars()

  // Configurar botón de jugar
  const playButton = document.getElementById("play-button")
  if (playButton) {
    playButton.addEventListener("click", startGame)
  }

  // Añadir efectos de sonido al pasar sobre botones
  const menuButtons = document.querySelectorAll(".menu-button")
  menuButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => playHoverSound())
    button.addEventListener("click", () => playClickSound())
  })
})

// Función para crear estrellas en el fondo
function createStars() {
  const starsContainer = document.getElementById("stars-container")
  if (!starsContainer) return

  const starCount = 150

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div")
    star.className = "star"

    // Tamaño aleatorio
    const size = Math.random() * 3 + 1
    star.style.width = `${size}px`
    star.style.height = `${size}px`

    // Posición aleatoria
    star.style.left = `${Math.random() * 100}%`
    star.style.top = `${Math.random() * 100}%`

    // Opacidad aleatoria
    star.style.opacity = Math.random().toString()

    // Añadir parpadeo a algunas estrellas
    if (Math.random() > 0.7) {
      star.style.animation = `twinkle ${2 + Math.random() * 4}s infinite alternate`
    }

    starsContainer.appendChild(star)
  }
}

// Función para iniciar el juego
function startGame() {
  // Efecto de transición
  const menuContainer = document.getElementById("menu-container")
  if (menuContainer) {
    menuContainer.style.animation = "fadeOut 1s forwards"
  }

  // Redirigir al juego después de la animación
  setTimeout(() => {
    // Redirigir al juego (index.html)
    window.location.href = "pages/ciberseguridad.html";
  }, 1000)
}

// Efectos de sonido
function playHoverSound() {
  // Aquí podrías implementar un sonido al pasar sobre botones
  // Por ejemplo, usando la API de Audio:
  // const hoverSound = new Audio('sounds/hover.mp3');
  // hoverSound.volume = 0.3;
  // hoverSound.play();
}

function playClickSound() {
  // Aquí podrías implementar un sonido al hacer clic
  // const clickSound = new Audio('sounds/click.mp3');
  // clickSound.volume = 0.5;
  // clickSound.play();
}

// Añadir animación de salida
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
