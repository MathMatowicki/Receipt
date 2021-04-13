let is_tombstone = (entry) => {
    return !(entry && Object.keys(entry).length !== 0);
}

let receiptData;
if ((receiptData = window.localStorage["receiptData"])) {
    receiptData = JSON.parse(receiptData);
    receiptData.forEach((entry) => {
        if (!is_tombstone(entry)) {
            insertNewRecord(entry);
        }
    })
} else {
    receiptData = [];
}

let updateSum = () => {
    let sumElement = document.getElementById("receipt-sum");
    sumElement.innerHTML = receiptData.reduce((a, b) => a + +(b.sum?? 0), 0) + " zł";
}

updateSum();
let selectedRow = null
function onFormSubmit() {
    let formData = readFormData();

    if (selectedRow == null) {
        formData.id = receiptData.length + 1;
        insertNewRecord(formData);
        receiptData.push(formData);
    } else {
        let id = formData.id = +selectedRow.cells[0].innerHTML;
        updateRecord(formData);
        receiptData[receiptData.findIndex((element) => element.id === id)] = formData;
    }

    updateSum();
    resetForm();
    window.localStorage["receiptData"] = JSON.stringify(receiptData);
}

function readFormData() {
    let price = +parseFloat(document.getElementById("price").value).toFixed(2);
    let quantity = +parseFloat(document.getElementById("quantity").value).toFixed(2)
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

    let cell = newRow.insertCell(0);
    cell.innerHTML = data.id?? (receiptData.length + 1);

    cell = newRow.insertCell(1);
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
    // document.getElementById("name").value = "";
    // document.getElementById("quantity").value = "";
    // document.getElementById("price").value = "";
    // document.getElementById("sum").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[1].innerHTML;
    document.getElementById("quantity").value = selectedRow.cells[2].innerHTML;
    document.getElementById("price").value = selectedRow.cells[3].innerHTML;
}

function updateRecord(formData) {
    selectedRow.cells[1].innerHTML = formData.name;
    selectedRow.cells[2].innerHTML = formData.quantity;
    selectedRow.cells[3].innerHTML = formData.price + " zł";
    selectedRow.cells[4].innerHTML = formData.sum;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        let row = td.parentElement.parentElement;
        receiptData[receiptData.findIndex((element) => element.id === +row.cells[0].innerHTML)] = {};
        window.localStorage["receiptData"] = JSON.stringify(receiptData);
        document.getElementById("product-list").deleteRow(row.rowIndex);
        updateSum();
        resetForm();
    }
}

let reorder = (td, direction_up) => {
    let row = td.parentElement.parentElement;
    let originalPosition = receiptData.findIndex((element) => element.id === +row.cells[0].innerHTML)
    let sp = originalPosition + (direction_up? -1 : 1);
    for(; sp < receiptData.length && sp >= 0 && is_tombstone(receiptData[sp]); (direction_up? --sp : ++sp)) {}
    // do nothing if there are no non-tombstone elements above/below what we want to move
    if (sp === -1 || sp === receiptData.length) {
        return;
    }
    receiptData.splice(sp, 0, receiptData.splice(originalPosition, 1)[0]);
    window.localStorage["receiptData"] = JSON.stringify(receiptData);
    let data = {
        "id": row.cells[0].innerHTML,
        "name": row.cells[1].innerHTML,
        "quantity": row.cells[2].innerHTML,
        "price": parseFloat(row.cells[3].innerHTML),
        "sum": parseFloat(row.cells[4].innerHTML),
    }
    let index = row.rowIndex;
    document.getElementById("product-list").deleteRow(index);
    insertNewRecord(data, index + (direction_up? -2 : 0));
}
