/**
 * MENU-FILTERS.JS
 * Sistema de filtrado de categorías del menú
 * La Arboleda Club - 2025
 */

// ============================================
// MANEJO DE FILTROS
// ============================================

/**
 * Inicializa el sistema de filtros
 */
function initFilters() {
  const filtersContainer = document.getElementById('menuFilters');
  
  if (!filtersContainer) {
    console.warn('Contenedor de filtros no encontrado');
    return;
  }
  
  // Delegación de eventos para mejor performance
  filtersContainer.addEventListener('click', handleFilterClick);
  
  // También soportar navegación por teclado
  filtersContainer.addEventListener('keypress', handleFilterKeypress);
  
  console.log('✅ Sistema de filtros inicializado');
}

/**
 * Maneja el clic en un botón de filtro
 */
function handleFilterClick(event) {
  const button = event.target.closest('.filter-btn');
  if (!button) return;
  
  const category = button.dataset.category;
  applyFilter(category);
}

/**
 * Maneja la navegación por teclado en filtros
 */
function handleFilterKeypress(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  
  const button = event.target.closest('.filter-btn');
  if (!button) return;
  
  event.preventDefault();
  const category = button.dataset.category;
  applyFilter(category);
}

/**
 * Aplica un filtro de categoría
 */
function applyFilter(category) {
  // Actualizar estado global
  if (window.MenuLoader && window.MenuLoader.state) {
    window.MenuLoader.state.activeCategory = category;
  }
  
  // Actualizar UI de botones
  updateFilterButtons(category);
  
  // Re-renderizar el menú con el filtro aplicado
  if (window.MenuLoader && window.MenuLoader.state.data) {
    const currentView = window.MenuLoader.state.activeView;
    
    if (currentView === 'detailed') {
      window.MenuLoader.renderDetailedView(
        window.MenuLoader.state.data, 
        category
      );
    } else {
      window.MenuLoader.renderSimpleView(
        window.MenuLoader.state.data, 
        category
      );
    }
  }
  
  // Scroll suave al inicio del menú
  scrollToMenu();
  
  // Anunciar cambio para screen readers
  announceFilterChange(category);
}

/**
 * Actualiza el estado visual de los botones de filtro
 */
function updateFilterButtons(activeCategory) {
  const allButtons = document.querySelectorAll('.filter-btn');
  
  allButtons.forEach(button => {
    const isActive = button.dataset.category === activeCategory;
    
    // Actualizar clases
    button.classList.toggle('filter-btn--active', isActive);
    
    // Actualizar ARIA
    button.setAttribute('aria-pressed', isActive);
  });
}

/**
 * Scroll suave al contenedor del menú
 */
function scrollToMenu() {
  const menuGrid = document.getElementById('menuGrid');
  const menuSimple = document.getElementById('menuSimple');
  const target = menuGrid?.style.display !== 'none' ? menuGrid : menuSimple;
  
  if (target) {
    const offset = 100; // Espacio superior
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Anuncia cambios de filtro para tecnologías asistivas
 */
function announceFilterChange(category) {
  // Crear elemento de anuncio ARIA live
  let announcer = document.getElementById('filter-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'filter-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  
  const categoryName = category === 'all' ? 'todos los platos' : category;
  announcer.textContent = `Mostrando ${categoryName}`;
}

/**
 * Obtiene la categoría activa actual
 */
function getActiveCategory() {
  const activeButton = document.querySelector('.filter-btn--active');
  return activeButton ? activeButton.dataset.category : 'all';
}

/**
 * Resetea los filtros al estado inicial
 */
function resetFilters() {
  applyFilter('all');
}


// ============================================
// EXPORTAR API PÚBLICA
// ============================================

window.MenuFilters = {
  init: initFilters,
  apply: applyFilter,
  reset: resetFilters,
  getActive: getActiveCategory
};