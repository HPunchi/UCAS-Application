const express = require("express");
const path = require("path");
const firebase = require("firebase");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const fs = require('fs');
const http = require("http");




//console
function createToken(tokenLength = 32) {
    return crypto.randomBytes(tokenLength).toString("hex");
}

function encrypt(text, key) {
    var key = Buffer.from(key, "hex");
    let iv = Buffer.from(key.slice(0, 16), "hex");
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, key) {
    var key = Buffer.from(key, "hex");

    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

function hash(text) {
    return crypto.createHash("md5").update(text).digest("hex");
}

function GetFormattedDate(date) {
    var date = new Date();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + (date.getDate())).slice(-2);
    var year = date.getFullYear();
    var hour = ("0" + (date.getHours())).slice(-2);
    var min = ("0" + (date.getMinutes())).slice(-2);
    var seg = ("0" + (date.getSeconds())).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg;
}
function arr_diff(a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}





function setOnline(userToken) {
    firebase.database().ref("Accounts/" + userToken).update({ status: "online" });
}
function setOffline(userToken) {
    firebase.database().ref("Accounts/" + userToken).update({ status: "offline" });
}
const firebaseConfig = {
    apiKey: "AIzaSyBdivPAAwbMMlrvcONLN7KyBLaLuEX95vw",
    authDomain: "ultramessage-434eb.firebaseapp.com",
    databaseURL: "https://ultramessage-434eb-default-rtdb.firebaseio.com",
    projectId: "ultramessage-434eb",
    storageBucket: "ultramessage-434eb.appspot.com",
    messagingSenderId: "709152600224",
    appId: "1:709152600224:web:b67a091ff4be49ece819c5",
    measurementId: "G-3NNT03KW0Y"
};

firebase.initializeApp(firebaseConfig);

const app = express();

//SET STATIC FOLDER
app.use("/", express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "1mb" }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");

});
//=============================================================================
app.get("/signUpPage.html", (req, res) => {
    res.sendFile(__dirname + "/public/signUpPage.html");
});


app.post("/usernameStream", (req, res) => {
    //firebase.database().ref("")
    var username = req.body.reqUsername;
    firebase.database().ref("Accounts/").once("value", (snapshot) => {
        var takenUsernames = [];
        snapshot.forEach((childSnapshot) => {
            takenUsernames.push(childSnapshot.val().username);
        });
        if (takenUsernames.includes(username)) {
            var dataFEEDBACK = {
                usernameTaken: "true"
            };
            res.json(dataFEEDBACK);
        } else {
            var dataFEEDBACK = {
                usernameTaken: "false"
            };
            res.json(dataFEEDBACK);
        }
    });
});

verifCode = "";
app.post("/emailVerifStream", (req, res) => {
    var userEmail = req.body.emailReq;


    //var template = fs.readFileSync('emailVerif.html',{encoding:'utf-8'});


    verifCode = (Math.floor(100000 + Math.random() * 900000)).toString();


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,

        auth: {
            user: 'ultramessage.verify@gmail.com',
            pass: 'hcrttinenygnqkpy',


        }
    });

    var mailOptions = {
        from: 'ultramessage.verify@gmail.com',
        to: userEmail,
        subject: 'Sign Up - Verification',
        text: verifCode.toString(),

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.json({ serverResponse: "error occured", errorMsg: error });
        } else {
            res.json({ serverResponse: "email sent", nmr: info.response });
        }
    });
});

app.post("/codeEmailStream", (req, res) => {
    var codeReq = req.body.codeReq;
    if (codeReq == verifCode) {
        res.json({ codeStat: "correct" });
    } else {
        res.json({ codeStat: "incorrect" });
    }
});

app.post("/pfpStream", (req, res) => {
    var username = req.body.username;

    var imageSrc = req.body.imageUrl;

    var img = imageSrc.split(";base64,").pop();
    fs.writeFile("ac-cr-pfp-temp/pfp.png", img, { encoding: "base64" }, function (err) {

    });
    var uploadTask = firebase.storage().ref("Images/hi").put(imageSrc);


});



app.post("/mainSignUpStream", (req, res) => {
    var signUpObject = req.body;

    var username = signUpObject.username;
    var userToken = createToken();
    var tempToken = createToken();
    var overallAccountObject = {
        forename: encrypt(signUpObject.forename, userToken),
        surname: encrypt(signUpObject.surname, userToken),
        gender: encrypt(signUpObject.gender, userToken),
        dob: encrypt(signUpObject.dob, userToken),
        username: (signUpObject.username),
        password: hash(encrypt(signUpObject.password, userToken)),
        country: encrypt(signUpObject.country, userToken),
        email: encrypt(signUpObject.email, userToken),
        theme: encrypt(signUpObject.theme, userToken),
        pfpUrl: encrypt(signUpObject.pfpUrl, userToken),
        contactArray: [[encrypt("cn", tempToken), tempToken]],
        status: "offline"
    };



    firebase.database().ref("Accounts/" + userToken).set(overallAccountObject);
    firebase.database().ref("Tokens/" + username).set({ token: userToken });

    res.json({ success: "true" });
});
//============================================================================
app.get("/signInPage.html", (req, res) => {
    res.sendFile(__dirname, "/public/signInPage.html");
});

var accountData = {};

app.post("/usernameCheckStream", (req, res) => {
    var username = req.body.reqUsername;
    var tokenArray = [];
    firebase.database().ref("Tokens").once("value", (snapshot) => {
        var tokenObj = snapshot.val();
        var keysT = Object.keys(tokenObj);
        for (var i = 0; i < keysT.length; i++) {
            var currentUser = keysT[i];
            tokenArray.push(tokenObj[currentUser].token);
        }


        firebase.database().ref("Accounts/").once("value", (aSnapshot) => {
            var aObj = aSnapshot.val();

            var userFound = false;
            for (var i = 0; i < tokenArray.length; i++) {
                var currentUserToken = tokenArray[i];

                var caObj = aObj[currentUserToken];
                if (caObj.username == username) {
                    userFound = true;
                    var theme = decrypt(caObj.theme, currentUserToken);
                    res.json({ status: "user-found", theme: theme, username: username });
                    break;
                }
            }
            if (userFound == false) {
                res.json({ status: "user-not-found", theme: "none", username: "none" });
            }
        });

    });
});
app.post("/passwordCheckStream", (req, res) => {
    var username = req.body.reqUsername;
    var password = req.body.reqPassword;

    firebase.database().ref("Tokens/" + username).once("value", (snapshot) => {

        var userToken = snapshot.val().token;
        password = hash(encrypt(password, userToken));

        firebase.database().ref("Accounts/" + userToken).once("value", (aSnapshot) => {
            if (aSnapshot.val().username == username) {

                if (aSnapshot.val().password == password) {
                    var pfpUrl = decrypt(aSnapshot.val().pfpUrl, userToken);

                    res.json({ status: "login-accepted", pfp: pfpUrl, userToken: userToken });
                } else {
                    res.json({ status: "login-denied" });
                }
            } else {
                res.json({ status: "login-denied" });
            }
        });
    });
});
//============================================================================
function getUsername(checkObj, token) {

    var usernameF = "";
    var keysObj = Object.keys(checkObj);
    for (var i = 0; i < keysObj.length; i++) {
        var currentKey = keysObj[i];

        if (token == checkObj[keysObj[i]].token) {
            usernameF = keysObj[i];
            break;
        }
    }
    return usernameF;
}
app.get("/homepage.html", (req, res) => {
    res.sendFile(__dirname, "/public/homepage.html");
});

app.post("/getUserStream", (req, res) => {

    var userToken = req.body.userToken;
    setOnline(userToken);
    firebase.database().ref("Tokens/").once("value", (snapshot) => {
        var userFeedback = getUsername(snapshot.val(), userToken);
        if (userFeedback == "") {
            res.json({ error: "true" });
        } else {
            res.json({ user: userFeedback });
        }

    });
});
app.post("/createChat-checkContactsStream", (req, res) => {
    var userToken = req.body.loggedUser;
    var reqUser = req.body.reqestedUsername;
    var username = "";
    firebase.database().ref("/").once("value", (snapshot) => {
        username = getUsername(snapshot.val().Tokens, userToken);
        firebase.database().ref("/Accounts/").once("value", (snapshot) => {
            var totalUsernames = [];
            snapshot.forEach((childSnapshot) => {
                totalUsernames.push(childSnapshot.val().username);
            });
            if (totalUsernames.includes(reqUser) == false) {
                res.json({ status: "user-not-found" });
                return;
            }
            firebase.database().ref("Tokens/" + username).once("value", (snapshot) => {
                var userToken = snapshot.val().token;

                firebase.database().ref("Accounts/" + userToken).once("value", (aSnapshot) => {
                    var contactElement = aSnapshot.val().contactArray;
                    var reqUInContacts = false;
                    for (var i = 0; i < contactElement.length; i++) {
                        if (decrypt(contactElement[i][0], contactElement[i][1]) == reqUser) {
                            reqUInContacts = true;
                            break;
                        }
                    }
                    if (reqUInContacts == true) {
                        res.json({ status: "user-in-contacts" });
                        return
                    }
                    var newChatID = createToken();
                    var tempA = [encrypt(reqUser, newChatID), newChatID];
                    var recA = [encrypt(username, newChatID), newChatID];
                    contactElement.push(tempA);
                    firebase.database().ref("Accounts/" + userToken).update({ contactArray: contactElement });
                    firebase.database().ref("Tokens/" + reqUser).once("value", (tSnapshot) => {
                        var recToken = tSnapshot.val().token;
                        firebase.database().ref("Accounts/" + recToken).once("value", (newASnap) => {
                            var recArr = newASnap.val().contactArray;
                            recArr.push(recA);
                            firebase.database().ref("Accounts/" + recToken).update({ contactArray: recArr });
                            var chatObj = {
                                creationTime: encrypt(GetFormattedDate(), newChatID),
                                creator: encrypt(username, newChatID),
                                messages: [[encrypt((username + " created this chat. It is end-to-end encrypted."), newChatID), encrypt(("admin"), newChatID), encrypt((GetFormattedDate().toString()), newChatID), encrypt("0", newChatID)]],
                            };
                            firebase.database().ref("Chats/" + newChatID).set(chatObj);
                            firebase.database().ref("/").once("value", (globalSnapshot) => {
                                var ruToken = globalSnapshot.val()["Tokens"][reqUser].token;
                                var encrPfp = globalSnapshot.val()["Accounts"][ruToken].pfpUrl;
                                var pfpUrl = decrypt(encrPfp, ruToken);
                                var recStat = globalSnapshot.val()["Accounts"][ruToken].status;

                                res.json({ status: "chat-created", chatID: newChatID, pfpUrl: pfpUrl, stat: recStat });
                                return;

                            });

                        });
                    });


                });
            });
        });
    });

});//clear
app.post("/loadContactsStream", (req, res) => {
    var userToken = req.body.reqUsername;
    var contactID = req.body.contactID;

    if (contactID == "all-contacts") {
        firebase.database().ref("Tokens/").once("value", (snapshot) => {
            var tsa = snapshot.val();
            var username = getUsername(tsa, userToken);
            firebase.database().ref("Accounts/" + userToken).once("value", (aSnapshot) => {
                var contactsArr = aSnapshot.val().contactArray;

                //console.log(contactsArr[0][0]);
                for (var i = 0; i < contactsArr.length; i++) {
                    contactsArr[i][0] = decrypt(contactsArr[i][0], contactsArr[i][1]);
                }
                contactsArr.shift();

                firebase.database().ref("Accounts/").once("value", (globalSnapshot) => {
                    var glA = globalSnapshot.val();
                    var tA = Object.keys(glA);

                    for (var i = 0; i < contactsArr.length; i++) {
                        var semiArr = contactsArr[i];
                        var currentUser = semiArr[0];


                        var currentToken = tsa[currentUser].token;


                        var recStat = glA[currentToken].status;

                        var currentPFP = decrypt(glA[currentToken].pfpUrl, currentToken);

                        semiArr.push(currentPFP);
                        semiArr.push(recStat);
                        contactsArr[i] = semiArr;
                    }

                    res.json({ status: "obtained-contacts", contacts: contactsArr });
                    return;
                });

            });
        });
    }
});//clear
app.post("/loadChatStream", (req, res) => {
    var userToken = req.body.loggedUser;
    var userRec = req.body.userRec;
    var chatID = req.body.chatID;
    firebase.database().ref("Tokens/").once("value", (snapshot) => {
        var username = getUsername(snapshot.val(), userToken);
        firebase.database().ref("Chats/" + chatID).once("value", (snapshot) => {

            var messageArray = snapshot.val().messages;
            for (var i = 0; i < messageArray.length; i++) {
                messageArray[i] = [
                    decrypt(messageArray[i][0], chatID),
                    decrypt(messageArray[i][1], chatID),
                    decrypt(messageArray[i][2], chatID),
                    decrypt(messageArray[i][3], chatID)
                ];
            }

            res.json({ status: "messages-obtained", messageArr: messageArray });

            return;
        });
    });

});//clear
app.post("/sendMessageStream", (req, res) => {
    var userToken = req.body.username;
    var message = req.body.message;
    var time = req.body.time;
    var messageID = req.body.id;
    var chatID = req.body.chatID;

    firebase.database().ref("Tokens/").once("value", (snapshot) => {
        var username = getUsername(snapshot.val(), userToken);
        var additionArr = [encrypt(message, chatID), encrypt(username, chatID), encrypt(time, chatID), encrypt(messageID, chatID)];

        firebase.database().ref("Chats/" + chatID).once("value", (snapshot) => {
            var messageArr = snapshot.val().messages;
            messageArr.push(additionArr);
            firebase.database().ref("Chats/" + chatID).update({ messages: messageArr });
            res.json({ status: "message-sent" });
            return;
        });
    });

});
app.post("/statusStream", (req, res) => {
    var username = req.body.userToExit;
    var userToken = req.body.userToken;
    setOffline(userToken);
    res.json({ status: "passed" });
    return;
});
app.post("/messageCheckStream", (req, res) => {

    var chatID = req.body.chatID;
    var currentMessages = req.body.currentMessages;

    firebase.database().ref("Chats/" + chatID).once("value", (snapshot) => {
        var allMessageArr = snapshot.val().messages;
        if (currentMessages.length < allMessageArr.length) {

            //there are new messages
            var allIDs = [];
            for (var i = 0; i < allMessageArr.length; i++) {
                allIDs.push(decrypt(allMessageArr[i][3], chatID));
            }

            var newIDs = arr_diff(currentMessages, allIDs);
            var newMessages = [];
            for (var i = 0; i < newIDs.length; i++) {
                var iSeq = allMessageArr[parseInt(newIDs[i])];
                if (iSeq !== undefined) {
                    newMessages.push([
                        decrypt(iSeq[0], chatID),
                        decrypt(iSeq[1], chatID),
                        decrypt(iSeq[2], chatID),
                        decrypt(iSeq[3], chatID)
                    ]);
                }


            }
            res.json({ status: "messages-found", newMessages: newMessages });

        } else {

            res.json({ status: "no-new-messages" });
        }
        return;
    });

});
app.post("/statusCheckStream", (req, res) => {
    var userToken = req.body.loggedUser;
    firebase.database().ref("/").once("value", (globalSnapshot) => {
        var gSnap = globalSnapshot.val();
        var contactArr = gSnap["Accounts"][userToken].contactArray;
        contactArr.shift();
        var statArr = [];
        for (var i = 0; i < contactArr.length; i++) {
            var currentRec = decrypt(contactArr[i][0], contactArr[i][1]);
            var recToken = gSnap["Tokens"][currentRec].token;
            statArr.push(gSnap["Accounts"][recToken].status);
        }


        res.json({ statusS: "end", statArr: statArr });
    });
});

/*
app.get("/profile/:id", (req, res) => {
    var idReq = req.params.id;
    res.send("You requested to see a profile with the id of " + idReq);
});
*/

const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log("Server started on port " + PORT.toString()));