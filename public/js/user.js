document.addEventListener('DOMContentLoaded', () => {
    // Fetch user details from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Display user details or redirect to login page if not logged in
    if (user) {
        document.getElementById('userName').innerText = `${user.firstName} ${user.lastName}`;
        document.getElementById('userEmail').innerText = `Email: ${user.email}`;
        document.getElementById('userPhone').innerText = `Phone: ${user.phone}`;
        document.getElementById('userAddress').innerText = `Address: ${user.address}, ${user.city}, ${user.state}, ${user.zip}`;
    } else {
        window.location.href = 'login.html';
    }

    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
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
        });
    }
});
