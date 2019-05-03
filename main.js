var _ = require('lodash');

var helpers = require('./helpers.js')


const USERNAME = "SEBASTIEN_KILLIAN";

const POSITION_ORIGINE = {
    lat: 0.5,
    lng: 0.5
};

var problems = {
    // 1000 commandes
    problem1: {
        problem_id: 'problem1',
        orders: helpers.parseCsv('problem1.csv')
    },
    // 3000 commandes
    problem2: {
        problem_id: 'problem2',
        orders: helpers.parseCsv('problem2.csv')
    },
    // 3500 commandes un peu spéciales
    problem3: {
        problem_id: 'problem3',
        orders: helpers.parseCsv('problem3.csv')
    },
    problem4: {
        problem_id: 'problem4',
        orders: helpers.parseCsv('problem4.csv')
    }
};

let matrix = [[]];
let visitedTab = [];

let coefDist = 1.396;

var solve_problem_dumb = function (problem) {
    var solution = {
        problem_id: problem.problem_id,
        username: USERNAME,
        orders: []
    };

    var pos = POSITION_ORIGINE;

    var currentOrder = findStarter(problem.orders, pos);
    visitedTab.push(currentOrder)

    solution.orders.push(currentOrder);

    for(let i=1;i<problem.orders.length;i++) {
        // On prend la commande la plus proche et on l'ajoute au trajet du livreur
        //var order = findClosestOrder(problem.orders, pos);
        var order = findBetterOrder(problem.orders, currentOrder, i);
        currentOrder = order.order_id;

        solution.orders.push(order.order_id);

        // On garde en mémoire la nouvelle position du livreur
        //pos.lat = order.pos_lat;
        //pos.lng = order.pos_lng;

        // On retire la commande qui vient d'être réalisé
        //problem.orders.splice(problem.orders.indexOf(order), 1);
    }
    return solution;
};

var findClosestOrder = function (orders, pos) {
    orders = orders.sort(function (orderA, orderB) {
        return helpers.compute_dist(orderA.pos_lat, orderA.pos_lng, pos.lat, pos.lng) <= helpers.compute_dist(orderB.pos_lat, orderB.pos_lng, pos.lat, pos.lng)
    });
    return orders[orders.length-1];
}

var initMatrix = function(length) {
    for(var i=0; i<length; i++) {
        matrix[i] = new Array(length);
    }
}
var storeInterest = function(orders) {
    initMatrix(orders.length)

    for(let i = 0;i<orders.length-1;i++){
        for(let j = i+1;j<orders.length;j++){
            let distance = helpers.compute_dist(orders[i].pos_lat,orders[i].pos_lng,orders[j].pos_lat,orders[j].pos_lng);

            matrix[orders[i].order_id][orders[j].order_id] = distance;
            matrix[orders[j].order_id][orders[i].order_id] = distance;
        }
    }
}

var findStarter = function(orders, pos) {
    let max = -10000000;
    let index = 0;

    for(let i = 0;i<orders.length;i++){
        let distance = helpers.compute_dist(orders[i].pos_lat,orders[i].pos_lng,pos.lat,pos.lng);
        let value = orders[i].amount-distance*coefDist;

        if(value > max){
            max = value;
            index = i;
        }
    }

    return index;
}

var findBetterOrder = function(orders, idOrder, tourBoucle) {
    let possibilities = matrix[idOrder];
    let max = -10000000;
    let ord = null;
    let index = 0;

    for(let i=0;i<matrix.length;i++){
        let bonus = orders[i].amount-tourBoucle > 0 ? orders[i].amount-tourBoucle : 0 ;
        let value = bonus-possibilities[i]*coefDist;

        if(value > max && !visitedTab.includes(i)) {
            max = value;
            ord = orders[i];
            index = i;
        }
    }

    visitedTab.push(index);

    return ord;
}

let myProblem = problems.problem1;

storeInterest(myProblem.orders);
var solution = solve_problem_dumb(myProblem);
helpers.send_solution(solution);

