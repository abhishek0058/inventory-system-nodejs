$.getJSON(`/brand/allJSON`, result => $.each(result, (i, item) =>
    $("#brand").append(`<option value="${item.id}">${item.name}</option>`)));

var models = [];

$.getJSON(`/model/allJSON`, result => models = result);

$('#brand').change(() => {
    const data = models.filter(item => item.brandid == $('#brand').val())
    $("#model").empty();
    $("#model").append(`<option value="0">Select Model</option>`);
    $.each(data, (i, item) =>
        $("#model").append(`<option value="${item.id}">${item.name}</option>`))
})

var totalrows = 0;

function newrow() {
    totalrows++;
    $('#totalrows').val(totalrows);
    return (
        `<tr id="row${totalrows}">
            <td>
                <input type="text" class="form-control" name="imeino${totalrows}" required placeholder="Enter IMEI Number">
            </td>
            <td>
                <input type="number" class="form-control" name="price${totalrows}" placeholder="Price (Optional)">
            </td>
            <td>
                <input type="text" class="form-control" name="color${totalrows}" required placeholder="Enter Color">
            </td>
        </tr>`
    );
}

$('#addnewrow').click(() => {
    $('#rows').append(newrow())
});


$('#removerow').click(() => {
    $(`#row${totalrows}`).remove();
    totalrows--;
    $('#totalrows').val(totalrows);
});