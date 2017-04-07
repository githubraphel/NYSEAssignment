 angular
        .module('myApp')
        .controller('apiController',['$scope','$http',function ($scope,$http) {

            console.log("apiController loaded");

            $scope.symbolsList = ['AMZN','CLNT','HTGM','TROVU','AMD','SNDR','TWTR'];

            $scope.deleteFromPortfolio = function (item) {
                console.log("deleteFromPortfoliio is activated!!");
                console.log("item is "+item);
                console.log(typeof item);




                $http({
                    url: 'http://127.0.0.1:5000/database-api/portfolios',
                    method: 'DELETE',
                    data: {
                        "symbol": item
                    },
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                }).then(function(res) {
                    console.log(res.data);
                }, function(error) {
                    console.log(error);
                });


            };

            $scope.postQuote = function () {



                var objToInsert = {
                    "symbol":$scope.compdetails[0], "no_of_shares":$scope.sharesNo, "last_price":$scope.compdetails[2]
                };




                $http.post("http://127.0.0.1:5000/database-api/portfolios",JSON.stringify(objToInsert)).then(function (resp) {
                    console.log("we got response object!!");
                    if(resp.data == 'SUCCESS'){
                        console.log('deletion was succesfull');
                    }
                    else{
                        console.log(resp.data);
                    }
                });






            };

            $scope.addToPortfolio = function () {
                console.log("addToPortfolio button response taken inside!!");
                console.log("share amount is ::" +$scope.sharesNo);
                var url = "http://127.0.0.1:5000/database-api/portfolios";


                $http.get(url).then(function(resp){
                    console.log("inside http call");
                    var count = resp.data.data.length;
                    console.log("the count is "+count);
                    console.log("a sample data is "+resp.data.data[0]);
                    var portFolioList = [];
                    var num=0;
                    while(count>=1){
                        portFolioList.push(resp.data.data[num]);
                        num++;
                        count--;
                    }
                    $scope.myElements = portFolioList;
                });
            };

            $scope.selectSymbol = function () {
                console.log("symbol selected event is captured!!");
                console.log("selected symbol is "+$scope.sym);
                var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + $scope.sym +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
                $http.get(url).then(function(resp) {
                    var symbol = resp.data.query.results.quote.symbol;
                    var companyName = resp.data.query.results.quote.Name;
                    var lastTradePrice = resp.data.query.results.quote.LastTradePriceOnly;
                    console.log(symbol + " " + companyName + "" + lastTradePrice);
                    $scope.compdetails = [symbol,companyName,lastTradePrice];
                });
            };
        }]);





