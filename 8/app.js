'use strict';

let fitlerPopup = document.querySelector('.filterPopup');
let fitlerLabel = document.querySelector('.filterLabel');
let filterIcon = document.querySelector('.filterIcon');

fitlerLabel.addEventListener('click', function () {
    fitlerPopup.classList.toggle('hidden');
    fitlerLabel.classList.toggle('filterLabelPink');
    filterIcon.classList.toggle('filterIconPink');

    if (filterIcon.getAttribute('src') === 'images/filter.svg') {
        filterIcon.setAttribute('src', 'images/filterHover.svg')
    } else {
        filterIcon.setAttribute('src', 'images/filter.svg')
    }
});

let filterHeaders = document.querySelectorAll('.filterCategoryHeader');
filterHeaders.forEach(function (header) {
    header.addEventListener('click', function (event) {
        event.target.nextElementSibling.classList.toggle('hidden');
    })
});

let filterSizes = document.querySelector('.filterSizes');
let filterSizeWrap = document.querySelector('.filterSizeWrap');
filterSizeWrap.addEventListener('click', function () {
    filterSizes.classList.toggle('hidden');
});


// Класс товара
class Product {
    constructor(id, productName, price) {
        this.id = id;
        this.productName = productName;
        this.count = 1;
        this.price = price;
        this.totalPrice = price;
    }

    incProduct() {
        this.count += 1;
        this.totalPrice += this.price;
    }

    getProductMarkup() {
        return `
        <tr name="product_${this.id}">
            <td>${this.productName}</td>
            <td>${this.count} шт.</td>
            <td>$${this.price.toFixed(2)}</td>
            <td>$${this.totalPrice.toFixed(2)}</td>
        </tr>
        `;
    }
}

// Класс корзины
class UserCart {
    constructor(baseDiv) {
        this.products = [];
        this.totalCount = 0;
        this.totalPrice = 0;
        baseDiv.insertAdjacentHTML("beforeend", `${this.getUserCartMarkup()}`);
        this.tableObj = baseDiv.querySelector('.cart__table');
        this.totalPriceObj = this.tableObj.querySelector('.total__price span');
    }

    isEmpty() {
        return this.products.length === 0;
    }

    getUserCartMarkup() {
        return `
        <table class="cart__table">
        <caption class="total__price">Товаров в корзине на сумму: <span>$${this.totalPrice.toFixed(2)}</span></caption>
        <tr>
            <th>Название товара</th>
            <th>Количество</th>
            <th>Цена за шт.</th>
            <th>Итого</th>
        </tr>
        </table>
        `;
    }

    /**
     * 
     * @param {Product} product товар
     */
    addProduct(product) {
        this.products.push(product);
        this.totalPrice += product.price;
        this.totalCount += 1;
        this.totalPriceObj.textContent = `$${this.totalPrice.toFixed(2)}`;
        this.tableObj.insertAdjacentHTML("beforeend", `${product.getProductMarkup()}`);
    }

    /**
     * 
     * @param {Product} product товар
     */
    updateProduct(product) {
        product.incProduct();
        this.totalPrice += product.price;
        this.totalCount += 1;
        const productRow = this.tableObj.querySelector(`tr[name="product_${product.id}"]`);
        productRow.children[1].innerText = `${product.count} шт.`;
        productRow.children[3].innerText = `$${product.totalPrice.toFixed(2)}`;
        this.totalPriceObj.textContent = `$${this.totalPrice.toFixed(2)}`;
    }
}

// Индикатор количества товаров в корзине
const counter = document.querySelector('.cartIconWrap span');
// Контейнер для позиционирования корзины
const userCartBase = document.querySelector('.rightHeader');
// Экземпляр корзины  
const newCart = new UserCart(userCartBase);

// Обработчик события нажатия на кнопку "Add to Cart"
document.querySelectorAll('.featuredItem').forEach(function (item) {
    item.addEventListener('click', function (event) {
        if (!event.target.parentNode.classList.contains('featuredImgDark')) {
            return;
        }

        const id = item.dataset.product_id;
        if (newCart.isEmpty()) {
            const name = item.querySelector('.featuredName').innerText;
            const price = Number.parseFloat(item.querySelector('.featuredPrice').innerText.slice(1));

            newCart.addProduct(new Product(id, name, price));
            counter.innerText = '1';
            counter.style.visibility = 'visible';
            return;
        }

        const productInCart = newCart.products.find(item => item.id === id);
        if (productInCart === undefined) {
            const name = item.querySelector('.featuredName').innerText;
            const price = Number.parseFloat(item.querySelector('.featuredPrice').innerText.slice(1));

            newCart.addProduct(new Product(id, name, price));
            counter.innerText = newCart.totalCount.toString();
            return;
        }

        newCart.updateProduct(productInCart);
        counter.innerText = newCart.totalCount.toString();
    });
})

// Обработчик клика на корзине
const cartObj = document.querySelector('.cart__table');
let cartState = window.getComputedStyle(cartObj).display;
document.querySelector('.cartIcon').addEventListener('click', function (event) {
    if (newCart.isEmpty()) {
        return;
    }

    cartState = cartState === "none" ? "table" : "none";
    cartObj.style.display = cartState;
});
