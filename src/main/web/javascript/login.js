const loginForm = document.getElementById('loginForm');
const errorAreaLogin = document.getElementById('errorSpace');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', document.getElementById('username').value);
    formData.append('password', document.getElementById('password').value);
    try {
        const response = await fetch('/apis/login', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': getCsrfTokenLogin(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
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
            errorAreaLogin.textContent = "Invalid Username or Password";
            errorAreaLogin.style.display = "block";
        }
    }
    catch (error) {
        console.error(error);
    }
});
function getCsrfTokenLogin() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
    return '';
}
