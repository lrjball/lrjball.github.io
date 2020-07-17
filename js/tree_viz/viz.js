var inside_rect = function(ix, iy, rect) {
    rx = parseFloat(rect.attr('x'));
    ry = parseFloat(rect.attr('y'));
    rw = parseFloat(rect.attr('width'));
    rh = parseFloat(rect.attr('height'));
    if ((ix > rx) && (iy > ry) && (ix < (rx + rw)) && (iy < (ry + rh))) {
        return true;
    }
    else {
        return false;
    }
}

var setup_border = function(svg){
    svg.append('svg:rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .style('fill', 'transparent');
}


var setup_box = function(data, svg){
    svg.selectAll('text').remove();
    svg.selectAll('.tick').remove();
    svg.selectAll('.domain').remove(); 

    svg.append('text')
        .attr('class', 'leaf-count')
        .text('Leaf Count: 0')
        .attr('x', 0)
        .attr('y', height + 25);

    svg.append('text')
        .attr('class', 'depth-count')
        .text('Depth Count: 0')
        .attr('x', 0)
        .attr('y', height + 50);

    setup_border(svg);

    var color = d3.scaleOrdinal()
        .domain([class1, class2])
        .range([bgcolor1, bgcolor2])

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return d.x*width/(data_max - data_min); } )
        .attr("cy", function (d) { return height - (d.y*height)/(data_max - data_min); } )
        .attr("r", 5)
        .attr('predicted-class', class1)
        .attr('actual-class', function(d){ return d.label;})
        .attr('class', 'initial-circle')
        .style("stroke", function(d) {return color(d.label);})
        .style('stroke-width', 3)
        .style('position', 'absolute')
        .style("fill", "transparent");
}

var setup_timer = function(svg, timer_width, timer_height){
    svg.append('text')
    .attr('class', 'timer')
    .attr('x', timer_width)
    .attr('y', timer_height)
    .style('text-anchor', 'end');

    start_time = new Date().getTime()

    var timer = setInterval(function() {
        var now = new Date().getTime();
        var distance = ((now - start_time)/1000.0).toFixed(2);
        if (!completed){
            d3.select('.timer').text('Time: ' + distance + 's');
        }
        else {
            if (revealed) {
                d3.select('.timer').text('Gave up after ' + distance + 's');    
            }
            else {
                d3.select('.timer').text('Final Time: ' + distance + 's');
            }
            clearInterval(timer);
        }
         }, 10);
    return timer;
}

var tree_viz = function(data, svg, example_mode){

    setup_box(data, svg);

    var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");

        mouseG.append('svg:rect')
            .attr('class', 'hover-rect-1')
            .style('fill', bgcolor1)
            .style('opacity', '0')
            .attr('hover-class', class1);

        mouseG.append('svg:rect')
            .attr('class', 'hover-rect-2')
            .style('fill', bgcolor2)
            .style('opacity', '0')
            .attr('hover-class', class2);
        mouseG.append('line')
            .attr('class', 'guide-line1')
            .style('stroke', 'gray')
            .style('stroke-dasharray', ("10, 10"))
            .style('opacity', guideline_opacity);
        
        mouseG.append('line')
            .attr('class', 'guide-line2')
            .style('stroke', 'gray')
            .style('stroke-dasharray', ("10, 10"))
            .style('opacity', guideline_opacity);
    
    var last_touch = [0 , 0];
    var touch_oob = false;
    var create_mouseG = function(x_, y_, w_, h_, c, point_class, depth) {
        var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");
        
        mouseG.append("line")
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", "0");
        
        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('class', 'pointer-event-rect')  
        .attr('width', w_) // can't catch mouse events on a g element
        .attr('height', h_)
        .attr('depth', depth)
        .attr('x', x_)
        .attr('y', y_)
        .attr('point-class', point_class)
        .style('fill', c)
        .style('opacity', opacity)
        .attr('pointer-events', 'all')
        .on('mouseout', function() {
            console.log('mouseout');
            mouseout_func(this);})
        .on('mouseover', function() {
            console.log('mouseover');
            mouseover_func(this)})
        .on('mousemove', function (){
            console.log('mousemove');
            mousemove_func(x_, y_, w_, h_, this, true)})
        .on('click', function(){
            console.log('click');
            mousemove_func(x_, y_, w_, h_, this, true);
            click_func(x_, y_, w_, h_, this, depth, true)})
        .on('touchstart', function() {
            console.log('touchstart');
            touch_oob = false;
            last_touch = d3.touches(this)[0];
            mouseover_func(this)
        })
        .on('touchmove', function(){
            console.log('touchmove');
            mousemove_func(x_, y_, w_, h_, this, false);})
        .on('touchend', function(){
            console.log('touchend');
            mousemove_func(x_, y_, w_, h_, this, false);
            click_func(x_, y_, w_, h_, this, depth, false);
            //mouseout_func(this);
        })
    }  

    var mouse_over_and_out = function(this_mouse, opacity, on){
        d3.select(this_mouse)
            .style('opacity', opacity*(1 - on));
        svg.select('.hover-rect-2')
            .style('opacity', opacity*on);
        svg.select('.hover-rect-1')  
            .style('opacity', opacity*on);
        svg.select('.mouse-line')
            .style('opacity', on);
        svg.selectAll('.guide-line1')
            .style('opacity', on*guideline_opacity);
        svg.selectAll('.guide-line2')
            .style('opacity', on*guideline_opacity);
    }


    var mouseout_func = function(this_mouse) {
        mouse_over_and_out(this_mouse, opacity, 0);
        svg.selectAll('circle').each(function(){
            item = d3.select(this);
            rect = d3.select(this_mouse);
            cx = item.attr('cx');
            cy = item.attr('cy');
            if (inside_rect(cx, cy, rect)) {
                if (item.attr('actual-class') == rect.attr('point-class')) {
                    item.style('fill', item.style('stroke'));
                }
                else {
                    item.style('fill', 'transparent');
                }
            }
        })
    }

    var mouseover_func = function(mouse_this) {
        if (completed && !example_mode) {
            return false;
        }
        console.log(d3.selectAll('rect'));
        mouse_over_and_out(mouse_this, opacity, 1);
        console.log(d3.selectAll('rect'));
    }

    var mousemove_func = function(x, y, w, h, mouse_this, mouse_bool){
        if (completed && !example_mode) {
            return false;
        }

        if (mouse_bool){
            var mouse = d3.mouse(mouse_this);
        }
        else {
            var mouse = d3.touches(mouse_this)[0];
            if (typeof mouse !== 'undefined'){
                last_touch = mouse;
            }
            else {
                console.log('mouse is undefined');
                mouse = last_touch;
            }
            
            if ((last_touch[0] < x) || (last_touch[1] < y) || (last_touch[0] > (x + w)) || (last_touch[1] > (y + h))){
                console.log('Reached here and escaped:', mouse, last_touch);
                mouseout_func(mouse_this);
                touch_oob = true;
                return false;
            }
            else {
                if (touch_oob){
                    touch_oob = false;
                    mouseover_func(mouse_this);
                }
            }
        }
        var p = mouse[0] - x;
        var q = mouse[1] - y;
        var top_right = ((p/q) > (w/h));
        var bottom_right = ((p/(h - q)) > (w/h));
        var color1 = top_right ? bgcolor1 : bgcolor2;
        var class_a = top_right ? class1 : class2;
        var color2 = top_right ? bgcolor2 : bgcolor1;
        var class_b = top_right ? class2 : class1;
        if (((h - q) < 0) || (q < 0) || (h < 0)){
            console.log('OUT OF RANGE!:')
            console.log(mouse, x, y, w, h, y+h, x+w, last_touch);
        }
        if ((top_right && bottom_right) || (!top_right && !bottom_right)){
            // in this case, mouse is in right or left triangles, so y should be drawn
            svg.select(".mouse-line")
                .attr("x1", x)
                .attr('x2', x + w)
                .attr('y1', mouse[1])
                .attr('y2', mouse[1]);

            svg.select(".hover-rect-1")
                .attr('x', x)
                .attr('y', y)
                .attr('width', w)
                .attr('height', q)
                .style('fill', color1)
                .attr('hover-class', class_a)
                .style('opacity', opacity);

            svg.select(".hover-rect-2")
                .attr('x', x)
                .attr('y', mouse[1])
                .attr('width', w)
                .attr('height', h - q)
                .style('fill', color2)
                .attr('hover-class', class_b)
                .style('opacity', opacity);
        }
        else {
            svg.select(".mouse-line")
            .attr("x1", mouse[0])
            .attr('x2', mouse[0])
            .attr('y1', y)
            .attr('y2', y + h);

            svg.select(".hover-rect-1")
                .attr('x', x)
                .attr('y', y)
                .attr('width', p)
                .attr('height', h)
                .style('fill', color1)
                .attr('hover-class', class_a)
                .style('opacity', opacity);

            svg.select(".hover-rect-2")
                .attr('x', mouse[0])
                .attr('y', y)
                .attr('width', w - p)
                .attr('height', h)
                .style('fill', color2)
                .attr('hover-class', class_b)
                .style('opacity', opacity);
        }
        svg.select(".guide-line1")
            .attr("x1", x)
            .attr('x2', x + w)
            .attr('y1', y)
            .attr('y2', y + h);
        svg.select(".guide-line2")
            .attr("x1", x + w)
            .attr("x2", x)
            .attr('y1', y)
            .attr('y2', y + h);
        svg.selectAll('circle').each(function(){
            item = d3.select(this);
            cx = item.attr('cx');
            cy = item.attr('cy');
            hr1 = svg.select('.hover-rect-1');
            if (inside_rect(cx, cy, hr1)) {
                if (item.attr('actual-class') == hr1.attr('hover-class')) {
                    item.style('fill', item.style('stroke'));
                }
                else {
                    item.style('fill', 'transparent');
                }
            }
            else {
                hr2 = svg.select('.hover-rect-2');
                if (inside_rect(cx, cy, hr2)) {
                    if (item.attr('actual-class') == hr2.attr('hover-class')) {
                        item.style('fill', item.style('stroke'));
                    }
                    else {
                        item.style('fill', 'transparent');
                    }
                }    
            }
        })
    }

    var click_func = function(x, y, w, h, mouse_this, depth, mouse_bool) {
        if (completed || example_mode){
            return false;
        }
        if (touch_oob) {
            return false;
        }
        if (mouse_bool){
            var mouse = d3.mouse(mouse_this);
        }
        else {
            var mouse = last_touch;
        }

        var p = mouse[0] - x;
        var q = mouse[1] - y;
        var top_right = ((p/q) > (w/h));
        var bottom_right = ((p/(h - q)) > (w/h));
        var color1 = top_right ? bgcolor1 : bgcolor2;
        var class_a = top_right ? class1 : class2;
        var color2 = top_right ? bgcolor2 : bgcolor1;
        var class_b = top_right ? class2 : class1;

        console.log(d3.select(mouse_this));
        d3.select(mouse_this).remove();
        if ((top_right && bottom_right) || (!top_right && !bottom_right)){
            // in this case, mouse is in right or left triangles, so y should be drawn
            svg.selectAll('circle').attr('predicted-class', function(d){
                var cy = d3.select(this).attr('cy');
                var cx = d3.select(this).attr('cx');
                var c = d3.select(this).attr('predicted-class');
                if ((cx >= x) && (cx < (x + w)) && (cy >= y) && (cy < (y + h))){
                    if (cy <= mouse[1]) { return class_a;}
                    else {return class_b;}
                }
                else {
                    return c;
                }
            });

            mouseG.append('line')
            .attr("x1", x)
            .attr('x2', x + w)
            .attr('y1', mouse[1])
            .attr('y2', mouse[1])
            .style('stroke', 'black')
            .style("stroke-width", "1px");
            create_mouseG(x, y, w, mouse[1] - y, color1, class_a, depth+1);
            create_mouseG(x, mouse[1], w, y + h - mouse[1], color2, class_b, depth+1);
        }
        else {
            svg.selectAll('circle').attr('predicted-class', function(d){
                var cy = d3.select(this).attr('cy');
                var cx = d3.select(this).attr('cx');
                var c = d3.select(this).attr('predicted-class');
                if ((cx >= x) && (cx < (x + w)) && (cy >= y) && (cy < (y + h))){
                    if (cx <= mouse[0]) { return class_a;}
                    else {return class_b;}
                }
                else {
                    return c;
                }
            });
            mouseG.append('line')
            .attr("x1", mouse[0])
            .attr('x2', mouse[0])
            .attr('y1', y)
            .attr('y2', y + h)
            .style('stroke', 'black')
            .style("stroke-width", "1px");
            create_mouseG(x, y, mouse[0] - x, h, color1, class_a, depth+1);
            create_mouseG(mouse[0], y, x + w - mouse[0], h, color2, class_b, depth+1);

        }
        leaf_count = svg.selectAll('.pointer-event-rect').size();
        svg.selectAll('.leaf-count')
            .text('Leaf Count: ' + leaf_count);
        
        svg.selectAll('circle').each(function(){
            item = d3.select(this);
            if (item.attr('predicted-class') == item.attr('actual-class')){
                item.style('fill', item.style('stroke'));
            }
            else {
                item.style('fill', 'transparent');
            }
        })
        svg.selectAll('.hover-rect-1').style('opacity', 0);
        svg.selectAll('.hover-rect-2').style('opacity', 0);

        var depths = []
        svg.selectAll('.pointer-event-rect').each(function(){
            depths.push(parseInt(d3.select(this).attr('depth')));
        })
        max_depth = d3.max(depths);
        svg.selectAll('.depth-count')
            .text('Depth Count: ' + max_depth);

        var success = 1
        svg.selectAll('circle').each(function(){
            circle = d3.select(this)
            if (circle.attr('actual-class') != circle.attr('predicted-class')){
                success = 0;
                return false;
            }

        })
        if (success == 1){
            if (leaf_count < best_leaves) {
                best_leaves = leaf_count;
            }
            if (max_depth < best_depth) {
                best_depth = max_depth;
            }
            var now = new Date().getTime();
            final_time = ((now - start_time)/1000.0);
            if (final_time < best_time) {
                best_time = final_time;
            }
            d3.select('#completionModal')
                .select('.modal-body')
                .html(
                    "Well done! You managed to successfully classify every element in the dataset. " + 
                    "Compare your result to your high score below, or dismiss this message and take a look " +
                    "at the solution by a decision tree to see how you shape up.</br></br>" + 
                    "<table class='table'>"+
                    "<thead class='thead-dark'>"+
                        "<tr>"+
                        "<th scope='col'></th>"+
                        "<th scope='col'>Current</th>"+
                        "<th scope='col'>Best</th>"+
                        "</tr>"+
                    "</thead>"+
                    "<tbody>"+
                        "<tr>"+
                        "<th scope='row'>Leaves</th>" +
                        "<td>"+ leaf_count +"</td>" + 
                        "<td>"+ best_leaves +"</td>" + 
                        "</tr>" +
                        "<tr>" +
                        "<th scope='row'>Depth</th>" + 
                        "<td>" + max_depth + "</td>" + 
                        "<td>" + best_depth + "</td>" + 
                        "</tr>"+
                        "<tr>"+
                        "<th scope='row'>Time</th>"+
                        "<td>"+ final_time.toFixed(2) +"s</td>"+
                        "<td>"+ best_time.toFixed(2) +"s</td>"+
                        "</tr>"+
                    "</tbody>"+
                "</table>"
                    )
            $('#completionModal').modal('show');
            completed = true
        }
        console.log(d3.selectAll('rect'));
    }

    create_mouseG(0, 0, width, height, 'transparent', 'c', 0);
}

var draw_cart_decision_tree = function(data, svg){
    var config = {
    trainingSet: data, 
    categoryAttr: 'label', 
    };
    var classifier = new dt.DecisionTree(config);
    setup_box(data, svg);
    svg.selectAll('circle').each(function() {
        item = d3.select(this)
        item.style('fill', item.style('stroke'));
    })

    var max_depth = 0;
    var leaf_count = 0;
    var treeG = svg.append('g');
    var x_scale = width/(data_max - data_min);
    var y_scale = height/(data_max - data_min);
    
    var get_midpoint = function(key, threshold){
        below = -Infinity;
        above = Infinity;
        for (ind in data){
            value = data[ind][key]
            if ((value >= data_min) && (value <= data_max)){
                if ((value > below) && (value < threshold)){
                    below = value;
                }
                else {
                    if ((value < above) && value >= threshold){
                        above = value;
                    }
                }
            }
        }
        return (below + above)/2;
    }

    var recursive_tree_draw = function(this_rect, tree, depth){
        if ('attribute' in tree) {
            var attr = tree['attribute'];
            var thresh = parseFloat(tree['pivot']);
            thresh = get_midpoint(attr, thresh);
            var matches = tree['match'];
            var non_matches = tree['notMatch'];
            var this_item = d3.select(this_rect);
            var x = parseFloat(this_item.attr('x'));
            var y = parseFloat(this_item.attr('y'));
            var w = parseFloat(this_item.attr('width'));
            var h = parseFloat(this_item.attr('height'));
            var color1 = (matches.category == class1) ? bgcolor1 : bgcolor2;
            var color2 = (matches.category == class1) ? bgcolor2 : bgcolor1;
            var bgcolor = (tree.category == class1) ? bgcolor1 : bgcolor2;
            if (attr == 'x') {
                treeG.append('svg:rect')
                    .attr('x', x)    
                    .attr('y', y)
                    .attr('width', (thresh*x_scale) - x)
                    .attr('height', h)
                    .style('opacity', 0)
                    .each(function() {
                        recursive_tree_draw(this, non_matches, depth+1);
                    });

                treeG.append('svg:rect')
                    .attr('x', (thresh*x_scale))
                    .attr('y', y)
                    .attr('width', (w + x) - (thresh*x_scale))
                    .attr('height', h)
                    .style('opacity', 0)
                    .each(function() {
                        recursive_tree_draw(this, matches, depth+1);
                    });
                
                treeG.append('line')
                    .attr('x1', thresh*x_scale)
                    .attr('x2', thresh*x_scale)
                    .attr('y1', y)
                    .attr('y2', y + h)
                    .style('stroke', 'black')
                    .style('opacity', 0)
                    .transition()
                    .style('opacity', 1)
                    .duration(time_delay)
                    .delay(depth*time_delay);
                
                treeG.append('svg:rect')
                    .attr('x', x)    
                    .attr('y', y)
                    .attr('width', (thresh*x_scale) - x)
                    .attr('height', h)
                    .style('opacity', 0)
                    .style('fill', bgcolor)
                    .transition()
                    .style('opacity', opacity)
                    .delay(depth*time_delay)
                    .duration(0)
                    .transition()
                    .duration(time_delay)
                    .style('fill', color2)
                    .duration(time_delay).remove();

                treeG.append('svg:rect')
                    .attr('x', (thresh*x_scale))
                    .attr('y', y)
                    .attr('width', (w + x) - (thresh*x_scale))
                    .attr('height', h)
                    .style('opacity', 0)
                    .style('fill', bgcolor)
                    .transition()
                    .style('opacity', opacity)
                    .delay(depth*time_delay)
                    .duration(0)
                    .transition()
                    .duration(time_delay)
                    .style('fill', color1)
                    .duration(time_delay).remove();

            }
            else {
                treeG.append('svg:rect')
                    .attr('x', x)    
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', height - (thresh*y_scale) - y)
                    .style('opacity', 0)
                    .each(function() {
                        recursive_tree_draw(this, matches, depth+1);
                    });

                treeG.append('svg:rect')
                    .attr('x', x)
                    .attr('y', height - (thresh*y_scale))
                    .attr('width', w)
                    .attr('height', h + y + (thresh*y_scale) - height)
                    .style('opacity', 0)
                    .each(function() {
                        recursive_tree_draw(this, non_matches, depth+1);
                    });
                
                treeG.append('line')
                    .attr('x1', x)
                    .attr('x2', x + w)
                    .attr('y1', height - (thresh*y_scale))
                    .attr('y2', height - (thresh*y_scale))
                    .style('stroke', 'black')
                    .style('opacity', 0)
                    .transition()
                    .style('opacity', 1)
                    .duration(time_delay)
                    .delay(depth*time_delay);

                treeG.append('svg:rect')
                    .attr('x', x)    
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', height - (thresh*y_scale) - y)
                    .style('opacity', 0)
                    .style('fill', bgcolor)
                    .transition()
                    .style('opacity', opacity)
                    .delay(depth*time_delay)
                    .duration(0)
                    .transition()
                    .duration(time_delay)
                    .style('fill', color1)
                    .duration(time_delay).remove();

                treeG.append('svg:rect')
                    .attr('x', x)
                    .attr('y', height - (thresh*y_scale))
                    .attr('width', w)
                    .attr('height', h + y + (thresh*y_scale) - height)
                    .style('opacity', 0)
                    .style('fill', bgcolor)
                    .transition()
                    .style('opacity', opacity)
                    .delay(depth*time_delay)
                    .duration(0)
                    .transition()
                    .duration(time_delay)
                    .style('fill', color2)
                    .remove();
            }
            
            this_item.remove();
        }
        else {
            if (tree['category'] == 'a'){
                d3.select(this_rect)
                    .style('fill', bgcolor1)
                    .style('opacity', 0);
            }
            else {
                d3.select(this_rect)
                .style('fill', bgcolor2)
                .style('opacity', 0);
                
            }
            d3.select(this_rect)
                .transition()
                .style('opacity', opacity)
                .duration(0)
                .delay((depth)*time_delay);

            if (depth > max_depth){
                max_depth = depth;
            }
            leaf_count = leaf_count + 1;
        }
    }

    treeG.append('svg:rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'red')
    .style('opacity', 0)
    .each(function() {
        recursive_tree_draw(this, classifier.root, 0);
    });

    svg.selectAll('.leaf-count')
    .text('Leaf Count: ' + leaf_count);
        
    svg.selectAll('.depth-count')
    .text('Depth Count: ' + max_depth);
    }