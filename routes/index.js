var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var async = require("async");
const app = express();
const port = process.env.PORT || 3002;
const connect = require('../connections')
const redis = require("redis")
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/url/getUrl', (req, res) => {
 connect.createConnection().then(client => {
   var urls = [];
   client.keys('links:*', (err, keys) => {
      if (err) return  console.log(err);
      if(keys){
        async.map(keys, function(key, cb) {
          client.get(key, function (error, value) {
            if (error) return cb(error);
            var url = {};
            url['urlId']=key;
            url['data']=value;
            cb(null, url);
          });
        }, function (error, results) {
          if (error) return console.log(error);
          console.log(results);
          res.json({data:results});
         });
      }
   });


   // client.quit((err, reply) => {
   //     if(!err){
   //       console.log(reply)
   //     }else{
   //       console.log(err)
   //     }
   // })
 })
});

app.post('/url/addUrl', jsonParser, (req, res) => {
 connect.createConnection().then(client => {

     const url = JSON.stringify(req.body.url)

     var random = randomstring.generate(6);
     var key = "links:" + random;
     
     client.set(
      
      key, 
      url, 
      redis.print)
     client.get(key, (err, results) => {
       if(results){
           res.send(key)
       }else{
         res.send(err)
     }
 })
 client.quit((err, reply) => {
     if(!err){
         console.log(reply)
       }else{
       console.log(err)
       }
   })

 })
})

app.listen(port, () => {
 console.log('Example app listening on port!');
});




/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('index', { title: 'Express' });
});


module.exports = router;

