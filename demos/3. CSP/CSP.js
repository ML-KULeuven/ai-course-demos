import { FAILURE } from './constants.js';

export default class CSP {
    // Solves a constraint satisfaction problem.
    // `csp` is an object that should have the properties:
    //    `variables`  : object that holds variable names and their domain.
    //    `constraints`: list of constraints where each element is an 
    //                   array of [head node, tail node, constraint function]
    //    `cb`: callback function for visualizing assignments. It is passed in
    //          an "assigned" object, an "unassigned" object, and `csp`.
    //    `timeStep`: milliseconds between invocations of `cb`.
    solve(csp) {
        csp.timeStep = csp.timeStep;

        let result = backtrack({}, csp.variables, csp, this.stepCounter);

        if (result == FAILURE) { 
            return result; 
        }

        // Unwrap values from array containers.
        for (let key in result) {
            result[key] = result[key][0];
        }

        return result;

        function backtrack(_assigned, unassigned, csp, stepCounter) {
            // Backtracking search.
            // Copying assigned in necessary because we modify it. Without copying
            // the object over, modifying assigned would also change values for old
            // assigned objects (which are used in callbacks).

            let assigned = {};
            for (let key in _assigned) { 
                assigned[key] = _assigned[key]; 
            }

            if (finished(unassigned)) { 
                return assigned; 
            } // Base case.

            let nextKey = selectUnassignedVariable(unassigned);

            let values = orderValues(nextKey, assigned, unassigned, csp);

            delete unassigned[nextKey];
          
            for (let i = 0; i < values.length; i++) {
                stepCounter++;
                assigned[nextKey] = [values[i]]; // Assign a value to a variable.
                let consistent = enforceConsistency(assigned, unassigned, csp);
                let newUnassigned = {}, newAssigned = {};

                for (let key in consistent) {
                    if (assigned[key]) { newAssigned[key] = assigned[key].slice(); }
                    else { newUnassigned[key] = consistent[key].slice(); }
                }

                if (csp.cb) {
                    setTimeout(
                        // Need a closure to fix values of newAssigned and newUnassigned.
                        // Otherwise, _every_ call of the callback takes the on values of the last iteration.
                        (function (newAssigned, newUnassigned) {
                            return function () { 
                                csp.cb(newAssigned, newUnassigned, csp); 
                            };
                        })(newAssigned, newUnassigned),
                        stepCounter * csp.timeStep
                    );
                }

                if (anyEmpty(consistent)) { 
                    continue; 
                } // Empty domains means failure.

                console.log(csp.cb);
                let result = backtrack(newAssigned, newUnassigned, csp);

                if (result != FAILURE) { 
                    return result; 
                }
            }
          
            return FAILURE;
        }
    
        function finished(unassigned) {
            // Checks if there are no more variables to assign.
            return Object.keys(unassigned).length == 0;
        }
    
        function anyEmpty(consistent) {
            // Checks if any variable's domain is empty.
            for (let key in consistent) {
              if (consistent[key].length == 0) { return true; }
            }
            return false;
        }
        
        function partialAssignment(assigned, unassigned) {
            // Combine unassigned and assigned for use in enforceConsistency.
            let partial = {};
            for (let key in unassigned) { partial[key] = unassigned[key].slice(); }
            for (let key in assigned) { partial[key] = assigned[key].slice(); }
            return partial;
        }
    
        function enforceConsistency(assigned, unassigned, csp) {
            // Enforces arc consistency by removing inconsistent values from
            // every constraint's tail node.
          
            function removeInconsistentValues(head, tail, constraint, variables) {
                // Removes inconsistent values from the tail node. A value is
                // inconsistent when if the `tail` is assigned that value, there are
                // no values in `head`'s domain that satisfies the constraint.
                let hv = variables[head], tv = variables[tail];
                let validTailValues = tv.filter(function (t) {
                    return hv.some(function (h) {
                    return constraint(h, t);
                    });
                });
                let removed = tv.length != validTailValues.length;
                variables[tail] = validTailValues;
                return removed;
            }
          
            function incomingConstraints(node) {
                // Returns all the constraints where `node` is the head node.
                return csp.constraints.filter(function (c) {
                    return c[0] == node;
                });
            }
            
            let queue = csp.constraints.slice(), 
                variables = partialAssignment(assigned, unassigned);
            while (queue.length) { // While there are more constraints to test.
                let c = queue.shift(), head = c[0], tail = c[1], constraint = c[2];
                if (removeInconsistentValues(head, tail, constraint, variables)) {
                    // If values from the tail have been removed, incoming constraints
                    // to the tail must be rechecked.
                    queue = queue.concat(incomingConstraints(tail));
                }
            }
            return variables;
        }
    
        function selectUnassignedVariable(unassigned) {
            // Picks the next variable to assign according to the Minimum
            // Remaining Values heuristic. Pick the variable with the fewest
            // values remaining in its domain. This helps identify domain
            // failures earlier.
            let minKey = null, minLen = Number.POSITIVE_INFINITY;
            for (let key in unassigned) {
                let len = unassigned[key].length;
                if (len < minLen) { minKey = key, minLen = len; }
            }
            return minKey;
        }
    
        function orderValues(nextKey, assigned, unassigned, csp) {
            // Orders the values of an unassigned variable according to the
            // Least Constraining Values heuristic. Perform arc consistency
            // on each possible value, and order variables according to the
            // how many values were eliminated from all the domains (fewest
            // eliminated in the front). This helps makes success more likely
            // by keeping future options open.
            
            function countValues(vars) {
                let sum = 0;
                for (let key in vars) { 
                    sum += vars[key].length; 
                }
                return sum;
            }
          
            function valuesEliminated(val) {
                assigned[nextKey] = [val];
                let newLength = countValues(enforceConsistency(assigned, unassigned, csp));
                delete assigned[nextKey];
                return newLength;
            }
          
            // Cache valuesEliminated to be used in sort.
            let cache = {};
            let values = unassigned[nextKey];            

            values.forEach(function(val) {
                cache[val] = valuesEliminated(val);
            });
    
            // Descending order based on the number of domain values remaining.
            values.sort(function (a, b) { 
                return cache[b] - cache[a]; 
            });

            return values;
        }
    }
}