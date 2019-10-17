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
        var form = $("#form_config_horario");
        form.validate();

        if (!form.valid()) {
            alert("Error!");
            return;
        }

        let data = {
            horario_id: $("#select_grupos").val(),
            hora_inicio: $("#hora_inicio").val(),
            hora_fin: $("#hora_fin").val(),
            dias_horario: $("#dias_horario").val().join(',')
        };
        $('.btn').attr('disabled', true)

        if (confirm("¿Desea generar una propuesta de horario para esté grupo?")) {
            rq.setTableLoading(horario_simple.getGrupos(), "#table_horario_body");

            horario_simple.propuestaSolucion(data, "#table_horario_body").then(data => {
                setTimeout(function () {
                    rq.removeLoadingTable("#table_horario_body")
                    $('.btn').attr('disabled', false)
                    horario_simple.rennderTableForData(data.response.data)
                }, 4500);
            })

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