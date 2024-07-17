document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');

    // Function to handle user logout
    const handleLogout = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    // Check if the user is already logged in
    const checkLoginStatus = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && window.location.pathname !== '/user.html') {
            window.location.href = 'user.html';
        } else if (!user && window.location.pathname === '/user.html') {
            window.location.href = 'login.html';
        }
    };

    // Call checkLoginStatus on page load
    checkLoginStatus();

    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip')
            };

            // Check if passwords match
            if (data.password !== data.confirmPassword) {
                document.getElementById('message').innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';
                return;
            }

            // Send registration data to server
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    localStorage.setItem('user', JSON.stringify(data));
                    window.location.href = 'user.html';
                } else {
                    document.getElementById('message').innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('message').innerHTML = '<div class="alert alert-danger">An error occurred. Please try again later.</div>';
            });
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const data = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            // Send login data to server
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    window.location.href = 'user.html';
                } else {
                    document.getElementById('message').innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('message').innerHTML = '<div class="alert alert-danger">An error occurred. Please try again later.</div>';
            });
        });
    }

    // Attach logout event listener
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});
