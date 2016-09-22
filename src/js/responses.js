var app = angular.module("stem-survey", []);
var socket = io();

app.controller("responsesTableCtrl", function($scope, $http){
    var vm = this;
    var options = [];

    $http.get("/api/options")
        .then(function(res){options = res.data.options;},
              function(){vm.msg = "Error loading options"; });

    $http.get("/api/responses")
        .then(function success(res){vm.rows = res.data;},
              function error(){vm.msg = "Error loading responses";});

    socket.on("response", function(data){
        $scope.$apply(function(){
            console.dir(options);
            var choice = options.filter(
                function(opt){return opt.id == data.choice;})[0];

            data.name = choice.name;
            data.description = choice.description;

            vm.rows.unshift(data);
        });
    });
});