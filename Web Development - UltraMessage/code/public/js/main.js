var accountToken = "";
var totalChatArr = [];
var chatNameOpen = "";
var chatIDOpen = "";
var currentMessageArr = [];


var controlPanelOptions = ["Other", "Chats", "Account"];
function setTheme(themeName){
	localStorage.setItem("theme", themeName);
	document.documentElement.className = themeName;
}
function toggleTheme(){
	if (localStorage.getItem("theme") === "theme-dark"){
		setTheme("theme-light");
	}else{
		setTheme("theme-dark");
	}
}

function clearDIV(divName){
	document.getElementById(divName).innerHTML = "";
}
async function getAccountData(){
	accountToken = sessionStorage.getItem("accountToken");

	var sendObj = {
		accountToken: accountToken
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/accountDataStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "success"){
		var returnObj = dataFEEDBACK.returnObj;
		sessionStorage.setItem("username", returnObj.username);
		sessionStorage.setItem("theme", returnObj.theme);
		sessionStorage.setItem("pfp", returnObj.pfp);
		sessionStorage.setItem("wp", returnObj.wp);
		//document.getElementById("loggedInAs").innerText = username;
		return true;
	}else{
		location.href = "login.html";
		return false;
	}
}
async function addFriend(){
	var recName = prompt("Enter username of the person you would like to add:");
	if (recName == ""){
		return;
	}
	if (recName == username){
		alert("You cannot chat to yourself.");
		return;
	}


	var sendObj = {
		recName: recName,
		accountToken: accountToken,
		username: username,
		timestamp: (new Date()).getTime()
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/addFriendStream", options);
	const dataFEEDBACK = await response.json();
	alert(dataFEEDBACK.status);
	pullChats();
}
async function openChat(chatName){
	/*
	var chatName = prompt("Enter name of chat you would like to open?");
	if (chatName == ""){
		return;
	}*/
	var chatUsers = [];
	if (totalChatArr.length == 0){
		alert("Add friends to create chats.");
		return;
	}
	
	for (var i=0;i<totalChatArr.length;i++){
		if (totalChatArr[i][0] == chatName){
			var chatID = totalChatArr[i][1];

			var sendObj = {
				accountID: accountToken,
				chatID: chatID
			};
			const options = {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(sendObj),
			};
			const response = await fetch("/openChatStream", options);
			const dataFEEDBACK = await response.json();
			if (dataFEEDBACK.status == "success"){
				chatNameOpen = chatName;
				chatIDOpen = chatID;
				document.getElementById("chatOpen").innerText = chatNameOpen;
				currentMessageArr = dataFEEDBACK.totalMessages;
				if (dataFEEDBACK.totalMessages.length > 0){
					document.getElementById("chatDIV").innerHTML = "";
					loadMessages(dataFEEDBACK.totalMessages);
					var element = document.getElementById("chatDIV");
					element.scrollTop = element.scrollHeight;

				}
				
				
			}

			return;
		}
	}
	alert("Chat not found...");	
}
async function pullChats(){
	var sendObj = {
		accountToken: accountToken,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/pullChatsStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "success"){
		totalChatArr = orderChatArr(dataFEEDBACK.chatArr);
		document.getElementById("contactsDIV").innerHTML = "";
		loadContacts(totalChatArr);
	}else{
		alert("Error");
	}
}
function logout(){
	localStorage.removeItem("accountToken");
	sessionStorage.removeItem("accountToken");
	location.href = "index.html";
}
function loadContacts(contactArr){
    if (contactArr.length == 0){
    	return;
    }
    for (var i=0;i<contactArr.length;i++){
    	var currentName = contactArr[i][0];
    	var currentTimeStamp = ((new Date(contactArr[i][2])).toString()).substring(0, 24);
    	var contactID = "contact" + i.toString();
    	var newElem = document.createElement("button");
    	newElem.id = contactID;
    	newElem.setAttribute("class", "contactBtn");
    	newElem.innerText = currentName;
    	newElem.title = currentTimeStamp;
    	newElem.setAttribute("onclick", "openChat(this.innerText)");
    	document.getElementById("contactsDIV").appendChild(newElem);

    	document.getElementById("contactsDIV").appendChild(document.createElement("br"));

    }
}
function loadMessages(messageArr){
	if (messageArr.length == 0){
		return;
	}
	for (var i=0;i<messageArr.length;i++){

		var currentMessage = messageArr[i].messageContent;
		var currentSender = messageArr[i].sender;
		var currentTime = ((new Date(messageArr[i].messageTime)).toString()).substring(0, 24);
		var currentReadRec = messageArr[i].readRec;
		var currentMessageID = messageArr[i].messageID;

		var newLbl = document.createElement("label");
		newLbl.innerText = currentMessage;

		newLbl.id = "message" + currentMessageID.toString();
		if (currentSender == username){
			newLbl.setAttribute("class", "sentMessage");
		}else{
			newLbl.setAttribute("class", "recievedMessage");
		}
		newLbl.title = currentTime;
		document.getElementById("chatDIV").appendChild(newLbl);
		document.getElementById("chatDIV").appendChild(document.createElement("br"));

		var element = document.getElementById("chatDIV");
		element.scrollTop = element.scrollHeight;

	}
}
async function sendMessage(message){
	if (chatIDOpen == ""){
		alert("Open a chat to send this message to.");
		return;
	}
	if (message == ""){
		return;
	}
	var messageID = currentMessageArr.length;

	var messageSendObj = {
		messageContent: message,
		sender: username,
		messageTime: (new Date()).getTime(),
		readRec: false,
		messageID: messageID,
	};
	var sendObj = {
		chatID: chatIDOpen,
		accountID: accountToken,
		messageObj: messageSendObj,
		newTimestamp: (new Date()).getTime(),
		recName: chatNameOpen
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/sendMsgStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "message-sent"){
		loadMessages([messageSendObj]);
		document.getElementById("messageInput").value = "";
		currentMessageArr.push(messageSendObj);
	}
}
function delay(ms){	
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function checkForNewMessages(){
	if (chatIDOpen == ""){
		return;
	}
	var sendObj = {
		chatID: chatIDOpen,
		accountID: accountToken,
		prevMessages: currentMessageArr,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/messageCheckStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "success"){
		var newMessages = dataFEEDBACK.newMessages
		loadMessages(newMessages);
		for (var i=0;i<newMessages.length;i++){
			currentMessageArr.push(newMessages[i]);
		}
	}
}
async function mainLoop(){
	while (true){
		checkForNewMessages();
		await delay(2000);
	}
}
function orderChatArr(chatArr){
	var timeStampArr = [];
	
	for (var i=0;i<chatArr.length;i++){
		timeStampArr.push(chatArr[i][2]);
	}
	timeStampArr.sort().reverse();
	var orderedChatArr = [];
	
	for (var i=0;i<timeStampArr.length;i++){
		var currentTime = timeStampArr[i];
		for (var x=0;x<chatArr.length;x++){
			
			if (chatArr[x][2] == currentTime){
				orderedChatArr.push(chatArr[x]);
			}
		}
	}
	return orderedChatArr;
}
async function patrolOtherChats(){
	var otherChats = [];
	for (var i=0;i<totalChatArr.length;i++){
		if (totalChatArr[i][1] != chatIDOpen){
			otherChats.push(totalChatArr[i]);
		}
	}
	var sendObj = {
		accountID: accountToken,
		otherChats: otherChats,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/patrolOtherChatsStream", options);
	const dataFEEDBACK = await response.json();

	console.log(dataFEEDBACK);
}
getAccountData();

var username = sessionStorage.getItem("username");
var theme = sessionStorage.getItem("theme");
var wp = sessionStorage.getItem("wp");
var pfp = sessionStorage.getItem("pfp");


//pullChats();

//mainLoop();


/*document.getElementById("messageInput").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
	sendMessage(document.getElementById("messageInput").value);    
  }
});*/




if (localStorage.getItem("theme") === null){
	setTheme("theme-light");
}else if (localStorage.getItem("theme") === "theme-dark"){
	setTheme("theme-dark");
}else{
	setTheme("theme-light");
}


//document.body.setAttribute("style", "background-image:url(" + wp + ")");
function populateControlPanel(){
	var items = controlPanelOptions;
	var totalWidth = window.innerWidth;
	var divWidths = Math.round(totalWidth/items.length);
	console.log(divWidths);
	for (var i=0;i<items.length;i++){
		var currentItem = items[i];
		var newElem = document.createElement("button");
		newElem.setAttribute("class", "controlBtn");
		newElem.id = "control-" + currentItem;
		newElem.setAttribute("style", "width:" + divWidths.toString() + "px");
		newElem.setAttribute("style", "left:" + (i * divWidths).toString() + "px");
		newElem.innerText = currentItem;

		document.getElementById("controlDIV").appendChild(newElem);
	}
}
populateControlPanel();