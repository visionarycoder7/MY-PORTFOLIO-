/**
 * SOHAN GHOSH - PORTFOLIO JAVASCRIPT ENGINE
 * Final Year ECE @ Coochbehar Government Engineering College
 * GitHub: visionarycoder7 | LinkedIn: sohan-ghosh-684aa2287
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initBackgroundCanvas();
  initDynamicTyping();
  initNavbarScroll();
  initSkillsFilter();
  initProjectFilter();
  initModals();
  initTerminal();
  initContactForm();
});

/* ==========================================================================
   1. Theme Accent Switcher & Persistence
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-btn');
  const themeDropdown = document.getElementById('theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Load persisted theme
  const savedTheme = localStorage.getItem('sohan_portfolio_theme') || 'cyan';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.remove('open');
    });

    themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedTheme = opt.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('sohan_portfolio_theme', selectedTheme);
        themeDropdown.classList.remove('open');
        showToast(`Theme switched to ${opt.innerText.trim()}`);
      });
    });
  }
}

/* ==========================================================================
   2. Interactive Circuit / Constellation Background Canvas
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.75;
      this.speedY = (Math.random() - 0.5) * 0.75;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse repulsion/interaction
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 3;
          this.y -= (dy / distance) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130) {
          let opacity = 1 - (distance / 130);
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  initParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Dynamic Typewriter Effect
   ========================================================================== */
function initDynamicTyping() {
  const typingElement = document.getElementById('dynamic-typing');
  if (!typingElement) return;

  const roles = [
    'Visionary Coder',
    'ECE Engineer @ CGEC',
    'Embedded Systems & IoT Innovator',
    'Full-Stack Developer',
    'Low-Level Systems Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Navbar Scroll & Mobile Navigation
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting based on viewport scroll
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* ==========================================================================
   5. Skills Filter Tabs
   ========================================================================== */
function initSkillsFilter() {
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      skillCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Projects Filter Tabs
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Project Deep Dive & Resume Modals
   ========================================================================== */
const projectDetailsData = {
  'iot-home': {
    title: 'Smart IoT Environmental Monitoring & Automation System',
    category: 'IoT & Embedded Engineering',
    tag: 'ESP32 / MQTT / WebSockets / Cloud Telemetry',
    description: 'An industrial-grade IoT prototype constructed around the ESP32 dual-core microcontroller. It streams multiple ambient parameters (DHT22 temperature & relative humidity, MQ-135 air quality gas index, ambient light LDR) over lightweight MQTT pub/sub channels to a live web-based supervisory dashboard.',
    architecture: `[Sensors: DHT22, MQ-135, LDR] 
       │
       ▼ (Analog/Digital GPIO)
[ESP32 Microcontroller Node] ──(WiFi / MQTT)──► [MQTT Broker / Cloud]
       │                                              │
       ▼ (Relay Driver)                               ▼ (WebSockets)
[Actuators: Fan / Alarm]                    [Live Browser Dashboard UI]`,
    features: [
      'Dual-core FreeRTOS task scheduling: Task 1 handles sensor telemetry, Task 2 manages WiFi & MQTT connection recovery.',
      'Configurable automatic hysteresis threshold triggering dual 5V optocoupled relay switches for exhaust fan and buzzer alerts.',
      'Zero-lag browser dashboard featuring Chart.js streaming analytics and manual actuator control overrides.'
    ],
    techStack: ['ESP32', 'FreeRTOS', 'C++ (Arduino Core)', 'MQTT (Mosquitto)', 'WebSockets', 'HTML5/Chart.js']
  },
  'rover': {
    title: 'Autonomous Obstacle Avoider & Path Navigation Rover',
    category: 'Embedded Robotics & Microcontroller Systems',
    tag: 'Microcontroller / HC-SR04 / L298N H-Bridge / PWM',
    description: 'A 2WD autonomous robotics platform driven by embedded microcontroller firmware. Uses ultrasonic echolocation mounted on a micro-servo to map a 180-degree forward obstacle horizon, calculating optimal vector navigation paths in real time.',
    architecture: `[HC-SR04 Ultrasonic Sensor on Micro Servo]
                   │
                   ▼ (Echo / Trigger Pulses)
        [Microcontroller Firmware Loop]
                   │
                   ▼ (Directional Logic & PWM Duty Cycle)
           [L298N Dual H-Bridge Driver]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    [Left DC Motor]    [Right DC Motor]`,
    features: [
      'Sub-millisecond ultrasonic pulse timing using hardware timers for obstacle distance measurement down to 2cm precision.',
      'Dynamic multi-angle sweep algorithm evaluating left vs right clearance before committing directional steering decisions.',
      'PWM-modulated speed curves ensuring smooth motor acceleration and preventing wheel slippage.'
    ],
    techStack: ['Embedded C++', 'Microcontroller', 'PWM Timers', 'Ultrasonic HC-SR04', 'L298N Driver', 'Proteus Simulation']
  },
  'dsp-suite': {
    title: 'DSP Spectral Audio & Signal Filter Suite',
    category: 'Signals, Systems & DSP Analysis',
    tag: 'MATLAB / Python (NumPy, SciPy) / FFT / Butterworth / Chebyshev',
    description: 'A digital signal processing toolchain for analyzing noisy audio signals, computing discrete Fast Fourier Transforms (FFT), calculating power spectral densities, and synthesizing custom IIR/FIR digital filters.',
    architecture: `[Noisy Audio Signal / Sensor Raw Waveform]
                   │
                   ▼
       [Fast Fourier Transform (FFT)] ──► [Frequency Domain Spectrum]
                   │
                   ▼
   [Digital Filter: Butterworth / Chebyshev / FIR]
                   │
                   ▼
     [Filtered Clean Audio Signal + SNR Improvement Verification]`,
    features: [
      'Automated Butterworth & Chebyshev Type-I/II low-pass, high-pass, and band-pass filter coefficient synthesis.',
      'Bode plot magnitude/phase analysis and pole-zero constellation mapping for stability verification.',
      'Audio noise reduction yielding measurable SNR improvement on simulated audio recordings.'
    ],
    techStack: ['MATLAB', 'Simulink', 'Python (SciPy, NumPy, Matplotlib)', 'FFT Algorithms', 'Digital Filter Design']
  },
  'web-platform': {
    title: 'Modern Web Platform & Developer Experience Suite',
    category: 'Full-Stack Web Development',
    tag: 'HTML5 / CSS3 / ES6+ JavaScript / REST APIs / Glassmorphism',
    description: 'A responsive, high-performance web suite built with modern vanilla web standards. Engineered for lightning-fast first contentful paint (FCP), dynamic state management, custom CSS custom property theming, and full cross-device accessibility.',
    architecture: `[User Interaction Layer / Responsive DOM]
                   │
                   ▼
     [Vanilla JS State & Event Dispatcher]
        ┌──────────┴──────────┐
        ▼                     ▼
[Dynamic Themes & Audio]  [REST API Async Pipelines]`,
    features: [
      'Zero-dependency vanilla JavaScript architecture guaranteeing instant load times and 60fps animations.',
      'Glassmorphic design system with dynamic CSS variables supporting live runtime accent switching.',
      'Interactive sandbox tools, responsive touch gesture navigation, and SEO-optimized semantic markup.'
    ],
    techStack: ['HTML5 Semantic', 'CSS3 Custom Properties', 'JavaScript ES6+', 'REST APIs', 'Web Audio API']
  },
  'alu': {
    title: '8-Bit Arithmetic Logic Unit (ALU) & Circuit Simulation',
    category: 'Digital Electronics & VLSI Modeling',
    tag: 'Verilog HDL / Proteus / Logic Minimization / Micro-Operations',
    description: 'Hardware architecture modeling of an 8-bit Arithmetic Logic Unit. Implemented using structural and behavioral Verilog HDL with corresponding schematic simulation in Proteus.',
    architecture: `[Inputs: Opcode S[3:0], Operand A[7:0], Operand B[7:0], Cin]
                   │
                   ▼
        [Arithmetic & Logic Multiplexer Matrix]
        ├── Add / Sub / Increment / Decrement
        └── AND / OR / XOR / NOT / Shift Operations
                   │
                   ▼
[Output Result[7:0]] + [Flags: Carry (C), Zero (Z), Overflow (V), Parity (P)]`,
    features: [
      'Execution of 16 distinct arithmetic and logic operations controlled by 4-bit function select opcode.',
      'Synchronous status register updating zero, sign, carry, and parity flags for CPU branching simulations.',
      'Gate-level propagation delay analysis and functional testbench verification in Verilog.'
    ],
    techStack: ['Verilog HDL', 'Proteus Simulation', 'Digital Circuit Design', 'Computer Architecture']
  },
  'terminal-app': {
    title: 'Visionary CLI Web Terminal & Developer Dashboard',
    category: 'Interactive Developer Tooling',
    tag: 'JavaScript ES6 / CLI Engine / Canvas / History Stack',
    description: 'An authentic Unix-style terminal emulator running in the browser, featuring full command line interpretation, command history traversal via arrow keys, live theme modifications, and interactive Easter eggs.',
    architecture: `[User Keyboard Input / Stdin]
                   │
                   ▼
   [Command Tokenizer & Argument Parser]
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
 [Built-in CLI System]   [Theme & Audio Trigger]
        │
        ▼
   [Stdout Terminal Buffer Rendering]`,
    features: [
      'Extensible command registry with full help docs, argument support, and aliases.',
      'History stack supporting Up/Down arrow navigation, identical to a native Bash/Zsh prompt.',
      'Matrix digital rain simulator and live portfolio querying directly via terminal commands.'
    ],
    techStack: ['JavaScript ES6', 'Terminal Parser', 'HTML5 Canvas API', 'CSS Glassmorphism']
  }
};

function initModals() {
  const projModal = document.getElementById('project-modal');
  const projModalContent = document.getElementById('modal-content');
  const projModalClose = document.getElementById('modal-close-btn');

  const resumeModal = document.getElementById('resume-modal');
  const openResumeNav = document.getElementById('open-resume-nav-btn');
  const openResumeHero = document.getElementById('open-resume-hero-btn');
  const closeResumeBtn = document.getElementById('resume-close-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  // Project Deep Dive Modal
  document.querySelectorAll('.btn-deep-dive').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetailsData[projKey];
      if (!data) return;

      projModalContent.innerHTML = `
        <div class="modal-proj-header">
          <span class="modal-proj-tag"><i class="fa-solid fa-microchip"></i> ${data.category}</span>
          <h2 class="modal-proj-title">${data.title}</h2>
          <div class="project-tech-stack" style="margin-top: 0.5rem;">
            ${data.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
          </div>
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-align-left"></i> Project Overview</h4>
        <p class="modal-proj-desc">${data.description}</p>

        <h4 class="modal-section-title"><i class="fa-solid fa-diagram-project"></i> Architectural Flow</h4>
        <pre class="modal-arch-box"><code>${data.architecture}</code></pre>

        <h4 class="modal-section-title"><i class="fa-solid fa-list-check"></i> Key Innovations & Engineering Highlights</h4>
        <ul class="modal-list">
          ${data.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>`).join('')}
        </ul>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <a href="https://github.com/visionarycoder7" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Profile
          </a>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('project-modal').classList.remove('open')">
            Close Overview
          </button>
        </div>
      `;

      projModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (projModalClose && projModal) {
    projModalClose.addEventListener('click', () => {
      projModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    });

    projModal.addEventListener('click', (e) => {
      if (e.target === projModal) {
        projModal.classList.remove('open');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Resume Modal
  function openResume() {
    resumeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  if (openResumeNav) openResumeNav.addEventListener('click', openResume);
  if (openResumeHero) openResumeHero.addEventListener('click', openResume);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projModal) projModal.classList.remove('open');
      if (resumeModal) resumeModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });
}

/* ==========================================================================
   8. Interactive Terminal Engine
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const suggBtns = document.querySelectorAll('.sugg-btn');

  if (!terminalInput || !terminalOutput) return;

  let commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<span class="highlight-text">Available Commands:</span>
  <span class="highlight">about</span>       - Summary of Sohan Ghosh & background
  <span class="highlight">skills</span>      - Overview of ECE & Software technical matrix
  <span class="highlight">projects</span>    - List featured engineering & web projects
  <span class="highlight">education</span>   - Academic credentials at Coochbehar Govt Engg College
  <span class="highlight">contact</span>     - Display email, institution, and social connects
  <span class="highlight">socials</span>     - Direct links to GitHub & LinkedIn
  <span class="highlight">github</span>      - Visit GitHub profile (visionarycoder7)
  <span class="highlight">linkedin</span>    - Visit LinkedIn profile
  <span class="highlight">college</span>     - Information about Coochbehar Govt. Engineering College
  <span class="highlight">theme</span>       - Switch color theme (usage: theme cyan|purple|emerald|amber)
  <span class="highlight">matrix</span>      - Trigger green cyber matrix visual effect
  <span class="highlight">clear</span>       - Clear the terminal screen
  <span class="highlight">whoami</span>      - Display current visitor identifier
`,
    about: () => `
<strong>Sohan Ghosh</strong> | Final Year Electronics & Communication Engineering (ECE)
Institution: <em>Coochbehar Government Engineering College (CGEC)</em>
Handle: <strong>visionarycoder7</strong>

Passionate about the synergy of hardware (Embedded Systems, Microcontrollers, IoT, DSP) 
and modern software engineering (C++, Python, Web Development, REST APIs).
`,
    skills: () => `
<span class="highlight-text">Technical Matrix:</span>
• <strong>Core ECE:</strong> Embedded Systems (ESP32, Arduino, 8051/8086), IoT (MQTT, HTTP), Digital Electronics, VLSI Basics, DSP, Circuit Simulation.
• <strong>Languages:</strong> C, C++, Python, JavaScript (ES6+), SQL, Verilog HDL.
• <strong>Web & Software:</strong> Modern HTML5, CSS3 Glassmorphism, Node.js basics, RESTful APIs, Git/GitHub.
• <strong>Tools & Simulators:</strong> MATLAB, Simulink, Proteus, Keil uVision, VS Code, Linux.
`,
    projects: () => `
<span class="highlight-text">Featured Projects:</span>
1. <strong>Smart IoT Environmental Monitoring</strong> [ESP32, MQTT, WebSockets]
2. <strong>Autonomous Obstacle Avoider Rover</strong> [Embedded C++, Ultrasonic, L298N]
3. <strong>DSP Spectral Audio Filter Suite</strong> [MATLAB, Python SciPy, FFT]
4. <strong>Full-Stack Web Suite</strong> [HTML5, CSS3, ES6+, REST APIs]
5. <strong>8-Bit ALU Circuit Modeling</strong> [Verilog HDL, Proteus]
6. <strong>Visionary CLI Dev Dashboard</strong> [JavaScript, Canvas API]
`,
    education: () => `
<span class="highlight-text">Education:</span>
• <strong>B.Tech in Electronics & Communication Engineering (ECE)</strong>
  Coochbehar Government Engineering College (CGEC) | 2021 – 2025/2026
• <strong>Higher Secondary (Pure Science Stream)</strong>
  WBCHSE | Physics, Chemistry, Mathematics, Computer Science
`,
    college: () => `
<strong>Coochbehar Government Engineering College (CGEC)</strong>
A premier state government engineering institution in Cooch Behar, West Bengal, India.
Department: Electronics & Communication Engineering (ECE)
`,
    contact: () => `
<span class="highlight-text">Get In Touch:</span>
• Email: <a href="mailto:sohanghosh.cgec@gmail.com" class="highlight">sohanghosh.cgec@gmail.com</a>
• LinkedIn: <a href="https://www.linkedin.com/in/sohan-ghosh-684aa2287/" target="_blank" class="highlight">linkedin.com/in/sohan-ghosh-684aa2287</a>
• GitHub: <a href="https://github.com/visionarycoder7" target="_blank" class="highlight">github.com/visionarycoder7</a>
• Location: Cooch Behar / West Bengal, India
`,
    socials: () => `
• LinkedIn: <a href="https://www.linkedin.com/in/sohan-ghosh-684aa2287/" target="_blank" class="highlight">https://www.linkedin.com/in/sohan-ghosh-684aa2287/</a>
• GitHub: <a href="https://github.com/visionarycoder7" target="_blank" class="highlight">https://github.com/visionarycoder7</a>
`,
    github: () => {
      window.open('https://github.com/visionarycoder7', '_blank');
      return 'Opening GitHub profile (visionarycoder7) in new tab...';
    },
    linkedin: () => {
      window.open('https://www.linkedin.com/in/sohan-ghosh-684aa2287/', '_blank');
      return 'Opening LinkedIn profile in new tab...';
    },
    whoami: () => 'guest@visionary-visitor',
    date: () => new Date().toString(),
    matrix: () => {
      document.documentElement.setAttribute('data-theme', 'emerald');
      return '<span style="color: #10b981;">Wake up, Neo... The Matrix has you. Theme shifted to Matrix Emerald.</span>';
    },
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Add to history
    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Print command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 't-history-cmd';
    cmdLine.innerHTML = `<span class="t-prompt"><span class="t-user">sohan</span><span class="t-at">@</span><span class="t-host">cgec</span>:<span class="t-path">~</span>$</span> <span class="t-cmd-text">${escapeHtml(trimmed)}</span>`;
    terminalOutput.appendChild(cmdLine);

    // Process output
    const responseLine = document.createElement('div');
    responseLine.className = 't-response';

    if (cmd === 'clear') {
      commands.clear();
      return;
    } else if (cmd === 'theme') {
      const targetTheme = args[0]?.toLowerCase();
      if (['cyan', 'purple', 'emerald', 'amber'].includes(targetTheme)) {
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('sohan_portfolio_theme', targetTheme);
        responseLine.innerHTML = `Theme switched to <span class="highlight">${targetTheme}</span>.`;
      } else {
        responseLine.innerHTML = `Invalid theme. Choose from: cyan, purple, emerald, amber. Example: <span class="highlight">theme emerald</span>`;
      }
    } else if (cmd === 'echo') {
      responseLine.innerText = args.join(' ');
    } else if (cmd === 'sudo') {
      responseLine.innerHTML = `<span style="color: #ef4444;">Access denied: User 'guest' is not in the sudoers file. This incident will be reported.</span>`;
    } else if (commands[cmd]) {
      const output = commands[cmd]();
      responseLine.innerHTML = output;
    } else {
      responseLine.innerHTML = `Command not recognized: <span style="color:#ef4444;">${escapeHtml(cmd)}</span>. Type <span class="highlight">help</span> for a list of available commands.`;
    }

    terminalOutput.appendChild(responseLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  // Suggestion buttons click
  suggBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
      terminalInput.focus();
    });
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
}

/* ==========================================================================
   9. Contact Form Validation & Toast Message
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    document.getElementById('name-error').innerText = '';
    document.getElementById('email-error').innerText = '';
    document.getElementById('message-error').innerText = '';

    if (!nameInput.value.trim()) {
      document.getElementById('name-error').innerText = 'Please enter your name.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      document.getElementById('email-error').innerText = 'Please enter your email address.';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      document.getElementById('email-error').innerText = 'Please provide a valid email address.';
      isValid = false;
    }

    if (!msgInput.value.trim()) {
      document.getElementById('message-error').innerText = 'Please enter your message.';
      isValid = false;
    }

    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
        form.reset();
        showToast('Thank you, Sohan will get back to you shortly!');
      }, 1000);
    }
  });
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
