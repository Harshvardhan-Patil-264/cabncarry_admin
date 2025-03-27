// Login Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Check for error parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'invalid') {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.classList.add('show');
        }
    }
});

// Driver Application Form Script
document.addEventListener('DOMContentLoaded', function() {
    const driverApplicationForm = document.getElementById('driverApplicationForm');
    if (driverApplicationForm) {
        driverApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                mail: document.getElementById('mail').value,
                phone: document.getElementById('phone').value,
                license_number: document.getElementById('license_number').value,
                vehicle_type: document.getElementById('vehicle_type').value,
                vehicle_number: document.getElementById('vehicle_number').value,
                address: document.getElementById('address').value
            };

            // Validate form data
            let isValid = true;
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.style.display = 'none');

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.mail)) {
                document.querySelector('#mail + .error-message').style.display = 'block';
                isValid = false;
            }

            // Phone validation
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(formData.phone)) {
                document.querySelector('#phone + .error-message').style.display = 'block';
                isValid = false;
            }

            // Required fields validation
            Object.keys(formData).forEach(key => {
                if (!formData[key]) {
                    document.querySelector(`#${key} + .error-message`).style.display = 'block';
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Submit form data
            fetch('/submit-driver-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('driverApplicationForm').style.display = 'none';
                } else {
                    alert(data.message || 'Error submitting application. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting application. Please try again.');
            });
        });
    }
}); 