// ---------------------- Task 1 Code -----------------//
"use strict";
// Store API Link in a var
const requestApi = "https://dummyjson.com/products";
let cart = JSON.parse(localStorage.getItem("saveData")) || [];
// INITIALIZE function:
function init() {
  const total = () => {
    const cartQuantity = document.getElementById("cartAmount");
    cartQuantity.textContent = `${cart
      .map((product) => product.quantity)
      .reduce(
        (prevProduct, currentProduct) => prevProduct + currentProduct,
        0
      )}`;
  };

  // Index.html
  if (document.URL.includes("Index.html")) {
    // DOM selectors
    const shop = document.querySelector(".shop");
    total();
    // Rendering Products
    const renderProducts = (items) => {
      for (const item of items) {
        const { id, title, thumbnail, price, description } = item;
        const search = cart.find((product) => product.id === id) || [];
        shop.innerHTML += `<div id=product-id-${id} class="item" data-title="${title}" data-img="${thumbnail}" data-price="${price}">
    <img width="220" src=${thumbnail} alt="">
    <div class="details">
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="price-quantity">
        <h2>$ ${price} </h2>
        <div class="buttons">
          <i class="fa-solid fa-minus"></i>
          <div id=${id} class="quantity">
          ${search.quantity === undefined ? 0 : search.quantity}</div>
          <i class="fa-solid fa-plus"></i>
        </div>
      </div>
    </div>
</div>`;
      }
    };
    // Store URL, Fetch URL, Render Products from API
    const getProductData = async () => {
      // Store URL
      const requestApi = "https://dummyjson.com/products";
      // Send request
      const request = new Request(requestApi);
      // fetch API
      const response = await fetch(request);
      // get products from json file (response)
      const products = await response.json();
      renderProducts(products.products);
    };
    getProductData();
    // Check Clicked Element
    shop.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-plus")) {
        const clickedProduct = parseInt(event.target.previousElementSibling.id);
        // const quantityNum = +document.getElementById(`${clickedProduct}`).textContent;
        // const quantityEl = document.getElementById(`${clickedProduct}`);
        // console.log(quantity + 1); testing
        // Selectors
        const productTitle =
          event.target.parentNode.parentNode.parentNode.parentNode.dataset
            .title;
        const productPrice =
          +event.target.parentNode.parentNode.parentNode.parentNode.dataset
            .price;
        const productImg =
          event.target.parentNode.parentNode.parentNode.parentNode.dataset.img;
        increment(clickedProduct, productTitle, productPrice, productImg);
      } else if (event.target.classList.contains("fa-minus")) {
        const clickedProduct = parseInt(event.target.nextElementSibling.id);
        const quantityNum = +document.getElementById(`${clickedProduct}`)
          .textContent;
        // const quantityEl = document.getElementById(`${clickedProduct}`);
        if (quantityNum !== 0) {
          decrement(clickedProduct);
        } else {
          console.log(0);
        }
      }
    });
    function increment(id, ...productData) {
      const search = cart.find((product) => product.id === id);
      if (search === undefined || search === null) {
        cart.push({
          id: id,
          title: productData[0],
          img: productData[2],
          price: productData[1],
          quantity: 1,
        });
      } else {
        search.quantity += 1;
        // console.log(search.quantity);
      }
      refresh(id);
    }
    function decrement(id) {
      const search = cart.find((product) => product.id === id);
      if (search === undefined) {
        console.log("Stopped");
      } else if (search.quantity === 0) {
        return;
      } else {
        search.quantity -= 1;
      }
      refresh(id);
      cart = cart.filter((product) => product.quantity !== 0);
      localStorage.setItem("saveData", JSON.stringify(cart));
      // console.log(cart);
    }
    const refresh = (id) => {
      const search = cart.find((product) => product.id === id);
      document.getElementById(id).textContent = search.quantity;
      // console.log(search.quantity);
      localStorage.setItem("saveData", JSON.stringify(cart));
      total();
    };
  }
  // Cart.html
  else if (document.URL.includes("Cart.html")) {
    // Selectors
    const shopCart = document.getElementById("shopping-cart");
    const label = document.getElementById("label");
    // Calculate cart
    total();
    // Render Cart
    const renderCart = () => {
      // If cart length isn't 0, do it
      if (cart.length !== 0) {
        return (shopCart.innerHTML = cart
          .map((product) => {
            const { id, quantity, img, title, price } = product;
            return `
          <div class="cart-item">
    <img width="130" src=${img} alt="" />
    <div class="details">
      <div class="title-price-x">
        <h4 class="title-price">
          <p>${title}</p>
          <p class="cart-item-price">$ ${price}</p>
        </h4>
        <i class="bi bi-x-lg"></i>
      </div>
      <div class="cart-buttons">
        <div class="buttons">
          <i class="fa-solid fa-minus"></i>
          <div id="${id}" class="quantity">${quantity}</div>
          <i class="fa-solid fa-plus"></i>
        </div>
      </div>
      <h3>$ ${quantity * price}</h3>
    </div>
  </div>`;
          })
          .join(" "));
        // Join with " space " to get rid of , between products, coz its an array
      } else {
        zeroCheck(cart.length);
        // Preview 0 message, empty cart = function on line 250
      }
    };
    // Call function
    renderCart();
    // AddEventListener
    shopCart.addEventListener("click", (event) => {
      // Increment
      if (event.target.classList.contains("fa-plus")) {
        const clickedProduct = parseInt(event.target.previousElementSibling.id);
        increment(clickedProduct);

        // Decrement
      } else if (event.target.classList.contains("fa-minus")) {
        const clickedProduct = parseInt(event.target.nextElementSibling.id);
        // const quantityNum = +document.getElementById(`${clickedProduct}`)
        // .textContent;
        // const quantity = +document.getElementById(`${clickedProduct}`).textContent;
        decrement(clickedProduct);
        // Filter out zero-quantity-products
        cart = cart.filter((product) => product.quantity !== 0);
        // Update rendering again
        renderCart();
      }
      // Removing products
      if (event.target.classList.contains("bi-x-lg")) {
        const clickedProduct = parseInt(
          event.target.parentNode.nextElementSibling.firstElementChild
            .firstElementChild.nextElementSibling.id
        );
        console.log(clickedProduct);
        removeItem(clickedProduct);
        // Filter and Update rendering again
        cart = cart.filter((product) => product.quantity !== 0);
        renderCart();
      }
    });
    function removeItem(id) {
      const search = cart.find((product) => product.id === id);
      if (search === undefined) {
        return;
      } else if (search.quantity === 0) {
        return;
      } else {
        search.quantity = 0;
      }
      refresh(id);
      cart = cart.filter((product) => product.quantity !== 0);
      localStorage.setItem("saveData", JSON.stringify(cart));
      // console.log(cart);
    }
    function increment(id, ...productData) {
      const search = cart.find((product) => product.id === id);
      if (search === undefined || search === null) {
        cart.push({
          id: id,
          title: productData[0],
          img: productData[2],
          price: productData[1],
          quantity: 1,
        });
      } else {
        search.quantity += 1;
        // console.log(search.quantity);
      }
      refresh(id);
      renderCart(id);
    }
    function decrement(id) {
      const search = cart.find((product) => product.id === id);
      if (search === undefined) {
        return;
      } else if (search.quantity === 0) {
        return;
      } else {
        search.quantity -= 1;
      }
      refresh(id);
      cart = cart.filter((product) => product.quantity !== 0);
      localStorage.setItem("saveData", JSON.stringify(cart));
      // console.log(cart);
    }
    // Refresh
    const refresh = (id) => {
      const search = cart.find((product) => product.id === id);
      document.getElementById(id).textContent = search.quantity;
      console.log(search.quantity);
      localStorage.setItem("saveData", JSON.stringify(cart));
      total();
    };
    // Empty cart render
    function zeroCheck(param) {
      if (param <= 0) {
        shopCart.innerHTML = ``;
        label.innerHTML = `<h2>Cart Is Empty</h2>
        <a href="../Index.html">
            <button class="HomeBtn">Back To Home</button>
        </a>`;
      }
    }
  }
}
init();
