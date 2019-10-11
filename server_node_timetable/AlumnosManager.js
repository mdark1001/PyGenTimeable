/**
 * Created by miguel on 22/03/19.
 */

module.exports = {
    ALUMNOS_PLANES: {},
    agregarAlumnoStack: function (query) {
        let totalMaterias = 0
        return {
            alumnoId: query.alumnoId,
            planId: query.plan_estudios_id,
            total_materias: totalMaterias,
            carga_max: 8,
            socket: null
        }
    }
}
;