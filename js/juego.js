document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM - Agregamos verificación para evitar errores si no existen
  const gameContainer = document.getElementById("game-container")
  const planetBackground = document.getElementById("planet-background")
  const terrain = document.getElementById("terrain")
  const ship = document.getElementById("ship")
  const boss = document.getElementById("boss")
  const bossShield = boss ? boss.querySelector(".boss-shield") : null
  const bossHealthContainer = document.getElementById("boss-health-container")
  const bossHealthBar = document.getElementById("boss-health-bar")
  const bossName = document.getElementById("boss-name")
  const phaseDots = document.querySelectorAll(".phase-dot")
  const statusEl = document.getElementById("status")
  const shieldStatusEl = document.getElementById("shield-status")
  const shotCountEl = document.getElementById("shot-count")
  const speedEl = document.getElementById("speed")
  const scanBtn = document.getElementById("scan-btn")
  const fireBtn = document.getElementById("fire-btn")
  const boostBtn = document.getElementById("boost-btn")
  const shieldBtn = document.getElementById("shield-btn")
  const pauseBtn = document.getElementById("pause-btn")
  const alertMessage = document.getElementById("alert-message")
  const victoryMessage = document.getElementById("victory-message")
  const gameOverMessage = document.getElementById("game-over")
  const victoryRestartBtn = document.getElementById("victory-restart-btn")
  const gameoverRestartBtn = document.getElementById("gameover-restart-btn")
  const pauseMenu = document.getElementById("pause-menu")
  const resumeBtn = document.getElementById("resume-btn")
  const scoreEl = document.getElementById("score-value")
  const loadingScreen = document.getElementById("loading-screen")
  const loadingBar = document.getElementById("loading-bar-progress")
  const loadingText = document.getElementById("loading-text")
  const scoreboardBtn = document.getElementById("scoreboard-btn")
  const scoreboardContainer = document.getElementById("scoreboard-container")
  const scoreboardList = document.getElementById("scoreboard-list")
  const closeScoreboardBtn = document.getElementById("close-scoreboard-btn")

  // Elementos de la ventana de preguntas
  const questionContainer = document.getElementById("question-container")
  const questionTitle = document.getElementById("question-title")
  const questionText = document.getElementById("question-text")
  const answerOptions = document.getElementById("answer-options")
  const answerFeedback = document.getElementById("answer-feedback")
  const continueBtn = document.getElementById("continue-btn")

  // Elementos del formulario de puntuación
  const scoreForm = document.getElementById("score-form")
  const playerNameInput = document.getElementById("player-name")
  const saveScoreBtn = document.getElementById("save-score-btn")

  // Verificar que todos los elementos necesarios existen
  if (!gameContainer || !ship || !boss) {
    console.error("Elementos críticos del juego no encontrados")
    return // Detener la ejecución si faltan elementos críticos
  }

  // Variables del juego
  let shipX = 100
  let shipY = window.innerHeight / 2
  let shipSpeedX = 0
  let shipSpeedY = 0
  let shipRotation = 0
  let particles = []
  let lasers = []
  let bossLasers = []
  const platforms = []
  let securityBlocks = []
  const dataPoints = []
  const circuitLines = []
  let shotsFired = 0
  let shieldStrength = 100
  let isScanning = false
  let isBoosting = false
  const keys = {}
  let scrollX = 0
  const worldWidth = 5000
  let gamePaused = false
  let gameOver = false
  let currentQuestion = null
  let blockSpawnInterval = null
  let gameLoopRunning = false
  let currentScore = 0
  let gameStarted = false
  let loadingProgress = 0
  let loadingInterval = null

  // Variables del jefe
  let bossActive = false
  let bossX = 0
  let bossY = 0
  let bossHealth = 100
  const bossMaxHealth = 100
  let bossPhase = 1
  let bossShieldActive = false
  let bossAttackTimer = 0
  let bossSpecialAttackTimer = 0
  let bossMovementTimer = 0
  let bossMovementDirection = 1
  let bossDefeated = false

  // Configuración física
  const gravity = 0.2
  const acceleration = 0.3
  const boostAcceleration = 0.5
  const friction = 0.98
  const maxSpeedX = 8
  const maxSpeedY = 6
  const boostMaxSpeed = 12

  // Preguntas de ciberseguridad y temas relacionados
  const securityQuestions = [
    // 📡 Telecomunicaciones
    {
      question: "¿Qué establece la Ley 1341 de 2009 en Colombia?",
      options: [
        "Promover únicamente servicios de telefonía fija",
        "Garantizar exclusivamente el acceso a televisión abierta",
        "Definir principios y régimen de las telecomunicaciones",
        "Crear monopolios estatales en telecomunicaciones",
      ],
      correctAnswer: 2,
      category: "Telecomunicaciones",
    },
    {
      question: "¿Qué entidad regula las telecomunicaciones en Colombia?",
      options: [
        "Agencia Nacional de Espectro (ANE)",
        "Comisión de Regulación de Comunicaciones (CRC)",
        "Ministerio de Defensa",
        "Superintendencia de Servicios Públicos",
      ],
      correctAnswer: 1,
      category: "Telecomunicaciones",
    },
    {
      question: "¿Qué obligación tienen los proveedores de servicios de telecomunicaciones?",
      options: [
        "Limitar el acceso a zonas rurales",
        "Garantizar acceso universal y calidad del servicio",
        "Controlar la programación televisiva",
        "Promover redes privadas",
      ],
      correctAnswer: 1,
      category: "Telecomunicaciones",
    },
    {
      question: "¿Qué tratado internacional de telecomunicaciones ha firmado Colombia?",
      options: [
        "Tratado de Libre Comercio con China",
        "Tratado de Protección Satelital",
        "Convenio de la Unión Internacional de Telecomunicaciones (UIT)",
        "Pacto de Telecomunicaciones del MERCOSUR",
      ],
      correctAnswer: 2,
      category: "Telecomunicaciones",
    },

    // 🔒 Ciberseguridad
    {
      question: "¿Qué regula la Ley 1273 de 2009 en Colombia?",
      options: [
        "La protección ambiental",
        "Los delitos informáticos",
        "El comercio exterior",
        "La contratación estatal",
      ],
      correctAnswer: 1,
      category: "Ciberseguridad",
    },
    {
      question: "¿Qué es el COLCERT?",
      options: [
        "Una empresa privada de comunicaciones",
        "Equipo de Respuesta a Emergencias Cibernéticas de Colombia",
        "Una universidad especializada en informática",
        "Un programa de becas para ingenieros",
      ],
      correctAnswer: 1,
      category: "Ciberseguridad",
    },
    {
      question: "¿Qué busca el CONPES 3701 de 2011?",
      options: [
        "Reformar el código penal",
        "Fortalecer la democracia",
        "Definir la política de ciberseguridad y ciberdefensa",
        "Ampliar la cobertura educativa rural",
      ],
      correctAnswer: 2,
      category: "Ciberseguridad",
    },
    {
      question: "¿Qué tratado internacional sobre ciberseguridad aplica en Colombia?",
      options: [
        "Tratado de la Haya",
        "Convenio de Budapest sobre ciberdelito",
        "Pacto de Montreal",
        "Protocolo de Cartagena",
      ],
      correctAnswer: 1,
      category: "Ciberseguridad",
    },

    // ⚖️ Propiedad Intelectual
    {
      question: "¿Qué protege la Decisión 486 de la CAN?",
      options: [
        "El derecho a la vivienda",
        "La propiedad horizontal",
        "La propiedad industrial",
        "El derecho a la protesta",
      ],
      correctAnswer: 2,
      category: "Propiedad Intelectual",
    },
    {
      question: "¿Qué regula la Ley 23 de 1982 en Colombia?",
      options: ["Los derechos de autor", "Las pensiones", "La salud pública", "El comercio exterior"],
      correctAnswer: 0,
      category: "Propiedad Intelectual",
    },
    {
      question: "¿Qué tratado internacional protege patentes y marcas en Colombia?",
      options: ["Acuerdo de Schengen", "Tratado de Lisboa", "Convenio de París", "Pacto Andino de Derechos Humanos"],
      correctAnswer: 2,
      category: "Propiedad Intelectual",
    },
    {
      question: "¿Qué entidad colombiana protege los derechos de autor?",
      options: [
        "Superintendencia Financiera",
        "Dirección Nacional de Derecho de Autor (DNDA)",
        "Ministerio de Defensa",
        "Fiscalía General de la Nación",
      ],
      correctAnswer: 1,
      category: "Propiedad Intelectual",
    },

    // 🏛️ Decreto 4170 de 2011
    {
      question: "¿Qué institución se creó con el Decreto 4170 de 2011?",
      options: [
        "Departamento Administrativo de la Presidencia",
        "Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC)",
        "Agencia Nacional Minera",
        "Procuraduría Digital",
      ],
      correctAnswer: 1,
      category: "Decreto 4170",
    },
    {
      question: "¿Qué función asumió el MinTIC según el Decreto 4170?",
      options: [
        "Vigilar el transporte",
        "Coordinar las políticas TIC",
        "Controlar la energía",
        "Supervisar la educación pública",
      ],
      correctAnswer: 1,
      category: "Decreto 4170",
    },
    {
      question: "¿Qué pasó con Computadores para Educar según el Decreto 4170?",
      options: [
        "Fue disuelto",
        "Pasó a ser responsabilidad directa del MinTIC",
        "Se privatizó completamente",
        "Cambió su nombre a Tecnoeducar",
      ],
      correctAnswer: 1,
      category: "Decreto 4170",
    },

    // 🛒 Comercio Electrónico
    {
      question: "¿Qué regula la Ley 527 de 1999?",
      options: [
        "La venta de medicamentos",
        "El comercio electrónico y los mensajes de datos",
        "El acceso a la vivienda",
        "La actividad minera",
      ],
      correctAnswer: 1,
      category: "Comercio Electrónico",
    },
    {
      question: "¿Qué se reconoce como válido jurídicamente según la Ley 527 de 1999?",
      options: [
        "Solo los documentos en papel",
        "Los mensajes de datos y firmas digitales",
        "Los correos físicos únicamente",
        "Las comunicaciones verbales",
      ],
      correctAnswer: 1,
      category: "Comercio Electrónico",
    },
    {
      question: "¿Qué modelo internacional sigue Colombia para regular comercio electrónico?",
      options: [
        "Tratado de Versalles",
        "Ley Modelo de la CNUDMI sobre Comercio Electrónico",
        "Protocolo de Madrid",
        "Carta de Bogotá",
      ],
      correctAnswer: 1,
      category: "Comercio Electrónico",
    },

    // 🛡️ Protección de Datos
    {
      question: "¿Qué establece la Ley 1581 de 2012?",
      options: [
        "Protección de la biodiversidad",
        "Protección de datos personales",
        "Fiscalización minera",
        "Control aduanero",
      ],
      correctAnswer: 1,
      category: "Protección de Datos",
    },
    {
      question: "¿Qué entidad vigila la protección de datos en Colombia?",
      options: [
        "Agencia Nacional de Hidrocarburos",
        "Superintendencia Financiera",
        "Superintendencia de Industria y Comercio",
        "Procuraduría General",
      ],
      correctAnswer: 2,
      category: "Protección de Datos",
    },
    {
      question: "¿Qué derecho garantiza el Habeas Data?",
      options: [
        "Derecho al trabajo",
        "Derecho a la educación",
        "Derecho a conocer, actualizar y rectificar la información personal",
        "Derecho a voto",
      ],
      correctAnswer: 2,
      category: "Protección de Datos",
    },
    {
      question: "¿Qué deben implementar las empresas que manejan datos personales?",
      options: [
        "Un buzón físico de sugerencias",
        "Medidas de seguridad para proteger los datos",
        "Publicidad masiva",
        "Auditorías de ventas",
      ],
      correctAnswer: 1,
      category: "Protección de Datos",
    },
  ]

  // Función para limpiar elementos del DOM
  function clearElements(selector) {
    document.querySelectorAll(selector).forEach((el) => el.remove())
  }

  // Función para crear estrellas en el fondo
  function createStars() {
    if (!planetBackground) return

    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div")
      star.className = "star"
      if (Math.random() > 0.7) star.classList.add("twinkle")
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 70}%`
      star.style.opacity = Math.random().toString()
      star.style.width = `${Math.random() * 3 + 1}px`
      star.style.height = star.style.width
      planetBackground.appendChild(star)
    }
  }

  // Función para crear nubes
  function createClouds() {
    if (!planetBackground) return

    for (let i = 0; i < 4; i++) createSingleCloud(300, 150, 0.2, 60)
    for (let i = 0; i < 6; i++) createSingleCloud(200, 100, 0.15, 40)
    for (let i = 0; i < 8; i++) createSingleCloud(120, 60, 0.1, 30)
  }

  function createSingleCloud(width, height, opacity, duration) {
    if (!planetBackground) return

    const cloud = document.createElement("div")
    cloud.className = "cloud"
    cloud.style.width = `${width}px`
    cloud.style.height = `${height}px`
    cloud.style.left = `${Math.random() * worldWidth}px`
    cloud.style.top = `${10 + Math.random() * 40}%`
    cloud.style.opacity = opacity.toString()
    cloud.style.animationDuration = `${duration + Math.random() * 20}s`
    cloud.style.animationDelay = `${Math.random() * 10}s`
    planetBackground.appendChild(cloud)
  }

  // Función para crear terreno
  function createTerrain() {
    if (!terrain) return

    for (let i = 0; i < 10; i++) {
      const mountain = document.createElement("div")
      mountain.className = "mountain"
      const height = 100 + Math.random() * 150
      const width = 100 + Math.random() * 200
      mountain.style.left = `${i * 500 + Math.random() * 200}px`
      mountain.style.borderWidth = `0 ${width / 2}px ${height}px ${width / 2}px`
      mountain.style.borderColor = "transparent transparent #2a1a6c transparent"
      mountain.style.animationDelay = `${Math.random() * 4}s`
      terrain.appendChild(mountain)
    }
  }

  // Función para crear plataformas
  function createPlatforms() {
    if (!gameContainer) return

    const heights = [window.innerHeight * 0.7, window.innerHeight * 0.5, window.innerHeight * 0.3]
    for (let i = 0; i < 15; i++) {
      const platform = document.createElement("div")
      platform.className = "platform"
      const width = 100 + Math.random() * 200
      const posX = i * 350 + Math.random() * 100
      const posY = heights[Math.floor(Math.random() * heights.length)]
      platform.style.width = `${width}px`
      platform.style.height = "20px"
      platform.style.left = `${posX}px`
      platform.style.top = `${posY}px`
      gameContainer.appendChild(platform)
      platforms.push({ element: platform, x: posX, y: posY, width, height: 20 })
    }
  }

  // Función para generar bloques de seguridad
  function spawnSecurityBlocks() {
    for (let i = 0; i < 5; i++) createSecurityBlock()

    // Limpiar intervalo anterior si existe
    if (blockSpawnInterval) clearInterval(blockSpawnInterval)

    blockSpawnInterval = setInterval(() => {
      if (securityBlocks.length < 10 && !gamePaused && !bossActive && !gameOver) {
        createSecurityBlock()
      }
    }, 3000)
  }

  function createSecurityBlock() {
    if (!gameContainer) return

    const block = document.createElement("div")
    block.className = "security-block"
    const isAggressive = Math.random() < 0.3
    if (isAggressive) block.classList.add("aggressive")
    const posX = shipX + window.innerWidth + Math.random() * 500
    const posY = 100 + Math.random() * (window.innerHeight - 200)
    block.textContent = "?"
    block.style.left = `${posX}px`
    block.style.top = `${posY}px`
    gameContainer.appendChild(block)

    const baseSpeed = isAggressive ? 4 : 2
    securityBlocks.push({
      element: block,
      x: posX,
      y: posY,
      width: 60,
      height: 60,
      vx: -baseSpeed - Math.random() * 2,
      vy: (Math.random() - 0.5) * 2,
      isAggressive,
      chargeTimer: 0,
      isCharging: false,
    })
  }

  // Función para crear elementos de circuito
  function createCircuitElements() {
    if (!terrain || !gameContainer) return

    for (let i = 0; i < 20; i++) {
      const line = document.createElement("div")
      line.className = "circuit-line"
      const width = Math.random() * 100 + 50
      const posX = i * 250 + Math.random() * 100
      const posY = window.innerHeight - 20 - Math.random() * 10
      line.style.width = `${width}px`
      line.style.height = "2px"
      line.style.left = `${posX}px`
      line.style.top = `${posY}px`
      line.style.animationDelay = `${Math.random() * 4}s`
      terrain.appendChild(line)
      circuitLines.push({ element: line, x: posX, y: posY })
    }

    for (let i = 0; i < 15; i++) {
      const point = document.createElement("div")
      point.className = "data-point"
      const posX = i * 330 + Math.random() * 200
      const posY = 100 + Math.random() * (window.innerHeight - 200)
      point.style.left = `${posX}px`
      point.style.top = `${posY}px`
      point.style.animationDelay = `${Math.random() * 2}s`
      gameContainer.appendChild(point)
      dataPoints.push({ element: point, x: posX, y: posY })
    }
  }

  // Función para crear partículas de propulsión
  function createParticle() {
    if (!gameContainer) return

    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = `${shipX - 20}px`
    particle.style.top = `${shipY}px`
    gameContainer.appendChild(particle)
    particles.push({
      element: particle,
      x: shipX - 20,
      y: shipY,
      vx: -2 - Math.random() * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 20,
    })
  }

  // Función para crear explosiones
  function createExplosion(x, y, size = 50) {
    if (!gameContainer) return

    const explosion = document.createElement("div")
    explosion.className = "explosion"
    explosion.style.width = `${size}px`
    explosion.style.height = `${size}px`
    explosion.style.left = `${x - size / 2 - scrollX}px`
    explosion.style.top = `${y - size / 2}px`
    gameContainer.appendChild(explosion)

    // Crear partículas de explosión
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "explosion-particle"
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 5
      const particleSize = 5 + Math.random() * 10
      particle.style.left = `${x - scrollX}px`
      particle.style.top = `${y}px`
      particle.style.width = `${particleSize}px`
      particle.style.height = `${particleSize}px`
      particle.style.background = `hsl(${Math.random() * 60}, 100%, 50%)`
      gameContainer.appendChild(particle)

      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed
      let particleX = x
      let particleY = y

      const animateParticle = () => {
        particleX += vx
        particleY += vy
        particle.style.left = `${particleX - scrollX}px`
        particle.style.top = `${particleY}px`

        // Corregir el manejo de opacidad
        const currentOpacity = Number.parseFloat(particle.style.opacity || "1")
        particle.style.opacity = (currentOpacity - 0.02).toString()

        if (Number.parseFloat(particle.style.opacity) > 0) {
          requestAnimationFrame(animateParticle)
        } else {
          particle.remove()
        }
      }
      animateParticle()
    }

    setTimeout(() => explosion.remove(), 1000)
  }

  // Función para la explosión de la nave
  function createShipExplosion() {
    if (!ship || !gameOverMessage) return

    createExplosion(shipX, shipY, 100)
    ship.style.display = "none"
    setTimeout(() => {
      gameOverMessage.style.display = "block"
      if (scoreForm) scoreForm.style.display = "block"
    }, 1500)
  }

  // Función para la explosión del jefe
  function createBossExplosion() {
    if (!boss) return

    createExplosion(bossX, bossY, 150)
    boss.style.display = "none"
  }

  // Función para disparar láser
  function fireLaser() {
    if (gamePaused || gameOver || !gameContainer) return

    const laser = document.createElement("div")
    laser.className = "laser"
    laser.style.left = `${shipX + 35}px`
    laser.style.top = `${shipY + 17}px`
    gameContainer.appendChild(laser)
    lasers.push({ element: laser, x: shipX + 35, y: shipY + 17, vx: 15 })
    shotsFired++
    if (shotCountEl) shotCountEl.textContent = shotsFired.toString()
  }

  // Función para actualizar partículas
  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.life--
      p.x += p.vx
      p.y += p.vy
      p.element.style.left = `${p.x - scrollX}px`
      p.element.style.top = `${p.y}px`
      p.element.style.opacity = (p.life / 20).toString()
      if (p.life <= 0) {
        p.element.remove()
        particles.splice(i, 1)
      }
    }
  }

  // Función para actualizar láseres
  function updateLasers() {
    for (let i = lasers.length - 1; i >= 0; i--) {
      const laser = lasers[i]
      laser.x += laser.vx
      laser.element.style.left = `${laser.x - scrollX}px`

      // Eliminar láseres fuera de pantalla
      if (laser.x < scrollX || laser.x > scrollX + window.innerWidth) {
        laser.element.remove()
        lasers.splice(i, 1)
        continue
      }

      // Colisión con el jefe
      if (bossActive && !bossDefeated) {
        if (
          laser.x + 15 > bossX - 100 &&
          laser.x - 15 < bossX + 100 &&
          laser.y + 3 > bossY - 100 &&
          laser.y - 3 < bossY + 100
        ) {
          createImpact(laser.x, laser.y)
          laser.element.remove()
          lasers.splice(i, 1)

          if (!bossShieldActive) {
            damageBoss(10)
            addScore(50) // Añadir puntos por dañar al jefe
          } else if (bossShield) {
            bossShield.style.opacity = "0.7"
            setTimeout(() => {
              if (bossShield) bossShield.style.opacity = ""
            }, 200)
          }
          continue
        }
      }

      // Colisión con bloques de seguridad
      for (let j = securityBlocks.length - 1; j >= 0; j--) {
        const block = securityBlocks[j]
        if (
          laser.x + 15 > block.x - 30 &&
          laser.x - 15 < block.x + 30 &&
          laser.y + 3 > block.y - 30 &&
          laser.y - 3 < block.y + 30
        ) {
          createImpact(laser.x, laser.y)
          laser.element.remove()
          lasers.splice(i, 1)
          block.element.remove()
          securityBlocks.splice(j, 1)
          addScore(10) // Añadir puntos por destruir bloque
          break
        }
      }
    }
  }

  // Función para crear efecto de impacto
  function createImpact(x, y) {
    if (!gameContainer) return

    const impact = document.createElement("div")
    impact.className = "impact"
    impact.style.left = `${x - scrollX - 10}px`
    impact.style.top = `${y - 10}px`
    gameContainer.appendChild(impact)
    setTimeout(() => impact.remove(), 500)
  }

  // Función para actualizar la nave
  function updateShip() {
    if (gamePaused || gameOver || !ship) return

    // Aplicar gravedad si no está en plataforma
    if (!checkPlatformCollisions()) {
      shipSpeedY += gravity
    }

    // Controles
    if (keys["ArrowUp"] || keys["w"]) shipSpeedY -= acceleration
    if (keys["ArrowRight"] || keys["d"]) {
      shipSpeedX += acceleration
      shipRotation = 0
    }
    if (keys["ArrowLeft"] || keys["a"]) {
      shipSpeedX -= acceleration
      shipRotation = 180
    }

    // Impulso adicional si está activo
    if (isBoosting) {
      if (keys["ArrowRight"] || keys["d"]) shipSpeedX += boostAcceleration
      else if (keys["ArrowLeft"] || keys["a"]) shipSpeedX -= boostAcceleration
    }

    // Aplicar fricción y limitar velocidad
    shipSpeedX *= friction
    shipSpeedY *= friction
    const maxSpeed = isBoosting ? boostMaxSpeed : maxSpeedX
    shipSpeedX = Math.max(-maxSpeed, Math.min(maxSpeed, shipSpeedX))
    shipSpeedY = Math.max(-maxSpeedY, Math.min(maxSpeedY, shipSpeedY))

    // Actualizar posición
    shipX += shipSpeedX
    shipY += shipSpeedY

    // Limitar posición dentro de los bordes
    shipY = Math.max(20, Math.min(window.innerHeight - 40, shipY))
    shipX = Math.max(35, Math.min(worldWidth - 35, shipX))

    // Comprobar colisiones
    checkSecurityBlockCollisions()
    checkBossLaserCollisions()

    // Actualizar scroll y posición visual
    updateScroll()
    ship.style.left = `${shipX - scrollX - 35}px`
    ship.style.top = `${shipY - 20}px`
    ship.style.transform = `scaleX(${shipRotation === 0 ? 1 : -1})`

    // Crear partículas de propulsión
    if (Math.random() > 0.7 || isBoosting) {
      createParticle()
    }

    // Actualizar velocidad en UI
    const speed = Math.sqrt(shipSpeedX ** 2 + shipSpeedY ** 2)
    if (speedEl) speedEl.textContent = Math.round(speed * 10).toString()

    // Activar jefe si se acerca
    if (!bossActive && shipX > 2000) {
      activateBoss()
    }
  }

  // Función para comprobar colisiones con plataformas
  function checkPlatformCollisions() {
    let onPlatform = false
    for (const platform of platforms) {
      if (
        shipX + 20 > platform.x &&
        shipX - 20 < platform.x + platform.width &&
        shipY + 20 > platform.y - 5 &&
        shipY + 20 < platform.y + 10 &&
        shipSpeedY > 0
      ) {
        shipY = platform.y - 20
        shipSpeedY = 0
        onPlatform = true
        break
      }
    }
    return onPlatform
  }

  // Función para comprobar colisiones con bloques de seguridad
  function checkSecurityBlockCollisions() {
    if (gameOver) return

    for (let i = securityBlocks.length - 1; i >= 0; i--) {
      const block = securityBlocks[i]
      if (
        shipX + 30 > block.x - 30 &&
        shipX - 30 < block.x + 30 &&
        shipY + 20 > block.y - 30 &&
        shipY - 20 < block.y + 30
      ) {
        block.element.remove()
        securityBlocks.splice(i, 1)
        showSecurityQuestion()
        break
      }
    }
  }

  // Función para mostrar pregunta de seguridad
  function showSecurityQuestion() {
    if (!questionContainer || !questionText || !answerOptions) return

    gamePaused = true
    let answered = false

    const question = securityQuestions[Math.floor(Math.random() * securityQuestions.length)]
    currentQuestion = question

    // Actualizar el título para mostrar la categoría
    if (questionTitle) {
      questionTitle.textContent = `DESAFÍO: ${question.category || "CIBERSEGURIDAD"}`
    }

    questionText.textContent = question.question
    answerOptions.innerHTML = ""

    // Crear opciones de respuesta
    question.options.forEach((option, i) => {
      const opt = document.createElement("div")
      opt.className = "answer-option"
      opt.textContent = option
      opt.dataset.index = i.toString()
      opt.addEventListener("click", function () {
        answered = true
        checkAnswer(Number.parseInt(this.dataset.index))
      })
      answerOptions.appendChild(opt)
    })

    if (answerFeedback) answerFeedback.textContent = ""
    questionContainer.style.display = "block"

    // Configurar botón continuar
    if (continueBtn) {
      continueBtn.style.display = "block"
      continueBtn.onclick = () => {
        if (!answered && answerFeedback) {
          answerFeedback.textContent = "¡No respondiste! Pierdes escudo."
          answerFeedback.style.color = "#ff0044"
          shieldStrength = Math.max(0, shieldStrength - 20)
          if (shieldStatusEl) shieldStatusEl.textContent = `${shieldStrength}%`
          if (shieldStrength <= 0) gameOver = true
        }
        continueGame()
      }
    }
  }

  // Función para comprobar respuesta
  function checkAnswer(selectedIndex) {
    if (!currentQuestion || !answerFeedback) return

    const options = document.querySelectorAll(".answer-option")
    options.forEach((opt) => {
      if (opt) opt.style.pointerEvents = "none"
    })

    if (options[currentQuestion.correctAnswer]) {
      options[currentQuestion.correctAnswer].classList.add("correct")
    }

    if (selectedIndex !== currentQuestion.correctAnswer) {
      if (options[selectedIndex]) options[selectedIndex].classList.add("incorrect")
      answerFeedback.textContent = "¡Incorrecto! Pierdes escudo."
      answerFeedback.style.color = "#ff0044"
      shieldStrength = Math.max(0, shieldStrength - 20)
      if (shieldStatusEl) shieldStatusEl.textContent = `${shieldStrength}%`
      if (shieldStrength <= 0) gameOver = true
    } else {
      answerFeedback.textContent = "¡Correcto! Tu conocimiento te protege."
      answerFeedback.style.color = "#00ffff"
      addScore(100) // Añadir puntos por respuesta correcta
    }

    if (continueBtn) continueBtn.style.display = "block"
  }

  // Función para continuar después de pregunta
  function continueGame() {
    if (!questionContainer) return

    questionContainer.style.display = "none"
    if (!gameOver) {
      gamePaused = false
    } else {
      createShipExplosion()
    }
  }

  // Función para activar impulso
  function activateBoost() {
    if (isBoosting || gamePaused || gameOver || !boostBtn) return

    isBoosting = true
    boostBtn.style.background = "rgba(255, 94, 98, 0.8)"
    setTimeout(() => {
      isBoosting = false
      if (boostBtn) boostBtn.style.background = "#3a2a7c"
    }, 3000)
  }

  // Función para reforzar escudo
  function reinforceShield() {
    if (shieldStrength >= 100 || gamePaused || gameOver || !shieldStatusEl) return

    shieldStrength = Math.min(100, shieldStrength + 25)
    shieldStatusEl.textContent = `${shieldStrength}%`
  }

  // Función para escanear amenazas
  function scanForThreats() {
    if (isScanning || bossActive || gamePaused || gameOver || !statusEl || !alertMessage) return

    isScanning = true
    statusEl.textContent = "ESCANEANDO..."
    statusEl.style.color = "#ffcc00"

    setTimeout(() => {
      if (shipX > 1500) {
        alertMessage.textContent = "¡ALERTA! JEFE DETECTADO ADELANTE"
        statusEl.textContent = "¡PELIGRO!"
        statusEl.style.color = "#ff0044"
      } else {
        const nearby = securityBlocks.filter((b) => Math.abs(b.x - shipX) < window.innerWidth).length
        if (nearby > 0) {
          alertMessage.textContent = `¡ALERTA! ${nearby} DESAFÍOS DE SEGURIDAD DETECTADOS`
          statusEl.textContent = "¡PRECAUCIÓN!"
          statusEl.style.color = "#ffcc00"
        } else {
          statusEl.textContent = "SEGURO"
          statusEl.style.color = "#00ffff"
        }
      }

      alertMessage.style.display = "block"
      setTimeout(() => {
        if (alertMessage) alertMessage.style.display = "none"
      }, 3000)
      isScanning = false
    }, 2000)
  }

  // Función para activar al jefe
  function activateBoss() {
    if (!boss || !bossName || !bossHealthContainer || !alertMessage || !statusEl) return

    bossActive = true
    bossX = shipX + 500
    bossY = window.innerHeight / 2
    boss.style.display = "block"
    boss.style.animation = "bossEntrance 2s forwards"
    bossName.style.display = "block"
    bossHealthContainer.style.display = "block"

    alertMessage.textContent = "¡ALERTA! JEFE DETECTADO"
    alertMessage.style.display = "block"
    setTimeout(() => {
      if (alertMessage) alertMessage.style.display = "none"
    }, 3000)

    statusEl.textContent = "¡PELIGRO!"
    statusEl.style.color = "#ff0044"
  }

  // Función para actualizar al jefe
  function updateBoss() {
    if (!bossActive || bossDefeated || gamePaused || gameOver || !boss) return

    // Movimiento
    const targetX = shipX + 400
    const followSpeed = [0.02, 0.03, 0.04][bossPhase - 1]
    bossX += (targetX - bossX) * followSpeed

    bossMovementTimer += 0.02
    if (Math.random() > 0.995) bossMovementDirection *= -1

    const amplitude = [1, 1.5, 2][bossPhase - 1]
    const speed = [1, 1.5, 2][bossPhase - 1]
    const targetY =
      window.innerHeight / 2 + Math.sin(bossMovementTimer * speed) * 100 * amplitude * bossMovementDirection
    bossY += (targetY - bossY) * 0.05
    bossY = Math.max(100, Math.min(window.innerHeight - 100, bossY))

    // Ataques
    bossAttackTimer++
    bossSpecialAttackTimer++

    const attackInterval = [120, 90, 60][bossPhase - 1]
    const specialInterval = [300, 240, 180][bossPhase - 1]

    if (bossAttackTimer >= attackInterval) {
      bossAttackTimer = 0
      if (bossPhase === 1) bossSingleShot()
      else if (bossPhase === 2) Math.random() > 0.5 ? bossDoubleShot() : bossSingleShot()
      else if (bossPhase === 3) {
        if (Math.random() > 0.7) bossQuadShot()
        else if (Math.random() > 0.4) bossDoubleShot()
        else bossSingleShot()
      }
    }

    if (bossSpecialAttackTimer >= specialInterval) {
      bossSpecialAttackTimer = 0
      if (bossPhase === 2) bossZigzagAttack()
      else if (bossPhase === 3) Math.random() > 0.5 ? bossHomingAttack() : bossSpiralAttack()
    }

    boss.style.left = `${bossX - scrollX - 100}px`
    boss.style.top = `${bossY - 100}px`
  }

  // Ataques del jefe
  function bossSingleShot() {
    createBossLaser(bossX - 100, bossY, -8, 0, 40, 8)
  }

  function bossDoubleShot() {
    createBossLaser(bossX - 100, bossY - 30, -8, -1, 40, 8)
    createBossLaser(bossX - 100, bossY + 30, -8, 1, 40, 8)
  }

  function bossQuadShot() {
    createBossLaser(bossX - 100, bossY - 50, -8, -2, 40, 8)
    createBossLaser(bossX - 100, bossY - 20, -8, -0.5, 40, 8)
    createBossLaser(bossX - 100, bossY + 20, -8, 0.5, 40, 8)
    createBossLaser(bossX - 100, bossY + 50, -8, 2, 40, 8)
  }

  function bossZigzagAttack() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (!gamePaused && bossActive && !bossDefeated && !gameOver) {
          const laser = createBossLaser(bossX - 100, bossY, -6, 0, 40, 8, "phase2")
          if (laser) {
            laser.zigzag = true
            laser.zigzagTimer = 0
            laser.zigzagDirection = 1
          }
        }
      }, i * 200)
    }
  }

  function bossHomingAttack() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!gamePaused && bossActive && !bossDefeated && !gameOver) {
          const laser = createBossLaser(bossX - 100, bossY, -4, 0, 20, 20, "homing")
          if (laser) laser.homing = true
        }
      }, i * 300)
    }
  }

  function bossSpiralAttack() {
    const num = 12
    const step = (Math.PI * 2) / num
    for (let i = 0; i < num; i++) {
      setTimeout(() => {
        if (!gamePaused && bossActive && !bossDefeated && !gameOver) {
          const angle = i * step
          createBossLaser(bossX, bossY, Math.cos(angle) * 5, Math.sin(angle) * 5, 30, 8, "phase3")
        }
      }, i * 100)
    }
  }

  // Función para crear láser del jefe
  function createBossLaser(x, y, vx, vy, width, height, type = "") {
    if (!gameContainer) return null

    const laser = document.createElement("div")
    laser.className = `boss-laser ${type}`
    laser.style.width = `${width}px`
    laser.style.height = `${height}px`
    laser.style.left = `${x - scrollX - width / 2}px`
    laser.style.top = `${y - height / 2}px`
    gameContainer.appendChild(laser)

    const laserObj = {
      element: laser,
      x,
      y,
      vx,
      vy,
      width,
      height,
      type,
      zigzag: false,
      zigzagTimer: 0,
      zigzagDirection: 1,
      homing: false,
    }

    bossLasers.push(laserObj)
    return laserObj
  }

  // Función para actualizar láseres del jefe
  function updateBossLasers() {
    if (gamePaused || gameOver) return

    for (let i = bossLasers.length - 1; i >= 0; i--) {
      const laser = bossLasers[i]

      // Comportamiento especial
      if (laser.zigzag) {
        laser.zigzagTimer += 0.1
        laser.vy = Math.sin(laser.zigzagTimer) * 3 * laser.zigzagDirection
      }

      if (laser.homing) {
        const dx = shipX - laser.x
        const dy = shipY - laser.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0) {
          laser.vx += (dx / dist) * 0.2
          laser.vy += (dy / dist) * 0.2
          const speed = Math.sqrt(laser.vx ** 2 + laser.vy ** 2)
          if (speed > 6) {
            laser.vx = (laser.vx / speed) * 6
            laser.vy = (laser.vy / speed) * 6
          }
        }
      }

      // Actualizar posición
      laser.x += laser.vx
      laser.y += laser.vy
      laser.element.style.left = `${laser.x - scrollX - laser.width / 2}px`
      laser.element.style.top = `${laser.y - laser.height / 2}px`

      // Eliminar si sale de pantalla
      if (
        laser.x < scrollX - 100 ||
        laser.x > scrollX + window.innerWidth + 100 ||
        laser.y < -50 ||
        laser.y > window.innerHeight + 50
      ) {
        laser.element.remove()
        bossLasers.splice(i, 1)
      }
    }
  }

  // Función para comprobar colisión con láseres del jefe
  function checkBossLaserCollisions() {
    if (gameOver || !ship) return

    const shipRect = {
      left: shipX - 35,
      right: shipX + 35,
      top: shipY - 20,
      bottom: shipY + 20,
    }

    for (let i = bossLasers.length - 1; i >= 0; i--) {
      const laser = bossLasers[i]
      const laserRect = {
        left: laser.x - laser.width / 2,
        right: laser.x + laser.width / 2,
        top: laser.y - laser.height / 2,
        bottom: laser.y + laser.height / 2,
      }

      if (
        laserRect.left < shipRect.right &&
        laserRect.right > shipRect.left &&
        laserRect.top < shipRect.bottom &&
        laserRect.bottom > shipRect.top
      ) {
        createImpact(shipX, shipY)
        laser.element.remove()
        bossLasers.splice(i, 1)

        const damage =
          {
            "": 15,
            phase2: 20,
            phase3: 25,
            homing: 30,
          }[laser.type] || 15

        shieldStrength = Math.max(0, shieldStrength - damage)
        if (shieldStatusEl) shieldStatusEl.textContent = `${shieldStrength}%`

        if (shieldStrength <= 0) {
          gameOver = true
          createShipExplosion()
        } else {
          ship.style.filter = "brightness(3)"
          setTimeout(() => {
            if (ship) ship.style.filter = ""
          }, 200)
        }
      }
    }
  }

  // Función para dañar al jefe
  function damageBoss(damage) {
    if (!boss) return

    bossHealth -= damage
    updateBossHealthBar()

    // Efecto visual de daño
    boss.style.animation = "bossDamage 0.3s"
    setTimeout(() => {
      if (boss) boss.style.animation = ""
    }, 300)

    if (bossHealth <= 0) {
      defeatBoss()
    } else {
      checkBossPhase()
    }
  }

  // Función para actualizar barra de vida del jefe
  function updateBossHealthBar() {
    if (!bossHealthBar) return

    const percent = Math.max(0, (bossHealth / bossMaxHealth) * 100)
    bossHealthBar.style.width = `${percent}%`

    // Cambiar color según vida
    if (percent < 30) {
      bossHealthBar.style.background = "linear-gradient(to right, #ff0000, #ff3333)"
    } else if (percent < 60) {
      bossHealthBar.style.background = "linear-gradient(to right, #ff3300, #ff6633)"
    }
  }

  // Función para comprobar cambio de fase del jefe
  function checkBossPhase() {
    const percent = (bossHealth / bossMaxHealth) * 100

    if (percent <= 60 && bossPhase === 1) {
      bossPhase = 2
      changeBossPhase(2)
    } else if (percent <= 30 && bossPhase === 2) {
      bossPhase = 3
      changeBossPhase(3)
    }
  }

  // Función para cambiar fase del jefe
  function changeBossPhase(phase) {
    // Actualizar indicadores visuales
    phaseDots.forEach((dot, i) => {
      if (dot) dot.classList.toggle("active", i === phase - 1)
    })

    // Efecto visual
    if (boss) {
      boss.style.animation = "bossPhaseChange 1s"
      setTimeout(() => {
        if (boss) boss.style.animation = ""
      }, 1000)
    }

    // Activar escudo temporal
    activateBossShield()

    // Mensaje según fase
    if (alertMessage) {
      if (phase === 2) {
        alertMessage.textContent = "¡ALERTA! FASE 2 ACTIVADA - NUEVOS PATRONES DE ATAQUE"
        // Generar más bloques de seguridad
        for (let i = 0; i < 3; i++) createSecurityBlock()
      } else if (phase === 3) {
        alertMessage.textContent = "¡PELIGRO! FASE FINAL - ATAQUES LETALES DETECTADOS"
        // Generar más bloques de seguridad
        for (let i = 0; i < 5; i++) createSecurityBlock()
      }

      alertMessage.style.display = "block"
      setTimeout(() => {
        if (alertMessage) alertMessage.style.display = "none"
      }, 3000)
    }
  }

  // Función para activar escudo del jefe
  function activateBossShield() {
    if (!bossShield) return

    bossShieldActive = true
    bossShield.style.opacity = "0.7"
    setTimeout(() => {
      bossShieldActive = false
      if (bossShield) bossShield.style.opacity = ""
    }, 3000)
  }

  // Función para derrotar al jefe
  function defeatBoss() {
    if (!boss || !victoryMessage || !statusEl) return

    bossDefeated = true
    createBossExplosion()
    addScore(1000) // Añadir puntos por derrotar al jefe

    setTimeout(() => {
      victoryMessage.style.display = "block"
      if (scoreForm) scoreForm.style.display = "block"
      statusEl.textContent = "SEGURO"
      statusEl.style.color = "#00ffff"

      // Ocultar UI del jefe
      setTimeout(() => {
        if (bossHealthContainer) bossHealthContainer.style.display = "none"
        if (bossName) bossName.style.display = "none"
      }, 2000)
    }, 1500)
  }

  // Función para actualizar scroll
  function updateScroll() {
    if (!terrain || !planetBackground) return

    const target = shipX - window.innerWidth / 3
    scrollX += (target - scrollX) * 0.1
    scrollX = Math.max(0, Math.min(worldWidth - window.innerWidth, scrollX))

    terrain.style.transform = `translateX(${-scrollX}px)`
    planetBackground.style.transform = `translateX(${-scrollX * 0.5}px)`

    // Actualizar posición de plataformas y puntos de datos
    platforms.forEach((p) => {
      if (p.element) p.element.style.left = `${p.x - scrollX}px`
    })
    dataPoints.forEach((p) => {
      if (p.element) p.element.style.left = `${p.x - scrollX}px`
    })
  }

  // Función para actualizar bloques de seguridad
  function updateSecurityBlocks() {
    for (let i = securityBlocks.length - 1; i >= 0; i--) {
      const block = securityBlocks[i]

      // Comportamiento según tipo
      const dx = shipX - block.x
      const dy = shipY - block.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (block.isAggressive && dist < 600) {
        // Perseguir más agresivamente
        block.vx += (dx / dist) * 0.1
        block.vy += (dy / dist) * 0.1

        // Ataque de carga
        block.chargeTimer++
        if (block.chargeTimer > 120 && !block.isCharging && Math.random() > 0.7) {
          block.isCharging = true
          block.vx += (dx / dist) * 5
          block.vy += (dy / dist) * 5
          block.element.style.transform = "scale(1.2)"
          setTimeout(() => {
            if (block.element && block.element.parentNode) {
              block.element.style.transform = ""
              block.isCharging = false
              block.chargeTimer = 0
            }
          }, 1000)
        }
      } else if (!block.isAggressive && dist < 400) {
        // Perseguir normalmente
        block.vx += (dx / dist) * 0.05
        block.vy += (dy / dist) * 0.05
      }

      // Limitar velocidad
      const maxSpeed = block.isAggressive ? 6 : 4
      const speed = Math.sqrt(block.vx ** 2 + block.vy ** 2)
      if (speed > maxSpeed) {
        block.vx = (block.vx / speed) * maxSpeed
        block.vy = (block.vy / speed) * maxSpeed
      }

      // Actualizar posición
      block.x += block.vx
      block.y += block.vy
      block.y = Math.max(30, Math.min(window.innerHeight - 30, block.y))
      block.element.style.left = `${block.x - scrollX - 30}px`
      block.element.style.top = `${block.y - 30}px`

      // Eliminar si sale de pantalla
      if (block.x < scrollX - 100) {
        block.element.remove()
        securityBlocks.splice(i, 1)
      }
    }
  }

  // Función para pausar/reanudar el juego
  function togglePause() {
    if (questionContainer && questionContainer.style.display === "block") return // No pausar durante preguntas

    gamePaused = !gamePaused
    if (gamePaused) {
      if (pauseMenu) pauseMenu.style.display = "flex"
      if (statusEl) {
        statusEl.textContent = "PAUSADO"
        statusEl.style.color = "#ffff00"
      }
    } else {
      if (pauseMenu) pauseMenu.style.display = "none"
      if (statusEl) {
        statusEl.textContent = bossActive ? "¡PELIGRO!" : "SEGURO"
        statusEl.style.color = bossActive ? "#ff0044" : "#00ffff"
      }
    }
  }

  // Función para añadir puntuación
  function addScore(points) {
    currentScore += points
    if (scoreEl) scoreEl.textContent = currentScore.toString()
  }

  // Función para guardar puntuación
  function saveScore(playerName) {
    if (!playerName) return

    const scores = getScores()
    scores.push({ name: playerName, score: currentScore, date: new Date().toISOString() })

    // Ordenar por puntuación (de mayor a menor)
    scores.sort((a, b) => b.score - a.score)

    // Limitar a 10 puntuaciones
    if (scores.length > 10) {
      scores.length = 10
    }

    localStorage.setItem("cybersecurityScores", JSON.stringify(scores))
    showScoreboard()
  }

  // Función para obtener puntuaciones
  function getScores() {
    const scoresJson = localStorage.getItem("cybersecurityScores")
    return scoresJson ? JSON.parse(scoresJson) : []
  }

  // Función para mostrar tabla de puntuaciones
  function showScoreboard() {
    if (!scoreboardContainer || !scoreboardList) return

    const scores = getScores()
    scoreboardList.innerHTML = ""

    if (scores.length === 0) {
      const emptyItem = document.createElement("li")
      emptyItem.textContent = "No hay puntuaciones guardadas"
      scoreboardList.appendChild(emptyItem)
    } else {
      scores.forEach((score, index) => {
        const item = document.createElement("li")
        const date = new Date(score.date)
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        item.innerHTML = `<span class="rank">${index + 1}</span> <span class="name">${score.name}</span> <span class="score">${score.score}</span> <span class="date">${formattedDate}</span>`

        if (index === 0) item.classList.add("top-score")
        scoreboardList.appendChild(item)
      })
    }

    scoreboardContainer.style.display = "block"
  }

  // Función para simular carga del juego
  function startLoadingScreen() {
    if (!loadingScreen || !loadingBar || !loadingText) return

    loadingScreen.style.display = "flex"
    loadingProgress = 0

    loadingInterval = setInterval(() => {
      loadingProgress += Math.random() * 5
      if (loadingProgress >= 100) {
        loadingProgress = 100
        clearInterval(loadingInterval)

        // Mostrar mensaje de completado
        loadingText.textContent = "¡Listo para jugar!"

        // Ocultar pantalla de carga después de un momento
        setTimeout(() => {
          loadingScreen.style.display = "none"
          gameStarted = true
          initGame()
        }, 500)
      }

      loadingBar.style.width = `${loadingProgress}%`
      loadingText.textContent = `Iniciando juego... ${Math.floor(loadingProgress)}%`
    }, 100)
  }

  // Función para inicializar el juego
  function initGame() {
    // Detener el bucle de juego actual si existe
    gameLoopRunning = false

    // Limpiar intervalos anteriores
    if (blockSpawnInterval) clearInterval(blockSpawnInterval)

    // Resetear variables
    shipX = 100
    shipY = window.innerHeight / 2
    shipSpeedX = 0
    shipSpeedY = 0
    shipRotation = 0
    particles = []
    lasers = []
    bossLasers = []
    securityBlocks = []
    shotsFired = 0
    shieldStrength = 100
    isScanning = false
    isBoosting = false
    scrollX = 0
    gamePaused = false
    gameOver = false
    bossActive = false
    bossHealth = 100
    bossPhase = 1
    bossShieldActive = false
    bossAttackTimer = 0
    bossSpecialAttackTimer = 0
    bossMovementTimer = 0
    bossMovementDirection = 1
    bossDefeated = false
    currentScore = 0

    // Limpiar elementos
    clearElements(".particle")
    clearElements(".laser")
    clearElements(".boss-laser")
    clearElements(".security-block")
    clearElements(".impact")
    clearElements(".explosion")
    clearElements(".explosion-particle")
    clearElements(".data-point")
    clearElements(".circuit-line")
    clearElements(".platform")
    clearElements(".star")
    clearElements(".cloud")
    clearElements(".mountain")

    // Vaciar arrays de elementos
    platforms.length = 0
    dataPoints.length = 0
    circuitLines.length = 0

    // Resetear UI
    if (victoryMessage) victoryMessage.style.display = "none"
    if (gameOverMessage) gameOverMessage.style.display = "none"
    if (pauseMenu) pauseMenu.style.display = "none"
    if (boss) boss.style.display = "none"
    if (bossHealthContainer) bossHealthContainer.style.display = "none"
    if (bossName) bossName.style.display = "none"
    if (questionContainer) questionContainer.style.display = "none"
    if (scoreForm) scoreForm.style.display = "none"
    if (scoreboardContainer) scoreboardContainer.style.display = "none"
    if (ship) {
      ship.style.display = "block"
      ship.style.filter = ""
    }
    if (shieldStatusEl) shieldStatusEl.textContent = "100%"
    if (shotCountEl) shotCountEl.textContent = "0"
    if (scoreEl) scoreEl.textContent = "0"
    if (statusEl) {
      statusEl.textContent = "SEGURO"
      statusEl.style.color = "#00ffff"
    }

    // Reiniciar indicadores de fase
    phaseDots.forEach((dot, i) => {
      if (dot) dot.classList.toggle("active", i === 0)
    })

    // Crear mundo
    createStars()
    createClouds()
    createTerrain()
    createPlatforms()
    spawnSecurityBlocks()
    createCircuitElements()

    // Iniciar bucle del juego con un pequeño retraso para asegurar que todo esté listo
    setTimeout(() => {
      gameLoopRunning = true
      requestAnimationFrame(gameLoop)
    }, 100)
  }

  // Función principal del juego
  function gameLoop() {
    if (!gameLoopRunning) return

    if (!gameOver) {
      if (!gamePaused) {
        updateShip()
        updateParticles()
        updateLasers()
        updateSecurityBlocks()
        updateBoss()
        updateBossLasers()
      }
      requestAnimationFrame(gameLoop)
    } else {
      // Si el juego ha terminado, no solicitar más frames
      gameLoopRunning = false
    }
  }

  // Configurar controles
  function setupControls() {
    document.addEventListener("keydown", (e) => {
      keys[e.key] = true

      if (e.key === " " && !gamePaused && !gameOver) {
        fireLaser()
        e.preventDefault()
      }

      if (e.key.toLowerCase() === "s" && !gamePaused && !gameOver) {
        scanForThreats()
      }

      if (e.key.toLowerCase() === "r" && !gamePaused && !gameOver) {
        reinforceShield()
      }

      // Tecla P para pausar
      if (e.key.toLowerCase() === "p" && !gameOver) {
        togglePause()
        e.preventDefault()
      }
    })

    document.addEventListener("keyup", (e) => {
      keys[e.key] = false
    })

    // Controles de botones
    if (scanBtn) scanBtn.addEventListener("click", scanForThreats)
    if (fireBtn) fireBtn.addEventListener("click", fireLaser)
    if (boostBtn) boostBtn.addEventListener("click", activateBoost)
    if (shieldBtn) shieldBtn.addEventListener("click", reinforceShield)
    if (continueBtn) continueBtn.addEventListener("click", continueGame)
    if (victoryRestartBtn) victoryRestartBtn.addEventListener("click", initGame)
    if (gameoverRestartBtn) gameoverRestartBtn.addEventListener("click", initGame)
    if (pauseBtn) pauseBtn.addEventListener("click", togglePause)
    if (resumeBtn) resumeBtn.addEventListener("click", togglePause)
    if (scoreboardBtn) scoreboardBtn.addEventListener("click", showScoreboard)
    if (closeScoreboardBtn)
      closeScoreboardBtn.addEventListener("click", () => {
        if (scoreboardContainer) scoreboardContainer.style.display = "none"
      })

    // Configurar formulario de puntuación
    if (scoreForm) {
      scoreForm.addEventListener("submit", (e) => {
        e.preventDefault()
        if (playerNameInput) {
          saveScore(playerNameInput.value)
          scoreForm.style.display = "none"
        }
      })
    }

    if (saveScoreBtn) {
      saveScoreBtn.addEventListener("click", (e) => {
        e.preventDefault()
        if (playerNameInput) {
          saveScore(playerNameInput.value)
          scoreForm.style.display = "none"
        }
      })
    }
  }

  // Iniciar el juego
  setupControls()
  startLoadingScreen() // Iniciar pantalla de carga en lugar de iniciar el juego directamente
})
