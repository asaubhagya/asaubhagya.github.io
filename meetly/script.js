// Countdown Timer
function updateCountdown() {
    // Set the date we're counting down to (14 days from now)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 14);
    
    const now = new Date().getTime();
    const distance = countDownDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    // Update the countdown elements
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
}

// Update countdown every minute
updateCountdown();
setInterval(updateCountdown, 60000);

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const stepItems = document.querySelectorAll('.step-item');
const totalSlides = slides.length;

// Map slides to steps (simplified to 3 steps)
const slideToStepMap = [0, 0, 1, 1, 1, 2, 2]; // Slides 0-1: Record, 2-4: Transcribe, 5-6: Share

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    stepItems.forEach(step => step.classList.remove('active'));
    
    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    // Highlight corresponding step
    const stepIndex = slideToStepMap[index];
    if (stepItems[stepIndex]) {
        stepItems[stepIndex].classList.add('active');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance carousel every 3 seconds
let carouselInterval = setInterval(nextSlide, 3000);

// Add click handlers for indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        
        // Reset the auto-advance timer
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 3000);
    });
});

// Add click handlers for steps
stepItems.forEach((step, index) => {
    step.addEventListener('click', () => {
        // Find first slide for this step
        const slideIndex = slideToStepMap.indexOf(index);
        if (slideIndex !== -1) {
            currentSlide = slideIndex;
            showSlide(currentSlide);
            
            // Reset the auto-advance timer
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, 3000);
        }
    });
});

// Pause carousel on hover
const carousel = document.querySelector('.demo-carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 3000);
    });
}

// Smooth scroll for anchor links
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
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and use case cards
document.querySelectorAll('.feature-card, .use-case-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add hover effect to CTA buttons
document.querySelectorAll('.cta-button, .cta-button-large').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}); 