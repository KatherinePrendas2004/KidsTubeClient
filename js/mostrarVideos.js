document.addEventListener('DOMContentLoaded', function () {
    // Verifica si hay un token en el localStorage
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        // Si no hay token, redirige a una página de inicio de sesión o muestra un mensaje de error
        window.location.href = '/index.html'; // Cambia la ruta según tu estructura de archivos
        return;
    }
});

const mostrarVideos = (videos) => {
    const videosList = document.getElementById('videosList');
    videosList.innerHTML = ''; // Limpiar lista de videos anterior

    videos.forEach(video => {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';

        const iframe = document.createElement('iframe');
        let videoId;
        if (video.url.includes('youtu.be')) {
            videoId = video.url.split('/').pop();
        } else if (video.url.includes('watch?v=')) {
            videoId = video.url.split('watch?v=')[1].split('&')[0];
        }
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.setAttribute("loading", "lazy"); // Mejora el rendimiento cargando los iframes perezosamente (lazy loading)
        videoContainer.appendChild(iframe);

        videoContainer.addEventListener('click', () => {
            const videoModal = document.getElementById('videoModal');
            const modalIframe = document.getElementById('modalIframe');
            modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // Iniciar autoplay al abrir el modal
            videoModal.style.display = "block";
        });

        const title = document.createElement('div');
        title.className = 'video-title';
        title.innerText = video.nombre;
        videoContainer.appendChild(title);

        videosList.appendChild(videoContainer);
    });
};
// Añadir evento para cerrar el modal
document.querySelector('.close-button').addEventListener('click', () => {
    const videoModal = document.getElementById('videoModal');
    videoModal.style.display = 'none';
    document.getElementById('modalIframe').src = ''; // Detener el video al cerrar
});
const obtenerVideos = async () => {
    // La función obtenerVideos permanece igual
    try {
        const authToken = localStorage.getItem('token');
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
function salir() {
    window.location.href = '/inicio.html';
}
obtenerVideos(); // Llamar a la función al cargar la página