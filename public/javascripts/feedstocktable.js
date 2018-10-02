$('#model').change(() => {
    $.getJSON(`/feedstock/all/${$('#model').val()}`, result => {
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