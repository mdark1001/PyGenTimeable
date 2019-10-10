"""
@author miguelCabrera1001 | 
@date 9/10/19
@project 
@name chromesome
"""


class Chromosome(object):
    def __init__(self, genes, ref, fitness=None):
        self.genes = genes
        self.fitness = fitness
        self.materia_horario = ref

    def getGenes(self):
        return list(map(str, self.genes))

    def calculateFitness(self):
        self.fitness = 0.0

    def __str__(self):
        return "{}".format(self.getGenes())
