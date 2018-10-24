$('#search').click(() => {
    $('#details').html('')
    $('#sold_details').html('')
    $.getJSON(`/search/imeinoAndSoldDetailsAndTransferDetails/${$('#imeino').val()}`, (result) => {
        showNormalDetails(result[0]);
        showSoldDetails(result[1]);
        resultTransfer(result[2])
    })
})

function showNormalDetails(data) {
    if (data.length == 0) {
        alert('IMEI Number Not Found.')
    } else {
        details = data[0];
        var table = `
        <h3>Current Details</h3>
        <table class="table">
            <tr>
                <td>Store Name</td>
                <td>${details.storename}</td>
            </tr>
            <tr>
                <td>Model Number</td>
                <td>${details.modelno}</td>
            </tr>
            <tr>
                <td>Color</td>
                <td>${details.color}</td>
            </tr>
        </table>`
        $('#details').html(table)
    }
}

function showSoldDetails(data) {
    if (data.length > 0) {

        console.log(data)

        details = data[0];
        var table = `
        <h3>SOLD Details</h3>
        <table class="table">
        <tr>
            <th>Sold From</th>
            <th>Date</th>
            <th>Status</th>
        </tr>`
        $.each(data, function(i, item) {
            table += `<tr>
            <td>${item.storename}</td>
            <td>${change_date_formate(item.date)}</td>
            <td>${item.status}</td>
        </tr>`;
        
        });
        `</table>`;
        $('#sold_details').html(table)
    } else {
        $('#sold_details').html(`<h3>Not Sold Yet.</h3>`)        
    }
}

function resultTransfer(data) {
    if(data.length == 0) {
        $('#resultTransfer').html('<h3 style="padding: 50px">No Transfer Details Found</h3>');
    } else {
        var table = `
            <h3>Transfer Details</h3>
            <table class="table">
            <tr><td>Date</td><td>Sender</td><td>Receiver</td><td>Person</td></tr>
        `;
        $.each(data, (i, item) => {
            table += `
                <tr>
                    <td>${change_date_formate(item.date)}</td>
                    <td>${item.sender}</td>
                    <td>${item.receiver}</td>
                    <td>${item.person}</td>
                </tr>
            `
        });
        $('#resultTransfer').html(table);
    }
}

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
