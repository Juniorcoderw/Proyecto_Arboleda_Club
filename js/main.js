/**
 * MAIN.JS
 * Archivo principal que inicializa todos los módulos del sitio
 * La Arboleda Club - 2025
 */

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const APP_CONFIG = {
  stickyHeaderOffset: 180,
  scrollDebounceDelay: 100,
  observerThreshold: 0.15
};


// ============================================
// NAVEGACIÓN MÓVIL
// ============================================

/**
 * Inicializa el menú hamburguesa para móviles
 */
function initMobileNav() {
  const toggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!toggle || !navMenu) return;
  
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle del menú
    navMenu.classList.toggle('show');
    
    // Actualizar ARIA
    toggle.setAttribute('aria-expanded', !isExpanded);
    
    // Cambiar icono
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
    }
  });
  
  // Cerrar menú al hacer clic en un enlace
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-bars';
      }
    });
  });
  
  console.log('✅ Navegación móvil inicializada');
}


// ============================================
// STICKY HEADER
// ============================================

/**
 * Maneja la aparición del sticky header al hacer scroll
 */
function initStickyHeader() {
  const stickyHeader = document.getElementById('stickyHeader');
  if (!stickyHeader) return;
  
  const handleScroll = debounce(() => {
    if (window.scrollY > APP_CONFIG.stickyHeaderOffset) {
      stickyHeader.classList.add('visible');
    } else {
      stickyHeader.classList.remove('visible');
    }
  }, APP_CONFIG.scrollDebounceDelay);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  console.log('✅ Sticky header inicializado');
}


// ============================================
// INTERSECTION OBSERVER (ANIMACIONES)
// ============================================

/**
 * Configura el observer para animaciones de entrada
 */
function initScrollAnimations() {
  // Crear observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: APP_CONFIG.observerThreshold,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observar elementos del footer y otras secciones
  const elementsToObserve = [
    '.footer__contacto',
    '.footer__mapa',
    '.footer__bottom',
    '.social-link',
    '.evento-card',
    '.convenios-carousel img'
  ];
  
  elementsToObserve.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  });
  
  console.log('✅ Animaciones de scroll configuradas');
}


// ============================================
// SMOOTH SCROLL PARA ANCLAS
// ============================================

/**
 * Mejora el comportamiento de scroll para enlaces ancla
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignorar # solo
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Actualizar hash sin scroll
      history.pushState(null, null, href);
      
      // Enfocar elemento para accesibilidad
      target.focus({ preventScroll: true });
    });
  });
  
  console.log('✅ Smooth scroll configurado');
}


// ============================================
// NAVEGACIÓN ACTIVA
// ============================================

/**
 * Actualiza el enlace activo según la sección visible
 */
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  const handleScroll = debounce(() => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('nav__link--active');
      }
    });
  }, 100);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  console.log('✅ Navegación activa configurada');
}


// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

/**
 * Precarga imágenes críticas
 */
function preloadCriticalImages() {
  const criticalImages = [
    'assets/hero.jpg',
    'assets/hero-menu.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Lazy loading para imágenes con IntersectionObserver
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    console.log('✅ Lazy loading nativo activo');
    return;
  }
  
  // Fallback con IntersectionObserver
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
  
  console.log('✅ Lazy loading con observer configurado');
}


// ============================================
// INICIALIZACIÓN DE PÁGINA
// ============================================

/**
 * Inicializa funcionalidades comunes a todas las páginas
 */
function initCommonFeatures() {
  console.log('🚀 Inicializando La Arboleda Club...');
  
  // Navegación
  initMobileNav();
  initSmoothScroll();
  initActiveNavigation();
  
  // Animaciones
  initScrollAnimations();
  
  // Performance
  initLazyLoading();
  
  console.log('✅ Funcionalidades comunes inicializadas');
}

/**
 * Inicializa funcionalidades específicas de la página del menú
 */
async function initMenuPage() {
  console.log('📋 Inicializando página de menú...');
  
  // Sticky header
  initStickyHeader();
  
  // Sistema de modales
  if (window.Modal) {
    window.Modal.init();
  }
  
  // Cargar datos del menú
  if (window.MenuLoader) {
    await window.MenuLoader.init();
  }
  
  // Sistema de filtros
  if (window.MenuFilters) {
    window.MenuFilters.init();
  }
  
  // Sistema de vistas
  if (window.MenuViews) {
    window.MenuViews.init();
  }
  
  console.log('✅ Página de menú inicializada');
}


// ============================================
// AUTO-INICIALIZACIÓN
// ============================================

/**
 * Función principal que se ejecuta cuando el DOM está listo
 */
function init() {
  // Funcionalidades comunes
  initCommonFeatures();
  
  // Detectar página actual e inicializar funcionalidades específicas
  const isMenuPage = document.getElementById('menuGrid') !== null;
  
  if (isMenuPage) {
    initMenuPage();
  }
  
  console.log('✨ La Arboleda Club está lista!');
}

// Ejecutar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

window.addEventListener('error', (event) => {
  console.error('Error capturado:', event.error);
  
  // En producción, podrías enviar esto a un servicio de logging
  // sendToErrorTracking(event.error);
});

// Manejo de promesas rechazadas sin catch
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesa rechazada sin manejar:', event.reason);
  event.preventDefault();
});