var nodemailer = require('nodemailer');
var fs = require('fs');

var template = fs.readFileSync('emailVerif.html',{encoding:'utf-8'});

var userEmail = "17HPunchi@rgshw.com";
var verifCode = (Math.floor(100000 + Math.random() * 900000)).toString();

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
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});