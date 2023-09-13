async function signIn(username, password){
	var sendObj = {
		username: username,
		password: password
	};
	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(sendObj),
	};
	const response = await fetch("/loginStream", options);
	const dataFEEDBACK = await response.json();

	if (dataFEEDBACK.status == "login-success"){
		var accountToken = dataFEEDBACK.accountToken;

		sessionStorage.setItem("accountToken", accountToken);
		
		if (document.getElementById('rememberMe').checked == true){
			localStorage.setItem("accountToken", accountToken);
		}

		location.href = "main.html";
	}else{
		alert("Login details incorrect.");
	}
}

function toggleCheckbox(){
	var currentVal = document.getElementById("rememberMe").checked;
	if (currentVal == false){
		document.getElementById("rememberMe").checked = true;
	}else{
		document.getElementById("rememberMe").checked = false;
	}
}

function checkRem(){
	
	if (localStorage.getItem("accountToken") != null){
		sessionStorage.setItem("accountToken", localStorage.getItem("accountToken"));
		location.href = "main.html";
	}
}
checkRem();



document.getElementById("passwordInput").addEventListener("keyup", (event) => {
	if (event.keyCode === 13){
		signIn(document.getElementById("usernameInput").value, document.getElementById("passwordInput").value);
	}
});