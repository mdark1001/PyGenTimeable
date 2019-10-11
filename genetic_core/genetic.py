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


def getBestChromosome(fitness, sizeTarget, fitnessTarget, genSet, show):
    random.seed()
    solution = Solution(genSet)
    bestParent = solution.generate_parent(sizeTarget)
    # # show(solution.getBestParent())
    #  if bestParent.Fitness >= fitnessTarget:
    #      return bestParent
    #  while True:
    #      children = _mutar(parent=bestParent, genSet=genSet, fitness=fitness)
    #      if bestParent.Fitness >= children.Fitness:
    #          continue
    #      show(children)
    #      if children.Fitness >= fitnessTarget:
    #          return children
    #      bestParent = children


class Solution(object):
    """
        Solution as Class-Object
    """

    def __init__(self, genSet):
        self.genSet = genSet
        self.childrens = []

    def generate_parent(self, size, ref):
        """
        :param size:
        :return: Chromosome Object
        """

        genes = []
        while len(genes) < size:
            # sizeMuestral = min(size - len(genes), len(self.genSet))
            dia = random.randint(0, 6)
            hora = random.sample(self.genSet, 1)
            genes.append((dia, hora))
            # genes.extend(random.sample(self.genSet, sizeMuestral))
        parent = Chromosome(genes, ref)
        parent.calculateFitness()
        self.childrens.append(parent)
        return parent

    def mutate(self, index_parent):
        """
        :param parent:
        :param genSet:
        :param fitness:
        :return:
        """
        parent = self.childrens[index_parent]
        index = random.randrange(0, len(parent.genes))
        genChildren = list(parent.genes)
        newGen, pivot = random.sample(self.genSet, 2)
        genChildren[index] = pivot if newGen == genChildren[index] else newGen
        genes = genChildren
        children = Chromosome(genes)
        children.calculateFitness()
        return children

    def initTable(self, fuc):
        fuc()

    def getGlobalFitness(self):
        return sum()

    def getChildrens(self):
        return self.childrens

    def printer(self):
        map(lambda children: print("{}".format(children.getGenes())), self.childrens)
