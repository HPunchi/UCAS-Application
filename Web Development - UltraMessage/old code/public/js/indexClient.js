var currentMode = giveMode();
if (currentMode == true){
	adjustToMobile();
}else{
	adjustToStandard();
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
function openUM(){
	location.href = "login.html";
}	
function register(){	
	location.href = "register.html";
}


function adjustToMobile(){
	document.getElementById("cssControl").setAttribute("href", "css/indexMobile.css");
}
function adjustToStandard(){
	document.getElementById("cssControl").setAttribute("href", "css/indexStandard.css");
}


if (localStorage.getItem("theme") === null){
	setTheme("theme-light");
}else if (localStorage.getItem("theme") === "theme-dark"){
	setTheme("theme-dark");
}else{
	setTheme("theme-light");
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