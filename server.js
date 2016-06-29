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
            $('.header').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

                var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag.
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                title = data.children().first().text();
                release = data.children().last().children().text();
           // Once we have our title, we'll store it to the our json object.

                movie_json.title = title;
                movie_json.release = release;
            })
            $('.star-box-giga-star').filter(function(){
                var data = $(this);

                // The .star-box-giga-star class was exactly where we wanted it to be.
                // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

                rating = data.text();

                movie_json.rating = rating;
            })
        }
  })
  res.send('Finished Request: ' + JSON.stringify(movie_json) = '. If its empty, we have failed to find the desired information.')
})
app.listen(`8081`);
console.log(`magic happens on port 8081`);
exports=module.exports=app;
