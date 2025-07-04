// Booking form functionality

let currentStep = 1;
let userPhone = '';
let verificationCode = '';
let verifiedPhone = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingForm();
    setMinDate();
});

function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', handleFormSubmit);
    
    // Initialize phone input formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneInput);
    }
    
    // Initialize date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.addEventListener('change', loadAvailableTimeSlots);
    }
    
    // Initialize rating for any rating inputs
    initializeRatingInput();
}

function formatPhoneInput(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 0 && !value.startsWith('20')) {
        value = '20' + value;
    }
    
    if (value.length > 2) {
        value = value.substring(0, 12); // Limit to 12 digits (20 + 10)
    }
    
    // Format as +20 XXXXXXXXXX
    if (value.length > 2) {
        value = '+20 ' + value.substring(2);
    } else {
        value = '+' + value;
    }
    
    event.target.value = value;
}

function setMinDate() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.min = minDate;
}

function nextStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    
    if (currentStep === 1) {
        if (!validateStep1()) return;
        sendVerificationCode();
    } else if (currentStep === 2) {
        if (!verifiedPhone) {
            showNotification('Please verify your phone number first', 'error');
            return;
        }
    }
    
    currentStepElement.classList.remove('active');
    currentStep++;
    
    const nextStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    nextStepElement.classList.add('active');
}

function prevStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    currentStepElement.classList.remove('active');
    
    currentStep--;
    
    const prevStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    prevStepElement.classList.add('active');
}

function validateStep1() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    
    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    }
    
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!window.dentalClinic.isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone) {
        showError('phoneError', 'Phone number is required');
        isValid = false;
    } else if (!window.dentalClinic.isValidEgyptianPhone(phone)) {
        showError('phoneError', 'Please enter a valid Egyptian phone number (+20 XXXXXXXXXX)');
        isValid = false;
    }
    
    if (isValid) {
        userPhone = phone;
        document.getElementById('phoneDisplay').textContent = phone;
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

async function sendVerificationCode() {
    try {
        const response = await window.dentalClinic.apiRequest('/api/send-verification', {
            method: 'POST',
            body: JSON.stringify({
                phone: userPhone,
                email: document.getElementById('email').value
            })
        });
        
        if (response.success) {
            verificationCode = response.code; // In production, this would be sent via SMS
            window.dentalClinic.showNotification('Verification code sent to your phone', 'success');
        } else {
            window.dentalClinic.showNotification(response.message || 'Failed to send verification code', 'error');
        }
    } catch (error) {
        console.error('Error sending verification code:', error);
        window.dentalClinic.showNotification('Error sending verification code', 'error');
    }
}

async function verifyPhone() {
    const enteredCode = document.getElementById('verificationCode').value.trim();
    
    if (!enteredCode) {
        showError('codeError', 'Please enter the verification code');
        return;
    }
    
    try {
        const response = await window.dentalClinic.apiRequest('/api/verify-phone', {
            method: 'POST',
            body: JSON.stringify({
                phone: userPhone,
                code: enteredCode
            })
        });
        
        if (response.success) {
            verifiedPhone = true;
            window.dentalClinic.showNotification('Phone verified successfully!', 'success');
            nextStep();
        } else {
            showError('codeError', response.message || 'Invalid verification code');
        }
    } catch (error) {
        console.error('Error verifying phone:', error);
        showError('codeError', 'Error verifying phone number');
    }
}

async function resendCode() {
    try {
        await sendVerificationCode();
    } catch (error) {
        console.error('Error resending code:', error);
        window.dentalClinic.showNotification('Error resending code', 'error');
    }
}

async function loadAvailableTimeSlots() {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    
    if (!dateInput.value) return;
    
    try {
        const response = await window.dentalClinic.apiRequest(`/api/available-slots?date=${dateInput.value}`);
        
        // Clear existing options except the first one
        timeSelect.innerHTML = '<option value="">Select time</option>';
        
        if (response.availableSlots && response.availableSlots.length > 0) {
            response.availableSlots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot.time;
                option.textContent = slot.display;
                timeSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No available slots for this date';
            option.disabled = true;
            timeSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading time slots:', error);
        window.dentalClinic.showNotification('Error loading available time slots', 'error');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateStep3()) return;
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: userPhone,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        notes: document.getElementById('notes').value.trim()
    };
    
    try {
        const response = await window.dentalClinic.apiRequest('/api/book-appointment', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (response.success) {
            window.dentalClinic.showNotification('Appointment booked successfully!', 'success');
            
            // Show success message
            document.querySelector('.booking-container').innerHTML = `
                <div class="booking-success">
                    <div class="success-icon">✅</div>
                    <h2>Appointment Booked Successfully!</h2>
                    <div class="appointment-details">
                        <p><strong>Date:</strong> ${formatDate(formData.date)}</p>
                        <p><strong>Time:</strong> ${formatTime(formData.time)}</p>
                        <p><strong>Service:</strong> ${getServiceName(formData.service)}</p>
                        <p><strong>Patient:</strong> ${formData.name}</p>
                    </div>
                    <p>A confirmation email has been sent to ${formData.email}</p>
                    <div class="success-actions">
                        <a href="index.html" class="btn btn-primary">Back to Home</a>
                        <a href="book.html" class="btn btn-outline">Book Another</a>
                    </div>
                </div>
            `;
            
            // Add success styles
            if (!document.querySelector('.booking-success-styles')) {
                const style = document.createElement('style');
                style.className = 'booking-success-styles';
                style.textContent = `
                    .booking-success {
                        text-align: center;
                        padding: 3rem;
                        background: white;
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    }
                    .success-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    .appointment-details {
                        background: #f8fafc;
                        padding: 1.5rem;
                        border-radius: 0.5rem;
                        margin: 1.5rem 0;
                        text-align: left;
                    }
                    .appointment-details p {
                        margin: 0.5rem 0;
                    }
                    .success-actions {
                        margin-top: 2rem;
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                `;
                document.head.appendChild(style);
            }
            
        } else {
            window.dentalClinic.showNotification(response.message || 'Failed to book appointment', 'error');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        window.dentalClinic.showNotification('Error booking appointment', 'error');
    }
}

function validateStep3() {
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    
    if (!service) {
        showError('serviceError', 'Please select a service');
        isValid = false;
    }
    
    if (!date) {
        showError('dateError', 'Please select a date');
        isValid = false;
    }
    
    if (!time) {
        showError('timeError', 'Please select a time');
        isValid = false;
    }
    
    return isValid;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getServiceName(serviceValue) {
    const services = {
        'cleaning': 'Teeth Cleaning',
        'whitening': 'Teeth Whitening',
        'root-canal': 'Root Canal',
        'filling': 'Dental Filling',
        'extraction': 'Tooth Extraction',
        'crown': 'Dental Crown',
        'implant': 'Dental Implant',
        'braces': 'Braces Consultation'
    };
    return services[serviceValue] || serviceValue;
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
            
            stars.forEach((s, i) => {
                s.classList.toggle('active', i < rating);
            });
        });
        
        star.addEventListener('mouseover', () => {
            stars.forEach((s, i) => {
                s.style.color = i <= index ? '#fbbf24' : '#d1d5db';
            });
        });
    });
    
    ratingInput.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingField.value);
        stars.forEach((s, i) => {
            s.style.color = i < currentRating ? '#fbbf24' : '#d1d5db';
        });
    });
}