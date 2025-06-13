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

    // --- AJAX Contact Form Submission for Formspree ---
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                formMessage.textContent = "Your message has been sent successfully!";
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';

                // Disable the form
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.textContent = 'Sent!';
                const formElements = form.elements;
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = true;
                }
                
            } else {
                // Handle server errors from Formspree
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    formMessage.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    formMessage.textContent = "Oops! There was a problem submitting your form.";
                }
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        } catch (error) {
            // Handle network errors
            formMessage.textContent = "Oops! There was a problem submitting your form.";
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", handleSubmit);
    }
});
