// Navbar Toggle
const navbarNav = document.querySelector(".navbar-nav");
const burgerIcon = document.querySelector("#hamburger-menu");
const searchButton = document.querySelector("#search-button");

if (navbarNav && burgerIcon) {
  burgerIcon.onclick = () => {
    navbarNav.classList.toggle("active");
  };
} else {
  console.warn(
    "⚠️ Navbar elements not found on this page. Skipping navbar logic."
  );
}

// search toggle
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");

if (searchForm && searchBox) {
  searchButton.onclick = (e) => {
    searchForm.classList.toggle("active");
    searchBox.focus();
    e.preventDefault();
  };
} else {
  console.warn(
    "⚠️ Search elements not found on this page. Skipping navbar logic."
  );
}

// close if clicking outside class
document.addEventListener("click", (e) => {
  if (burgerIcon && navbarNav) {
    // Check if these exist first
    if (!burgerIcon.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
    } else {
      console.warn("not here");
    }
  }

  if (searchButton && searchForm) {
    // Check if these exist first
    if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove("active");
    }
  }
});

// Shopping Cart
const cartIcon = document.querySelector("#shopping-cart");
const cart = document.querySelector(".cart");
const closeIcon = document.querySelector("#cart-close");

if (cartIcon && cart && closeIcon) {
  cartIcon.onclick = () => {
    cart.classList.add("active");
  };

  closeIcon.onclick = () => {
    cart.classList.remove("active");
  };
} else {
  console.warn("⚠️ Cart elements not found on this page. Skipping cart logic.");
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

document.addEventListener("DOMContentLoaded", ready);

// making function
function ready() {
  feather.replace();

  // remove items from cart
  var removeCartButton = document.getElementsByClassName("cart-remove");
  console.log(removeCartButton);
  for (var i = 0; i < removeCartButton.length; i++) {
    var button = removeCartButton[i];
    button.addEventListener("click", removeCartItem);
  }
  // quantity changes
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChange);
  }
  // Add to cart

  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    console.log(
      "Total add-cart buttons found:",
      document.getElementsByClassName("add-cart").length
    );
    button.addEventListener("click", addCartClicked);
  }

  upgradeTotal();
}

// // remove items from cart
function removeCartItem(e) {
  var buttonClicked = e.target;
  var cartBox = buttonClicked.closest(".cart-box"); // Find the nearest .cart-box

  if (cartBox) {
    cartBox.remove();
  }
  upgradeTotal();
}

// Quantity changes
function quantityChange(e) {
  var inputt = e.target;
  if (isNaN(inputt.value) || inputt.value <= 0) {
    inputt.value = 1;
  }
  upgradeTotal();
}
// // adding cart item
// function addCartClicked(E) {
//   var button = E.target.closest(".add-cart");
//   var shopProduct = button.parentElement;
//   var title = shopProduct.getElementsByClassName("product-title")[0].innerText;
//   var price = shopProduct.getElementsByClassName("price")[0].innerText;
//   var img = shopProduct.getElementsByClassName("product-img")[0].src;
//   addProductToCart(title, price, img);
//   upgradeTotal();
// }

// // // adding product to cart
// function addProductToCart(title, price, img) {
//   var cartShopBox = document.createElement("div");
//   cartShopBox.classList.add("cart-box");

//   var cartItems = document.getElementsByClassName("cart-content")[0];
//   var cartItemNames = cartItems.getElementsByClassName("cart-product-title");

//   for (var i = 0; i < cartItemNames.length; i++) {
//     if (cartItemNames[i].innerText == title) {
//       alert("You already have added the item");
//       return;
//     }
//   }

//   // Correctly using dynamic content
//   var cartBoxContent = `
//               <img src="${img}" alt="" class="cart-img" />
//               <div class="detail-box">
//                 <div class="cart-product-title">${title}</div>
//                 <div class="cart-price">${price}</div>
//                 <input type="number" value="1" class="cart-quantity" />
//               </div>
//               <i class="bx bxs-trash-alt cart-remove"></i>`;

//   cartShopBox.innerHTML = cartBoxContent;
//   cartItems.append(cartShopBox); // Corrected appending of element

//   // Add event listeners after element is created
//   cartShopBox
//     .getElementsByClassName("cart-remove")[0]
//     .addEventListener("click", removeCartItem);
//   cartShopBox
//     .getElementsByClassName("cart-quantity")[0]
//     .addEventListener("change", quantityChange);
//   upgradeTotal();
// }

// Save the current cart state to localStorage
function saveCart() {
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartItems.getElementsByClassName("cart-box");
  var cart = [];
  for (var i = 0; i < cartBoxes.length; i++) {
    var title =
      cartBoxes[i].getElementsByClassName("cart-product-title")[0].innerText;
    var price = cartBoxes[i].getElementsByClassName("cart-price")[0].innerText;
    var img = cartBoxes[i].querySelector("img").src;
    var quantity =
      cartBoxes[i].getElementsByClassName("cart-quantity")[0].value;
    cart.push({ title, price, img, quantity });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load the cart state from localStorage and rebuild the cart UI
function loadCart() {
  var cartData = localStorage.getItem("cart");
  if (cartData) {
    var cart = JSON.parse(cartData);
    var cartItems = document.getElementsByClassName("cart-content")[0];
    cartItems.innerHTML = ""; // Clear current cart content

    cart.forEach((item) => {
      var cartShopBox = document.createElement("div");
      cartShopBox.classList.add("cart-box");

      var cartBoxContent = `
        <img src="${item.img}" alt="" class="cart-img" />
        <div class="detail-box">
          <div class="cart-product-title">${item.title}</div>
          <div class="cart-price">${item.price}</div>
          <input type="number" value="${item.quantity}" class="cart-quantity" />
        </div>
        <i class="bx bxs-trash-alt cart-remove"></i>`;

      cartShopBox.innerHTML = cartBoxContent;
      cartItems.append(cartShopBox);

      // Attach event listeners for removal and quantity change
      cartShopBox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener("click", function (event) {
          removeCartItem(event);
          saveCart();
        });
      cartShopBox
        .getElementsByClassName("cart-quantity")[0]
        .addEventListener("change", function (event) {
          quantityChange(event);
          saveCart();
        });
    });
    upgradeTotal();
  }
}

// Event handler for adding an item to the cart
function addCartClicked(e) {
  var button = e.target.closest(".add-cart");
  var shopProduct = button.parentElement;
  var title = shopProduct.getElementsByClassName("product-title")[0].innerText;
  var price = shopProduct.getElementsByClassName("price")[0].innerText;
  var img = shopProduct.getElementsByClassName("product-img")[0].src;
  addProductToCart(title, price, img);
  upgradeTotal();
  saveCart();
}

// Function to add the product to the cart UI
function addProductToCart(title, price, img) {
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");

  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-product-title");

  // Prevent duplicate entries
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("You already have added the item");
      return;
    }
  }

  var cartBoxContent = `
    <img src="${img}" alt="" class="cart-img" />
    <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input type="number" value="1" class="cart-quantity" />
    </div>
    <i class="bx bxs-trash-alt cart-remove"></i>`;

  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);

  // Attach event listeners for the newly added item
  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", function (event) {
      removeCartItem(event);
      saveCart();
    });
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", function (event) {
      quantityChange(event);
      saveCart();
    });

  upgradeTotal();
  saveCart();
}

// Remove item from cart
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  upgradeTotal();
  saveCart();
}

// Handle quantity changes
function quantityChange(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  upgradeTotal();
  saveCart();
}

// Initialize the cart on page load
window.onload = function () {
  loadCart();
};

// update total
function upgradeTotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = document.getElementsByClassName("cart-box");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var price = parseFloat(priceElement.innerText.replace(/Rp\.|k/g, ""));
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var quantity = parseInt(quantityElement.value);
    total = total + price * quantity;
  }
  document.getElementsByClassName("total-price")[0].innerText =
    "Rp." + total + "k";
}

// Cache shared elements
const shopContent = document.querySelector(".shop-content");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// OPEN MODAL: Listen for clicks on a product info button (bubble phase)
document.addEventListener("click", (e) => {
  const productBox = e.target.closest(".product-box");

  if (productBox && e.target.classList.contains("product-info")) {
    // Remove active state from all product boxes
    document.querySelectorAll(".product-box").forEach((box) => {
      box.classList.remove("active");
    });
    productBox.classList.add("active");
    shopContent.classList.add("modal-active");

    // Move modal to the body if needed
    document.body.appendChild(modal);

    // Position the modal relative to the product image, taking scroll into account
    const img = productBox.querySelector(".product-img");
    const rect = img.getBoundingClientRect();
    modal.style.position = "absolute";
    modal.style.top = `${window.scrollY + rect.bottom}px`; // just below the image
    modal.style.left = `${window.scrollX + rect.left}px`; // align with the image
    modal.style.width = `${rect.width}px`; // match the image's width
    modal.style.zIndex = "99"; // ensure it's above the overlay

    modal.classList.add("active"); // Show the modal

    // Activate the overlay
    overlay.classList.add("active");
  }
});

// CLOSE MODAL: Listen (in capture phase) for any click outside modal and product box
document.addEventListener(
  "click",
  (e) => {
    // Allow clicks on add-cart icons to work without closing the modal.
    if (e.target.closest(".add-cart")) {
      return;
    }

    // If modal is active and the click is outside both the modal and the product box, close everything.
    if (
      modal.classList.contains("active") &&
      !e.target.closest(".modal") &&
      !e.target.closest(".product-box")
    ) {
      modal.classList.remove("active");
      shopContent.classList.remove("modal-active");
      overlay.classList.remove("active");
      document.querySelectorAll(".product-box").forEach((box) => {
        box.classList.remove("active");
      });
      // Prevent further handling if needed
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true // capture phase ensures this runs before other click handlers
);
