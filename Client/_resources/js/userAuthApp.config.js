angular.module('userAuthApp')
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/login', {
        templateUrl: 'partials/login.html'
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html'
      });

    $locationProvider.html5mode(true);

  }]);
