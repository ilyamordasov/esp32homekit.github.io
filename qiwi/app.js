(function() {

    'use strict';
 
    var app = angular.module('App', []);
    app.controller('DATA', function($scope, $sce, $http) {

        $scope.url_prefix = "https://dashboardfplus.herokuapp.com/";

        $scope.auth = function(login, password) {
            
            $scope.debug += login + "/" + password + "\r\n";
            var settings = {
                url: "https://httpbin.org/post", //$scope.url_prefix + "https://cloudfort.izumfin.com/api/auth",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                data: {request:{login:login,password:password}},
              };
              
              $http(settings)
              .then(response => response.data.response)
              .then(result => {
                  console.log(result);
                  $scope.debug += result + "\r\n";
              })
              .catch(error => console.log('error', error));
        }

        $scope.comissions_0 = "PREPARING";
        $scope.debug = "";
        $scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
        $scope.debug += "00000000000000000000000000000000000000000000000000000000000000000\r\n";
         
    });
})();
