// Google Analytics 4 Configuration
// Place this in your root directory and include in all pages

// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = 'G-8CXEMKMPC3'; // Done: Replace with your actual GA4 ID

// Google Analytics 4 Setup
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID, {
    // Enhanced measurement settings
    enhanced_measurement: true,
    page_title: document.title,
    page_location: window.location.href,
    
    // Custom parameters for better tracking
    custom_map: {
        'custom_parameter_1': 'app_section',
        'custom_parameter_2': 'user_type'
    },
    
    // Privacy settings (GDPR compliant)
    anonymize_ip: true,
    allow_google_signals: false, // Set to true if you want Google Signals
    allow_ad_personalization_signals: false, // Set based on your privacy policy
    
    // Performance and accuracy settings
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
    
    // Additional tracking enhancements
    transport_type: 'beacon',
    allow_enhanced_conversions: false // For privacy compliance
});

// Enhanced E-commerce tracking for app downloads and purchases
function trackAppDownload(source = 'website') {
    gtag('event', 'app_download_intent', {
        event_category: 'engagement',
        event_label: source,
        custom_parameter_1: 'hero_section',
        value: 1
    });
    
    // Also track as conversion
    gtag('event', 'conversion', {
        send_to: GA_MEASUREMENT_ID,
        event_category: 'app_store',
        event_label: 'download_click'
    });
}

// Track pricing plan interactions
function trackPricingInteraction(plan, action) {
    gtag('event', 'pricing_interaction', {
        event_category: 'engagement',
        event_label: `${plan}_${action}`,
        custom_parameter_1: 'pricing_section',
        value: plan === 'pro' ? 9.99 : 0
    });
}

// Track feature interactions
function trackFeatureEngagement(feature, section) {
    gtag('event', 'feature_engagement', {
        event_category: 'engagement',
        event_label: feature,
        custom_parameter_1: section
    });
}

// Track blog engagement
function trackBlogEngagement(article, action) {
    gtag('event', 'blog_engagement', {
        event_category: 'content',
        event_label: `${article}_${action}`,
        custom_parameter_1: 'blog_section'
    });
}

// Track workflow animation interactions
function trackWorkflowStep(step, method = 'auto') {
    gtag('event', 'workflow_interaction', {
        event_category: 'engagement',
        event_label: `step_${step}`,
        custom_parameter_1: 'workflow_section',
        custom_parameter_2: method // 'auto' or 'manual'
    });
}

// Track contact form submissions
function trackContactForm(success = true) {
    gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
        event_category: 'engagement',
        event_label: 'contact_form',
        custom_parameter_1: 'contact_section'
    });
}

// Track scroll depth
let scrollDepthTracked = {25: false, 50: false, 75: false, 100: false};

function trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    Object.keys(scrollDepthTracked).forEach(depth => {
        if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
            scrollDepthTracked[depth] = true;
            gtag('event', 'scroll_depth', {
                event_category: 'engagement',
                event_label: `${depth}_percent`,
                value: parseInt(depth)
            });
        }
    });
}

// Track time on page
let startTime = Date.now();
let timeTracked = {30: false, 60: false, 120: false, 300: false};

function trackTimeOnPage() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    Object.keys(timeTracked).forEach(seconds => {
        if (timeSpent >= seconds && !timeTracked[seconds]) {
            timeTracked[seconds] = true;
            gtag('event', 'time_on_page', {
                event_category: 'engagement',
                event_label: `${seconds}_seconds`,
                value: parseInt(seconds)
            });
        }
    });
}

// Initialize tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track page view with additional context
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        custom_parameter_1: getPageSection(),
        custom_parameter_2: getDeviceType()
    });
    
    // Set up scroll tracking
    window.addEventListener('scroll', trackScrollDepth);
    
    // Set up time tracking
    setInterval(trackTimeOnPage, 10000); // Check every 10 seconds
    
    // Track app store clicks
    document.querySelectorAll('a[href*="apps.apple.com"], a[href="#"]').forEach(link => {
        if (link.textContent.toLowerCase().includes('download') || 
            link.textContent.toLowerCase().includes('app store')) {
            link.addEventListener('click', function(e) {
                trackAppDownload(getClickSource(this));
            });
        }
    });
    
    // Track pricing interactions
    document.querySelectorAll('[data-plan]').forEach(element => {
        element.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan') || 'unknown';
            trackPricingInteraction(plan, 'click');
        });
    });
    
    // Track workflow interactions
    document.querySelectorAll('.workflow-step, .workflow-step-mobile').forEach(step => {
        step.addEventListener('click', function() {
            const stepName = this.getAttribute('data-step');
            trackWorkflowStep(stepName, 'manual');
        });
    });
    
    // Track blog clicks
    document.querySelectorAll('a[href*="blog"]').forEach(link => {
        link.addEventListener('click', function() {
            const article = this.href.split('/').pop().replace('.html', '');
            trackBlogEngagement(article, 'click');
        });
    });
    
    // Track external links
    document.querySelectorAll('a[href^="http"]:not([href*="asaubhagya.github.io"])').forEach(link => {
        link.addEventListener('click', function() {
            gtag('event', 'external_link_click', {
                event_category: 'engagement',
                event_label: this.hostname,
                transport_type: 'beacon'
            });
        });
    });
});

// Utility functions
function getPageSection() {
    const path = window.location.pathname;
    if (path.includes('/meetly/')) {
        if (path.includes('blog')) return 'blog';
        if (path.includes('contact')) return 'contact';
        if (path.includes('privacy')) return 'privacy';
        if (path.includes('terms')) return 'terms';
        return 'landing';
    }
    return 'portfolio';
}

function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

function getClickSource(element) {
    const section = element.closest('section');
    if (section) {
        return section.id || 'unknown_section';
    }
    return 'unknown';
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trackAppDownload,
        trackPricingInteraction,
        trackFeatureEngagement,
        trackBlogEngagement,
        trackWorkflowStep,
        trackContactForm
    };
}

// Make functions available globally
window.MeetlyAnalytics = {
    trackAppDownload,
    trackPricingInteraction,
    trackFeatureEngagement,
    trackBlogEngagement,
    trackWorkflowStep,
    trackContactForm
}; 