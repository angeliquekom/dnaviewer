angular.module('myApp.service', ['ngResource'])

.factory('DataService', DataService)

function DataService($resource) {

    return $resource('fixtures/dnamolecule.json', {}, {
        getData: {
            method: 'GET',
            isArray: false
        }
    });

}
