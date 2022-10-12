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


class Product {
    constructor(productName, price) {
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
        <tr>
            <td>${this.productName}</td>
            <td>${this.count} шт.</td>
            <td>$${this.price}</td>
            <td>$${this.totalPrice}</td>
        </tr>
        `;
    }
}

class UserCart {
    constructor(baseDiv) {
        this.products = [];
        this.totalPrice = this.getTotalPrice();
        baseDiv.insertAdjacentHTML("beforeend", `${this.getUserCartMarkup()}`);
        this.tableObj = baseDiv.querySelector('.cart__table');
        this.totalPriceObj = this.tableObj.querySelector('.total__price span');
    }

    qetTotalCount() {
        if (this.products.length === 0) {
            return 0;
        }

        totalCount = 0;
        this.products.forEach(item => totalCount += item.count);
        return totalCount;
    }

    getTotalPrice() {
        if (this.products.length === 0) {
            return 0;
        }

        totalPrice = 0;
        this.products.forEach(item => totalPrice += item.totalPrice);
        return totalPrice;
    }

    /**
     * 
     * @param {Product} product 
     */
    updateTotalPrice(product) {
        this.totalPrice += product.totalPrice;
    }

    getUserCartMarkup() {
        return `
        <table class="cart__table">
        <caption class="total__price">Товаров в корзине на сумму: <span>$${this.totalPrice}</span></caption>
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
     * @param {Product} product 
     */
    addProduct(product) {
        this.products.push(product);
        this.updateTotalPrice(product);
        this.totalPriceObj.textContent = `$${this.totalPrice}`;
        this.tableObj.insertAdjacentHTML("beforeend", `${product.getProductMarkup()}`);
    }
}

const userCartBase = document.querySelector('.rightHeader');
const newCart = new UserCart(userCartBase);

const prod1 = new Product('product 1', 100);
newCart.addProduct(prod1);
const prod2 = new Product('product 2', 50);
newCart.addProduct(prod2);
