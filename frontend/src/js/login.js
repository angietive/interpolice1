// Función para mostrar mensajes de estado en el login
function mostrarMensaje(tipo, mensaje) {
    const messageDiv = document.getElementById('login-message');
    messageDiv.textContent = mensaje;
    messageDiv.className = 'message-container show';
    if (tipo === 'success') {
        messageDiv.style.color = '#10b981'; // verde
    } else if (tipo === 'error') {
        messageDiv.style.color = '#ef4444'; // rojo
    } else {
        messageDiv.style.color = '#f59e0b'; // amarillo
    }
}
// Función para mostrar/ocultar el loader del botón de login
function mostrarCargando(cargando) {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    if (cargando) {
        loginBtn.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.style.opacity = '1';
    } else {
        loginBtn.disabled = false;
        btnText.style.opacity = '1';
        btnLoader.style.opacity = '0';
    }
}
// Función para validar formato de email
function validarEmail(email) {
    // Expresión regular simple para validar email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// Toggle para mostrar/ocultar contraseña
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = this.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A16.77 16.77 0 0 1 6.06 6.06L17.94 17.94Z" stroke="currentColor" stroke-width="2"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A16.16 16.16 0 0 1 19.36 8.36" stroke="currentColor" stroke-width="2"/>
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        `;
    }
});

// Manejo del formulario de login
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    
    // Limpiar mensajes anteriores
    messageDiv.textContent = '';
    messageDiv.className = 'message-container';
    
    // Validaciones básicas
    if (!email || !password) {
        mostrarMensaje('error', 'Por favor completa todos los campos');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarMensaje('error', 'Por favor ingresa un email válido');
        return;
    }
    
    // Mostrar estado de carga
    mostrarCargando(true);
    
    try {
        const response = await fetch('http://localhost:4100/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.estado === 'ok') {
            // Guardar información del usuario en sessionStorage para el dashboard (sin token)
            sessionStorage.setItem('user', JSON.stringify({
                id: data.usuario.id_usuario,
                nombre: data.usuario.nombre,
                email: data.usuario.email,
                rol: data.usuario.rol,
                codigo: data.usuario.codigo,
                telefono: data.usuario.telefono,
                permisos: data.permisos || []
            }));

            mostrarMensaje('success', `¡Bienvenido, ${data.usuario.nombre}! Redirigiendo...`);

            // Redireccionar automáticamente según el campo 'redireccion' de la respuesta
            if (data.redireccion) {
                setTimeout(() => {
                    window.location.href = data.redireccion;
                }, 1500);
            } else {
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }
            
    } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = data.mensaje || 'Credenciales incorrectas';
    }
} catch (err) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Error de conexión con el servidor. Intenta de nuevo.';
}
});

// Verificar si ya hay una sesión activa al cargar la página (sin token)
document.addEventListener('DOMContentLoaded', function() {
    const usuario = sessionStorage.getItem('user');
    // Solo redirigir si NO estamos ya en una página de dashboard
    const rutasDashboard = ['/administrador.html', '/general.html', '/policia.html', '/secretaria.html'];
    const pathActual = window.location.pathname;
    if (usuario && !rutasDashboard.includes(pathActual)) {
        verificarSesion();
    }
});

function verificarSesion() {
    // Solo verifica si hay usuario en sessionStorage y redirige según el rol
    const usuario = JSON.parse(sessionStorage.getItem('user'));
    if (usuario && usuario.rol) {
        const rutasPorRol = {
            'administrador': '/administrador.html',
            'general': '/general.html',
            'policia': '/policia.html',
            'secretaria': '/secretaria.html'
        };
        window.location.href = rutasPorRol[usuario.rol] || '/dashboard';
    } else {
        sessionStorage.removeItem('user');
    }
}