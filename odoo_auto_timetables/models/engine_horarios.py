"""
@author miguelCabrera1001 | 
@date 19/09/19
@project 
@name engine_horarios
"""

from odoo import models, fields, api

DIAS = [0, 1, 2, 3, 4, 5]
TOTAL_HORAS = 17

HORAS = [x for x in range(1, TOTAL_HORAS * len(DIAS))]


class EngineHorarios(models.Model):
    _name = 'oohel.engine_horario'
    _rec_name = 'salon_id'

    salon_id = fields.Many2one(
        'op.classroom',
        string='Salón de Clases',
        required=True,
        ondelete='cascade'
    )

    horario_id = fields.Many2one(
        'ops4g.horario_materia_grupo',
        string='Horario materia'
    )

    faculty_id = fields.Many2one(
        'op.faculty',
        string='Profesor',
    )

    subject_id = fields.Many2one(
        'op.subject',
        'Materia',
    )

    grupo_id = fields.Many2one(
        'ops4g.carrera_grupo',
        string='Grupo',
    )

    carrera_id = fields.Many2one(
        'ops4g.carrera',
        string="Carrera",
        related='horario_id.grupo_id.carrera_id',
        store=True,
    )

    hora_id = fields.Many2one(
        'ops4g.horas_horario',
        'Hora'
    )

    periodo_id = fields.Many2one(
        'ops4g.periodo',
        'Periodo Escolar',
        related='horario_id.periodo_id',
        store=True
    )

    state = fields.Selection(
        [
            ('lunes', 'Lunes'),
            ('martes', 'Martes'),
            ('miercoles', 'Miércoles'),
            ('jueves', 'Jueves'),
            ('viernes', 'Viernes'),
            ('sabado', 'Sábado')
        ],
        default='lunes',
        string='Día'
    )

    dia = fields.Many2one(
        'ops4g.dias_semana_horarios',
        string='Dia',
        compute='get_dia_semana',
        stote=True
    )

    color = fields.Char(
        string="Color",
        help="Cambiar color",
        related='salon_id.color',
        store=True
    )

    solucion_id = fields.Char(
        string='Solución No.'
    )

    @api.depends('state')
    def get_dia_semana(self):
        for record in self:
            dia = 'Lunes'
            if record.state == 'lunes':
                dia = 'Lunes'
            elif record.state == 'martes':
                dia = 'Martes'
            elif record.state == 'miercoles':
                dia = 'Miércoles'
            elif record.state == 'jueves':
                dia = 'Jueves'
            elif record.state == 'viernes':
                dia = 'Viernes'
            elif record.state == 'sabado':
                dia = 'Sábado'
            dia_obje = self.env['ops4g.dias_semana_horarios'].search([('name', 'ilike', dia)])
            record.dia = dia_obje.id

    @api.multi
    def getMateriasHorarioByHorarioId(self, horario_id):
        info = dict()
        materias_horario = self.getMateriasByHorario(horario_id)
        info['materias'] = materias_horario
        return info

    def getMateriasByHorario(self, horario_id, json=True):
        horario_materia = self.env['ops4g.horario_materia_grupo'].sudo()
        if json:
            return horario_materia.search_read(
                [('horario_id.id', '=', horario_id)],
                ['horario_id',
                 'periodo_id',
                 'subject_id',
                 'faculty_id',
                 'horas_materia_semana',
                 'code_subject']
            )
        return horario_materia.search(
            [('horario_id.id', '=', horario_id)])

    def inicializar(self, horario_id):
        materias = self.getMateriasByHorario(horario_id=horario_id, json=False)
        mat = []
        for materia in materias:
            horas_semana = materia.horas_materia_semana
            horas_semana = 5 if not horas_semana else horas_semana
            profesoaresList = self.buscarProfesoresIdealByMateria(materia.subject_id.id, materia.periodo_id.id)
            mat.append({
                'materia_id': materia.subject_id.id,
                'horario_materia_id': materia.id,
                'name': materia.code_subject,
                'horas_semana': horas_semana,
                'profesores_candidatos': profesoaresList,
            }, )

        return mat

    def generateSolutionGrupo(self, horario_id, hora_inicio, hora_fin, dias_horario, gt):
        horas = self.getListHoras(hora_inicio, hora_fin, dias_horario)
        materias = self.inicializar(horario_id=horario_id)
        solution = gt.Solution(horas, materias)
        solution.printer()
        solution.getGlobalFitness()
        while solution.getGlobalFitness() != 0:
            solution.selection()
            solution.printer()

        return [x.serializer() for x in solution.getChildrens()]

    def buscarProfesoresIdealByMateria(self, materia_id, periodo_id):
        profesores_impartieron_materia = self.env['profesores_materias_impartidas_kardex'].sudo().search([
            ('materia_id.id', '=', materia_id)

        ], limit=10).sorted(lambda r: r.alumnos_aprobados)

        profersores_impartio_materia = []
        for profesor in profesores_impartieron_materia:
            profersores_impartio_materia.append({
                'profesor_id': profesor.profesor_id.id,
                'profesor': profesor.profesor_id,
                'tiene_permanencia': True,
                'disponibilidad': profesor.profesor_id.getDisponilidadByPeriodoId(periodo_id=periodo_id, is_fake=True)
            })

        return profersores_impartio_materia

    def getListHoras(self, hora_inicio, hora_fin, dias_horario):

        horas = [x for x in range(hora_inicio, hora_fin)]
        print(hora_inicio, hora_fin, dias_horario)
        hd = [horas]
        horasTotales = []
        for index in range(2, 7):
            hd.append(list(map(lambda x: x + len(horas), hd[index - 2])))
        for dias_horas in dias_horario:
            horasTotales += hd[dias_horas - 1]
        return horasTotales
