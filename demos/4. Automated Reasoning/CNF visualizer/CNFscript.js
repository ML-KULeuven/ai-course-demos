let currentStep = 0;
let selectedClause;

const clauses = [
    "¬(A ∧ B) ∨ (D → C)",
    "(A ∨ ¬B ∨ C) ↔ (D → E)",
    "¬(A ↔ B) ∨ (D ∧ ¬E) ∧ (F ∧ E)",
    "(¬(A ∧ B) → ¬(C ∨ D)) → (E ∧ F)"
    // Add more clauses here if needed
];

function initialize() {
    const clauseSelect = document.getElementById("clauseSelect");
    selectedClause = clauses[clauseSelect.selectedIndex];
    document.getElementById("clauseSelect").disabled = true;
    document.getElementById("currentFormula").textContent = selectedClause;
    document.getElementById("nextStepButton").removeAttribute("onclick");
    document.getElementById("nextStepButton").addEventListener("click", nextStep);
}

function nextStep() {
    if (currentStep < steps.length) {
        const currentFormulaSpan = document.getElementById("currentFormula");
        const explanationDiv = document.getElementById("explanation");

        const currentFormula = currentFormulaSpan.innerText;
        const nextFormula = steps[currentStep].transform(currentFormula);

        explanationDiv.innerHTML += `<p><strong>Step ${currentStep + 1}:</strong> ${steps[currentStep].explanation}</p>`;
        explanationDiv.innerHTML += `<p><strong>Transformed Formula:</strong> ${nextFormula}</p>`;

        currentFormulaSpan.innerText = nextFormula;

        currentStep++;
    } 
    else {alert("CNF conversion completed!");}
}

// Steps of the CNF conversion algorithm
const steps = [
    {
        explanation: "Eliminate material implication and logical biconditionals.",
        transform: formula => {
            // Eliminate material implication (p → q) => (¬p ∨ q)
            formula = formula.replace(/([^() ]+)\s*→\s*([^() ]+)/g, "¬$1 ∨ $2");
    
            // Eliminate logical biconditional (p ↔ q) => ((p → q) ∧ (q → p))
            formula = formula.replace(/([^() ]+)\s*↔\s*([^() ]+)/g, "($1 → $2) ∧ ($2 → $1)");
    
            return formula;
        }
    },
    {
        explanation: "Move ¬ inwards using De Morgan's laws.",
        transform: formula => {
            // Move ¬ inwards using De Morgan's laws
            return formula.replace(/¬\((.*?)\)/g, (match, group) => {
                // Apply De Morgan's law: ¬(p ∧ q) => (¬p ∨ ¬q) and ¬(p ∨ q) => (¬p ∧ ¬q)
                return group.replace(/(¬?[^∨∧→↔()\s]+)/g, "¬$1").replace(/¬¬/g, "");
            });
        }
    },
    {
        explanation: "Distribute logical OR over logical AND.",
        transform: formula => {
            // Distribute logical OR over logical AND
            return formula.replace(/\((.*?) ∨ (.*?)\)/g, (match, group1, group2) => {
                // Apply distribution: (a ∧ b) ∨ (c ∧ d) => (a ∨ c) ∧ (a ∨ d) ∧ (b ∨ c) ∧ (b ∨ d)
                const terms1 = group1.split("∧");
                const terms2 = group2.split("∧");
                const distributed = [];
                for (let term1 of terms1) {
                    for (let term2 of terms2) {
                        distributed.push(`${term1.trim()} ∨ ${term2.trim()}`);
                    }
                }
                return `(${distributed.join(") ∧ (")})`;
            });
        }
    },
    {
        explanation: "Simplify: for example a ∨ a → a.",
        transform: formula => {
            // Simplify: Remove duplicate terms in disjunction
            return formula.replace(/(.*?) ∨ \1/g, "$1");
        }
    }
];

function distribute(term) {
    if (term.includes("∧")) {
        const parts = term.split("∧");
        const distributed = parts.map(part => `(${part.trim()})`).join(" ∨ ");
        return distributed;
    }
    return term;
}
