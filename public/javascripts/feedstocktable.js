$.getJSON(`/brand/allJSON`, result => $.each(result, (i, item) =>
    $("#brand").append(`<option value="${item.id}">${item.name}</option>`)));

var models = [];

$.getJSON(`/model/allJSON`, result => models = result);

$('#brand').change(() => {
    const data = models.filter(item => item.brandid == $('#brand').val())
    $("#model").empty();
    $("#model").append(`<option value="-1">Select Model</option><option value="0">All Models</option>`);
    $.each(data, (i, item) =>
        $("#model").append(`<option value="${item.id}">${item.name}</option>`))
})

$('#model').change(() => {

    const model = $('#model').val();
    var url = `/feedstock/all/${$('#model').val()}`;
    if(model == "0") {
        url = `/feedstock/allJSON`
    }

    $.getJSON(url, result => {
        var table = '';
        $.each(result, (i, item) => {
            table += `<tr>
                        <td>${item.id}</td>
                        <td>${item.imeino}</td>
                        <td>${item.color}</td>
                        <td>${item.price}</td>
                        <td>${item.selled}</td>
                        <td>${item.storename}</td>
                        <td>
                            <a href="/feedstock/edit/${item.id}">
                                Edit
                            </a>
                        </td>
                    </tr>`
        })
        console.log(table);
        
        $('#feedstocktable').html(table)
    })
})