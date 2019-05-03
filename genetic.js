const { GenAlgo, lesser, tournament3Single, tournament3Pair } = require("genalgo");

var utils = require('./main.js')


var findGeneticBestOrder = function(problem) {
    utils.storeInterest(problem.orders);

    var seed = utils.solve_problem_dumb(problem);
    console.log(seed.orders)
    // Create a GenAlgo object with simple parameters
    /*const algo = new GenAlgo({
        mutationProbability: 0.2,
        crossoverProbability: 0.8,
        iterationNumber: 100
    });*/
}

let myProblem = problems.problem1;

findGeneticBestOrder(myProblem);