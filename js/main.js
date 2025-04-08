// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mobile menu functionality with improved performance
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const openMenuBtn = document.querySelector('.open-menu');
    const closeMenuBtn = document.querySelector('.close-menu');
    const body = document.body;

    if (openMenuBtn && closeMenuBtn && mobileMenu) {
        // Toggle menu function
        const toggleMenu = (show) => {
            mobileMenu.classList.toggle('active', show);
            body.style.overflow = show ? 'hidden' : '';
        };

        // Event listeners with passive option for better performance
        openMenuBtn.addEventListener('click', () => toggleMenu(true), { passive: true });
        closeMenuBtn.addEventListener('click', () => toggleMenu(false), { passive: true });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !openMenuBtn.contains(e.target)) {
                toggleMenu(false);
            }
        }, { passive: true });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleMenu(false);
        });
    }
}

// Lazy loading images with Intersection Observer
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('.lazy-image').forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        document.querySelectorAll('.lazy-image').forEach(img => img.classList.add('loaded'));
    }
}

// Smooth scroll with performance optimization
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, { passive: false });
    });
}

// Animate elements on scroll with performance optimization
function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                    });
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
    }
}

// Counter animation with performance optimization
function initCounters() {
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000; // 2 seconds
                    const start = performance.now();

                    const updateCounter = (currentTime) => {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);

                        counter.textContent = Math.round(progress * target);

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    };

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });

        document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));
    }
}

// Form validation with improved UX
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', debounce(function() {
                validateInput(input);
            }, 300), { passive: true });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Add your form submission logic here
                console.log('Form submitted successfully');
            }
        });
    });
}

// Input validation helper
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;

    if (input.hasAttribute('required') && !value) {
        isValid = false;
    } else if (input.type === 'email' && value) {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    input.classList.toggle('invalid', !isValid);
    return isValid;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading state
    document.querySelector('.loading')?.classList.add('loaded');

    // Initialize all features
    initMobileMenu();
    initLazyLoading();
    initSmoothScroll();
    initScrollAnimations();
    initCounters();
    initFormValidation();

    // Handle window resize with debounce
    const handleResize = debounce(() => {
        if (window.innerWidth >= 768) {
            document.querySelector('.mobile-menu')?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);

    window.addEventListener('resize', handleResize, { passive: true });
});

// Export functions for use in other scripts if needed
window.siteUtils = {
    initMobileMenu,
    initLazyLoading,
    initScrollAnimations,
    initCounters,
    initFormValidation
};
