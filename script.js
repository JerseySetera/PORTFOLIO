if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
}


document.addEventListener('DOMContentLoaded', () => {

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

    const sectionContents = document.querySelectorAll('.section-content');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.20
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const sectionId = entry.target.id;
                setActiveNavLink(sectionId);
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sectionContents.forEach(section => {
        sectionObserver.observe(section);
    });

    function setActiveNavLink(currentSectionId) {
        const allNavLinks = document.querySelectorAll('.nav-links a');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('is-visible');
        setActiveNavLink('home');
    }

    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        if (!submitButton || !formMessage) {
            console.error("The contact form is missing the submit button or the message div.");
            return;
        }
        
        const originalButtonHTML = submitButton.innerHTML;

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); 
            
            const form = e.target;
            const data = new FormData(form);

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
                formMessage.style.display = 'block';
                if (response.ok) {
                    formMessage.textContent = "Thank you! Your message has been sent.";
                    formMessage.classList.add('success');
                    form.reset(); 
                    
                    submitButton.innerHTML = 'Message Sent!';
                    
                    const formElements = form.elements;
                    for (let i = 0; i < formElements.length; i++) {
                        formElements[i].disabled = true;
                    }
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formMessage.textContent = data.errors.map(error => error.message).join(", ");
                        } else {
                            formMessage.textContent = "Oops! There was a server problem. Please try again.";
                        }
                    }).catch(() => {
                        formMessage.textContent = "Oops! An unknown server error occurred.";
                    });
                    
                    formMessage.classList.add('error');
                    submitButton.innerHTML = originalButtonHTML;
                    submitButton.disabled = false;
                }
            }).catch(error => {
                console.error("Form submission network error:", error);
                formMessage.textContent = "Oops! A network error occurred. Please try again.";
                formMessage.className = 'form-message error';
                submitButton.innerHTML = originalButtonHTML;
                submitButton.disabled = false;
                formMessage.style.display = 'block';
            });
        });
    }

    // --- New Music Player Logic ---
    const musicTracks = document.querySelectorAll('.music-track');

    musicTracks.forEach(track => {
        const player = track.querySelector('.track-player');
        const video = track.querySelector('.track-video');
    
        if (player && video) {
            player.addEventListener('click', () => {
                const isPlaying = player.classList.contains('is-playing');
    
                // Pause all other videos
                document.querySelectorAll('.track-video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                        const otherPlayer = v.closest('.track-player');
                        if (otherPlayer) {
                            otherPlayer.classList.remove('is-playing');
                        }
                        v.controls = false;
                    }
                });
    
                if (isPlaying) {
                    video.pause();
                    video.controls = false;
                } else {
                    video.play();
                    video.controls = true;
                }
                player.classList.toggle('is-playing');
            });
            
            // When video ends, show the play button again
            video.addEventListener('ended', () => {
                player.classList.remove('is-playing');
                video.controls = false;
            });
        }
    });

});