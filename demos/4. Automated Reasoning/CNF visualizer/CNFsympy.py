from sympy import * 

def CNFstep1(expression):
    # Step 1: Eliminate implications
    # A >> B is equivalent to ~A | B
    return implication_elimination(expression)

def CNFstep2(expression):
    # Step 2: Move negations inwards
    return negation_inwards(expression) 

def CNFstep3(expression):
    # Step 3: Distribute ORs over ANDs
    return distribute(expression)

def CNFstep4(expression):
    # Step 4: Convert to CNF
    return to_cnf(expression)

def implication_elimination(expression):
    if expression.is_Implies:
        antecedent, consequent = expression.args
        return Or(Not(antecedent), consequent)
    else:
        return expression  
    
def negation_inwards(expression):
    if expression.is_Not:
        if expression.args[0].is_Or:
            return And(negation_inwards(~expression.args[0].args[0]), negation_inwards(~expression.args[0].args[1]))
        elif expression.args[0].is_And:
            return Or(negation_inwards(~expression.args[0].args[0]), negation_inwards(~expression.args[0].args[1]))
        elif expression.args[0].is_Not:
            return negation_inwards(expression.args[0].args[0])
        else:
            return expression
    elif expression.is_Or:
        return Or(negation_inwards(expression.args[0]), negation_inwards(expression.args[1]))
    elif expression.is_And:
        return And(negation_inwards(expression.args[0]), negation_inwards(expression.args[1]))
    else:
        return expression

def distribute(expression):
    if expression.is_Or:
        if expression.args[0].is_And:
            return And(distribute(Or(expression.args[0].args[0], expression.args[1])), distribute(Or(expression.args[0].args[1], expression.args[1])))
        elif expression.args[1].is_And:
            return And(distribute(Or(expression.args[0], expression.args[1].args[0])), distribute(Or(expression.args[0], expression.args[1].args[1])))
        else:
            return expression
    elif expression.is_And:
        return And(distribute(expression.args[0]), distribute(expression.args[1]))
    else:
        return expression
    
def to_cnf(expression):
    if expression.is_Or:
        return Or(to_cnf(expression.args[0]), to_cnf(expression.args[1]))
    elif expression.is_And:
        return And(to_cnf(expression.args[0]), to_cnf(expression.args[1]))
    else:
        return expression


def main():
    strings = []
    strings.append("~(A & B) | (D >> C)")
    strings.append("(A | ~(B) | F) >> (C >> A)")
    strings.append("(A | A) | (C >> A)")
    strings.append("~(A & B) | (D >> C) | (A & B) | (C >> A) | (A | A) | (C >> A)") 
    strings.append("~(A & B)")
    expressions = []
    steps = []
    A, B, C, D, E, F = symbols('A B C D E F')
    
    for i in range(len(strings)):
        expressions.append(sympify(strings[i]))
        steps.append(CNFstep1(expressions[i]))
        pprint("step 0: ", expressions[i])
        pprint("step 1: ", steps[i])

main()