document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceEl = document.getElementById("totalPrice");
  const selectAllCheckbox = document.getElementById("selectAll");
  const removeSelectedBtn = document.getElementById("removeSelected");
  const checkoutBtn = document.getElementById("checkout");

  let cart = [];

  // Load cart with error handling
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error loading cart:", error);
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ========================= 
  // RENDER CART ITEMS 
  // ========================= 
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p style='text-align: center; padding: 50px; color: #666;'>Your cart is empty.</p>";
      totalPriceEl.textContent = "0.00";
      return;
    }

    cart.forEach((item, index) => {
      try {
        const cleanPrice = parseFloat(
          String(item.price).replace(/[₱,]/g, "").trim()
        );
        const quantity = item.quantity || 1;
        const itemTotal = cleanPrice * quantity;
        total += itemTotal;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
          <input type="checkbox" class="item-checkbox" data-index="${index}">
          <img src="${item.image}" alt="${item.title}" onerror="this.src='placeholder.png'">
          <div class="item-details">
            <h3>${item.title}</h3>
            <p>Size: ${item.size}</p>
            <p class="price">₱${cleanPrice.toLocaleString()}</p>
          </div>
          <div class="quantity-controls">
            <button class="qty-btn decrease" data-index="${index}">−</button>
            <span class="quantity">${quantity}</span>
            <button class="qty-btn increase" data-index="${index}">+</button>
          </div>
          <div class="item-total">₱${itemTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}</div>
        `;
        cartItemsContainer.appendChild(div);
      } catch (error) {
        console.error("Error rendering cart item:", error);
      }
    });

    totalPriceEl.textContent = total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });

    attachEventListeners();
  }

  // =========================
  // ATTACH EVENT LISTENERS
  // =========================
  function attachEventListeners() {
    // Quantity increase
    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        try {
          if (cart[index]) {
            cart[index].quantity = (cart[index].quantity || 1) + 1;
            saveCart();
            renderCart();
          }
        } catch (error) {
          console.error("Error increasing quantity:", error);
          alert("Failed to update quantity. Please try again.");
        }
      });
    });

    // Quantity decrease
    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        try {
          if (cart[index] && cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            saveCart();
            renderCart();
          }
        } catch (error) {
          console.error("Error decreasing quantity:", error);
          alert("Failed to update quantity. Please try again.");
        }
      });
    });

    // Individual checkbox listeners
    document.querySelectorAll(".item-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", updateSelectAllState);
    });
  }

  // =========================
  // SELECT ALL FUNCTIONALITY
  // =========================
  selectAllCheckbox.addEventListener("change", (e) => {
    const checkboxes = document.querySelectorAll(".item-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  });

  function updateSelectAllState() {
    const checkboxes = document.querySelectorAll(".item-checkbox");
    const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
    selectAllCheckbox.checked = allChecked;
  }

  // =========================
  // REMOVE SELECTED ITEMS
  // =========================
  removeSelectedBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".item-checkbox:checked");
    
    if (checkboxes.length === 0) {
      alert("Please select items to remove.");
      return;
    }

    const confirmRemove = confirm(`Remove ${checkboxes.length} item(s) from cart?`);
    if (!confirmRemove) return;

    try {
      const indicesToRemove = Array.from(checkboxes)
        .map((cb) => parseInt(cb.dataset.index))
        .sort((a, b) => b - a);

      indicesToRemove.forEach((index) => {
        cart.splice(index, 1);
      });

      saveCart();
      renderCart();
      selectAllCheckbox.checked = false;
      
      alert("Selected items removed successfully.");
    } catch (error) {
      console.error("Error removing items:", error);
      alert("Failed to remove items. Please try again.");
    }
  });

  // =========================
  // CHECKOUT
  // =========================
  checkoutBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".item-checkbox:checked");
    
    if (checkboxes.length === 0) {
      alert("Please select items to checkout.");
      return;
    }

    try {
      const selectedItems = Array.from(checkboxes).map((cb) => {
        const index = parseInt(cb.dataset.index);
        return cart[index];
      });

      localStorage.setItem("selectedCart", JSON.stringify(selectedItems));
      window.location.href = "checkout.html";
    } catch (error) {
      console.error("Error processing checkout:", error);
      alert("Failed to proceed to checkout. Please try again.");
    }
  });

  // =========================
  // SAVE CART TO LOCALSTORAGE
  // =========================
  function saveCart() {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    } catch (error) {
      console.error("Error saving cart:", error);
      alert("Failed to save cart. Please check your browser storage.");
    }
  }

  // =========================
  // UPDATE CART COUNTER
  // =========================
  function updateCartCount() {
    const cartCounter = document.getElementById("cart-count");
    if (cartCounter) {
      cartCounter.textContent = cart.length;
    }
  }

  // Initial render
  renderCart();
  updateCartCount();
});
