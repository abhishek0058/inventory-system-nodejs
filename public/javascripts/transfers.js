var fallBackDate = [];

$.getJSON('/store/allJSON', result => {
    $.each(result, (i, item) => {
        $("#store").append(`<option value="${item.id}">${item.name}</option>`)
    })
});

$('#store').change(() => {
    makeTable(fallBackDate);
});


$.getJSON('/model/allJSON', result => {
    $.each(result, (i, item) => {
        $("#model").append(`<option value="${item.modelno}">${item.modelno} - ${item.name}</option>`)
    })
});

$('#model').change(() => {
    makeTable(fallBackDate);
});


function makeTable(data) {
    fallBackDate = data;
    var table = '';

    $.each(data, function (i, item) {
        if (($('#store').val() == "0" || $('#store').val() == item.senderid) && ($('#model').val() == "0" || $('#model').val() == item.modelno)) {
            table += `<tr>
                <td>${item.id}</td>
                <td>
                    <a id="${item.senderid}" name="${item.sender}" class="store" href="#">
                        ${item.sender}
                    </a>
                </td>
                <td>
                    <a id="${item.receiverid}" name="${item.receiver}" class="store" href="#">
                        ${item.receiver}
                    </a>
                </td>
                <td>
                    ${item.imeino}
                </td>
                <td>
                    ${item.modelno}
                </td>
                <td>
                    ${item.person}
                </td>
                <td>
                    <a id="${item.date}" class="date" href="#">
                        ${change_date_formate(item.date)}
                    </a>
                </td>
            </tr>`
        }
    })

    $('#result').html(table);
}

$.getJSON(`/transfers/all`, result => makeTable(result));

$('#searchByDate').click(() => {
    const date1 = $('#date1').val();
    const date2 = $('#date2').val();
    $('#result').html("<h4>Loading ...</h4>")
    $.getJSON(`/transfers/searchByDate/${date1}/${date2}`, result => makeTable(result));
    $('#header').html(`${(date1).substr(0, 10)} and ${(date2).substr(0, 10)}`)
})

$('#result').on('click', '.store', e => {
    const id = e.target.attributes[0].value;
    const name = e.target.attributes[1].value;
    $('#result').html("<h4>Loading ...</h4>")
    $.getJSON(`/transfers/store/${id}`, result => makeTable(result));
    $('#header').html(name)
});

$('#result').on('click', '.date', e => {
    const date = change_date_formate(e.target.attributes[0].value);
    $('#result').html("<h4>Loading ...</h4>")
    $.getJSON(`/transfers/onDate/${date}`, result => {
        console.log(result);
        makeTable(result)
    });
    $('#header').html(`On Date: ${date}`)
});

$('#reset').click(() => {
    $.getJSON(`/transfers/all`, result => makeTable(result));
    $('#header').html('')
})

function change_date_formate(da) {
    date = new Date(da);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return (year + '-' + month + '-' + dt);
}