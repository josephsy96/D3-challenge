
//set chart height and width
let height_svg = 600;
let width_svg = 1100;

// let height_svg = window.innerHeight;
// let width_svg = window.innerWidth;

//Set default margins
let margin = {
    top: 30,
    right: 70,
    left: 110,
    bottom: 150
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
function X_Scale(news_data, x_value) {
    //creates the scales for x
    let x_linear_scale = d3.scaleLinear()
                        .domain([d3.min(news_data, nd => nd[x_value]) * 0.8,
                        d3.max(news_data, nd => nd[x_value]) * 1.2
                    ]).range([0, width]);
    return x_linear_scale;
}

//updates y axis
function Y_Scale(news_data, y_value) {
    //creates the scales for y
    // let y_linear_scale = d3.scaleLinear()
    //                        .domain([d3.max(news_data, nd => nd[y_value]),
    //                        d3.min(news_data, nd => nd[y_value])]).range([height,0]);
    let y_linear_scale = d3.scaleLinear()
                           .domain([0,d3.max(news_data, nd => nd[y_value])])
                           .range([height,0]);
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
        var label = "Poverty (%):";
    }
    else if (x === "age") {
        var label = "Age:";
    }
    else {
        var label = "Household Income:";
    }

    let chart_tip = d3.tip()
                      .attr("class","tooltip")
                      .offset([60, -50])
                      .html(function(t) {
                      return (`${t.state}<br>${label} ${t[x]}`);
                      });

    cg.call(chart_tip);

    //mouseover data
    cg.on("mouseover", function(n_data) {
        chart_tip.show(n_data,this);
    }).on("mouseout", function(n_data, index) { //event when mouse hovers over circle
            chart_tip.hide(n_data);
        });
    
    return cg;
    }

//function to update the y axis tips
function update_y_tips(y,cg) {
    if (y === "healthcare") {
        var label = "Healthcare (%):";
    }
    else if (y === "smokes") {
        var label = "Smokes (%):";
    }
    else {
        var label = "Obese (%):";
    }

    let chart_tip = d3.tip()
                      .attr("class","tooltip")
                      .offset([60,-50])
                      .html(function(y) {
                       return (`${y.state}<br>${label} ${y[y]}`);
                      });
    cg.call(chart_tip);

    cg.on("mouseover", function(y_data) {
        chart_tip.show(y_data,this);
    }).on("mouseout", function(y_data, index) {
        chart_tip.hide(y_data);
    });

    return cg;
}


//==========================================================
//Load csv file
d3.csv("assets/data/data.csv").then(function(news_data) {
    console.log(news_data);
//==========================================================
//data for the scatter chart
    news_data.forEach((news) => {
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

    // let y_linear_scale = d3.scaleLinear()
    //                        .domain([d3.max(news_data, nd => nd[y_news]),
    //                        d3.min(news_data, nd => nd[y_news])]).range([height,0]);

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
    // let yAxis = scatter_chart.append("g")
    //                          .classed("y-axis", true)
    //                          .attr("transform", `translate(${width},0)`)
    //                          .call(y_axis);
    let yAxis = scatter_chart.append("g").call(y_axis);

//==========================================================
    //append the original data tips

    let circle_shape = scatter_chart.selectAll("circle")
                                    .data(news_data)
                                    .enter()
                                    .append("circle")
                                    .attr("cx", c => XLinear_Scale(c[x_news]))
                                    // .attr("cy", c => YLinear_Scale(c[y_news]))
                                    .attr("cy", c => YLinear_Scale(c[y_news]))
                                    .attr("r", 20)
                                    .attr("fill","#FF7400")
                                    .attr("opacity","0.60")
                                    .html();
    console.log(circle_shape);
    //Creates labels for x axis
    let xlabels_group = scatter_chart.append("g")
                                    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    //Creates labels for y axis
    let ylabels_group = scatter_chart.append("g")
                                     .attr("transform", `translate(${height / 3}, ${width / 8.2})`);

    //==========================================================
    //For x axis labels
    let poverty_label = xlabels_group.append("text")
                                .attr("x", 0)
                                .attr("y", 20)
                                .attr("id","x-axis")
                                .attr("value", "poverty")//event listener
                                .classed("active", true)
                                .text("In Poverty (%)");
    
    let age_label = xlabels_group.append("text")
                                .attr("x",0)
                                .attr("y", 40)
                                .attr("id","x-axis")
                                .attr("value", "age")//event listener
                                .classed("inactive", true)
                                .text("Age (Median)");

    let income_label = xlabels_group.append("text")
                                   .attr("x",0)
                                   .attr("y",60)
                                   .attr("id","x-axis")
                                   .attr("value", "income")
                                   .classed("inactive", true)
                                   .text("Household Income (Median)");
    //==========================================================
    //For y axis labels

    let healthcare_label = ylabels_group.append("text")
                                        .attr("transform", "rotate(-90)")
                                        .attr("x", 0 - margin.left)
                                        .attr("y", 20 - (height / 2))
                                        .attr("dy", "1em")
                                        .attr("id","y-axis")
                                        .attr("value", "healthcare")
                                        .classed("active", true)
                                        .text("Lacks Healthcare (%)");

    let smoke_label = ylabels_group.append("text")
                                        .attr("transform", "rotate(-90)")
                                        .attr("x", 0 - margin.left)
                                        .attr("y", 0 - (height / 2))
                                        .attr("dy", "1em")
                                        .attr("id","y-axis")
                                        .attr("value", "smokes")
                                        .classed("inactive", true)
                                        .text("Smokes (%)");
    
    let obese_label = ylabels_group.append("text")
                                        .attr("transform", "rotate(-90)")
                                        .attr("x", 0 - margin.left)
                                        .attr("y", - 20 - (height / 2))
                                        .attr("dy", "1em")
                                        .attr("id","y-axis")
                                        .attr("value", "obesity")
                                        .classed("inactive", true)
                                        .text("Obese (%)");

    //This will update axes data...hopefully...
    let update_xCircles = update_x_tips(x_news,circle_shape);

    let update_yCircles = update_y_tips(y_news,circle_shape);
    
    xlabels_group.selectAll("text").attr("id","x-axis").on("click", function() {
        let x_data = d3.select(this).attr("id","x-axis").attr("value");

        //==========================================================
        console.log(x_data);
        if (x_data !== x_news) {
            x_news = x_data;

            XLinear_Scale = X_Scale(news_data, x_news);

            xAxis = render_X_axis(XLinear_Scale, xAxis);

            circle_shape = render_x_dots(circle_shape,XLinear_Scale,x_news);

            cg = update_x_tips(x_news, circle_shape);

            if (x_news === "age") {
                age_label.classed("active", true)
                         .classed("inactive", false);
                poverty_label.classed("active", false)
                             .classed("inactive", true);
                income_label.classed("active", false)
                            .classed("inactive", true);
            }
            else if (x_news === "income") {
                age_label.classed("active", false)
                         .classed("inactive", true);
                poverty_label.classed("active", false)
                             .classed("inactive", true);
                income_label.classed("active", true)
                            .classed("inactive", false);
            }
            else {
                age_label.classed("active", false)
                         .classed("inactive", true);
                poverty_label.classed("active", true)
                             .classed("inactive", false);
                income_label.classed("active", false)
                            .classed("inactive", true);
            }
        }

    });

    //==========================================================
    ylabels_group.selectAll("text").attr("id","y-axis").on("click", function() {
        
        let y_data = d3.select(this).attr("id","y-axis").attr("value");

        if (y_data !== y_news) {
            y_news = y_data;

            YLinear_Scale = Y_Scale(news_data, y_news);

            YAxis = render_Y_axis(YLinear_Scale, yAxis);

            circle_shape = render_y_dots(circle_shape,YLinear_Scale,y_news);

            cg = update_y_tips(y_news, circle_shape);

            if (y_news === "healthcare") {
                healthcare_label.classed("active", true)
                         .classed("inactive", false);
                smoke_label.classed("active", false)
                             .classed("inactive", true);
                obese_label.classed("active", false)
                            .classed("inactive", true);
            }
            else if (y_news === "smokes") {
                healthcare_label.classed("active", false)
                         .classed("inactive", true);
                smoke_label.classed("active", true)
                             .classed("inactive", false);
                obese_label.classed("active", false)
                            .classed("inactive", true);
            }
            else {
                healthcare_label.classed("active", false)
                         .classed("inactive", true);
                smoke_label.classed("active", false)
                             .classed("inactive", true);
                obese_label.classed("active", true)
                            .classed("inactive", false);
            }
            
        }
    });
}).catch(function(error) {
    console.log(error);
});
//==========================================================