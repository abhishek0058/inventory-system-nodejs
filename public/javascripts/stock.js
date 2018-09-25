let mobiles = [];

$.getJSON(`/store/allJSON`, result => $.each(result, (i, item) =>
    $("#store").append(`<option value="${item.id}">${item.name}</option>`)));

$.getJSON(`/company/allJSON`, result => $.each(result, (i, item) =>
    $("#company").append(`<option value="${item.id}">${item.name}</option>`)));

$.getJSON(`/mobile/allJSON`, result => mobiles = result);

$('#company').change(() => {
    const company = $('#company').val()
    const data = mobiles.filter(item => item.companyid == company)
    $.each(data, (i, item) => {
        $('#modelno').append(`<option value="${item.id}">${item.modelno}</option>`)
    })
})

$('#modelno').change(() => {
    const id = $('#modelno').val()
    const mobile = mobiles.find(item => item.id == id)
    $('#color_').html(`<h4 style="color: ${mobile.color};">${mobile.name} - ${mobile.color}</h4>`)
})

$('#update').click(() => {
    if ($('#store').val() != 0 && $('#stock').val() != 0 && $('#modelno').val() != 0) {
        let body = {
            storeid: $('#store').val(),
            stock: $('#stock').val(),
            mobileid: $('#modelno').val()
        }
        $.post(`/stock/update`, body, (result) => {
            alert(result);
        })
    } else {
        alert('Please fill and choose all the fields')
    }
})