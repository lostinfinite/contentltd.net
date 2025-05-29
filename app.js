document.addEventListener('DOMContentLoaded', () => {
    // Loading Animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 1000);
    });

    // Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // Parallax Effect
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }

    // Enhanced Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Animate menu items
            const links = navLinks.querySelectorAll('a');
            links.forEach((link, index) => {
                link.style.animation = 'none';
                link.offsetHeight; // Trigger reflow
                link.style.animation = `fadeInUp 0.3s ease-out ${index * 0.1}s backwards`;
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Enhanced FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items with animation
                faqItems.forEach(faqItem => {
                    if (faqItem !== item) {
                        const faqAnswer = faqItem.querySelector('.faq-answer');
                        faqItem.classList.remove('active');
                        if (faqAnswer) {
                            faqAnswer.style.maxHeight = '0';
                        }
                    }
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // Smooth Scrolling with Enhanced Animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Add highlight effect to target section
                target.classList.add('highlight');
                setTimeout(() => {
                    target.classList.remove('highlight');
                }, 2000);

                // Close mobile menu if open
                if (navLinks && window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // Enhanced Navbar Behavior
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Enhanced Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation to child elements
                const children = entry.target.querySelectorAll('.fade-in-element');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in-element').forEach(element => {
        observer.observe(element);
    });

    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Multilingual Typewriter Effect
    const typewriterText = document.querySelector('.typewriter-text');
    const languages = [
        { text: 'Hello', lang: 'en' },
        { text: 'Привет', lang: 'ru' },
        { text: 'مرحبا', lang: 'ar' },
        { text: 'Hola', lang: 'es' },
        { text: 'Bonjour', lang: 'fr' },
        { text: 'Ciao', lang: 'it' },
        { text: 'Hallo', lang: 'de' },
        { text: 'Olá', lang: 'pt' },
        { text: '你好', lang: 'zh' },
        { text: 'こんにちは', lang: 'ja' },
        { text: '안녕하세요', lang: 'ko' },
        { text: 'नमस्ते', lang: 'hi' },
        { text: 'สวัสดี', lang: 'th' },
        { text: 'Merhaba', lang: 'tr' },
        { text: 'Hej', lang: 'sv' },
        { text: 'Hei', lang: 'no' },
        { text: 'Hoi', lang: 'nl' },
        { text: 'Cześć', lang: 'pl' },
        { text: 'Ahoj', lang: 'cs' },
        { text: 'Szia', lang: 'hu' },
        { text: 'Bună', lang: 'ro' },
        { text: 'Γεια σας', lang: 'el' },
        { text: 'Zdravo', lang: 'hr' },
        { text: 'Pozdrav', lang: 'bs' },
        { text: 'Tere', lang: 'et' },
        { text: 'Sveiki', lang: 'lv' },
        { text: 'Labas', lang: 'lt' },
        { text: 'Hallo', lang: 'af' },
        { text: 'Moi', lang: 'fi' },
        { text: 'Hej', lang: 'da' },
        { text: 'Halló', lang: 'is' },
        { text: 'Përshëndetje', lang: 'sq' },
        { text: 'Barev', lang: 'hy' },
        { text: 'Salam', lang: 'az' },
        { text: 'გამარჯობა', lang: 'ka' },
        { text: 'Salut', lang: 'ca' },
        { text: 'Zdravo', lang: 'sl' },
        { text: 'Pozdravljeni', lang: 'sl' },
        { text: 'Bok', lang: 'hr' },
        { text: 'Zdravo', lang: 'sr' },
        { text: 'Здраво', lang: 'mk' }
    ];

    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentLanguage = languages[currentIndex];
        const fullText = currentLanguage.text;

        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
            typingSpeed = 50;
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
            typingSpeed = 100;
        }

        typewriterText.textContent = currentText;
        typewriterText.setAttribute('data-lang', currentLanguage.lang);

        if (!isDeleting && currentText === fullText) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % languages.length;
            typingSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typingSpeed);
    }

    // Start the typewriter effect
    type();

    // --- Premium Animations ---
    // Section fade-in-up
    const fadeSections = document.querySelectorAll('.fade-in-up');
    const observerFade = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerFade.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    fadeSections.forEach(section => observerFade.observe(section));

    // Staggered card reveal
    const staggeredEls = document.querySelectorAll('.staggered');
    const observerStagger = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.stagger * 120);
                observerStagger.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    staggeredEls.forEach((el, i) => {
        el.dataset.stagger = i;
        observerStagger.observe(el);
    });

    // Add shimmer and animated-gradient to main headings
    const mainHeadings = document.querySelectorAll('h1, h2');
    mainHeadings.forEach(h => {
        h.classList.add('shimmer');
        if (h.tagName === 'H1') h.classList.add('animated-gradient');
    });

    // Parallax effect for hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroSection.style.backgroundPositionY = `${scrolled * 0.3}px`;
        });
    }

    // Button pulse effect
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.classList.add('pulse');
    });

    // Footer fade-in
    const footer = document.querySelector('.footer');
    if (footer) {
        const observerFooter = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('visible');
                    observerFooter.unobserve(footer);
                }
            });
        }, { threshold: 0.1 });
        observerFooter.observe(footer);
    }

    // Navbar blur/color on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    // --- End Premium Animations ---
}); 