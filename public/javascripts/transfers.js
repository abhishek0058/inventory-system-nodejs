function makeTable(data) {
    var table = '';

    $.each(data, function(i, item) {
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
                <a id="${item.date}" class="date" href="#">
                    ${(item.date).substr(0, 10)}
                </a>
            </td>
        </tr>`
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
    const date = e.target.attributes[0].value;
    $('#result').html("<h4>Loading ...</h4>")
    $.getJSON(`/transfers/onDate/${(date).substr(0, 10)}`, result => { console.log(result); makeTable(result)} );
    $('#header').html(`On Date: ${(date).substr(0, 10)}`)
});