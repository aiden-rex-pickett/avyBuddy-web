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
            headers: {
                'X-XSRF-TOKEN': getCsrfTokenRegistration(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString(),
        });
        if (response.ok) {
            window.location.href = "/account/" + document.getElementById('username').value;
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
function getCsrfTokenRegistration() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
    return '';
}
