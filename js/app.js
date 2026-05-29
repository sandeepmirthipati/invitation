// Premium Royal Indian Cinema-Grade Luxury Engagement Invitation Engine
document.addEventListener("DOMContentLoaded", () => {
    // Force scroll to top on page refresh (prevents browser remembering old scroll positions)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 1. Initial State & Custom Cursor Tracking
    const cursor = document.querySelector(".custom-cursor");
    const cursorGlow = document.querySelector(".custom-cursor-glow");
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    // Track mouse movement
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate custom cursor with linear interpolation (lerp) for smooth trailing delay
    function animateCursor() {
        // Dot tracking (very fast)
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Outer Glow tracking (slower trailing lag)
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Dynamic hover reactions for custom cursor
    const hoverables = document.querySelectorAll("a, button, .wax-seal, .details-card, .photo-wrapper-card, .music-toggle, .invitation-box-card, .box-detail-item");
    hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("hovered-element");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovered-element");
        });
    });

    // 2. Background Audio Controller
    const bgMusic = document.getElementById("bg-music");
    const musicToggleBtn = document.getElementById("music-toggle");
    let isMusicPlaying = false;

    function playMusic() {
        if (bgMusic) {
            bgMusic.volume = 0;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggleBtn.classList.add("playing");
                musicToggleBtn.querySelector("i").className = "fa-solid fa-volume-high";
                
                // Fade in volume smoothly over 2.5 seconds (logarithmic curve simulation)
                let currentVolume = 0;
                const fadeInterval = setInterval(() => {
                    if (currentVolume < 0.45) {
                        currentVolume += 0.015;
                        bgMusic.volume = currentVolume;
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 80);
            }).catch((err) => {
                console.log("Audio autoplay was prevented or failed: ", err);
            });
        }
    }

    function toggleMusic() {
        if (!bgMusic) return;
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggleBtn.classList.remove("playing");
            musicToggleBtn.querySelector("i").className = "fa-solid fa-volume-xmark";
        } else {
            bgMusic.play();
            isMusicPlaying = true;
            musicToggleBtn.classList.add("playing");
            musicToggleBtn.querySelector("i").className = "fa-solid fa-volume-high";
            bgMusic.volume = 0.45;
        }
    }

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // 3. Opening Invitation Split-Panel Logic
    const openingScreen = document.getElementById("opening-screen");
    const openBtn = document.getElementById("open-invitation-btn");

    if (openBtn && openingScreen) {
        openBtn.addEventListener("click", () => {
            // Instant scroll back to top of document (guarantees viewing Hero poster first)
            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            // Trigger audio playback
            playMusic();

            // Toggle panels split animation
            openingScreen.classList.add("opened");
            
            setTimeout(() => {
                openingScreen.style.display = "none";
                
                // Initialize GSAP reveals after opening completes
                initGSAPAnimations();
            }, 1800); // match panels slide duration
        });
    }

    // 4. Floating Gold Bokeh Particles (HTML5 Canvas System)
    const particleCanvases = document.querySelectorAll(".particle-canvas");
    particleCanvases.forEach((canvas) => {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const maxParticles = 40; // fewer, higher quality bokeh circles

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 80;
                this.size = Math.random() * 18 + 5; // larger particles for soft bokeh defocus
                this.speedY = Math.random() * 0.4 + 0.15;
                this.speedX = (Math.random() - 0.5) * 0.25;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.blurFactor = Math.random() * 4 + 2;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                
                // Fade out near top
                if (this.y < canvas.height * 0.25) {
                    this.opacity -= 0.003;
                }

                if (this.y < 0 || this.opacity <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Soft radial gradient to mimic camera out-of-focus bokeh highlights
                let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                grad.addColorStop(0, `rgba(241, 206, 133, ${this.opacity})`);
                grad.addColorStop(0.4, `rgba(194, 157, 83, ${this.opacity * 0.5})`);
                grad.addColorStop(1, 'rgba(194, 157, 83, 0)');
                
                ctx.fillStyle = grad;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
            // Pre-warm particles across screen height
            particles[i].y = Math.random() * canvas.height;
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        requestAnimationFrame(animateParticles);
    });

    // 5. Countdown Timer
    const countdownContainer = document.getElementById("countdown");
    if (countdownContainer) {
        const targetDateStr = countdownContainer.getAttribute("data-target"); // YYYY-MM-DD format
        const targetDate = new Date(`${targetDateStr}T10:30:00`).getTime();

        const daysVal = document.getElementById("days");
        const hoursVal = document.getElementById("hours");
        const minutesVal = document.getElementById("minutes");
        const secondsVal = document.getElementById("seconds");

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                if (daysVal) daysVal.innerText = "00";
                if (hoursVal) hoursVal.innerText = "00";
                if (minutesVal) minutesVal.innerText = "00";
                if (secondsVal) secondsVal.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Format with leading zero
            if (daysVal) daysVal.innerText = days < 10 ? `0${days}` : days;
            if (hoursVal) hoursVal.innerText = hours < 10 ? `0${hours}` : hours;
            if (minutesVal) minutesVal.innerText = minutes < 10 ? `0${minutes}` : minutes;
            if (secondsVal) secondsVal.innerText = seconds < 10 ? `0${seconds}` : seconds;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // 6. GSAP + ScrollTrigger Entrance Animations
    function initGSAPAnimations() {
        if (typeof gsap === "undefined") {
            console.warn("GSAP is not loaded. Falling back to CSS reveals.");
            initFallbackObserverAnimations();
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // A. Hero Section Reveals (Cinematic Blurs and Spacings)
        const heroTimeline = gsap.timeline();
        heroTimeline.from(".hero-section .ganesha-blessing", { opacity: 0, y: -20, filter: "blur(3px)", duration: 1.5, ease: "power3.out" })
                    .from(".hero-monogram", { opacity: 0, y: -25, duration: 1.5, ease: "power4.out" }, "-=1.2")
                    .from(".hero-title-invite", { opacity: 0, y: 20, filter: "blur(5px)", duration: 1.5, ease: "power3.out" }, "-=1.0")
                    .from(".couple-name", { 
                        opacity: 0, 
                        y: 40, 
                        letterSpacing: "20px", 
                        filter: "blur(10px)", 
                        stagger: 0.3, 
                        duration: 2.2, 
                        ease: "power3.out" 
                    }, "-=1.2")
                    .from(".ampersand", { opacity: 0, scale: 0.5, duration: 2, ease: "elastic.out(1, 0.6)" }, "-=1.8")
                    .from(".luxury-divider", { scaleX: 0, duration: 2, ease: "power3.inOut" }, "-=1.4")
                    .from(".hero-subtitle", { opacity: 0, letterSpacing: "18px", duration: 1.5, ease: "power3.out" }, "-=0.8")
                    .from(".hero-date", { opacity: 0, y: 20, filter: "blur(3px)", duration: 1.5, ease: "power3.out" }, "-=1.0")
                    .from(".scroll-indicator", { opacity: 0, y: 15, duration: 1.2, ease: "power3.out" }, "-=0.6");

        // B. Love Quote Section Trigger
        gsap.from(".quote-decor", {
            scrollTrigger: {
                trigger: ".quote-section",
                start: "top 80%",
            },
            opacity: 0,
            scale: 0.8,
            duration: 1.2,
            ease: "power2.out"
        });

        gsap.from(".quote-telugu", {
            scrollTrigger: {
                trigger: ".quote-section",
                start: "top 75%",
            },
            opacity: 0,
            y: 35,
            filter: "blur(5px)",
            duration: 1.8,
            ease: "power3.out"
        });

        gsap.from(".quote-english", {
            scrollTrigger: {
                trigger: ".quote-section",
                start: "top 70%",
            },
            opacity: 0,
            y: 30,
            filter: "blur(3px)",
            duration: 1.8,
            ease: "power3.out"
        });

        // C. Couple Portrait Showcase Frame Zoom/Parallax
        gsap.from(".photo-wrapper-card", {
            scrollTrigger: {
                trigger: ".couple-section",
                start: "top 75%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 60,
            rotationY: -10,
            rotationX: 10,
            scale: 0.94,
            duration: 2.2,
            ease: "power4.out"
        });

        // D. Centerpiece Invitation Box Frame + Staggered Details Reveal
        gsap.utils.toArray(".invitation-box-card").forEach((card) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            tl.from(card, {
                opacity: 0,
                y: 50,
                scale: 0.96,
                duration: 1.8,
                ease: "power3.out"
            });

            // Find child detail blocks and animate them staggeredly if they exist
            const detailBlocks = card.querySelectorAll(".cinematic-detail-block");
            if (detailBlocks.length > 0) {
                tl.from(detailBlocks, {
                    opacity: 0,
                    y: 25,
                    stagger: 0.25,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=1.0"); // Start animating children slightly before card animation finishes
            }
        });

        // F. Countdown Digits Fade-In
        gsap.from(".countdown-item", {
            scrollTrigger: {
                trigger: ".countdown-section",
                start: "top 75%",
            },
            opacity: 0,
            scale: 0.85,
            stagger: 0.2,
            duration: 1.5,
            ease: "power3.out"
        });

        // G. Location Map Reveal
        gsap.from(".map-wrapper", {
            scrollTrigger: {
                trigger: ".map-section",
                start: "top 75%",
            },
            opacity: 0,
            y: 40,
            duration: 1.8,
            ease: "power3.out"
        });

        // H. Footer Reveal
        gsap.from(".footer-section > *", {
            scrollTrigger: {
                trigger: ".footer-section",
                start: "top 85%",
            },
            opacity: 0,
            y: 25,
            stagger: 0.25,
            duration: 1.5,
            ease: "power3.out"
        });

        // Force ScrollTrigger to refresh positions (prevents blank screen on hash load)
        ScrollTrigger.refresh();
    }

    // 7. Fallback IntersectionObserver Reveal System
    function initFallbackObserverAnimations() {
        const sections = document.querySelectorAll(".quote-section, .couple-section, .details-section, .countdown-section, .map-section, .footer-section, .invitation-box-card");
        
        sections.forEach(s => {
            s.style.opacity = "0";
            s.style.transform = "translateY(40px)";
            s.style.transition = "opacity 1.8s cubic-bezier(0.25, 1, 0.22, 1), transform 1.8s cubic-bezier(0.25, 1, 0.22, 1)";
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        sections.forEach(s => observer.observe(s));
    }
});
