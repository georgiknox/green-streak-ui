angular.module('green-streak.controllers', [])

    .controller('MenuController', function ($scope, $location, MenuService) {
        // "MenuService" is a service returning mock data (services.js)
        $scope.list = MenuService.all();

        $scope.goTo = function(page) {
            console.log('Going to ' + page);
            $scope.sideMenuController.toggleLeft();
            $location.url('/' + page);
        };
    })

    .controller('OneController', function ($scope, LanguagesService) {
        $scope.navTitle = "Language Data by count";

        $scope.d3Data = LanguagesService.all();

        $scope.d3OnClick = function(item){
            alert(item.name);
        };

        $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.sideMenuController.toggleLeft();
            }
        }];

        $scope.rightButtons = [];
    })

    .controller('TwoController', function ($scope) {
        $scope.navTitle = "Page Two Title";

        $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.sideMenuController.toggleLeft();
            }
        }];

        $scope.rightButtons = [];
    })

    .controller('ThreeController', function ($scope) {
        $scope.navTitle = "Page Three Title";

        $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.sideMenuController.toggleLeft();
            }
        }];

        $scope.rightButtons = [];
    });
