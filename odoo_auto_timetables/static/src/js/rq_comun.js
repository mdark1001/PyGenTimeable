'use strict'
/**
 * Created by miguel on 10/06/18.
 */

const COLORS_TIMETABLE = ['#eb007a',
    '#951b81',
    '#009fe3',
    '#ccd622',
    '#1f4a8a',
    '#0fafa0',
    '#f18400',
    '#ffcc00',
    '#330066',
    '#cc33ff',
    '#ff0000',
    '#fd9457',
    '#00ff00',
    '#fff500',
    '#686bab',
    '#e64963',
    '#3bb3c2'
];
const rq = {
    mensaje_alert: "#mensaje",
    text: '',
    file_extensions: 'pdf|PDF|jpg|jpeg|png',
    maxfilesize: 20000000,
    selectArray2: function (data, key, val, selected, readonly) {
        let select = "";
        //console.log(selected);
        $.each(data, function (i, item) {
            let tag = "";
            if (Array.isArray(val)) {
                $.each(val, function (i, key_value) {
                    tag += item[key_value] + "  ";
                })
            } else {
                tag = item[val]
            }
            let selected_l = "";
            let readonly = '';
            if (selected != undefined && selected != null) {
                if (item[key] == selected)
                    selected_l = 'selected';
            }
            if (readonly) {
                readonly = 'readonly="readonly" disabled="disabled"'
            }

            select += "<option  " + selected_l + " " + readonly + "  value='" + item[key] + "'>" + tag + "</option>";
        });
        return select;
    },

    sendSimpleRequest: function (url, params, type, return_type, procesador) {
        params['csrf_token'] = $("#csrf_token").val();
        $.ajax({
            url: url,
            type: type,
            data: params,
            dataType: return_type,
            success: function (data) {
                procesador(data)
            },
            error: function (datos_error) {
                console.log("Error Data ----" + datos_error);
            },
        });
    },
    validar_matricula: function (matricula) {
        if ($.trim(matricula).length == 0 || matricula == '') {
            return false;
        }
        return true;
    },
    confirma_mensaje: function (msg, type, functionAceptar, functionCancelar) {
        var message = '<div class="alert alert-' + type + '">' +
            '<strong>Atención: </strong> ' + msg +
            '</div>';
        this.confirmar('Confirmar', message, functionAceptar, functionCancelar);


    },
    confirmar: function (titulo, mensaje, funcionAceptar, funcionCancelar) {
        var htmlModal = '\
        <div class="modal fade modal_si_no" role="dialog" aria-labelledby="modal_autorizar" aria-hidden="true">\n\
            <div class="modal-dialog" style="width:480px">\n\
                <div class="modal-content">\n\
                    <div class="modal-header">\n\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n\
                            <span aria-hidden="true">&times;</span>\n\
                        </button>\n\
                        <h4 class="modal-title"><span class="titulo">' + titulo + '</span></h4>\n\
                    </div>\n\
                    <div class="modal-body"><span class="contenido">\n\
                        ' + mensaje + '\n\
                        </span>\n\
                    </div>\n\
                    <div class="modal-footer">\n\
                        <span class="cargando_si_no" style="display:none">\n\
                            <span class="blue">Procesando...</span>\n\
                        </span>\n\
                        <button class="btn btn-success aceptar_si_no">Aceptar</button>\n\
                        <button class="btn btn-default cancelar_si_no">Cancelar</button>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
        </div>\n\
    ';
        if ($('.modal_si_no').size() > 0) {
            $('.modal_si_no').remove();
            $(".modal-backdrop").remove();
        }
        $("body").append(htmlModal);
        var dialog = $(".modal_si_no");
        var avisos = dialog.find(".cargando_si_no");
        var boton = dialog.find(".aceptar_si_no");
        dialog.modal('show');
        //console.log(dialog);
        dialog.on('click', '.aceptar_si_no', function (event) {
            boton.html('Guardando...').attr('disabled', true);
            avisos.show();
            setTimeout(function () {
                boton.html('Aceptar').attr('disabled', false);
                avisos.hide();
            }, 3000);

            var url = null;
            if (typeof funcionAceptar === 'function') {
                url = funcionAceptar();
            }
            if (url != null) {
                avisos.find('span').text('Redireccionando...');
                document.location.href = url;
            }
            dialog.modal('hide');
            dialog.remove();
            $(".modal-backdrop").remove();
        });
        dialog.on('click', '.cancelar_si_no', function (event) {
            if (typeof funcionCancelar === 'function') {
                funcionCancelar();
            }
            dialog.modal('hide');
            dialog.remove();
            $(".modal-backdrop").remove();
        });

        return dialog;
    },
    mostrar_mesnaje_dinamico: function (text, type, time) {
        var timeout = time || 3000;
        var tipo = 'alert-danger';
        switch (type) {
            case 200:
                tipo = 'alert-success';
                break;
            case 500:
                tipo = 'alert-danger';
                break;
            case 301:
                tipo = 'alert-warning';
                break;
            case 400:
                tipo = 'alert-info';
                break;
        }
        if (text) {
            var selector = $(this.mensaje_alert);
            selector.children('strong').html(text);
            selector.addClass(tipo).removeClass('hidden');
            setTimeout(function () {
                    selector.addClass('hidden').removeClass(tipo)
                },
                timeout
            )

        }
    },
    setLoader: function (id_container) {
        $(id_container).html(`<div class="spinner">
                                  <div class="double-bounce1"></div>
                                  <div class="double-bounce2"></div>
                               </div>
                               <h4 class="text-center">Por favor espere...</h4>

                `);

    },
    senLoadingButton: function (elemet) {
        if (typeof  elemet == 'string') {
            return
        }

    },
    bsucar_disponible_horario_dia: function (array_disponibilidad,
                                             dia_param,
                                             horario_id,
                                             grupo_horario,
                                             horario_profe_otro_grupo,
                                             label_checkbox,
                                             horario_grupo,
                                             salon_default, readonly) {
        var ckeckbox = ``;
        var is_ckecked = "";
        var dia_select = dia_param.split('_')
        var dia = dia_select[0];
        //console.log($.inArray(horario_id, array_disponibilidad[dia]), horario_id, array_disponibilidad[dia])
        //console.log(horario_grupo);
        if (array_disponibilidad[dia].indexOf(horario_id) !== -1) {
            // ingresar las otras validaciones aquí
            var extra_data = `data-id_horario="${horario_id}" 
                              data-dia="${dia}"
                              data-label="${label_checkbox}"
                              data-id_horario_materia="${grupo_horario['id']}"
                              data-salon_default="${salon_default}"`;
            let readonly_t = "";
            if (horario_profe_otro_grupo[dia].indexOf(horario_id) === -1) {
                if (grupo_horario[dia_param].indexOf(horario_id) !== -1) {
                    is_ckecked = 'checked="checked"'
                }
                if (horario_grupo[dia].indexOf(horario_id) !== -1) {
                    return ""
                }

                if (readonly) {
                    readonly_t = 'readonly="readonly" disabled="disabled"'
                }
                ckeckbox = `<input  type="checkbox" class="form-control on_change_save_horario_checkbox" 
                            id="horario_${horario_id}_${dia}" ${extra_data}  ${readonly_t} ${is_ckecked} />`
            }
        }
        return ckeckbox;
    },
    salon_disponible: function (par_id_hora, grupo_salones) {
        var salon = ``;
        //console.log(grupo_salones);
        if (grupo_salones.length > 0) {
            $.each(grupo_salones, function (index, salon_index) {
                //console.log(salon_index.id_hora, salon_index);
                if (parseInt(salon_index['id_hora']) == parseInt(par_id_hora)) {
                    salon = `<span class="badge salon_clase" id="salon_${salon_index['id_salon']}_${salon_index['horario_id'] }">
                            ${salon_index['salon']} -  ${salon_index['salon_clave']}
                            <a class="quitar_salon_badge"><i class="remove glyphicon glyphicon-remove-sign glyphicon-white"></i></a> 
                            </span>`;
                    return salon;
                }
            });
        }
        return salon;
    },
    generar_disponibilidad_profe_horario_salon: function (data, id_profesor, id_salon, salon_default, es_readonly) {
        var html_disponibildiad = ``;
        var horas_json = JSON.parse(horas);
        $.each(horas_json, function (key, val) {
            html_disponibildiad += `<tr>  
                    <td>
                    ${val['name']}
                    </td>
                    <td class="lunes_modal">
                       ${rq.bsucar_disponible_horario_dia(data['profesor_select_disponibilidad'],
                'lunes_horario_ids',
                val['id'],
                data['horario_materia'],
                data['horas_profe_otro_grupo'],
                val['name'], data['horario_grupo'], salon_default, es_readonly)}
                       ${rq.salon_disponible(val['id'], data['salones_materia']['lunes'])} 
                    </td>
                    <td class="martes_modal">
                       ${rq.bsucar_disponible_horario_dia(data['profesor_select_disponibilidad'],
                'martes_horario_ids',
                val['id'],
                data['horario_materia'],
                data['horas_profe_otro_grupo'],
                val['name'], data['horario_grupo'], salon_default, es_readonly)}
                       ${rq.salon_disponible(val['id'], data['salones_materia']['martes'])}
                    </td>
                    <td class="miercoles_modal">
                       ${rq.bsucar_disponible_horario_dia(data['profesor_select_disponibilidad'],
                'miercoles_horario_ids',
                val['id'],
                data['horario_materia'],
                data['horas_profe_otro_grupo'],
                val['name'],
                data['horario_grupo'],
                salon_default,
                es_readonly)}
                       ${rq.salon_disponible(val['id'], data['salones_materia']['miercoles'])}
                    </td>
                    <td class="jueves_modal">
                        ${rq.bsucar_disponible_horario_dia(data['profesor_select_disponibilidad'],
                'jueves_horario_ids',
                val['id'],
                data['horario_materia'],
                data['horas_profe_otro_grupo'],
                val['name'],
                data['horario_grupo'], salon_default,
                es_readonly)}
                        ${rq.salon_disponible(val['id'], data['salones_materia']['jueves'])}
                    </td>
                    <td class="viernes_modal">
                        ${rq.bsucar_disponible_horario_dia(data['profesor_select_disponibilidad'],
                'viernes_horario_ids',
                val['id'],
                data['horario_materia'],
                data['horas_profe_otro_grupo'],
                val['name'], data['horario_grupo'],
                salon_default, es_readonly)}
                        ${rq.salon_disponible(val['id'], data['salones_materia']['viernes'])}
                    </td>
                    <td class="sabado_modal">
                     ${rq.bsucar_disponible_horario_dia(data['profesor_select_disponibilidad'], 'sabado_horario_ids', val['id'], data['horario_materia'], data['horas_profe_otro_grupo'], val['name'], data['horario_grupo'], salon_default, es_readonly)}
                     ${rq.salon_disponible(val['id'], data['salones_materia']['sabado'])}
                    </td>
            </tr> `;
        });
        return html_disponibildiad;
    },
    table_disponibilidad: function (data, id_profesor, id_salon, salon_default, es_readonly) {
        return `
        <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Hora</th>
                                <th>L</th>
                                <th>M</th>
                                <th>Mi</th>
                                <th>J</th>
                                <th>V</th>
                                <th>S</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rq.generar_disponibilidad_profe_horario_salon(data, id_profesor, id_salon, salon_default, es_readonly)}
                        </tbody>
                    </table>
                    `;
    },
    render_html_form_horario: function (data, id_profesor, id_salon, salon_default) {
        var es_readonly = (data['state'] == 'publicado') ? true : false;
        var profesores = this.selectArray2(data['profesores'], 'id', ['name', 'last_name', 'middle_name'], parseInt(id_profesor.val()), es_readonly
        );
        var carreras = this.selectArray2(data['carreras'], 'id', ['name'], es_readonly
        );
        //console.log(profesores);

        $("#total_horas_semana_materia").val(data['materia'].horas_semana)
        var html = `
                   <div class="row">
                <div class="col-xs-12 col-sm-12 col-lg-12">
                    <ul>
                        <li>
                            <h4>
                                <b>
                                    ${data['materia'].clave_unica} - ${data['materia'].name} -
                                    ${data['materia'].grade_weightage}
                                </b>
                            </h4>
                        </li>
                        <li>
                            Salón <strong>${data['salon'][0].name}</strong>
                        </li>
                        <li>
                            Horas a la semana  <b id="horas_total_asignada">${data['horario_materia'].total_horas}</b>/  ${data['materia'].horas_semana}
                        </li>
                    </ul>
                    <div class="col-xs-12 col-sm-12 col-lg-12" >
                        <strong><h5>Filtros</h5></strong>
                        <div class="col-xs-12 col-sm-4 col-lg-3" >
                            <div class="form-group">
                                <label for="carrera">carrera:</label>
                                <select name="carrera" id="carrera_select" class="form-control">
                                    <option value="" disabled selected>-- Seleccione un carrera--</option>
                                    ${carreras}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-4 col-lg-3" >
                            <div class="form-group">
                                <label for="materia_carrera">Impartió materia:</label>
                                <input type="checkbox" id="impartio_materia">
                            </div>
                        </div>
                    </div>
                    <div class="form-group col-xs-12 col-sm-12 col-lg-12">
                        <div class="col-xs-12 col-sm-4 col-lg-3">
                            <label for="profesor">Profesor:</label>
                            <select name="profesor" id="profesor_select" class="form-control">
                                <option value="">-- Seleccione un profesor--</option>
                                ${profesores}
                            </select>
                        </div>
                    </div>
                </div>
            
            
                <div id="disponibilidad" class="col-xs-12 col-sm-12 col-lg-12">
                    ${rq.table_disponibilidad(data, id_profesor, id_salon, salon_default, es_readonly)}
                </div>
            </div>

`;


        return html;
    },
    render_tr_add_materia: function (data, id_materia, id_horario) {
        return `<tr data-id_materia="${id_materia}"
                                                                                                    data-id_horario="${id_horario}"
                                                                                                    data-id_horario_materia="${data['id_horario_materia']}"
                                                                                                    data-id_grupo="${data['grupo_id']}"
                                                                                                    class="tr_open_modal_horario"
                                                                                                   
                                                                                                >
                                                                                                <td>
                                                                                                     <button id_horario_materia="${data['id_horario_materia']}"
                                                                                                             class="btn btn-xs btn-danger btnDeleteMareriaGrupo">
                                                                                                              <i class="glyphicon glyphicon-remove-sign"></i>
                                                                                                        </button>    
                                                                                                </td>
                                                                                                    <td class="abrir_modal">
                                                                                                        ${data['materia']}
                                                                                                    </td>
                                                                                                    <td class="abrir_modal"> 
                                                                                                       <input type="hidden"
                                                                                                               name="salon[${data['id_horario_materia']}]"
                                                                                                               value=""
                                                                                                               id="id_salon_${data['id_horario_materia']}"/>
                                                                                                       <input type="hidden"
                                                                                                               name="profesor[${data['id_horario_materia']}]"
                                                                                                               value=""
                                                                                                               id="id_profesor_${data['id_horario_materia']}"/>
                                                                                                        <span id="tag_profesor_${data['id_horario_materia']}">
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td class="dia lunes abrir_modal">                                                                                                      
                                                                                                    </td >
                                                                                                    <td class="dia martes abrir_modal">
                                                                                                    </td>
                                                                                                    <td class="dia miercoles abrir_modal">
                                                                                                    </td>
                                                                                                    <td class="dia jueves abrir_modal">
                                                                                                    </td>
                                                                                                    <td class="dia viernes abrir_modal">
                                                                                                     </td>
                                                                                                    <td class="dia sabado abrir_modal">
                                                                                                    </td>
                                                                                                </tr>
`;

    },
    generar_tags_dias_horario_materia: function (kw, horas) {
        let index_list = ``;
        if (kw.lunes.length > 0) {
            index_list += `<li class="list-group-item">Lunes:`;
            kw.lunes.forEach(function (eld) {
                //console.log(eld);
                index_list += "<span class='badge-responsive'>" + horas[eld] + "</span><br/>"
            })
            ;
            index_list += `</li>`;
        }
        if (kw.martes.length > 0) {
            index_list += `<li class="list-group-item">Martes:`;
            kw.martes.forEach(function (eld) {
                console.log(eld);
                index_list += "<span class='badge-responsive'>" + horas[eld] + "</span><br/>"
            })
            ;
            index_list += `</li>`;
        }
        if (kw.miercoles.length > 0) {
            index_list += `<li class="list-group-item">Miércoles:`;
            kw.miercoles.forEach(function (eld) {
                //console.log(eld);
                index_list += "<span class='badge-responsive'>" + horas[eld] + "</span><br/>"
            })
            ;
            index_list += `</li>`;
        }
        if (kw.jueves.length > 0) {
            index_list += `<li class="list-group-item">Jueves:`;
            kw.jueves.forEach(function (eld) {
                //console.log(eld);
                index_list += "<span class='badge-responsive'>" + horas[eld] + "</span><br/>"
            })
            ;
            index_list += `</li>`;
        }
        if (kw.viernes.length > 0) {
            index_list += `<li class="list-group-item">Viernes:`;
            kw.viernes.forEach(function (eld) {
                //console.log(eld);
                index_list += "<span class='badge-responsive'>" + horas[eld] + "</span><br/>"
            })
            ;
            index_list += `</li>`;
        }
        if (kw.sabado.length > 0) {
            index_list += `<li class="list-group-item">Sábado:`;
            kw.sabado.forEach(function (eld) {
                //console.log(eld);
                index_list += "<span class='badge-responsive'>" + horas[eld] + "</span><br/>"
            })
            ;
            index_list += `</li>`;
        }
        //index_list += `</li>`;
        return index_list;
    },
    horas_horario_array: function (array_horas) {
        //console.log(JSON.parse(array_horas));
        var iHoras = JSON.parse(array_horas);
        var array_retorno = [];
        $.each(iHoras, function (i, k) {
            //console.log(k);
            array_retorno[k.id] = k.name
        });

        return array_retorno;
    },
    generar_datos_horario_materia_re: function (data, array_horas, horario_materia_grupo_id, materia_id) {
        let thtml = `<div class='alert hidden'  id='alert_modal_materia_horario' > <strong> </strong></div>`;

        $.each(data['horarios'], function (i, k) {
            thtml += `<div clas="col-xs-12.col-sm-4.col-lg-4">         
            <ul class="list-group">
                    <li class="list-group-item active">
                        <div class="radio">
                            <label>
                                <input type="radio" 
                                 ${horario_materia_grupo_id == k['id'] ? 'checked' : ''}
                                 data-id_materia="${materia_id}"
                                 data-profesor="${k['faculty_id'][1]}"
                                 name="grupo_hoario_materia" id="grupo_hoario_materia_${k['id']}" value="${k['id']}" >
                                    ${k['grupo_id'][1]}
                            </label>
                        </div>
                    </li>
                    <li class="list-group-item">Profesor: <b>${ k['faculty_id'] == false ? "" : k['faculty_id'][1] }</b></li>
                       ${rq.generar_tags_dias_horario_materia(k, array_horas)}         
                    </ul>
                </div>`;
        });
        return thtml


    },
    crear_horario_by_dia_grupo: function (data) {
        // console.log(data);
        let html_return = ``;
        if (data.length > 0) {
            $.each(data, function (i, key) {
                html_return += `<li class="grupo list-group-item materia_${key['subject_id']}">
                                 <h5><b>${key['subject_id_name']}</b></h5> 
                                  <p>Profesor:<b>${key['faculty_id']}</b></p>
                                  <p>Hora: <b>${key['hora_id']}</b></p>
                                  <p>Salón: <b>${key['salon']}</b></p>
                               </li>
                        `;
            });
        }
        return html_return;
    },
    setMateriasGrupo: function (materias) {
        let materia = ``;
        if (materias.length > 0) {
            $.each(materias, function (i, k) {
                materia += `
                 <div class="col-xs-12 col-sm-4 col-gl-3">
                                                                    <div class="checkbox">
                                                                        <label><input class="on_change_materia_checkbox"
                                                                                      type="checkbox"
                                                                                      data-id_horario_materia="${k['id_horario_materia']}"
                                                                                      checked
                                                                                      value="${k['id_materia']}">
                                                                            ${k['materia']}
                                                                        </label>
                                                                    </div>
                                                                </div>    
            `;
            });
        }
        return materia;
    },
    setTableLoading: function (grupos, table) {
        let selector_td = ''
        let dias = Object.keys(horario_simple.getDiasSemana())

        for (let i = 0; i < 100; i++) {
            let dia = parseInt(Math.random(0, (dias.length*HORAS.length)) * (dias.length*HORAS.length))

            selector_td = "time_" + dia
            $(table).find(`td#${selector_td}`).html(`
                <div class="badge-responsive badge-list animated infinite fadeOut delay-${parseInt(Math.random(2, 5)*5 )}s"  style=" background-color:${COLORS_TIMETABLE[i % COLORS_TIMETABLE.length

                ]}">
                
                </div>    
            `)

        }

    },
    removeLoadingTable(table){
        $(table).find("div.badge-responsive").remove()
    }
};
