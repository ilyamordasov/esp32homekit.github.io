(function() {

    'use strict';
 

    var app = angular.module('App', []);
    app.controller('DATA', function($scope, $sce, $http) {
        $scope.commission = 12345;
    });
})();
