"""
@author miguelCabrera1001 |
@date 19/09/19
@project
@name profesor
"""

from odoo import models, fields, api


class ProfesorHorarioHelper(models.Model):
    _inherit = 'op.faculty'

    @api.multi
    def getDisponilidadByPeriodoId(self, periodo_id, is_fake=False):
        disponibilidad = self.env['ops4g.profesor_dis_periodo'].sudo().search(
            [
                ('name.id', '=', self.id),
                ('x_periodo_ids.id', '=', periodo_id)
            ],
            limit=1
        )
        disponibilidad_profesor = disponibilidad.x_disponibilidad_horario
        if is_fake:
            return [[x for x in range(1, 17)],
                    [x for x in range(1, 17)],
                    [x for x in range(1, 17)],
                    [x for x in range(1, 17)],
                    [x for x in range(1, 17)],
                    [x for x in range(1, 17)],
                    ]

        dis = [[x.name.id for x in disponibilidad_profesor if x.lunes],
               [x.name.id for x in disponibilidad_profesor if x.martes],
               [x.name.id for x in disponibilidad_profesor if x.miercoles],
               [x.name.id for x in disponibilidad_profesor if x.jueves],
               [x.name.id for x in disponibilidad_profesor if x.viernes],
               [x.name.id for x in disponibilidad_profesor if x.sabado],
               ]

        return dis
