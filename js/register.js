document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const username = formData.get('username');
            const password = formData.get('password');
            const repeatPassword = formData.get('repeatPassword');
            const pin = formData.get('pin');
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const country = formData.get('country');
            const dateOfBirth = formData.get('dateOfBirth');

            // Validación del PIN
            if (!/^\d{6}$/.test(pin)) {
                alert('El PIN debe contener exactamente 6 números.');
                return;
            }

            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const month = today.getMonth() - birthDate.getMonth();
            if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }


            // Check if passwords match
            if (password !== repeatPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, pin, firstName, lastName, country, dateOfBirth })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Usuario registrado exitosamente');
                    window.location.href = '/index.html'; // Cambia la ruta según tu estructura de archivos
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                alert('Hubo un error al procesar la solicitud');
            }
        });
    }
});
function redirectTologin() {
    window.location.href = '/index.html';
}