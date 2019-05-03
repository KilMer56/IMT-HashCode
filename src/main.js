var _ = require('lodash');

var helpers = require('./helpers.js')

const USERNAME = "JE_DOIS_METTRE_MON_PRENOM";
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
    }
};

var solve_problem_dumb = function (problem) {
    var solution = {
        problem_id: problem.problem_id,
        username: USERNAME,
        orders: []
    };

    var pos = POSITION_ORIGINE;

    while(problem.orders.length > 0) {
        console.log(problem.orders.length);
        // On prend la commande la plus proche et on l'ajoute au trajet du livreur
        var order = findClosestOrder(problem.orders, pos);
        solution.orders.push(order.order_id);

        // On garde en mémoire la nouvelle position du livreur
        pos.lat = order.pos_lat;
        pos.lng = order.pos_lng;

        // On retire la commande qui vient d'être réalisé
        problem.orders.splice(problem.orders.indexOf(order), 1);
    }
    return solution;
};

var findClosestOrder = function (orders, pos) {
    orders = orders.sort(function (orderA, orderB) {
        return helpers.compute_dist(orderA.pos_lat, orderA.pos_lng, pos.lat, pos.lng) <= helpers.compute_dist(orderB.pos_lat, orderB.pos_lng, pos.lat, pos.lng)
    });
    return orders[orders.length-1];
}

var solution = solve_problem_dumb(problems.problem3);
helpers.send_solution(solution);
