/**
 * MENU-LOADER.JS
 * Carga y gestión de datos del menú desde JSON
 * La Arboleda Club - 2025
 */

// ============================================
// ESTADO GLOBAL DEL MENÚ
// ============================================
const MenuState = {
  data: null,
  activeCategory: 'all',
  activeView: 'detailed', // 'detailed' o 'simple'
  isLoading: false,
  error: null
};


// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
  jsonUrl: 'data/menu.json',
  cacheKey: 'arboleda_menu_cache',
  cacheExpiry: 1000 * 60 * 60 * 24, // 24 horas
  animationDelay: 50 // ms entre animaciones de items
};


// ============================================
// ELEMENTOS DEL DOM
// ============================================
const DOM = {
  menuGrid: null,
  menuSimple: null,
  menuFilters: null,
  loadingState: null,
  errorState: null,
  
  // Método para inicializar todos los elementos
  init() {
    this.menuGrid = document.getElementById('menuGrid');
    this.menuSimple = document.getElementById('menuSimple');
    this.menuFilters = document.getElementById('menuFilters');
    this.loadingState = document.getElementById('loadingState');
    this.errorState = document.getElementById('errorState');
  }
};


// ============================================
// FUNCIONES DE CACHÉ
// ============================================

/**
 * Guarda datos en localStorage con timestamp
 */
function saveToCache(data) {
  try {
    const cacheData = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(CONFIG.cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('No se pudo guardar en caché:', error);
  }
}

/**
 * Obtiene datos del caché si no han expirado
 */
function getFromCache() {
  try {
    const cached = localStorage.getItem(CONFIG.cacheKey);
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    
    if (age > CONFIG.cacheExpiry) {
      localStorage.removeItem(CONFIG.cacheKey);
      return null;
    }
    
    return cacheData.data;
  } catch (error) {
    console.warn('Error al leer caché:', error);
    return null;
  }
}


// ============================================
// CARGA DE DATOS
// ============================================

/**
 * Carga el menú desde JSON con sistema de caché
 */
async function loadMenuData() {
  MenuState.isLoading = true;
  showLoading();
  
  try {
    // Intentar obtener del caché primero
    const cachedData = getFromCache();
    if (cachedData) {
      console.log('📦 Menú cargado desde caché');
      MenuState.data = cachedData;
      MenuState.isLoading = false;
      return cachedData;
    }
    
    // Si no hay caché, cargar desde el servidor
    console.log('🌐 Cargando menú desde servidor...');
    const response = await fetch(CONFIG.jsonUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validar estructura de datos
    if (!data || typeof data !== 'object') {
      throw new Error('Formato de datos inválido');
    }
    
    // Guardar en caché y estado
    saveToCache(data);
    MenuState.data = data;
    MenuState.isLoading = false;
    MenuState.error = null;
    
    console.log('✅ Menú cargado exitosamente');
    return data;
    
  } catch (error) {
    console.error('❌ Error al cargar menú:', error);
    MenuState.isLoading = false;
    MenuState.error = error.message;
    showError();
    throw error;
  }
}


// ============================================
// RENDERIZADO DE FILTROS
// ============================================

/**
 * Genera los botones de filtro de categorías
 */
function renderFilters(data) {
  if (!DOM.menuFilters) return;
  
  const categories = Object.keys(data);
  
  // Crear botón "Todos"
  const allButton = createFilterButton('all', 'Todos', true);
  
  // Crear botones para cada categoría
  const categoryButtons = categories.map(cat => {
    const displayName = capitalizeFirst(cat);
    return createFilterButton(cat, displayName, false);
  });
  
  // Insertar en el DOM
  DOM.menuFilters.innerHTML = '';
  DOM.menuFilters.appendChild(allButton);
  categoryButtons.forEach(btn => DOM.menuFilters.appendChild(btn));
}

/**
 * Crea un botón de filtro individual
 */
function createFilterButton(category, label, isActive) {
  const button = document.createElement('button');
  button.className = `filter-btn ${isActive ? 'filter-btn--active' : ''}`;
  button.textContent = label;
  button.dataset.category = category;
  button.setAttribute('aria-label', `Filtrar por ${label}`);
  button.setAttribute('aria-pressed', isActive);
  
  return button;
}


// ============================================
// RENDERIZADO VISTA DETALLADA
// ============================================

/**
 * Renderiza platos en vista de tarjetas
 */
function renderDetailedView(data, category = 'all') {
  if (!DOM.menuGrid) return;
  
  DOM.menuGrid.innerHTML = '';
  
  // Determinar qué categorías mostrar
  const categories = category === 'all' ? Object.keys(data) : [category];
  
  // Contador para animaciones escalonadas
  let itemIndex = 0;
  
  categories.forEach(cat => {
    if (!data[cat]) return;
    
    data[cat].forEach(plato => {
      const card = createMenuCard(plato, itemIndex);
      DOM.menuGrid.appendChild(card);
      
      // Animar con delay
      setTimeout(() => {
        card.classList.add('visible');
      }, itemIndex * CONFIG.animationDelay);
      
      itemIndex++;
    });
  });
  
  // Si no hay items, mostrar mensaje
  if (itemIndex === 0) {
    DOM.menuGrid.innerHTML = '<p class="text-center">No hay platos en esta categoría.</p>';
  }
}

/**
 * Crea una tarjeta de plato individual
 */
function createMenuCard(plato, index) {
  const card = document.createElement('article');
  card.className = 'menu-item';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Ver detalles de ${plato.nombre}`);
  
  card.innerHTML = `
    <img 
      src="${plato.imagen}" 
      alt="${plato.nombre}"
      class="menu-item__image"
      loading="lazy"
    >
    <div class="menu-item__content">
      <h3 class="menu-item__title">${plato.nombre}</h3>
      <p class="menu-item__price">S/ ${plato.precio}</p>
    </div>
  `;
  
  // Eventos de clic y teclado
  card.addEventListener('click', () => openMenuModal(plato));
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenuModal(plato);
    }
  });
  
  return card;
}


// ============================================
// RENDERIZADO VISTA SIMPLE
// ============================================

/**
 * Renderiza platos en vista de lista simple
 */
function renderSimpleView(data, category = 'all') {
  if (!DOM.menuSimple) return;
  
  DOM.menuSimple.innerHTML = '';
  
  // Determinar qué categorías mostrar
  const categories = category === 'all' ? Object.keys(data) : [category];
  
  categories.forEach(cat => {
    if (!data[cat] || data[cat].length === 0) return;
    
    // Título de categoría
    const title = document.createElement('h3');
    title.textContent = capitalizeFirst(cat);
    DOM.menuSimple.appendChild(title);
    
    // Lista de platos
    const list = document.createElement('ul');
    data[cat].forEach(plato => {
      const item = document.createElement('li');
      item.innerHTML = `
        <span>${plato.nombre}</span>
        <span>S/ ${plato.precio}</span>
      `;
      list.appendChild(item);
    });
    
    DOM.menuSimple.appendChild(list);
  });
  
  // Si no hay items, mostrar mensaje
  if (categories.length === 0 || !DOM.menuSimple.hasChildNodes()) {
    DOM.menuSimple.innerHTML = '<p class="text-center">No hay platos en esta categoría.</p>';
  }
}


// ============================================
// ESTADOS DE CARGA Y ERROR
// ============================================

function showLoading() {
  if (DOM.loadingState) {
    DOM.loadingState.classList.remove('hidden');
  }
  if (DOM.errorState) {
    DOM.errorState.classList.add('hidden');
  }
  if (DOM.menuGrid) {
    DOM.menuGrid.style.display = 'none';
  }
  if (DOM.menuSimple) {
    DOM.menuSimple.style.display = 'none';
  }
}

function hideLoading() {
  if (DOM.loadingState) {
    DOM.loadingState.classList.add('hidden');
  }
  if (MenuState.activeView === 'detailed' && DOM.menuGrid) {
    DOM.menuGrid.style.display = 'grid';
  } else if (MenuState.activeView === 'simple' && DOM.menuSimple) {
    DOM.menuSimple.style.display = 'block';
  }
}

function showError() {
  if (DOM.loadingState) {
    DOM.loadingState.classList.add('hidden');
  }
  if (DOM.errorState) {
    DOM.errorState.classList.remove('hidden');
  }
  if (DOM.menuGrid) {
    DOM.menuGrid.style.display = 'none';
  }
  if (DOM.menuSimple) {
    DOM.menuSimple.style.display = 'none';
  }
}


// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa el cargador del menú
 */
async function initMenuLoader() {
  // Inicializar referencias del DOM
  DOM.init();
  
  try {
    // Cargar datos del menú
    const data = await loadMenuData();
    
    // Renderizar filtros
    renderFilters(data);
    
    // Renderizar vista inicial (detallada)
    renderDetailedView(data, MenuState.activeCategory);
    
    // Ocultar loading
    hideLoading();
    
    console.log('✅ Menu loader inicializado');
    
  } catch (error) {
    console.error('❌ Error al inicializar menu loader:', error);
  }
}


// ============================================
// UTILIDADES
// ============================================

/**
 * Capitaliza la primera letra de una cadena
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ============================================
// EXPORTAR FUNCIONES PÚBLICAS
// ============================================

// Hacer disponibles globalmente para otros módulos
window.MenuLoader = {
  init: initMenuLoader,
  renderDetailedView,
  renderSimpleView,
  state: MenuState
};