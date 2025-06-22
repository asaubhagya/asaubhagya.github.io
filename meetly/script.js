// DOM Elements
const workflowGifs = document.querySelectorAll('.workflow-gif');
const workflowSteps = document.querySelectorAll('.workflow-step');

// Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            
            if (isMenuOpen) {
                // Close menu
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            } else {
                // Open menu
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            }
        });
        
        // Close menu when clicking on links
        mobileMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    }
});

// Workflow Animation
document.addEventListener('DOMContentLoaded', function() {
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const workflowGifs = document.querySelectorAll('.workflow-gif');
    const workflowStepsMobile = document.querySelectorAll('.workflow-step-mobile');
    const workflowGifsMobile = document.querySelectorAll('.workflow-gif-mobile');
    const workflowSection = document.getElementById('workflow');
    let currentStep = 0;
    let autoInterval;
    let isWorkflowVisible = false;
    const steps = ['record', 'transcribe', 'summarise', 'share'];
    
    // Function to activate a specific step
    function activateStep(stepName) {
        // Reset all desktop steps to inactive state
        workflowSteps.forEach(step => {
            const stepNumber = step.querySelector('.step-number');
            const stepTitle = step.querySelector('.step-title');
            const stepDescription = step.querySelector('.step-description');
            
            stepNumber.classList.remove('bg-soft-black', 'text-white');
            stepNumber.classList.add('bg-gray-300', 'text-gray-600');
            stepTitle.classList.remove('text-soft-black');
            stepTitle.classList.add('text-gray-400');
            stepDescription.classList.remove('text-gray-600');
            stepDescription.classList.add('text-gray-400');
            step.classList.remove('active');
        });
        
        // Reset all mobile steps to inactive state
        workflowStepsMobile.forEach(step => {
            const stepNumber = step.querySelector('.step-number-mobile');
            const stepTitle = step.querySelector('.step-title-mobile');
            const stepDescription = step.querySelector('.step-description-mobile');
            
            stepNumber.classList.remove('bg-soft-black', 'text-white');
            stepNumber.classList.add('bg-gray-300', 'text-gray-600');
            stepTitle.classList.remove('text-soft-black');
            stepTitle.classList.add('text-gray-400');
            stepDescription.classList.remove('text-gray-600');
            stepDescription.classList.add('text-gray-400');
            step.classList.remove('active');
            step.classList.remove('bg-white', 'border-gray-200');
            step.classList.add('bg-gray-50', 'border-gray-200');
        });
        
        // Hide all GIFs
        workflowGifs.forEach(gif => {
            gif.style.opacity = '0';
        });
        workflowGifsMobile.forEach(gif => {
            gif.style.opacity = '0';
        });
        
        // Activate the selected desktop step
        const activeStep = document.querySelector(`[data-step="${stepName}"].workflow-step`);
        const activeGif = document.querySelector(`[data-step="${stepName}"].workflow-gif`);
        
        if (activeStep) {
            const stepNumber = activeStep.querySelector('.step-number');
            const stepTitle = activeStep.querySelector('.step-title');
            const stepDescription = activeStep.querySelector('.step-description');
            
            stepNumber.classList.add('bg-soft-black', 'text-white');
            stepNumber.classList.remove('bg-gray-300', 'text-gray-600');
            stepTitle.classList.add('text-soft-black');
            stepTitle.classList.remove('text-gray-400');
            stepDescription.classList.add('text-gray-600');
            stepDescription.classList.remove('text-gray-400');
            activeStep.classList.add('active');
        }
        
        // Activate the selected mobile step
        const activeStepMobile = document.querySelector(`[data-step="${stepName}"].workflow-step-mobile`);
        const activeGifMobile = document.querySelector(`[data-step="${stepName}"].workflow-gif-mobile`);
        
        if (activeStepMobile) {
            const stepNumber = activeStepMobile.querySelector('.step-number-mobile');
            const stepTitle = activeStepMobile.querySelector('.step-title-mobile');
            const stepDescription = activeStepMobile.querySelector('.step-description-mobile');
            
            stepNumber.classList.add('bg-soft-black', 'text-white');
            stepNumber.classList.remove('bg-gray-300', 'text-gray-600');
            stepTitle.classList.add('text-soft-black');
            stepTitle.classList.remove('text-gray-400');
            stepDescription.classList.add('text-gray-600');
            stepDescription.classList.remove('text-gray-400');
            activeStepMobile.classList.add('active');
            activeStepMobile.classList.add('bg-white', 'border-gray-200');
            activeStepMobile.classList.remove('bg-gray-50');
        }
        
        if (activeGif) {
            activeGif.style.opacity = '1';
        }
        if (activeGifMobile) {
            activeGifMobile.style.opacity = '1';
        }
        
        // Auto-scroll active mobile step to center
        if (activeStepMobile) {
            const container = activeStepMobile.parentElement;
            const cardWidth = activeStepMobile.offsetWidth;
            const containerWidth = container.offsetWidth;
            const cardOffsetLeft = activeStepMobile.offsetLeft;
            
            // Calculate scroll position to center the active card
            const scrollLeft = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
            
            // Smooth scroll to center the active card
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }
    
    // Auto-cycle through steps every 4 seconds
    function cycleSteps() {
        if (isWorkflowVisible) {
            currentStep = (currentStep + 1) % steps.length;
            activateStep(steps[currentStep]);
            
            // Track auto workflow progression
            if (typeof window.MeetlyAnalytics !== 'undefined') {
                window.MeetlyAnalytics.trackWorkflowStep(steps[currentStep], 'auto');
            }
        }
    }
    
    // Start auto-cycling when workflow is visible
    function startWorkflowAnimation() {
        if (!autoInterval && isWorkflowVisible) {
            // Initialize with first step
            activateStep(steps[0]);
            currentStep = 0;
            
            // Start auto-cycling
            autoInterval = setInterval(cycleSteps, 4000);
        }
    }
    
    // Stop auto-cycling when workflow is not visible
    function stopWorkflowAnimation() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
    }
    
    // Intersection Observer for workflow section
    const workflowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isWorkflowVisible = true;
                startWorkflowAnimation();
            } else {
                isWorkflowVisible = false;
                stopWorkflowAnimation();
            }
        });
    }, {
        threshold: 0.3, // Start animation when 30% of workflow section is visible
        rootMargin: '0px 0px -100px 0px'
    });
    
    if (workflowSection) {
        workflowObserver.observe(workflowSection);
    }
    
    // Manual step clicking - Desktop
    workflowSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            const stepName = this.getAttribute('data-step');
            const stepIndex = steps.indexOf(stepName);
            
            if (stepIndex !== -1) {
                currentStep = stepIndex;
                
                // Clear existing interval
                stopWorkflowAnimation();
                
                // Activate clicked step
                activateStep(stepName);
                
                // Restart auto-cycling after 4 seconds if visible
                setTimeout(() => {
                    if (isWorkflowVisible) {
                        startWorkflowAnimation();
                    }
                }, 4000);
            }
        });
    });
    
    // Manual step clicking - Mobile
    workflowStepsMobile.forEach((step, index) => {
        step.addEventListener('click', function() {
            const stepName = this.getAttribute('data-step');
            const stepIndex = steps.indexOf(stepName);
            
            if (stepIndex !== -1) {
                currentStep = stepIndex;
                
                // Clear existing interval
                stopWorkflowAnimation();
                
                // Activate clicked step
                activateStep(stepName);
                
                // Restart auto-cycling after 4 seconds if visible
                setTimeout(() => {
                    if (isWorkflowVisible) {
                        startWorkflowAnimation();
                    }
                }, 4000);
            }
        });
    });
    
    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = 80; // Height of fixed navigation
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navigation bar background and logo on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        const navLogo = document.getElementById('nav-logo');
        const heroSection = document.querySelector('header');
        const heroHeight = heroSection ? heroSection.offsetHeight : 800;
        
        if (window.scrollY > heroHeight * 0.3) {
            // Show logo when scrolled past 30% of hero section
            nav.classList.add('bg-white/95');
            nav.classList.remove('bg-white/90');
            navLogo.classList.remove('opacity-0', '-translate-x-4');
            navLogo.classList.add('opacity-100', 'translate-x-0');
        } else {
            // Hide logo when at top
            nav.classList.add('bg-white/90');
            nav.classList.remove('bg-white/95');
            navLogo.classList.add('opacity-0', '-translate-x-4');
            navLogo.classList.remove('opacity-100', 'translate-x-0');
        }
    });
    
    // Simple analytics placeholder
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Track app store clicks
            if (this.textContent.includes('Download')) {
                console.log('App Store download clicked');
                // Add your analytics tracking here
                trackEvent('app_store_clicked');
            }
        });
    });
    
    // Analytics function placeholder
    function trackEvent(eventName) {
        // Replace with your analytics service
        console.log('Event tracked:', eventName);
    }
});

// Simple analytics placeholder
function trackEvent(eventName, properties = {}) {
    console.log('Event:', eventName, properties);
    // Placeholder for analytics tracking
}

// Track button clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('a[href*="apps.apple.com"], a[href*="app-store"]')) {
        trackEvent('app_store_clicked');
    }
}); 