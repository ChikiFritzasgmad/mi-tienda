  <script>
        // =========================================================================
        // CONFIGURACIÓN Y VARIABLES GLOBALES
        // =========================================================================
        const FLOW_MODE = 'sandbox'; // Cambiar a 'live' en producción
        const SITE_URL = 'https://chikifritzasgmad.github.io/mi-tienda/'; 
        const WHATSAPP_NUM = "56936416743";

        // Función mejorada de escape HTML (seguridad XSS)
        function escapeHTML(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/`/g, '&#96;');
        }

        // Supabase
        const supabaseUrl = 'https://elwzheytotfsxzrcsioz.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsd3poZXl0b3Rmc3h6cmNzaW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzE0MzIsImV4cCI6MjA4Njc0NzQzMn0.0WLFkRsWPdYJSL_Oo6TtK0t5P_0cv9pJi95uXm9TKTg';
        const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        
        // Regiones y comunas (completo)
        const regionesYComunas = {
            "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
            "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
            "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
            "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
            "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
            "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Cabildo", "La Ligua", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "Algarrobo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
            "Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
            "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
            "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
            "Ñuble": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
            "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
            "Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
            "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
            "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
            "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico"],
            "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
        };

        // Variables de estado
        let db = []; 
        let adminDb = []; 
        let cart = JSON.parse(localStorage.getItem('papajose_cart')) || [];
        let currentPage = 1;
        const itemsPerPage = 20;
        let totalProductos = 0; 
        let filtroActual = 'todas';
        let busquedaActual = '';
        let lastSearch = '';
        
        let hasOpenedCartAutomatically = false; 
        let searchTimeout; 
        let costoEnvio = 3500; 
        let totalPagarFinal = 0;
        
        let currentUser = null;
        let userProfile = null;
        let productoEnEdicion = null;

        let filtroAdminCategoria = '';
        let filtroAdminTexto = '';

        const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' text-anchor='middle' dy='.3em' fill='%23999'%3ESin Foto%3C/text%3E%3C/svg%3E";

        // =========================================================================
        // EVENTOS INICIALES
        // =========================================================================
        window.addEventListener('popstate', function(event) {
            const modal = document.getElementById('product-modal');
            const authModal = document.getElementById('auth-modal');
            const cartSidebar = document.getElementById('cart-sidebar');
            const leftSidebar = document.getElementById('left-sidebar');
            const adminModal = document.getElementById('admin-modal');
            const stickyBar = document.getElementById('mobile-sticky-bar');

            if (!modal.classList.contains('hidden')) { modal.classList.add('hidden'); document.body.classList.remove('locked'); }
            if (!authModal.classList.contains('hidden')) { closeAuthModal(); }
            if (adminModal && !adminModal.classList.contains('hidden')) { closeAdminModal(); }
            if (cartSidebar.classList.contains('translate-x-0')) { forceCloseCart(); }
            if (!leftSidebar.classList.contains('-translate-x-full')) {
                leftSidebar.classList.add('-translate-x-full');
                document.getElementById('menu-overlay').classList.remove('open');
                document.body.classList.remove('locked');
                if(cart.length > 0 && window.innerWidth < 1024) stickyBar.classList.remove('translate-y-full');
            }
        });

        window.addEventListener('DOMContentLoaded', () => { 
            verificarSesion();
            cargarProductosPagina(1); 
            updateCartUI();
            initSwipeGestures();
            generarMenuCategorias();
            cargarSelectoresRegion(); 
            
            // Preview de imagen en admin
            document.getElementById('producto-imagen-url').addEventListener('input', function(e) {
                const url = e.target.value;
                const previewDiv = document.getElementById('imagen-actual');
                const previewImg = document.getElementById('imagen-preview');
                
                if(url && url.startsWith('http')) {
                    previewImg.src = url;
                    previewDiv.classList.remove('hidden');
                } else {
                    previewDiv.classList.add('hidden');
                }
            });
        });

        // =========================================================================
        // FUNCIONES DE REGIONES Y COMUNAS
        // =========================================================================
        function cargarSelectoresRegion() {
            const selectReg = document.getElementById('reg-region');
            const selectEdit = document.getElementById('edit-region');
            
            let opciones = '<option value="">Seleccione Región...</option>';
            for (let region in regionesYComunas) {
                opciones += `<option value="${region}">${region}</option>`;
            }
            
            if(selectReg) selectReg.innerHTML = opciones;
            if(selectEdit) selectEdit.innerHTML = opciones;
        }

        function actualizarComunas(prefijo) {
            const selectRegion = document.getElementById(`${prefijo}-region`);
            const selectComuna = document.getElementById(`${prefijo}-comuna`);
            const regionElegida = selectRegion.value;

            if (regionElegida && regionesYComunas[regionElegida]) {
                let opciones = '<option value="">Seleccione Comuna...</option>';
                regionesYComunas[regionElegida].forEach(comuna => {
                    opciones += `<option value="${comuna}">${comuna}</option>`;
                });
                selectComuna.innerHTML = opciones;
                selectComuna.disabled = false;
            } else {
                selectComuna.innerHTML = '<option value="">Primero seleccione Región</option>';
                selectComuna.disabled = true;
            }
            actualizarOpcionEnvioSegunDireccion();
        }

        // =========================================================================
        // FUNCIONES DE PRODUCTOS Y CATÁLOGO
        // =========================================================================
        async function cargarProductosPagina(page) {
            document.getElementById('loading-msg').classList.remove('hidden');
            document.getElementById('seccion-catalogo').classList.add('hidden');

            const from = (page - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            try {
                let query = supabaseClient.from('products').select('*', { count: 'exact' });

                if (busquedaActual.length > 0) {
                    query = query.or(`producto.ilike.%${busquedaActual}%,numero_producto.ilike.%${busquedaActual}%`);
                    query = query.order('id', { ascending: false });
                } else {
                    if (filtroActual !== 'todas') {
                        query = query.eq('categoria', filtroActual);
                    }
                    query = query.order('destacado', { ascending: false }); 
                }

                query = query.range(from, to);

                const { data, count, error } = await query;
                if (error) throw error;

                totalProductos = count || 0;

                db = data.map(p => ({
                    id: p.id,
                    sku: p.numero_producto || 'S/N',
                    nombre: p.producto,
                    desc: p.descripcion || 'Sin descripción',
                    cat: p.categoria || 'Otros',
                    precio: Number(p.precio) || 0,
                    img: p.foto || '',
                    disponible: (p.stock || 0) > 0,
                    destacado: p.destacado || 0,
                    stock: p.stock || 0
                }));

                renderGrid(db, page);
                renderPaginationControls(page); 
                renderDestacados(db);

                document.getElementById('loading-msg').classList.add('hidden');
                document.getElementById('seccion-catalogo').classList.remove('hidden');

            } catch (error) {
                console.error(error);
                mostrarToast("Error cargando productos", "error");
            }
        }

        function renderGrid(lista, page) {
            const contenedor = document.getElementById('grid-productos');
            const cantidad = document.getElementById('cantidad-productos');
            cantidad.innerText = totalProductos; 
            
            if(lista.length === 0) { 
                contenedor.innerHTML = `<div class="col-span-full py-10 text-center text-gray-500 bg-white/80 rounded-xl p-6"><p>No se encontraron productos.</p></div>`; 
                document.getElementById('pagination-controls').classList.add('hidden');
                return; 
            }
            
            contenedor.innerHTML = lista.map(p => cardHTML(p)).join(''); 
        }

        function renderPaginationControls(page) {
            const controls = document.getElementById('pagination-controls');
            const totalPages = Math.ceil(totalProductos / itemsPerPage);
            if (totalPages <= 1) { 
                controls.classList.add('hidden'); 
                return; 
            }
            controls.classList.remove('hidden');
            document.getElementById('page-indicator').innerText = `Pág ${page} de ${totalPages}`;
            document.getElementById('btn-prev').disabled = page === 1;
            document.getElementById('btn-next').disabled = page === totalPages;
        }

        function changePage(direction) {
            const newPage = currentPage + direction;
            if (newPage >= 1 && newPage <= Math.ceil(totalProductos / itemsPerPage)) {
                currentPage = newPage;
                cargarProductosPagina(currentPage);
                window.scrollTo({
                    top: document.getElementById('seccion-catalogo').getBoundingClientRect().top + window.pageYOffset - 120, 
                    behavior: 'smooth'
                });
            }
        }

        function resetAndScrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            filtroActual = 'todas';
            busquedaActual = '';
            currentPage = 1;
            
            document.querySelectorAll('#nav-categorias button').forEach(b => {
                b.className = "w-full text-left px-5 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600 flex items-center gap-3 transition-all group";
            });
            const btnTodas = document.getElementById('btn-todas');
            if (btnTodas) {
                btnTodas.className = "w-full text-left px-5 py-3 rounded-xl bg-gray-50 font-bold text-beige flex items-center gap-3 transition-all group border-l-4 border-beige";
            }

            document.getElementById('titulo-grid').innerText = 'Catálogo';
            
            const searchDesktop = document.getElementById('search-desktop');
            const searchMobile = document.getElementById('search-mobile');
            if(searchDesktop) searchDesktop.value = '';
            if(searchMobile) searchMobile.value = '';
            
            cargarProductosPagina(1);
            mostrarToast("Volviendo al inicio", "info");
        }

        function buscar(query) {
            if (query === lastSearch) return;
            lastSearch = query;
            clearTimeout(searchTimeout); 
            
            searchTimeout = setTimeout(() => {
                busquedaActual = query.toLowerCase();
                currentPage = 1;
                
                if (busquedaActual.length > 0) {
                    document.querySelectorAll('#nav-categorias button').forEach(b => {
                        b.className = "w-full text-left px-5 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600 flex items-center gap-3 transition-all group";
                    });
                    document.getElementById('titulo-grid').innerText = `Resultados para "${query}"`;
                } else {
                    document.getElementById('titulo-grid').innerText = filtroActual === 'todas' ? 'Catálogo' : filtroActual;
                }
                
                cargarProductosPagina(1);
            }, 500);
        }

        function filtrar(cat, btnElement) {
            if(window.innerWidth < 1024 && !document.getElementById('left-sidebar').classList.contains('-translate-x-full')) {
                toggleMobileMenu();
            }

            document.querySelectorAll('#nav-categorias button').forEach(b => {
                b.className = "w-full text-left px-5 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600 flex items-center gap-3 transition-all group";
            });
            if(btnElement) {
                btnElement.className = "w-full text-left px-5 py-3 rounded-xl bg-gray-50 font-bold text-beige flex items-center gap-3 transition-all group border-l-4 border-beige";
            }
            filtroActual = cat;
            busquedaActual = ''; 
            
            const searchDesktop = document.getElementById('search-desktop');
            const searchMobile = document.getElementById('search-mobile');
            if(searchDesktop) searchDesktop.value = '';
            if(searchMobile) searchMobile.value = '';
            
            document.getElementById('titulo-grid').innerText = cat === 'todas' ? 'Catálogo' : cat;
            
            currentPage = 1;
            cargarProductosPagina(1);
            window.scrollTo({ top: document.getElementById('seccion-catalogo').getBoundingClientRect().top + window.pageYOffset - 110, behavior: 'smooth' });
        }

        function generarMenuCategorias() {
            const nav = document.getElementById('nav-categorias');
            nav.innerHTML = ''; 
            const btnTodas = document.createElement('button');
            
            btnTodas.className = (filtroActual === 'todas') 
                ? "w-full text-left px-5 py-3 rounded-xl bg-gray-50 font-bold text-beige flex items-center gap-3 transition-all group border-l-4 border-beige"
                : "w-full text-left px-5 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600 flex items-center gap-3 transition-all group";
                
            btnTodas.id = "btn-todas";
            btnTodas.onclick = () => filtrar('todas', btnTodas);
            btnTodas.innerHTML = `<i class="fa fa-border-all text-beige group-hover:scale-110 transition w-5 text-center"></i> Todo`;
            nav.appendChild(btnTodas);
            
            const categoriasManuales = [
                "Hogar", "Electrónica y accesorios", "Belleza e Higiene", 
                "Deportes y Outdoor", "Juguetes", "Ropa y Accesorios", 
                "Vehiculos", "Otros"
            ];

            categoriasManuales.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = "w-full text-left px-5 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600 flex items-center gap-3 transition-all group";
                btn.onclick = () => filtrar(cat, btn);
                btn.innerHTML = `<i class="fa fa-chevron-right text-gray-300 text-xs group-hover:text-beige transition"></i> ${cat}`;
                nav.appendChild(btn);
            });
        }

        function renderDestacados(lista) {
            const destacados = lista.filter(p => p.destacado === 1 && p.disponible).slice(0, 6); 
            const container = document.getElementById('hero-destacados-container');
            const section = document.getElementById('hero-section');
            
            if (destacados.length === 0) {
                section.classList.add('hidden'); 
                return;
            }
            section.classList.remove('hidden'); 
            container.innerHTML = destacados.map(p => `
                <div class="slider-card bg-white rounded-2xl border border-gray-200 overflow-hidden relative h-full flex flex-col shadow-sm cursor-pointer hover:shadow-md transition-all" onclick="openProduct(${p.id})">
                    <div class="relative h-48 md:h-56 bg-white p-2">
                        <img src="${escapeHTML(p.img)}" class="w-full h-full object-contain" alt="${escapeHTML(p.nombre)}" loading="lazy" width="200" height="200" onerror="this.onerror=null; this.src='${PLACEHOLDER_SVG}'; this.classList.add('img-placeholder')">
                        <div class="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm">Destacado</div>
                    </div>
                    <div class="p-3 flex flex-col flex-1">
                        <h3 class="font-bold text-gray-800 text-xs md:text-sm mb-1 line-clamp-2">${escapeHTML(p.nombre)}</h3>
                        <span class="text-sm md:text-lg font-black text-gray-900 mt-auto">$${p.precio.toLocaleString()}</span>
                    </div>
                </div>
            `).join('');
        }

        // =========================================================================
        // SISTEMA DE USUARIOS Y PERFILES
        // =========================================================================
        async function verificarSesion() {
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            
            if (error || !user) {
                await supabaseClient.auth.signOut();
                currentUser = null;
                userProfile = null;
            } else {
                currentUser = user;
                await cargarPerfil(currentUser.id);
            }
            actualizarBotonesUsuario();
            
            supabaseClient.auth.onAuthStateChange(async (event, session) => {
                if (session && session.user) {
                    if (!currentUser || currentUser.id !== session.user.id) {
                        currentUser = session.user;
                        await cargarPerfil(currentUser.id);
                        await sincronizarCarritoConBD();
                    }
                } else {
                    currentUser = null;
                    userProfile = null;
                    cart = [];
                    localStorage.removeItem('papajose_cart');
                    updateCartUI();
                }
                actualizarBotonesUsuario();
            });
        }

        async function cargarPerfil(userId) {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();
            
            if (!error && data) { 
                userProfile = data; 
                userProfile.esAdmin = (data.rol === 'admin');
                actualizarOpcionEnvioSegunDireccion();
            } else {
                userProfile = null;
            }
            return userProfile;
        }

        function actualizarBotonesUsuario() {
            const icon = document.getElementById('user-icon');
            const mobileTxt = document.getElementById('mobile-menu-user-txt');
            const adminMenuItem = document.getElementById('admin-menu-item');
            
            if (currentUser) {
                icon.classList.replace('fa-user', 'fa-user-check');
                icon.classList.replace('text-gray-400', 'text-beige');
                if(mobileTxt) mobileTxt.innerText = "Mi Perfil";
                
                if (userProfile?.esAdmin) {
                    if(adminMenuItem) adminMenuItem.classList.remove('hidden');
                } else {
                    if(adminMenuItem) adminMenuItem.classList.add('hidden');
                }
            } else {
                icon.classList.replace('fa-user-check', 'fa-user');
                icon.classList.replace('text-beige', 'text-gray-400');
                if(mobileTxt) mobileTxt.innerText = "Mi Cuenta";
                if(adminMenuItem) adminMenuItem.classList.add('hidden');
            }
        }

        function openAuthModal() {
            history.pushState({modal: 'auth'}, null, "");
            const modal = document.getElementById('auth-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.classList.add('locked');
            
            if (currentUser && userProfile) {
                document.getElementById('auth-login-view').classList.add('hidden');
                document.getElementById('auth-register-view').classList.add('hidden');
                document.getElementById('auth-logged-view').classList.remove('hidden');
                document.getElementById('auth-recover-view')?.classList.add('hidden');
                switchUserTab('perfil');
                
                const dirCompleta = `${userProfile.calle || ''} ${userProfile.numero_casa || ''}, ${userProfile.comuna || ''}, ${userProfile.region || ''}`;
                
                document.getElementById('display-nombre').innerText = escapeHTML(userProfile.nombre || '-');
                document.getElementById('display-rut').innerText = escapeHTML(userProfile.rut || '-');
                document.getElementById('display-telefono').innerText = escapeHTML(userProfile.telefono || '-');
                document.getElementById('display-direccion').innerText = dirCompleta.trim().length > 3 ? dirCompleta : (userProfile.direccion_defecto || '-');
                document.getElementById('display-referencia').innerText = escapeHTML(userProfile.referencia || '-');
                
                document.getElementById('edit-nombre').value = userProfile.nombre || '';
                document.getElementById('edit-rut').value = userProfile.rut || '';
                document.getElementById('edit-telefono').value = userProfile.telefono || '';
                document.getElementById('edit-calle').value = userProfile.calle || '';
                document.getElementById('edit-numero').value = userProfile.numero_casa || '';
                
                if(userProfile.region) {
                    document.getElementById('edit-region').value = userProfile.region;
                    actualizarComunas('edit');
                    if(userProfile.comuna) document.getElementById('edit-comuna').value = userProfile.comuna;
                }
                
                document.getElementById('edit-referencia').value = userProfile.referencia || '';
            } else {
                document.getElementById('auth-logged-view').classList.add('hidden');
                document.getElementById('auth-register-view').classList.add('hidden');
                document.getElementById('auth-login-view').classList.remove('hidden');
                document.getElementById('auth-recover-view')?.classList.add('hidden');
            }
        }

        function closeAuthModal() {
            const modal = document.getElementById('auth-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.classList.remove('locked');
            if(history.state && history.state.modal === 'auth') history.back();
        }

        function toggleAuthView() {
            const login = document.getElementById('auth-login-view');
            const reg = document.getElementById('auth-register-view');
            if(login.classList.contains('hidden')) {
                login.classList.remove('hidden'); 
                reg.classList.add('hidden');
            } else {
                login.classList.add('hidden'); 
                reg.classList.remove('hidden');
            }
            document.getElementById('auth-recover-view')?.classList.add('hidden');
        }

        function mostrarRecuperarPass() {
            document.getElementById('auth-login-view').classList.add('hidden');
            document.getElementById('auth-register-view').classList.add('hidden');
            document.getElementById('auth-logged-view').classList.add('hidden');
            document.getElementById('auth-recover-view').classList.remove('hidden');
        }

        function volverALogin() {
            document.getElementById('auth-recover-view').classList.add('hidden');
            document.getElementById('auth-login-view').classList.remove('hidden');
        }

        async function enviarRecuperacion(e) {
            e.preventDefault();
            const email = document.getElementById('recover-email').value;
            const btn = document.getElementById('btn-recover-submit');
            btn.innerText = "Enviando...";
            btn.disabled = true;

            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });

            if (error) {
                mostrarToast("Error: " + error.message, "error");
            } else {
                mostrarToast("¡Revisa tu correo! Te enviamos un enlace.", "success");
                setTimeout(() => volverALogin(), 2000);
            }
            btn.innerText = "Enviar enlace";
            btn.disabled = false;
        }

        function switchUserTab(tab) {
            const btnPerfil = document.getElementById('tab-mi-perfil');
            const btnPedidos = document.getElementById('tab-mis-pedidos');
            const viewPerfil = document.getElementById('user-perfil-view');
            const viewPedidos = document.getElementById('user-pedidos-view');

            if(tab === 'perfil') {
                btnPerfil.classList.add('text-beige', 'border-beige');
                btnPerfil.classList.remove('text-gray-500');
                btnPedidos.classList.remove('text-beige', 'border-beige');
                btnPedidos.classList.add('text-gray-500');
                
                viewPerfil.classList.remove('hidden');
                viewPedidos.classList.add('hidden');
                cancelEditProfile();
            } else {
                btnPedidos.classList.add('text-beige', 'border-beige');
                btnPedidos.classList.remove('text-gray-500');
                btnPerfil.classList.remove('text-beige', 'border-beige');
                btnPerfil.classList.add('text-gray-500');
                
                viewPerfil.classList.add('hidden');
                viewPedidos.classList.remove('hidden');
                cargarMisPedidos();
            }
        }

        async function cargarMisPedidos() {
            const contenedor = document.getElementById('lista-mis-pedidos');
            contenedor.innerHTML = '<p class="text-center text-sm text-gray-400 mt-6"><i class="fa fa-spinner fa-spin text-beige"></i> Buscando pedidos...</p>';
            
            try {
                const { data, error } = await supabaseClient
                    .from('orders')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;

                if (data.length === 0) {
                    contenedor.innerHTML = '<p class="text-center text-sm text-gray-400 mt-6"><i class="fa fa-box-open mb-2 text-2xl"></i><br>Aún no tienes pedidos.</p>';
                    return;
                }

                contenedor.innerHTML = data.map(pedido => {
                    let bgEstado = 'bg-yellow-100 text-yellow-800';
                    if (pedido.estado && pedido.estado.toLowerCase().includes('pagado')) bgEstado = 'bg-green-100 text-green-800';
                    else if (pedido.estado && pedido.estado.toLowerCase().includes('pendiente de pago flow')) bgEstado = 'bg-blue-100 text-blue-800';
                    else if (pedido.estado && pedido.estado.toLowerCase().includes('rechazado')) bgEstado = 'bg-red-100 text-red-800';
                    else if (pedido.estado && pedido.estado.toLowerCase().includes('expirado')) bgEstado = 'bg-gray-100 text-gray-800';

                    const fecha = new Date(pedido.created_at).toLocaleDateString('es-CL');
                    
                    return `
                    <div class="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="font-bold text-gray-800">Pedido #${pedido.id}</span>
                                <p class="text-[10px] text-gray-400">${escapeHTML(fecha)}</p>
                            </div>
                            <span class="text-[10px] font-bold px-2 py-1 rounded-md ${bgEstado}">${escapeHTML(pedido.estado || 'Pendiente')}</span>
                        </div>
                        <div class="border-t border-gray-100 mt-2 pt-2 flex justify-between items-center">
                            <span class="text-xs text-gray-500">Envío: ${escapeHTML(pedido.tipo_envio?.toUpperCase() || '')}</span>
                            <span class="font-black text-gray-900">$${(pedido.total || 0).toLocaleString()}</span>
                        </div>
                        <div class="mt-3 text-right">
                            <button onclick="verDetallePedido(${pedido.id})" class="text-beige font-bold text-xs underline hover:no-underline bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">Ver detalle completo</button>
                        </div>
                    </div>`;
                }).join('');

            } catch (err) {
                console.error(err);
                contenedor.innerHTML = '<p class="text-center text-sm text-red-400 mt-6">Error al cargar el historial.</p>';
            }
        }

        async function verDetallePedido(orderId) {
            const modalContent = document.getElementById('order-detail-content');
            modalContent.innerHTML = '<p class="text-center text-gray-500"><i class="fa fa-spinner fa-spin"></i> Cargando detalles...</p>';
            document.getElementById('order-detail-modal').classList.remove('hidden');
            document.getElementById('order-detail-modal').classList.add('flex');
            document.body.classList.add('locked');

            try {
                const { data: pedido, error: pedidoError } = await supabaseClient
                    .from('orders')
                    .select('*, profiles:user_id ( nombre, telefono )')
                    .eq('id', orderId)
                    .single();

                if (pedidoError) throw pedidoError;

                const { data: items, error: itemsError } = await supabaseClient
                    .from('order_items')
                    .select('*, product:product_id ( producto, foto )')
                    .eq('order_id', orderId);

                if (itemsError) throw itemsError;

                const fecha = new Date(pedido.created_at).toLocaleString('es-CL');
                const cliente = pedido.profiles || { nombre: 'Desconocido', telefono: '' };

                let colorEstado = 'text-yellow-600 bg-yellow-50 border-yellow-200';
                let iconEstado = 'fa-clock';
                const estLower = (pedido.estado || '').toLowerCase();
                
                if (estLower.includes('pagado')) { colorEstado = 'text-green-600 bg-green-50 border-green-200'; iconEstado = 'fa-check-circle'; }
                else if (estLower.includes('reparto')) { colorEstado = 'text-indigo-600 bg-indigo-50 border-indigo-200'; iconEstado = 'fa-truck-fast'; }
                else if (estLower.includes('entregado')) { colorEstado = 'text-green-800 bg-green-100 border-green-300'; iconEstado = 'fa-box-open'; }
                else if (estLower.includes('rechazado') || estLower.includes('expirado')) { colorEstado = 'text-red-600 bg-red-50 border-red-200'; iconEstado = 'fa-times-circle'; }

                let itemsHTML = '';
                let subtotal = 0;
                items.forEach(item => {
                    const subtotalItem = item.cantidad * item.precio_historico;
                    subtotal += subtotalItem;
                    itemsHTML += `
                        <div class="flex gap-4 py-4 border-b border-gray-100 items-center">
                            <div class="w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                <img src="${escapeHTML(item.product?.foto || PLACEHOLDER_SVG)}" class="max-w-full max-h-full object-contain" alt="Producto">
                            </div>
                            <div class="flex-1">
                                <p class="font-bold text-sm text-gray-800 leading-tight">${escapeHTML(item.product?.producto || 'Producto')}</p>
                                <p class="text-xs text-gray-500 mt-1">Cant: ${item.cantidad} x $${item.precio_historico.toLocaleString()}</p>
                            </div>
                            <div class="font-black text-gray-900">$${subtotalItem.toLocaleString()}</div>
                        </div>
                    `;
                });

                modalContent.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Orden de Compra</p>
                                <h4 class="text-2xl font-black text-gray-900">#${pedido.id}</h4>
                                <p class="text-xs text-gray-500 mt-1"><i class="fa fa-calendar-alt"></i> ${fecha}</p>
                            </div>
                            <div class="px-4 py-2 rounded-xl border ${colorEstado} flex items-center gap-2 font-bold text-sm">
                                <i class="fa ${iconEstado}"></i> ${escapeHTML(pedido.estado)}
                            </div>
                        </div>
                        
                        <div class="p-6">
                            <h4 class="font-black text-lg mb-4 text-gray-800">Resumen de Productos</h4>
                            <div class="mb-6">
                                ${itemsHTML}
                            </div>
                            
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                                <div class="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>$${subtotal.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between text-sm text-gray-600 pb-2 border-b border-gray-200">
                                    <span>Envío (${escapeHTML(pedido.tipo_envio?.toUpperCase() || '')})</span>
                                    <span>$${(pedido.costo_envio || 0).toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between text-lg font-black text-gray-900 pt-2">
                                    <span>Total Pagado</span>
                                    <span>$${(pedido.total || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h4 class="font-black text-md mb-4 text-gray-800"><i class="fa fa-map-location-dot text-beige mr-2"></i> Datos de Despacho</h4>
                            <p class="text-sm font-bold text-gray-900 mb-1">${escapeHTML(cliente.nombre)}</p>
                            <p class="text-sm text-gray-600 mb-1"><i class="fa fa-phone w-4 text-gray-400"></i> ${escapeHTML(cliente.telefono)}</p>
                            <p class="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">${escapeHTML(pedido.direccion_envio)}</p>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h4 class="font-black text-md mb-4 text-gray-800"><i class="fa fa-file-invoice text-beige mr-2"></i> Documento Tributario</h4>
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-xl border border-gray-100">
                                    <i class="fa fa-receipt"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-gray-900">Solicitaste: ${escapeHTML(pedido.tipo_doc || '')}</p>
                                    <p class="text-xs text-gray-500 mt-1">Será enviado a tu correo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            } catch (error) {
                console.error(error);
                modalContent.innerHTML = '<p class="text-center text-red-500 font-bold p-8">Error al cargar detalle del pedido. Intenta nuevamente.</p>';
            }
        }

        function cerrarDetallePedido() {
            document.getElementById('order-detail-modal').classList.add('hidden');
            document.getElementById('order-detail-modal').classList.remove('flex');
            document.body.classList.remove('locked');
        }

        async function registrarUsuario(e) {
            e.preventDefault();
            const email = document.getElementById('reg-email').value;
            const emailConfirm = document.getElementById('reg-email-confirm').value;
            if(email !== emailConfirm) { mostrarToast("Los correos no coinciden", "error"); return; }
            
            const btn = document.getElementById('btn-reg-submit');
            btn.innerText = "Creando cuenta..."; 
            btn.disabled = true;
            
            const pass = document.getElementById('reg-pass').value;
            const nombre = document.getElementById('reg-nombre').value;
            const rut = document.getElementById('reg-rut').value;
            const telefono = document.getElementById('reg-telefono').value;
            
            const calle = document.getElementById('reg-calle').value;
            const num = document.getElementById('reg-numero').value;
            const region = document.getElementById('reg-region').value;
            const comuna = document.getElementById('reg-comuna').value;
            const ref = document.getElementById('reg-referencia').value;

            const direccionCompatibilidad = `${calle} ${num}, ${comuna}, ${region}`;

            try {
                const { data: authData, error: authErr } = await supabaseClient.auth.signUp({ email, password: pass });
                if (authErr) throw authErr;
                
                if (authData.user) {
                    const { error: profileErr } = await supabaseClient.from('profiles').insert({
                        id: authData.user.id,
                        nombre, rut, telefono, 
                        calle: calle,
                        numero_casa: num,
                        region: region,
                        comuna: comuna,
                        direccion_defecto: direccionCompatibilidad, 
                        referencia: ref, 
                        rol: 'cliente'
                    });
                    if (profileErr) throw profileErr;
                }
                mostrarToast("¡Cuenta creada con éxito!");
                closeAuthModal();
            } catch (error) {
                mostrarToast("Error: " + (error.message || "No se pudo crear"), "error");
            } finally {
                btn.innerText = "Crear mi cuenta"; 
                btn.disabled = false;
            }
        }
        
        async function iniciarSesion(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-login-submit');
            btn.innerText = "Ingresando..."; 
            btn.disabled = true;
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) { 
                mostrarToast("Correo o contraseña incorrectos", "error"); 
            } else { 
                currentUser = data.user;
                await cargarPerfil(currentUser.id);
                mostrarToast("¡Bienvenido de vuelta!"); 
                closeAuthModal(); 
            }
            btn.innerText = "Ingresar"; 
            btn.disabled = false;
        }

        function showEditProfile() {
            document.getElementById('profile-readonly').classList.add('hidden');
            document.getElementById('profile-edit').classList.remove('hidden');
        }

        function cancelEditProfile() {
            document.getElementById('profile-readonly').classList.remove('hidden');
            document.getElementById('profile-edit').classList.add('hidden');
        }

        async function actualizarPerfil(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-update-profile');
            btn.innerText = "Guardando...";
            btn.disabled = true;

            const calle = document.getElementById('edit-calle').value;
            const num = document.getElementById('edit-numero').value;
            const region = document.getElementById('edit-region').value;
            const comuna = document.getElementById('edit-comuna').value;
            const direccionCompatibilidad = `${calle} ${num}, ${comuna}, ${region}`;

            const updates = {
                nombre: document.getElementById('edit-nombre').value,
                rut: document.getElementById('edit-rut').value,
                telefono: document.getElementById('edit-telefono').value,
                calle: calle,
                numero_casa: num,
                region: region,
                comuna: comuna,
                direccion_defecto: direccionCompatibilidad,
                referencia: document.getElementById('edit-referencia').value
            };

            const { error } = await supabaseClient.from('profiles').update(updates).eq('id', currentUser.id);
            if (error) {
                mostrarToast("Error al actualizar: " + error.message, "error");
            } else {
                mostrarToast("Perfil actualizado correctamente", "success");
                await cargarPerfil(currentUser.id);
                openAuthModal();
            }
            btn.innerText = "Guardar cambios";
            btn.disabled = false;
        }

        async function cerrarSesion() {
            await supabaseClient.auth.signOut();
            currentUser = null;
            userProfile = null;
            actualizarBotonesUsuario();
            document.getElementById('login-form').reset();
            document.getElementById('edit-profile-form').reset();
            document.getElementById('auth-logged-view').classList.add('hidden');
            document.getElementById('auth-login-view').classList.remove('hidden');
            
            cart = [];
            localStorage.removeItem('papajose_cart');
            actualizarOpcionEnvioSegunDireccion();
            updateCartUI();
            
            mostrarToast("Sesión cerrada", "info");
            closeAuthModal();
        }

        // =========================================================================
        // LÓGICA DE ENVÍO
        // =========================================================================
        function esRegionMetropolitana(direccionOrRegion) {
            if (!direccionOrRegion) return false;
            const lower = direccionOrRegion.toLowerCase();
            return lower.includes('metropolitana') || lower.includes('rm') || lower.includes('santiago');
        }

        function actualizarOpcionEnvioSegunDireccion() {
            let esRM = false;
            let comunaSeleccionada = '';
            
            const selectorRegRegion = document.getElementById('reg-region');
            const selectorEditRegion = document.getElementById('edit-region');
            
            if (selectorEditRegion && selectorEditRegion.value && !document.getElementById('profile-edit').classList.contains('hidden')) {
                esRM = esRegionMetropolitana(selectorEditRegion.value);
                comunaSeleccionada = document.getElementById('edit-comuna').value;
            } else if (selectorRegRegion && selectorRegRegion.value && !document.getElementById('auth-register-view').classList.contains('hidden')) {
                esRM = esRegionMetropolitana(selectorRegRegion.value);
                comunaSeleccionada = document.getElementById('reg-comuna').value;
            } else if (userProfile) {
                esRM = esRegionMetropolitana(userProfile.region || userProfile.direccion_defecto);
                comunaSeleccionada = userProfile.comuna || '';
            }

            if (esRM) {
                costoEnvio = 3500;
            } else {
                costoEnvio = 0;
            }

            const envioMontoEl = document.getElementById('cart-envio-monto');
            const envioLabelEl = document.getElementById('cart-envio-label');
            
            if (envioMontoEl && envioLabelEl) {
                if (userProfile || (selectorRegRegion && selectorRegRegion.value)) {
                    if (esRM) {
                        envioLabelEl.innerText = "Envío RM:";
                        envioMontoEl.innerText = `+$${costoEnvio.toLocaleString()}`;
                    } else {
                        envioLabelEl.innerText = "Envío a Regiones:";
                        envioMontoEl.innerText = "Por Pagar (Starken)";
                    }
                } else {
                    envioLabelEl.innerText = "Costo de envío:";
                    envioMontoEl.innerText = "Inicia sesión para calcular";
                }
            }
            calcularTotal();
        }

        // =========================================================================
        // CARRITO Y CHECKOUT
        // =========================================================================
        async function addToCart(id) {
            const p = db.find(x => x.id === id);
            if (!p || p.stock <= 0) { mostrarToast("Producto agotado", "error"); return; }
            let item = cart.find(i => i.id === id);
            const cantidadActual = item ? item.qty : 0;
            if (cantidadActual + 1 > p.stock) { mostrarToast(`Solo hay ${p.stock} unidades disponibles`, "error"); return; }
            
            if (item) item.qty++;
            else cart.push({ ...p, qty: 1 });
            
            if (currentUser) {
                await syncCartToDB();
            } else {
                localStorage.setItem('papajose_cart', JSON.stringify(cart));
            }
            
            updateCartUI();
            mostrarToast("¡Agregado al carrito!");
            
            const badge = document.getElementById('cart-badge');
            badge.classList.add('scale-125');
            setTimeout(() => badge.classList.remove('scale-125'), 200);
            document.getElementById('cart-icon').classList.replace('text-gray-400', 'text-beige');
            
            if (window.innerWidth >= 1024 && !hasOpenedCartAutomatically) {
                if (document.getElementById('cart-sidebar').classList.contains('translate-x-full')) { 
                    toggleCart(); 
                    hasOpenedCartAutomatically = true; 
                }
            }
        }

        async function cambiarCantidad(id, n) {
            let item = cart.find(x => x.id === id);
            if(!item) return;
            const p = db.find(x => x.id === id);
            const nuevaCantidad = item.qty + n;
            if (n > 0 && nuevaCantidad > p.stock) { mostrarToast(`Máximo ${p.stock} unidades`, "error"); return; }
            
            item.qty += n;
            if(item.qty <= 0) await removeFromCart(id); 
            else {
                if (currentUser) await syncCartToDB();
                else localStorage.setItem('papajose_cart', JSON.stringify(cart));
                updateCartUI();
            }
        }

        async function removeFromCart(id) {
            cart = cart.filter(i => i.id !== id);
            if (currentUser) {
                await supabaseClient
                    .from('cart_items')
                    .delete()
                    .eq('user_id', currentUser.id)
                    .eq('product_id', id);
            } else {
                localStorage.setItem('papajose_cart', JSON.stringify(cart));
            }
            updateCartUI();
            if(cart.length === 0) {
                document.getElementById('cart-icon').classList.replace('text-beige', 'text-gray-400');
                forceCloseCart();
            }
        }

        function toggleCart() {
            const sidebar = document.getElementById('cart-sidebar');
            const overlay = document.getElementById('cart-overlay');
            const stickyBar = document.getElementById('mobile-sticky-bar');
            const isOpen = sidebar.classList.contains('translate-x-0');
            
            if (cart.length === 0 && !isOpen) { mostrarToast("Tu carrito está vacío", "info"); return; }
            
            if (!isOpen) { 
                history.pushState({modal: 'cart'}, null, "");
                sidebar.classList.remove('translate-x-full'); 
                sidebar.classList.add('translate-x-0'); 
                overlay.classList.add('open'); 
                document.body.classList.add('locked');
                if(window.innerWidth < 1024) stickyBar.classList.add('hidden');
                
                if(currentUser && userProfile) actualizarOpcionEnvioSegunDireccion();
            } else history.back();
        }
        
        function toggleMobileMenu() { 
            const sidebar = document.getElementById('left-sidebar');
            if (sidebar.classList.contains('-translate-x-full')) { 
                history.pushState({modal: 'menu'}, null, ""); 
                sidebar.classList.remove('-translate-x-full'); 
                document.getElementById('menu-overlay').classList.add('open'); 
                document.body.classList.add('locked');
            } else history.back(); 
        }

        function handleBackAction() { history.back(); }

        function forceCloseCart() {
            const sidebar = document.getElementById('cart-sidebar');
            const overlay = document.getElementById('cart-overlay');
            const stickyBar = document.getElementById('mobile-sticky-bar');
            sidebar.classList.remove('translate-x-0'); 
            sidebar.classList.add('translate-x-full'); 
            overlay.classList.remove('open'); 
            document.body.classList.remove('locked');
            if(cart.length === 0) stickyBar.classList.add('hidden'); 
            else if(window.innerWidth < 1024) stickyBar.classList.remove('translate-y-full');
        }

        function updateCartUI() {
            try { localStorage.setItem('papajose_cart', JSON.stringify(cart)); } catch (e) {}
            const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
            const badge = document.getElementById('cart-badge');
            badge.innerText = totalItems;
            badge.classList.toggle('scale-0', totalItems === 0);
            
            const list = document.getElementById('cart-items');
            const stickyBar = document.getElementById('mobile-sticky-bar');
            const floatingBtn = document.getElementById('desktop-floating-cart');
            
            if (cart.length === 0) {
                list.innerHTML = `<div class="text-center text-gray-300 mt-20 flex flex-col items-center"><i class="fa fa-shopping-bag text-5xl mb-4 opacity-20"></i><p class="text-sm">Tu carrito está vacío</p></div>`;
                stickyBar.classList.add('hidden'); 
                floatingBtn.classList.add('hidden');
                document.getElementById('header-total').classList.remove('opacity-100');
            } else {
                list.innerHTML = cart.map((p) => `
                    <div class="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-beige/20 transition-all">
                        <img src="${escapeHTML(p.img)}" class="w-14 h-14 rounded object-contain bg-white border" alt="${escapeHTML(p.nombre)}" width="56" height="56" onerror="this.onerror=null; this.src='${PLACEHOLDER_SVG}'; this.classList.add('img-placeholder')">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-xs text-gray-800 truncate">${escapeHTML(p.nombre)}</h4>
                            <p class="text-[10px] text-gray-500 mb-1">SKU: ${escapeHTML(p.sku)}</p>
                            <p class="text-xs font-black text-gray-900">$${(p.precio * p.qty).toLocaleString()}</p>
                        </div>
                        <div class="flex flex-col items-center bg-white rounded border border-gray-200">
                            <button onclick="cambiarCantidad(${p.id}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black text-xs">+</button>
                            <span class="text-xs font-bold">${p.qty}</span>
                            <button onclick="cambiarCantidad(${p.id}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 text-xs">-</button>
                        </div>
                    </div>
                `).join('');
                if(window.innerWidth < 1024) {
                    if(document.getElementById('cart-sidebar').classList.contains('translate-x-full')) { 
                        stickyBar.classList.remove('hidden'); 
                        stickyBar.classList.remove('translate-y-full'); 
                    }
                }
                if(window.innerWidth >= 1024) floatingBtn.classList.remove('hidden');
            }
            calcularTotal();
        }

        function calcularTotal() {
            let subtotal = cart.reduce((sum, item) => sum + (item.precio * item.qty), 0);
            
            let envio = 0;
            if (userProfile) {
                 envio = costoEnvio; 
            }

            totalPagarFinal = subtotal + envio;
            
            const subtotalFmt = `$${subtotal.toLocaleString()}`;
            document.getElementById('mobile-total-sticky').innerText = subtotalFmt;
            document.getElementById('desktop-floating-total').innerText = subtotalFmt;
            document.getElementById('header-total').innerText = subtotalFmt;
            
            const subEl = document.getElementById('cart-subtotal');
            if (subEl) subEl.innerText = subtotalFmt;

            document.getElementById('cart-total').innerText = `$${totalPagarFinal.toLocaleString()}`;
            
            if(cart.length > 0) document.getElementById('header-total').classList.add('opacity-100'); 
            else document.getElementById('header-total').classList.remove('opacity-100');
        }

        async function sincronizarCarritoConBD() {
            if (!currentUser) return;
            
            const { data: dbCart, error } = await supabaseClient
                .from('cart_items')
                .select('product_id, quantity')
                .eq('user_id', currentUser.id);
                
            if (error) {
                console.error("Error al obtener carrito de BD:", error);
                return;
            }
            
            const dbCartMap = new Map();
            dbCart.forEach(item => dbCartMap.set(item.product_id, item.quantity));
            
            const mergedCart = [];
            const processed = new Set();
            
            for (let item of cart) {
                const dbQty = dbCartMap.get(item.id) || 0;
                const p = db.find(x => x.id === item.id);
                const maxStock = p ? p.stock : Infinity;
                const finalQty = Math.min(item.qty + dbQty, maxStock);
                if (finalQty > 0) {
                    mergedCart.push({ ...item, qty: finalQty });
                }
                processed.add(item.id);
            }
            
            for (let [prodId, qty] of dbCartMap.entries()) {
                if (!processed.has(prodId)) {
                    const p = db.find(x => x.id === prodId);
                    if (p && p.stock > 0) {
                        mergedCart.push({ 
                            id: p.id,
                            sku: p.sku,
                            nombre: p.nombre,
                            precio: p.precio,
                            img: p.img,
                            disponible: p.disponible,
                            stock: p.stock,
                            qty: Math.min(qty, p.stock)
                        });
                    }
                }
            }
            
            cart = mergedCart;
            localStorage.setItem('papajose_cart', JSON.stringify(cart));
            
            await supabaseClient
                .from('cart_items')
                .delete()
                .eq('user_id', currentUser.id);
                
            if (cart.length > 0) {
                const inserts = cart.map(item => ({
                    user_id: currentUser.id,
                    product_id: item.id,
                    quantity: item.qty
                }));
                await supabaseClient.from('cart_items').insert(inserts);
            }
            
            updateCartUI();
        }

        async function syncCartToDB() {
            if (!currentUser) return;
            
            await supabaseClient
                .from('cart_items')
                .delete()
                .eq('user_id', currentUser.id);
            
            if (cart.length > 0) {
                const inserts = cart.map(item => ({
                    user_id: currentUser.id,
                    product_id: item.id,
                    quantity: item.qty
                }));
                await supabaseClient.from('cart_items').insert(inserts);
            }
        }

        function mostrarLoaderPago(mostrar) {
            const loader = document.getElementById('payment-loader-modal');
            if (mostrar) {
                forceCloseCart();
                closeAuthModal();
                loader.classList.remove('hidden');
                loader.classList.add('flex');
                setTimeout(() => loader.classList.remove('opacity-0'), 10);
                document.body.classList.add('locked');
            } else {
                loader.classList.add('opacity-0');
                setTimeout(() => {
                    loader.classList.add('hidden');
                    loader.classList.remove('flex');
                    document.body.classList.remove('locked');
                }, 300);
            }
        }

        async function procesarCheckout() {
            if(cart.length === 0) return;
            if(!currentUser) { mostrarToast("Debes iniciar sesión para pedir", "info"); openAuthModal(); return; }
            if (!userProfile) { mostrarToast("Cargando tu perfil...", "info"); await cargarPerfil(currentUser.id); }
            if (!userProfile || !userProfile.calle || !userProfile.rut || !userProfile.telefono) {
                mostrarToast("Completa tus datos de envío en Mi Cuenta", "error");
                openAuthModal();
                return;
            }

            mostrarLoaderPago(true);

            try {
                let tipoEnvioCalculado = esRegionMetropolitana(userProfile.region || userProfile.direccion_defecto) ? "rm" : "regiones";
                
                let tipoDocTexto = "Boleta";
                for(const r of document.getElementsByName('tipo_doc')) { if(r.checked) tipoDocTexto = r.value; }
                
                const dirEnvio = `${userProfile.calle} ${userProfile.numero_casa}, ${userProfile.comuna}, ${userProfile.region}` + (userProfile.referencia ? ` | Ref: ${userProfile.referencia}` : '');
                
                const items = cart.map(item => ({ product_id: item.id, cantidad: item.qty }));
                
                const payload = {
                    tipoEnvioTexto: tipoEnvioCalculado,
                    costoEnvio: costoEnvio,
                    tipoDocTexto: tipoDocTexto,
                    dirEnvio: dirEnvio,
                    items: items
                };

                const { data: { session } } = await supabaseClient.auth.getSession();
                
                const response = await fetch('https://elwzheytotfsxzrcsioz.supabase.co/functions/v1/create-flow-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.error || 'Error al comunicarse con Flow');
                if (result.error) throw new Error(result.error);

                await supabaseClient.from('cart_items').delete().eq('user_id', currentUser.id);
                localStorage.setItem('papajose_pending_order', result.order_id);

                window.location.href = result.url;

            } catch (error) {
                console.error(error);
                mostrarLoaderPago(false);
                mostrarToast("Error: " + (error.message || "No se pudo conectar con el banco."), "error");
            }
        }

        // =========================================================================
        // TARJETAS Y MODAL DE PRODUCTO
        // =========================================================================
        function cardHTML(p) {
            const btnClass = p.disponible ? "bg-gray-900 text-white hover:bg-beige" : "bg-gray-200 text-gray-400 cursor-not-allowed";
            const btnText = p.disponible ? "Agregar" : "Agotado";
            const action = p.disponible ? `addToCart(${p.id})` : "";
            const imageClass = p.disponible ? "" : "no-stock";
            return `
                <div class="bg-white rounded-2xl border border-gray-100 hover:border-beige/50 transition-all duration-300 group hover:shadow-lg relative flex flex-col h-full overflow-hidden shadow-sm">
                    <div class="relative h-48 md:h-56 bg-white p-2 cursor-pointer" onclick="openProduct(${p.id})">
                        <img src="${escapeHTML(p.img)}" class="w-full h-full object-contain group-hover:scale-105 transition duration-500 ${imageClass}" alt="${escapeHTML(p.nombre)}" loading="lazy" width="200" height="200" onerror="this.onerror=null; this.src='${PLACEHOLDER_SVG}'; this.classList.add('img-placeholder')">
                        <span class="absolute bottom-0 left-0 bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-wider rounded-tr-lg">${escapeHTML(p.cat.substring(0,15))}</span>
                        ${!p.disponible ? '<span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-[10px] font-bold rounded">AGOTADO</span>' : ''}
                    </div>
                    <div class="p-4 flex flex-col grow">
                        <h4 class="font-medium text-gray-800 text-sm mb-1 leading-snug line-clamp-2 grow">${escapeHTML(p.nombre)}</h4>
                        <p class="text-[10px] text-gray-400 font-mono mb-2">SKU: ${escapeHTML(p.sku)}</p>
                        <p class="text-[10px] text-gray-500">Stock: <span class="font-bold ${p.stock <= 3 ? 'text-red-500' : 'text-green-600'}">${p.stock}</span></p>
                        <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                            <span class="font-black text-lg text-gray-900">$${p.precio.toLocaleString()}</span>
                            <button onclick="${action}" class="text-xs font-bold px-3 py-2 rounded-lg transition uppercase ${btnClass}">${btnText}</button>
                        </div>
                    </div>
                </div>`;
        }

        function openProduct(id) {
            history.pushState({modal: 'product'}, null, "");
            const p = db.find(x => x.id === id);
            const modal = document.getElementById('product-modal');
            const btnState = p.disponible ? '' : 'disabled class="opacity-50 cursor-not-allowed bg-gray-300"';
            const btnTxt = p.disponible ? 'Agregar al Pedido' : 'Agotado';
            const action = p.disponible ? `addToCart(${p.id}); closeProductModal()` : '';
            document.getElementById('modal-content').innerHTML = `
                <div class="flex flex-col h-full relative">
                    <div class="flex-1 overflow-y-auto p-6 md:p-8 modal-body-scroll">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-4">
                            <div class="flex items-center justify-center bg-gray-50 rounded-2xl p-4 md:p-8">
                                <img src="${escapeHTML(p.img)}" class="max-h-72 w-full object-contain ${p.disponible ? '' : 'no-stock'}" alt="${escapeHTML(p.nombre)}" width="300" height="300" onerror="this.onerror=null; this.src='${PLACEHOLDER_SVG}'; this.classList.add('img-placeholder')">
                                ${!p.disponible ? '<div class="absolute inset-0 flex items-center justify-center bg-black/10"><span class="bg-red-500 text-white px-4 py-2 font-bold rounded-lg">SIN STOCK</span></div>' : ''}
                            </div>
                            <div class="flex flex-col justify-start">
                                <span class="text-beige font-bold uppercase tracking-widest mb-2 text-xs">${escapeHTML(p.cat)}</span>
                                <h1 class="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">${escapeHTML(p.nombre)}</h1>
                                <p class="text-sm font-mono text-gray-400 mb-4">SKU: ${escapeHTML(p.sku)}</p>
                                <p class="text-gray-600 leading-relaxed mb-6 font-medium">${escapeHTML(p.desc)}</p>
                                <p class="text-sm text-gray-500">Stock disponible: <span class="font-bold ${p.stock <= 3 ? 'text-red-500' : 'text-green-600'}">${p.stock}</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-10 shrink-0">
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex flex-col">
                                <span class="text-[10px] text-gray-400 font-bold uppercase">Precio</span>
                                <span class="text-2xl md:text-3xl font-black text-gray-900">$${p.precio.toLocaleString()}</span>
                            </div>
                            <button onclick="${action}" ${btnState} class="flex-1 md:flex-none md:w-1/2 bg-black text-white py-3 md:py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-beige transition shadow-lg text-sm truncate px-2">${btnTxt}</button>
                        </div>
                    </div>
                </div>`;
            modal.classList.remove('hidden'); 
            document.body.classList.add('locked');
        }

        function closeProductModal() { 
            document.getElementById('product-modal').classList.add('hidden'); 
            document.body.classList.remove('locked'); 
            history.back(); 
        }

        // =========================================================================
        // ADMINISTRADOR
        // =========================================================================
        function openAdminModal() {
            history.pushState({modal: 'admin'}, null, "");
            document.getElementById('admin-modal').classList.remove('hidden');
            document.body.classList.add('locked');
            cargarProductosAdmin();
            cancelarEdicion();
        }

        function closeAdminModal() {
            document.getElementById('admin-modal').classList.add('hidden');
            document.body.classList.remove('locked');
            if(history.state && history.state.modal === 'admin') history.back();
        }

        function switchAdminTab(tab) {
            if (!userProfile?.esAdmin) {
                mostrarToast("Acceso no autorizado", "error");
                closeAdminModal();
                return;
            }
            
            document.getElementById('admin-productos-view').classList.toggle('hidden', tab !== 'productos');
            document.getElementById('admin-nuevo-view').classList.toggle('hidden', tab !== 'nuevo');
            document.getElementById('admin-pedidos-view').classList.toggle('hidden', tab !== 'pedidos');
            
            const tabs = ['productos', 'nuevo', 'pedidos'];
            tabs.forEach(t => {
                const btn = document.getElementById(`tab-${t}`);
                if (t === tab) {
                    btn.classList.add('text-beige', 'border-beige');
                    btn.classList.remove('text-gray-500');
                } else {
                    btn.classList.remove('text-beige', 'border-beige');
                    btn.classList.add('text-gray-500');
                }
            });

            if (tab === 'pedidos') cargarPedidosLogistica();
        }

        function cancelarEdicion() {
            document.getElementById('producto-form').reset();
            document.getElementById('producto-id').value = '';
            document.getElementById('imagen-actual').classList.add('hidden');
            document.getElementById('btn-guardar-producto').innerText = 'Crear Producto';
            document.getElementById('form-titulo').innerText = 'Agregar Nuevo Producto';
            productoEnEdicion = null;
            switchAdminTab('productos');
        }

        async function cargarProductosAdmin() {
            const { data, error } = await supabaseClient.from('products').select('*').order('id', { ascending: false });
            if (error) { mostrarToast("Error al cargar", "error"); return; }
            
            adminDb = data;
            aplicarFiltrosAdmin();
        }

        function aplicarFiltrosAdmin() {
            let filtrados = adminDb;
            
            if (filtroAdminCategoria) {
                filtrados = filtrados.filter(p => p.categoria === filtroAdminCategoria);
            }
            
            if (filtroAdminTexto) {
                const texto = filtroAdminTexto.toLowerCase();
                filtrados = filtrados.filter(p => 
                    p.producto.toLowerCase().includes(texto) || 
                    (p.numero_producto && p.numero_producto.toLowerCase().includes(texto))
                );
            }
            
            renderListaAdmin(filtrados);
            
            document.querySelectorAll('#admin-category-filters button').forEach(btn => {
                const cat = btn.getAttribute('data-categoria');
                if (cat === filtroAdminCategoria) {
                    btn.classList.add('bg-beige', 'text-white', 'border-beige');
                    btn.classList.remove('bg-white', 'text-gray-700');
                } else {
                    btn.classList.remove('bg-beige', 'text-white', 'border-beige');
                    btn.classList.add('bg-white', 'text-gray-700');
                }
            });
        }

        function filtrarAdmin(query) {
            filtroAdminTexto = query;
            aplicarFiltrosAdmin();
        }

        function filtrarAdminPorCategoria(categoria) {
            filtroAdminCategoria = categoria;
            aplicarFiltrosAdmin();
        }

        function renderListaAdmin(lista) {
            const container = document.getElementById('admin-productos-list');
            if(lista.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-sm">No se encontraron productos.</p>';
                return;
            }
            container.innerHTML = lista.map(p => `
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <img src="${escapeHTML(p.foto)}" class="w-12 h-12 rounded object-cover border bg-white" width="48" height="48" onerror="this.src='${PLACEHOLDER_SVG}'">
                        <div>
                            <p class="font-bold text-sm text-gray-800">${escapeHTML(p.producto)}</p>
                            <p class="text-[10px] text-gray-500">SKU: ${escapeHTML(p.numero_producto)} | Stock: ${p.stock} | Precio: $${p.precio} | Cat: ${escapeHTML(p.categoria)}</p>
                        </div>
                    </div>
                    <div class="flex gap-2 shrink-0">
                        <button onclick="editarProducto(${p.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa fa-pen"></i></button>
                        <button onclick="eliminarProducto(${p.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
        }

        function editarProducto(id) {
            const data = adminDb.find(x => x.id === id);
            if (!data) return;
            
            productoEnEdicion = id;
            document.getElementById('producto-id').value = id;
            document.getElementById('producto-nombre').value = data.producto;
            document.getElementById('producto-sku').value = data.numero_producto || '';
            document.getElementById('producto-precio').value = data.precio;
            document.getElementById('producto-stock').value = data.stock;
            document.getElementById('producto-categoria').value = data.categoria || '';
            document.getElementById('producto-desc').value = data.descripcion || '';
            document.getElementById('producto-imagen-url').value = data.foto || '';
            
            if (data.foto) {
                document.getElementById('imagen-preview').src = data.foto;
                document.getElementById('imagen-actual').classList.remove('hidden');
            } else {
                document.getElementById('imagen-actual').classList.add('hidden');
            }
            document.getElementById('btn-guardar-producto').innerText = 'Guardar Cambios';
            document.getElementById('form-titulo').innerText = `Editar: ${escapeHTML(data.producto)}`;
            switchAdminTab('nuevo');
        }

        async function guardarProducto(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-guardar-producto');
            btn.innerText = "Guardando...";
            btn.disabled = true;

            const nombre = document.getElementById('producto-nombre').value;
            const sku = document.getElementById('producto-sku').value;
            const precio = parseFloat(document.getElementById('producto-precio').value);
            const stock = parseInt(document.getElementById('producto-stock').value);
            const categoria = document.getElementById('producto-categoria').value;
            const desc = document.getElementById('producto-desc').value;
            const imagenUrl = document.getElementById('producto-imagen-url').value;
            const productoId = document.getElementById('producto-id').value;

            if (precio < 0) { mostrarToast("El precio no puede ser negativo", "error"); btn.innerText = productoId ? "Guardar Cambios" : "Crear Producto"; btn.disabled = false; return; }
            if (stock < 0) { mostrarToast("El stock no puede ser negativo", "error"); btn.innerText = productoId ? "Guardar Cambios" : "Crear Producto"; btn.disabled = false; return; }

            try {
                const productoData = {
                    producto: nombre,
                    numero_producto: sku,
                    precio: precio,
                    stock: stock,
                    categoria: categoria,
                    descripcion: desc,
                    foto: imagenUrl,
                    estado_stock: stock > 0 ? 'Con Stock' : 'Sin Stock',
                    destacado: 0
                };

                if (productoId) {
                    const { error } = await supabaseClient.from('products').update(productoData).eq('id', productoId);
                    if (error) throw error;
                    mostrarToast("Producto actualizado", "success");
                } else {
                    const { error } = await supabaseClient.from('products').insert(productoData);
                    if (error) throw error;
                    mostrarToast("Producto creado", "success");
                }

                cancelarEdicion();
                cargarProductosAdmin();
                cargarProductosPagina(currentPage);
            } catch (err) {
                mostrarToast("Error: " + err.message, "error");
            } finally {
                btn.innerText = productoId ? "Guardar Cambios" : "Crear Producto";
                btn.disabled = false;
            }
        }

        async function eliminarProducto(id) {
            if (!confirm("¿Estás seguro de eliminar este producto?")) return;
            const { error } = await supabaseClient.from('products').delete().eq('id', id);
            if (error) {
                mostrarToast("Error al eliminar", "error");
            } else {
                mostrarToast("Producto eliminado", "success");
                cargarProductosAdmin();
                cargarProductosPagina(currentPage);
            }
        }

        // =========================================================================
        // PEDIDOS EN ADMIN (optimizado)
        // =========================================================================
        async function cargarPedidosLogistica() {
            const container = document.getElementById('admin-lista-pedidos');
            container.innerHTML = '<p class="text-gray-500 text-sm"><i class="fa fa-spinner fa-spin text-beige"></i> Cargando pedidos...</p>';
            
            try {
                const { data: pedidos, error } = await supabaseClient
                    .from('orders')
                    .select(`*, profiles:user_id ( nombre, telefono )`)
                    .order('created_at', { ascending: false });
                    
                if (error) throw error;
                
                if (!pedidos || pedidos.length === 0) {
                    container.innerHTML = '<p class="text-gray-500 text-sm">No hay pedidos registrados aún.</p>';
                    return;
                }

                const pedidosIds = pedidos.map(p => p.id);
                const { data: items, error: itemsError } = await supabaseClient
                    .from('order_items')
                    .select('*, product:product_id ( producto, foto )')
                    .in('order_id', pedidosIds);
                if (itemsError) throw itemsError;

                const itemsPorPedido = {};
                items.forEach(item => {
                    if (!itemsPorPedido[item.order_id]) itemsPorPedido[item.order_id] = [];
                    itemsPorPedido[item.order_id].push(item);
                });

                container.innerHTML = pedidos.map(pedido => {
                    const fecha = new Date(pedido.created_at).toLocaleString('es-CL');
                    const cliente = pedido.profiles || { nombre: 'Desconocido', telefono: '' };
                    const borderColor = {
                        'Pendiente de pago': 'border-red-300',
                        'Pendiente de Pago Flow': 'border-blue-300',
                        'Pagado': 'border-yellow-300',
                        'En preparación': 'border-purple-300',
                        'En reparto': 'border-indigo-300',
                        'Entregado': 'border-green-300',
                        'Rechazado': 'border-gray-300',
                        'Expirado': 'border-gray-400'
                    }[pedido.estado] || 'border-gray-200';
                    
                    const productosList = itemsPorPedido[pedido.id] 
                        ? `<div class="mt-3 text-xs bg-gray-50 p-2 rounded-lg">
                            <p class="font-bold text-gray-600 mb-1">Productos:</p>
                            ${itemsPorPedido[pedido.id].map(item => 
                                `<div class="flex justify-between text-gray-700">
                                    <span>${item.cantidad}x ${escapeHTML(item.product?.producto || 'Producto')}</span>
                                    <span class="font-mono">$${(item.cantidad * item.precio_historico).toLocaleString()}</span>
                                </div>`
                            ).join('')}
                           </div>`
                        : '';
                    
                    return `
                    <div class="bg-white border-2 ${borderColor} rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="font-black text-lg">#${pedido.id}</span>
                                <span class="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">${fecha}</span>
                                <span class="text-xs font-bold text-gray-700">${escapeHTML(cliente.nombre)}</span>
                                ${cliente.telefono ? `<span class="text-xs text-gray-500">📞 ${escapeHTML(cliente.telefono)}</span>` : ''}
                            </div>
                            <p class="text-sm font-bold text-gray-800"><i class="fa fa-map-marker-alt text-beige w-4"></i> ${escapeHTML(pedido.direccion_envio)}</p>
                            <p class="text-xs text-gray-500 mt-1"><i class="fa fa-truck text-gray-400 w-4"></i> Envío: ${escapeHTML(pedido.tipo_envio?.toUpperCase() || '')} | Doc: ${escapeHTML(pedido.tipo_doc || '')}</p>
                            <p class="text-sm font-black text-gray-900 mt-2">Total: $${(pedido.total || 0).toLocaleString()}</p>
                            ${productosList}
                        </div>
                        <div class="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                            <label class="text-[10px] font-bold text-gray-500 uppercase mb-1">Estado del Envío</label>
                            <select onchange="cambiarEstadoPedido(${pedido.id}, this.value)" class="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer focus:ring-1 focus:ring-beige">
                                <option value="Pendiente de pago" ${pedido.estado === 'Pendiente de pago' ? 'selected' : ''}>⏳ Pendiente de pago</option>
                                <option value="Pendiente de Pago Flow" ${pedido.estado === 'Pendiente de Pago Flow' ? 'selected' : ''}>🔄 Pendiente Flow</option>
                                <option value="Pagado" ${pedido.estado === 'Pagado' ? 'selected' : ''}>✅ Pagado</option>
                                <option value="En preparación" ${pedido.estado === 'En preparación' ? 'selected' : ''}>📦 En preparación</option>
                                <option value="En reparto" ${pedido.estado === 'En reparto' ? 'selected' : ''}>🚚 En reparto</option>
                                <option value="Entregado" ${pedido.estado === 'Entregado' ? 'selected' : ''}>🎉 Entregado</option>
                                <option value="Rechazado" ${pedido.estado === 'Rechazado' ? 'selected' : ''}>❌ Rechazado</option>
                                <option value="Expirado" ${pedido.estado === 'Expirado' ? 'selected' : ''}>⏰ Expirado</option>
                            </select>
                        </div>
                    </div>`;
                }).join('');
                
            } catch (error) {
                console.error(error);
                container.innerHTML = '<p class="text-red-500 text-sm">Error al cargar pedidos.</p>';
                mostrarToast("Error cargando pedidos", "error");
            }
        }

        async function cambiarEstadoPedido(id, nuevoEstado) {
            if (nuevoEstado === 'Entregado') {
                if (!confirm("¿Confirmas que el pedido ha sido entregado?")) {
                    cargarPedidosLogistica();
                    return;
                }
            }
            const { error } = await supabaseClient.from('orders').update({ estado: nuevoEstado }).eq('id', id);
            if (error) { mostrarToast("Error al actualizar", "error"); } 
            else { mostrarToast(`Pedido #${id} actualizado`, "success"); cargarPedidosLogistica(); }
        }

        // =========================================================================
        // TOAST Y UTILIDADES
        // =========================================================================
        function mostrarToast(msg, type = 'success') {
            const t = document.getElementById('toast-modal');
            const c = document.getElementById('toast-content');
            let color = type === 'error' ? 'bg-red-500' : (type === 'info' ? 'bg-blue-500' : 'bg-green-500');
            let icon = type === 'error' ? 'times' : (type === 'info' ? 'info' : 'check');
            c.innerHTML = `<div class="w-6 h-6 ${color} rounded-full flex items-center justify-center text-xs text-white"><i class="fa fa-${icon}"></i></div><span class="font-bold text-sm">${msg}</span>`;
            t.classList.remove('hidden'); 
            setTimeout(() => t.classList.add('toast-visible'), 10);
            setTimeout(() => { t.classList.remove('toast-visible'); setTimeout(() => t.classList.add('hidden'), 300); }, 2500);
        }

        function initSwipeGestures() {
            let touchStartX = 0, touchStartY = 0;
            document.addEventListener('touchstart', function(e) { 
                touchStartX = e.changedTouches[0].screenX; touchStartY = e.changedTouches[0].screenY; 
            }, {passive: true});
            document.addEventListener('touchend', function(e) {
                const diffX = touchStartX - e.changedTouches[0].screenX; 
                const diffY = Math.abs(touchStartY - e.changedTouches[0].screenY); 
                if (diffY < 30 && Math.abs(diffX) > 50) {
                    if (diffX > 0 && document.getElementById('cart-sidebar').classList.contains('translate-x-0')) { forceCloseCart(); }
                    else if (diffX < 0 && !document.getElementById('left-sidebar').classList.contains('-translate-x-full')) { handleBackAction(); }
                }
            }, {passive: true});
        }

        // =========================================================================
        // FUNCIONES LEGALES
        // =========================================================================
        function abrirLegal(tipo) {
            const titulo = document.getElementById('legal-modal-title');
            const contenido = document.getElementById('legal-modal-content');
            let texto = '';

            switch(tipo) {
                case 'terminos':
                    titulo.innerText = 'Términos y condiciones';
                    texto = `
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">1. Aceptación de los términos</h4>
                            <p>Al acceder y utilizar este sitio web, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo, no utilice este sitio.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">2. Uso del sitio</h4>
                            <p>Este sitio es para uso personal y no comercial. No puede modificar, copiar, distribuir ni transmitir ningún contenido sin autorización previa.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">3. Propiedad intelectual</h4>
                            <p>Todos los contenidos, logos, imágenes y diseños son propiedad de Papajose SPA o de sus respectivos titulares.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">4. Precios y disponibilidad</h4>
                            <p>Los precios están sujetos a cambio sin previo aviso. La disponibilidad de productos puede variar y está sujeta a confirmación en el momento del pago.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">5. Envíos y entregas</h4>
                            <p>Los plazos de entrega son estimados (1 a 2 días hábiles) y pueden sufrir demoras por causas externas. No nos responsabilizamos por pérdidas o daños ocasionados por la empresa de transporte externa una vez entregado el paquete a ellos.</p>
                        </div>`;
                    break;
                case 'privacidad':
                    titulo.innerText = 'Política de privacidad';
                    texto = `
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">1. Datos personales</h4>
                            <p>Recopilamos su nombre, correo, teléfono y dirección con el único fin de procesar pedidos y coordinar la logística de envío.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">2. Uso de la información</h4>
                            <p>Sus datos serán utilizados únicamente para la gestión de compras, envíos y comunicaciones relacionadas. No compartiremos, venderemos ni arrendaremos su información con terceros sin su consentimiento explícito, excepto cuando sea estrictamente necesario para el cumplimiento de obligaciones legales o logísticas (ej. empresa de transporte).</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">3. Seguridad Transaccional</h4>
                            <p>Todos los pagos son procesados externamente por la pasarela Flow. <strong>Papajose SPA no almacena ni tiene acceso a los datos de sus tarjetas de crédito o cuentas bancarias en ningún momento.</strong></p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">4. Derechos ARCO</h4>
                            <p>Puede solicitar acceso, rectificación, cancelación u oposición del uso de sus datos personales escribiendo directamente a contacto@papajose.cl</p>
                        </div>`;
                    break;
                case 'cookies':
                    titulo.innerText = 'Política de cookies';
                    texto = `
                        <div class="mb-8">
                            <p>Este sitio utiliza cookies propias y de terceros estrictamente para mejorar la experiencia de navegación (mantener su sesión iniciada, recordar los artículos en su carrito de compras) y realizar análisis estadísticos anónimos sobre el tráfico del sitio web a través de Google Analytics.</p>
                        </div>
                        <div class="mb-8">
                            <p>Al continuar navegando en nuestra tienda, usted acepta explícitamente el uso de estas cookies. Puede configurar su navegador de internet para rechazar todas las cookies o para que le avise cuando se envía una cookie. Sin embargo, si decide bloquear las cookies, es probable que no pueda completar el proceso de compra de manera exitosa.</p>
                        </div>`;
                    break;
                case 'derechos':
                    titulo.innerText = 'Derechos del consumidor';
                    texto = `
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Garantía legal (3x3)</h4>
                            <p>De acuerdo con la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores, todos nuestros productos nuevos cuentan con una garantía legal mínima de <strong>3 meses</strong>. Si el producto presenta fallas de fábrica que no sean imputables al consumidor, usted tiene el derecho irrenunciable a elegir entre: el cambio del producto, la reparación gratuita o la devolución de lo pagado.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Plazo de arrepentimiento (Derecho a Retracto)</h4>
                            <p>Usted puede desistir de su compra (arrepentirse) dentro de los <strong>10 días</strong> siguientes a la recepción del producto, siempre y cuando éste se encuentre sin uso, en perfectas condiciones y con su embalaje, sellos y etiquetas originales intactos. En este caso, el costo de devolución (envío) será de exclusiva cuenta del cliente.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Canal de Reclamos</h4>
                            <p>Para ejercer cualquiera de estos derechos, contáctenos de forma directa al correo contacto@papajose.cl o a nuestro canal de atención vía WhatsApp al +56936416743.</p>
                        </div>`;
                    break;
                case 'cambios':
                    titulo.innerText = 'Cambios y devoluciones';
                    texto = `
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Cambios por falla o defecto</h4>
                            <p>Si el producto presenta fallas comprobables dentro de los 3 meses posteriores a la compra, puede solicitar un cambio sin costo adicional. En estos casos, Papajose SPA se hará cargo de los costos de transporte involucrados en el retiro del producto defectuoso y la entrega del nuevo producto o, en su defecto, coordinará el reembolso total.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Cambios por insatisfacción, talla o color</h4>
                            <p>Como política de la empresa, sí aceptamos cambios por gusto, talla o color dentro de un plazo de 10 días, pero están sujetos a la disponibilidad de stock. En estos escenarios, <strong>el cliente deberá asumir los costos íntegros de envío de ida y vuelta</strong>. El producto a cambiar no debe presentar indicios de uso.</p>
                        </div>
                        <div class="mb-8">
                            <h4 class="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Proceso de Devolución de Dinero</h4>
                            <p>Una vez que recibamos el producto devuelto y nuestro equipo verifique que cumple con las condiciones (sin uso, embalaje original), el reembolso se emitirá en un plazo máximo de 7 días hábiles al mismo medio de pago utilizado o mediante transferencia bancaria a la cuenta indicada por el cliente titular de la compra.</p>
                        </div>`;
                    break;
                default:
                    return;
            }
            contenido.innerHTML = texto;
            
            const modal = document.getElementById('legal-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.classList.add('locked');
        }

        function cerrarLegal() {
            const modal = document.getElementById('legal-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.classList.remove('locked');
        }
    </script>
