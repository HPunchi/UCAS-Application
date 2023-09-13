var currentMode = giveMode();
if (currentMode == true){
	adjustToMobile();
}else{
	adjustToStandard();
}

function adjustToMobile(){
	document.getElementById("cssControl").setAttribute("href", "css/registerMobile.css");
}
function adjustToStandard(){
	document.getElementById("cssControl").setAttribute("href", "css/registerStandard.css");
}
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
var divSeq = ["close", "a", "b", "c", "d", "e", "proceed"];
var digits = "0123456789";
var ups = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var lows = "abcdefghijklmnopqrstuvwxyz";
var specChars = ["!", '"', "£", "$", "%", "^", "&", "*", "(", ")",
 "-", "_", "+", "=", "[", "]", "#",
	 "{", "}", "~", ";", "'", ":", "@", "<", ">", "?", ",", ".", "/", "|", "`", "¬", "¦"];
var registerObj = {
	name: "",
	dob: "",
	username: "",
	password: "",
	email: "",
	pfp: "",
	bio: "",
	wallpaper: ""
}
var tempEmail = "";
var validObj = {
	name: "",
	dob: "",
	username: "",
	password: "",
	email: "",
	pfp: "valid",
	bio: "valid",
	wallpaper: "valid"
}
var dobObj = {
	d1: "",
	d2: "",
	m1: "",
	m2: "",
	y1: "",
	y2: "",
	y3: "",
	y4: "",
}

var tempPassword = "";
var errorShowing = false;

function createError(errorName, errorInfo){
	dismissError();
	document.getElementById("errorName").innerText = errorName;
	document.getElementById("errorInfo").innerText = errorInfo;

	document.getElementById("errorDIV").style.animation = "errorDIVEntry 0.8s";
	document.getElementById("errorDIV").style.right = "10px";
	errorShowing = true;
}
function dismissError(){
	document.getElementById("errorDIV").style.animation = "errorDIVExit 0.8s";
	document.getElementById("errorDIV").style.right = "-490px";
	errorShowing = false;
}
function clearInput(caller){
	if (caller == "dobC"){
		document.getElementById("day1I").value = "";
		document.getElementById("day2I").value = "";
		document.getElementById("month1I").value = "";
		document.getElementById("month2I").value = "";
		document.getElementById("year1I").value = "";
		document.getElementById("year2I").value = "";
		document.getElementById("year3I").value = "";
		document.getElementById("year4I").value = "";
		return;
	}
	if (caller == "verifCodeC"){
		document.getElementById("code1").value = "";
		document.getElementById("code2").value = "";
		document.getElementById("code3").value = "";
		document.getElementById("code4").value = "";
		document.getElementById("code5").value = "";
		document.getElementById("code6").value = "";

		codeObj["1"] = "";
		codeObj["2"] = "";
		codeObj["3"] = "";
		codeObj["4"] = "";
		codeObj["5"] = "";
		codeObj["6"] = "";
		return;
	}
	if (caller == "emailC"){
		document.getElementById("verifButton").style.display = "none";
	}

	document.getElementById(caller.replace("C", "I")).value = "";
}
function back(){
	var aStat = document.getElementById("aDIV").style.display;
	var bStat = document.getElementById("bDIV").style.display;
	var cStat = document.getElementById("cDIV").style.display;
	var dStat = document.getElementById("dDIV").style.display;
	var eStat = document.getElementById("eDIV").style.display;
	var currentDIV = "";
	if (aStat == "block"){
		currentDIV = "a";
	}else if (bStat == "block"){
		currentDIV = "b";
	}else if (cStat == "block"){
		currentDIV = "c";
	}else if (dStat == "block"){
		currentDIV = "d";
	}else if (eStat == "block"){
		currentDIV = "e";
	}
	var newS = divSeq[divSeq.indexOf(currentDIV) - 1];
	if (newS == "close"){
		location.href = "index.html";
	}else if (newS == "proceed"){
		/////////////////////
	}else{
		document.getElementById(currentDIV + "DIV").style.display = "none";
		document.getElementById(newS + "DIV").style.display = "block";
	}
}
function next(){
	var aStat = document.getElementById("aDIV").style.display;
	var bStat = document.getElementById("bDIV").style.display;
	var cStat = document.getElementById("cDIV").style.display;
	var dStat = document.getElementById("dDIV").style.display;
	var eStat = document.getElementById("eDIV").style.display;
	var currentDIV = "";
	if (aStat == "block"){
		currentDIV = "a";
	}else if (bStat == "block"){
		currentDIV = "b";
	}else if (cStat == "block"){
		currentDIV = "c";
	}else if (dStat == "block"){
		currentDIV = "d";
	}else if (eStat == "block"){
		currentDIV = "e";
	}
	var newS = divSeq[divSeq.indexOf(currentDIV) + 1];
	if (newS == "close"){
		location.href = "index.html";
	}else if (newS == "proceed"){
		proceed();
	}else{
		document.getElementById(currentDIV + "DIV").style.display = "none";
		document.getElementById(newS + "DIV").style.display = "block";
	}
}


function patrolEmailLower(currentInput){
	document.getElementById("emailI").value = currentInput.toLowerCase();
	if (currentInput != ""){
		document.getElementById("verifButton").style.display = "block";
	}else{
		document.getElementById("verifButton").style.display = "none";
	}
}


function vName(currentInput){
	if (currentInput == ""){
		validObj.name = "";
		return;
	}
	var valid = true;
	for (var i=0;i<currentInput.length; i++){
		if (digits.includes(currentInput[i]) == true){
			valid = false;
			break;
		}
		if (specChars.includes(currentInput[i]) == true){
			valid = false;
			break;
		}

	}	
	if (valid == false){
		if (validObj.name != "error"){
			createError("Invalid Name", "Name cannot contain any numbers or special characters.");
			validObj.name = "error";
		}
	}else{
		if (errorShowing == true){
			dismissError();
		}
		validObj.name = "valid";
	}
	currentInput = toTitleCase(currentInput);
	document.getElementById("nameI").value = currentInput;
}
function vDob(caller, callerVal){
	var valid = false; 
	var seq = Object.keys(dobObj);
	if (callerVal.length > 1){
		document.getElementsByName(caller)[0].value = callerVal[0];
		callerVal = callerVal[0];
	}
	if (callerVal == ""){
		return;
	}
	if (digits.includes(callerVal) == false){
		document.getElementsByName(caller)[0].value = "";
	}

	dobObj[caller] = callerVal;

	var full = true;
	for (var i=0;i<seq.length;i++){
		if (dobObj[seq[i]] == ""){
			full = false;
			break;
		}
	}
	
	if (full == false){
		document.getElementsByName(caller)[0].value = callerVal;
		try{
			document.getElementsByName(seq[seq.indexOf(caller) + 1])[0].focus();
		}catch(err){
			undefined;
		}
		
		
	}else{
		var day = dobObj.d1 + dobObj.d2;
		var month = dobObj.m1 + dobObj.m2;
		var year = dobObj.y1 + dobObj.y2 + dobObj.y3 + dobObj.y4;

		if (vd(day, month, year) == false){
			if (validObj.dob != "error"){
				createError("Invalid Date of Birth", "This date is not valid.");
				validObj.dob = "error";
			}
		}else{
			if (errorShowing == true){
				dismissError();
			}
			validObj.dob = "valid";
		}
	
	}
}
function vUsername(currentInput){
	const forbiddenChars = [" ", "/"];
	if (currentInput == ""){
		validObj.username = "";
		return;
	}
	var valid = true;
	for (var i=0;i<currentInput.length;i++){
		if (forbiddenChars.includes(currentInput[i]) == true){
		 	valid = false;
		 	break;
		}
	}
	if (valid == false){
		if (validObj.username != "error"){
			createError("Invalid Username", "The username cannot contain spaces or forward slashes.");
			validObj.username = "error";
		}
	}else{
		if (errorShowing == true){
			dismissError();
		}
		validObj.username = "valid";
	}
}
function vPassword1(currentInput){
	if (currentInput == ""){
		dismissError();
		return;
	}
	var upperCase = false;
	var lowerCase = false;
	var numbers = false;

	for (var i=0;i<currentInput.length;i++){
		if (ups.includes(currentInput[i]) == true){
			upperCase = true;
		}else if (lows.includes(currentInput[i]) == true){
			lowerCase = true;
		}else if (digits.includes(currentInput[i]) == true){
			numbers = true;
		}
	}
	if ((upperCase == true)&&(lowerCase == true)&&(numbers)){
		var valid = true;
		dismissError();
		validObj.password = "valid";
	}else{
		var valid = false;
		createError("Invalid Password", "It must have at least one upper case and lower case character and a number.");
		validObj.password = "error";	
	}
}
function vPassword2(currentInput){
	var otherPassword = document.getElementById("password1I").value;
	if (currentInput != otherPassword){
		createError("Password Error", "This password must match the password you previously entered.");
		validObj.password = "error";
	}
	else{
		dismissError();
		validObj.password = "valid";

	}
}
function vEmail(currentInput){
	if (currentInput == ""){
		validObj.email = "";
		return;
	}
	var valid = false;
	if (currentInput.includes("@") == true){
		if (currentInput.includes(".") == true){
			var valid = true;
			if (errorShowing == true){
				dismissError();
			}
			validObj.email = "valid";
			tempEmail = currentInput;
			document.getElementById("emailI").value = currentInput.toLowerCase();
		}
	}
	if (valid == false){
		createError("Invalid Email", "This address is not in the required format.");
		validObj.email = "error";
		tempEmail = "";
	}
}

if (localStorage.getItem("theme") === null){
	setTheme("theme-light");
}else if (localStorage.getItem("theme") === "theme-dark"){
	setTheme("theme-dark");
}else{
	setTheme("theme-light");
}



function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
function vd(day, month, year){
		var today = new Date();
		var cDay = today.getDate();
		var cMonth = today.getMonth() + 1;
		var cYear = today.getFullYear();
		var day = parseInt(day);
		var month = parseInt(month);
		var year = parseInt(year);


		var valid = true;
		var dayObj = {
			1: 31,
			2: 28,
			3: 31,
			4: 30,
			5: 31, 
			6: 30,
			7: 31,
			8: 31,
			9: 30, 
			10: 31,
			11: 30, 
			12: 31
		};

		if ((year % 4 != 0) && (day == 29) && (month == 2)){
			return false;
		}		
		
		if (dayObj[month] < day){
			return false;
		}

		if (day < 1){
			return false;
		}
		if ((month < 1)||(month > 12)){
			return false;
		}
		if (year < 1900){
			return false;
		}


		if (year >= cYear){
			return false;
		}

		return true;
}



function resetImage(){
	document.getElementById("previewImage").src = "/images/default_icon.png";
	validObj.pfp = "valid";
}
function previewImage(){
	document.getElementById("previewImage").src = document.getElementById("pfpI").value;
	validObj.pfp = "valid";
}
function wppreviewImage(){
	document.getElementById("previewWallpaper").src = document.getElementById("wallpaperI").value;
}
function wpresetImage(){
	document.getElementById("previewWallpaper").src = "/images/default_wallpaper.png";
}



var codeSeq = ["code1", "code2", "code3", "code4", "code5", "code6"];
var codeObj = ["", "", "", "", "", ""];

async function sendVerifCode(){
	if (validObj.email == "error" || ""){
		return;
	}

	var email = document.getElementById("emailI").value;
	var sendObj = {
		email: email,
	};
	tempEmail = email;
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/codeSendStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.serverResponse == "email sent"){
		createError("Verification", "A verfication code has been sent to this email address.");
		document.getElementById("verifCode").style.display = "block";
	}
}
async function checkCodeEntry(caller){
	if (document.getElementById(caller).value == ""){
		codeObj[caller[4] - 1] = "";
		return;
	}
	if (caller != "code6"){
		document.getElementById(codeSeq[codeSeq.indexOf(caller) + 1]).focus();
	}
	var value = document.getElementById(caller).value;
	if (value.length > 1){
		document.getElementById(caller).value = value[0];
	}
	var allowed = "0123456789";
	if (allowed.includes(value) == false){
		document.getElementById(caller).value = "";
	}


	codeObj[caller[4] - 1] = document.getElementById(caller).value;








	var codeFull = true;
	for (var i=0;i<6;i++){
		if (codeObj[i] == ""){
			return;
		}
	}

	var userCode = codeObj[0] + codeObj[1] + codeObj[2] + codeObj[3] + codeObj[4] + codeObj[5];

	if (tempEmail == ""){
		return;
	}
	
	var sendObj = {
		email: tempEmail,
		userCode: userCode,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/verifyCodeStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "correct"){
		createError("Verification", "Verified Successfully. Click 'Next' to proceed.");
		document.getElementById("verifButton").style.display = "none";
		next();
		dismissError();
	}else{
		createError("Verification Error", "Not verified. Press 'Verify' to try again.");
		clearInput("verifCodeC");
		document.getElementById("code1").focus();
	}
}
async function verifyUsername(username){
	if (username == ""){
		validObj.username = "";
		return;
	}
	var sendObj = {
		username:username,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/verifyUsernameStream", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.status == "username-taken"){
		createError("Error", "This username has been taken.");
		validObj.username = "error";
	}else if(dataFEEDBACK.status == "username-valid"){
		validObj.username = "valid";
	}
}


function launchFilePicker(){
	var files = [];
	var reader;
	var dummyInp = document.createElement("input");
	dummyInp.type = "file";
	dummyInp.accept = "image/*";

	dummyInp.onchange = e => {
		files = e.target.files;
		reader = new FileReader();

		reader.onload = () => {
			document.getElementById("previewImage").src = reader.result;
			validObj.pfp = "valid";
			pfpLOADER = reader.result;
			pfpType = "file";
			var file = files[0];
		}
		reader.readAsDataURL(files[0]);
	}
	dummyInp.click();
}
function wpLaunchFilePicker(){
	var files = [];
	var reader;
	var dummyInp = document.createElement("input");
	dummyInp.type = "file";
	dummyInp.accept = "image/*";

	dummyInp.onchange = e => {
		files = e.target.files;
		reader = new FileReader();

		reader.onload = () => {
			document.getElementById("previewWallpaper").src = reader.result;
			validObj.pfp = "valid";
			pfpLOADER = reader.result;
			pfpType = "file";
			var file = files[0];
		}
		reader.readAsDataURL(files[0]);
	}
	dummyInp.click();
}




async function proceed(){
	var mainseq = ["name", "dob", "username", "password", "email", "pfp", "bio", "wallpaper"];
	for (var i=0;i<mainseq.length;i++){
		if ((validObj[mainseq[i]] == "error") || (validObj[mainseq[i]] == "")){
			createError("Error", "Some fields are either invalid or incomplete.");
			return;
		}
	}
	for (var i=0;i<mainseq.length;i++){
		if (i==1){
			registerObj.dob = dobObj.d1 + dobObj.d2 + "." + dobObj.m1 + dobObj.m2 + "." + dobObj.y1 + dobObj.y2 + dobObj.y3 + dobObj.y4;
		}else if (i==5){
			registerObj.pfp = document.getElementById("previewImage").src;
		}else if (i==7){
			registerObj.wallpaper = document.getElementById('previewWallpaper').src;
		}else if (i==3){
			registerObj.password = document.getElementById("password2I").value;
		}else{
			registerObj[mainseq[i]] = document.getElementById((mainseq[i] + "I").trim()).value;
		}
	}
	registerObj.contacts = [];
	registerObj.chats = [];
	var sendObj = {
		register: registerObj,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/mainRegister", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.status == "error"){
		createError("Sign Up Failed", "The server has returned an error.");
	}else{
		dismissError();
		createError("Sign Up Done", "Your account has been created.");
		location.href = "login.html";
	}
}




function delay(ms){	
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function mainLoop(){
	while (true){
		var newMode = giveMode();
		if (newMode != currentMode){
			currentMode = newMode;
			if (currentMode == true){
				adjustToMobile();
			}else{
				adjustToStandard();
			}
		}
		await delay(5000);
	}
}

mainLoop();


//verifCode
document.getElementById("verifCode").addEventListener("paste", () => {
	navigator.clipboard.readText()
	  .then(text => {
    if (text.length == 6){
    	document.getElementById("code1").value = text[0];
    	document.getElementById("code2").value = text[1];
    	document.getElementById("code3").value = text[2];
    	document.getElementById("code4").value = text[3];
    	document.getElementById("code5").value = text[4];
    	document.getElementById("code6").value = text[5];
    }
  });
});