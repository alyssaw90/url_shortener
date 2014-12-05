var express = require("express");
var bodyParser = require("body-parser");
var db = require ("./models/index.js");
var models = require("./models");
var app = express();
var Hashids = require("hashids"),
	hashids = new Hashids("urlshortener")
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));

var id = hashids.encode(12345);

app.get("/", function(req, res){
	res.render("index"); 
});

// app.post("/create", function(req,res){
// 	db.Link.create({"url": req.body.fullurl}).done(function(err, data){
// 		var dataId = data.id;
// 		var shortResults = hashids.encode(dataId);
// 		data.short = shortResults;
// 		data.save().done(function(err, data2){
// 			console.log(data2);
// 			res.render("create", data2);
// 		});
// 	})
// });



app.post("/create", function(req,res){
	
	models.Link.findOrCreate({where:{"url": req.body.fullurl}}).done(function(err, data, created){
		// res.send(data);
		var dataId = data.id;
		var shortResults = hashids.encode(dataId);
		if(created){
			data.short = shortResults;
			
			data.save().done(function(err, data2){
				res.render("create", {short: data2.short});
			});
		}else {
			console.log("Already has a hash!")
			res.render("create", {"short": data.short})
		}
	})
	// res.redirect("/create");
});

// app.get("/create", function(req, res){
// 	res.render("create");
// })

app.get("/:id", function(req, res){
	db.Link.find({where: {short: req.params.id} }).then(function(row){
		res.redirect(row.url);
	})

});

app.listen(process.env.PORT || 3000)
