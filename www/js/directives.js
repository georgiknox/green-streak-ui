angular.module('green-streak.directives', ['d3'])

    .directive('d3Bars', ['d3', function (d3) {
        return {
            restrict: 'EA',
            scope: {
                data: "=",
                label: "@",
                onClick: "&"
            },
            link: function (scope, iElement, iAttrs) {
                var svg = d3.select(iElement[0])
                    .append("svg")
                    .attr("width", "100%");

                // on window resize, re-render d3 canvas
                window.onresize = function () {
                    return scope.$apply();
                };
                scope.$watch(function () {
                        return angular.element(window)[0].innerWidth;
                    }, function () {
                        return scope.render(scope.data);
                    }
                );

                // watch for data changes and re-render
                scope.$watch('data', function (newVals, oldVals) {
                    return scope.render(newVals);
                }, true);

                // define render function
                scope.render = function (data) {
                    // remove all previous items before render
                    svg.selectAll("*").remove();

                    // setup variables
                    var width, height, max;
                    width = d3.select(iElement[0])[0][0].offsetWidth - 20;
                    // 20 is for margins and can be changed
                    height = scope.data.length * 35;
                    // 35 = 30(bar height) + 5(margin between bars)
                    max = 98;
                    // this can also be found dynamically when the data is not static
                    // max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))

                    // set the height based on the calculations above
                    svg.attr('height', height);

                    //create the rectangles for the bar chart
                    svg.selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect")
                        .on("click", function (d, i) {
                            return scope.onClick({item: d});
                        })
                        .attr("height", 30) // height of each bar
                        .attr("width", 0) // initial width of 0 for transition
                        .attr("x", 10) // half of the 20 side margin specified above
                        .attr("y", function (d, i) {
                            return i * 35;
                        }) // height + margin between bars
                        .transition()
                        .duration(1000) // time of duration
                        .attr("width", function (d) {
                            return d.score / (max / width);
                        }); // width based on scale

                    svg.selectAll("text")
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("fill", "#fff")
                        .attr("y", function (d, i) {
                            return i * 35 + 22;
                        })
                        .attr("x", 15)
                        .text(function (d) {
                            return d[scope.label];
                        });

                };
            }
        };
    }])

    .directive('d3Pie', ['d3', function (d3) {
        return {
            restrict: 'EA',
            scope: {
                data: "=",
                label: "@",
                onClick: "&"
            },
            link: function (scope, iElement, iAttrs) {
                var width = 400,
                    height = 200,
                    radius = Math.min(width, height) / 2,
                    labelRadius = 150,
                    transitionTime = 2000;

                var color = d3.scale.category20();

                var arc = d3.svg.arc()
                    .outerRadius(radius - 10);

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) {
                        return d.count;
                    });

                var svg = d3.select(iElement[0])
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                // on window resize, re-render d3 canvas
                window.onresize = function () {
                    return scope.$apply();
                };
                scope.$watch(function () {
                        return angular.element(window)[0].innerWidth;
                    }, function () {
                        return scope.render(scope.data);
                    }
                );

                // watch for data changes and re-render
                scope.$watch('data', function (newVals, oldVals) {
                    return scope.render(newVals);
                }, true);

                // define render function
                scope.render = function (data) {
                    // remove all previous items before render
                    //svg.selectAll("*").remove();

                    data.forEach(function (d) {
                        d.count = +d.count;
                    });

                    var g = svg.selectAll(".arc")
                        .data(pie(data))
                        .enter().append("g")
                        .attr("class", "arc");

                    g.append("path")
                        .attr("d", arc)
                        .style("fill", function (d) {
                            return color(d.data.name);
                        })
                        .transition()
                        .ease("bounce")
                        .duration(transitionTime)
                        .attrTween("d", tweenPie);

                    g.append("text")
                        .attr("transform", function (d) {
                            return "translate(" +
                                ( (labelRadius - 12) * Math.sin(((d.endAngle - d.startAngle) / 2) + d.startAngle) ) +
                                ", " +
                                ( -1 * (labelRadius - 12) * Math.cos(((d.endAngle - d.startAngle) / 2) + d.startAngle) ) + ")";
                        })
                        .style("text-anchor", "middle")
                        .text(function (d) {
                            return d.data.name;
                        })
                        .attr("font-size", "14px")
                        .style("opacity", 0)
                        .transition()
                        .duration(transitionTime)
                        .style("opacity", 1);

                    function tweenPie(b) {
                        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                        return function (t) {
                            return arc(i(t));
                        };
                    }

                };
            }
        };
    }])
    .directive('d3Square', ['d3', function (d3) {
        return {
            restrict: 'EA',
            scope: {
                data: "=",
                label: "@",
                onClick: "&"
            },
            link: function (scope, iElement, iAttrs) {
                var date =  [1, 2, 3, 4, 5, 6]
                var count = [0, 5,13, 2, 6, 7]

                var colorList = ["#1e6823" , "#44a340", "#8cc665", "#d6e685", "#eeeeee"]
                var colorList = ["#eeeeee", "#d6e685", "#8cc665", "#44a340", "#1e6823" , "#44a340"]
                var colorNum = 5

                var countLength = count.length
                var latestCount = count[countLength-1]
                var maxCounts = d3.max(count)

                //Make an SVG Container
                var svg = d3.select(iElement[0])
                    .append("svg")
                    .attr("width", 200)
                    .attr("height", 200);

                // on window resize, re-render d3 canvas
                window.onresize = function () {
                    return scope.$apply();
                };
                scope.$watch(function () {
                        return angular.element(window)[0].innerWidth;
                    }, function () {
                        return scope.render(scope.data);
                    }
                );

                // watch for data changes and re-render
                scope.$watch('data', function (newVals, oldVals) {
                    return scope.render(newVals);
                }, true);

                // define render function
                scope.render = function (data) {
                    // remove all previous items before render
                    //svg.selectAll("*").remove();
                    //Draw the Rectangle
                    var rectangle = svg.append("rect")
                        .attr("x", 10)
                        .attr("y", 10)
                        .attr("width", 100)
                        .attr("height", 100)
                        .attr("fill", function(d) {
                            tmp = ((colorNum-1)*latestCount/maxCounts)
                            tmp =  d3.round(tmp)
                            if (latestCount>0) {
                                if( tmp===0) {tmp=1}
                            }
                            return colorList[tmp];
                        });

                };
            }
        };
    }]);