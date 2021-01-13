(function() {

    'use strict';
 
    var app = angular.module('App', []);
    app.controller('DATA', function($scope, $http) {

        $scope.url_prefix = "https://dashboardfplus.herokuapp.com/";

        $scope.auth = function(login, password) {
            
            //$scope.debug += login + "/" + password + "\r\n";
            var settings_auth = {
				"url": $scope.url_prefix + "https://cloudfort.izumfin.com/api/auth",
				"method": "POST",
				"timeout": 0,
				"headers": {
					"Content-Type": "application/json"
				},
				"data": JSON.stringify({"request":{"login":login,"password":password}}),
			};

			$.ajax(settings_auth).done(function (response) {
                console.log(response);
                $scope.debug += response.response.sessionID + "\r\n";
                $scope.$apply();
            });


            var settings = {
                url: "https://httpbin.org/post", //$scope.url_prefix + "https://cloudfort.izumfin.com/api/auth",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                "data": JSON.stringify({"request":{"login":login,"password":password}}),
              };
              
              $http(settings)
              .then(result => {
                  console.log(result.data);
                  $scope.debug += result.data.origin + "\r\n";
              })
              .catch(error => {
                $scope.debug += error + "\r\n";
                  console.log('error', error);
              });
        }

        $scope.comissions_0 = "PREPARING5";
        $scope.debug = "";
        $scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
        $scope.debug += "00000000000000000000000000000000000000000000000000000000000000000\r\n";
         
    });
})();
