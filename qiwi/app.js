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

        $scope.plan_ds = {
            "2020":[{"count":1234,"date":"январь","portfolio":1.076209747191E7},{"count":856,"date":"февраль","portfolio":9749297.47191},{"count":2026,"date":"март","portfolio":9593297.47191},{"count":1612,"date":"апрель","portfolio":1.152769747191E7},{"count":1156,"date":"май","portfolio":1.122145747191E7},{"count":1356,"date":"июнь","portfolio":1.284865747191E7},{"count":1600,"date":"июль","portfolio":1.45785720382544E7},{"count":1800,"date":"август","portfolio":1.58546434543944E7},{"count":1960,"date":"сентябрь","portfolio":1.82066434543944E7},{"count":2352,"date":"октябрь","portfolio":2.02317074208544E7},{"count":2822.4,"date":"ноябрь","portfolio":2.36185874208544E7},{"count":3669.12,"date":"декабрь","portfolio":2.80215314208544E7}],
            "2021":[{"count":3397.2602739726,"date":"январь","portfolio":32130752.0262193},{"count":3068.49315068493,"date":"февраль","portfolio":33123894.889312},{"count":3397.2602739726,"date":"март","portfolio":37298911.7916618},{"count":3287.67123287671,"date":"апрель","portfolio":38878645.1590696},{"count":3397.2602739726,"date":"май","portfolio":43120511.8800115},{"count":3287.67123287671,"date":"июнь","portfolio":47258278.2947101},{"count":3397.2602739726,"date":"июль","portfolio":49719612.1517},{"count":3397.2602739726,"date":"август","portfolio":54063765.9278883},{"count":3287.67123287671,"date":"сентябрь","portfolio":58301309.1554151},{"count":3397.2602739726,"date":"октябрь","portfolio":58617524.5873149},{"count":3287.67123287671,"date":"ноябрь","portfolio":62922918.7966849},{"count":3397.2602739726,"date":"декабрь","portfolio":64584902.3583287}]
        };

        $scope.getPercent = function(array, value, key) {
            var max = 0;
            array.forEach(function(item) {
                max = item[key] > max ? item[key] : max;
            });
            return value * 100 / max;
        }

        $scope.url_prefix = "https://dashboardfplus.herokuapp.com/";

        $scope.auth = function(login, password) {
            var settings = {
                //https://dashboardfplus.herokuapp.com/
                url: "https://dashboardfplus.herokuapp.com/https://cloudfort.izumfin.com/api/auth",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                data: {request:{login:login,password:password}},
              };
              
              $http(settings)
              .then(response => response.data.response)
              .then(result => {
                  if (login === "dashboard_gar") { $scope.sessionID_BG = result.sessionID; $scope.updateData_BG(); }
                  else if (login === "dashboard") { $scope.sessionID_FC = result.sessionID; $scope.updateData_FC();}
              })
              .catch(error => console.log('error', error));
        }
          
        $scope.formatDate = function(value) {
              var day = new Date(value);
              var padZero = function(value) {
                return value < 10 ? '0' + value : value;
              }
              return padZero(day.getFullYear()) + "" + padZero(day.getMonth()+1) + "" + padZero(day.getDate())
          }

        $scope.getDataFromSlicedArray = function(array, key) {
            switch (key) {
                case "release_sdelki": return array.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                case "new_clients_sdelki": return array.reduce( ( sum, { new_clients_sdelki } ) => sum + new_clients_sdelki , 0);
                case "sum_sdelki": return array.reduce( ( sum, { sum_sdelki } ) => sum + sum_sdelki , 0);
            }
        }

        $scope.getRestData = function() {
            return new Promise(function(resolve,reject){
                var settings = {
                    "url": "https://dashboardfplus.herokuapp.com/https://my.qiwigarant.com/api/dashboard/requestsrealtime?apiKey=97cd8a7f-063f-4f9c-8641-b972f1653bdc",
                    "method": "GET",
                    "crossdomain": true,
                    "dataType": "json",
                    "headers": {
                        "SessionID": $scope.sessionID_BG,
                        "Content-type": "application/json"
                    }
                };
                $http(settings)
                .then(response => response)
                .then(result => {resolve(result)})
                .catch(error => console.log('error', error));
            });
        }

        $scope.getDataFromAPI = function(end, start) {
            return new Promise(function(resolve,reject){
                
                var settings = {
                    "url": "https://dashboardfplus.herokuapp.com/https://cloudfort.izumfin.com/api/Dashboard/bg/gar_count?date_s="+start+"&date_e="+end,
                    "method": "GET",
                    "crossdomain": true,
                    "dataType": "json",
                    "headers": {
                        "SessionID": $scope.sessionID_BG,
                        "Content-type": "application/json"
                    }
                };
                // console.log(settings.url)
                $http(settings)
                .then(response => response.data.gar_count)
                .then(result => {resolve(result)})
                .catch(error => console.log('error', error));
            });
        }

        $scope.getDataFromAPI_FC = function(method, start, end) {
            return new Promise(function(resolve,reject){
                
                var settings = {
                    "url": "https://dashboardfplus.herokuapp.com/https://cloudfort.izumfin.com/api/Dashboard/fc/" + method + "?date_s=" + start + "&date_e=" + end,
                    "method": "GET",
                    "crossdomain": true,
                    "dataType": "json",
                    "headers": {
                        "SessionID": $scope.sessionID_FC,
                        "Content-type": "application/json"
                    }
                };
                $http(settings)
                .then(response => response.data)
                .then(result => {resolve(result)})
                .catch(error => console.log('error', error));
            });
        }

        $scope.getDataFromMT = function(end, start) {
            return new Promise(function(resolve,reject){
                
                var settings = {
                    "url": "https://dashboardfplus.herokuapp.com/https://multitender.dl.api.qiwigarant.com/api/tendernotice/crm/dashboard?apiKey=9C45BBE8-FA56-4BA6-94A8-47B112CF1BBB&min_sum=1000&max_sum=100000000&date_s="+start+"&date_e="+end,
                    "method": "GET",
                    "crossdomain": true,
                    "dataType": "json",
                    "headers": {
                        "Content-type": "application/json"
                    }
                };
                $http(settings)
                .then(response => response.data)
                .then(result => {resolve(result)})
                .catch(error => console.log('error', error));
            });
        }

        $scope.updateData_BG = function() {
            $scope.plan = [];
            if($scope.plan_ds.hasOwnProperty(new Date().getFullYear()))
            {
                $scope.plan = $scope.plan_ds[new Date().getFullYear()];
            }
            else
            {
                for (var i=0; i<12; i++)
                {

                    $scope.plan.push({"count":0,"date":['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][i],"portfolio":0});
                }
            }

            $scope.getDataFromAPI($scope.formatDate(new Date()), $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate()))) // с сегодня предыдущего года по сегодня
                .then(response => response)
                .then(result => {

                    $scope.comissions[0].value = Math.round(result[0].comission);
                    $scope.comissions[1].value = Math.round(result[1].comission);
                    $scope.comissions[2].value = Math.round(result[7].comission);
                    $scope.comissions[3].value = Math.round(result[result.length-1].comission);
                    $scope.sdelki[0] = {value: result[0].release_sdelki, avg_cheque: (result[0].release_sdelki === 0) ? 0 :result[0].comission/result[0].release_sdelki};
                    $scope.sdelki[1] = {value: result[0].new_clients_sdelki, avg_cheque: (result[0].new_clients_sdelki === 0) ? 0 : result[0].comission_new_clients/result[0].new_clients_sdelki};
                    $scope.$apply();
                });

            $scope.getRestData()
                .then(response => response.data)
                .then(result => {
                    $scope.rest[0].value = result.mrk_req_count;
                    $scope.rest[1].value = result.r_req_count;
                    $scope.$apply();
                });

            $scope.getDataFromAPI($scope.formatDate(new Date()), $scope.formatDate(new Date(new Date().getFullYear(),0,1))) // с 1 января по сегодня
                .then(response => response)
                .then(result => {
                    $scope.portfolio[0].value = result[0].portfolio;
                    $scope.portfolio[0].plan = ($scope.plan[new Date().getMonth()].portfolio === 0) ? 0 : Math.round(100 * $scope.portfolio[0].value / ($scope.plan[new Date().getMonth()].portfolio * 1000));
                    $scope.$apply();
                    
                    var tmp = $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate())); // год назад
                    $scope.getDataFromAPI(tmp, tmp)
                        .then(response => response)
                        .then(res => {
                            $scope.portfolio[0].year = Math.round(100 * $scope.portfolio[0].value / res[0].portfolio - 100);
                            $scope.$apply();
                        });
                    
                    $scope.sdelki2[0].value = $scope.getDataFromSlicedArray(result, "release_sdelki");
                    var count = result.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                    var count_plan = 0;
                    for (var i=0; i<new Date().getMonth()+1; i++) {
                        count_plan += $scope.plan[i].count;
                    }
                    $scope.sdelki2[0].plan = (count_plan === 0) ? 0 : Math.round(100 * count/ count_plan);
                    $scope.getDataFromAPI($scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate())), $scope.formatDate(new Date(new Date().getFullYear()-1, 0, 1))) // с 1 января предыдущего года по сегодня предыдущего года
                        .then(response => response)
                        .then(res => {
                            var count_ly = res.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                            $scope.sdelki2[0].year = Math.round(100 * count / count_ly - 100);
                            $scope.$apply();
                        });
                    $scope.$apply();

                    $scope.new_sdelki[0].value = result[0].new_clients_sdelki_period;
                    $scope.$apply();
                    
                });

            $scope.getDataFromAPI($scope.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0)), $scope.formatDate(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1))) // прошлый месяц
                .then(response => response)
                .then(result => {
                    $scope.getDataFromAPI($scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), 0)), $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth()-1, 1))) // прошлый месяц прошлого года
                        .then(response => response)
                        .then(result2 => {
                            $scope.getDataFromMT($scope.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0)), $scope.formatDate(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1))) // рынок прошлый месяц
                            .then(response => response)
                            .then(res => {
                                $scope.getDataFromMT($scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), 0)), $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth()-1, 1)))
                                    .then(response => response)
                                    .then(res2 => {
                                        var fp_last_month = result.reduce( ( sum, { sum_sdelki } ) => sum + sum_sdelki , 0); // этот год
                                        var fp_last_year = result2.reduce( ( sum, { sum_sdelki } ) => sum + sum_sdelki , 0); // прошлый год

                                        var mt_last_month = res.data.reduce( ( sum, { sum_g } ) => sum + sum_g , 0); // этот год
                                        var mt_last_year = res2.data.reduce( ( sum, { sum_g } ) => sum + sum_g , 0); // прошлый год

                                        var val1 = 100 * fp_last_month / mt_last_month;
                                        var val2 = 100 * fp_last_month / fp_last_year;
                                        var val3 = 100 * mt_last_month / mt_last_year;
            
                                        var fp_cl_last_month = result.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                                        var fp_cl_last_year = result2.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                                        
                                        var mt_cl_last_month = res.data.reduce( ( sum, { count_g } ) => sum + count_g , 0);
                                        var mt_cl_last_year = res2.data.reduce( ( sum, { count_g } ) => sum + count_g , 0);

                                        var val1_cl = 100 * fp_cl_last_month / mt_cl_last_month;
                                        var val2_cl = 100 * fp_cl_last_month / fp_cl_last_year;
                                        var val3_cl = 100 * mt_cl_last_month / mt_cl_last_year;
            
                                        $scope.market[0] = {value:val1.toFixed(1), plan: Math.round(val2), year:Math.round(val3)};
                                        $scope.market[1] = {value:val1_cl.toFixed(1), plan:Math.round(val2_cl), year:Math.round(val3_cl)};
                                        $scope.$apply();
                                        setTimeout(() => {
                                            $("#spinner").addClass('d-none');
                                            $('#dashboard').fadeIn('slow');
                                            $('#footer').fadeIn('slow');
                                        },1000);
                                    });
                                });
                            });
                });

            $scope.getDataFromAPI($scope.formatDate(new Date()), $scope.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))) // с 1 числа месяца по сегодня
                .then(response => response)
                .then(result => {
                    $scope.new_sdelki[1].value = result[0].new_clients_sdelki_period;
                });
            
            $scope.getDataFromAPI($scope.formatDate(new Date()), $scope.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0))) // с начала месяца по сегодня
                .then(response => response)
                .then(result => {
                    $scope.portfolio[1].value = result[0].portfolio - result[result.length-1].portfolio;
                    $scope.sdelki2[1].value = 0; //$scope.getDataFromSlicedArray(result, "release_sdelki");
                    for (var i=0; i<result.length-1; i++) {$scope.sdelki2[1].value += result[i].release_sdelki;}
                    
                    $scope.getDataFromAPI($scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate())), $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), 0))) // этот месяц год назад
                        .then(response => response)
                        .then(res => {
                            
                            var sdelki_1 = 0;
                            // for (var i=0; i<new Date().getDate(); i++) {
                            //     sdelki_1 += result[i].release_sdelki;
                            // }
                            result.forEach(item => {
                                sdelki_1 += item.release_sdelki;
                            });
                            var sdelki = 0;
                            for (var i=0; i< res.length-1; i++){
                                sdelki += res[i].release_sdelki;
                            }

                            var portfolio = result[0].portfolio - result[result.length-1].portfolio;
                            portfolio = (portfolio === 0) ? result[0].portfolio : portfolio;

                            var portfolio_year = res[0].portfolio - res[res.length-1].portfolio;
                            portfolio_year = (portfolio_year === 0) ? res[0].portfolio : portfolio_year;

                            var to_year = 0;
                            if (portfolio > 0 && portfolio_year > 0) { to_year = Math.round(100 * portfolio / portfolio_year - 100); }
                            else if (portfolio > 0 && portfolio_year < 0) { to_year = Math.round(100 * (portfolio + Math.abs(portfolio_year)) / Math.abs(portfolio_year)); }
                            else if (portfolio < 0 && portfolio_year > 0) { to_year = Math.round(100 * portfolio / portfolio_year - 100); }
                            else if (portfolio < 0 && portfolio_year < 0) { to_year = Math.round(- Math.abs(portfolio) / Math.abs(portfolio_year) * 100 + 100); }

                            var sum_1 = 0;
                            for (var i=0; i<new Date().getMonth(); i++)
                            {
                                sum_1 += $scope.plan[i].count;
                            }

                            $scope.portfolio[1].plan = ($scope.plan[new Date().getMonth()].portfolio === 0) ? 0 : Math.round(100 * portfolio / (($scope.plan[new Date().getMonth()].portfolio*1000 - (new Date().getMonth() === 0) ? $scope.plan_ds[new Date().getFullYear()-1][11].portfolio*1000 : $scope.plan[new Date().getMonth()-1].portfolio*1000)));
                            $scope.portfolio[1].year = to_year;
                            
                            $scope.sdelki2[1].plan = ($scope.plan[new Date().getMonth()].count === 0) ? 0 : Math.round(100 * $scope.sdelki2[1].value / $scope.plan[new Date().getMonth()].count);
                            $scope.sdelki2[1].year = (sdelki === 0) ? 100 : Math.round(100 * sdelki_1 / sdelki - 100);
                            
                            $scope.$apply();
                        });
                    $scope.$apply();
                });
        };

        $scope.updateData_FC = function() {

            var date = new Date();
            var today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

            $scope.getDataFromAPI_FC("day_results", today, today) // итоги дня
                .then(response => response)
                .then(result => {
                    $scope.comissions_fc[0].value = Math.round(result.portfolio[0].today);
                    $scope.comissions_fc[1].value = Math.round(result.portfolio[0].yesterday);
                    $scope.comissions_fc[2].value = Math.round(result.portfolio[0].week);
                    $scope.comissions_fc[3].value = Math.round(result.portfolio[0].year);

                    $scope.clients_fc[0] = {value: result.clients.all[0].count, avg_cheque: result.clients.all[0].avg_check};
                    $scope.clients_fc[1] = {value: result.clients.new[0].count, avg_cheque: result.clients.new[0].avg_check};

                    $scope.$apply();
                });

            $scope.getDataFromAPI_FC("summary_indicators", today, today) // Сводные показатели
                .then(response => response)
                .then(result => {
                    $scope.portfolio_fc[0] = {value: result.portfolio_detailed.this_year[0].sum, plan:result.portfolio_detailed.this_year[0].to_plan, year: result.portfolio_detailed.this_year[0].to_year};
                    $scope.portfolio_fc[1] = {value: result.portfolio_detailed.this_month[0].sum, plan:result.portfolio_detailed.this_month[0].to_plan, year: result.portfolio_detailed.this_month[0].to_year};

                    $scope.clients2_fc[0] = {value: result.clients_detailed.all.this_year[0].sum, plan: result.clients_detailed.all.this_year[0].to_plan, year: result.clients_detailed.all.this_year[0].to_year};
                    $scope.clients2_fc[1] = {value: result.clients_detailed.all.this_month[0].sum, plan: result.clients_detailed.all.this_month[0].to_plan, year: result.clients_detailed.all.this_month[0].to_year};

                    $scope.new_clients_fc[0] = {value: result.clients_detailed.new.this_year[0].sum, plan: result.clients_detailed.new.this_year[0].to_plan, year: result.clients_detailed.new.this_year[0].to_year};
                    $scope.new_clients_fc[1] = {value: result.clients_detailed.new.this_month[0].sum, plan: result.clients_detailed.new.this_month[0].to_plan, year: result.clients_detailed.new.this_month[0].to_year};

                    $scope.$apply();
                });

            $scope.getDataFromAPI_FC("review_afc", today, today) // Сводные показатели доля рынка
                .then(response => response)
                .then(result => {
                    $scope.share_fc[0] = {value: result.portfolio_detailed.last_q[0].share, plan: result.portfolio_detailed.last_q[0].share_to_year, year: result.portfolio_detailed.last_q[0].market_to_year};
                    $scope.share_fc[1] = {value: result.clients_detailed.all.last_q[0].share, plan: result.clients_detailed.all.last_q[0].share_to_year, year: result.clients_detailed.all.last_q[0].market_to_year};
                    $scope.share_fc[2] = {value: result.clients_detailed.new.last_q[0].share, plan: result.clients_detailed.new.last_q[0].share_to_year, year: result.clients_detailed.new.last_q[0].market_to_year};
                    
                    $scope.$apply();
                });
        };

        $scope.today = new Date().getDate() + " " + ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][new Date().getMonth()] + " " + new Date().getFullYear();
        $scope.month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'][new Date().getMonth()];
        $scope.last_month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'][new Date().getMonth()-1] + " " + new Date().getFullYear();

        $scope.comissions = [
            {label: "Сегодня", value: ""},
            {label: "Вчера", value: ""},
            {label: "Неделю назад", value: ""},
            {label: "Год назад", value: ""}
        ];
        
        $scope.sdelki = [
            {value: "", avg_cheque: ""},
            {value: "", avg_cheque: ""}
        ];

        $scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
        $scope.auth("dashboard", "jhs7eejw"); // FC
    //});

    // Variables of BG
        $scope.portfolio = [
            {value: "", plan:"", year:""},
            {value: "", plan:"", year:""},
        ];

        $scope.sdelki2 = [
            {value: "", plan:"", year:""},
            {value: "", plan:"", year:""},
        ];

        $scope.new_sdelki = [
            {value: "", plan:"", year:""},
            {value: "", plan:"", year:""},
        ];

        $scope.market = [
            {value:"", plan:"", year:""},
            {value:"", plan:"", year:""}
        ];

        $scope.rest = [
            {value: ""},
            {value: ""},
        ];
    // End Variables of BG

    // Variable of FC
        $scope.comissions_fc = [
            {label: "Сегодня", value: 0},
            {label: "Вчера", value: 0},
            {label: "Неделю назад", value: 0},
            {label: "Год назад", value: 0}
        ];
        
        $scope.clients_fc = [
            {value: 0, avg_cheque: 0},
            {value: 0, avg_cheque: 0}
        ];

        $scope.portfolio_fc = [
            {value: 0, plan:0, year:0},
            {value: 0, plan:0, year:0}
        ];

        $scope.clients2_fc = [
            {value: 0, plan:0, year:0},
            {value: 0, plan:0, year:0}
        ];

        $scope.new_clients_fc = [
            {value: 0, plan:0, year:0},
            {value: 0, plan:0, year:0}
        ];

        $scope.share_fc = [
            {value:0, plan:0, year:0},
            {value:0, plan:0, year:0},
            {value:0, plan:0, year:0}
        ];

        $scope.share_fc.title = "";
    // End Variables of FC

        $scope.htmlDecode = function(input) {
            var e = document.createElement('span');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
          }

        $scope.abbreviateNumber = function(num, fixed) {
            var sign = (num < 0) ? "-" : "";
            num = Math.abs(num);
            if (num < 100){
                return $sce.trustAsHtml(String(num));
            }
            else {
                if (num === null) { return null; } // terminate early
                if (num === 0) { return '0'; } // terminate early
                fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
                var b = (num).toPrecision(2).split("e"), // get power
                    k = b.length === 1 ? 0 : Math.round(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
                    c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(fixed), // divide by power
                    d = c < 0 ? c : c, // enforce -0 is 0
                    e = ((num < 1000) ? sign+(num/1000).toFixed(fixed) : sign+d) + "<span style='font-size:50px;'>" + [' тыс', ' тыс', ' млн', ' млрд', ' трлн'][k] + "</span>"; // append power
                return (num < 100) ? num.toFixed(fixed) : $sce.trustAsHtml(e);
            }
        }

        $scope.abbreviateNumber_num = function(num, fixed) {
            var sign = (num < 0) ? "-" : "";
            num = Math.abs(num);
            if (num === null) { return null; } // terminate early
            if (num === 0) { return '0'; } // terminate early
            fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
            var b = (num).toPrecision(2).split("e"), // get power
                k = b.length === 1 ? 0 : Math.round(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
                c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(fixed), // divide by power
                d = c < 0 ? c : c, // enforce -0 is 0
                e = ((num < 1000) ? sign+(num/1000).toFixed(fixed) : sign+d); // append power
            return (num < 100) ? num.toFixed(fixed) : e;
        }

        $scope.abbreviateNumber_title = function(num) {
            num = Math.abs(num);
            if (num === null) { return null; } // terminate early
            if (num === 0) { return ''; } // terminate early
            var b = (num).toPrecision(2).split("e"), // get power
                k = b.length === 1 ? 0 : Math.round(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
                e = (num < 1000) ? "" : "(" + ['тыс', 'тыс', 'млн', 'млрд', 'трлн'][k] + ")"; // append power
            return e;
        }

        $scope.percentStyle = function(num) {
            return $sce.trustAsHtml(num + " <span style='font-size:50px;'>%</span>");
        }

        $scope.strict = function(value) {
            return Math.abs(parseInt(value))
        }

        $scope.declension = function(number, titles) {  
            var cases = [2, 0, 1, 1, 1, 2];
            number = Math.round(number);
            return number.toLocaleString('ru-RU') + " " + titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
        }

        $scope.quad = function() {
            return $scope.share_fc.title;//['I', 'II', 'III', 'IV'][Math.floor((new Date().getMonth()+1)/3) - 1];
        }

        let timerId = setInterval(() => {
            console.log("tick");
            $scope.auth("dashboard_gar", "JJjhs7eejw"); // BG
            $scope.auth("dashboard", "jhs7eejw"); // FC
        }, (30 * 60000));
    });
})();
