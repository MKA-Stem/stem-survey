var app = angular.module("stem-survey", []);

app.controller("formCtrl", function($scope, $http) {
    $scope.loading = false;
    $scope.error = false;
    
    var updatePlaceholder = function(){
        if($scope.firstname && $scope.lastname){
            $scope.emailPlaceholder =
                `${$scope.firstname.substring(0, 1).toLowerCase()}${$scope.lastname.toLowerCase()}2020@mka.org`;
        } else {
            $scope.emailPlaceholder = "";
        }
    };

    $scope.$watch("firstname", updatePlaceholder);
    $scope.$watch("lastname", updatePlaceholder);


    $scope.submit = function(){
        var body = {
            firstname: $scope.firstname,
            lastname: $scope.lastname,
            email: $scope.email || undefined
        };

        $http.post("api/respond", body)
        .then(function success(){$scope.loading = false;},
              function error(){$scope.loading = false; $scope.error = true;});

        $scope.loading = true;
    };
});