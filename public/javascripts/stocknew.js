var imeinumbers = [];

$.getJSON(`/stock/storeAndIMEINumbers`, result => {
    $.each(result[0], (i, item) =>
        $("#store").append(`<option value="${item.id}">${item.name}</option>`))
    $.each(result[1], (i, item) =>
        $("#imeinumbers").append(`<option value=${item.imeino}>`))
});

$('#assign').click(() => {
    if ($('#store').val() == "0") {
        alert('Please choose a store');
        return;
    }
    var imeino = $('#imeino').val();

    if (imeino != "") {
        $.post(`/stock/distribute`, {
            imeino: imeino,
            storeid: $('#store').val()
        }, (result, status) => {
            if (result == "true") {
                alert("Done");
            } else {
                alert("Server Error Occurred.")
            }
        })
    } else {
        alert("Enter an IMEI Number");
    }
})