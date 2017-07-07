angular.module('userAuthApp')
    .controller('userAuthCtrl', ['$scope', '$location', '$localStorage', function ($scope, $location, $localStorage) {
        $scope.formData = {
            "name": "Rajan",
            "email": "rajan@gmail.com"
        };
}]);
