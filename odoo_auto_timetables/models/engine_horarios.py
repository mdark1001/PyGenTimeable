"""
@author miguelCabrera1001 | 
@date 19/09/19
@project 
@name engine_horarios
"""

from odoo import models, fields, api

TOTAL_DIAS = 6
MAX_HORAS = 96


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
        # stote=True
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

    # @api.multi
    # def engineHorario(self, horario_id):
    #     pass
    #
    # def buscarProfesoresIdealByMateria(self, materia_id):
    #     profesores_impartieron_materia = self.env['profesores_materias_impartidas_kardex'].sudo().search([
    #         ('materia_id.id', '=', materia_id)
    #
    #     ], limit=10).sorted(lambda r: r.alumnos_aprobados)
    #
    #     profersores_impartio_materia = []
    #     for profesor in profesores_impartieron_materia:
    #         profersores_impartio_materia.append({
    #             'profesor_id': profesor.profesor_id.id,
    #             'profesor': profesor.profesor_id,
    #             'tiene_permanencia': True
    #         })
    #
    #     return profersores_impartio_materia
    #
    # @api.multi
    # def generarEstructuraHorarios(self, horarios):
    #     engine = {}
    #     grupos = {}
    #
    #     for horario in horarios:
    #         materias_engie = []
    #         for horario_materia_grupo in horario.horario_id:
    #             profesores = self.buscarProfesoresIdealByMateria(horario_materia_grupo.subject_id.id)
    #             datos_materia = {
    #                 'subject_id': horario_materia_grupo.subject_id.id,
    #                 'grupo': horario_materia_grupo.grupo_id.id,
    #                 'salon_id': horario.grupo_id.salon_id.id,
    #                 'soluciones': [],
    #                 'listado_profesores': profesores,
    #                 'profesor_ideal': False,
    #                 'tiene_empalme': False,
    #                 'turno_tag': str(horario_materia_grupo.grupo_id.turno.name).lower()
    #             }
    #             materias_engie.append(datos_materia)
    #             engine[str(horario_materia_grupo.id)] = datos_materia
    #         grupos[str(horario.grupo_id.id)] = {
    #             'soluciones': [],
    #             'materias': materias_engie
    #         }
    #
    #     return grupos
    #
    # @api.multi
    # def run(self, data, soluciones, items):
    #     if all([data, soluciones, items]):
    #         matris_horarios = self.getMatrisSolucion()
    #         for solucion in range(soluciones):
    #             for index, grupo_index in enumerate(data):
    #                 grupo = data[grupo_index]
    #                 grupo.soluciones.append(self.initProblacion(grupo.items))
    #                 data[grupo_index] = grupo
    #     return False
    #
    # def getMatrisSolucion(self):
    #     horas = self.env['ops4g.horas_horario'].sudo().search([])
    #     matris_solucion = []
    #     item = 1
    #     for dia in range(TOTAL_DIAS):
    #         matris_solucion.append([])
    #         for hora in horas:
    #             matris_solucion[dia - 1].append(item)
    #             item += 1
    #     return matris_solucion
    #
    # def initProblacion(self, items):
    #     return []
