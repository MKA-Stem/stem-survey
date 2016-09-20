var app = angular.module("stem-survey", []);

app.controller("formCtrl", function($scope, $http) {
    var vm = this;

    vm.loading = false;
    vm.error = false;
    
    var updatePlaceholder = function(){
        if(vm.firstname && vm.lastname && vm.grade){
            var year = (new Date()).getFullYear();
            vm.emailPlaceholder =
                `${vm.firstname.substring(0, 1).toLowerCase()}${vm.lastname.toLowerCase()}${year - vm.grade + 4 + 9}@mka.org`;
        } else {
            vm.emailPlaceholder = "";
        }
    };

    $scope.$watch(function(){ return vm.firstname; }, updatePlaceholder);
    $scope.$watch(function(){ return vm.lastname; }, updatePlaceholder);
    $scope.$watch(function(){ return vm.grade; }, updatePlaceholder);


    vm.submit = function(){
        var body = {
            firstname: vm.firstname,
            lastname: vm.lastname,
            grade: vm.grade,
            email: vm.email || undefined,
            choice: vm.choice
        };

        $http.post("api/respond", body)
        .then(function success(){vm.loading = false;},
              function error(){vm.loading = false; vm.error = true;});

        vm.loading = true;
    };


    $http.get("api/options")
    .then(function success(res){console.log(res.data.options); vm.options = res.data.options; },
          function fail(){alert("There was an error!"); });
});