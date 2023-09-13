let verifArray = [
 ["Forename:", ""],
 ["Surname:", ""],
 ["DOB:", ""], 
 ["Gender:", ""], 
 ["Username:", ""], 
 ["Password:", ""], 
 ["Country:", ""],
 ["Email:", ""],
 ["Profile Pic Link:", ""],
 ["Wallpaper:", " "],
 ];
let trackArray = [
	"n",
	"n",
	"n",
	"n",
	"n",
	"n",
	"n",
	"n",
	"n",
	"n",
	"n",
];
//google
var pfpLOADER = "";
var pfpStat = "https://firebasestorage.googleapis.com/v0/b/ultramessage-a9c7e.appspot.com/o/UltraMessage%20Images%2Fdefault_account_icon.png?alt=media&token=1fac48f4-2110-4f92-9196-4d76e67c26aa";
var pfpType = "url";
let seqArray = ["forename", "surname", "dob", "gender", "username", "password1", "password2", "country", "email", "pfpLink"];
var theme = "light";

var tempPassword = false;
let numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let specArray = ["~", ":", "'", "+", "[", "\\", "@", "^", "{", "%", "(", "-", '"', "*", "|",",", "&", "<", "`", "}", ".", "_", "=", "]", "!", ">", ";", "?", "#", "$", ")", "/"];
let lowerCaseArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let upperCaseArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
function updatePass(tokenName){
	
	document.getElementById(tokenName + "Input").setAttribute("style", "border-color:rgb(12, 232, 77); color:rgb(12, 232, 77); background-color:var(--color-secondary);");
	
	document.getElementById(tokenName + "Label").setAttribute("style", "color:rgb(12, 232, 77)");
	document.getElementById(tokenName + "Error").setAttribute("style", "display:none");
}
function updateError(tokenName){
	
	document.getElementById(tokenName + "Input").setAttribute("style", "border-color:#ff0000; color:#ff0000; background-color:var(--color-secondary);");
	document.getElementById(tokenName + "Label").setAttribute("style", "color:rgb(255, 0, 0)");
	document.getElementById(tokenName + "Error").setAttribute("style", "display:inline-block");
}
function updateNeutral(tokenName){
	
	document.getElementById(tokenName + "Input").setAttribute("style", "border-color:var(--font-color);color:var(--font-color); background-color:var(--color-secondary)");
	document.getElementById(tokenName + "Label").setAttribute("style", "color:var(--font-color)");
	document.getElementById(tokenName + "Error").setAttribute("style", "display:none");		
}




function checkForename(){
	var name = (document.getElementById("forenameInput").value).toLowerCase();
	if (name == ""){
		verifArray[0][1] = "";
		updateNeutral("forename");
		trackArray[0] = "n";
		return 0;
	}
	var valid = true;
	var i = 0;
	for (i=0; i<name.length;i++){
		var currentLetter = name[i];
		if (isCharacterALetter(currentLetter) == false){
			valid = false;
			break;
		}
	}
	if (valid == true){
		updatePass("forename");
		trackArray[0] = "p";
		document.getElementById("forenameInput").value = toTitleCase(name);
		verifArray[0][1] = toTitleCase(name);
	}
	else if (valid == false){
		updateError("forename");
		verifArray[0][1] = "";
		trackArray[0] = "e";
	}	
}
function checkSurname(){
	var name = (document.getElementById("surnameInput").value).toLowerCase();
	if (name == ""){
		verifArray[1][1] = "";
		updateNeutral("surname");
		trackArray[1] = "n";
		return 0;
	}
	var valid = true;
	var i = 0;
	for (i=0; i<name.length;i++){
		var currentLetter = name[i];
		if (isCharacterALetter(currentLetter) == false){
			valid = false;
			break;
		}
	}
	if (valid == true){
		updatePass("surname");
		trackArray[1] = "p";
		document.getElementById("surnameInput").value = toTitleCase(name);
		verifArray[1][1] = toTitleCase(name);
		
	}
	else if (valid == false){
		updateError("surname");
		trackArray[1] = "e";
		verifArray[1][1] = "";

	}
}
function checkDOB(){
	var date = (document.getElementById("dobInput").value).toString();
	if (date == ""){
		verifArray[2][1] = "";
		updateNeutral("dob");
		trackArray[2] = "n";
		return 0;
	}
	var valid = true;
	if (date.length != 10){
		valid = false;
	}
	var date = (date.slice(8, 10) + "/" + date.slice(5, 7) + "/" + date.slice(0, 4));

	if (isFutureDate(date) == true){
		valid = false;
	}

	if (valid == true){
		updatePass("dob");
		trackArray[2] = "p";
		verifArray[2][1] = date;
	
	}
	else if (valid == false){
		updateError("dob");
		trackArray[2] = "e";
		verifArray[2][1] = "";

	}	
}
function checkGender(){
	var state1 = document.getElementById("male").checked;
	var state2 = document.getElementById("female").checked;
	var state3 = document.getElementById("other").checked;
	var gender = "";
	if (state1 == true){
		gender = "Male";
	}
	else if (state2 == true){
		gender = "Female";
	}
	else if (state3 == true){
		gender = "Other";
	}
	else{
		document.getElementById("genderLabel").setAttribute("style", "color:rgb(255, 0, 0)");
		document.getElementById("genderError").setAttribute("style", "display:inline-block");
		document.getElementById("maleText").setAttribute("style", "color:rgb(255, 0, 0)");
		document.getElementById("femaleText").setAttribute("style", "color:rgb(255, 0, 0)");
		document.getElementById("otherText").setAttribute("style", "color:rgb(255, 0, 0)");
		trackArray[3] = "e";
		verifArray[3][1] = "";
		return 0;
	}
	document.getElementById("genderLabel").setAttribute("style", "color:rgb(12, 232, 77)");
	document.getElementById("maleText").setAttribute("style", "color:rgb(12, 232, 77)");
	document.getElementById("femaleText").setAttribute("style", "color:rgb(12, 232, 77)");
	document.getElementById("otherText").setAttribute("style", "color:rgb(12, 232, 77)");
	document.getElementById("genderError").setAttribute("style", "display:none");
	trackArray[3] = "p";

	verifArray[3][1] = gender;
}
async function checkUsername(){
	var username = document.getElementById("usernameInput").value;
	if (username == ""){
		verifArray[4][1] = "";
		updateNeutral("username");
		trackArray[4] = "n";
		return 0;
	}


	var sendObj = {
		reqUsername: username,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/usernameStream", options);
	const dataFEEDBACK = await response.json();
	


	if (dataFEEDBACK.usernameTaken == "true"){
		updateError("username");
		trackArray[4] = "e";
		verifArray[4][1] = "";
	}
	else if (dataFEEDBACK.usernameTaken == "false"){
		updatePass("username");
		trackArray[4] = "p";
		verifArray[4][1] = username;
	}
}
function checkPassword1(){
	var p1 = document.getElementById("password1Input").value;
	var valid = true;
	if (p1 == ""){
		verifArray[5][1] = "";
		updateNeutral("password1");
		trackArray[5] = "n";
		return 0;
	}
	if (p1.length < 7){
		valid = false;
	}
	else{
		var i = 0;
		var numIncluded = false;
		var uppercaseIncluded = false;
		var lowercaseIncluded = false;
		for (i=0;i<p1.length;i++){
			currentLetter = p1[i];
			if (numArray.includes(currentLetter) == true){
				numIncluded = true;
			}
			if (upperCaseArray.includes(currentLetter) == true){
				uppercaseIncluded = true;
			}
			if (lowerCaseArray.includes(currentLetter) == true){
				lowercaseIncluded = true;
			}
		}
		if ((numIncluded==true) && (uppercaseIncluded==true) && (lowercaseIncluded==true)){
			valid = true;		}
		else{
			valid = false;
		}
	}
	
	if (valid == true){
		tempPassword = true;
		updatePass("password1");
		trackArray[5] = "p";
		
	}
	else{
		alert("This password does not meet the criteria:\n - Your password must be above 6 characters in length.\n - Your password must contain at least 1 upper case letter.\n - Your password must also contain at least 1 lower case letter.");

		updateError("password1");
		trackArray[5] = "e";
	}	
}
function checkPassword2(){
	var p1 = document.getElementById("password1Input").value;
	var p2 = document.getElementById("password2Input").value;
	if (p2 == "" || p1 == ""){
		verifArray[5][1] = "";
		updateNeutral("password2");
		trackArray[6] = "n";
		return 0;
	}
	if (p1 == p2 && tempPassword == true){
		verifArray[5][1] = p2;
		updatePass("password2");
		trackArray[6] = "p";
	}
	else{
		updateError("password2")
		trackArray[6] = "e";
	}
}
function checkCountry(){
	var country = document.getElementById("countries").value;
	if (country == "YetToSelect"){
		verifArray[6][1] = "";
		if (theme == "dark"){
			document.getElementById("countries").setAttribute("style", "border-color:rgb(255, 0, 0); color:rgb(255, 0, 0);background-color:rgb(0, 0, 0)");
		}
		else if (theme == "light"){
			document.getElementById("countries").setAttribute("style", "border-color:rgb(255, 0, 0); color:rgb(255, 0, 0); background-colorrgb(255, 255, 255)");
		}
		document.getElementById("countryLabel").setAttribute("style", "color:rgb(255, 0, 0)");
		document.getElementById("countryError").setAttribute("style", "display:inline-block");
		trackArray[7] = "e";

	}

	verifArray[6][1] = country;
	if (theme == "dark"){
		document.getElementById("countries").setAttribute("style", "border-color:rgb(12, 232, 77); color:rgb(12, 232, 77);background-color:rgb(0, 0, 0)");
	}
	else if (theme == "light"){
		document.getElementById("countries").setAttribute("style", "border-color:rgb(12, 232, 77); color:rgb(12, 232, 77); background-colorrgb(255, 255, 255)");
	}
	
	document.getElementById("countryLabel").setAttribute("style", "color:rgb(12, 232, 77)");
	document.getElementById("countryError").setAttribute("style", "display:none");
	trackArray[7] = "p";
}
function checkEmail(){
	var emailAddress = document.getElementById("emailInput").value;
	if (emailAddress == ""){
		updateNeutral("email");
		verifArray[7][1] = "";
		trackArray[8] = "n";
		return;
	}
	if (validateEmail(emailAddress) == true){
		updatePass("email");
		verifArray[7][1] = emailAddress;
		trackArray[8] = "p";
	}else{
		updateError("email");
		verifArray[7][1] = "";
		trackArray[8] = "e";
	}
}
function pLoginFunc(){
	location.href = "signInPage.html";
}
function back(){
	location.href = "index.html";
}
function next(){
	var ready = true;
	var i = 0;
	for (i=0; i<trackArray.length;i++){
		currentToken = trackArray[i];
		if (currentToken != "p"){
			ready = false;
		}
	}
	if (ready == false){
		alert("Some of your details are currently not filled out or are invalid - please corrent them or fill them in.");
		return;
	}
	var encrKey = "-";
	var i = 0;
	var username = verifArray[4][1];
	for (i=0;i<username.length;i++){
		encrKey += (username[i].charCodeAt()).toString();
		encrKey += "-";
	}
	var chatArray = [["RecUsername", "ChatID"]];

	var serverData = {
		forename:encrypt(verifArray[0][1], encrKey),
		surname:encrypt(verifArray[1][1], encrKey),
		dob:encrypt(verifArray[2][1], encrKey),
		gender:encrypt(verifArray[3][1], encrKey),
		username:(verifArray[4][1]),
		password:encrypt(verifArray[5][1], encrKey),
		country:encrypt(verifArray[6][1], encrKey),
		theme:encrypt(theme, encrKey),
		firstTimeLogin:encrypt("false", encrKey),
	};

	try{
		firebase.database().ref("User Accounts").push(serverData);
		firebase.database().ref(("User Contact List/" + encrKey)).set({contactArray:chatArray});
	}
	catch(err){
		alert("There was an error in sending your details to the server.");
		console.log(err);
		return;
	}

	document.getElementById("column1DIV").style.display = "none";
	document.getElementById("column2DIV").style.display = "none";
	document.getElementById("mainTitle").innerText = "Sign Up Complete!";

	document.getElementById("submitButton").innerText = "Login";
	//innerHTML
	document.getElementById("submitButton").setAttribute("onclick", "pLoginFunc()");
}
function seeMain(){
	document.getElementById("column1DIV").style.display = "block";
	document.getElementById("column2DIV").style.display = "block";
	document.getElementById("column3DIV").style.display = "none";
	
	document.getElementById("backButton").setAttribute("onclick", "back()");
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase1()");
	
}
function seeMailV(){
	document.getElementById("column3DIV").style.display = "block";
	document.getElementById("column4DIV").style.display = "none";

	document.getElementById("backButton").setAttribute("onclick", "seeMain()");
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase2()");
}
function seePfp(){
	document.getElementById("column4DIV").style.display = "block";
	document.getElementById("column5DIV").style.display = "none";

	document.getElementById("backButton").setAttribute("onclick", "seeMailV()");
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase4()");
}
function seeWP(){
	document.getElementById("column5DIV").style.display = "block";
	document.getElementById("column6DIV").style.display = "none";

	document.getElementById("backButton").setAttribute("onclick", "seePfp()");
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase5()");
}
function moveOnPhase1(){
	var flag = true;
	for (var i=0;i<verifArray.length - 3;i++){
		if (verifArray[i][1] == ""){
			flag = false;
		}
	}
	if (flag == false){
		alert("Please enter all of your details.");
		return;
	}
	document.getElementById("column1DIV").style.display = "none";
	document.getElementById("column2DIV").style.display = "none";
	document.getElementById("column3DIV").style.display = "block";
	
	
	document.getElementById("backButton").setAttribute("onclick", "seeMain()");
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase3()");
	
}
async function moveOnPhase2(){
	var email = verifArray[7][1];
	if (email == ""){
		alert("Please enter an email address to verify for an account.");
		return;
	}
	var sendObj = {
		emailReq: email,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/emailVerifStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.serverResponse == "email sent"){
		alert("A 6-digit code has been sent to your email address. Please enter it below.");
	}else if (dataFEEDBACK.serverResponse == "error occured"){
		alert("An error occured");
		console.log(dataFEEDBACK.errorMsg);
	}
	
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase3()");
}
async function moveOnPhase3(){

	var enteredCode = document.getElementById("codeInput").value;
	if (enteredCode == ""){
		alert("Please enter the code which was emailed to your email address.");
		updateNeutral("code");
		return;
	}
	var sendObj = {
		userEmail: verifArray[7][1],
		codeReq: enteredCode,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/codeEmailStream", options);
	const dataFEEDBACK = await response.json();	

	if (dataFEEDBACK.codeStat == "correct"){
		updatePass("code");
		document.getElementById("backButton").setAttribute("onclick", "seeMailV()");
		document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase4()");
		document.getElementById("column3DIV").style.display = "none";
		document.getElementById("column4DIV").style.display = "block";
		document.getElementById("uPrev").innerText = verifArray[4][1];
		//innerHTML

	}else if(dataFEEDBACK.codeStat == "incorrect"){

		updateError("code");
		return;
	}
}
function moveOnPhase4(){	
	var image = document.getElementById("previewImage").src;
	verifArray[8][1] = image;

	document.getElementById("column4DIV").style.display = "none";
	document.getElementById("column5DIV").style.display = "block";

	document.getElementById("backButton").setAttribute("onclick", "seePfp()");
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase5()");
	
	
}
function moveOnPhase5(){
	document.getElementById("column5DIV").style.display = "none";
	document.getElementById("column6DIV").style.display = "block";
	loadChecks();
	document.getElementById("backButton").setAttribute("onclick", "seeWP()");
	document.getElementById("nextButton").setAttribute("onclick", "moveOnPhase6()");
}
function moveOnPhase6(){
	proceedSU();
}
function imageExists(url, callback) {
  	var img = new Image();
  	img.onload = function() { callback(true); };
  	img.onerror = function() { callback(false); };
  
  	img.src = url; 	
}
function skipPFP(){
	document.getElementById("previewImage").src = "https://firebasestorage.googleapis.com/v0/b/ultramessage-a9c7e.appspot.com/o/UltraMessage%20Images%2Fdefault_account_icon.png?alt=media&token=1fac48f4-2110-4f92-9196-4d76e67c26aa";		
	moveOnPhase4();

}

function clearURL(){
	document.getElementById("urlInput").value = "";
	document.getElementById("previewImage").src = "https://firebasestorage.googleapis.com/v0/b/ultramessage-a9c7e.appspot.com/o/UltraMessage%20Images%2Fdefault_account_icon.png?alt=media&token=1fac48f4-2110-4f92-9196-4d76e67c26aa";
	pfpType = "url"
	fileColor("all-neutral");
}
function fileColor(status){
	if (status == "all-green"){
		var clrElem = document.getElementById("clearButton");
		clrElem.color = "rgb(12, 232, 77)";
		var labelElem = document.getElementById("urlLabel");
		var inElem = document.getElementById("urlInput");
		var errorElem = document.getElementById("urlError");
		inElem.style.color = "rgb(12, 232, 77)";
		errorElem.display = "none";
		labelElem.style.color = "rgb(12, 232, 77)";

		var labelElem = document.getElementById("fileLabel");
		var inElem = document.getElementById("uploadIcon");
		
		inElem.style.color = "rgb(12, 232, 77)";
		
		labelElem.style.color = "rgb(12, 232, 77)";
	}else if (status == "all-neutral"){
		var clrElem = document.getElementById("clearButton");
		clrElem.color = "var(--font-color)";
		var labelElem = document.getElementById("urlLabel");
		var inElem = document.getElementById("urlInput");
		var errorElem = document.getElementById("urlError");
		inElem.style.color = "var(--font-color)";
		errorElem.display = "none";
		labelElem.style.color = "var(--font-color)";

		var labelElem = document.getElementById("fileLabel");
		var inElem = document.getElementById("uploadIcon");
		
		inElem.style.color = "var(--font-color)";
		
		labelElem.style.color = "var(--font-color)";
	}else if (status == "all-red"){
		var clrElem = document.getElementById("clearButton");
		clrElem.color = "rgb(255, 0, 0)";
		var labelElem = document.getElementById("urlLabel");
		var inElem = document.getElementById("urlInput");
		var errorElem = document.getElementById("urlError");
		inElem.style.color = "rgb(255, 0, 0)";
		errorElem.display = "inline-block";
		labelElem.style.color = "rgb(255, 0, 0)";

		var labelElem = document.getElementById("fileLabel");
		var inElem = document.getElementById("uploadIcon");
		
		inElem.style.color = "rgb(255, 0, 0)";
		
		labelElem.style.color = "rgb(255, 0, 0)";
	}
}
function loadImgFromURL(){
	var imageUrl = document.getElementById("urlInput").value;
	
	if (imageUrl == ""){
		fileColor("all-neutral");
		return;
	}
	pfpLOADER = imageUrl;
	pfpType = "url";
	imageExists(imageUrl, function(exists) {
	
		if (exists == true){
			document.getElementById("previewImage").src = imageUrl;
			verifArray[8][1] = imageUrl;
			fileColor("all-green");
		}
		else{
			document.getElementById("previewImage").src = "https://firebasestorage.googleapis.com/v0/b/ultramessage-947ac.appspot.com/o/UltraMessage%20Images%2Fdefault_account_icon.png?alt=media&token=853dcadc-cd38-469f-83b1-b5b0c772dddd";
			fileColor("all-red");			
		}
	});
	
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

			pfpLOADER = reader.result;
			pfpType = "file";
			var file = files[0];
			


		}
		reader.readAsDataURL(files[0]);
	}
	dummyInp.click();

}

async function proceedSU(){
	var sendObj = {
		forename: verifArray[0][1],
		surname: verifArray[1][1],
		dob: verifArray[2][1],
		gender: verifArray[3][1],
		username: verifArray[4][1],
		password: verifArray[5][1],
		country: verifArray[6][1],
		email: verifArray[7][1],
		pfpUrl: verifArray[8][1],
		theme: localStorage.getItem("theme"),
		wallpaper: verifArray[9][1],
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/mainSignUpStream", options);
	const dataFEEDBACK = await response.json();
	if (dataFEEDBACK.success == "true"){
		alert("Your account has been made successfully! Please click 'Ok' to proceed to your new account.");
		pLoginFunc();
	}else{
		alert("The server responsed with an error. Please try again later.");
		return;
	}
}


function isCharacterALetter(char) {
    return (/[a-zA-Z]/).test(char)
}
function isFutureDate(idate){
	var today = new Date().getTime(),
	    idate = idate.split("/");

	idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
	return (today - idate) < 0 ? true : false;
}
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}






function toggleTheme() {
   if (localStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
       
   } else {
       setTheme('theme-dark');
   }
}

function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

if (localStorage.getItem('theme') === 'theme-dark') {
	setTheme('theme-dark');

} else {
	setTheme('theme-light');
    
}



document.getElementById("mainBody").addEventListener("keypress", function(e){
	if (e.key == "Enter"){
		//moveOnPhase1();
	}
});

document.getElementById("urlInput").addEventListener("keypress", function(e){
	if (e.key == "Enter"){
		loadImgFromURL();
	}
});



function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function loadChecks(){
	document.getElementById("nameCheck").innerText = verifArray[0][1] + " " + verifArray[1][1];
	document.getElementById("dobCheck").innerText = verifArray[2][1];
	document.getElementById("genderCheck").innerText = verifArray[3][1];
	document.getElementById("usernameCheck").innerText = verifArray[4][1];
	document.getElementById("countryCheck").innerText = verifArray[6][1];
	document.getElementById("emailCheck").innerText = verifArray[7][1];
}

async function loadWallpapers(){
	var sendObj = {
		wpArr: ""
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/wallpaperLoadStream", options);
	const dataFEEDBACK = await response.json();
	var wpArr = [];																													
	if (dataFEEDBACK.stat == "true"){																							
		wpArr = dataFEEDBACK.wpArr;																					
	}																																		

																																															
	var topsWP = 0;
	for (var i=0;i<wpArr.length;i++){
	
		var currentWP = wpArr[i];

		
		

		//APENDING NEW DIV -----------------------------------
		var newE = document.createElement("div");																												
	
	
		newE.class = "prevWP";
		newE.value = currentWP;
		newE.setAttribute("onclick", "selectWP(this.value)");

		newE.setAttribute("class", "prevWP");														
		newE.id = "prevWP-" + i.toString();

		document.getElementById("wpPrevs").appendChild(newE);
		//-------------------------------------------------------------------


		//APPENDING IMMAGE---------------------------------------
		var newIMG = document.createElement("img");

		newIMG.setAttribute("class", "wpIMG");
		newIMG.src = currentWP;
		newIMG.id = "wpIMG-" + i.toString();
		document.getElementById("prevWP-" + i.toString()).appendChild(newIMG);
		//-------------------------------------------------------------------
	
	
		
		document.getElementById("wpPrevs").appendChild(document.createElement("br"));
		
		
	}
}
function selectWP(wpSrc){
	document.getElementById("bgDIV").setAttribute("style", "background-image: url(" + wpSrc + ")");
	verifArray[9][1] = wpSrc;
	trackArray[9] = "p";
}
loadWallpapers();