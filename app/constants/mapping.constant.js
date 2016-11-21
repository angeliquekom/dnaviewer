'use strict';

angular.module('myApp.constants', [])
    .constant('TYPES_MAPPING', {
        'primer_bind': {
            img: 'primer-binding-site',
            color: '#F44336'
        },
        'Promoter': {
            img: 'promoter',
            color: '#4CAF50'
        },
        'CDS': {
            img: 'cds',
            color: '#3F51B5'
        },
        'rep_origin': {
            img: 'origin-of-replication',
            color: '#FF5722'
        },
        'misc_feature': {
            img: 'user-defined',
            color: '#8BC34A'
        },
        'Other': {
            img: 'user-defined',
            color: '#795548'
        },
        'Terminator': {
            img: 'terminator',
            color: '#009688'
        },
        "none": {
            img: "",
            color: "#EEEEEE"
        }
    });
