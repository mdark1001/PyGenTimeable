/**
 * Created by miguel on 27/08/19.
 */

$(function () {

    $(document).on('click', '.ver_horario', function (envet) {
        event.preventDefault();
        var horario_id = parseInt($(this).data('horario_id'));
        if (horario_id == NaN) {
            alert("Error!");
            return;
        }

        horario_simple.showTimetablesById(horario_id)

    })

});