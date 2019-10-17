"""
@author miguelCabrera1001 | 
@date 9/10/19
@project 
@name chromesome
"""


class Chromosome(object):
    def __init__(self, horas, materia_id, horario_materia_id, name, horas_semana, profesores_candidatos):
        self.fitness = 100
        self.genes = horas
        self.materia_id = materia_id
        self.name = name
        self.horas_semana = horas_semana
        self.profesores_candidatos = profesores_candidatos
        self.horario_materia_id = horario_materia_id

    def getGenes(self):
        return list(map(str, self.genes))

    def calculateFitness(self):
        self.fitness = 0.0
        empalme_dias = 0
        horario = set()
        for x in self.genes:
            if x in horario:
                empalme_dias += 1
            else:
                horario.add(x)
        self.fitness = empalme_dias
        return self.fitness

    def getFitness(self):
        return self.fitness

    def __str__(self):
        return "{}".format(self.getGenes())

    def hasEmpalmes(self, population):
        p = []
        total = 0
        for d in population:
            p += d.genes
        for g in self.genes:
            if g in p:
                total += 1
        total += self.calculateFitness()
        print("*********************----->>>", total)
        return total

    def serializer(self):
        return {
            'fitness': self.fitness,
            'genes': self.genes,
            'materia_id': self.materia_id,
            'name': self.name,
            'horas_semana': self.horas_semana,
            'profesores_candidatos': [],
            'horario_materia_id': self.horario_materia_id,
        }
