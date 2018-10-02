$.getJSON(`/brand/allJSON`, result => $.each(result, (i, item) =>
    $("#brand").append(`<option value="${item.id}">${item.name}</option>`)));