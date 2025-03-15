document.addEventListener('DOMContentLoaded', function () {
    // Verifica si hay un token en el localStorage
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        // Si no hay token, redirige a una página de inicio de sesión o muestra un mensaje de error
        window.location.href = '/index.html'; // Cambia la ruta según tu estructura de archivos
        return;
    }

    // Si hay un token, carga los perfiles
    cargarPerfiles();

    document.getElementById('administrarPerfilesBtn').addEventListener('click', function () {
        $('#adminPinModal').modal('show');
    });
    
});

async function cargarPerfiles() {
    const authToken = localStorage.getItem('token');
    try {
        const respuesta = await fetch('http://localhost:3000/usuarios', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const perfiles = await respuesta.json();

        const contenedor = document.getElementById('contenedor-perfiles');
        contenedor.innerHTML = ''; // Limpiar el contenedor antes de cargar nuevos perfiles

        perfiles.forEach(perfil => {
            const col = document.createElement('div');
            col.className = 'text-muted col-6 col-sm-4 col-md-3 col-lg-2 mb-3 perfil'; // Añade la clase 'perfil' aquí
            col.innerHTML = `
<img src="${perfil.avatar}" class="img-fluid rounded mb-2 text-white" alt="Perfil de ${perfil.nombreCompleto}" data-id="${perfil._id}" data-pin="${perfil.pin}">
<p>${perfil.nombreCompleto}</p>
`;
            col.querySelector('img').addEventListener('click', function () {
                const userId = this.getAttribute('data-id');
                const userPin = this.getAttribute('data-pin');
                // Guarda el userId y userPin para usarlos más tarde
                document.getElementById('pinForm').setAttribute('data-user-id', userId);
                document.getElementById('pinForm').setAttribute('data-user-pin', userPin);
                $('#pinModal').modal('show');
            });
            contenedor.appendChild(col);
        });
    } catch (error) {
        console.error('Error al cargar perfiles:', error);
    }
}

document.getElementById('pinForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el envío normal del formulario
    const userPinInput = document.getElementById('userPin').value;
    const userPinExpected = this.getAttribute('data-user-pin');

    if (userPinInput === userPinExpected) {
        $('#pinModal').modal('hide');
        alert('PIN correcto, accediendo al perfil...');
        window.location.href = '/mostrarVideos.html';
    } else {
        alert('PIN incorrecto, inténtalo de nuevo.');
    }
});

async function verificarAdminPin() {
    const adminPinInput = document.getElementById('adminPin').value;
    const authToken = localStorage.getItem('token');

    if (!authToken) {
        alert('No estás autorizado');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/verificarPin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: authToken, userPin: adminPinInput }) // Asegúrate de que el backend espera 'userPin' o cambia según sea necesario
        });

        if (response.ok) {
            const data = await response.json();
            alert('PIN correcto, accediendo a la administración...');
            window.location.href = '/addUser.html';

            $('#adminPinModal').modal('hide');
        } else {
            const error = await response.json();
            alert(error.error); // "PIN incorrecto, inténtalo de nuevo."
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al verificar el PIN');
    }
}