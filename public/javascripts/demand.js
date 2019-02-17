$('#demands_div').hide();
$('#form_div').hide();

var demands = [];
var demandObject = null;

$.getJSON(`/demand/all/7`, result => {
    $('#demands_div').show();
    $('#loading_div').hide();
    demands = result;
    let _html = `<table class="table table-bordered">
        <thead><tr>
            <td>S no</td>
            <td>Store</td>
            <td>Model</td>
            <td>Color</td>
            <td>Quantity demanded</td>
            <td>Quantity Pending</td>
            <td>Date</td>
            <td>Supply</td>
        </tr></thead>`;
    _html += `<tbody>`

    $.each(result, (i, item) => {
        _html += `<tr>
            <td>${i+1}</td>
            <td>${item.senderstore}</td>
            <td>${item.modelname}</td>
            <td>${item.color}</td>
            <td>${item.original_qty}</td>
            <td>${item.current_qty}</td>
            <td>${item.created_date}</td>
            <td><button index=${i} class="btn btn-info supply">Supply</button></td>
        </tr>`
    })

    _html += `</tbody></table>`

    $('#demands_div').html(_html);
});
// {
//     id: 4,
//     senderid: 1,
//     receiverid: 7,
//     original_qty: 1,
//     current_qty: 7,
//     created_date: "2019-02-16T18:30:00.000Z",
//     updated_date: "2019-02-16T18:30:00.000Z",
//     modelid: 4,
//     color: "METALLIC COPPER",
//     note: "Test",
//     senderstore: "THE MOBILE PLUS (THATIPUR)",
//     receiverstore: "OFFICE",
//     modelname: "NOTE 9 (128GB)"
//     },

$('#demands_div').on('click', '.supply', e => {
    const index = e.target.attributes[0].value;
    demandObject = demands[index];
    if(!demandObject) {
        alert('error. Please try again');
        return;
    }
    $('#receiverid').val(demandObject.senderid);
    $('#demand_record_id').val(demandObject.id);

    $('#loading').hide();
    $('#demands_div').hide()
    $('#form_div').show()

});

var totalrows = 0;

function newrow() {
    totalrows++;
    $('#totalrows').val(totalrows);
    return (
        `<tr id="row${totalrows}">
            <td>
                <input type="number" class="form-control" name="imeino${totalrows}" required placeholder="Enter IMEI Number">
            </td>
            <td>
                <input type="text" class="form-control" name="person${totalrows}" required placeholder="Person name">
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