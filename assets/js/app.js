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

//Set the chart svg
let scatter_chart = news_svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.right})`);

//==========================================================
//Load csv file
d3.csv("assets/data/data.csv").then(function(news_data) {
    console.log(news_data[0]);

    Object.entries(news_data).forEach(([key,news]) => {
        //Test object load
        console.log(news.state);
    });


}).catch(function(error) {
    console.log(error);
});
//==========================================================