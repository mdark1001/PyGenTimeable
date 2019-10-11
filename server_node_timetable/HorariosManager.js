/**
 * Created by miguel on 22/03/19.
 */

module.exports = () => {
    const setupdatabase = require('./db/db.js');
    let CONFIG = require('./db/config');
    const sequelize = setupdatabase(CONFIG.ODOO);
    sequelize.authenticate();
    const axios = require('axios');
    const URL_SERVER = '127.0.0.1:8069';

    return {
        tieneDisponibilidadHorario: function (horario_materia_grupo_id) {
            return new Promise(function (resolve, reject) {
                sequelize.query(`SELECT
                id,
                disponibilidad_grupo,   
                (select count(*) as total_alumnos from 
                ops4g_horario_grupo_alumno
                 where horario_materia_grupo_id=${horario_materia_grupo_id}
                 ) as 
                numero_alumnos_inscritos
                
                FROM  ops4g_horario_materia_grupo  
                where id=${horario_materia_grupo_id} limit 1;`).then(function (u) {
                    let data = u[0][0];
                    if (data) {
                        if (data.numero_alumnos_inscritos < data.disponibilidad_grupo)
                            resolve(true);
                        else resolve(false)
                    }
                    resolve(false)
                })
            })
        },
        altaMateriaHorario: function (alumnoId, horario_grupo_materia_id) {
            return new Promise(function (resolve, reject) {
                axios.get(`${URL_SERVER}/api/reinscripcion/horario/alta_materia?alumno_id=${alumnoId}&horario_materia_id=${horario_grupo_materia_id}`)
                    .then(response => {
                        console.log(response.data.url);
                        console.log(response.data.explanation);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
        }
    }
}