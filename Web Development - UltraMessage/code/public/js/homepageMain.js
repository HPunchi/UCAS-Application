var username = sessionStorage.getItem("USERNAME");
if (username == null){
	location.href = "index.html";
}


async function createAuth(){
	
	var sendObj = {
		userToken: username, 
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/getUserStream", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.error == "true"){
		createPopup("Invalid Token", "This token was not recognised. Please login again to resolve this issue.");
		//sessionStorage.setItem("token_verified", "false");
	}
	sessionStorage.setItem("token_verified", "true");





	loadChats();

	mainLoop();
}

sessionStorage.setItem("chatID_open", "null");
var user = sessionStorage.getItem("USER");


//alert

var pfpUrl = sessionStorage.getItem("profile_pic_url");
var freqE = sessionStorage.getItem("FREQ_EMOS");
var freqEmos = [];

if (freqE != ""){
	freqEmos = freqE.split();
}


document.getElementById("pfpIMG").src = pfpUrl;


//innerHTML



let contactArr = [];
let messageArr = [];
let prevTick = "";


function seeEmojis(){
	
	if ((document.getElementById("emoPicker").style.display == "none") || (document.getElementById("emoPicker").style.display == "")){

		var he = (Math.round((0.87 * window.innerHeight)-200)).toString() + "px";
		document.getElementById("chatPanelDIV").style.height = he;

	
		document.getElementById("typePanelDIV").style.bottom = (200 + (0.01*window.innerHeight) - 1).toString() + "px";
		document.getElementById("typePanelDIV").style.right = "0px";

		document.getElementById("emoPicker").style.display = "block";
		selectCat("Smileys & Emotion");
	}else{
		var he = (Math.round((0.87 * window.innerHeight))).toString() + "px";
		document.getElementById("chatPanelDIV").style.height = he;
	
		document.getElementById("typePanelDIV").style.bottom = "1%";
		document.getElementById("typePanelDIV").style.right = "0px";
		document.getElementById("emoPicker").style.display = "none";

	}
	

}
function closePopup(){

	document.getElementById("popupDIV").style.display = "none";
	if (document.getElementById("popupTitle").innerText == "Invalid Token"){
		location.href = "signInPage.html";
	}
}
function createPopup(title, text){
	var imgSrc = "/images/logo.png";
	document.getElementById("popupTitle").innerText = title;
	document.getElementById("popupIMG").src = imgSrc;
	document.getElementById("popupText").innerText = text;
	document.getElementById("popupDIV").style.display = "block";
}
function closeImageViewer(){
	
	document.getElementById("imgPUDIV").style.display = "none";
	prevTick = "";
	
	
}
function imageViewer(src){
	document.getElementById("displayImage").setAttribute("src", src);
	document.getElementById("imgPUDIV").style.display = "block";
	return;
}
function GetFormattedDate() {
	var date = new Date();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day  = ("0" + (date.getDate())).slice(-2);
    var year = date.getFullYear();
    var hour =  ("0" + (date.getHours())).slice(-2);
    var min =  ("0" + (date.getMinutes())).slice(-2);
    var seg = ("0" + (date.getSeconds())).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" +  min + ":" + seg;
}

async function sendMessage(){
	var chatID = sessionStorage.getItem("chatID_open");
	if (chatID == "null"){
		createPopup("Error", "Please select a chat.");
		return;
	}
	var message = document.getElementById("messageInput").value;

	if (message == "" || message == null){
		
		return;
	}
	var currentTimeM = GetFormattedDate();
	var timeArr = [];
	for (var j=0;j<messageArr.length;j++){
		timeArr.push(messageArr[j][2]);

	}
	
	if (timeArr.includes(currentTimeM) == true){
		document.getElementById("messageInput").value = "";
		return;
	}
	messageArr.push([message, username, currentTimeM, (messageArr.length)]);

	var sendObj = {
		username: username,
		message: message,
		time: GetFormattedDate(),
		id: (messageArr.length - 1).toString(),
		chatID: chatID,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/sendMessageStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "message-sent"){

		//array clean up process start

		var newBtn = document.createElement("BUTTON");
		newBtn.setAttribute("class", "outgoingMessage");
		newBtn.innerText = message;

		newBtn.setAttribute("id", ((messageArr.length - 1).toString()));
		newBtn.setAttribute("value", message);
		newBtn.setAttribute("onclick", "messageDetails(this.value)");

	
		document.getElementById("messagesDIV").appendChild(newBtn);
		var newB = document.createElement("BR");
		newB.setAttribute("class", "breakSpace");
		document.getElementById("messagesDIV").appendChild(newB);
		
		var newB = document.createElement("BR");
		newB.setAttribute("class", "breakSpace");
		document.getElementById("messagesDIV").appendChild(newB);
		document.getElementById("messageInput").focus();
	
	
		document.getElementById("messageInput").value = "";
	}
	var objDiv = document.getElementById("messagesDIV");
	objDiv.scrollTop = objDiv.scrollHeight;
	document.getElementById("msgSent").play();
}
function messageDetails(messageName){
	console.log(messageName);
}

async function openChat(userRec){
	var prevChat = sessionStorage.getItem("chatID_open");
	if (prevChat != "null"){
		
		for (var i=0;i<contactArr.length;i++){
			
			if (contactArr[i][1] == prevChat){
			
				document.getElementById("contactTXT-" + i.toString()).setAttribute("style", "font-weight:lighter");
				break;
			}
			
		}
	}
	
	var chatID = "";
	var mainPFP = "";
	var recStatus = "";
	for (var i=0;i<contactArr.length;i++){
		if (contactArr[i][0] == userRec){
			chatID = contactArr[i][1];
			mainPFP = contactArr[i][2];
			recStatus = contactArr[i][3];
			document.getElementById("contactTXT-" + i.toString()).setAttribute("style", "font-weight:bolder");
			break;
		}
	}
	messageArr = [];
	
	var sendObj = {
		loggedUser: username,
		userRec: userRec,
		chatID: chatID,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/loadChatStream", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.status == "messages-obtained"){
		messageArr = dataFEEDBACK.messageArr;
	}




	
	
 	const myNode = document.getElementById("messagesDIV");
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.lastChild);
	}
	
	document.getElementById("messagesDIV").appendChild(document.createElement("br"));
	document.getElementById("recPFP").src = mainPFP;
	document.getElementById("chatTitle").innerText = userRec;

	if (recStatus == "online"){
		document.getElementById("recSTATUS").setAttribute("class", "tONstat");
	}else if (recStatus == "offline"){
		document.getElementById("recSTATUS").setAttribute("class", "tOFstat");
	}
	////////////////////////////////////////////////////////////////
	//scrollTop
	
	for (var i=0;i<messageArr.length;i++){
		var currentMessage = messageArr[i][0];
		var currentSender = messageArr[i][1];
		var currentTime = messageArr[i][2];
		var currentID = messageArr[i][3];
		
		if (currentSender == "admin"){
			var newBtn = document.createElement("BUTTON");
			newBtn.setAttribute("class", "adminMessage");
			newBtn.innerText = currentMessage;
			//innerHTML
			newBtn.setAttribute("id", currentID);
			newBtn.setAttribute("value", currentMessage);
			newBtn.setAttribute("onclick", "messageDetails(this.value)");

			document.getElementById("messagesDIV").appendChild(newBtn);
			var newB = document.createElement("BR");
			newB.setAttribute("class", "breakSpace");
			document.getElementById("messagesDIV").appendChild(newB);
			
			var newB = document.createElement("BR");
			newB.setAttribute("class", "breakSpace");
			document.getElementById("messagesDIV").appendChild(newB);
			
		}
		else if (currentSender == user){
			//outgoing
			var newBtn = document.createElement("BUTTON");
			newBtn.setAttribute("class", "outgoingMessage");
			newBtn.innerText = currentMessage;

			newBtn.setAttribute("id", currentID);
			newBtn.setAttribute("value", currentMessage);
			newBtn.setAttribute("onclick", "messageDetails(this.value)");

		
			document.getElementById("messagesDIV").appendChild(newBtn);
			var newB = document.createElement("BR");
			newB.setAttribute("class", "breakSpace");
			document.getElementById("messagesDIV").appendChild(newB);
			
			var newB = document.createElement("BR");
			newB.setAttribute("class", "breakSpace");
			document.getElementById("messagesDIV").appendChild(newB);
		}
		else if (currentSender == userRec){
			//incoming
			var newBtn = document.createElement("BUTTON");
			newBtn.setAttribute("class", "incomingMessage");
			newBtn.innerText = currentMessage;
			newBtn.setAttribute("id", currentID);
			newBtn.setAttribute("value", currentMessage);
			newBtn.setAttribute("onclick", "messageDetails(this.value)");

		//innerHTML
			document.getElementById("messagesDIV").appendChild(newBtn);
			var newB = document.createElement("BR");
			newB.setAttribute("class", "breakSpace");
			document.getElementById("messagesDIV").appendChild(newB);
			
			var newB = document.createElement("BR");
			newB.setAttribute("class", "breakSpace");
			document.getElementById("messagesDIV").appendChild(newB);
		}

		
	}
	sessionStorage.setItem("chatID_open", chatID);
	document.getElementById("messageInput").focus();	
	var objDiv = document.getElementById("messagesDIV");
	objDiv.scrollTop = objDiv.scrollHeight;
}

async function loadChats(){
	
	var sendObj = {
		reqUsername: username,
		contactID: "all-contacts",
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/loadContactsStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "obtained-contacts"){
		contactArr = dataFEEDBACK.contacts;
	}

	
	for (var i=0;i<contactArr.length;i++){
		var currentName = contactArr[i][0];
		var currentPFP = contactArr[i][2];
		var currentStat = contactArr[i][3];
		var currentNo = i.toString();

		var newDIV = document.createElement("div");

		newDIV.setAttribute("class", "contactDIV");
		newDIV.id = "contact-" + currentNo;
		newDIV.value = currentName;
		newDIV.setAttribute("onclick", "openChat(this.value)");
		document.getElementById("contactsPanelDIV").appendChild(newDIV);

		var newIMG = document.createElement("img");
		newIMG.setAttribute("class", "contactPFP");
		newIMG.id = "contactPFP-" + currentNo;
		newIMG.src = currentPFP;
		newIMG.setAttribute("onclick", "imageViewer(this.src)");
		document.getElementById("contact-" + currentNo).appendChild(newIMG);

		var txtDIV = document.createElement("div");
		
		txtDIV.setAttribute("class", "ctDIV");
		txtDIV.id = "ctDIV-" + currentNo;
		document.getElementById("contact-" + currentNo).appendChild(txtDIV);

		var newTXT = document.createElement("label");
		newTXT.setAttribute("class", "contactTXT");
		newTXT.id = "contactTXT-" + currentNo;
		newTXT.innerText = currentName;
		//innerHTML
		document.getElementById("ctDIV-" + currentNo).appendChild(newTXT);
		

		var newSTAT = document.createElement("div");
		newSTAT.id = "contactSTAT-" + currentNo;
		if (currentStat == "online"){
			newSTAT.setAttribute("class", "onlineSTAT");
		}else if (currentStat == "offline"){
			newSTAT.setAttribute("class", "offlineSTAT");
		}
		document.getElementById("contact-" + currentNo).appendChild(newSTAT);
		
	}
}
//userRec
async function createNewChat(){
	var userRec = prompt("Username of person you would like to chat with:", "");

	if (userRec == null || userRec == ""){
		return;
	}
	if (userRec == user){
		createPopup("Error", "You cannot chat with yourself.");
		//alert
		return;
	}

	var sendObj = {
		loggedUser: username,
		reqestedUsername: userRec,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/createChat-checkContactsStream", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.status == "user-not-found"){
		createPopup("Error", "This user was not found. Please try again.");
		return;
	}else if (dataFEEDBACK.status == "user-in-contacts"){
		createPopup("Error", "You are already chatting to this user.");
		return;
	}else if (dataFEEDBACK.status == "chat-created"){
		createPopup("Error", "Chat Created Successfully!");
		var newChatID = dataFEEDBACK.chatID;
		var currentPFP = dataFEEDBACK.pfpUrl;
		var currentStat = dataFEEDBACK.stat;
		
	}
	contactArr.push([userRec, newChatID, currentPFP]);
	var currentNo = (contactArr.length - 1).toString();
	var currentName = userRec;

	var newDIV = document.createElement("div");

	newDIV.setAttribute("class", "contactDIV");
	newDIV.id = "contact-" + currentNo;
	newDIV.value = currentName;
	newDIV.setAttribute("onclick", "openChat(this.value)");
	document.getElementById("contactsPanelDIV").appendChild(newDIV);

	var newIMG = document.createElement("img");
	newIMG.setAttribute("class", "contactPFP");
	newIMG.id = "contactPFP-" + currentNo;
	newIMG.src = currentPFP;
	newIMG.style = "cursor:pointer";
	newIMG.setAttribute("onclick", "imageViewer(this.src)");
	document.getElementById("contact-" + currentNo).appendChild(newIMG);

	var txtDIV = document.createElement("div");
	
	txtDIV.setAttribute("class", "ctDIV");
	txtDIV.id = "ctDIV-" + currentNo;
	document.getElementById("contact-" + currentNo).appendChild(txtDIV);

	var newTXT = document.createElement("label");
	newTXT.setAttribute("class", "contactTXT");
	newTXT.id = "contactTXT-" + currentNo;
	newTXT.innerText = currentName;
	//innerHTML
	document.getElementById("ctDIV-" + currentNo).appendChild(newTXT);	

	var newSTAT = document.createElement("div");
	newSTAT.id = "contactSTAT-" + currentNo;
	if (currentStat == "online"){
		newSTAT.setAttribute("class", "onlineSTAT");
	}else if (currentStat == "offline"){
		newSTAT.setAttribute("class", "offlineSTAT");
	}
	document.getElementById("contact-" + currentNo).appendChild(newSTAT);

	createPopup("Chat Created", "The chat was created successfully!");
}
document.getElementById("messageInput").focus();

function viewAccountSettings(){
	createPopup("Account Settings", "Account settings are coming soon!");
	return;
}
function logout(){
	if (confirm('Press OK to confirm that you want to logout.')) {
		localStorage.removeItem("USERNAME_LOG");
		localStorage.removeItem("THEME_LOG");
		sessionStorage.removeItem("USERNAME");
		sessionStorage.removeItem("THEME");
		location.href = "index.html";
	} 
	else {
		return;
	}
}
function sleep(ms){
	
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function check4Messages(){
	var chatID = sessionStorage.getItem("chatID_open");
	if (chatID == "null"){
		return;
	}
	var loadedMessages = [];
	for (var i=0;i<messageArr.length;i++){
		loadedMessages.push(messageArr[i][3]);
	}
	var sendObj = {
		loggedUser: username,
		chatID: chatID,
		currentMessages: loadedMessages,
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
	if (dataFEEDBACK.status == "no-new-messages"){
		return;
	}
	if (dataFEEDBACK.status == "messages-found"){
		var newMessages = dataFEEDBACK.newMessages;
		for (var i=0;i<newMessages.length;i++){
			var currentObj = newMessages[i];
			messageArr.push(currentObj);
			var currentMessage = currentObj[0];
			var currentSender = currentObj[1];
			var currentTime = currentObj[2];
			var currentID = currentObj[3];

			if (currentSender == "admin"){
				var newBtn = document.createElement("BUTTON");
				newBtn.setAttribute("class", "adminMessage");
				newBtn.innerText = currentMessage;

				newBtn.setAttribute("id", currentID);
				newBtn.setAttribute("value", currentMessage);
				newBtn.setAttribute("onclick", "messageDetails(this.value)");

			
				document.getElementById("messagesDIV").appendChild(newBtn);
				var newB = document.createElement("BR");
				newB.setAttribute("class", "breakSpace");
				document.getElementById("messagesDIV").appendChild(newB);
				
				var newB = document.createElement("BR");
				newB.setAttribute("class", "breakSpace");
				document.getElementById("messagesDIV").appendChild(newB);


			}
			else if (currentSender == user){
				//outgoing
				var newBtn = document.createElement("BUTTON");
				newBtn.setAttribute("class", "outgoingMessage");
				newBtn.innerText = currentMessage;

				newBtn.setAttribute("id", currentID);
				newBtn.setAttribute("value", currentMessage);
				newBtn.setAttribute("onclick", "messageDetails(this.value)");

			
				document.getElementById("messagesDIV").appendChild(newBtn);
				var newB = document.createElement("BR");
				newB.setAttribute("class", "breakSpace");
				document.getElementById("messagesDIV").appendChild(newB);
				
				var newB = document.createElement("BR");
				newB.setAttribute("class", "breakSpace");
				document.getElementById("messagesDIV").appendChild(newB);

				document.getElementById("msgSent").play();
			}
			else{
				//incoming
				var newBtn = document.createElement("BUTTON");
				newBtn.setAttribute("class", "incomingMessage");
				newBtn.innerText = currentMessage;

				newBtn.setAttribute("id", currentID);
				newBtn.setAttribute("value", currentMessage);
				newBtn.setAttribute("onclick", "messageDetails(this.value)");

			
				document.getElementById("messagesDIV").appendChild(newBtn);
				var newB = document.createElement("BR");
				newB.setAttribute("class", "breakSpace");
				document.getElementById("messagesDIV").appendChild(newB);
				
				var newB = document.createElement("BR");
				newB.setAttribute("class", "breakSpace");
				document.getElementById("messagesDIV").appendChild(newB);

				document.getElementById("msgReceived").play();
			}
			document.getElementById("messageInput").focus();
			var objDiv = document.getElementById("messagesDIV");
			objDiv.scrollTop = objDiv.scrollHeight;
		}
	}
}
async function check4StatusUpdates(){
	var sendObj = {
		loggedUser: username,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/statusCheckStream", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.statusS == "end"){
		var statArr = dataFEEDBACK.statArr;
	
	}else{
		return;
	}
	for (var i=0;i<contactArr.length;i++){
		var currentID = "contactSTAT-" + i.toString();
		var currentChatID = sessionStorage.getItem("chatID_open");
		var contactCID = contactArr[i][1];

		if (document.getElementById(currentID).getAttribute("class") == "onlineSTAT"){
		
			if (statArr[i] == "offline"){
				document.getElementById(currentID).setAttribute("class", "offlineSTAT");
				if (currentChatID == contactCID){
					document.getElementById("recSTATUS").setAttribute("class", "tOFstat");
				}
			}
		}else if (document.getElementById(currentID).getAttribute("class") == "offlineSTAT"){
	
			if (statArr[i] == "online"){
				document.getElementById(currentID).setAttribute("class", "onlineSTAT");
				if (currentChatID == contactCID){
					document.getElementById("recSTATUS").setAttribute("class", "tONstat");
				}
			}
		}
	}
	return;
}
async function mainLoop(){
	var loopCount = 0;
	
	while (true){
		check4Messages();
		check4StatusUpdates();
		await sleep(1000);
	}
	
}

sessionStorage.setItem("CHAT_ARRAY", "null");
sessionStorage.setItem("PREVIOUS_TIME_TOKEN", "null");

function setTheme(themeName){
    sessionStorage.setItem('theme', themeName);
   	document.documentElement.className = themeName;
}
function toggleTheme(){
	
    if (sessionStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
       
    } else {
       setTheme('theme-dark');
    }
}


if (sessionStorage.getItem('theme') === 'theme-dark') {
	setTheme('theme-dark');

	//document.getElementById("themeCheckbox").checked = true;
} else {
	setTheme('theme-light');
	//document.getElementById("themeCheckbox").checked = false;
}

document.getElementById("messageInput").addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {  
        sendMessage();
    }
});
document.getElementById("popupDIV").addEventListener("keydown", function(e){
	if (e.keyCode === 13){
		closePopup();
	}
});

document.getElementById("usernameText").innerText = user;



function selectCat(cat){
	var index = "ei" + (catArr.indexOf(cat) + 1).toString();
	var elems = document.getElementsByClassName("emoIcons");
	
	for (var i=0;i<elems.length;i++){
		if (elems[i].id == index){
			elems[i].setAttribute("style", "color: var(--font-color); font-weight:bold;border-bottom:1px solid var(--font-color)");
		}else{
			elems[i].setAttribute("style", "color: #5c5a56; font-weight:normal;");
		}
	}
	document.getElementById('catName').innerText = cat.toUpperCase();

	const myNode = document.getElementById("emoBox");

	while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }



    var tempEmos = mainArr[cat];
    var counter = 0;
    var divNo = 0;
    while (counter < tempEmos.length){
    	var subDiv = document.createElement("div");
    	subDiv.setAttribute("class", "subCont");

    	var leftA = (40 * divNo).toString() + "px";
  
    	subDiv.setAttribute("style", ("position:absolute;top:0px;left:" + leftA + ";"));
    	
    	document.getElementById("emoBox").appendChild(subDiv);
    	for (var x=0;x<3;x++){
    		if (counter >= tempEmos.length){
    			break;
    		}
    		var elem = document.createElement("button");

	    	var value = tempEmos[counter].emoji;
	    	
	    	elem.id = "emo-" + counter.toString();
	    	elem.setAttribute("class", "emoBtn");
	    	elem.innerText = value;
	    	elem.title = tempEmos[counter].shortname;
	    	elem.setAttribute("onclick", "addEmoji(this.innerText)");
	    	subDiv.appendChild(elem);
	    	subDiv.appendChild(document.createElement("br"));
	    	counter += 1
    	}
    	divNo += 1;
    	document.getElementById("emoBox").appendChild(document.createElement("br"));
    }
    document.getElementById("emoBox").scrollLeft = 0;//= document.getElementById("emoPicker").scrollHeight;


}
function toggleEP(){
	if (document.getElementById("emoPicker").style.display == "none"){
		document.getElementById("emoPicker").style.display = "block";
	}else{
		document.getElementById("emoPicker").style.display = "none"
	}
}



function addEmoji(emo){
	document.getElementById("messageInput").value += emo;
	document.getElementById("messageInput").focus();
}

var mainArr = {
	"Smileys & Emotion": [],
	"People & Body": [],
	"Activities": [],
	"Symbols": [],
	"Objects": [],
	"Food & Drink": [],
	"Travel & Places": [],
	"Animals & Nature": [],
	"Flags": [],
};

var catArr = Object.keys(mainArr);
function sortEmojis(){
	for (var i=0;i<emoArr.length;i++){
		var currentEmoji = emoArr[i];
		for (var x=0;x<catArr.length;x++){
			if (currentEmoji.category == catArr[x]){
				mainArr[catArr[x]].push(currentEmoji);
			}
		}
	}
}

sortEmojis();

window.addEventListener("beforeunload", async function(e){
   // Do something

	var sendObj = {
		userToExit: user,
		userToken: username,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/statusStream", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.status == "passed"){
		return 0;
	}
	
}, false);



createAuth();

