// Variáveis globais
let currentSlideIndex = 0;
const sections = document.querySelectorAll('.slide');
const menuLinks = document.querySelectorAll('nav a');

// Função para ativar item do menu
function activateMenu(sectionId) {
  menuLinks.forEach(link => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle('active', isActive);
  });
}

// Função para scroll manual (mantida para compatibilidade)
function scrollToSlide(index) {
  const slideWidth = window.innerWidth;
  const wrapper = document.getElementById("slides");
  
  // Só executa se estiver em desktop
  if (window.innerWidth > 768) {
    wrapper.style.transform = `translateX(-${index * slideWidth}px)`;
    currentSlideIndex = index;
    
    // Ativa o menu correspondente
    const sectionId = sections[index]?.id;
    if (sectionId) {
      activateMenu(sectionId);
    }
    
    sessionStorage.setItem("currentSlide", index);
  }
}

// Configuração do Intersection Observer
function setupIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6 // 60% da seção deve estar visível
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        activateMenu(sectionId);
        
        // Atualiza o índice atual para desktop
        if (window.innerWidth > 768) {
          const sectionIndex = Array.from(sections).indexOf(entry.target);
          currentSlideIndex = sectionIndex;
          sessionStorage.setItem("currentSlide", sectionIndex);
        }
      }
    });
  }, observerOptions);

  // Observa todas as seções
  sections.forEach(section => {
    observer.observe(section);
  });

  return observer;
}

// Função para navegação suave em mobile
function smoothScrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Event listeners para os links do menu
function setupMenuNavigation() {
  menuLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const sectionId = link.dataset.section;
      
      if (window.innerWidth > 768) {
        // Desktop: usa scroll horizontal
        scrollToSlide(index);
      } else {
        // Mobile: usa scroll vertical suave
        smoothScrollToSection(sectionId);
      }
    });
  });
}

// Função para redimensionamento da janela
function handleResize() {
  if (window.innerWidth > 768) {
    // Desktop: restaura posição do slide
    const wrapper = document.getElementById("slides");
    const slideWidth = window.innerWidth;
    wrapper.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
  } else {
    // Mobile: remove transform
    const wrapper = document.getElementById("slides");
    wrapper.style.transform = 'translateX(0)';
  }
}

// Função de inicialização
function initializePortfolio() {
  // Configura o Intersection Observer
  setupIntersectionObserver();
  
  // Configura navegação do menu
  setupMenuNavigation();
  
  // Restaura slide salvo (apenas para desktop)
  if (window.innerWidth > 768) {
    const savedSlide = parseInt(sessionStorage.getItem("currentSlide")) || 0;
    scrollToSlide(savedSlide);
  } else {
    // Para mobile, ativa o primeiro item do menu
    activateMenu('sobre');
  }
  
  // Event listener para redimensionamento
  window.addEventListener('resize', handleResize);
}

// Função para detectar mudanças de orientação em mobile
function handleOrientationChange() {
  setTimeout(() => {
    handleResize();
  }, 100);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Event listener para mudanças de orientação
window.addEventListener('orientationchange', handleOrientationChange);

// Fallback para window.onload (compatibilidade)
window.onload = () => {
  if (!document.readyState || document.readyState === 'loading') {
    initializePortfolio();
  }
};

// Função para debug (pode ser removida em produção)
function debugCurrentSection() {
  console.log('Seção atual:', currentSlideIndex);
  console.log('Seções disponíveis:', Array.from(sections).map(s => s.id));
  console.log('Links do menu:', Array.from(menuLinks).map(l => l.dataset.section));
}

// Exporta funções para uso global (se necessário)
window.scrollToSlide = scrollToSlide;
window.debugCurrentSection = debugCurrentSection;

