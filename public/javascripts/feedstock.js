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

$('#add').click(() => {
    
    if($('#brand').val() == "0" || $('#model').val() == "0" || $('#imeino').val() == "" || $('#name').val() == "") {
        alert("Please Fill all the required fields");
        return;
    }

    var body = {
        brandid: $('#brand').val(),
        modelid: $('#model').val(),
        imeino: $('#imeino').val(),
        price: $('#price').val(),
        name: $('#name').val(),
        color: $('#color').val()
    };

    $.post(`/feedstock/create`, body, (result, status) => {
        console.log(result);
        if (result == true) {
            alert("Done");
            $('#brand').val('');
            $('#model').val('');
            $('#imeino').val('');
            $('#price').val('');
            $('#name').val('');
            $('#color').val('');
        } else {
            alert("Server Error");
        }
    });
});

// /feedstock/create