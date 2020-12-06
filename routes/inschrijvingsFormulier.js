var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('inschrijvingsFormulier', { title: ' ' });
});


// GET AJAX om aantal ingeschreven personen per les te krijgen:
router.get('/getAantalPerLes', (req, res) => {
	//for mongodb version 3.0 and up
	const MongoClient = require('mongodb').MongoClient;
	MongoClient.connect(mongoDB, function(err, client){
	   if(err) throw err;
        
	   let db = client.db('DansScoolMove');
	   await db.collection('Inschrijvingen').find({ "lesgroep": req.query["lesgroep"],  "dansstijl": req.query["dansstijl"] } ).toArray(function(err, result){
		 if(err) throw err;
              
		 res.send(result.length.toString());
		 client.close();
	   });
	});
});

// POST AJAX om iemand in te schrijven:
router.post('/schrijfIn', function(req, res) {
    console.log(req.body);
    req.body["betaald"] = false;
    const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(mongoDB, function(err, client){
	   if(err) throw err;
	   
	   let db = client.db('DansScoolMove');
        await db.collection('Inschrijvingen').insert(req.body);
        res.send('OK');
	});
});

module.exports = router;
