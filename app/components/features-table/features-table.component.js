'use strict';

angular.module('myApp.table', [])
    .component('featuresTable', {
        bindings: {
            data: '<',
            mapping: '<'
        },
        controller: function($mdDialog) {
            var vm = this;

            vm.$onInit = init;

            function init() {
                vm.patternReg = /^[AGCTacgt]*$/;
                vm.query = {
                    order: 'start',
                    limit: 5,
                    page: 1
                };
            };

            vm.openEdit = function(editedFeature) {
                $mdDialog.show({
                    template: '<md-dialog>' +
                        '  <md-dialog-content>' +
                        '     <div layout="row" layout-padding class="md-dialog-title">' + editedFeature.dnafeature.name +
                        '     </div>' +
                        '     <div layout="row" layout-padding style="color:rgba(0,0,0,0.5);font-size:10px;">' + editedFeature.dnafeature.pattern.bases +
                        '     </div>' +
                        '  </md-dialog-content>' +
                        '</md-dialog>',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true
                })
            }

        },
        controllerAs: 'featuresTableCtrl',
        templateUrl: 'components/features-table/features-table.html'
    });
