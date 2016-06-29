var express=require(`express`);
var fs =require(`fs`);
var request=require(`request`);
var cheerio=require(`cheerio`);
var app=express();

app.get(`/scrape`,function(req,res){
  var url = 'http://www.imdb.com/title/tt3691740/';
  var movie_json = {}
  request(url, function(error, response, html){
    if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var movie_json = { title : "", release : "", rating : ""};
            $('.title_wrapper h1').filter(function(){
                console.log("hola");
                var data = $(this);
                movie_json.title = $(this).text();
                //movie_json.release = release;
            })
            $('.star-box-giga-star').filter(function(){
                var data = $(this);

                // The .star-box-giga-star class was exactly where we wanted it to be.
                // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

                rating = data.text();

                movie_json.rating = rating;
            })
        }
        res.send('Finished Request: ' + JSON.stringify(movie_json) + '. If its empty, we have failed to find the desired information.')
  })
})
app.listen(`8081`);
console.log(`magic happens on port 8081`);
exports=module.exports=app;
