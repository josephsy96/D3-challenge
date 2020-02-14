//set chart height and width
let height_svg = 900;
let width_svg = 1000;

//Set default margins
let margin = {
    top: 30,
    right: 50,
    left: 50,
    bottom: 80
};


let width = height_svg - margin.left - margin.right;
let height = width_svg - margin.top - margin.bottom;

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

//==========================================================
//Update x axis scale for scatter chart
function X_Scale(health, x_value) {
    //creates the scales
    let x_linear_scale = d3.scaleLinear()
                        .domain([d3.min(health, h => h[x_value]) * 0.8,
                        d3.max(health, h => h[x_value]) * 1.2
                    ]).range([0, width]);
    return x_linear_scale;
}

//==========================================================
//Update the x axis values
function render_axes(new_x_scale, x_axis) {
    let bottom_axis = d3.axisBottom(new_x_scale);

    x_axis.transition()
            .duration(1200)
            .call(bottom_axis);

    return x_axis;
}

//==========================================================
//Render Chart Circles
function render_dots(circle_group, newXScale, x_value) {
    circle_group.transition()
                .duration(1200)
                .attr("cx", cir => newXScale(cir[x_value]));
    return circle_group;
}

//==========================================================
//function to update the circle groups
//cg = circle-groups
function update_tips(x,cg) {
    if (x === "poverty") {
        let label = "In Poverty (%)";
    }
    else {
        let label = "Age (Median)";
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

    let YLinear_Scale = d3.scaleLinear()
                          .domain([0, d3.max(news_data, nd => nd.poverty)])
                          .range([height,0]);
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
    scatter_chart.append("g")
                 .call(y_axis);



}).catch(function(error) {
    console.log(error);
});
//==========================================================