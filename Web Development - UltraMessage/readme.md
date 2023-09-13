# UltraMessage

UltraMessage is a web app designed for online messaging. Users can create and log into their accounts to use the service. Users can then connect with their friends or contacts (who must also have UltraMessage accounts) to chat.
Messages are sent in real time in a fully encrypted and secure format. Alongside, all data stored about user accounts are also encrypted, and passwords are hashed prior to database storage.

## Installation

Use the package manager [npm install](https://docs.npmjs.com/cli/v9/commands/npm-install) to install the following packages, required for the UltraMessage web server found in the root code folder named 'server.js'. 

```bash
npm install express #web server framework
npm install path #altering of file paths
npm install crypto #encryption and hashing
npm install nodemailer #sending verification email
npm install fs #accessing of native server files
npm install http #used for web requests
npm install nedb #temp file database system
npm install firebase #cloud database module
npm install nodemon #testing environment
```

## Usage

UltraMessage used to have an online link connected to a domain for usage and access to the program. Unfortunately, this has now expired and is unable to be used. 
As is used for testing purposes and for viewing, the server can run locally on the device using the following command:
```bash
npm run dev
```
This starts the server which can be accessed locally on the same device with [localhost](http://localhost/). The server must be running without halts or errors to ensure the start page loads.


## Folders
- The 'code' folder contains the source code for UltraMessage. The server is coded using Node.js and the 'public' directories contain the website code composed of HTML, CSS, and JavaScript.
- The 'media' folder contains images and a screen recording of the UltraMessage software in use. This was run on my device locally as described above. Due to server downtime, any accounts visible are not real users, and these accounts were generated purely for demonstration purposes.