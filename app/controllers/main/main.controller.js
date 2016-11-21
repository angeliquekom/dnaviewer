angular.module('myApp.main', ['ngRoute', 'md.data.table'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'controllers/main/main.html',
            controller: 'MainCtrl',
            controllerAs: 'mainCtrl'
        });
    }])
    .controller('MainCtrl', MainCtrl)

MainCtrl.$inject = ['$scope', 'TYPES_MAPPING', 'DataService'];

function MainCtrl($scope, TYPES_MAPPING, DataService) {

    var vm = this;

    vm.sortByStartIndex = sortByStartIndex;
    vm.fillRegions = fillRegions;

    /////////////
    activate();

    function activate() {

        DataService.getData().$promise.then(function(data) {
            // Basic model
            vm.data = sortByStartIndex(data.dnafeatures);
            vm.slices = fillRegions(vm.data);
            // Store primary response to handle cases such as changing basic model when
            // hovering on pie slices and display specific rows on the table
            vm.primeData = vm.data;

            // Configuration for mapping type of feature, color, image
            vm.conf = TYPES_MAPPING;
            vm.selected = null;
            createVis();
        });
    }

    // Sort by start and fill at the next function
    // with non defined regions (this format is needed
    // for the right position on the visualization)
    function sortByStartIndex(array) {
        array = array.sort(function(a, b) {
            var keyA = a.start,
                keyB = b.start;
            // Compare the 2 keys
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

        return array;
    }

    function fillRegions(array) {
        var slices = [];
        var lastEnd = 0;

        array.forEach(function(f, i) {

            if (f.start > lastEnd + 1) {
                slices.push({
                    strand: 0,
                    start: (lastEnd === 0) ? 0 : lastEnd + 1,
                    end: f.start - 1,
                    dnafeatureId: "nonId-" + i,
                    dnafeature: {
                        category: {
                            name: "none"
                        },
                        length: (f.start - 1) - ((lastEnd === 0) ? 0 : lastEnd + 1),
                        name: "none"
                    }
                });
            }

            lastEnd = f.end;
            slices.push(f);
        });

        return slices;
    }

    function createVis() {
        if (vm.slices !== undefined) {
            var width = 500,
                height = 500,
                radius = Math.min(width, height) / 2;

            var padAngle = 0.05;

            var pie = d3.layout.pie()
                .sort(null)
                .padAngle(padAngle)
                .value(function(d) {
                    return d.dnafeature.length;
                });;

            var arc = d3.svg.arc()
                .innerRadius(radius - 50)
                .outerRadius(radius - 10)
                .cornerRadius(1);

            var svg = d3.select("#chart")
                .append("svg")
                .style("display", "block")
                .style("margin", "auto")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

            var path = svg.selectAll(".foreground")
                .data(pie(vm.slices))
                .enter().append("path")
                .attr("class", "foreground")
                .attr("id", function(d, i) {
                    return d.data.dnafeatureId;
                })
                .style("cursor", "pointer")
                .attr("fill", function(d, i) {
                    return TYPES_MAPPING[d.data.dnafeature.category.name].color;
                })
                .attr("fill-opacity", function(d) { //TODO: add function
                    if (vm.selected !== null && d.data.dnafeatureId !== vm.selected.dnafeatureId) {
                        return 0.5;
                    } else {
                        return 1;
                    }
                })
                .attr("stroke", function(d, i) { //TODO: add function
                    return TYPES_MAPPING[d.data.dnafeature.category.name].color;
                })
                .attr("stroke-width", 5)
                .attr("d", arc)
                // Set to others opacity on hover on the slice
                .on('mouseover', function(d, i) { //TODO: add function
                    if (d.data.dnafeature.name !== "none") {
                        vm.selected = d.data;

                        $scope.$apply(function() {
                            vm.data = [d.data];
                        });
                    }

                    d3.selectAll(".foreground")
                        .attr("stroke-opacity", function(m) { //TODO: add function
                            if (m.data.dnafeatureId !== vm.selected.dnafeatureId) {
                                return 0.1;
                            } else {
                                return 1;
                            }
                        })
                        .attr("fill-opacity", function(m) { //TODO: add function
                            if (m.data.dnafeatureId !== vm.selected.dnafeatureId) {
                                return 0.3;
                            } else {
                                return 1;
                            }
                        });

                    d3.selectAll(".strand")
                        .style("opacity", function(n) { //TODO: add function
                            if (n.data.dnafeatureId !== vm.selected.dnafeatureId) {
                                return 0.3;
                            } else {
                                return 1;
                            }
                        });
                })
                .on('mouseout', function(d, i) {
                    vm.selected = null;

                    $scope.$apply(function() {
                      vm.data = vm.primeData;
                    });

                    d3.selectAll(".foreground")
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity", 1);
                    d3.selectAll(".strand")
                        .style("opacity", 1);
                });

            // Add indexes
            svg.selectAll(".sliceStart")
                .data(vm.slices)
                .enter().append("text")
                .attr("class", "sliceStart")
                .attr("x", 0) //Move the text from the start angle of the arc
                .attr("dy", 53) //Move the text down
                .append("textPath")
                .attr("xlink:href", function(d, i) {
                    return "#" + d.dnafeatureId;
                })
                .text(function(d) {
                    return d.start;
                })
                .style("font-family", "Roboto")
                .style("font-weight", 600)
                .style("font-size", function(d) { //TODO: add function
                    return (d.dnafeature.name === 'none' || (d.dnafeature.length < (vm.slices[vm.slices.length - 1].end / 16))) ?
                        0 : '0.6em';
                })
                .style("fill", "rgba(0,0,0,0.43)");

            svg.selectAll(".label")
                .data(pie(vm.slices))
                .enter().append("text")
                .attr("class", "label")
                .attr("x", function(d) { //TODO: add function
                    if ((((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90) > 90) {
                        return 30;
                    } else {
                        return -35 - d.data.dnafeature.name.length * 5; //TODO: improve function
                    }
                })
                .attr("dy", ".100em")
                .attr("transform", function(d) { //TODO: add function
                    return "translate(" + arc.centroid(d) + ")rotate(" + angleLabel(d) + ")";
                })
                .text(function(d) { //TODO: add function
                    return (d.data.dnafeature.name !== "none" ? d.data.dnafeature.name : '');
                })
                .style("fill", "rgba(0,0,0,0.5)")
                .style("font-size", "0.6em");

            //Put SBOL image future extension
            // svg.selectAll(".image")
            //   .data(pie(slices))
            //    .enter().append("image")
            //   .attr("class", "image")
            //   .attr("x", -70)
            //   .attr('width', 30)
            //   .attr('height', 30)
            //   .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            //   .attr("xlink:href", function(d){
            //     return (d.data.dnafeature.name !== 'none') ? 'img/JPEG/' + constants[d.data.dnafeature.category.name].img + '.jpeg' : null;
            //   })

            // Computes the label angle of an arc, converting from radians to degrees.
            function angleLabel(d) {
                var a = ((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90;
                return a > 90 ? a - 180 : a;
            }

            svg.selectAll(".strand")
                .data(pie(vm.slices))
                .enter().append("path")
                .attr("class", "strand")
                .attr("transform", function(d) {
                    if (d.data.strand === 1) { //TODO: add function
                        return "translate(" + [Math.sin(d.endAngle) * (radius - 30 + padAngle), - Math.cos(d.endAngle) * (radius - 30 + padAngle)] + ") rotate(" +
                            (d.endAngle < Math.PI / 2 ? d.endAngle + Math.PI / 2 : (d.endAngle > Math.PI) && (d.endAngle < Math.PI + Math.PI / 2) ? d.endAngle + Math.PI / 2 : d.endAngle + Math.PI / 2) * 180 / Math.PI + ")";
                    } else if (d.data.strand === -1) {
                        return "translate(" + [Math.sin(d.startAngle) * (radius - 30 - padAngle), - Math.cos(d.startAngle) * (radius - 30 - padAngle)] + ") rotate(" +
                            (d.startAngle < Math.PI / 2 ? d.startAngle + Math.PI / 2 : (d.startAngle > Math.PI) && (d.startAngle < Math.PI + Math.PI / 2) ? d.startAngle / 2 + Math.PI / 2 : d.startAngle + Math.PI / 2) * 180 / Math.PI + ")";
                    }
                })
                .style("stroke", function(d) { //TODO: add function
                    return (d.data.strand !== 0) ? TYPES_MAPPING[d.data.dnafeature.category.name].color : 'rgba(0,0,0,0)';
                })
                .style("stroke-width", function(d) { //TODO: add function
                    return 6;
                })
                .style("fill", function(d) { //TODO: add function
                    return (d.data.strand !== 0) ? TYPES_MAPPING[d.data.dnafeature.category.name].color : 'rgba(0,0,0,0)';
                })
                .attr("d", d3.svg.symbol()
                    .size(35)
                    .type(function(d) {
                        return d.data.strand === 1 ? "triangle-up" : "triangle-down";
                    }))
                .on('mouseover', function(d, i) { //TODO: add function
                    vm.selected = d.data;

                    $scope.$apply(function() {
                        vm.data = [d.data];
                    });
                    d3.selectAll(".foreground")
                        .attr("stroke-opacity", function(m) { //TODO: add function
                            if (m.data.dnafeatureId !== vm.selected.dnafeatureId) {
                                return 0.1;
                            } else {
                                return 1;
                            }
                        })
                        .attr("fill-opacity", function(m) { //TODO: add function
                            if (m.data.dnafeatureId !== vm.selected.dnafeatureId) {
                                return 0.3;
                            } else {
                                return 1;
                            }
                        });
                    d3.selectAll(".strand")
                        .style("opacity", function(n) {
                            if (n.data.dnafeatureId !== vm.selected.dnafeatureId) {
                                return 0.3;
                            } else {
                                return 1;
                            }
                        });
                })
                .on('mouseout', function(d, i) {
                    vm.selected = null;

                    $scope.$apply(function() {
                        vm.data = vm.primeData;
                    });
                    d3.selectAll(".foreground")
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity", 1);
                    d3.selectAll(".strand")
                        .style("opacity", 1);
                });
        }
    }
}
