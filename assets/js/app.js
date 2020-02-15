//set chart height and width
let height_svg = 600;
let width_svg = 1100;

// let height_svg = window.innerHeight;
// let width_svg = window.innerWidth;

//Set default margins
let margin = {
    top: 30,
    right: 80,
    left: 80,
    bottom: 100
};


let width = width_svg - margin.left - margin.right;
let height = height_svg - margin.top - margin.bottom;

//Create the wrapper for the svg scatter plot
let news_svg = d3.select("#scatter")
            .append("svg")
            .attr("width", width_svg)
            .attr("height", height_svg);
//==========================================================

//Set the chart svg
let scatter_chart = news_svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.right})`);

//Set default x-axis data

let x_news = "poverty";
let y_news = "healthcare";

//==========================================================
//Update x axis scale for scatter chart
function X_Scale(poverty, x_value) {
    //creates the scales for x
    let x_linear_scale = d3.scaleLinear()
                        .domain([d3.min(poverty, p => p[x_value]) * 0.8,
                        d3.max(poverty, p => p[x_value]) * 1.2
                    ]).range([0, width]);
    return x_linear_scale;
}

//updates y axis
function Y_Scale(healthcare, y_value) {
    //creates the scales for y
    let y_linear_scale = d3.scaleLinear()
                           .domain([d3.min(healthcare, h => h[y_value]) * 0.8,
                           d3.max(healthcare, h => h[y_value] * 1.2)]).range([0,height]);

    return y_linear_scale;
}

//==========================================================
//Update the x axis values
function render_X_axis(new_x_scale, x_axis) {
    let bottom_axis = d3.axisBottom(new_x_scale);

    x_axis.transition()
            .duration(1200)
            .call(bottom_axis);

    return x_axis;
}
//Update the y axis values
function render_Y_axis (new_y_scale, y_axis) {
    let left_axis = d3.axisLeft(new_y_scale);

    y_axis.transition()
          .duration(1200)
          .call(left_axis);

    return y_axis;
}

//==========================================================
//Render Chart Circles
function render_x_dots(circle_group, newXScale, x_value) {
    circle_group.transition()
                .duration(1200)
                .attr("cx", cir => newXScale(cir[x_value]));
    return circle_group;
}

function render_y_dots(circle_group, newYScale, y_value) {
    circle_group.transition()
                .duration(1200)
                .attr("cx", cir => newYScale(cir[y_value]));
    
    return circle_group;
}

//==========================================================
//function to update the x axis tips
//cg = circle-groups
function update_x_tips(x,cg) {
    if (x === "poverty") {
        let label = "Poverty (%):";
    }
    else if (x === "age") {
        let label = "Age:";
    }
    else {
        let label = "Household Income:"
    }

    let chart_tip = d3.tip()
                      .attr("class","chart-tip")
                      .offset([80, 60])
                      .html(function(t) {
        return (`${t.state}<br>${label} ${t[x]}`);
                      });

    cg.call(chart_tip);

    //mouseover data
    cg.on("mouseover", function(n_data) {
        chart_tip.show(n_data);
    }).on("mouseout", function(n_data, index) { //event when mouse hovers over circle
            chart_tip.hide(n_data);
        });
    
    return cg;
    }

//function to update the y axis tips
function update_y_tips(y,cg) {
    if (y === "healthcare") {
        let label = "Healthcare (%):"
    }
    else if (y === "smokes") {
        let label = "Smokes (%):"
    }
    else {
        let label = "Obese (%):"
    }

    let chart_tip = d3.tip()
                      .attr("class","chart-y-tip")
                      .offset([60,80])
                      .html(function(yt) {
                          return (`${yt.state}<br>${label} ${yt[y]}`);
                      });
    cg.call(chart_tip);

    cg.on("mouseover", function(y_data) {
        chart_tip.show(y_data);
    }).on("mouseout", function(y_data, index) {
        chart_tip.hide(y_data);
    });

    return cg;
}


//==========================================================
//Load csv file
d3.csv("assets/data/data.csv").then(function(news_data) {
    console.log(news_data[0]);
//==========================================================
//data for the scatter chart
    Object.entries(news_data).forEach(([key,news]) => {
        //Test object load
        // console.log(news.state);
        news.poverty = +news.poverty;
        news.healthcare = +news.healthcare;
        news.age = +news.age;
        news.smokes = +news.smokes;
        news.obesity = +news.obesity;
        news.income = +news.income;

        console.log(news.income);
    });
//==========================================================
    //Scales the X-Axis, if I remember...
    let XLinear_Scale = X_Scale(news_data,x_news);

    let YLinear_Scale = Y_Scale(news_data,y_news);
//==========================================================
    //Creates the axes functions
    let bottom_axis_2 = d3.axisBottom(XLinear_Scale);
    let y_axis = d3.axisLeft(YLinear_Scale);
//==========================================================
    //append x-axis format
    let xAxis = scatter_chart.append("g")
                             .classed("x-axis", true)
                             .attr("transform", `translate(0, ${height})`)
                             .call(bottom_axis_2);

    //appends y-axis format
    let yAxis = scatter_chart.append("g")
                             .classed("y-axis", true)
                             .attr("transform", `translate(${width},0)`)
                             .call(y_axis);

//==========================================================
    //append the original data tips

    let circle_shape = scatter_chart.selectAll("circle")
                                    .data(news_data)
                                    .enter()
                                    .append("circle")
                                    .attr("cx", c => XLinear_Scale(c[x_news]))
                                    .attr("cx", c => YLinear_Scale(c.healthcare))
                                    .attr("r", 20)
                                    .attr("fill","#FF7400")
                                    .attr("opacity","0.60");
    
    //Creates labels for 2nd axis
    let labels_group = scatter_chart.append("g")
                                    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    let poverty_label = labels_group.append("text")
                                .attr("x", 0)
                                .attr("y", 20)
                                .attr("value", "poverty")//event listener
                                .classed("active", true)
                                .text("In Poverty (%)");
    let 



}).catch(function(error) {
    console.log(error);
});
//==========================================================