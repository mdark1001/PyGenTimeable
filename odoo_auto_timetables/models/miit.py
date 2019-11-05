"""
@author miguelCabrera1001 | 
@date 4/11/19
@project 
@name miit
"""
from odoo import models
from ..genetic_core import genetic


class Miit(models.AbstractModel):
    _name = 'miit'

    def solution(self, horas, materias):
        print(horas)
        print(str(materias).encode('UTF-8'))

        solution = genetic.Solution(horas, materias)
        solution.printer()
        while solution.getGlobalFitness() != 0:
            solution.selection()
        solution.printer()
        return [x.serializer() for x in solution.getChildrens()]
