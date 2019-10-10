/**
 * Created by miguel on 27/08/19.
 */
const horario_simple = function () {
    "use strict";
    let id_horario_carrera = document.getElementById('id_horario_carrera_grupo').value;
    let all_data = {
        grupos_horarios: [],
        horas: [],
        dias_semana: {
            'lunes': {
                'name': 'Lunes',
                'horas': []
            },
            'martes': {
                'name': 'Martes',
                'horas': []
            },
            'miercoles': {
                'name': 'Miércoles',
                'horas': []
            },
            'jueves': {
                'name': 'Jueves',
                'horas': []
            },
            'viernes': {
                'name': 'Viernes',
                'horas': []
            },
            'sabado': {
                'name': 'Sábado',
                'horas': [],
            }

        },
        salones: [],
        profesores: [],
    };
    let base_url = '/api/horarios/';

    function renderTimetables(d) {
        return new Promise(function (resolve, reject) {
            resolve("")
        })

    }

    function renderListMaterias(data) {
        return new Promise(function (resolve, reject) {
            console.log(data);
            let html = ""
            resolve(html)

        })
    }


    return {
        initModel: function () {
            if (!id_horario_carrera) {
                throw new Error('Error no se puede iniciar la construcción del modelo.....')
            }
            rq.sendSimpleRequest(base_url + 'initmodel', {
                'id_horario_carrera': id_horario_carrera,

            }, 'GET', 'json', function (data) {
                console.log(data);
                if (data.state == 200) {
                    for (let item in data.response) {
                        console.log(item);
                        all_data[item] = data.response[item]
                    }
                }


            })
        },
        getGrupos: function () {
            return all_data['grupos_horarios'];
        },
        getHoras: function () {
            return all_data['horas'];
        },
        getDiasSemana: function () {
            return all_data['dias_semana'];
        },
        showTimetablesById: function (horario_id, tableBodyId) {
            rq.sendSimpleRequest(base_url + 'time_information', {
                    'horario_id': horario_id
                }, 'GET', 'json', async function (data) {
                    let html = '';
                    let list_materia = '';
                    if (data.state == 200) {
                        html += await renderTimetables(data.response.data.materias);
                        list_materia += await renderListMaterias(data.response.data.materias);
                    }

                    $(tableBodyId).html('' + html);
                    $("#list_materia").html('' + list_materia);

                }
            )
        }

    }
}();

