document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // Slightly before the bottom
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Navbar active state on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
        
        // Change navbar background opacity on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(2, 6, 23, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(2, 6, 23, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 3. Smooth scrolling for anchor links (mostly handled by CSS scroll-behavior, but JS ensures offset for fixed header)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Close mobile menu if open
                if(navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    });

    // 4. Simple Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinksContainer.style.display = navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
            navLinksContainer.style.flexDirection = 'column';
            navLinksContainer.style.position = 'absolute';
            navLinksContainer.style.top = '100%';
            navLinksContainer.style.left = '0';
            navLinksContainer.style.width = '100%';
            navLinksContainer.style.background = 'rgba(2, 6, 23, 0.95)';
            navLinksContainer.style.padding = '2rem';
            navLinksContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        });
    }

    // --- COMPLEX ANIMATIONS ADDITIONS ---

    // 5. Custom Cursor Tracking
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Animate outline to trail slightly
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
            
            // Update CSS variables for Spotlight Mask
            document.documentElement.style.setProperty('--mouse-x', `${posX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${posY + window.scrollY}px`);
        });

        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, .tag');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.borderColor = 'var(--accent-cyan)';
                cursorOutline.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 6. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.edu-card, .reco-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if(window.innerWidth <= 768) return; // Disable on mobile
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 7. Timeline Scroll Progress
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    
    if (timeline && timelineProgress) {
        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            const timelineStart = rect.top + window.scrollY;
            const timelineHeight = rect.height;
            const scrollY = window.scrollY + (window.innerHeight / 2); // Trigger at center of screen
            
            if (scrollY >= timelineStart) {
                let progress = ((scrollY - timelineStart) / timelineHeight) * 100;
                progress = Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
                timelineProgress.style.height = `${progress}%`;
            } else {
                timelineProgress.style.height = '0%';
            }
        });
    }

    // 8. Typewriter Effect
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.getAttribute('data-text');
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                typewriterElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100); // Typing speed
            }
        };
        
        // Start after a short delay
        setTimeout(typeWriter, 1000);
    }

    // --- QUANTUM BIOLUMINESCENCE: CANVAS PHYSICS ENGINE ---
    const canvas = document.getElementById('living-background');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const mouse = { x: -1000, y: -1000 };

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.5;
                this.color = Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6';
                this.baseAlpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off walls
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (repel)
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.x -= (dx / distance) * force * 5;
                    this.y -= (dy / distance) * force * 5;
                    this.alpha = this.baseAlpha + force; // Glow up
                } else {
                    this.alpha = this.baseAlpha;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
            }
        }

        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw connections
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - dist/100)})`;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        
        animateCanvas();
    }

});
