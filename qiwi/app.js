(function() {

    'use strict';
 
    var app = angular.module('App', []);
    app.controller('DATA', function($scope, $http) {

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

              var data = $.param({
                fName: "111",
                lName: "2222"
            });
        
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
              
              $http.post("https://httpbin.org/post", data, config)
              .success(result => {
                  console.log(result.data);
                  $scope.debug += result.data.origin + "\r\n";
              })
              .error(error => {
                $scope.debug += error + "\r\n";
                  console.log('error', error);
              });
        }

        $scope.comissions_0 = "PREPARING1";
        $scope.debug = "";
        $scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
        $scope.debug += "00000000000000000000000000000000000000000000000000000000000000000\r\n";
         
    });
})();
