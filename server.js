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

app.get(`/orion`,function(req,res){
  //tt3691740
  url = 'http://www.zonaprop.com.ar/propiedades/av-callao-2000-recoleta-capital-federal-31744053.html'
  if(req.query.query_url){

    url = req.query.query_url
    request(url, function(error, response, html){
        if(!error){

            var $ = cheerio.load(html);

            var fotos, title, release, rating, precio, expensas, descripcion, titulo, datos, imagen;

            var contenedor_begin = "<div class='container' style='margin:-8px;background: #eee'><div class='header' style='height:90px;background:rgba(0,0,0,0.6)' ><img style='position:absolute;top:15px;left:20px;display:none;' width='201' height='75' src='http://orionpropiedades.com/images/logoOrionProp.png'/></div>"
            var contenedor_end = "</div>"

            var pagina_begin = "<div style='width:80%;background:white;box-shadow:0px 0px 2px #222222;border: 1px solid #e1e1e1;margin:40px auto;padding:40px;'>";
            var pagina_end = "</div>";

            titulo = "<h1>" + $("h1").text() + "</h1>"
            precio = "<h2> Precio de Venta: " + $(".venta").text() + "</h2>"
            descripcion = "<p>" + $("#id-descipcion-aviso").text().trim() + "</p>"
            datos = "<ul>" + $(".aviso-datos ul").html() + "</ul>";
            var imagenes_html = "";

            $(".rsMainSlideImage").each(function(i, elem){
                imagenes_html = imagenes_html +  "<img style='vertical-align:top;display:inline-block; margin: 10px' width=300 src=" + $(elem).attr("href") + ">"
            })

            texto = contenedor_begin + pagina_begin + titulo + descripcion + precio + datos + imagenes_html + pagina_end + contenedor_end;

        }
        //res.send(html)
        res.send(texto)
    })
  } else {
    var style = "width: 300px;height: 40px;line-height: 40px;font-size: 16px;padding: 10px;"
    res.send("<h1>Pegar url</h1><form method=GET action='/orion'><input style='"+style+"' type='text' name='query_url'></form>")
  }
})


app.listen(`8081`);
console.log(`magic happens on port 8081`);
exports=module.exports=app;
