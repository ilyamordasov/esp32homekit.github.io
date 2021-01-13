(function() {

    'use strict';
 
    var app = angular.module('App', []);
    app.controller('DATA', function($scope, $http) {

        $scope.url_prefix = "https://dashboardfplus.herokuapp.com/";

        $scope.auth = function(login, password) {
            $scope.comissions_0 = "READY";
            var settings = {
                url: $scope.url_prefix + "https://cloudfort.izumfin.com/api/auth",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                data: {request:{login:login,password:password}},
              };
              
              $http(settings)
              .then(response => response.data.response)
              .then(result => {
                  $scope.debug += result.sessionID + "\r\n";
                  if (login === "dashboard_gar") { $scope.sessionID_BG = result.sessionID; $scope.updateData_BG(); }
                  else if (login === "dashboard") { $scope.sessionID_FC = result.sessionID; $scope.updateData_FC();}
              })
              .catch(error => console.log('error', error));
        }

        $scope.comissions_0 = "PREPARING2";
        $scope.debug = "";
        //$scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
        $scope.debug += "00000000000000000000000000000000000000000000000000000000000000000\r\n";
         
    });
})();
