const DataStore = require("nedb");

const database = new DataStore("database.db");
database.loadDatabase();


//database.insert({name:"Harman", status:"online"});

database.find({name:"Harman", status:"offline"}, (error, data) =>{
	if (error){
		console.log(error);
		return;
	}
	console.log(data);
});

console.log("Complete");