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
    
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonHTML = submitButton.innerHTML;

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Stop the form from submitting the default way
            
            const form = e.target;
            const data = new FormData(form);

            // Give visual feedback that the form is processing
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // --- SUCCESS ---
                    formMessage.textContent = "Thank you! Your message has been sent.";
                    formMessage.className = 'form-message success';
                    form.reset(); // Clear the form fields
                    
                    // Change button text and permanently disable all form elements
                    submitButton.innerHTML = 'Message Sent!';
                    
                    const formElements = form.elements;
                    for (let i = 0; i < formElements.length; i++) {
                        formElements[i].disabled = true; // This disables inputs, textarea, and the button
                    }
                } else {
                    // --- SERVER ERROR ---
                    // Try to get a more specific error from Formspree
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formMessage.textContent = "Oops! There was a server problem. Please try again.";
                        }
                    }).catch(() => {
                        formMessage.textContent = "Oops! An unknown server error occurred.";
                    });
                    
                    formMessage.className = 'form-message error';
                    submitButton.innerHTML = originalButtonHTML;
                    submitButton.disabled = false;
                }
            }).catch(error => {
                // --- NETWORK ERROR ---
                console.error("Form submission network error:", error);
                formMessage.textContent = "Oops! A network error occurred. Please try again.";
                formMessage.className = 'form-message error';
                submitButton.innerHTML = originalButtonHTML;
                submitButton.disabled = false;
            }).finally(() => {
                 // Show the message div regardless of outcome
                 formMessage.style.display = 'block';
            });
        });
    }
});
