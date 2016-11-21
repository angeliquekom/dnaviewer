'use strict';

describe('myApp.main module', function() {
    var rootScope;
    var scope;
    var controller;
    var vm;

    beforeEach(module('myApp'));
    beforeEach(module('myApp.main'));
    beforeEach(function() {
        inject(function(_$rootScope_, _$controller_) {
            rootScope = _$rootScope_;
            scope = rootScope.$new();
            controller = _$controller_;
            vm = controller("MainCtrl", {
                $scope: scope
            });
        });
    });

    describe('MainCtrl controller', function() {

        it('Should MainCtrl controller is defined', function() {
            expect(vm).toBeDefined();
        });

        it('Should sort array to return right result', function() {
          var array = [{
              start: 100,
              end: 1000
          }, {
              start: 50,
              end: 70
          }, {
              start: 10000,
              end: 10010
          }];

          var arrayResult = [{
              start: 50,
              end: 70
          }, {
              start: 100,
              end: 1000
          }, {
              start: 10000,
              end: 10010
          }];

          var res = vm.sortByStartIndex(array);
          expect(res).toEqual(arrayResult);
        });

        it('Should fill regions to return right result', function() {
          var array = [{
              start: 50,
              end: 70
          }, {
              start: 100,
              end: 1000
          }];

          var arrayResult = [{
              start: 0,
              end: 49,
              strand: 0,
              dnafeatureId: "nonId-0",
              dnafeature: {
                  category: {
                      name: "none"
                  },
                  length: 49,
                  name: "none"
              }
          }, {
              start: 50,
              end: 70
          }, {
              start: 71,
              end: 99,
              strand: 0,
              dnafeatureId: "nonId-1",
              dnafeature: {
                  category: {
                      name: "none"
                  },
                  length: 28,
                  name: "none"
              }
          },
          {
              start: 100,
              end: 1000
          }
        ];

          var res = vm.fillRegions(array);
          expect(res).toEqual(arrayResult);
        });
    });


});
