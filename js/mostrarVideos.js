$(document).ready(function () {
    // Verifica token
    const authToken = localStorage.getItem('token');
    const restrictedUserId = localStorage.getItem('restrictedUserId');
    if (!authToken || !restrictedUserId) {
        window.location.href = '/index.html';
        return;
    }

    obtenerPlaylists(); // Cargar playlists al inicio

    // Limpiar el reproductor al cerrar el modal
    $('#videoModal').on('hidden.bs.modal', function () {
        document.getElementById('videoPlayer').src = '';
    });
});

// Función para obtener y mostrar las playlists asignadas al usuario restringido
const obtenerPlaylists = async () => {
    try {
        const authToken = localStorage.getItem('token');
        const restrictedUserId = localStorage.getItem('restrictedUserId');
        if (!authToken || !restrictedUserId) {
            throw new Error('Token o ID de usuario restringido no proporcionado');
        }

        const response = await fetch('http://localhost:3000/playlists/restringido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ restrictedUserId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener las playlists');
        }

        const playlists = await response.json();
        if (playlists.length === 0) {
            alert('No hay playlists asignadas a este perfil.');
        }
        mostrarPlaylists(playlists);
    } catch (error) {
        console.error('Error al obtener playlists:', error);
        alert('Hubo un error al cargar las playlists: ' + error.message);
    }
};

// Función para mostrar las playlists en la tabla
const mostrarPlaylists = (playlists) => {
    const listaPlaylists = document.getElementById('lista-playlists');
    if (listaPlaylists) {
        listaPlaylists.innerHTML = '';
        playlists.forEach(playlist => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${playlist.nombre}</td>
                <td>${playlist.totalVideos || 0}</td>
                <td>
                    <button class="btn btn-primary" onclick="mostrarVideos('${playlist._id}', '${playlist.nombre}')">Ver Videos</button>
                </td>
            `;
            listaPlaylists.appendChild(tr);
        });
    }
};

// Función para extraer el ID del video de la URL de YouTube
const obtenerVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// Función para reproducir el video en el modal
const reproducirVideo = (videoId, videoNombre) => {
    if (videoId) {
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        document.getElementById('videoModalLabel').textContent = `Reproduciendo: ${videoNombre}`;
        $('#videoModal').modal('show');
    } else {
        alert('No se pudo cargar el video. La URL no es válida.');
    }
};

// Función para mostrar los videos de una playlist seleccionada
const mostrarVideos = async (playlistId, playlistNombre) => {
    try {
        const authToken = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/videos/playlist/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los videos');
        }

        const videos = await response.json();
        document.getElementById('playlistsSection').style.display = 'none';
        document.getElementById('videosSection').style.display = 'block';
        document.getElementById('nombrePlaylistSeleccionada').textContent = playlistNombre;

        const listaVideos = document.getElementById('lista-videos');
        if (listaVideos) {
            listaVideos.innerHTML = '';
            videos.forEach(video => {
                // Obtener el ID del video y la URL de la miniatura
                const videoId = obtenerVideoId(video.url);
                const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : 'https://via.placeholder.com/320x180?text=Sin+Miniatura';

                const card = document.createElement('div');
                card.className = 'col-md-4 col-sm-6 mb-4';
                card.innerHTML = `
                    <div class="video-card">
                        <img src="${thumbnailUrl}" alt="Miniatura de ${video.nombre}">
                        <div class="video-card-body">
                            <h5 class="video-card-title">${video.nombre}</h5>
                            <p class="video-card-text">${video.descripcion || 'Sin descripción'}</p>
                            <button class="btn video-card-btn" onclick="reproducirVideo('${videoId}', '${video.nombre}')">Reproducir</button>
                        </div>
                    </div>
                `;
                listaVideos.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error al obtener videos:', error);
        alert('Hubo un error al cargar los videos: ' + error.message);
    }
};

// Función para volver a la lista de playlists
const volverAPlaylists = () => {
    document.getElementById('videosSection').style.display = 'none';
    document.getElementById('playlistsSection').style.display = 'block';
    obtenerPlaylists();
};

// Función para salir
function salir() {
    localStorage.removeItem('restrictedUserId');
    window.location.href = '/inicio.html';
}