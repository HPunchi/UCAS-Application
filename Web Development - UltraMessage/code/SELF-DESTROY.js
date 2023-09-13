const DataStore = require("nedb");
const prompt = require('prompt-sync')();



console.log("========================================================================");
console.log("\nWARNING! THIS FILE WILL PERMANTLY ERASE ALL DATA ON ULTRAMESSAGE SERVERS.\n");
console.log("========================================================================");

for (var i=0;i<3;i++){
	console.log("\n");
}
var continueCOM = prompt("Enter (yes) to continue...\n");
if (continueCOM != "yes"){
	console.log("Self-destruct aborted.");
	process.exit(1);
}
console.log("=========================================================");
console.log("\n THIS PROCESS CANNOT BE UNDONE AND IS FULLY IRREVERSIBLE.\n");
console.log("=========================================================");
for (var i=0;i<3;i++){
	console.log("\n");
}
var continueCOM = prompt("Enter (yes) to continue...\n");
if (continueCOM != "yes"){
	console.log("Self-destruct aborted.");
	process.exit(1);
}
for (var i=0;i<3;i++){
	console.log("\n");
}
var continueCOM = prompt("Type in 'ultramessage.destruct()' to confirm self destruction");
if (continueCOM != "ultramessage.destruct()"){
	console.log("Self-destruct aborted.");
	process.exit(1);
}


var accountsDatabase = new DataStore("accountsDatabase.db");
accountsDatabase.loadDatabase();
var chatsDatabase = new DataStore("chatsDatabase.db");
chatsDatabase.loadDatabase();



chatsDatabase.remove({}, {multi:true}, (error, numRemoved) => {
	chatsDatabase.loadDatabase((err) => {});
});
console.log("Chats database fully cleared...");


accountsDatabase.remove({}, {multi:true}, (error, numRemoved) => {
	accountsDatabase.loadDatabase((err) => {});
});

console.log("================");
console.log("Action complete.");
console.log("================");


