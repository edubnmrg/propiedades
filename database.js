var fs =require(`fs`);
///leer linea
///escribir un item
///modificar registro

function Database(){}

Database.prototype.read = function(callback){
  var visitas = [];
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./historial.txt')
  });

  lineReader.on('line', function (line) {
    var partes=[];
    partes=line.split(",");
    //console.log(partes[0]+partes[1]);
    visitas.push({texto: partes[0],numero: partes[1]});
  });
  lineReader.on('close',function(){
    callback(visitas)
  });
  return true;
}
Database.prototype.write = function(item){
  var fs = require('fs');
  //console.log("modulo "+item);
  fs.appendFile("./historial.txt", (item), function (err) {


    //console.log("The item was saved!");
  });
}

//[string, numero]
//registro[1] = registro[1] + 1;

Database.prototype.flush = function(){

}
// var db = new Database();
//
// db.read(function(res){ console.log(res)})
// db.write({ prop: "cabildo", numero: "5"})
//db.read(function(res){ console.log(res)})

module.exports.instance = new Database();
