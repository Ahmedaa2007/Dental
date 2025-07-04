// Reviews page functionality

let currentPage = 1;
const reviewsPerPage = 6;

document.addEventListener('DOMContentLoaded', function() {
    initializeReviewsPage();
});

function initializeReviewsPage() {
    loadReviews();
    initializeReviewForm();
    initializeRatingInput();
}

async function loadReviews(page = 1) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    const reviewsEmpty = document.getElementById('reviewsEmpty');
    
    if (!reviewsGrid) return;
    
    try {
        const response = await window.dentalClinic.apiRequest(`/api/reviews?page=${page}&limit=${reviewsPerPage}`);
        
        if (response.reviews && response.reviews.length > 0) {
            displayReviews(response.reviews);
            updateReviewsStats(response.stats);
            setupPagination(response.totalPages, page);
            
            if (reviewsEmpty) {
                reviewsEmpty.style.display = 'none';
            }
        } else {
            reviewsGrid.innerHTML = '';
            if (reviewsEmpty) {
                reviewsEmpty.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsGrid.innerHTML = `
            <div class="error-message">
                <p>Unable to load reviews at this time. Please try again later.</p>
            </div>
        `;
    }
}

function displayReviews(reviews) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    
    reviewsGrid.innerHTML = reviews.map(review => `
        <div class="review-card fade-in">
            <div class="review-header">
                <div class="review-name">${review.anonymous ? 'Anonymous' : review.name}</div>
                <div class="review-date">${window.dentalClinic.formatDate(review.createdAt)}</div>
            </div>
            <div class="review-rating">
                ${window.dentalClinic.generateStars(review.rating)}
            </div>
            <div class="review-text">${review.text}</div>
            ${review.service ? `<div class="review-service">Service: ${review.service}</div>` : ''}
        </div>
    `).join('');
    
    // Animate reviews
    setTimeout(() => {
        reviewsGrid.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate');
            }, index * 100);
        });
    }, 100);
}

function updateReviewsStats(stats) {
    const averageRatingElement = document.getElementById('averageRating');
    const totalReviewsElement = document.getElementById('totalReviews');
    const averageStarsElement = document.getElementById('averageStars');
    
    if (stats && averageRatingElement && totalReviewsElement) {
        averageRatingElement.textContent = stats.averageRating.toFixed(1);
        totalReviewsElement.textContent = stats.totalReviews;
        
        if (averageStarsElement) {
            averageStarsElement.innerHTML = window.dentalClinic.generateStars(Math.round(stats.averageRating));
        }
    }
}

function setupPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('reviewsPagination');
    if (!paginationContainer || totalPages <= 1) return;
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="btn btn-outline" onclick="loadReviews(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage ? 'btn-primary' : 'btn-outline';
        paginationHTML += `<button class="btn ${isActive}" onclick="loadReviews(${i})">${i}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="btn btn-outline" onclick="loadReviews(${currentPage + 1})">Next</button>`;
    }
    
    paginationContainer.innerHTML = `
        <div class="pagination-controls">
            ${paginationHTML}
        </div>
    `;
    
    // Add pagination styles
    if (!document.querySelector('.pagination-styles')) {
        const style = document.createElement('style');
        style.className = 'pagination-styles';
        style.textContent = `
            .pagination-controls {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin-top: 2rem;
                flex-wrap: wrap;
            }
            .pagination-controls .btn {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;
    
    reviewForm.addEventListener('submit', handleReviewSubmit);
    
    // Anonymous checkbox functionality
    const anonymousCheckbox = document.getElementById('anonymous');
    const nameInput = document.getElementById('reviewerName');
    
    if (anonymousCheckbox && nameInput) {
        anonymousCheckbox.addEventListener('change', function() {
            if (this.checked) {
                nameInput.disabled = true;
                nameInput.value = '';
            } else {
                nameInput.disabled = false;
            }
        });
    }
}

function initializeRatingInput() {
    const ratingInput = document.getElementById('ratingInput');
    if (!ratingInput) return;
    
    const stars = ratingInput.querySelectorAll('.star-input');
    const ratingField = document.getElementById('rating');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            ratingField.value = rating;
            updateStarDisplay(stars, rating);
        });
        
        star.addEventListener('mouseover', () => {
            highlightStars(stars, index + 1);
        });
    });
    
    ratingInput.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingField.value);
        updateStarDisplay(stars, currentRating);
    });
}

function updateStarDisplay(stars, rating) {
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        star.style.color = index < rating ? '#fbbf24' : '#d1d5db';
    });
}

async function handleReviewSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reviewData = {
        name: formData.get('reviewerName'),
        email: formData.get('reviewerEmail'),
        rating: parseInt(formData.get('rating')),
        text: formData.get('reviewText'),
        anonymous: formData.get('anonymous') === 'on'
    };
    
    // Validate form
    if (!validateReviewForm(reviewData)) return;
    
    try {
        const response = await window.dentalClinic.apiRequest('/api/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
        
        if (response.success) {
            window.dentalClinic.showNotification('Review submitted successfully!', 'success');
            event.target.reset();
            
            // Reset rating display
            const stars = document.querySelectorAll('.star-input');
            updateStarDisplay(stars, 5);
            document.getElementById('rating').value = '5';
            
            // Reload reviews to show the new one
            loadReviews();
        } else {
            window.dentalClinic.showNotification(response.message || 'Failed to submit review', 'error');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        window.dentalClinic.showNotification('Error submitting review', 'error');
    }
}

function validateReviewForm(reviewData) {
    let isValid = true;
    
    // Reset all error displays
    document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    
    if (!reviewData.anonymous && !reviewData.name.trim()) {
        showError('reviewerNameError', 'Name is required when not submitting anonymously');
        isValid = false;
    }
    
    if (!reviewData.email.trim()) {
        showError('reviewerEmailError', 'Email is required');
        isValid = false;
    } else if (!window.dentalClinic.isValidEmail(reviewData.email)) {
        showError('reviewerEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        window.dentalClinic.showNotification('Please select a rating', 'error');
        isValid = false;
    }
    
    if (!reviewData.text.trim()) {
        showError('reviewTextError', 'Review text is required');
        isValid = false;
    } else if (reviewData.text.trim().length < 10) {
        showError('reviewTextError', 'Review must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Add review-specific styles
if (!document.querySelector('.review-styles')) {
    const style = document.createElement('style');
    style.className = 'review-styles';
    style.textContent = `
        .review-service {
            margin-top: 1rem;
            padding: 0.5rem;
            background: #f3f4f6;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            color: #6b7280;
        }
        .error-message {
            text-align: center;
            padding: 2rem;
            color: #ef4444;
            background: #fef2f2;
            border-radius: 0.5rem;
            margin: 1rem 0;
        }
        .star-input {
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .star-input:hover {
            transform: scale(1.1);
        }
        .star-input.active {
            color: #fbbf24;
        }
    `;
    document.head.appendChild(style);
}