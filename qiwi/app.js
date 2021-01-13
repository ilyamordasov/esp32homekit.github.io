(function() {

    'use strict';

    jQuery(document).bind('keyup', function(e) {
            
        if(e.which == 39){
            $('.carousel').carousel('next');
        }
        else if(e.which == 37){
            $('.carousel').carousel('prev');
        }
    
    });

    $('#dashboard').bind('slid.bs.carousel', function (e) {
        var currentIndex = $('div.active').index() + 1;
        if (currentIndex === 1 || currentIndex === 2) { document.title = "Цифровые банковские гарантии"; }
        else if (currentIndex === 3 || currentIndex === 4) { document.title = "Факторинг ПЛЮС"; }
    });
 

    var app = angular.module('App', []);
    app.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    app.controller('DATA', function($scope, $sce, $http) {

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

        $scope.comissions_0 = "";
        $scope.debug = "";
        $scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
        $scope.debug += "00000000000000000000000000000000000000000000000000000000000000000\r\n";
         
    });
})();
