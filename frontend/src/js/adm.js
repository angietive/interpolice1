// dashboard.js - Funcionalidad del Dashboard Administrador INTERPOLICE

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!checkAuthentication()) {
        window.location.href = '../index.html';
        return;
    }

    // Elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    const currentTimeElement = document.getElementById('currentTime');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Estado de la aplicación
    let currentSection = 'dashboard';
    let isLoading = false;
    let sidebarCollapsed = false;

    // Inicializar aplicación
    init();

    function init() {
        setupUserInfo();
        setupSidebar();
        setupNavigation();
        setupTimeDisplay();
        setupEventListeners();
        loadDashboardData();
        setupTables();
        setupCharts();
        
        // Aplicar animaciones de entrada
        animateElementsIn();
    }

    // Verificar autenticación
    function checkAuthentication() {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (!user.rol) {
            return false;
        }
        // Verificar que el usuario tenga permisos de administrador
        if (user.rol !== 'administrador') {
            alert('No tienes permisos para acceder a esta sección');
            return false;
        }
        return true;
    }

    // Configurar información del usuario
    function setupUserInfo() {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        const userNameElement = document.getElementById('userName');
        const userInitialsElement = document.getElementById('userInitials');
        
        if (userNameElement && user.nombre) {
            userNameElement.textContent = user.nombre;
        }
        
        if (userInitialsElement && user.nombre) {
            const initials = user.nombre.split(' ')
                .map(name => name.charAt(0).toUpperCase())
                .slice(0, 2)
                .join('');
            userInitialsElement.textContent = initials;
        }
    }

    // Configurar sidebar
    function setupSidebar() {
        // Toggle sidebar en desktop
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebarCollapsed = !sidebarCollapsed;
                sidebar.classList.toggle('collapsed', sidebarCollapsed);
                
                // Guardar preferencia
                localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
            });
        }

        // Toggle sidebar en mobile
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Restaurar estado del sidebar
        const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (savedCollapsed) {
            sidebarCollapsed = true;
            sidebar.classList.add('collapsed');
        }

        // Cerrar sidebar en mobile al hacer click fuera
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    }

    // Configurar navegación
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                navigateToSection(section);
                
                // Cerrar sidebar en mobile
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                }
            });
        });
    }

    // Navegar a sección
    function navigateToSection(section) {
        // Actualizar nav activo
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }

        // Mostrar sección correspondiente
        contentSections.forEach(contentSection => {
            contentSection.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Actualizar título
        updatePageTitle(section);
        
        // Cargar datos específicos de la sección
        loadSectionData(section);
        
        currentSection = section;
        
        // Actualizar URL sin recargar página
        history.pushState({section}, '', `#${section}`);
    }

    // Actualizar título de página
    function updatePageTitle(section) {
        const titles = {
            'dashboard': 'Panel de Administración',
            'usuarios': 'Gestión de Usuarios',
            'ciudadanos': 'Gestión de Ciudadanos',
            'delitos': 'Registro de Delitos',
            'reportes': 'Reportes y Estadísticas',
            'configuracion': 'Configuración del Sistema'
        };
        
        pageTitle.textContent = titles[section] || 'Sistema INTERPOLICE';
    }

    // Configurar display de tiempo
    function setupTimeDisplay() {
        if (currentTimeElement) {
            updateTime();
            setInterval(updateTime, 1000);
        }
    }

    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        currentTimeElement.textContent = timeString;
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Refresh activity
        const refreshActivityBtn = document.getElementById('refreshActivity');
        if (refreshActivityBtn) {
            refreshActivityBtn.addEventListener('click', loadRecentActivity);
        }

        // Botones de acciones
        setupActionButtons();
        
        // Filtros y búsquedas
        setupFilters();
        
        // Configuración
        setupConfigurationHandlers();

        // Handle browser back/forward
        window.addEventListener('popstate', function(e) {
            if (e.state && e.state.section) {
                navigateToSection(e.state.section);
            }
        });

        // Handle window resize
        window.addEventListener('resize', handleResize);
    }

    // Configurar botones de acción
    function setupActionButtons() {
        // Botón agregar usuario
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => openUserModal());
        }

        // Botón agregar ciudadano
        const addCiudadanoBtn = document.getElementById('addCiudadanoBtn');
        if (addCiudadanoBtn) {
            addCiudadanoBtn.addEventListener('click', () => openCiudadanoModal());
        }

        // Botón agregar delito
        const addDelitoBtn = document.getElementById('addDelitoBtn');
        if (addDelitoBtn) {
            addDelitoBtn.addEventListener('click', () => openDelitoModal());
        }

        // Botones de exportación
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const chartType = this.getAttribute('data-chart');
                exportChart(chartType);
            });
        });
    }

    // Configurar filtros
    function setupFilters() {
        // Filtros de usuarios
        const searchUsers = document.getElementById('searchUsers');
        const roleFilter = document.getElementById('roleFilter');
        
        if (searchUsers) {
            searchUsers.addEventListener('input', debounce(() => filterUsers(), 300));
        }
        
        if (roleFilter) {
            roleFilter.addEventListener('change', filterUsers);
        }

        // Filtros de ciudadanos
        const searchCiudadanos = document.getElementById('searchCiudadanos');
        const planetaFilter = document.getElementById('planetaFilter');
        
        if (searchCiudadanos) {
            searchCiudadanos.addEventListener('input', debounce(() => filterCiudadanos(), 300));
        }
        
        if (planetaFilter) {
            planetaFilter.addEventListener('change', filterCiudadanos);
        }

        // Filtros de delitos
        const searchDelitos = document.getElementById('searchDelitos');
        const fechaFilter = document.getElementById('fechaFilter');
        const gravedadFilter = document.getElementById('gravedadFilter');
        
        if (searchDelitos) {
            searchDelitos.addEventListener('input', debounce(() => filterDelitos(), 300));
        }
        
        if (fechaFilter) {
            fechaFilter.addEventListener('change', filterDelitos);
        }
        
        if (gravedadFilter) {
            gravedadFilter.addEventListener('change', filterDelitos);
        }
    }

    // Configurar handlers de configuración
    function setupConfigurationHandlers() {
        const saveConfigBtn = document.getElementById('saveConfigBtn');
        const resetConfigBtn = document.getElementById('resetConfigBtn');
        const backupBtn = document.getElementById('backupBtn');
        const optimizeBtn = document.getElementById('optimizeBtn');

        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', saveConfiguration);
        }

        if (resetConfigBtn) {
            resetConfigBtn.addEventListener('click', resetConfiguration);
        }

        if (backupBtn) {
            backupBtn.addEventListener('click', createBackup);
        }

        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', optimizeDatabase);
        }
    }

    // Cargar datos del dashboard
    async function loadDashboardData() {
        showLoading();
        
        try {
            // Simular carga de datos
            await Promise.all([
                loadStats(),
                loadRecentActivity(),
                loadChartData()
            ]);
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
            showNotification('Error al cargar los datos', 'error');
        } finally {
            hideLoading();
        }
    }

    // Cargar estadísticas
    async function loadStats() {
        // Simular datos (reemplazar con llamadas reales a la API)
        const stats = {
            activeUsers: 124,
            totalCitizens: 15847,
            monthlyDelitos: 387,
            pendingAmonestaciones: 23
        };

        // Actualizar elementos del DOM
        updateStatElement('activeUsers', stats.activeUsers);
        updateStatElement('totalCitizens', stats.totalCitizens);
        updateStatElement('monthlyDelitos', stats.monthlyDelitos);
        updateStatElement('pendingAmonestaciones', stats.pendingAmonestaciones);
    }

    function updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            // Animar el número
            animateNumber(element, 0, value, 1000);
        }
    }

    // Cargar actividad reciente
    async function loadRecentActivity() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        // Simular datos de actividad
        const activities = [
            {
                type: 'success',
                icon: 'user',
                text: '<strong>Nuevo usuario registrado:</strong> Oficial Martinez (Policía)',
                time: 'Hace 15 minutos'
            },
            {
                type: 'warning',
                icon: 'file',
                text: '<strong>Delito registrado:</strong> Conducir en estado de embriaguez - Planeta Marte',
                time: 'Hace 32 minutos'
            },
            {
                type: 'primary',
                icon: 'chart',
                text: '<strong>Reporte generado:</strong> Estadísticas mensuales exportadas a Excel',
                time: 'Hace 1 hora'
            },
            {
                type: 'danger',
                icon: 'alert',
                text: '<strong>Amonestación generada:</strong> $400 por embriaguez pública - Ciudadano #QR45782',
                time: 'Hace 2 horas'
            }
        ];

        // Actualizar lista de actividad
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    ${getActivityIcon(activity.icon)}
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    function getActivityIcon(type) {
        const icons = {
            user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>',
            file: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/></svg>',
            chart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2"/></svg>',
            alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/></svg>'
        };
        return icons[type] || icons.alert;
    }

    // Configurar tablas
    function setupTables() {
        loadUsersTable();
        loadCiudadanosTable();
        loadDelitosTable();
    }

    // Cargar tabla de usuarios
    async function loadUsersTable() {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        try {
            const response = await fetch('http://localhost:4100/usuarios');
            if (!response.ok) throw new Error('Error al obtener usuarios');
            const data = await response.json();
            // Adaptar a la respuesta real: {estado: 'ok', data: [...]}
            const users = Array.isArray(data.data) ? data.data : [];
            if (!Array.isArray(users)) throw new Error('Respuesta de usuarios no es un array');

            if (users.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6">No hay usuarios registrados</td></tr>`;
                return;
            }

            tableBody.innerHTML = users.map(user => {
                // Mapear campos reales
                const activo = user.activo === 1 || user.activo === true;
                const ultimoAcceso = user.ultimo_acceso || user.ultimoAcceso || '';
                // Usar rol_nombre que viene del backend con el JOIN
                const rolNombre = user.rol_nombre || user.rol || 'Sin rol';
                return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.875rem;">
                                ${(user.nombre || '').split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <span style="font-weight: 500;">${user.nombre || ''}</span>
                        </div>
                    </td>
                    <td>${user.email || ''}</td>
                    <td>
                        <span class="status-badge ${getRoleBadgeClass(rolNombre)}">
                            ${formatRol(rolNombre)}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge ${activo ? 'success' : 'danger'}">
                            ${activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td>${ultimoAcceso ? formatDateTime(ultimoAcceso) : ''}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-outline" onclick="editUser(${user.id_usuario || user.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                Editar
                            </button>
                            <button class="btn-outline" onclick="toggleUserStatus(${user.id_usuario || user.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; ${!activo ? 'border-color: #10b981; color: #10b981;' : 'border-color: #ef4444; color: #ef4444;'}">
                                ${activo ? 'Desactivar' : 'Activar'}
                            </button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="6">Error al cargar usuarios</td></tr>`;
            console.error(error);
        }
    }

    // Cargar tabla de ciudadanos
    async function loadCiudadanosTable() {
        const tableBody = document.getElementById('ciudadanosTableBody');
        if (!tableBody) return;

        try {
            const response = await fetch('http://localhost:4100/ciudadanosTodos');
            if (!response.ok) throw new Error('Error al obtener ciudadanos');
            const data = await response.json();
            // Adaptar a la respuesta real: {estado: 'ok', data: [...]}
            const ciudadanos = Array.isArray(data.data) ? data.data : [];
            if (!Array.isArray(ciudadanos)) throw new Error('Respuesta de ciudadanos no es un array');

            if (ciudadanos.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6">No hay ciudadanos registrados</td></tr>`;
                return;
            }

            tableBody.innerHTML = ciudadanos.map(ciudadano => {
                // Mapear campos reales según tu base de datos
                // id_ciudadano, nombre_completo, codigo_qr, id_planeta_origen, activo, etc.
                const activo = ciudadano.activo === 1 || ciudadano.activo === true;
                // Si tienes planeta como objeto, ajusta aquí:
                const planeta = ciudadano.planeta || ciudadano.id_planeta_origen || '';
                // Si tienes totalDelitos, úsalo, si no, pon 0
                const totalDelitos = ciudadano.totalDelitos || 0;
                return `
                <tr>
                    <td style="font-weight: 500;">${ciudadano.nombre_completo || ciudadano.nombre || ''}</td>
                    <td>
                        <code style="background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                            ${ciudadano.codigo_qr || ciudadano.codigoQR || ''}
                        </code>
                    </td>
                    <td>
                        <span class="status-badge primary">${planeta}</span>
                    </td>
                    <td>
                        <span style="font-weight: 600; color: ${totalDelitos > 5 ? '#ef4444' : totalDelitos > 0 ? '#f59e0b' : '#10b981'};">
                            ${totalDelitos}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge ${activo ? 'success' : 'danger'}">
                            ${activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-outline" onclick="viewCiudadano(${ciudadano.id_ciudadano || ciudadano.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                Ver
                            </button>
                            <button class="btn-outline" onclick="editCiudadano(${ciudadano.id_ciudadano || ciudadano.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                Editar
                            </button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="6">Error al cargar ciudadanos</td></tr>`;
            console.error(error);
        }
    }

    // Cargar tabla de delitos
    async function loadDelitosTable() {
        const tableBody = document.getElementById('delitosTableBody');
        if (!tableBody) return;

        try {
            const response = await fetch('http://localhost:4100/delitos');
            if (!response.ok) throw new Error('Error al obtener delitos');
            const data = await response.json();
            const delitos = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);

            if (delitos.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="8">No hay delitos registrados</td></tr>`;
                return;
            }

            tableBody.innerHTML = delitos.map(delito => `
                <tr>
                    <td>${delito.fecha_delito || ''}</td>
                    <td>${delito.hora_delito || ''}</td>
                    <td>${delito.nombre_ciudadano || ''}</td>
                    <td>${delito.lugar || ''}</td>
                    <td>${delito.descripcion || ''}</td>
                    <td>${delito.nombre_planeta || ''}</td>
                    <td>${delito.nombre_usuario || ''}</td>
                    <td>${delito.fecha_registro || ''}</td>
                    <td>${delito.fecha_actualizacion || ''}</td>
                    <td>${delito.nombre_delito || ''}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-outline" onclick="viewCiudadano(${delito.id_delito || ''})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                Ver
                            </button>
                            <button class="btn-outline" onclick="editCiudadano(${delito.id_delito || ''})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                Editar
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="8">Error al cargar delitos</td></tr>`;
            console.error(error);
        }
    }

    // Configurar gráficas
    function setupCharts() {
        // Simulación de gráficas (reemplazar con Chart.js real)
        const planetChart = document.getElementById('planetChart');
        const delitosChart = document.getElementById('delitosChart');

        if (planetChart) {
            planetChart.innerHTML = `
                <div style="text-align: center; color: #64748b;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 1rem;">
                        <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2"/>
                        <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <p>Gráfica de Delitos por Planeta</p>
                    <small>Datos disponibles próximamente</small>
                </div>
            `;
        }

        if (delitosChart) {
            delitosChart.innerHTML = `
                <div style="text-align: center; color: #64748b;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 1rem;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="2"/>
                        <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <p>Tipos de Delitos Más Frecuentes</p>
                    <small>Datos disponibles próximamente</small>
                </div>
            `;
        }
    }

    // Funciones de formato
    function getRoleBadgeClass(rol) {
        const classes = {
            'administrador': 'danger',
            'general': 'warning', 
            'policia': 'primary',
            'secretaria': 'success'
        };
        // Normalizar el rol a minúsculas para comparación
        const normalizedRol = rol?.toLowerCase();
        return classes[normalizedRol] || 'primary';
    }

    function formatRol(rol) {
        // Si ya es un nombre formateado del backend, devolverlo tal como está
        // Si es un código, formatearlo apropiadamente
        const roles = {
            'administrador': 'Administrador',
            'general': 'General',
            'policia': 'Policía',
            'secretaria': 'Secretaria'
        };
        
        // Si el rol ya está en formato de nombre, devolverlo con la primera letra en mayúscula
        if (!roles[rol?.toLowerCase()]) {
            return rol ? rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase() : 'Sin rol';
        }
        
        return roles[rol?.toLowerCase()] || rol || 'Sin rol';
    }

    function getGravedadBadgeClass(gravedad) {
        const classes = {
            'menor': 'success',
            'grave': 'warning',
            'muy_grave': 'danger'
        };
        return classes[gravedad] || 'primary';
    }

    function formatGravedad(gravedad) {
        const gravedades = {
            'menor': 'Menor',
            'grave': 'Grave',
            'muy_grave': 'Muy Grave'
        };
        return gravedades[gravedad] || gravedad;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Funciones de filtrado
    function filterUsers() {
        const searchTerm = document.getElementById('searchUsers')?.value.toLowerCase() || '';
        const roleFilter = document.getElementById('roleFilter')?.value || '';
        
        // Aquí implementarías la lógica de filtrado
        console.log('Filtrando usuarios:', { searchTerm, roleFilter });
        // Recargar tabla con filtros aplicados
        loadUsersTable();
    }

    function filterCiudadanos() {
        const searchTerm = document.getElementById('searchCiudadanos')?.value.toLowerCase() || '';
        const planetaFilter = document.getElementById('planetaFilter')?.value || '';
        
        console.log('Filtrando ciudadanos:', { searchTerm, planetaFilter });
        loadCiudadanosTable();
    }

    function filterDelitos() {
        const searchTerm = document.getElementById('searchDelitos')?.value.toLowerCase() || '';
        const fechaFilter = document.getElementById('fechaFilter')?.value || '';
        const gravedadFilter = document.getElementById('gravedadFilter')?.value || '';
        
        console.log('Filtrando delitos:', { searchTerm, fechaFilter, gravedadFilter });
        loadDelitosTable();
    }

    // Cargar datos específicos de sección
    function loadSectionData(section) {
        switch (section) {
            case 'usuarios':
                loadUsersTable();
                break;
            case 'ciudadanos':
                loadCiudadanosTable();
                break;
            case 'delitos':
                loadDelitosTable();
                break;
            case 'reportes':
                loadReportsData();
                break;
            case 'configuracion':
                loadConfigurationData();
                break;
        }
    }

    // Cargar datos de reportes
    function loadReportsData() {
        console.log('Cargando datos de reportes...');
    }

    // Cargar datos de configuración
    function loadConfigurationData() {
        console.log('Cargando configuración...');
    }

    // Función para manejar logout
    function handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '../index.html';
        }
    }

    // Funciones de modal (placeholders)
    function openUserModal() {
        const modal = document.getElementById('modalAgregarUsuario');
        const modalBackdrop = document.getElementById('modalBackdrop');
        if (modal && modalBackdrop) {
            modal.style.display = 'block';
            modalBackdrop.style.display = 'block';
            console.log('Abrir modal de agregar usuario');
        }
    }

    function openCiudadanoModal() {
        showNotification('Modal de ciudadano en desarrollo', 'info');
    }

    function openDelitoModal() {
        showNotification('Modal de delito en desarrollo', 'info');
    }

    // Funciones de acciones (placeholders)
    window.editUser = function(id) {
        showNotification(`Editando usuario ${id}`, 'info');
    }

    window.toggleUserStatus = function(id) {
        showNotification(`Cambiando estado del usuario ${id}`, 'info');
    }

    window.viewCiudadano = function(id) {
        showNotification(`Viendo ciudadano ${id}`, 'info');
    }

    window.editCiudadano = function(id) {
        showNotification(`Editando ciudadano ${id}`, 'info');
    }

    window.viewDelito = function(id) {
        showNotification(`Viendo delito ${id}`, 'info');
    }

    window.editDelito = function(id) {
        showNotification(`Editando delito ${id}`, 'info');
    }

    // Funciones de reportes
    window.generateReport = function(type) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`Reporte ${type} generado exitosamente`, 'success');
        }, 2000);
    }

    window.exportToExcel = function(type) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`Exportando ${type} a Excel...`, 'success');
            
            // Simular descarga
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,Datos del reporte ' + type;
            link.download = `reporte_${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();
        }, 1500);
    }

    // Funciones de configuración
    function saveConfiguration() {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification('Configuración guardada exitosamente', 'success');
        }, 1000);
    }

    function resetConfiguration() {
        if (confirm('¿Estás seguro de que deseas restablecer la configuración?')) {
            showNotification('Configuración restablecida', 'info');
        }
    }

    function createBackup() {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification('Respaldo creado exitosamente', 'success');
        }, 3000);
    }

    function optimizeDatabase() {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification('Base de datos optimizada', 'success');
        }, 2000);
    }

    // Funciones de utilidad
    function showLoading() {
        isLoading = true;
        loadingOverlay.classList.add('active');
    }

    function hideLoading() {
        isLoading = false;
        loadingOverlay.classList.remove('active');
    }

    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 4000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar notificación
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(start + range * progress);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function animateElementsIn() {
        const elements = document.querySelectorAll('.stat-card, .chart-card, .card');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function handleResize() {
        // Cerrar sidebar en mobile si la ventana se redimensiona
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open');
        }
    }

    function exportChart(chartType) {
        showNotification(`Exportando gráfica ${chartType}...`, 'info');
        
        // Simular exportación
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,Datos de la gráfica ' + chartType;
            link.download = `grafica_${chartType}_${new Date().toISOString().split('T')[0]}.png`;
            link.click();
            
            showNotification('Gráfica exportada exitosamente', 'success');
        }, 1000);
    }

    // Cargar datos de gráficas
    async function loadChartData() {
        // Aquí cargarías datos reales para las gráficas
        console.log('Cargando datos de gráficas...');
    }

    // Manejar navegación inicial basada en URL
    const initialSection = window.location.hash.slice(1) || 'dashboard';
    navigateToSection(initialSection);

    // Modal Agregar Usuario
    const modal = document.getElementById('modalAgregarUsuario');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('closeAgregarUsuario');
    const form = document.getElementById('formAgregarUsuario');

    // Botón para abrir el modal (debes agregar un botón with id="openAgregarUsuario" en tu HTML donde lo necesites)
    const openBtn = document.getElementById('openAgregarUsuario');
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            modalBackdrop.style.display = 'block';
        });
    }

    // Cerrar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            modalBackdrop.style.display = 'none';
        });
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function() {
            modal.style.display = 'none';
            modalBackdrop.style.display = 'none';
        });
    }


    // Modal Agregar Usuario - Enviar datos al backend
    const formUsuario = document.getElementById('formAgregarUsuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(formUsuario);
            const data = Object.fromEntries(formData.entries());
            
            // Mapear el rol a id_rol
            const rolesMap = {
                'administrador': 1,
                'general': 4,
                'policia': 2,
                'secretaria': 3
            };
            
            // Preparar datos para el backend
            const userData = {
                nombre: data.nombre,
                email: data.email,
                password_hash: data.password_hash, // El backend lo encriptará
                id_rol: rolesMap[data.rol] || 1,
                activo: parseInt(data.activo) || 1,
                telefono: data.telefono || null,
                codigo: data.codigo || null
            };
            
            console.log('Enviando datos:', userData);
            
            try {
                const response = await fetch('http://localhost:4100/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                const result = await response.json();
                console.log('Respuesta del servidor:', result);
                
                if (!response.ok || result.estado === 'error') {
                    throw new Error(result.mensaje || 'Error al agregar usuario');
                }
                
                // Éxito
                formUsuario.reset();
                document.getElementById('modalAgregarUsuario').style.display = 'none';
                document.getElementById('modalBackdrop').style.display = 'none';
                
                // Recargar tabla
                if (typeof loadUsersTable === 'function') {
                    loadUsersTable();
                }
                
                showNotification('Usuario agregado correctamente', 'success');
                
            } catch (error) {
                console.error('Error al agregar usuario:', error);
                showNotification('Error al agregar usuario: ' + error.message, 'error');
            }
        });
    }
});