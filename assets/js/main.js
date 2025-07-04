// Main JavaScript file for the dental clinic website

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Mobile navigation toggle
    initializeMobileNav();
    
    // Load recent reviews on homepage
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        loadRecentReviews();
    }
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize lazy loading
    initializeLazyLoading();
}

// Mobile Navigation
function initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Load Recent Reviews for Homepage
async function loadRecentReviews() {
    const reviewsContainer = document.getElementById('recentReviews');
    if (!reviewsContainer) return;
    
    try {
        const response = await fetch('/api/reviews?limit=3');
        const reviews = await response.json();
        
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = `
                <div class="reviews-empty">
                    <p>No reviews yet. Be the first to share your experience!</p>
                </div>
            `;
            return;
        }
        
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-card fade-in">
                <div class="review-header">
                    <div class="review-name">${review.anonymous ? 'Anonymous' : review.name}</div>
                    <div class="review-date">${formatDate(review.createdAt)}</div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
                <div class="review-text">${review.text}</div>
            </div>
        `).join('');
        
        // Animate the reviews
        setTimeout(() => {
            reviewsContainer.querySelectorAll('.fade-in').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate');
                }, index * 200);
            });
        }, 100);
        
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsContainer.innerHTML = `
            <div class="reviews-empty">
                <p>Unable to load reviews at this time.</p>
            </div>
        `;
    }
}

// Animation Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all animation elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function generateStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(`<span class="star ${i <= rating ? 'active' : ''}">${i <= rating ? '★' : '☆'}</span>`);
    }
    return stars.join('');
}

// Form Validation Helper
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const errorElement = document.getElementById(input.name + 'Error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        if (!input.value.trim()) {
            isValid = false;
            if (errorElement) {
                errorElement.textContent = 'This field is required';
                errorElement.style.display = 'block';
            }
        } else {
            // Additional validation based on input type
            if (input.type === 'email' && !isValidEmail(input.value)) {
                isValid = false;
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address';
                    errorElement.style.display = 'block';
                }
            } else if (input.type === 'tel' && !isValidEgyptianPhone(input.value)) {
                isValid = false;
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid Egyptian phone number';
                    errorElement.style.display = 'block';
                }
            }
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidEgyptianPhone(phone) {
    // Egyptian phone numbers should start with +20 and have 10 digits after
    const phoneRegex = /^\+20[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles if not already present
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
            }
            .notification-success {
                background: #10b981;
            }
            .notification-error {
                background: #ef4444;
            }
            .notification-warning {
                background: #f59e0b;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// API Helper
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(endpoint, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export functions for use in other files
window.dentalClinic = {
    validateForm,
    isValidEmail,
    isValidEgyptianPhone,
    showNotification,
    apiRequest,
    formatDate,
    generateStars
};