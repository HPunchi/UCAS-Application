function giveMode(){
	var height = window.innerHeight;
	var width = window.innerWidth;
	var mobileMode = false;
	if (height > width){
		mobileMode = true;
	}
	return mobileMode;
}

