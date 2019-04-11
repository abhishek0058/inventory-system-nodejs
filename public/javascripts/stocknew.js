var imeinumbers = [];
$("#form_body").hide()
$.getJSON(`/stock/storeAndIMEINumbers`, result => {
    $('#loading_div').hide()
    $("#form_body").show()
    $.each(result[0], (i, item) =>
        $("#store").append(`<option value="${item.id}">${item.name}</option>`))
    $.each(result[1], (i, item) =>
        $("#imeinumbers").append(`<option value=${item.imeino}>`))
});

let total = 0;

function newRow() {
    if($('#store').val() == 0) {
        alert('Please Select a store');
        return;
    }
    total++;
    $('#total').val(total);
    return (
        `<tr id="row${total}">
        <td>
            ${total}
        </td>
            <td>
            <input name="imeino${total}" type="text" class="form-control" placeholder="Enter IMEI Number"
            list="imeinumbers" required>
            </td>
        </tr>
        `
    );
}

$('#addnewrow').click(() => {
    $('#result').append(newRow());
})

$('#removerow').click(() => {
    $(`#row${total}`).remove()
    total--;
    $('#total').val(total);
});