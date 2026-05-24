const loginForm = document.getElementById('loginForm');
const errorSpace = document.getElementById('errorSpace');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', document.getElementById('username').value);
    formData.append('password', document.getElementById('password').value);
    try {
        const response = await fetch('/apis/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });
        if (response.ok) {
            if (document.referrer && !document.referrer.includes('/login')) {
                window.history.back();
            }
            else {
                window.location.href = "/";
            }
        }
        else {
            errorSpace.textContent = "Invalid Username or Password";
            errorSpace.style.display = "block";
        }
    }
    catch (error) {
        console.error(error);
    }
});
