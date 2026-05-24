const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', (document.getElementById('username') as HTMLInputElement).value)
    formData.append('password', (document.getElementById('password') as HTMLInputElement).value)

    try {
        const response = await fetch('/apis/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        if (response.ok) {
            if (document.referrer && !document.referrer.includes('/login')) {
                window.history.back();
            } else {
                window.location.href = "/"
            }
        } else {
            alert('Invalid credentials!');
        }
    } catch (error) {
        console.error('Network error:', error);
    }
})

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
})
