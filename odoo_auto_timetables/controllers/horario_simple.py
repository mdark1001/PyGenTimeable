"""
@author miguelCabrera1001 | 
@date 27/08/19
@project 
@name automatic_timeable.py
"""

import json
import os
from odoo import http
from odoo.http import request
from odoo.addons.website.controllers.main import Website
from odoo.exceptions import ValidationError

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _getModuleObject(path_module, name, es_edrp=False):
    path = BASE_DIR.split('/')
    if es_edrp:
        path = '/'.join(path[0:len(path) - 2]) + '/edrp_dev' + path_module
    else:
        path = '/'.join(path[0:len(path) - 1]) + path_module
    from importlib.machinery import SourceFileLoader
    module = SourceFileLoader(name, path).load_module()
    return module


horario_controllers = _getModuleObject('/horarios/controllers/__init__.py',
                                       'horario_controllers', True)
genetic_core = _getModuleObject('/genetic_core/__init__.py',
                                'genetic_core')
from horario_controllers.main import Horarios
import genetic_core.genetic as gt

headers_response = [
    ("Access-Control-Allow-Origin", "*"),
    ('Content-Type', 'application/json'),
    ('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
]


def makeResponse(state, data):
    return request.make_response(json.dumps({'state': state,
                                             'response': data
                                             }),
                                 headers=headers_response)


class HorariosExtendsSimple(Horarios):
    @http.route('/page/horarios/simple/', auth='user', website=True)
    def simple_timeable(self, **kw):
        id_horario_carrera_grupo = kw.get('id_view_plan_carrera')
        return http.request.render('odoo_auto_timetables.horarios_simple',
                                   {
                                       'id_horario_carrera_grupo': id_horario_carrera_grupo,
                                       'grupos': self.gruposByIdCarreraHorario(id_horario_carrera_grupo),
                                       'horas': self.getHoras(),
                                       'dias': self.getDias()
                                   })

    @http.route('/api/horarios/initmodel/', methods=['GET'], auth='user', website=True)
    def initmodel(self, id_horario_carrera=None, **kw):

        id_horario_carrera = id_horario_carrera
        grupos = self.gruposByIdCarreraHorario(id_horario_carrera)
        materias = self.getMateriasByHorarios(grupos)
        profesores = self.getAllProfesoresDisponibles()
        horas = self.getHoras()

        data = {
            'grupos_horarios': []
        }
        return makeResponse(200, data)

    @http.route('/api/horarios/time_information', methods=['GET'], auth='user', website=True)
    def time_information(self, **kw):
        horario_id = int(kw.get('horario_id', 0))

        if horario_id:
            return makeResponse(200, {
                'message': 'Todo bien',
                'data': http.request.env['oohel.engine_horario'].getMateriasHorarioByHorarioId(horario_id)
            })

        return makeResponse(500, {
            'message': 'Error al procesar su solicitud',
            'data': []
        })

    @http.route('/api/horarios/solution', methods=['POST'], auth='user', website=True)
    def solution(self, **kw):
        horario_id = int(kw.get('horario_id', 0))
        hora_inicio = int(kw.get('hora_inicio', 1))
        hora_fin = int(kw.get('hora_fin', 17))
        dias_horario = list(map(int, str(kw.get('dias_horario', '1,2,3,4,5')).split(',')))

        if horario_id:
            return makeResponse(200, {
                'message': 'Todo bien',
                'data': http.request.env['oohel.engine_horario'].generateSolutionGrupo(
                    horario_id=horario_id,
                    hora_inicio=hora_inicio,
                    hora_fin=hora_fin,
                    dias_horario=dias_horario,
                    gt=gt
                )
            })

        return makeResponse(500, {
            'message': 'Error al procesar su solicitud',
            'data': []
        })

    def gruposByIdCarreraHorario(self, id_horario_carrera):
        periodo_carrera = http.request.env['ops4g.periodo_carrera_grupos'].sudo().gruposByIdCarreraHorario(
            id_horario_carrera)
        return periodo_carrera

    def getAllProfesoresDisponibles(self):
        return http.request.env['op.faculty'].sudo().search([])

    def getMateriasByHorarios(self, horarios):
        materias = []
        for h in horarios:
            for materia in h.horario_id:
                materias.append(materia)
        return materias

    def getHoras(self):
        return http.request.env['ops4g.horas_horario'].sudo().search_read([], ['id', 'name'])

    def getDias(self):
        return [
            (1, 'Lunes'),
            (2, 'Martes'),
            (3, 'Miércoles'),
            (4, 'Jueves'),
            (5, 'Viernes'),
            (6, 'Sábado'),
        ]
