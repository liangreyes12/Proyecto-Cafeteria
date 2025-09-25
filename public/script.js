// ==================== ESTADO GLOBAL ====================
let currentUser = null;
let users = JSON.parse(localStorage.getItem('moodbrewUsers')) || [];
let isLogin = true;
let currentMood = null;
let currentRecommendation = null;

// ==================== RECOMENDACIONES DE CAFÉ ====================
const moodRecommendations = {
  feliz: [
    { 
      name: "Caramel Macchiato", 
      desc: "Una deliciosa combinación de espresso, leche vaporizada y caramelo que endulzará tu día como tu sonrisa.", 
      emoji: "☕✨", 
      img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop"
    },
    { 
      name: "Cappuccino Vainilla", 
      desc: "Cremoso cappuccino con un toque de vainilla que combina perfectamente con tu energía positiva.", 
      emoji: "🍮☕", 
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=300&fit=crop"
    },
    { 
      name: "Frappé de Chocolate", 
      desc: "Refrescante bebida helada con chocolate que celebra los momentos dulces de la vida.", 
      emoji: "🍫❄️", 
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=300&fit=crop"
    }
  ],
  tranquilo: [
    { 
      name: "Matcha Latte", 
      desc: "Una bebida suave y aromática que te ayudará a mantener la calma y encontrar tu equilibrio interior.", 
      emoji: "🍵🌿", 
      img: "https://images.unsplash.com/photo-1598966735413-45c6b98a5f1a?w=500&h=300&fit=crop"
    },
    { 
      name: "Té Chai Latte", 
      desc: "Mezcla perfecta de especias que relajará tus sentidos y creará un momento de paz.", 
      emoji: "🫖✨", 
      img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&h=300&fit=crop"
    },
    { 
      name: "Lavanda Latte", 
      desc: "Suave café con lavanda que te transportará a un estado de serenidad total.", 
      emoji: "🌸☕", 
      img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=300&fit=crop"
    }
  ],
  energetico: [
    { 
      name: "Espresso Doble", 
      desc: "Dos shots de energía pura para despertar todos tus sentidos y conquistar cualquier desafío.", 
      emoji: "⚡🔥", 
      img: "https://images.unsplash.com/photo-1572441710534-680c9f73a16f?w=500&h=300&fit=crop"
    },
    { 
      name: "Americano Fuerte", 
      desc: "Café intenso y robusto que te dará la energía necesaria para superar cualquier obstáculo.", 
      emoji: "💥☕", 
      img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&h=300&fit=crop"
    },
    { 
      name: "Red Bull Coffee", 
      desc: "La combinación perfecta de cafeína y energía para momentos que requieren máximo rendimiento.", 
      emoji: "🚀⚡", 
      img: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=500&h=300&fit=crop"
    }
  ],
  productivo: [
    { 
      name: "Cold Brew", 
      desc: "Café de extracción en frío que te proporcionará un enfoque claro y sostenido durante horas.", 
      emoji: "👨‍💻💪", 
      img: "https://images.unsplash.com/photo-1510626176961-4b37d6f04f39?w=500&h=300&fit=crop"
    },
    { 
      name: "Latte Avena", 
      desc: "Equilibrio perfecto entre sabor y energía sustentable para mantener tu concentración.", 
      emoji: "☕📚", 
      img: "https://images.unsplash.com/photo-1515442261605-cd4ce3f9a887?w=500&h=300&fit=crop"
    },
    { 
      name: "Bullet Coffee", 
      desc: "Café con mantequilla y aceite MCT que potenciará tu rendimiento mental y físico.", 
      emoji: "🧠⚡", 
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop"
    }
  ],
  romantico: [
    { 
      name: "Mocha Rosa", 
      desc: "Deliciosa combinación de chocolate rosa y café que endulzará cualquier momento especial.", 
      emoji: "🍫❤️", 
      img: "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=500&h=300&fit=crop"
    },
    { 
      name: "Café Vienés", 
      desc: "Elegante café con crema batida y canela, perfecto para compartir momentos íntimos.", 
      emoji: "💕☕", 
      img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=300&fit=crop"
    },
    { 
      name: "Affogato", 
      desc: "Espresso vertido sobre helado de vainilla, una experiencia sensorial para dos.", 
      emoji: "🍨❤️", 
      img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=300&fit=crop"
    }
  ],
  nocturno: [
    { 
      name: "Descafeinado Canela", 
      desc: "Todo el sabor del café con canela reconfortante, sin interrumpir tu descanso nocturno.", 
      emoji: "🌙☕", 
      img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&h=300&fit=crop"
    },
    { 
      name: "Café de Olla", 
      desc: "Tradicional bebida mexicana con canela y piloncillo, perfecta para noches tranquilas.", 
      emoji: "🏺🌙", 
      img: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=500&h=300&fit=crop"
    },
    { 
      name: "Golden Milk Café", 
      desc: "Mezcla relajante de cúrcuma, leche tibia y un toque sutil de café descafeinado.", 
      emoji: "🌟🥛", 
      img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=300&fit=crop"
    }
  ]
};

// ==================== ELEMENTOS DOM ====================
const authModal = document.getElementById('authModal');
const authTitle = document.getElementById('authTitle');
const authAction = document.getElementById('authAction');
const authForm = document.getElementById('authForm');
const toggleAuth = document.getElementById('toggleAuth');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const closeModal = document.getElementById('closeModal');

const heroSection = document.getElementById('heroSection');
const resultSection = document.getElementById('resultSection');
const favoritesSection = document.getElementById('favoritesSection');

const moodCards = document.querySelectorAll('.mood-card');
const coffeeImg = document.getElementById('coffeeImg');
const coffeeName = document.getElementById('coffeeName');
const coffeeDesc = document.getElementById('coffeeDesc');
const coffeeEmoji = document.getElementById('coffeeEmoji');
const favBtn = document.getElementById('favBtn');
const newRecommendationBtn = document.getElementById('newRecommendationBtn');
const backBtn = document.getElementById('backBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');

// ==================== FUNCIONES UTILIDAD ====================
function saveUsersToStorage() {
  localStorage.setItem('moodbrewUsers', JSON.stringify(users));
}

function getUserByUsername(username) {
  return users.find(u => u.username === username);
}

function showSection(sectionToShow) {
  [heroSection, resultSection, favoritesSection].forEach(section => {
    section.classList.add('hidden');
  });
  sectionToShow.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function getRandomRecommendation(mood) {
  const recommendations = moodRecommendations[mood] || [];
  return recommendations[Math.floor(Math.random() * recommendations.length)];
}

function addLoadingState(button) {
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="loading"></span>';
  button.disabled = true;
  return originalText;
}

function removeLoadingState(button, originalText) {
  button.innerHTML = originalText;
  button.disabled = false;
}

// ==================== AUTENTICACIÓN ====================
function updateAuthUI() {
  if (currentUser) {
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    favoritesBtn.classList.remove('hidden');
  } else {
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    favoritesBtn.classList.add('hidden');
  }
}

function toggleAuthMode() {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? 'Iniciar Sesión' : 'Registrarse';
  authAction.textContent = isLogin ? 'Ingresar' : 'Registrar';
  toggleAuth.textContent = isLogin 
    ? '¿No tienes cuenta? Regístrate' 
    : '¿Ya tienes cuenta? Inicia sesión';
}

function handleAuth(e) {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor completa todos los campos',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  if (username.length < 3) {
    Swal.fire({
      title: 'Error',
      text: 'El usuario debe tener al menos 3 caracteres',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  if (password.length < 4) {
    Swal.fire({
      title: 'Error',
      text: 'La contraseña debe tener al menos 4 caracteres',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  const originalText = addLoadingState(authAction);

  setTimeout(() => {
    if (isLogin) {
      // Login
      const user = getUserByUsername(username);
      if (!user || user.password !== password) {
        removeLoadingState(authAction, originalText);
        usernameInput.classList.add('shake');
        passwordInput.classList.add('shake');
        setTimeout(() => {
          usernameInput.classList.remove('shake');
          passwordInput.classList.remove('shake');
        }, 500);
        Swal.fire({
          title: 'Error',
          text: 'Usuario o contraseña incorrectos',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
        return;
      }
      currentUser = user;
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${username}, disfruta tu café perfecto ☕`,
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    } else {
      // Register
      if (getUserByUsername(username)) {
        removeLoadingState(authAction, originalText);
        usernameInput.classList.add('shake');
        setTimeout(() => {
          usernameInput.classList.remove('shake');
        }, 500);
        Swal.fire({
          title: 'Error',
          text: 'El usuario ya existe, elige otro nombre',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
        return;
      }
      const newUser = { 
        username, 
        password, 
        favorites: [],
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      saveUsersToStorage();
      currentUser = newUser;
      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Bienvenido a MoodBrew, ${username} ☕`,
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    }

    removeLoadingState(authAction, originalText);
    authModal.classList.add('hidden');
    updateAuthUI();
    usernameInput.value = '';
    passwordInput.value = '';
  }, 1000);
}

function handleLogout() {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Podrás volver a iniciar sesión cuando quieras',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      currentUser = null;
      updateAuthUI();
      showSection(heroSection);
      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Gracias por usar MoodBrew ☕',
        icon: 'info',
        confirmButtonColor: '#3b82f6'
      });
    }
  });
}

// ==================== RECOMENDACIONES ====================
function showRecommendation(mood) {
  const recommendation = getRandomRecommendation(mood);
  if (!recommendation) {
    Swal.fire({
      title: 'Error',
      text: 'No hay recomendaciones disponibles para este mood',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  currentMood = mood;
  currentRecommendation = recommendation;

  // Animate the transition
  heroSection.style.opacity = '0';
  setTimeout(() => {
    coffeeImg.src = recommendation.img;
    coffeeName.textContent = recommendation.name;
    coffeeDesc.textContent = recommendation.desc;
    coffeeEmoji.textContent = recommendation.emoji;

    showSection(resultSection);
    resultSection.classList.add('slide-up');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      resultSection.classList.remove('slide-up');
    }, 300);
  }, 200);
  
  setTimeout(() => {
    heroSection.style.opacity = '1';
  }, 300);
}

// ==================== FAVORITOS ====================
function addToFavorites() {
  if (!currentUser) {
    Swal.fire({
      title: 'Inicia sesión',
      text: 'Necesitas una cuenta para guardar favoritos',
      icon: 'info',
      confirmButtonText: 'Iniciar sesión',
      confirmButtonColor: '#ec4899'
    }).then(() => {
      authModal.classList.remove('hidden');
    });
    return;
  }

  if (!currentRecommendation) {
    Swal.fire({
      title: 'Error',
      text: 'No hay recomendación para guardar',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  // Verificar si ya está en favoritos
  const exists = currentUser.favorites.some(fav => 
    fav.name === currentRecommendation.name
  );

  if (exists) {
    Swal.fire({
      title: 'Ya en favoritos',
      text: 'Este café ya está en tu lista de favoritos',
      icon: 'info',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  const originalText = addLoadingState(favBtn);

  setTimeout(() => {
    const favorite = {
      ...currentRecommendation,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
      mood: currentMood
    };

    currentUser.favorites.unshift(favorite); // Agregar al inicio
    saveUsersToStorage();

    removeLoadingState(favBtn, originalText);
    favBtn.classList.add('bounce');
    setTimeout(() => {
      favBtn.classList.remove('bounce');
    }, 600);

    Swal.fire({
      title: '¡Guardado!',
      text: `${currentRecommendation.name} se añadió a tus favoritos ❤️`,
      icon: 'success',
      confirmButtonText: 'Ver favoritos',
      showCancelButton: true,
      cancelButtonText: 'Continuar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        showFavorites();
      }
    });
  }, 800);
}

function showFavorites() {
  if (!currentUser) {
    Swal.fire({
      title: 'Error',
      text: 'Debes iniciar sesión para ver favoritos',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = '';

  if (currentUser.favorites.length === 0) {
    favoritesList.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fas fa-heart-broken text-6xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-600 mb-4">Aún no tienes favoritos guardados</p>
        <p class="text-gray-500 mb-6">Explora diferentes moods y guarda tus cafés favoritos</p>
        <button onclick="showSection(heroSection)" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-lg">
          <i class="fas fa-search"></i> Explorar Cafés
        </button>
      </div>
    `;
  } else {
    currentUser.favorites.forEach((fav, index) => {
      const card = document.createElement('div');
      card.className = 'favorite-card glass p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300';
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('slide-down');
      
      card.innerHTML = `
        <div class="flex flex-col h-full">
          <img src="${fav.img}" alt="${fav.name}" class="w-full h-40 object-cover rounded-xl mb-4 shadow-md">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">${fav.emoji}</span>
            <h3 class="text-lg font-bold text-gray-800">${fav.name}</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">${fav.desc}</p>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span><i class="fas fa-heart text-rose-400"></i> Mood: ${fav.mood}</span>
            <span><i class="fas fa-clock"></i> ${new Date(fav.addedAt).toLocaleDateString()}</span>
          </div>
          <button onclick="removeFavorite('${fav.id}')" class="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition duration-300 shadow-md">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      `;

      favoritesList.appendChild(card);
    });
  }

  showSection(favoritesSection);
}

function removeFavorite(favoriteId) {
  const favorite = currentUser.favorites.find(fav => fav.id === favoriteId);
  
  Swal.fire({
    title: '¿Eliminar favorito?',
    text: `¿Estás seguro de eliminar "${favorite.name}" de tus favoritos?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      currentUser.favorites = currentUser.favorites.filter(fav => fav.id !== favoriteId);
      saveUsersToStorage();
      
      Swal.fire({
        title: 'Eliminado',
        text: 'Favorito eliminado correctamente',
        icon: 'success',
        confirmButtonColor: '#10b981'
      }).then(() => {
        showFavorites(); // Refresh the favorites list
      });
    }
  });
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
  // Auth events
  loginBtn.addEventListener('click', () => {
    authModal.classList.remove('hidden');
    usernameInput.focus();
  });

  closeModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
  });

  // Close modal when clicking outside
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.add('hidden');
      usernameInput.value = '';
      passwordInput.value = '';
    }
  });

  toggleAuth.addEventListener('click', toggleAuthMode);
  authForm.addEventListener('submit', handleAuth);
  logoutBtn.addEventListener('click', handleLogout);

  // Navigation events
  favoritesBtn.addEventListener('click', showFavorites);
  backBtn.addEventListener('click', () => showSection(heroSection));
  backToHomeBtn.addEventListener('click', () => showSection(heroSection));

  // Mood selection events
  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      const mood = card.getAttribute('data-mood');
      card.classList.add('pulse-btn');
      setTimeout(() => {
        card.classList.remove('pulse-btn');
        showRecommendation(mood);
      }, 200);
    });
  });

  // Recommendation events
  favBtn.addEventListener('click', addToFavorites);
  
  newRecommendationBtn.addEventListener('click', () => {
    if (currentMood) {
      showRecommendation(currentMood);
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape key to close modal
    if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
      authModal.classList.add('hidden');
      usernameInput.value = '';
      passwordInput.value = '';
    }
    
    // Enter key in modal
    if (e.key === 'Enter' && !authModal.classList.contains('hidden')) {
      e.preventDefault();
      handleAuth(e);
    }
  });

  // Check if user is already logged in (from previous session)
  const savedUser = localStorage.getItem('moodbrewCurrentUser');
  if (savedUser) {
    const userData = JSON.parse(savedUser);
    const user = getUserByUsername(userData.username);
    if (user) {
      currentUser = user;
      updateAuthUI();
    }
  }

  // Save current user to localStorage when it changes
  const originalUpdateAuthUI = updateAuthUI;
  updateAuthUI = function() {
    originalUpdateAuthUI();
    if (currentUser) {
      localStorage.setItem('moodbrewCurrentUser', JSON.stringify({username: currentUser.username}));
    } else {
      localStorage.removeItem('moodbrewCurrentUser');
    }
  };

  // Initial UI setup
  updateAuthUI();
});

// ==================== GLOBAL FUNCTIONS ====================
// Make functions globally available for onclick handlers
window.removeFavorite = removeFavorite;
window.showSection = showSection;

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
  console.error('Error en la aplicación:', e.error);
  Swal.fire({
    title: 'Error inesperado',
    text: 'Ha ocurrido un error. Por favor, recarga la página.',
    icon: 'error',
    confirmButtonColor: '#ef4444'
  });
});

// ==================== UTILIDADES ADICIONALES ====================
function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para limpiar datos antiguos (opcional)
function cleanupOldData() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  users.forEach(user => {
    user.favorites = user.favorites.filter(fav => 
      new Date(fav.addedAt) > oneMonthAgo
    );
  });
  
  saveUsersToStorage();
}