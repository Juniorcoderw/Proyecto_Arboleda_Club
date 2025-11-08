/**
 * MODAL.JS
 * Sistema de modales reutilizable con accesibilidad
 * La Arboleda Club - 2025
 */

// ============================================
// ESTADO DEL MODAL
// ============================================
let modalState = {
  isOpen: false,
  lastFocusedElement: null,
  focusableElements: []
};


// ============================================
// ELEMENTOS DEL DOM
// ============================================
const ModalDOM = {
  modal: null,
  overlay: null,
  closeBtn: null,
  image: null,
  title: null,
  description: null,
  price: null,
  
  init() {
    this.modal = document.getElementById('menuModal');
    this.overlay = this.modal?.querySelector('.modal__overlay');
    this.closeBtn = document.getElementById('modalClose');
    this.image = document.getElementById('modalImage');
    this.title = document.getElementById('modalTitle');
    this.description = document.getElementById('modalDescription');
    this.price = document.getElementById('modalPrice');
  }
};


// ============================================
// ABRIR MODAL
// ============================================

/**
 * Abre el modal con información de un plato
 * @param {Object} plato - Datos del plato
 */
function openMenuModal(plato) {
  if (!ModalDOM.modal) {
    console.error('Modal no encontrado en el DOM');
    return;
  }
  
  // Guardar el elemento que tenía foco
  modalState.lastFocusedElement = document.activeElement;
  
  // Actualizar contenido del modal
  if (ModalDOM.image) {
    ModalDOM.image.src = plato.imagen;
    ModalDOM.image.alt = plato.nombre;
  }
  
  if (ModalDOM.title) {
    ModalDOM.title.textContent = plato.nombre;
  }
  
  if (ModalDOM.description) {
    ModalDOM.description.textContent = plato.descripcion;
  }
  
  if (ModalDOM.price) {
    ModalDOM.price.textContent = `S/ ${plato.precio}`;
  }
  
  // Mostrar modal
  ModalDOM.modal.style.display = 'flex';
  ModalDOM.modal.setAttribute('aria-hidden', 'false');
  
  // Esperar un frame para la animación
  requestAnimationFrame(() => {
    ModalDOM.modal.style.opacity = '1';
  });
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
  
  // Configurar focus trap
  setupFocusTrap();
  
  // Enfocar el botón de cerrar
  setTimeout(() => {
    ModalDOM.closeBtn?.focus();
  }, 100);
  
  // Actualizar estado
  modalState.isOpen = true;
}


// ============================================
// CERRAR MODAL
// ============================================

/**
 * Cierra el modal
 */
function closeMenuModal() {
  if (!ModalDOM.modal || !modalState.isOpen) return;
  
  // Animación de salida
  ModalDOM.modal.style.opacity = '0';
  
  setTimeout(() => {
    ModalDOM.modal.style.display = 'none';
    ModalDOM.modal.setAttribute('aria-hidden', 'true');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    // Restaurar foco al elemento anterior
    if (modalState.lastFocusedElement) {
      modalState.lastFocusedElement.focus();
    }
    
    // Actualizar estado
    modalState.isOpen = false;
  }, 300);
}


// ============================================
// FOCUS TRAP (ACCESIBILIDAD)
// ============================================

/**
 * Configura el focus trap dentro del modal
 */
function setupFocusTrap() {
  if (!ModalDOM.modal) return;
  
  // Obtener todos los elementos enfocables
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  modalState.focusableElements = Array.from(
    ModalDOM.modal.querySelectorAll(focusableSelectors)
  );
}

/**
 * Maneja la navegación por Tab dentro del modal
 */
function handleModalTab(event) {
  if (!modalState.isOpen || event.key !== 'Tab') return;
  
  const firstElement = modalState.focusableElements[0];
  const lastElement = modalState.focusableElements[modalState.focusableElements.length - 1];
  
  // Si shift+tab en el primer elemento, ir al último
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }
  // Si tab en el último elemento, ir al primero
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}


// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Inicializa todos los event listeners del modal
 */
function initModalListeners() {
  if (!ModalDOM.modal) return;
  
  // Botón de cerrar
  ModalDOM.closeBtn?.addEventListener('click', closeMenuModal);
  
  // Clic en overlay para cerrar
  ModalDOM.overlay?.addEventListener('click', closeMenuModal);
  
  // Tecla ESC para cerrar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalState.isOpen) {
      closeMenuModal();
    }
  });
  
  // Focus trap
  document.addEventListener('keydown', handleModalTab);
  
  console.log('✅ Event listeners del modal configurados');
}


// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa el sistema de modales
 */
function initModal() {
  ModalDOM.init();
  
  if (!ModalDOM.modal) {
    console.warn('Modal no encontrado, funcionalidad deshabilitada');
    return;
  }
  
  initModalListeners();
  console.log('✅ Sistema de modales inicializado');
}


// ============================================
// EXPORTAR API PÚBLICA
// ============================================

window.Modal = {
  init: initModal,
  open: openMenuModal,
  close: closeMenuModal
};

// Hacer disponible la función global para compatibilidad
window.openMenuModal = openMenuModal;
window.closeModal = closeMenuModal;