var express=require(`express`);
var fs =require(`fs`);
var request=require(`request`);
var cheerio=require(`cheerio`);
var app=express();

app.get(`/scrape`,function(req,res){
  //tt3691740
  var url = 'http://www.imdb.com/title/' + req.query.movie_id;
  var movie_json = {}
  request(url, function(error, response, html){
    if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var movie_json = { title : "", release : "", rating : ""};
            $('.title_wrapper h1').filter(function(){
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

app.get(`/zonaprop`,function(req,res){
  //tt3691740
  url = 'http://www.zonaprop.com.ar/propiedades/av-callao-2000-recoleta-capital-federal-31744053.html'
  if(req.query.zonaprop_url){

    url = req.query.zonaprop_url
    request(url, function(error, response, html){
        if(!error){

            var $ = cheerio.load(html);

            var fotos, title, release, rating, precio, expensas, descripcion, titulo, datos, imagen;

            titulo = "<h1>" + $("h1").text() + "</h1>"
            precio = "<h2> Precio de Venta: " + $(".venta").text() + "</h2>"
            descripcion = "<p>" + $("#id-descipcion-aviso").text().trim() + "</p>"
            datos = $(".aviso-datos ul").html()
            var imagenes_html = "";

            $(".rsMainSlideImage").each(function(i, elem){
                imagenes_html = imagenes_html +  "<img style='display:inline-block; margin: 10px' width=300 src=" + $(elem).attr("href") + ">"
            })

            texto = titulo + descripcion + precio + datos + imagenes_html

        }
        //res.send(html)
        res.send(texto)
    })
  } else {
    var style = "width: 300px;height: 40px;line-height: 40px;font-size: 16px;padding: 10px;"
    res.send("<h1>Pegar url de zona prop</h1><form method=GET action='/zonaprop'><input style='"+style+"' type='text' name='zonaprop_url'></form>")
  }
})


app.listen(`8081`);
console.log(`magic happens on port 8081`);
exports=module.exports=app;
