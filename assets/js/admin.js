// Admin dashboard functionality

let currentAdmin = null;
let appointments = [];
let reviews = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initializeAdminDashboard();
});

function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        // Verify token with backend
        verifyAdminToken(token);
    } else {
        showLoginForm();
    }
}

async function verifyAdminToken(token) {
    try {
        const response = await window.dentalClinic.apiRequest('/api/admin/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.success) {
            currentAdmin = response.admin;
            showAdminDashboard();
        } else {
            localStorage.removeItem('adminToken');
            showLoginForm();
        }
    } catch (error) {
        console.error('Error verifying admin token:', error);
        localStorage.removeItem('adminToken');
        showLoginForm();
    }
}

function showLoginForm() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    if (currentAdmin) {
        const welcomeElement = document.getElementById('adminWelcome');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome, ${currentAdmin.name || currentAdmin.email}`;
        }
    }
    
    loadDashboardData();
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('adminEmail'),
        password: formData.get('adminPassword')
    };
    
    try {
        const response = await window.dentalClinic.apiRequest('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify(loginData)
        });
        
        if (response.success) {
            localStorage.setItem('adminToken', response.token);
            currentAdmin = response.admin;
            showAdminDashboard();
            window.dentalClinic.showNotification('Login successful', 'success');
        } else {
            window.dentalClinic.showNotification(response.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        window.dentalClinic.showNotification('Login failed', 'error');
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    currentAdmin = null;
    showLoginForm();
    window.dentalClinic.showNotification('Logged out successfully', 'success');
}

function initializeAdminDashboard() {
    // Initialize event listeners for admin controls
    const dailyLimitInput = document.getElementById('dailyLimit');
    const blockDateInput = document.getElementById('blockDate');
    
    if (dailyLimitInput) {
        dailyLimitInput.addEventListener('change', function() {
            if (this.value < 1 || this.value > 20) {
                this.value = 10;
            }
        });
    }
    
    if (blockDateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        blockDateInput.min = today;
    }
}

async function loadDashboardData() {
    try {
        const token = localStorage.getItem('adminToken');
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
        // Load all dashboard data
        const [appointmentsResponse, reviewsResponse, settingsResponse] = await Promise.all([
            window.dentalClinic.apiRequest('/api/admin/appointments', { headers }),
            window.dentalClinic.apiRequest('/api/admin/reviews', { headers }),
            window.dentalClinic.apiRequest('/api/admin/settings', { headers })
        ]);
        
        appointments = appointmentsResponse.appointments || [];
        reviews = reviewsResponse.reviews || [];
        
        updateDashboardStats();
        displayAppointments();
        displayReviews();
        displaySettings(settingsResponse.settings);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        window.dentalClinic.showNotification('Error loading dashboard data', 'error');
    }
}

function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    
    const totalAppointments = appointments.length;
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : '5.0';
    
    document.getElementById('todayAppointments').textContent = todayAppointments.length;
    document.getElementById('totalAppointments').textContent = totalAppointments;
    document.getElementById('totalReviews').textContent = totalReviews;
    document.getElementById('averageRating').textContent = averageRating;
}

function displayAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');
    if (!appointmentsTable) return;
    
    if (appointments.length === 0) {
        appointmentsTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #6b7280;">No appointments found</td>
            </tr>
        `;
        return;
    }
    
    // Sort appointments by date and time
    const sortedAppointments = appointments.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });
    
    appointmentsTable.innerHTML = sortedAppointments.slice(0, 10).map(appointment => `
        <tr>
            <td>${formatDate(appointment.date)}</td>
            <td>${formatTime(appointment.time)}</td>
            <td>${appointment.name}</td>
            <td>${appointment.service}</td>
            <td>
                <span class="status-badge status-${appointment.status}">
                    ${appointment.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewAppointment('${appointment._id}')">
                    View
                </button>
                ${appointment.status === 'confirmed' ? `
                    <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointment._id}')">
                        Cancel
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function displayReviews() {
    const reviewsList = document.getElementById('adminReviewsList');
    if (!reviewsList) return;
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="empty-state">
                <p>No reviews yet</p>
            </div>
        `;
        return;
    }
    
    // Sort reviews by date (newest first)
    const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    reviewsList.innerHTML = sortedReviews.slice(0, 5).map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-name">${review.anonymous ? 'Anonymous' : review.name}</div>
                <div class="review-date">${window.dentalClinic.formatDate(review.createdAt)}</div>
            </div>
            <div class="review-rating">
                ${window.dentalClinic.generateStars(review.rating)}
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

function displaySettings(settings) {
    if (settings) {
        document.getElementById('dailyLimit').value = settings.dailyLimit || 10;
        displayBlockedDates(settings.blockedDates || []);
    }
}

function displayBlockedDates(blockedDates) {
    const blockedDatesList = document.getElementById('blockedDatesList');
    if (!blockedDatesList) return;
    
    if (blockedDates.length === 0) {
        blockedDatesList.innerHTML = '<p style="color: #6b7280;">No blocked dates</p>';
        return;
    }
    
    blockedDatesList.innerHTML = blockedDates.map(date => `
        <div class="blocked-date">
            ${formatDate(date)}
            <button onclick="unblockDate('${date}')" title="Remove block">×</button>
        </div>
    `).join('');
}

async function updateDailyLimit() {
    const dailyLimit = document.getElementById('dailyLimit').value;
    
    try {
        const token = localStorage.getItem('adminToken');
        const response = await window.dentalClinic.apiRequest('/api/admin/settings', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dailyLimit: parseInt(dailyLimit)
            })
        });
        
        if (response.success) {
            window.dentalClinic.showNotification('Daily limit updated successfully', 'success');
        } else {
            window.dentalClinic.showNotification('Failed to update daily limit', 'error');
        }
    } catch (error) {
        console.error('Error updating daily limit:', error);
        window.dentalClinic.showNotification('Error updating daily limit', 'error');
    }
}

async function blockDate() {
    const blockDate = document.getElementById('blockDate').value;
    
    if (!blockDate) {
        window.dentalClinic.showNotification('Please select a date to block', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('adminToken');
        const response = await window.dentalClinic.apiRequest('/api/admin/block-date', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                date: blockDate
            })
        });
        
        if (response.success) {
            window.dentalClinic.showNotification('Date blocked successfully', 'success');
            document.getElementById('blockDate').value = '';
            loadDashboardData(); // Refresh data
        } else {
            window.dentalClinic.showNotification(response.message || 'Failed to block date', 'error');
        }
    } catch (error) {
        console.error('Error blocking date:', error);
        window.dentalClinic.showNotification('Error blocking date', 'error');
    }
}

async function unblockDate(date) {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await window.dentalClinic.apiRequest('/api/admin/unblock-date', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                date: date
            })
        });
        
        if (response.success) {
            window.dentalClinic.showNotification('Date unblocked successfully', 'success');
            loadDashboardData(); // Refresh data
        } else {
            window.dentalClinic.showNotification('Failed to unblock date', 'error');
        }
    } catch (error) {
        console.error('Error unblocking date:', error);
        window.dentalClinic.showNotification('Error unblocking date', 'error');
    }
}

async function viewAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt._id === appointmentId);
    if (!appointment) return;
    
    const appointmentDetails = document.getElementById('appointmentDetails');
    appointmentDetails.innerHTML = `
        <div class="appointment-info">
            <h4>Appointment Details</h4>
            <p><strong>Patient:</strong> ${appointment.name}</p>
            <p><strong>Email:</strong> ${appointment.email}</p>
            <p><strong>Phone:</strong> ${appointment.phone}</p>
            <p><strong>Service:</strong> ${appointment.service}</p>
            <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> ${formatTime(appointment.time)}</p>
            <p><strong>Status:</strong> ${appointment.status}</p>
            ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
            <p><strong>Booked:</strong> ${window.dentalClinic.formatDate(appointment.createdAt)}</p>
        </div>
    `;
    
    // Store current appointment ID for actions
    document.getElementById('appointmentModal').dataset.appointmentId = appointmentId;
    
    openModal('appointmentModal');
}

async function cancelAppointment(appointmentId) {
    if (!appointmentId) {
        appointmentId = document.getElementById('appointmentModal').dataset.appointmentId;
    }
    
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('adminToken');
        const response = await window.dentalClinic.apiRequest(`/api/admin/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.success) {
            window.dentalClinic.showNotification('Appointment cancelled successfully', 'success');
            closeModal('appointmentModal');
            loadDashboardData(); // Refresh data
        } else {
            window.dentalClinic.showNotification('Failed to cancel appointment', 'error');
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        window.dentalClinic.showNotification('Error cancelling appointment', 'error');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Add admin-specific styles
if (!document.querySelector('.admin-styles')) {
    const style = document.createElement('style');
    style.className = 'admin-styles';
    style.textContent = `
        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
        }
        .appointment-info {
            line-height: 1.8;
        }
        .appointment-info p {
            margin: 0.5rem 0;
        }
        .appointment-info h4 {
            margin-bottom: 1rem;
            color: #1e293b;
        }
    `;
    document.head.appendChild(style);
}