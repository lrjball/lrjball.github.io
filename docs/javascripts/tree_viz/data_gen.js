

var get_label = function(data_size){
    if (data_size == 1) {
        return 'a';
    }
    else {
        if (data_size == 2) {
            return 'b';
        }
        else {
            if (Math.random() >= 0.5) {
                return 'a';
            }
            else {
                return 'b';
            }
        }
    }
}


// generate a dict with n random 2D points, with label 'a' or 'b'
var generate_dataset = function(n){
    var data = [];
    while (data.length < n) {
        var new_x = Math.random();
        var new_y = Math.random();
        var new_element = [Math.round(new_x*18)/2 + 0.5, Math.round(new_y*18)/2 + 0.5];
        var found = false;
        // could do this quicker with a random array sample, or maybe a pop?
        for (let item of data) {
            if ((item.x == new_element[0]) && (item.y == new_element[1])) {
                found = true;
                continue;
            }
        }
        if (found) {
            continue;
        }
        data.push({
                "x": new_element[0],
                "y": new_element[1],
                "label": get_label(data.length)
            });
        }
    return data;
}


var generate_diagonal_dataset = function(n) {
    data = generate_dataset(n);
    var new_data = [];
    for (let item of data) {
        if (item.x > item.y) {
            new_data.push({
                "x": item.x,
                "y": item.y,
                "label": "a"
            })
        }
        else {
            new_data.push({
                "x": item.x,
                "y": item.y,
                "label": "b"
            })
        }
    }
    return new_data;
}

var generate_quadratic_dataset = function(n) {
    data = generate_dataset(n);
    var new_data = [];
    for (let item of data) {
        if ((0.3*item.x*item.x - 3*item.x + 10) > item.y) {
            new_data.push({
                "x": item.x,
                "y": item.y,
                "label": "a"
            })
        }
        else {
            new_data.push({
                "x": item.x,
                "y": item.y,
                "label": "b"
            })
        }
    }
    return new_data;
}
