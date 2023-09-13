var username = sessionStorage.getItem("USERNAME");
if (username == null || username == ""){
	location.href = "index.html";
}
var user_EK = "-";
var i = 0;
for (i=0;i<username.length;i++){
	user_EK += (username[i].charCodeAt()).toString();
	user_EK += "-";
}
var password = "";
var theme = decrypt(sessionStorage.getItem('THEME'), user_EK);

let detailArray = [
	["forename", ""],
	["surname", ""],
	["dob", ""],
	["gender", ""],
	["username", username],
	["password", password],
	["country", ""],
	["theme", theme],


];
function initialiseAccountDetails(){
	firebase.database().ref("User Accounts").once("value", function(snapshot){
		snapshot.forEach(function(childSnapshot){
			if (username == childSnapshot.val()["username"]){
				
				
				var forename = decrypt(childSnapshot.val()["forename"], user_EK);
				var surname = decrypt(childSnapshot.val()["surname"], user_EK);
				var dob = decrypt(childSnapshot.val()["dob"], user_EK);
				var gender = decrypt(childSnapshot.val()["gender"], user_EK);
			
				password = decrypt(childSnapshot.val()["password"], user_EK);
				var country = decrypt(childSnapshot.val()["country"], user_EK);
				
				detailArray[0][1] = forename;
				detailArray[1][1] = surname;
				detailArray[2][1] = dob;
				detailArray[3][1] = gender;
				detailArray[6][1] = country;

				document.getElementById("forenameStatus").innerHTML = forename;
				document.getElementById("surnameStatus").innerHTML = surname;
				document.getElementById("dobStatus").innerHTML = dob;
				document.getElementById("genderStatus").innerHTML = gender;
				document.getElementById("usernameStatus").innerHTML = username;
				
				document.getElementById("countryStatus").innerHTML = country;
				document.getElementById("themeStatus").innerHTML = theme;
				
			}
			
		});
	});
}

function save(){
	location.href = "homepage.html";
}
function showPassword(){
	document.getElementById("passwordStatus").innerHTML = password;
	//document.getElementById("togglePasswordButton").innerHTML = "Hide Password";
	document.getElementById("togglePasswordButton").setAttribute("onclick", "hidePassword()");
}
function hidePassword(){
	document.getElementById("passwordStatus").innerHTML = "......";
	//document.getElementById("togglePasswordButton").innerHTML = "Show Password";
	document.getElementById("togglePasswordButton").setAttribute("onclick", "showPassword()");
}
function switchTheme(themeMode){
	if (themeMode == "dark"){
		document.getElementById("mainDIV").setAttribute("style", "background-color:rgb(0, 0, 0);color:rgb(255, 255, 255)");
		document.getElementById("mainTitle").setAttribute("style", "color:rgb(255, 255, 255)");
		document.getElementById("togglePasswordButton").setAttribute("style", "color:rgb(255, 255, 255)");
		var allItems = document.getElementsByClassName("editButton");
		for (var i=0;i<allItems.length;i++){
			allItems[i].setAttribute("style", "color:rgb(255, 255, 255)");
		}
		var allItems = document.getElementsByClassName("editInput");
		for (var i=0;i<allItems.length;i++){
			allItems[i].setAttribute("style", "color:rgb(255, 255, 255);background-color:rgb(0, 0, 0);border-color:rgb(255, 255, 255);");
		}
	}
	else if (themeMode == "light"){
		document.getElementById("mainDIV").setAttribute("style", "background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)");
		document.getElementById("mainTitle").setAttribute("style", "color:rgb(0, 0, 0)");
		document.getElementById("togglePasswordButton").setAttribute("style", "color:rgb(0, 0, 0)");
		var allItems = document.getElementsByClassName("editButton");
		for (var i=0;i<allItems.length;i++){
			allItems[i].setAttribute("style", "color:rgb(0, 0, 0)");
		}
		var allItems = document.getElementsByClassName("editInput");
		for (var i=0;i<allItems.length;i++){
			allItems[i].setAttribute("style", "color:rgb(0, 0, 0)background-color:rgb(255, 255, 255);border-color:rgb(0, 0, 0);");
		}
	}
}
switchTheme(theme);
initialiseAccountDetails();



function editForename(){
	var current = document.getElementById("forenameStatus").innerHTML;
	document.getElementById("eForename").style.display = "inline-block";
}
function editSurname(){
	var current = document.getElementById("surnameStatus").innerHTML;
	document.getElementById("eSurname").style.display = "inline-block";
}
function editDOB(){
	var current = document.getElementById("dobStatus").innerHTML;
	document.getElementById("eDOB").style.display = "inline-block";
}
function editGender(){
	var current = document.getElementById("genderStatus").innerHTML;
	document.getElementById("eGender").style.display = "inline-block";
}
function editPassword(){
	var current = document.getElementById("passwordStatus").innerHTML;
	document.getElementById("ePassword").style.display = "inline-block";
}
function editCountry(){
	var current = document.getElementById("countryStatus").innerHTML;
	//document.getElementById("eForename").style.display = "inline-block";
}
function editTheme(){
	var current = document.getElementById("themeStatus").innerHTML;
	document.getElementById("eTheme").style.display = "inline-block";
}