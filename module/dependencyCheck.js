const schema = require('../utils/validator');
const toposort = require('toposort')


const logic = (input) => {

    //validate input json
    let { error } = schema.validate(input); 
    let task = input.task;

    if (error) 
       throw new Error(error);
    
    //create input for Topological sort algo. (toposort)
    //also creats a map containing task as keys and their state as value
    let {taskDependencyArr, taskStateMap} = createInputs(input);
    let taskIndex, taskDependencyArr_copy, isPrevTaskPending = false;

    try{
        taskDependencyArr_copy = taskDependencyArr;
        
        //sorted array received
        taskDependencyArr = toposort(taskDependencyArr);

        //If sorted array does not contain task 
        // throw error
        if( !(taskDependencyArr.includes(task))  )  
            throw new Error('Invalid task!');
        
        //get the position(index) of task in the sorted array
        taskIndex = taskDependencyArr.indexOf(task);
        
        // if its the last element then return true
        if(taskIndex === taskDependencyArr.length-1){
            return true;
        } else {
            // I could have used the sorted array to iterate further
            // by incrementing the position(index) by 1
            // and then looping through, but the problem is that the 
            // Topological sort is a linear sort it would give output
            // [0,1,3,2] if 1 and 3 are dependent on 2

            //taskDependencyArr_copy looks like
            //[ [ 0, 1 ], [ 1, 2 ], [ 3, 2 ] ]
            for(let i = 0; i < taskDependencyArr_copy.length; i++){

                if(task === taskDependencyArr_copy[i][0] && 
                    'completed' !== taskStateMap.get(taskDependencyArr_copy[i][1]) ){
                        isPrevTaskPending = true;
                }
            }

            if(isPrevTaskPending)
                return false;
            else
                return true;
        }

    } catch(err){
        //Throws error received during Topological sort
        //Error: Cyclic dependency
       throw new Error(err);
    }


}

const createInputs = (input) => {
    let taskDependency = input.dependencyGraph.tasks;
    let taskState = input.currentState.tasks;
    let outerIndex = innnerIndex = 0;
    let tempArr = taskDependencyArr = [];
    let taskStateMap = new Map();

    while(outerIndex < taskDependency.length ){
        
        innnerIndex = 0;
        //Iterate tasks dependency 

        while(innnerIndex < taskDependency[outerIndex].dependency.length){
            tempArr = [];
            tempArr.push(outerIndex);
            tempArr.push(taskDependency[outerIndex].dependency[innnerIndex]);

            taskDependencyArr.push(tempArr); // Input for toposort
            innnerIndex++;
        }

        //Creating map with key as task and value as its status
        taskStateMap.set(outerIndex, taskState[outerIndex].status);

        outerIndex++;
    }
    return {taskDependencyArr, taskStateMap};
}


const dependencyCheck = (body) => {
    
    return logic(body);
}

module.exports = dependencyCheck;