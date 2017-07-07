angular.module('userAuthApp').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'public/partials/home.html',
        controller:'userAuthCtrl'
    }).when('/signup', {
        templateUrl: 'public/partials/signup.html'
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
