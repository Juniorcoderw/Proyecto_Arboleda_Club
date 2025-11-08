/**
 * MENU-VIEWS.JS
 * Sistema de cambio entre vista detallada y simple
 * La Arboleda Club - 2025
 */

// ============================================
// ELEMENTOS DEL DOM
// ============================================
const ViewsDOM = {
  toggleDetailed: null,
  toggleSimple: null,
  menuGrid: null,
  menuSimple: null,
  
  init() {
    this.toggleDetailed = document.getElementById('toggleDetailed');
    this.toggleSimple = document.getElementById('toggleSimple');
    this.menuGrid = document.getElementById('menuGrid');
    this.menuSimple = document.getElementById('menuSimple');
  }
};


// ============================================
// CAMBIO DE VISTA
// ============================================

/**
 * Cambia a vista detallada (tarjetas)
 */
function switchToDetailedView() {
  if (!ViewsDOM.menuGrid || !ViewsDOM.menuSimple) return;
  
  // Actualizar estado global
  if (window.MenuLoader?.state) {
    window.MenuLoader.state.activeView = 'detailed';
  }
  
  // Actualizar botones
  updateViewButtons('detailed');
  
  // Ocultar vista simple con transición
  ViewsDOM.menuSimple.classList.remove('active');
  
  setTimeout(() => {
    ViewsDOM.menuSimple.style.display = 'none';
    ViewsDOM.menuSimple.classList.add('hidden');
    
    // Mostrar vista detallada
    ViewsDOM.menuGrid.style.display = 'grid';
    ViewsDOM.menuGrid.classList.remove('hidden');
    
    // Renderizar si es necesario
    if (window.MenuLoader?.state.data) {
      const category = window.MenuLoader.state.activeCategory;
      window.MenuLoader.renderDetailedView(
        window.MenuLoader.state.data,
        category
      );
    }
  }, 400);
  
  // Anunciar para screen readers
  announceViewChange('detallada');
}

/**
 * Cambia a vista simple (lista)
 */
function switchToSimpleView() {
  if (!ViewsDOM.menuGrid || !ViewsDOM.menuSimple) return;
  
  // Actualizar estado global
  if (window.MenuLoader?.state) {
    window.MenuLoader.state.activeView = 'simple';
  }
  
  // Actualizar botones
  updateViewButtons('simple');
  
  // Ocultar vista detallada
  ViewsDOM.menuGrid.style.display = 'none';
  ViewsDOM.menuGrid.classList.add('hidden');
  
  // Mostrar vista simple
  ViewsDOM.menuSimple.style.display = 'block';
  ViewsDOM.menuSimple.classList.remove('hidden');
  
  // Renderizar si es necesario
  if (window.MenuLoader?.state.data) {
    const category = window.MenuLoader.state.activeCategory;
    window.MenuLoader.renderSimpleView(
      window.MenuLoader.state.data,
      category
    );
  }
  
  // Activar animación
  requestAnimationFrame(() => {
    ViewsDOM.menuSimple.classList.add('active');
  });
  
  // Anunciar para screen readers
  announceViewChange('simple');
}

/**
 * Actualiza el estado visual de los botones de vista
 */
function updateViewButtons(activeView) {
  if (!ViewsDOM.toggleDetailed || !ViewsDOM.toggleSimple) return;
  
  const isDetailed = activeView === 'detailed';
  
  // Actualizar clases
  ViewsDOM.toggleDetailed.classList.toggle('view-toggle__btn--active', isDetailed);
  ViewsDOM.toggleSimple.classList.toggle('view-toggle__btn--active', !isDetailed);
  
  // Actualizar ARIA
  ViewsDOM.toggleDetailed.setAttribute('aria-pressed', isDetailed);
  ViewsDOM.toggleSimple.setAttribute('aria-pressed', !isDetailed);
}

/**
 * Anuncia cambios de vista para tecnologías asistivas
 */
function announceViewChange(viewName) {
  let announcer = document.getElementById('view-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'view-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  
  announcer.textContent = `Vista cambiada a ${viewName}`;
}


// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Inicializa los event listeners de vistas
 */
function initViewsListeners() {
  if (!ViewsDOM.toggleDetailed || !ViewsDOM.toggleSimple) {
    console.warn('Botones de toggle de vista no encontrados');
    return;
  }
  
  // Botón vista detallada
  ViewsDOM.toggleDetailed.addEventListener('click', switchToDetailedView);
  
  // Botón vista simple
  ViewsDOM.toggleSimple.addEventListener('click', switchToSimpleView);
  
  console.log('✅ Event listeners de vistas configurados');
}


// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa el sistema de vistas
 */
function initViews() {
  ViewsDOM.init();
  
  if (!ViewsDOM.toggleDetailed || !ViewsDOM.toggleSimple) {
    console.warn('Sistema de vistas no disponible en esta página');
    return;
  }
  
  initViewsListeners();
  
  // Establecer vista inicial
  updateViewButtons('detailed');
  
  console.log('✅ Sistema de vistas inicializado');
}


// ============================================
// EXPORTAR API PÚBLICA
// ============================================

window.MenuViews = {
  init: initViews,
  switchToDetailed: switchToDetailedView,
  switchToSimple: switchToSimpleView
};