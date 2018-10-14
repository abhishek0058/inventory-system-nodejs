$('#sold').click(() => {
    const date = $('#date').val();
    if (date == "") {
        alert('Please Enter a date');
        return;
    } else {
        window.location.href = `/dailyreport/sold/${date}`;
    }
});


$('#transfers').click(() => {
    if ($('#date').val() == "") {
        alert('Please Enter a date');
        return;
    } else {
        window.location.href = `/dailyreport/transfer/${date}`;
    }
});