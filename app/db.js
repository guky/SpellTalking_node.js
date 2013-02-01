var mongo = require('mongodb');
var host = process.env['DOTCLOUD_DB_MONGODB_HOST'] || 'spelltalking-guky-db-0.azva.dotcloud.net';
var port = process.env['DOTCLOUD_DB_MONGODB_PORT'] ||  15757;
port = parseInt(port);
var user = process.env['DOTCLOUD_DB_MONGODB_LOGIN'] || root;
var pass = process.env['DOTCLOUD_DB_MONGODB_PASSWORD'] || IpjtZc6yiGWGphRpq6eq;

var mongoServer = new mongo.Server(host, port, {});
var db = new mongo.Db("test", mongoServer, {auto_reconnect:true});

app.get("/", function(req, res){
    var html = '<div id="content" data-stack="node" data-appname="' + process.env['DOTCLOUD_PROJECT'] + '">';
    html += 'Hello World, from Express!';
   

  /*  db.collection("test", function(err, collection){
        if(err) console.log(err);
        collection.find(function(err, cursor){
            if(err) console.log(err);
            res.send(html);
        });
    })*/
	 res.send(html);
});

db.open(function(err){
    if(err) console.log(err);

    if(user && pass) {
        db.authenticate(user, pass, function(err) {
            
        });
    }
    else {
        
    }
});