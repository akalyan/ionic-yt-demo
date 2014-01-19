'use strict';

// Declare app level module which depends on filters, and services
angular.module('BlinkApp', 
        ['Centralway.lungo-angular-bridge']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/search', {});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);  
  
angular.module('BlinkApp').
  controller('TestCtrl', function($scope) {
    
    $scope.search = function() {
      
    };
    
  });
  