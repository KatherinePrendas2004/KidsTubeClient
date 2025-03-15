 // Este script depende de jQuery, asegúrate de que jQuery esté incluido en tu HTML.
 document.addEventListener('DOMContentLoaded', function () {
    // Verifica si hay un token en el localStorage
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        // Si no hay token, redirige a una página de inicio de sesión o muestra un mensaje de error
        window.location.href = '/index.html'; // Cambia la ruta según tu estructura de archivos
        return;
    }
});

$(document).ready(function () {
    obtenerUsuarios(); // Cargar los usuarios al cargar la página
    $('#seleccionarImagenModal').on('show.bs.modal', function () {
        $('.modal').not($(this)).each(function () {
            $(this).css('z-index', 1039);
        });
        obtenerImagenes();
    }).on('hidden.bs.modal', function () {
        $('.modal').css('z-index', 1050);
    });
});

// Función para obtener y mostrar los usuarios
const obtenerUsuarios = async () => {
    try {
        const authToken = localStorage.getItem('token'); // Suponiendo que el token se almacena en localStorage
        if (!authToken) {
            throw new Error('Token de autorización no proporcionado');
        }

        const response = await fetch('http://localhost:3000/usuarios', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const usuarios = await response.json();
        mostrarUsuarios(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
};

// Función para mostrar los usuarios en la tabla
const mostrarUsuarios = (usuarios) => {
    const listaUsuarios = document.getElementById('lista-usuarios');
    listaUsuarios.innerHTML = '';
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
    <td>${usuario.nombreCompleto}</td>
    <td>${usuario.pin}</td>
    <td><img src="${usuario.avatar}" style="width:50px;height:50px;"></td>
    <td>${usuario.edad}</td>
    <td>
        <button class="btn btn-primary" onclick="mostrarModalEditar('${usuario._id}', '${usuario.nombreCompleto}', '${usuario.pin}', '${usuario.avatar}', '${usuario.edad}')">Editar</button>
        <button class="btn btn-danger" onclick="eliminarUsuario('${usuario._id}')">Eliminar</button>
    </td>
`;
        listaUsuarios.appendChild(tr);
    });
};

// Función para agregar un usuario
const agregarUsuario = async () => {
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const pin = document.getElementById('pin').value;
    const avatar = document.getElementById('avatar').value; // Asegúrate de que este campo no esté vacío
    const edad = document.getElementById('edad').value;
    const token = localStorage.getItem('token');

    if (!nombreCompleto || !pin || !edad) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validación del PIN
    if (!/^\d{6}$/.test(pin)) {
        alert('El PIN debe contener exactamente 6 números.');
        return;
    }

    // Verifica que realmente tenemos un avatar antes de enviar
    if (!avatar) {
        alert('Por favor, selecciona una imagen de avatar.');
        return; // Detén la ejecución si no hay avatar
    }

    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombreCompleto, pin, avatar, edad })
        });

        if (!response.ok) {
            // Solo intentamos leer el cuerpo de la respuesta si hubo un error.
            const errorData = await response.json(); // Leemos el cuerpo de la respuesta
            console.log(errorData); // Hacemos algo con los datos del error, por ejemplo, mostrarlos en la consola
            alert('Hubo un error al procesar la solicitud: ' + errorData.message);
        } else {
            // Aquí manejas una respuesta exitosa.
            alert('Usuario agregado exitosamente');
            obtenerUsuarios();
            $('#agregarUsuarioModal').modal('hide'); // Cierra el modal
        }

    } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('Hubo un error al procesar la solicitud: ' + error.message);
    }
};

// Función para mostrar el modal de edición con los datos del usuario seleccionado
const mostrarModalEditar = (id, nombreCompleto, pin, avatar, edad) => {
    document.getElementById('editNombreCompleto').value = nombreCompleto;
    document.getElementById('editPin').value = pin;
    document.getElementById('editEdad').value = edad;
    document.getElementById('editImagenSeleccionada').src = avatar;
    document.getElementById('form-editar-usuario').setAttribute('data-id', id);
    $('#editarUsuarioModal').modal('show');
};

// Función para guardar los cambios del usuario editado
const guardarCambiosUsuario = async () => {
    const id = document.getElementById('form-editar-usuario').getAttribute('data-id');
    const nuevoNombreCompleto = document.getElementById('editNombreCompleto').value;
    const nuevoPin = document.getElementById('editPin').value;
    const nuevoAvatar = document.getElementById('editImagenSeleccionada').src;
    const nuevaEdad = document.getElementById('editEdad').value;

    if (!nuevoNombreCompleto || !nuevoPin || !nuevaEdad) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (!/^\d{6}$/.test(nuevoPin)) {
        alert('El PIN debe contener exactamente 6 números.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreCompleto: nuevoNombreCompleto, pin: nuevoPin, avatar: nuevoAvatar, edad: nuevaEdad })
        });

        if (!response.ok) {
            throw new Error('Error al editar el usuario');
        }

        obtenerUsuarios();
        $('#editarUsuarioModal').modal('hide');
    } catch (error) {
        console.error('Error al guardar cambios:', error);
    }
};

// Función para eliminar un usuario
const eliminarUsuario = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            obtenerUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    }
};

// Función para obtener imágenes y mostrarlas en el modal de selección
const obtenerImagenes = async () => {
    // Asume que tienes una endpoint '/photo/images' para obtener las imágenes
    try {
        const response = await fetch('http://localhost:3000/photo/images');
        if (!response.ok) {
            throw new Error('Falló la obtención de imágenes');
        }
        const imagenes = await response.json();
        const contenedorImagenes = document.getElementById('imagenesParaSeleccionar');
        contenedorImagenes.innerHTML = ''; // Limpiar el contenedor

        imagenes.forEach(imagen => {
            const imgElement = document.createElement('img');
            imgElement.src = imagen.imageURL;
            imgElement.style.width = '100px';
            imgElement.style.height = '100px';
            imgElement.style.margin = '10px';
            imgElement.style.cursor = 'pointer';
            imgElement.onclick = function () {
                // Comprobar si estamos editando o añadiendo un nuevo usuario
                if ($('#editarUsuarioModal').hasClass('show')) {
                    document.getElementById('editImagenSeleccionada').src = this.src; // Actualiza la imagen en el modal de edición
                } else {
                    document.getElementById('imagenSeleccionada').src = this.src; // Actualiza la imagen en el modal de agregar
                    document.getElementById('avatar').value = this.src; // Asegúrate de que esta línea esté estableciendo correctamente el valor.
                }
                $('#seleccionarImagenModal').modal('hide'); // Cierra el modal de selección de imagen
            };

            contenedorImagenes.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
    }
};
function redirectaddUser() {
    window.location.href = '/addUser.html';
}
function redirectaddVideo() {
    window.location.href = '/addVideo.html';
}
function salir() {
    window.location.href = '/inicio.html';
}
function salirC() {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    window.location.href = '/index.html';
}