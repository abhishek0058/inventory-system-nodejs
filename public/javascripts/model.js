$.getJSON(`/brand/allJSON`, result => {
    $.each(result, (i, item) => {
        if($('#brand').val() != item.id) {
            $('#brand').append(`<option value="${item.id}">${item.name}</option>`)
        }
    })
})