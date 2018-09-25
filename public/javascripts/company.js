$.getJSON(`/company/allJSON`, result => $.each(result, (i, item) =>
    $("#company").append(`<option value="${item.id}">${item.name}</option>`)));