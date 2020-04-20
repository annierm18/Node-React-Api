const redis = require("redis")


module.exports = {
   createConnection : () => {
      return new Promise((resolve, reject) => {
        const client = redis.createClient()
        client.on('connect', () => {
           resolve(client)
        })
        client.on('error', () => {
          reject("Error: Failed to connect")
         })

      }).catch(err => console.log(err));
   }
   
}

var myfunc = module.exports.createConnection();
myfunc.then(function () {
     console.log("Promise Resolved");
}).catch(function () {
     console.log("Promise Rejected");
});
