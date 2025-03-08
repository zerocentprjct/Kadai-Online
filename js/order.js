// js/order.js

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve order data from sessionStorage
  const orderData = JSON.parse(sessionStorage.getItem("orderData"));
  const orderDetailsContainer = document.getElementById("orderDetails");

  if (orderData) {
    const { customer, products, purchaseNumber, total } = orderData;
    let html = `<p><strong>Purchase Number:</strong> ${purchaseNumber}</p>`;
    html += `<h2>Customer Details</h2>`;
    html += `<p><strong>Name:</strong> ${customer.name}</p>`;
    html += `<p><strong>Phone:</strong> ${customer.phone}</p>`;
    html += `<p><strong>Address:</strong> ${customer.address}</p>`;
    if (customer.mapAddress) {
      html += `<p><strong>Map Address:</strong> ${customer.mapAddress}</p>`;
    }
    html += `<h2>Products</h2>`;
    if (products && products.length > 0) {
      html += `<ul>`;
      products.forEach((product) => {
        html += `<li><strong>${product.title}</strong> - ${product.price} (Quantity: ${product.quantity})</li>`;
      });
      html += `</ul>`;
    } else {
      html += `<p>No products were added to the cart.</p>`;
    }
    // Display the total
    html += `<h2>Total</h2>`;
    html += `<p><strong>${total}</strong></p>`;
    orderDetailsContainer.innerHTML = html;
  } else {
    orderDetailsContainer.innerHTML = "<p>No order data found.</p>";
  }

  // After a short delay, generate the PDF and trigger its download.
  // This delay ensures that the order details are fully rendered.
  setTimeout(() => {
    const element = document.getElementById("orderReport");
    const opt = {
      margin: 0.5,
      filename: orderData
        ? `${orderData.purchaseNumber}_receipt.pdf`
        : "order_receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        console.log("PDF generated and download triggered.");
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
      });
  }, 1000); // 1000ms delay to ensure content is rendered
});

// js/checkout.js

// js/checkout.js

document.addEventListener("DOMContentLoaded", function () {
  const checkoutForm = document.getElementById("checkout-form");
  const buyButton = document.querySelector(".btn-buy");

  if (!checkoutForm || !buyButton) {
    console.error("Checkout form or Buy Now button not found.");
    return;
  }

  // Enable or disable Buy button based on form validity
  checkoutForm.addEventListener("input", function () {
    buyButton.disabled = !checkoutForm.checkValidity();
  });

  buyButton.addEventListener("click", function () {
    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity(); // show browser validation
      return;
    }

    // --- Collect Customer Data ---
    const customerData = {
      name: checkoutForm.querySelector("#name").value,
      phone: checkoutForm.querySelector("#email").value,
      address: checkoutForm.querySelector("#address").value,
      mapAddress: checkoutForm.querySelector("#map-address")
        ? checkoutForm.querySelector("#map-address").value
        : "",
    };

    // --- Collect Products Data ---
    const cartContent = document.querySelector(".cart-content");
    let products = [];
    if (cartContent) {
      const cartBoxes = cartContent.getElementsByClassName("cart-box");
      for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const title = cartBox.querySelector(".cart-product-title").innerText;
        const price = cartBox.querySelector(".cart-price").innerText;
        const quantity = cartBox.querySelector(".cart-quantity").value;
        products.push({ title, price, quantity });
      }
    }

    // --- Retrieve the Total ---
    const totalPrice = document.querySelector(".total-price").innerText;

    // --- Create the Order Object ---
    const orderData = {
      customer: customerData,
      products: products,
      purchaseNumber: "ORD" + new Date().getTime(), // Unique order ID
      total: totalPrice, // Simply pass the total from the checkout page
    };

    // Store the order data for the order confirmation page
    sessionStorage.setItem("orderData", JSON.stringify(orderData));

    // Redirect to the order confirmation page
    window.location.href = "order.html";
  });
});
