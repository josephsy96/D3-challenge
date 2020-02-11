//set chart height and width
let height_svg = 1080;
let width_svg = 1920;

//Load csv file

d3.csv("data/data.csv").then(function(news_data) {
    console.log(news_data.state);

}).catch(function(error) {
    console.log(error);
});
