// --- Scroll to top on page load/refresh ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
}


document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    window.onload = () => {
        if (preloader) {
            preloader.classList.add('loaded');
        }
    };
    
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('loaded');
        }
    }, 2000);

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('.nav-links a, .hero-buttons a');
    const navbar = document.querySelector('.navbar');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                
                if (targetElement) {
                    let offsetTop = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Scroll-triggered Animations using Intersection Observer ---
    const sectionContents = document.querySelectorAll('.section-content');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.20
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('is-visible')) {
                    entry.target.classList.add('is-visible');
                }
                const sectionId = entry.target.id;
                setActiveNavLink(sectionId);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sectionContents.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Function to set active navigation link ---
    function setActiveNavLink(currentSectionId) {
        const allNavLinks = document.querySelectorAll('.nav-links a');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    // Initial check for the hero section
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('is-visible');
        setActiveNavLink('home');
    }

    // --- Handle Contact Form Submission with Fetch API ---
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            // Clear previous messages
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            formMessage.style.display = 'none';

            const formData = new FormData(this);

            try {
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    formMessage.textContent = result.message;
                    formMessage.classList.add('success');
                    contactForm.reset();
                } else {
                    formMessage.textContent = result.message || 'An error occurred. Please try again.';
                    formMessage.classList.add('error');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.textContent = 'A network error occurred. Please check your connection and try again.';
                formMessage.classList.add('error');
            } finally {
                formMessage.style.display = 'block';
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});