var feedstock = [];
$.getJSON(`/search/searchJSON`, result => feedstock = result);

$('#search').click(() => {

    var table = '';
    let data = feedstock.filter(item => item.imeino == $('#imeino').val())
    if (data.length > 0) {
        table += `<tr>
            <td>${data[0].id}</td>
            <td>${data[0].imeino}</td>
            <td>${data[0].color}</td>
            <td>${data[0].price}</td>
            <td>${data[0].selled}</td>
            <td>${data[0].storename}</td>`

        $('#searchtable').html(table)
    } else {
        alert("IMEI Invalid")
        $('#searchtable').html(table)
    }
})