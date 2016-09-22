var app = angular.module("stem-survey", ["chart.js"]);
var socket = io();

var debug = "no";

app.controller("chartCtrl", function($scope, $http){
    var vm = this;
    var options = [];

    vm.chartOptions = { scales: { yAxes: [{
        display: true,
        ticks: { beginAtZero: true }
    }]}
};
    
    vm.labels = []; // ["coding", "3d printing"]
    vm.data = [[]]; // [12, 30]

    $http.get("/api/options")
        .then(
            function(res){
                vm.labels = [];
                res.data.options.forEach(function(opt){
                    vm.labels[opt.id] = opt.name;
                });
                
            },
            function(){alert("Error loading options"); }
    );

    $http.get("/api/responses")
        .then(
            function success(res){
                res.data.forEach(function(row){
                    vm.data[0][row.choice] = 
                        (vm.data[0][row.choice] || 0) + 1;
                });
            },
            function error(){alert("Error loading responses");}
    );

    socket.on("response", function(data){
        $scope.$apply(function(){
            console.log("UPDATE: ");
            console.dir(data);
            
            vm.data[0][data.choice] = 
                        (vm.data[0][data.choice] || 0) + 1;
        });
    });

    debug = function(){ console.dir(vm); };
});