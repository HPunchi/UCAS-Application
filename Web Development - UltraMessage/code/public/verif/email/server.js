var express = require("express");
var nodemailer = require('nodemailer');
var fs = require('fs');
var app = express();


var complete = false;

app.use(express.static("public"));

app.get("/", function(req, res){
	res.send("Hello, World!");
});
var server = app.listen(8000, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Listening at http://%s:%s", host, port);
	
});
app.get("/process_get", function(req, res){
	response = {
		name: req.query.name,
		email: req.query.email,
		code: req.query.kol,
	}
	var name = response.name;
	var email = response.email;
	var verifCode = response.code;

	if (name == "" && email == ""){
		console.log("Corrupt process closed and returned successfully...");
		return 0;
	}


	console.log("Name = ", name);
	console.log("Email = ", email);
	console.log("Verification Code = ", verifCode);



	var template = fs.readFileSync('emailVerif.html',{encoding:'utf-8'});

	var userEmail = email;
	//var verifCode = (Math.floor(100000 + Math.random() * 900000)).toString();

	var seq = ["{", "}", "$", "&", "*", "£"];
	var tA = template.split("");

	for (var i=0; i<seq.length;i++){
	 
	  tA[tA.indexOf(seq[i])] = verifCode[i];
	}
	template = tA.join("");


	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'ultramessage.verify@gmail.com',
	    pass: 'ultramessage123'
	  }
	});

	var mailOptions = {
	  from: 'hpunchi2005@gmail.com',
	  to: userEmail,
	  subject: 'Sign Up - Verification',
	  text: '',
	  html: template,
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log("There was an error in sending the email.");
	  } else {
	   	console.log("Email sent successfully to stated address.");
	  }
	
	});
});
