"""
@author miguelCabrera1001 | 
@date 9/10/19
@project 
@name main
"""
from PyGenTimeable.gentic_core.gentic import Solution

DIAS = [1, 2, 3, 4, 5]
TOTAL_HORAS = 8
HORAS = []


def setHorasExample():
    index = 0
    global HORAS
    for dia in DIAS:
        for hora in range(TOTAL_HORAS):
            HORAS.append(index)
            index += 1


if __name__ == '__main__':
    print("*" * 50)
    print("Arrancando el tren del desvergue....")
    print("*" * 50)
    setHorasExample()
    solution = Solution(HORAS)


