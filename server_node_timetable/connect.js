/**
 * Created by miguel on 22/03/19.
 */
const AlumnoManager = require('./AlumnosManager');
const Horarios = require('./HorariosManager')();
module.exports = function (io) {

    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('register', function (data) {
            console.log(data);
        });
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
        socket.on('valida_cupo_materia', async function (msg) {
            console.log(msg);
            let tiene_disponibilidad = await Horarios.tieneDisponibilidadHorario(msg.horario_materia_grupo_id);
            if (!tiene_disponibilidad) {
                AlumnoManager.ALUMNOS_PLANES[msg.planId].forEach((i) => {
                    console.log(i.socket.id);
                    io.to(i.socket.id).emit('sin_cupo_materia', {msg: msg.horario_materia_grupo_id})
                })
            } else {
               // let se_cargo = await Horarios.altaMateriaHorario(msg.alumnoId, msg.horario_materia_grupo_id);
            }

        })

    });
};