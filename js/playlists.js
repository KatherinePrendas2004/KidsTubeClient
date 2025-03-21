document.addEventListener('DOMContentLoaded', function () {
    obtenerPlaylists();
});

const obtenerPlaylists = async () => {
    try {
        const response = await fetch('http://localhost:3000/playlists');
        if (!response.ok) {
            throw new Error('Error al obtener las playlists');
        }
        const playlists = await response.json();
        mostrarPlaylists(playlists);
    } catch (error) {
        console.error(error.message);
    }
};

const mostrarPlaylists = (playlists) => {
    const listaPlaylists = document.getElementById('lista-playlists');
    listaPlaylists.innerHTML = '';
    playlists.forEach(playlist => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${playlist.nombre} (${playlist.cantidadVideos} videos)</h3>
            <button onclick="verVideos('${playlist._id}')">Ver Videos</button>
        `;
        listaPlaylists.appendChild(div);
    });
};

const verVideos = (playlistId) => {
    // Redirigir a la página de videos de la playlist seleccionada
    window.location.href = `/videos.html?playlistId=${playlistId}`;
};

const redirectAddVideo = () => {
    window.location.href = '/addVideo.html';
};
