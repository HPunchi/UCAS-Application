function updatePass(tokenName){
	if (theme == "dark"){
		document.getElementById(tokenName + "Input").setAttribute("style", "border-color:rgb(12, 232, 77); color:rgb(12, 232, 77);");
	}
	else if (theme == "light"){
		document.getElementById(tokenName + "Input").setAttribute("style", "border-color:rgb(12, 232, 77); color:rgb(12, 232, 77);");
	}
	document.getElementById(tokenName + "Label").setAttribute("style", "color:rgb(12, 232, 77)");
	document.getElementById(tokenName + "Error").setAttribute("style", "display:none");
}
function updateError(tokenName){
	if (theme == "dark"){
		document.getElementById(tokenName + "Input").setAttribute("style", "border-color:rgb(255, 0, 0); color:rgb(255, 0, 0);");
	}
	else if (theme == "light"){
		document.getElementById(tokenName + "Input").setAttribute("style", "border-color:rgb(255, 0, 0); color:rgb(255, 0, 0);");
	}
	document.getElementById(tokenName + "Label").setAttribute("style", "color:rgb(255, 0, 0)");
	document.getElementById(tokenName + "Error").setAttribute("style", "display:inline-block");
}
function updateNeutral(tokenName){
	if (theme == "light"){
		document.getElementById(tokenName + "Input").setAttribute("style", "border-color:var(--font-color);color:var(--font-color); background-color:var(--color-secondary)");
		document.getElementById(tokenName + "Label").setAttribute("style", "color:var(--font-color);");
		document.getElementById(tokenName + "Error").setAttribute("style", "display:none");
	}
	else if (theme == "dark"){
		document.getElementById(tokenName + "Input").setAttribute("style", "border-color:var(--font-color);color:var(--font-color); background-color:var(--color-secondary)");
		document.getElementById(tokenName + "Label").setAttribute("style", "color:var(--font-color);");
		document.getElementById(tokenName + "Error").setAttribute("style", "display:none");
	}	
}
//innerHTML







function onSignIn(googleUser) {
  	var profile = googleUser.getBasicProfile();
 	var googleID = profile.getId(); 
  	var fullName = profile.getName();
  	var profilePicURL = profile.getImageUrl();
  	var emailAddress = profile.getEmail();
  	var username = emailAddress.replace("@gmail.com", "");
  	
}

let loginArray = ["", ""];
let trackArray = ["n", "n"];
let seqArray = ["username", "password"];
function back(){
	location.href = "index.html";
}
function signIn(username, theme, user, freqEmos){
	var remMe = document.getElementById("rmInput").checked;
	if (remMe == true){
		localStorage.setItem("USERNAME_LOG", username);
		localStorage.setItem("THEME_LOG", theme);
		localStorage.setItem("USER_LOG", user);
	}
	sessionStorage.setItem("USERNAME", username);
	sessionStorage.setItem("THEME", theme);
	sessionStorage.setItem("USER", user);
	sessionStorage.setItem("FREQ_EMOS", freqEmos);
	sessionStorage.setItem("theme", theme);
	location.href = "homepage.html";
}
async function checkPassword(){
	var password = document.getElementById("passwordInput").value;
	if (password == ""){
		updateNeutral("password");
		trackArray[1] = "n"; 
		loginArray[1] = "";   
		return;
	}
	if (loginArray[0] == ""){
		updateNeutral("password");
		trackArray[1] = "n"; 
		loginArray[1] = "";   
		return;
	}
	var sendObj = {
		reqUsername: loginArray[0],
		reqPassword: password,
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/passwordCheckStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "login-accepted"){
		updatePass("password");
		var theme = localStorage.getItem("theme");
		var pfpUrl = dataFEEDBACK.pfp;
		sessionStorage.setItem("profile_pic_url", pfpUrl);
		signIn(dataFEEDBACK.userToken, theme, loginArray[0], "freq");
		return;
	}else{
		updateError("password");
		loginArray[1] == "";
		trackArray[1] == "e";
		return;
	}
}

async function checkUsername(){
	var username = document.getElementById("usernameInput").value;
	if (username == ""){
		updateNeutral("username");
		loginArray[0] = "";
		trackArray[0] = "n";
		return;
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
	const response = await fetch("/usernameCheckStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "user-found"){
		setTheme(dataFEEDBACK.theme);
		updatePass("username");
		loginArray[0] = username;
		trackArray[0] = "p";
		document.getElementById("passwordDIV").style.display = "block";	
		document.getElementById("passwordInput").focus();
	}else{
		updateError("username");
		loginArray[0] = "";
		trackArray[0] = "e";
	}
	document.getElementById("submitButton").setAttribute("onclick", "checkPassword()");
}

function check(){
	if (document.getElementById("rmInput").checked == true){
		document.getElementById("rmInput").checked = false;
	}else{
		document.getElementById("rmInput").checked = true;
	}
}


var username = document.getElementById("usernameInput");
var password = document.getElementById("passwordInput");
username.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        checkUsername();
    }
});
password.addEventListener("keydown", function (e) {
	if (e.keyCode === 13){
		checkPassword();
	}
});

var usernameLOG = localStorage.getItem("USERNAME_LOG");
var themeLOG = localStorage.getItem("THEME_LOG");
if (usernameLOG != null){
	signIn(usernameLOG, themeLOG);
}

function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
   	document.documentElement.className = themeName;
}
function toggleTheme() {
	
    if (localStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
       
    } else {
       setTheme('theme-dark');
    }
    var i = 0;
	for (i=0; i<trackArray.length;i++){
		var currentStat = trackArray[i];
		var currentToken = seqArray[i];
		if (currentStat == "p"){
			updatePass(currentToken);
		}
		else if (currentStat == "e"){
			updateError(currentToken);
		}
		else if (currentStat == "n"){
			updateNeutral(currentToken);
		}

	}
}


var theme = localStorage.getItem("MAIN_THEME");

if (localStorage.getItem('theme') === 'theme-dark') {
	setTheme('theme-dark');
	

	//document.getElementById("themeCheckbox").checked = true;
} else {
	setTheme('theme-light');
	//document.getElementById("themeCheckbox").checked = false;
}










