let selectedRow = null
let productsList = [];
function onFormSubmit() {
    let formData = readFormData();
    if (selectedRow == null)
        insertNewRecord(formData);
    else
        updateRecord(formData);
    resetForm();

}

function readFormData() {
    let formData = {};
    formData["name"] = document.getElementById("name").value;
    formData["quantity"] = document.getElementById("quantity").value;
    formData["price"] = document.getElementById("price").value + " zł";
    formData["sum"] = (parseFloat(document.getElementById("price").value).toFixed(2) * parseFloat(document.getElementById("quantity").value).toFixed(3)).toFixed(2);
    productsList.push(formData);
    return formData;
}

function insertNewRecord(data) {
    let table = document.getElementById("product-list").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.length);
    cell0 = newRow.insertCell(0);
    cell0.innerHTML = productsList.length;
    cell1 = newRow.insertCell(1);
    cell1.innerHTML = data.name;
    cell2 = newRow.insertCell(2);
    cell2.innerHTML = data.quantity;
    cell3 = newRow.insertCell(3);
    cell3.innerHTML = data.price;
    cell4 = newRow.insertCell(4);
    cell4.innerHTML = data.sum;
    cell4 = newRow.insertCell(5);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
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
    selectedRow.cells[3].innerHTML = formData.price;
    selectedRow.cells[4].innerHTML = formData.sum;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("product-list").deleteRow(row.rowIndex);
        resetForm();
    }
}
