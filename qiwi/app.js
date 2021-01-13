(function() {

    'use strict';
 
    var app = angular.module('App', []);
    app.controller('DATA', function($scope, $http) {

        $scope.url_prefix = "https://dashboardfplus.herokuapp.com/";

        $scope.auth = function(login, password) {
            
            //$scope.debug += login + "/" + password + "\r\n";
            // var settings = {
            //     url: "https://httpbin.org/post", //$scope.url_prefix + "https://cloudfort.izumfin.com/api/auth",
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     data: {request:{login:login,password:password}},
            //   };
              
            //   $http.post("https://httpbin.org/post", data, settings)
            //   .then(result => {
            //       console.log(result.data);
            //       $scope.debug += result.data.origin + "\r\n";
            //   })
            //   .catch(error => {
            //     $scope.debug += error + "\r\n";
            //       console.log('error', error);
            //   });
            var settings_auth = {
				"url": "https://httpbin.org/post",
				"method": "POST",
				"timeout": 0,
				"headers": {
					"Content-Type": "application/json"
				},
				"data": JSON.stringify({"request":{"login":"dashboard_gar","password":"JJjhs7eejw"}}),
			};

			$.ajax(settings_auth).done(function (response) {
                console.log(response.origin);
                $scope.debug += JSON.stringify(response) + "\r\n";
                $scope.$apply();
            });
        }

        $scope.comissions_0 = "PREPARING4";
        $scope.debug = "";
        $scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
        $scope.debug += "00000000000000000000000000000000000000000000000000000000000000000\r\n";
         
    });
})();
