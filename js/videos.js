document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('playlistId');
    obtenerVideos(playlistId);
});

const obtenerVideos = async (playlistId) => {
    try {
        const response = await fetch(`http://localhost:3000/playlists/${playlistId}/videos`);
        if (!response.ok) {
            throw new Error('Error al obtener los videos de la playlist');
        }
        const videos = await response.json();
        mostrarVideos(videos);
    } catch (error) {
        console.error(error.message);
    }
};

const mostrarVideos = (videos) => {
    const listaVideos = document.getElementById('lista-videos');
    listaVideos.innerHTML = '';
    videos.forEach(video => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h4>${video.nombre}</h4>
            <p>${video.url}</p>
            <button onclick="editarVideo('${video._id}')">Editar</button>
            <button onclick="eliminarVideo('${video._id}')">Eliminar</button>
        `;
        listaVideos.appendChild(div);
    });
};

const editarVideo = (videoId) => {
    // Redirigir a la página de edición de video
    window.location.href = `/editVideo.html?videoId=${videoId}`;
};

const eliminarVideo = async (videoId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
        try {
            const response = await fetch(`http://localhost:3000/videos/${videoId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el video');
            }
            // Volver a cargar los videos después de eliminar
            const urlParams = new URLSearchParams(window.location.search);
            const playlistId = urlParams.get('playlistId');
            obtenerVideos(playlistId);
        } catch (error) {
            console.error(error.message);
        }
    }
};

const redirectAddVideo = () => {
    window.location.href = '/addVideo.html';
};
