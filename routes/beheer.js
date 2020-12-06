//var express = require('express');


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

//var kennel = require("./model.js");
var app = express();

/* GET beheer page. */

  //res.render('beheer', {title: ' '})


  var mongoDBurl = 'mongodb+srv://SanderDeSutter:OW1g8KoMRsB72c61@cluster0.vm6gp.mongodb.net/DansScoolMove?retryWrites=true&w=majority';

  //const schema = new Schema({voornaam: 'string', achternaam: 'string', leeftijd: 'string', geslacht: 'string', betaald: 'Boolean', mailadres: 'String', dansstijl: 'String'});
  //var port = process.env.PORT || 8080;

  // app.listen(port, function (err){
  //   if(err){console.log(err)}
  //   console.log('Node.js listening to port ' +port);
  // });


  // Model.find({}, function(err, data){
  //   if(err){console.log(err)}
  //   console.log(data);
  //   if(data.length == 0){
  //     console.log('Geen data');
  //   }else{
  //     console.log(data);
  //   }
  // })

MongoClient.connect(mongoDBurl, {useNewUrlParser: true, useUnifiedTopology: true},function (err, db){
  if(err) console.log(err);
  var dbo = db.db("DansScoolMove");
  dbo.collection("Inschrijvingen").find({}).toArray( function (err, result){
    if(err) console.log(err);
    for(i=0; i<result.length; i++){
      console.log(result[i].voornaam);
    }

    //console.log(result[0].voornaam);
    db.close();
    router.get('/', function(req, res, next) {
      res.render('beheer', {n: result});

    });

  });
});


module.exports = router;