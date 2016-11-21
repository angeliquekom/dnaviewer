'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngAria',
  'ngAnimate',
  'ngMaterial',
  'ngRoute',
  'ngMessages',
  'myApp.constants',
  'myApp.service',
  'myApp.table',
  'myApp.main'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/main'});
}]);
