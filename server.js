var express=require(`express`);
var fs =require(`fs`);
var request=require(`request`);
var cheerio=require(`cheerio`);
var app=express();
var exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});



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
  if(req.query.query_url){

    url = req.query.query_url
    request(url, function(error, response, html){
      console.log(error)
        if(!error){

            var $ = cheerio.load(html);

            var precio, descripcion, titulo, datos;
            titulo = $("h1").text()
            precio =$(".venta").text()
            descripcion =  $("#id-descipcion-aviso").text().trim()
            datos=[];
            $(".aviso-datos ul li").each(function(i, elem){
              datos.push({texto:$(elem).text()})
            })

            var imagenes_arr=[];
            $(".rsMainSlideImage").each(function(i, elem){
                imagenes_arr.push({imagen:$(elem).attr("href")})
            })
            console.error(html.toString())

        }
        //console.error(titulo, precio, descripcion, datos, imagenes_arr)
        res.render('props',{titulo,precio,descripcion,datos,imagenes_arr});
    })
  } else {
    res.render('props_form');
  }
})
app.get(`/clarin`,function(req,res){
  //tt3691740
  url = 'http://www.clarin.com.ar'

  request(url, function(error, response, html){
      if(!error){

          var $ = cheerio.load(html);

          var href, title, target;

          var encabezamiento="Titulos Clarin"
          var titulos_html = "";
          var titulos = [];
          var resumen_html=""
          $("article.nota , article.nota-img-full ").each(function(i, elem){
              titulos.push({
                title:$(elem).find("a").attr("title"),
                description:$(elem).find("p").text()
              });
              // fs.open('./my_file.txt', 'a', function opened(err, fd) {
              // if (err) { throw err; }
              // var writeBuffer = new Buffer($(elem).find("a").attr("title") + " " + $(elem).find("p").text()),
              // bufferPosition = 0,
              // bufferLength = writeBuffer.length, filePosition = null;
              // fs.write( fd,
              // writeBuffer,
              // bufferPosition,
              // bufferLength,
              // filePosition,
              // function wrote(err, written) {
              // if (err) { throw err; }
              // console.log('wrote ' + written + ' bytes');
              // });
              // });
          })



          // var sqlite3 = require('sqlite3').verbose();
          // var db = new sqlite3.Database('mydb.db');
          // var check;
          // db.serialize(function() {
          //
          //   db.run("CREATE TABLE if not exists clarin (id INTEGER PRIMARY KEY ASC,titulo TEXT,descripcion TEXT)");
          //   var stmt = db.prepare("INSERT INTO clarin VALUES (?,?)");
          //   console.log("antes");
          //   titulos.forEach(function(ele){
          //     console.log(ele.title);
          //     stmt.run(ele.title,ele.description);
          //   });
          //
          //   stmt.finalize();
          //   console.log("desupes");
          //   db.each("SELECT rowid AS id, titulo,descripcion FROM clarin", function(err, row) {
          //       console.log(row.id + ": " + row.titulo+" "+row.descripcion);
          //   });
          // });
          //
          // db.close();

      }
      //res.send(html)
      //res.send(texto)
      res.render('clarin',{encabezamiento,titulos});
    })
})


app.listen(`8081`);
console.log(`magic happens on port 8081`);
exports=module.exports=app;
