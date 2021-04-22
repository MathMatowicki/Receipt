/* Projekt wykonali Mateusz Matowicki, Bartosz Wiszowaty */

let receiptData;
let selectedRow = null;

if ((receiptData = window.localStorage["receiptData"])) {
    receiptData = JSON.parse(receiptData);
    receiptData.forEach((entry) => insertNewRecord(entry));
} else {
    receiptData = [];
}

let updateGeneratedValues = () => {
    let sumElement = document.getElementById("receipt-sum");
    sumElement.innerHTML = receiptData.reduce((a, b) => a + +(b.sum ?? 0), 0).toFixed(2)  + " zł";
    document.querySelectorAll("#product-list tbody:first-of-type tr").forEach((element, index) => {
        element.cells[0].innerHTML = String(index + 1);
    });
}

updateGeneratedValues();

function onFormSubmit() {
    let formData = readFormData();

    if (selectedRow == null) {
        insertNewRecord(formData);
        receiptData.push(formData);
    } else {
        updateRecord(formData);
        receiptData[selectedRow.rowIndex - 1] = formData;
    }

    updateGeneratedValues();
    resetForm();
    window.localStorage["receiptData"] = JSON.stringify(receiptData);
}

function readFormData() {
    let price = +parseFloat(document.getElementById("price").value).toFixed(2);
    let quantity = +parseFloat(document.getElementById("quantity").value).toFixed(2);
    return {
        "name": document.getElementById("name").value,
        "quantity": quantity,
        "price": price,
        "sum": +(price * quantity).toFixed(2),
    };
}

function insertNewRecord(data, rowIndex) {
    let table = document.getElementById("product-list").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(rowIndex);

    // cell reserved for id, filled when updateGeneratedValues is called
    newRow.insertCell(0);

    let cell = newRow.insertCell(1);
    cell.innerHTML = data.name;

    cell = newRow.insertCell(2);
    cell.innerHTML = data.quantity;

    cell = newRow.insertCell(3);
    cell.innerHTML = data.price + " zł";

    cell = newRow.insertCell(4);
    cell.innerHTML = data.sum + " zł";

    cell = newRow.insertCell(5);
    cell.innerHTML = `<a onClick="onEdit(this)">Edit</a>` + `<a onClick="onDelete(this)">Delete</a>` +
        `<a onClick="reorder(this, 1)">&uarr;</a>` + `<a onClick="reorder(this, 0)">&darr;</a>`;
}

function resetForm() {
    selectedRow = null;
    document.forms["newEntry"].reset();
    document.getElementById("reset-button").hidden = true;
}

function onEdit(td) {
    document.getElementById("reset-button").hidden = false;
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[1].innerHTML;
    document.getElementById("quantity").value = parseFloat(selectedRow.cells[2].innerHTML);
    document.getElementById("price").value = parseFloat(selectedRow.cells[3].innerHTML);
}

function updateRecord(formData) {
    selectedRow.cells[1].innerHTML = formData.name;
    selectedRow.cells[2].innerHTML = formData.quantity;
    selectedRow.cells[3].innerHTML = formData.price + " zł";
    selectedRow.cells[4].innerHTML = formData.sum + " zł";
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        let row = td.parentElement.parentElement;
        receiptData.splice(+row.cells[0].innerHTML - 1, 1);
        window.localStorage["receiptData"] = JSON.stringify(receiptData);
        document.getElementById("product-list").deleteRow(row.rowIndex);
        updateGeneratedValues();
        resetForm();
    }
}

let reorder = (td, direction) => {
    // direction is 1 for moving up and 0 for moving down
    let row = td.parentElement.parentElement;
    let position = row.rowIndex - 1;
    let sp = position + (direction ? -1 : 1);

    // do nothing if there are no elements above/below what we want to move
    if (sp === -1 || sp === receiptData.length) {
        return;
    }

    let setNew = (row === selectedRow);
    receiptData.splice(sp, 0, receiptData.splice(position, 1)[0]);
    window.localStorage["receiptData"] = JSON.stringify(receiptData);

    let data = {
        "name": row.cells[1].innerHTML,
        "quantity": row.cells[2].innerHTML,
        "price": parseFloat(row.cells[3].innerHTML),
        "sum": parseFloat(row.cells[4].innerHTML),
    }

    document.getElementById("product-list").deleteRow(position + 1);
    insertNewRecord(data, position + (direction ? -1 : 1));
    if (setNew) {
        selectedRow = document.getElementById("product-list").rows[position + (direction ? 0 : 2)];
    }
    updateGeneratedValues();
}
