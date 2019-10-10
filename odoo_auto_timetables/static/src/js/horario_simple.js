/**
 * Created by miguel on 27/08/19.
 */

$(function () {

    $(document).on('click', 'button.ver_horario', function (event) {
        event.preventDefault();
        var horario_id = parseInt($(this).data('horario_id'));
        if (horario_id == NaN) {
            alert("Error!");
            return;
        }

        horario_simple.showTimetablesById(horario_id, "#table_horario_body")

    });
    $(document).on('click', 'button.solucion', async function (event) {
        event.preventDefault();
        var horario_id = parseInt($(this).data('horario_id'));
        if (horario_id == NaN) {
            alert("Error!");
            return;
        }

        $('.btn').attr('disabled', true)

        if (confirm("¿Desea generar una propuesta de horario para esté grupo?")) {
            rq.setTableLoading(horario_simple.getGrupos(), "#table_horario_body");
            setTimeout(function () {
                rq.removeLoadingTable("#table_horario_body")
                $('.btn').attr('disabled', false)
            }, 4500);
            await horario_simple.propuestaSolucion(horario_id, "#table_horario_body")

        } else {
            $('.btn').attr('disabled', false)
        }
    })

    $(document).on('change', '#select_grupos', function (event) {
        event.preventDefault();
        let horario_id = parseInt($(this).val());
        if (isNaN(horario_id)) {
            alert("Error!");
            return;
        }
        horario_simple.showTimetablesById(horario_id, "#table_horario_body")
    })

});