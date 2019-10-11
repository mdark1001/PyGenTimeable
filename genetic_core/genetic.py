"""
@author miguelCabrera1001 | 
@date 9/10/19
@project 
@name gentic
"""
from .chromesome import Chromosome
import datetime
import random
import statistics
import sys
import time

DIAS = [0, 1, 2, 3, 4, 5]


class Solution(object):
    """
        Solution as Class-Object
    """

    def __init__(self, genSet, materias):
        self.genSet = genSet
        print("********************************************")
        print("********************************************")
        self.fitness = 0
        self.childrens = []
        for materia in materias:
            self.generate_parent(materia['horas_semana'], materia)

    def generate_parent(self, size, materia):
        """
        :param size:
        :return: Chromosome Object
        """

        genes = []
        while len(genes) < size:
            sizeMuestral = min(size - len(genes), len(self.genSet))
            genes.extend(random.sample(self.genSet, sizeMuestral))

        parent = Chromosome(genes, materia['materia_id'],
                            materia['horario_materia_id'],
                            materia['name'],
                            materia['horas_semana'],
                            materia['profesores_candidatos']
                            )
        parent.calculateFitness()
        self.childrens.append(parent)
        return parent

    def mutate(self, parent):
        """
        :param parent:
        :param genSet:
        :param fitness:
        :return:
        """
        index = random.randrange(0, len(parent.genes))
        genChildren = list(parent.genes)
        for x in range(5):
            newGen, pivot = random.sample(self.genSet, 2)
            genChildren[index] = pivot if newGen == genChildren[index] else newGen
        genes = genChildren
        children = Chromosome(horas=genes,
                              materia_id=parent.materia_id,
                              horario_materia_id=parent.horario_materia_id,
                              name=parent.name,
                              horas_semana=parent.horas_semana,
                              profesores_candidatos=parent.profesores_candidatos,
                              )
        children.calculateFitness()
        parent.calculateFitness()
        return children

    def selection(self):
        random.seed()
        for index, children in enumerate(self.childrens):
            bestParent = children
            children2 = self.mutate(bestParent)
            # print(bestParent.fitness, children.fitness)
            if bestParent.fitness < children2.fitness:
                continue
            elif bestParent.fitness == children2.fitness:
                # Selección por sorteo
                children2 = children2 if random.randint(1, 10) % 2 == 0 else bestParent
                self.childrens[index] = children2
            else:
                self.childrens[index] = bestParent
        self.printer()
        self.getGlobalFitness()

    def initTable(self, fuc):
        fuc()

    def getFitnessIndividual(self):
        return [x.calculateFitness() for x in self.childrens]

    def getFintnessGrupal(self):
        uids = set()
        empales = 0
        for x in self.childrens:
            for t in x.getGenes():
                if t in uids:
                    empales += 1
                else:
                    uids.add(t)

        return empales

    def getGlobalFitness(self):
        self.fitness = self.getFintnessGrupal()
        return self.fitness

    def getChildrens(self):
        return self.childrens

    def printer(self):
        for x in self.childrens:
            print("{} --- {}".format(x.getGenes(), x.fitness))
        print("*" * 50, self.fitness)
