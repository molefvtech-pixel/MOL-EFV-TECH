"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector("#loader");
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector("#menuToggle");
  const navLinks = document.querySelector("#navLinks");
  const btnTop = document.querySelector("#btnTop");
  const year = document.querySelector("#currentYear");
  const music = document.querySelector("#backgroundMusic");
  const musicToggle = document.querySelector("#musicToggle");
  const soundNotice = document.querySelector("#soundNotice");
  const enableSound = document.querySelector("#enableSound");

  /* Loader */
  const hideLoader = () => {
    if (!loader || loader.classList.contains("hidden")) return;
    loader.classList.add("hidden");
    window.setTimeout(() => loader.remove(), 750);
  };

  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, 900);
  }, { once: true });

  window.setTimeout(hideLoader, 4500);

  /* Menú móvil */
  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    const icon = menuToggle.querySelector("i");
    icon?.classList.remove("fa-xmark");
    icon?.classList.add("fa-bars");
  };

  const openMenu = () => {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú");
    const icon = menuToggle.querySelector("i");
    icon?.classList.remove("fa-bars");
    icon?.classList.add("fa-xmark");
  };

  menuToggle?.addEventListener("click", () => {
    navLinks?.classList.contains("active") ? closeMenu() : openMenu();
  });

  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  /* Navbar y botón superior */
  const updateScrollUI = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 70);
    btnTop?.classList.toggle("visible", window.scrollY > 550);
  };

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  btnTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Año */
  if (year) year.textContent = String(new Date().getFullYear());

  /* Música ambiental
     Los navegadores pueden bloquear el autoplay con sonido.
     Se intenta reproducir a volumen bajo y, si falla, se ofrece un botón. */
  let musicEnabled = false;

  const updateMusicIcon = () => {
    const icon = musicToggle?.querySelector("i");
    if (!icon) return;
    icon.className = music && !music.paused
      ? "fa-solid fa-volume-low"
      : "fa-solid fa-volume-xmark";
  };

  const startMusic = async () => {
    if (!music) return;
    music.volume = 0.12;

    try {
      await music.play();
      musicEnabled = true;
      if (soundNotice) soundNotice.hidden = true;
    } catch {
      if (soundNotice) soundNotice.hidden = false;
    }

    updateMusicIcon();
  };

  window.addEventListener("load", () => {
    window.setTimeout(startMusic, 1200);
  }, { once: true });

  enableSound?.addEventListener("click", startMusic);

  musicToggle?.addEventListener("click", async () => {
    if (!music) return;

    if (music.paused) {
      await startMusic();
    } else {
      music.pause();
    }

    updateMusicIcon();
  });

  /* Animaciones */
  const revealElements = document.querySelectorAll(
    ".service-card, .advantage-card, .price-card, .comparison-card, " +
    ".gallery-item, .about-card, .systems-image, .diagnostic-form, .contact-form"
  );

  revealElements.forEach(element => element.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("show"));
  }

  /* Contadores */
  const counters = document.querySelectorAll(".counter");

  const animateCounter = counter => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1100;
    const start = performance.now();

    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = String(Math.floor(target * progress));
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  /* Partículas tecnológicas */
  const canvas = document.querySelector("#particles");
  const context = canvas?.getContext("2d");
  let particles = [];
  let animationId;

  const resizeCanvas = () => {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);

    const total = Math.min(60, Math.floor(window.innerWidth / 24));
    particles = Array.from({ length: total }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.4 + 0.5
    }));
  };

  const drawParticles = () => {
    if (!context || !canvas) return;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(34, 211, 238, .55)";
      context.fill();

      for (let i = index + 1; i < particles.length; i++) {
        const other = particles[i];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 105) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(37, 99, 235, ${0.12 * (1 - distance / 105)})`;
          context.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(drawParticles);
  };

  if (canvas && context && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resizeCanvas();
    drawParticles();
    window.addEventListener("resize", resizeCanvas);
  }

  /* Diagnóstico inteligente */
  const diagnosticForm = document.querySelector("#diagnosticForm");
  const diagnosticResult = document.querySelector("#diagnosticResult");
  const diagnosticText = document.querySelector("#diagnosticText");
  const diagnosticWhatsApp = document.querySelector("#diagnosticWhatsApp");

  diagnosticForm?.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(diagnosticForm);
    const power = data.get("enciende");
    const problem = data.get("problema");
    const equipment = data.get("equipo");

    let recommendation = "";

    if (power === "no") {
      recommendation = "El equipo necesita una revisión eléctrica y de hardware. Puede tratarse de cargador, batería, conector, memoria o placa.";
    } else if (problem === "lento") {
      recommendation = "Conviene evaluar el estado del disco, la memoria RAM y el sistema. Una actualización a SSD suele mejorar notablemente el rendimiento.";
    } else if (problem === "temperatura") {
      recommendation = "Es recomendable realizar mantenimiento interno, limpieza de ventilación y revisión de pasta térmica.";
    } else if (problem === "pantalla") {
      recommendation = "Se debe revisar pantalla, cable flex, memoria RAM, salida de video y placa.";
    } else if (problem === "sistema") {
      recommendation = "Puede requerir reparación del sistema, respaldo, controladores o reinstalación de Windows/Linux.";
    } else if (problem === "virus") {
      recommendation = "Se recomienda analizar amenazas, limpiar programas no deseados y revisar la seguridad del navegador y del sistema.";
    } else {
      recommendation = "El equipo necesita una revisión personalizada para determinar la causa y la mejor solución.";
    }

    const fullText = `${recommendation} Esta orientación es preliminar y no reemplaza un diagnóstico presencial.`;

    if (diagnosticText) diagnosticText.textContent = fullText;
    if (diagnosticResult) diagnosticResult.hidden = false;

    const message =
      `Hola MOL EFV TECH. Realicé el diagnóstico web.%0A` +
      `Equipo: ${encodeURIComponent(String(equipment))}%0A` +
      `Enciende: ${encodeURIComponent(String(power))}%0A` +
      `Problema: ${encodeURIComponent(String(problem))}%0A` +
      `Resultado: ${encodeURIComponent(fullText)}`;

    if (diagnosticWhatsApp) {
      diagnosticWhatsApp.href = `https://wa.me/56974398565?text=${message}`;
    }

    diagnosticResult?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* Formulario de contacto: abre el cliente de correo */
  const contactForm = document.querySelector("#contactForm");

  contactForm?.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("nombre") || "");
    const email = String(data.get("correo") || "");
    const equipment = String(data.get("equipo") || "");
    const message = String(data.get("mensaje") || "");

    const subject = encodeURIComponent(`Consulta técnica de ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\n` +
      `Correo: ${email}\n` +
      `Equipo: ${equipment}\n\n` +
      `Problema:\n${message}`
    );

    window.location.href = `mailto:molefvtech@gmail.com?subject=${subject}&body=${body}`;
  });
});
