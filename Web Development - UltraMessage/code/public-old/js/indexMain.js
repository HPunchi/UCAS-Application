function setupCanvas(){
	
	var total_height = (window.innerHeight).toString() + "px";
	var total_width = (window.innerWidth).toString() + "px";
	document.getElementById("theme-switcher").checked = false;

	localStorage.setItem("MAIN_THEME", "light");
}
function signUp(){
	location.href = "signUpPage.html";
}
function signIn(){
	if (localStorage.getItem("theme") == "theme-dark"){
		localStorage.setItem("MAIN_THEME", "dark");
	}
	else{
		localStorage.setItem("MAIN_THEME", "light");
	}
	
	location.href = "signInPage.html";
}




// New Code by Paralax#7228

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
   if (localStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
       
   } else {
       setTheme('theme-dark');
   }
}

// Immediately invoked function to set the theme on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-dark') {
       setTheme('theme-dark');
   } else {
       setTheme('theme-light');
   }
})();

