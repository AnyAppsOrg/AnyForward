document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeSwitch = document.getElementById('theme-switch');
  const themeIconPath = themeSwitch.querySelector('path');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  
  const sunIcon = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
  const moonIcon = "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z";
  
  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIconPath.setAttribute('d', sunIcon);
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIconPath.setAttribute('d', moonIcon);
      localStorage.setItem('theme', 'light');
    }
  }

  // Initial theme setup
  if (savedTheme === 'light') {
    setTheme(false);
  } else {
    setTheme(true);
  }

  themeSwitch.addEventListener('click', () => {
    const isDark = document.documentElement.hasAttribute('data-theme');
    setTheme(!isDark);
  });

  // --- Language Switcher ---
  const langSelectBtn = document.getElementById('lang-select-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const langOptions = document.querySelectorAll('.lang-option');
  
  let currentLang = localStorage.getItem('lang') || 'en';
  
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    if (langSelectBtn) {
      if (lang === 'fr') {
        langSelectBtn.innerHTML = '<img src="https://flagcdn.com/fr.svg" width="18" alt="FR"> <span>FR</span>';
      } else {
        langSelectBtn.innerHTML = '<img src="https://flagcdn.com/gb.svg" width="18" alt="EN"> <span>EN</span>';
      }
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }

  // Initial language setup
  setLanguage(currentLang);

  if (langSelectBtn && langDropdown) {
    // Toggle dropdown
    langSelectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = langSelectBtn.getAttribute('aria-expanded') === 'true';
      langSelectBtn.setAttribute('aria-expanded', !isExpanded);
      langDropdown.classList.toggle('show');
    });

    // Handle option click
    langOptions.forEach(option => {
      option.addEventListener('click', () => {
        setLanguage(option.getAttribute('data-lang'));
        langDropdown.classList.remove('show');
        langSelectBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langSelectBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('show');
        langSelectBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });
  }

  // --- SPA Tab Navigation ---
  const navLinks = document.querySelectorAll('.nav-link');
  const tabSections = document.querySelectorAll('.tab-section');

  function switchTab(targetId) {
    // Hide all sections
    tabSections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Deactivate all nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    } else {
      // Fallback to home
      document.getElementById('home').classList.add('active');
      targetId = 'home';
    }

    // Activate corresponding nav links
    document.querySelectorAll(`.nav-link[data-target="${targetId}"]`).forEach(link => {
      link.classList.add('active');
    });

    // Close mobile menu if open
    if (navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
    }
  }

  // Handle clicks on navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');
      if (targetId) {
        // Prevent default only if it's an internal tab link
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            window.location.hash = targetId;
            switchTab(targetId);
            window.scrollTo(0, 0);
        }
      }
    });
  });

  // Handle initial load based on URL hash
  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      switchTab(hash);
    } else {
      switchTab('home');
    }
  }

  // Listen for browser back/forward buttons
  window.addEventListener('hashchange', handleHashChange);
  
  // Call once on load
  handleHashChange();

  // --- Contact Form AJAX Submit ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;
      
      // Visual feedback during submission
      submitBtn.innerHTML = '<span data-i18n="contact.sending">Sending...</span>';
      submitBtn.disabled = true;

      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        // Show success popup
        showToast(currentLang === 'fr' ? 'Message envoyé avec succès !' : 'Message sent successfully!');
        this.reset();
      })
      .catch(error => {
        // Show error popup
        showToast(currentLang === 'fr' ? 'Erreur lors de l\'envoi du message.' : 'Error sending message.');
      })
      .finally(() => {
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
      });
    });
  }

  function showToast(message) {
      const toast = document.getElementById("toast");
      const toastMsg = document.getElementById("toast-message");
      if (toast && toastMsg) {
          toastMsg.textContent = message;
          toast.classList.add("show");
          setTimeout(function() { 
              toast.classList.remove("show"); 
          }, 3000);
      }
  }
  
  // --- Google Analytics Event Tracking ---
  const downloadBtn = document.getElementById('apk-download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'download', {
          'event_category': 'APK',
          'event_label': 'AnyForward Latest Release'
        });
      }
    });
  }
});
