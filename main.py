"""
@author miguelCabrera1001 | 
@date 9/10/19
@project 
@name main
"""
import datetime
import unittest

from PyGenTimeable.genetic_core.genetic import Solution

DIAS = [0, 1, 2, 3, 4, 5]
TOTAL_HORAS = 17

HORAS = [x for x in range(1, TOTAL_HORAS * len(DIAS))]
materias = [
    {
        'materia_id': 3556,
        'horario_materia_id': 14,
        'name': "ELE040110",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },
    {
        'materia_id': 3556,
        'horario_materia_id': 15,
        'name': "ELE040210",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },
    {
        'materia_id': 3556,
        'horario_materia_id': 16,
        'name': "ELE040210",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },
    {
        'materia_id': 3556,
        'horario_materia_id': 17,
        'name': "ELE040210",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },
    {
        'materia_id': 3556,
        'horario_materia_id': 18,
        'name': "ELE040210",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },

    {
        'materia_id': 3556,
        'horario_materia_id': 19,
        'name': "ELE040210",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },

    {
        'materia_id': 3556,
        'horario_materia_id': 20,
        'name': "ELE040210",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },

    {
        'materia_id': 3556,
        'horario_materia_id': 21,
        'name': "ELE040210",
        'horas_semana': 5,
        'profesores_candidatos': [],
    },

]

if __name__ == '__main__':
    print("*" * 50)
    print("Arrancando el tren del desvergue....")
    print("*" * 50)
    print("*" * 50)
    print("Arrancando el tren del desvergue....")
    print("*" * 50)
    solution = Solution(HORAS, materias)
    solution.printer()
    solution.getGlobalFitness()
    while solution.getGlobalFitness() !=0:
        solution.selection()
    solution.printer()
