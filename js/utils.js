/**
 * UTILS.JS
 * Funciones auxiliares y utilidades reutilizables
 * La Arboleda Club - 2025
 */

// ============================================
// DEBOUNCE Y THROTTLE
// ============================================

/**
 * Debounce: Retrasa la ejecución de una función hasta que
 * haya pasado un tiempo sin que se vuelva a llamar
 * 
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
function debounce(func, wait = 250) {
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

/**
 * Throttle: Limita la frecuencia de ejecución de una función
 * 
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Tiempo mínimo entre ejecuciones en ms
 * @returns {Function} Función throttled
 */
function throttle(func, limit = 250) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


// ============================================
// MANIPULACIÓN DE DOM
// ============================================

/**
 * Crea un elemento HTML con atributos y contenido
 * 
 * @param {string} tag - Etiqueta HTML
 * @param {Object} attributes - Atributos del elemento
 * @param {string|Node} content - Contenido del elemento
 * @returns {HTMLElement}
 */
function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Aplicar atributos
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Aplicar contenido
  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof Node) {
    element.appendChild(content);
  }
  
  return element;
}

/**
 * Verifica si un elemento es visible en el viewport
 * 
 * @param {HTMLElement} element - Elemento a verificar
 * @returns {boolean}
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Hace scroll suave hacia un elemento
 * 
 * @param {HTMLElement|string} target - Elemento o selector
 * @param {number} offset - Offset superior en píxeles
 */
function scrollToElement(target, offset = 0) {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;
  
  if (!element) {
    console.warn('Elemento no encontrado para scroll');
    return;
  }
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}


// ============================================
// VALIDACIÓN Y FORMATO
// ============================================

/**
 * Valida un email
 * 
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Formatea un número como precio en soles
 * 
 * @param {number} amount - Cantidad a formatear
 * @returns {string}
 */
function formatPrice(amount) {
  return `S/ ${parseFloat(amount).toFixed(2)}`;
}

/**
 * Capitaliza la primera letra de cada palabra
 * 
 * @param {string} str - Cadena a capitalizar
 * @returns {string}
 */
function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Trunca un texto a una longitud específica
 * 
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @param {string} suffix - Sufijo a agregar
 * @returns {string}
 */
function truncateText(text, length = 100, suffix = '...') {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
}


// ============================================
// ALMACENAMIENTO LOCAL
// ============================================

/**
 * Guarda datos en localStorage de forma segura
 * 
 * @param {string} key - Clave del storage
 * @param {*} value - Valor a guardar
 * @returns {boolean} - Éxito de la operación
 */
function setLocalStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    return false;
  }
}

/**
 * Obtiene datos de localStorage de forma segura
 * 
 * @param {string} key - Clave del storage
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*}
 */
function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return defaultValue;
  }
}

/**
 * Elimina un item de localStorage
 * 
 * @param {string} key - Clave del storage
 */
function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
  }
}


// ============================================
// UTILIDADES DE FECHA
// ============================================

/**
 * Formatea una fecha en español
 * 
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string}
 */
function formatDate(date, options = {}) {
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return dateObj.toLocaleDateString('es-PE', defaultOptions);
}


// ============================================
// DETECCIÓN DE CARACTERÍSTICAS
// ============================================

/**
 * Detecta si el dispositivo es móvil
 * 
 * @returns {boolean}
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detecta si el navegador soporta una característica
 * 
 * @param {string} feature - Característica a detectar
 * @returns {boolean}
 */
function supportsFeature(feature) {
  const features = {
    'webp': () => {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext || !canvas.getContext('2d')) return false;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },
    'localStorage': () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    },
    'intersection': () => {
      return 'IntersectionObserver' in window;
    }
  };
  
  return features[feature] ? features[feature]() : false;
}


// ============================================
// GENERADORES DE IDs
// ============================================

/**
 * Genera un ID único
 * 
 * @returns {string}
 */
function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Genera un slug a partir de un texto
 * 
 * @param {string} text - Texto a convertir
 * @returns {string}
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Múltiples guiones a uno solo
}


// ============================================
// UTILIDADES DE PERFORMANCE
// ============================================

/**
 * Ejecuta una función cuando el navegador esté inactivo
 * 
 * @param {Function} callback - Función a ejecutar
 * @param {Object} options - Opciones de timeout
 */
function runWhenIdle(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Mide el tiempo de ejecución de una función
 * 
 * @param {Function} func - Función a medir
 * @param {string} label - Etiqueta para el log
 */
function measurePerformance(func, label = 'Function') {
  const start = performance.now();
  func();
  const end = performance.now();
  console.log(`${label} ejecutada en ${(end - start).toFixed(2)}ms`);
}


// ============================================
// EXPORTAR UTILIDADES
// ============================================

// Hacer disponibles globalmente
window.Utils = {
  // Timing
  debounce,
  throttle,
  
  // DOM
  createElement,
  isElementInViewport,
  scrollToElement,
  
  // Validación y formato
  isValidEmail,
  formatPrice,
  capitalizeWords,
  truncateText,
  formatDate,
  
  // Storage
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  
  // Detección
  isMobileDevice,
  supportsFeature,
  
  // IDs y slugs
  generateUniqueId,
  slugify,
  
  // Performance
  runWhenIdle,
  measurePerformance
};