document.addEventListener('DOMContentLoaded', function () {
    // Verifica si hay un token en el localStorage
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      // Si no hay token, redirige a una página de inicio de sesión o muestra un mensaje de error
      window.location.href = '/index.html'; // Cambia la ruta según tu estructura de archivos
      return;
    }
  });

  const listaVideos = document.getElementById('lista-videos');

  // Función para obtener y mostrar los videos
  const obtenerVideos = async () => {
    try {
      const authToken = localStorage.getItem('token'); // Suponiendo que el token se almacena en localStorage
      if (!authToken) {
        throw new Error('Token de autorización no proporcionado');
      }

      const response = await fetch('http://localhost:3000/videos', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los videos');
      }

      const data = await response.json();
      mostrarVideos(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Función para mostrar los videos en la tabla
  const mostrarVideos = (videos) => {
    listaVideos.innerHTML = '';
    videos.forEach(video => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${video.nombre}</td>
        <td>${video.url}</td>
        <td>
          <button class="btn btn-primary" onclick="mostrarModalEditar('${video._id}', '${video.nombre}', '${video.url}')">Editar</button>
          <button class="btn btn-danger" onclick="eliminarVideo('${video._id}')">Eliminar</button>
        </td>
      `;
      listaVideos.appendChild(tr);
    });
  };

  // Función para mostrar el modal de edición
  const mostrarModalEditar = (id, nombre, url) => {
    $('#editarVideoModal').modal('show');
    document.getElementById('editNombre').value = nombre;
    document.getElementById('editUrl').value = url;
    document.getElementById('editNombre').setAttribute('data-id', id);
  };

  // Función para guardar los cambios del video editado
  const guardarCambios = async () => {
    const id = document.getElementById('editNombre').getAttribute('data-id');
    const nuevoNombre = document.getElementById('editNombre').value;
    const nuevaUrl = document.getElementById('editUrl').value;
    if (id && nuevoNombre && nuevaUrl) {
      try {
        const response = await fetch(`http://localhost:3000/videos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nombre: nuevoNombre, url: nuevaUrl })
        });
        if (!response.ok) {
          throw new Error('Error al editar el video');
        }
        obtenerVideos();
        $('#editarVideoModal').modal('hide');
      } catch (error) {
        console.error(error.message);
      }
    }
  };

document.addEventListener('DOMContentLoaded', function () {
    const formAgregarVideo = document.getElementById('formAgregarVideo');
    formAgregarVideo.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario
        AgregarVideo();
    });
});

function AgregarVideo() {
    const nombre = document.getElementById('nombre').value;
    const url = document.getElementById('url').value;
    const descripcion = document.getElementById('descripcion').value;
    const token = localStorage.getItem('token');

    // Validaciones
    if (!nombre || !url) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    fetch('http://localhost:3000/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Incluir el token de autorización en el encabezado
        },
        body: JSON.stringify({ nombre, url, descripcion })
    })
        .then(response => {
            if (response.ok) {
                alert('Video agregado exitosamente');
                window.location.href = '/playlists.html'; // Redirigir a la lista de playlists
            } else {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar video:', error);
            alert('Hubo un error al procesar la solicitud');
        });

  }

  // Función para eliminar un video
  const eliminarVideo = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
      try {
        const response = await fetch(`http://localhost:3000/videos/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el video');
        }
        obtenerVideos();
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  // Cargar los videos al cargar la página
  obtenerVideos();
  function redirectaddUser() {
    window.location.href = '/addUser.html';
  }
  function redirectaddVideo() {
    window.location.href = '/addVideo.html';
  }
  function salir() {
    window.location.href = '/inicio.html';
  }
