var express=require(`express`);
var fs =require(`fs`);
var request=require(`request`);
var cheerio=require(`cheerio`);
var app=express();
var exphbs  = require('express-handlebars');
var auth = require('basic-auth');
var cookieParser = require('cookie-parser');
var database = require('./database').instance;
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sqlben',
  database : 'new_schema'
});


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
connection.connect(function(err){
if(!err) {
    console.log("Conectado a Base de Datos ... nn");
} else {
    console.log("Error conectando a Base de Datos ... nn");
}
});

app.get(`/`,auth,function(req,res){

  res.cookie("agente", true);
  database.read(function(visitas){
    console.log("carga "+visitas.length);
    res.render('props_form',{visitas});
  })

});

  app.get(`/props`,function(req,res){
    if(req.query.query_url){
      url = req.query.query_url
      request(url, function(error, response, html){

          if(!error){
            var agent = (req.cookies.agente == "true")
            database.read(function(visitas){

              //find record
              //if not record: database.write(record)
              //if not record:
              var found = false;
              console.log("dimension "+visitas.length);
              console.log(url);
              for (var i = 0; i < visitas.length && !found; i++) {
                console.log(visitas[i].texto +" "+ url+" "+(visitas[i].texto === url))
                if (visitas[i].texto === url) {
                  visitas[i].numero++
                  found = true;
                }
              }
              if(!found)  {
                database.write(url+","+"0"+"\n");
                var q="insert into consultas(id,url,agente_id,cliente_id,visitas) values(default," + url +",4,1,default"
                connection.query(q, function(err, rows, fields) {
                  if (!err)
                    console.log('Se agrego  ', rows, 'fila(s)');
                  else
                    console.log('Error insertando url.');
                });
              }else{
                if(!agent){
                  fs.unlinkSync('./historial.txt');
                   for (var i = 0, len = visitas.length; i < len; i++) {
                     database.write(visitas[i].texto+","+visitas[i].numero+"\n");
                   };
                   connection.query("update consultas set visitas=visitas+1 where url='"+url+"'", function(err, rows, fields) {
                     if (!err)
                       console.log('Se modifico  ', rows, 'fila(s)');
                     else
                       console.log('Error incrementando visitas.');
                   });
                 }

              }
            });
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
          };
          //console.error(titulo, precio, descripcion, datos, imagenes_arr)

          res.render('props',{titulo,precio,descripcion,datos,imagenes_arr,agent});
      });
    }
  });
  // app.post('/boton', function(sReq, sRes){
  //   console.log(sReq.query.cliente);
  // });
  app.get(`/clientes`,function(req,res){
    connection.query('SELECT * from clientes', function(err, rows, fields) {
    if (!err)
      res.render('clientes',{rows});
    else
      console.log('Error while performing Query.');
    });
  });
app.listen(`8081`);
console.log(`Server is up and running`);
exports=module.exports=app;
