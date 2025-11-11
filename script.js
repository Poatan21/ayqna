// --------------------- SEARCH FUNCTION ---------------------
function searchProducts() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  
  const searchTerm = input.value.toLowerCase();
  const products = document.querySelectorAll('.product-card');
  
  products.forEach(product => {
    const title = product.querySelector('.product-title, h3');
    if (title) {
      const name = title.textContent.toLowerCase();
      product.style.display = name.includes(searchTerm) ? 'block' : 'none';
    }
  });
}

// Add search on Enter key
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', searchProducts);
  }
});

// Get existing cart from localStorage or create new one
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart counter display
function updateCartCount() {
  const cartCounter = document.getElementById('cart-count');
  if (cartCounter) {
    cartCounter.textContent = cart.length;
  }
}
updateCartCount();

// Quick Add to Cart button (without size selection)
document.querySelectorAll('.add-cart-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const productCard = event.target.closest('.product-card');
    const product = {
      title: productCard.querySelector('.product-title').textContent,
      price: productCard.querySelector('.product-price').textContent,
      image: productCard.querySelector('img').src,
      size: 'Free Size',
      quantity: 1
    };
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.title} added to cart!`);
  });
});

// === PRODUCT MODAL LOGIC WITH SIZE SELECTION ===
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalStock = document.getElementById('modalStock');
const modalDesc = document.getElementById('modalDesc');
const sizeButtonsContainer = document.getElementById('sizeButtons');
const modalAddToCart = document.getElementById('modalAddToCart');
const modalBuyNow = document.getElementById('modalBuyNow');
const closeBtn = document.querySelector('.close-btn');

let currentImages = [];
let currentIndex = 0;
let selectedSize = null;
let currentProduct = null;

// Example product-specific images
const productImages = {
  "AFEEC Signature Hoodie": [
    "https://via.placeholder.com/400x400?text=Hoodie+Front",
    "https://via.placeholder.com/400x400?text=Hoodie+Model"
  ],
  "AFEEC Classic Tee": [
    "https://via.placeholder.com/400x400?text=Tee+Front",
    "https://via.placeholder.com/400x400?text=Tee+Model"
  ]
};

// Open modal when product IMAGE is clicked
document.querySelectorAll('.product-card img').forEach(img => {
  img.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    const title = card.querySelector('.product-title').textContent;
    const price = card.querySelector('.product-price').textContent;
    const stock = card.querySelector('.product-stock')?.textContent || 'In stock';
    const desc = card.querySelector('.product-desc')?.textContent || 'High-quality product from Affectious Closet.';
    const category = card.dataset.category;

    currentImages = productImages[title] || [img.src];
    currentIndex = 0;
    modalImg.src = currentImages[currentIndex];

    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalStock.textContent = stock;
    modalDesc.textContent = desc;
    selectedSize = null;

    // CREATE SIZE BUTTONS based on category
    sizeButtonsContainer.innerHTML = '';
    let sizes = [];
    if (category === 'hoodie' || category === 'tshirt') {
      sizes = ['S','M','L','XL','XXL'];
    } else if (category === 'shoes') {
      sizes = ['6','7','8','9','10'];
    } else if (category === 'socks') {
      sizes = ['1 Pair','2 Pairs','3 Pairs'];
    } else {
      sizes = ['Free Size'];
    }

    sizes.forEach(size => {
      const btn = document.createElement('button');
      btn.textContent = size;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-buttons button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = size;
      });
      sizeButtonsContainer.appendChild(btn);
    });

    currentProduct = { title, price, category, stock, desc };
    modal.style.display = 'flex';
  });
});

// Close modal
if (closeBtn) {
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
}

window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

// Image carousel arrows
const leftArrow = document.querySelector('.arrow-box.left');
const rightArrow = document.querySelector('.arrow-box.right');

if (leftArrow) {
  leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
  });
}

if (rightArrow) {
  rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
  });
}

// Add to cart from modal (WITH SIZE REQUIRED)
if (modalAddToCart) {
  modalAddToCart.addEventListener('click', () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    const product = { 
      ...currentProduct, 
      size: selectedSize, 
      image: currentImages[0],
      quantity: 1
    };
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.title} (${product.size}) added to cart!`);
    modal.style.display = 'none';
  });
}

// Buy now from modal
if (modalBuyNow) {
  modalBuyNow.addEventListener('click', () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    const product = { 
      ...currentProduct, 
      size: selectedSize, 
      image: currentImages[0],
      quantity: 1
    };
    localStorage.setItem('cart', JSON.stringify([product]));
    window.location.href = 'cart.html';
  });
}

// --------------------- LOGIN FUNCTIONALITY (FIXED) ---------------------
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userName = localStorage.getItem('userName');
  const loginBtn = document.getElementById('loginBtn');
  
  if (isLoggedIn === 'true' && userName && loginBtn) {
    loginBtn.innerHTML = '<i class="fas fa-user-check"></i>';
    loginBtn.style.color = '#4CAF50';
    loginBtn.title = `Logged in as ${userName}`;
  }
}

// Multi-step form handler - FIXED
function nextStep(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (emailInput && passwordInput) {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (email && password) {
      const userName = email.split('@')[0];
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', userName);
      localStorage.setItem('userEmail', email);
      
      alert(`Welcome, ${userName}! You are now logged in.`);
      
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.style.display = 'none';
      }
      
      checkLoginStatus();
      
      // Redirect to shop page
      window.location.href = 'shop.html';
    }
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  updateCartCount();
  
  // Open login modal when clicking user icon
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        const confirmLogout = confirm('Do you want to logout?');
        if (confirmLogout) {
          logout();
        }
      } else {
        // Open login modal
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.style.display = 'flex';
        }
      }
    });
  }
  
  // Close modal button
  const closeModal = document.getElementById('closeModal');
  if (closeModal) {
    closeModal.addEventListener('click', (e) => {
      e.preventDefault();
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.style.display = 'none';
      }
    });
  }
});

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  alert('You have been logged out.');
  checkLoginStatus();
  window.location.href = 'index.html';
}

// --------------------- CATEGORY FILTER ---------------------
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const category = this.getAttribute('data-category');
    
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    document.querySelectorAll('.product-card').forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

