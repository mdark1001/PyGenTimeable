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
            let html = ""
            let i = 1;
            horario_simple.getHoras().forEach((h, index) => {
                html += ` <tr>
                <td>${h['name']}</td>`;
                Object.keys(horario_simple.getDiasSemana()).forEach(d => {
                    html += `
                        <td id="time_${i}">
                        </td>
                    `;
                    i++;
                });
                html += `</tr>`
            });
            resolve(html)
        })

    }

    function renderListMaterias(data) {
        return new Promise(function (resolve, reject) {
            let html = "";
            all_data['grupos_horarios'] = data;
            all_data['grupos_horarios'].forEach((d, index) => {
                d['color'] = COLORS_TIMETABLE[index % COLORS_TIMETABLE.length]

                html += ` <tr>
                            <td><div class="badge-responsive badge-block"  style=" background-color: ${d['color']}; color: white;" >
                                ${  d['subject_id'][1]}-${d['code_subject']} <br/>
                             ${d['faculty_id'] ? d['faculty_id'][1] : ''} <br/>
                            ${0}
                            </div>
                            </td>
                      </tr>`;
            });
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
            return HORAS
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
                    $("#table_list_materia").html('' + list_materia);

                }
            )
        },
        propuestaSolucion: function (horario_id, tableBodyId) {
            return new Promise(function (resolve, reject) {

                rq.sendSimpleRequest(base_url + 'solution', {
                    'horario_id': horario_id
                }, 'GET', 'json', async function (data) {
                    console.log(data);
                    resolve(data)
                })
            })

        },
        getColorGrupos: function () {
            return new Promise(function (resolve, reject) {
                let colors = {};
                horario_simple.getGrupos().forEach(d => {
                    colors[d.id] = d.color
                });
                resolve(colors)

            })
        },
        rennderTableForData: async function (data) {
            let colors = await horario_simple.getColorGrupos()
            console.log(data);
            data.forEach(d => {

                console.log(d);
                d.genes.forEach(g => {
                    $(`td#time_${g}`).append(
                        `
                   <div class="badge-responsive badge-block"  style=" background-color: ${colors[d.horario_materia_id]}; color: white;" >
                   Nombre:${d.name} </div><br>
                        `
                    );
                })


            })
        }

    }
}();

