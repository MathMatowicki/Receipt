let receiptData;
if ((receiptData = window.localStorage["receiptData"])) {
    receiptData = JSON.parse(receiptData);
    receiptData.forEach((entry, index) => {
        // check if entry is a tombstone
        if (entry && Object.keys(entry).length !== 0) {
            insertNewRecord(entry, index+1);
        }
    })
} else {
    receiptData = [];
}

let updateSum = () => {
    let sumElement = document.getElementById("receipt-sum");
    sumElement.innerHTML = receiptData.reduce((a, b) => a + (b.sum? b.sum : 0), 0);
}

updateSum();
let selectedRow = null
function onFormSubmit() {
    let formData = readFormData();

    if (selectedRow == null) {
        insertNewRecord(formData);
        receiptData.push(formData);
    } else {
        updateRecord(formData);
        receiptData[+selectedRow.cells[0].innerHTML - 1] = formData;
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

function insertNewRecord(data, index) {
    let table = document.getElementById("product-list").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    let cell = newRow.insertCell(0);
    cell.innerHTML = (index? index : receiptData.length + 1) + "";

    cell = newRow.insertCell(1);
    cell.innerHTML = data.name;

    cell = newRow.insertCell(2);
    cell.innerHTML = data.quantity;

    cell = newRow.insertCell(3);
    cell.innerHTML = data.price + " zł";

    cell = newRow.insertCell(4);
    cell.innerHTML = data.sum;

    cell = newRow.insertCell(5);
    cell.innerHTML = `<a onClick="onEdit(this)">Edit</a>` + `<a onClick="onDelete(this)">Delete</a>`;
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
        receiptData[+row.cells[0].innerHTML - 1] = {};
        window.localStorage["receiptData"] = JSON.stringify(receiptData);
        document.getElementById("product-list").deleteRow(row.rowIndex);
        updateSum();
        resetForm();
    }
}
