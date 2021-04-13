class Product {
    constructor(name, price, quantity) {
        this.name = name;
        this.price = parseFloat(price).toFixed(2);
        this.quantity = parseFloat(quantity).toFixed(1);
        this.sum = parseFloat(price).toFixed(2) * parseFloat(quantity).toFixed(1);
    }
    set setName(name) {
        this.name = name;
    }
    set setPrice(price) {
        this.price = price;
    }
    set setQuantity(quantity) {
        this.quantity = quantity;
    }
    get getPrice() {
        return this.price;
    }
    get getQuantity() {
        return this.quantity;
    }
    get getName() {
        return this.name;
    }
    get getSum() {
        return this.sum;
    }
}


const addButton = document.getElementById("submit-button");
let listOfProducts = [];
localStorage.setItem("receipt", listOfProducts);

const addNewProduct = () => {

    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let quantity = document.getElementById("quantity").value;
    let table = document.getElementById("product-list").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow(table.length);
    let p = new Product(name, price, quantity);
    listOfProducts.push(p);
    cell0 = newRow.insertCell(0);
    cell0.innerHtml = localStorage.length;
    cell1 = newRow.insertCell(1);
    cell1.innerHtml = name;
    cell2 = newRow.insertCell(2);
    cell2.innerHtml = parseFloat(price).toFixed(2);
    cell3 = newRow.insertCell(3);
    cell3.innerHtml = parseFloat(quantity).toFixed(1);
    cell4 = newRow.insertCell(4);
    cell4.innerHtml = parseFloat(price).toFixed(2) * parseFloat(quantity).toFixed(1);
    cell4 = newRow.insertCell(5);
    cell4.innerHtml = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
    alert("sad");
}


