const registerForm = document.getElementById('registerForm');
const errorAreaRegistration = document.getElementById('errorSpace');
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', document.getElementById('username').value);
    formData.append('password', document.getElementById('password').value);
    try {
        const response = await fetch('/apis/register', {
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
            errorAreaRegistration.textContent = "Username already in use!";
            errorAreaRegistration.style.display = "block";
        }
    }
    catch (error) {
        console.error(error);
    }
});
