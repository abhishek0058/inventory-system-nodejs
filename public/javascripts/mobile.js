$.getJSON(`/company/allJSON`, result => {
    $.each(result, (i, item) => {
        if($('#company').val() != item.id) {
            $('#company').append(`<option value="${item.id}">${item.name}</option>`)
        }
    })
})