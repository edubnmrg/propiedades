var express=require(`express`);
var fs =require(`fs`);
var request=require(`request`);
var cheerio=require(`cheerio`);
var app=express();
var exphbs  = require('express-handlebars');
var auth = require('basic-auth');
var cookieParser = require('cookie-parser');
var database = require('./database').instance;

console.log(database.read(function(visitas){ console.log(visitas)}));

app.use(cookieParser());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var basicAuth = require('basic-auth');
VALID_USER = "AGENTE"
VALID_PASSWORD = "ORION"

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === VALID_USER && user.pass === VALID_PASSWORD) {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.get(`/`,auth,function(req,res){

  res.cookie("agente", true);
  database.read(function(visitas){
    res.render('props_form',{visitas});
  })

});

  app.get(`/props`,function(req,res){
    if(req.query.query_url){
      url = req.query.query_url
      request(url, function(error, response, html){

          if(!error){
            database.read(function(visitas){
              //find record
              //if not record: database.write(record)
              //if not record:
            })

            var found = false;
            console.log("dimension "+visitas.length);
            console.log(url);
            for (var i = 0; i < visitas.length && !found; i++) {
              if (visitas[i] === url) {
                visitas[i].numero++
                found = true;
              }
            }
            if(!found)  {
              database.write('./historial.txt',(url+","+"0"+"\n"),function(err){
                           if (err) { throw err; }
                           console.log('wrote ' + written + ' bytes');
                         });
              };
            }else{
                fs.unlinkSync('./historial.txt');
                 for (var i = 0, len = visitas.length; i < len; i++) {
                   database.write('./historial.txt',visitas[i].texto+","+visitas[i].numero+"\n",function(err){
                                if (err) { throw err; }
                                console.log('wrote ' + written + ' bytes');
                              });

                 };


            }

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

          });
          //console.error(titulo, precio, descripcion, datos, imagenes_arr)
          var agent = (req.cookies.agente == "true")
          res.render('props',{titulo,precio,descripcion,datos,imagenes_arr,agent});
      }
    });
  // app.post('/boton', function(sReq, sRes){
  //   console.log(sReq.query.cliente);
  // });

app.listen(`8081`);
console.log(`Server is up and running`);
exports=module.exports=app;
