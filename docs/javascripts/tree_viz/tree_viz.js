// if (!('ontouchstart' in window)) {
//     // then not mobile, so allow the popovers
//     // $("[data-toggle=popover]").popover();
//     $(function () {
//         $('[data-toggle="tooltip"]').tooltip()
//     });
// }

// $('#completionModal').modal({show: false});

// initialize variables
var margin = {top: 30, right: 30, bottom: 60, left: 30};
var width = 460 - margin.left - margin.right;
var height = 430 - margin.top - margin.bottom;
var bgcolor1 = '#00bdd6'
var class1 = "a"
var bgcolor2 = '#f5A623'
var class2 = "b"
var completed = false;
var revealed = false;
var opacity = 0.3;
var points = 10;
var data_max = 10;
var data_min = 0;
var time_delay = 500;
var best_time = Infinity;
var best_depth = Infinity;
var best_leaves = Infinity;
var start_time = new Date().getTime();

// set slider value to 10
d3.select('#pointsRange').each(function(){ this.value=points; });
d3.select('#pointsRangeLabel').text('Number of points: ' + points);

var data_generator = function(n) {
    if ($('#customRadio1').prop('checked')) {
        data = generate_dataset(n);
    }
    else if ($('#customRadio2').prop('checked')) {
        data = generate_diagonal_dataset(n);
    }
    else if ($('#customRadio3').prop('checked')) {
        data = generate_quadratic_dataset(n);
    }
    else {
        data = generate_dataset(n);
    }
    return data;
}

$('#customRadio1').prop('checked', true);
dataset = data_generator(points);
console.log(dataset);

// append the svg objects to the body of the page
var svg = d3.select('#my_dataviz')
    .append("svg")
    .attr("viewBox", "0 0 460 430" )
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg_dt = d3.select('#my_dataviz2')
    .append("svg")
    .attr("viewBox", "0 0 460 430" )
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg_example = d3.select('#my_dataviz_example')
    .append("svg")
    .attr("viewBox", "0 0 460 430" )
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// slider to adjust point number
d3.select('#pointsRange').on("input", function(){
    points = +this.value;
    d3.select('#pointsRangeLabel').text('Number of points: ' + points);
})

// restart the viz on a new random dataset
var restart = function(){
    svg.selectAll('text').remove();
    svg.selectAll('rect').remove();
    svg.selectAll('line').remove();
    svg.selectAll('circle').remove();
    svg_dt.selectAll('text').remove();
    svg_dt.selectAll('rect').remove();
    svg_dt.selectAll('line').remove();
    svg_dt.selectAll('circle').remove();
    // try transitioning the circles to the new data!
    best_time = Infinity;
    best_depth = Infinity;
    best_leaves = Infinity;
    completed = false;
    revealed = false;
    dataset = data_generator(points);
    clearInterval(timer);
    tree_viz(dataset, svg, false);
    timer = setup_timer(svg, width, height+25);
}

// restart the viz on the same dataset
var retry = function(){
    svg.selectAll('text').remove();
    svg.selectAll('rect').remove();
    svg.selectAll('line').remove();
    svg.selectAll('circle').remove();
    svg_dt.selectAll('text').remove();
    svg_dt.selectAll('rect').remove();
    svg_dt.selectAll('line').remove();
    svg_dt.selectAll('circle').remove();
    // try transitioning the circles to the new data!
    completed = false;
    revealed = false;
    clearInterval(timer);
    tree_viz(dataset, svg, false);
    timer = setup_timer(svg, width, height+25);
}

// reveal the results of the decision tree
var reveal = function(){
    if (!revealed) {
        draw_cart_decision_tree(dataset, svg_dt);
    }
    revealed = true;
    completed = true;
}


// show the tree viz on the svg
tree_viz(dataset, svg, false);
timer = setup_timer(svg, width, height+25);
tree_viz([], svg_example, true);
svg_example.selectAll('text').remove();
svg_example.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', 0)
    .attr('y2', height)
    .style('stroke', 'gray')
    .style('stroke-dasharray', ("10, 10"));
    svg_example.append('line')
    .attr('x1', width)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', height)
    .style('stroke', 'gray')
    .style('stroke-dasharray', ("10, 10"));

var guideline_opacity = 0

var guide_lines = function(checked) {
    guideline_opacity = checked ? 1 : 0;
}

$('#customSwitch1').change(function() {
    guide_lines($(this).prop('checked'))
    });

guide_lines($('#customSwitch1').prop('checked'));