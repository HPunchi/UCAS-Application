const express = require("express");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const fs = require('fs');
const http = require("http");
const DataStore = require("nedb");

var accountsDatabase = new DataStore("accountsDatabase.db");
accountsDatabase.loadDatabase();
var chatsDatabase = new DataStore("chatsDatabase.db");
chatsDatabase.loadDatabase();
var tempDatabase = new DataStore("tempDatabase.db");
tempDatabase.loadDatabase();


const app = express();

//SET STATIC FOLDER
app.use("/", express.static(path.join(__dirname, "public")));

app.use(express.json({limit: "1mb"}));


app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
	
});
//=============================================================================\\

var codeVerifArr = [];
app.post("/codeSendStream", (req, res) => {
	var userEmail = req.body.email;


	//var template = fs.readFileSync('emailVerif.html',{encoding:'utf-8'});


	verifCode = (Math.floor(100000 + Math.random() * 900000)).toString();
	var userMsg = "Hello, this is your verification code: " + verifCode + "."; 

	codeVerifArr.push([userEmail, verifCode]);

	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  secure: true,
	  port: 465,

	  auth: {
	    user: 'ultramessage.verify@gmail.com',
	    pass: 'hcrttinenygnqkpy',


	  }
	});

	var mailOptions = {
	  from: 'ultramessage.verify@gmail.com',
	  to: userEmail,
	  subject: 'Sign Up - Verification',
	  text: userMsg,
	  
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    res.json({serverResponse:"error occured", errorMsg: error});
	  } else {
	    res.json({serverResponse:"email sent", nmr: info.response});
	  }
	});
});
app.post("/verifyCodeStream", (req, res) => {
	var userEmail = req.body.email;
	var userCode = req.body.userCode;

	console.log(userEmail, userCode);


	var codeCorrect = false;
	for (var i=0;i<codeVerifArr.length;i++){
		if (codeVerifArr[i][0] == userEmail){
			if (codeVerifArr[i][1] == userCode){
				codeVerifArr.splice(i, 1);
				codeCorrect = true;
				break;
			}
		}
	}
	if (codeCorrect == true){
		res.json({status:"correct"});
	}else{
		res.json({status:"incorrect"});
	}
});
app.post("/verifyUsernameStream", (req, res) => {
	var username = req.body.username;

	accountsDatabase.find({}, {username:1, _id:0}, (error, data) => {
		if (error){
			res.json({status:"error"});
			return;
		}
		var usernames = [];
		for (var i=0;i<data.length;i++){
			usernames.push(data[i].username);
		}
		if (usernames.includes(username)){
			res.json({status:"username-taken"});
		}else{
			res.json({status:"username-valid"});
		}
	});
});
app.post("/mainRegister", (req, res) => {
	var registerObj = req.body.register;
	accountsDatabase.insert(registerObj, (err, doc) => {
		if (err){
			res.json({status:"error"});
		}else{
			res.json({status:"success"});
		}
	});
})
//============================================================================\\
app.post("/loginStream", (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	
	accountsDatabase.find({username:username, password:password}, (error, data) => {
		if (error){
		    res.json({status:"error"});
			return;
		}
		if (data.length > 0){

			res.json({status:"login-success", accountToken:(data[0]["_id"]).toString()});
		}else{
			res.json({status:"login-failed"});
		}
		
	});
});
//============================================================================\\
app.post("/accountDataStream", (req, res) => {
	var accountToken = req.body.accountToken;

	accountsDatabase.find({"_id":accountToken}, (error, data) => {
		if(error){
			res.json({status:"error"});
			return;
		}
		
		var data = data[0];
		var returnObj = {
			username: data.username,
			theme: data.theme,
			pfp: data.pfp,
			wp: data.wallpaper
		};
		res.json({status:"success", returnObj:returnObj});
	});
});
app.post("/addFriendStream", (req, res) => {
	var recName = req.body.recName;
	var accountToken = req.body.accountToken;
	var username = req.body.username;
	var timestamp = req.body.timestamp;

	accountsDatabase.find({username:recName}, (error, data) => {
		if (error){
			res.json({status:"error"});
			return;
		}
		if (data.length == 0){
			res.json({status:"user-not-found"});
			return;
		}
		
		var recToken = data[0]["_id"];
		var recContacts = data[0].contacts;
		if (recContacts.includes(username)){
			res.json({status:"contact-already-added"});
			return;
		}
		createNewChat([accountToken, recToken], accountToken, true, [username, recName], timestamp);

		updateAccountContacts(accountToken, recName);
		updateAccountContacts(recToken, username);

		res.json({status:"chat-created"});
	});
});
app.post("/pullChatsStream", (req, res) => {
	var accountToken = req.body.accountToken;
	accountsDatabase.find({"_id":accountToken}, (error, data) => {
		if (error){
			res.json({status:"error"});
			return;
		}
		res.json({status:"success", chatArr:data[0].chats});
	});	
});
app.post("/openChatStream", (req, res) => {
	var accountID = req.body.accountID;
	var chatID = req.body.chatID;

	chatsDatabase.find({"_id":chatID}, (error, data) => {
		if (error){
			res.json({status:"error"});
		}
		var totalMessages = data[0].messages;
		res.json({status:"success", totalMessages:totalMessages});
	});
});
app.post("/sendMsgStream", (req, res) => {
	var messageObj = req.body.messageObj;
	var chatID = req.body.chatID;
	var accountID = req.body.accountID;
	var newTimestamp = req.body.newTimestamp;
	var recName = req.body.recName;

	accountsDatabase.find({"username":recName}, (err, docs) => {
		var recID = docs[0]["_id"];
		chatsDatabase.find({"_id":chatID}, (error, data) => {
			if(error){
				res.json({status:"error"});
				return;
			}
		
			var prevMessages = data[0].messages;
			var currentMessages = data[0].messages;
			currentMessages.push(messageObj);
			
			chatsDatabase.update({"_id":chatID}, { $set:{messages:currentMessages, timestamp:newTimestamp} }, (error, numReplaced) => {
			});
			chatsDatabase.persistence.compactDatafile();
			
			updateAccountChatTimestamp(accountID, chatID, newTimestamp);
			updateAccountChatTimestamp(recID, chatID, newTimestamp);

			res.json({status:"message-sent"});
			
			
		});
	});	
});	
app.post("/messageCheckStream", (req, res) => {
	var chatID = req.body.chatID;
	var accountID = req.body.accountID;
	var prevMessages = req.body.prevMessages;

	chatsDatabase.find({"_id":chatID}, (error, data) => {
		if (error){
			res.json({status:"error"});
			return;
		}
		var messagesArr = data[0].messages;
		var newMessages = splitArrays(prevMessages, messagesArr);
		res.json({status:"success", newMessages:newMessages});
	});
});
app.post("/patrolOtherChatsStream", (req, res) => {
	var accountID = req.body.accountID;
	var otherChats = req.body.otherChats;
	var pendingNotifications = [];

	for (var i=0;i<otherChats.length;i++){

		var currentChatID = otherChats[i][1];
		var currentTimestamp = otherChats[i][2];

		verifyTimestamp(accountID, currentChatID, currentTimestamp);

	}
	
	fs.readFile("temp/" + accountID + ".txt", "utf8", (error, data) => {
		console.log("reading from file");
		/*
		var dataArr = data.split("\n");
		var updatedArr = [];
		for (var i=0;i<dataArr.length;i++){
			updatedArr.push(dataArr[i].split(" "));
		}
		updatedArr.pop();
		//fs.unlinkSync("temp/" + accountID + ".txt");

		console.log("UPDATED ARR  = ", updatedArr);*/
	});


	res.json({status:"success", pushedNotifications:pendingNotifications});
});
const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log("Server started on port " + PORT.toString()));


/*
accountsDatabase.find({}, {age:1, _id:0}, (error, data) =>{
	if (error){
		console.log(error);
		return;
	}
	var ages = [];
	for (var i=0;i<data.length;i++){
		ages.push(data[i].age);
	}
	console.log(ages);
});*/

function updateAccountContacts(accountID, recName){
	accountsDatabase.find({"_id":accountID}, (error, data) => {
		var dataObj = data[0];
		var prevContacts = dataObj.contacts;
		var currentContactArr = dataObj.contacts;
		currentContactArr.push(recName);
		accountsDatabase.update({"_id":accountID}, { $set:{contacts:currentContactArr} }, (error, numReplaced) => {
		});
		accountsDatabase.persistence.compactDatafile();
	});
}
function createNewChat(usersIncludedArr, creator, dmStat = false, usernames = [], timestamp){
	var newChatObj = {
		usersIncluded: usersIncludedArr,
		creator: creator,
		messages: [],
		timestamp: timestamp,
	};
	chatsDatabase.insert(newChatObj, (error, doc) => {
		if (error){
			return false;
		}
		var newChatToken = doc["_id"];

		if (dmStat == true){
			addChatToAccount(usersIncludedArr[0], [usernames[1], newChatToken, timestamp]);
			addChatToAccount(usersIncludedArr[1], [usernames[0], newChatToken, timestamp]);
		}else{
			for (var i=0;i<usersIncludedArr.length;i++){
				var currentUser = usersIncludedArr[i];
				addChatToAccount(currentUser, newChatToken);
			}
		}

		
		
	});	
}
function addChatToAccount(accountID, newAddition){
	accountsDatabase.find({"_id":accountID}, (error, data) => {
		var prevChats = data[0].chats;
		var currentChats = data[0].chats;
		currentChats.push(newAddition);
		accountsDatabase.update({"_id":accountID}, { $set:{chats:currentChats} }, (error, numReplaced) => {
		});
		accountsDatabase.persistence.compactDatafile();
	});
}
function splitArrays(arr1, arr2){
	var newArr = [];
	for (var i=arr1.length;i<arr2.length;i++){
		newArr.push(arr2[i]);
	}
	return newArr
}
function updateAccountChatTimestamp(accountID, chatID, newTimestamp){
	accountsDatabase.find({"_id":accountID}, (aErr, aData) => {
		var currentChatArr = aData[0].chats;
		for (var i=0;i<currentChatArr.length;i++){
			var currentID = currentChatArr[i][1];
			if (currentID == chatID){
				currentChatArr[i][2] = newTimestamp
			}
		}
		accountsDatabase.update({"_id":accountID}, { $set:{chats:currentChatArr}}, (error, numReplaced) => {
		});
		accountsDatabase.persistence.compactDatafile();
	});
}
function verifyTimestamp(accountID, chatID, userTimestamp){
	chatsDatabase.find({"_id":chatID}, (error, data) => {
		var chatTimestamp = data[0].timestamp;
		var filename = "temp/" + accountID + ".txt";
		var filedata = chatID + " " + chatTimestamp.toString() + "\n";
		fs.appendFile(filename, filedata, (err) => {
		});
		console.log("written to file");
	});
}