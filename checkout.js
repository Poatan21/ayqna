document.addEventListener("DOMContentLoaded", () => {
  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");
  const form = document.getElementById("checkoutForm");
  const thankYou = document.getElementById("thankYou");
  const cardInfo = document.querySelector(".card-info");
  const selectedCart = JSON.parse(localStorage.getItem("selectedCart")) || [];

  let total = 0;
  selectedCart.forEach((item) => {
    const price = parseFloat(String(item.price).replace(/[₱,]/g, ""));
    const quantity = item.quantity || 1;
    total += price * quantity;

    const li = document.createElement("li");
    li.textContent = `${item.title} (${item.size}) - ₱${price.toLocaleString()} x ${quantity}`;
    orderItems.appendChild(li);
  });

  orderTotal.textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });

  // Toggle card input visibility
  document.querySelectorAll("input[name='payment']").forEach((radio) => {
    radio.addEventListener("change", () => {
      cardInfo.style.display = (radio.value === "Card" && radio.checked) ? "block" : "none";
    });
  });

  // Form submission with receipt
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect complete address
    const streetAddress = document.getElementById("address").value;
    const barangay = document.getElementById("barangay").value;
    const city = document.getElementById("city").value;
    const province = document.getElementById("province").value;
    const zipcode = document.getElementById("zipcode").value;
    const fullAddress = `${streetAddress}, ${barangay}, ${city}, ${province} ${zipcode}`;

    const formData = {
      name: document.getElementById("fullname").value,
      phone: document.getElementById("contact").value,
      address: fullAddress,
      payment: document.querySelector("input[name='payment']:checked").value,
      orderDate: new Date().toLocaleString(),
      items: selectedCart,
      total: total
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    const orderNumber = "ORD-" + Date.now();
    orders.push({ orderNumber, ...formData });
    localStorage.setItem("orders", JSON.stringify(orders));

    createReceipt(formData, orderNumber);

    form.style.display = "none";
    thankYou.style.display = "block";

    // Confetti animation
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.position = "fixed";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
      confetti.style.animation = "confetti-fall 2.5s linear";
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }

    // Auto-redirect removed - user must click "Back to Shop" button manually
    localStorage.removeItem("selectedCart");
  });

  function createReceipt(formData, orderNumber) {
    const receiptHTML = `
      <div class="receipt-container" style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family: 'Poppins', sans-serif;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #333;">AFEEC</h2>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Affectious Closet</p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">Official Receipt</p>
        </div>
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formData.orderDate}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${formData.payment.toUpperCase()}</p>
        </div>
        <div style="border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
          <h3 style="margin-bottom: 10px; color: #333;">Customer Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.name}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phone}</p>
          <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${formData.address}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 15px; color: #333;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #333;">
                <th style="text-align: left; padding: 10px 5px;">Item</th>
                <th style="text-align: center; padding: 10px 5px;">Size</th>
                <th style="text-align: center; padding: 10px 5px;">Qty</th>
                <th style="text-align: right; padding: 10px 5px;">Price</th>
                <th style="text-align: right; padding: 10px 5px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${formData.items.map(item => {
                const price = parseFloat(String(item.price).replace(/[₱,]/g, ""));
                const quantity = item.quantity || 1;
                const itemTotal = price * quantity;
                return `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px 5px;">${item.title}</td>
                    <td style="text-align: center; padding: 10px 5px;">${item.size}</td>
                    <td style="text-align: center; padding: 10px 5px;">${quantity}</td>
                    <td style="text-align: right; padding: 10px 5px;">₱${price.toLocaleString()}</td>
                    <td style="text-align: right; padding: 10px 5px;">₱${itemTotal.toLocaleString()}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div style="border-top: 2px solid #333; padding-top: 15px; text-align: right;">
          <p style="margin: 5px 0; font-size: 14px;"><strong>Subtotal:</strong> ₱${formData.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Shipping:</strong> FREE</p>
          <p style="margin: 10px 0; font-size: 18px; color: #333;"><strong>TOTAL:</strong> ₱${formData.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ccc; text-align: center;">
          <p style="margin: 5px 0; color: #666; font-size: 12px;">Thank you for shopping with AFEEC!</p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">Your order will be delivered to the address above.</p>
          <button onclick="window.print()" style="margin-top: 15px; padding: 10px 30px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Print Receipt</button>
        </div>
      </div>
    `;
    thankYou.insertAdjacentHTML('beforebegin', receiptHTML);
  }

  // Handle "Back to Shop" button click
  const backToShopBtn = document.getElementById('backToShopBtn');
  if (backToShopBtn) {
    backToShopBtn.addEventListener('click', () => {
      window.location.href = 'shop.html';
    });
  }
});
