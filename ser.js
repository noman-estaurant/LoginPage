#!/usr/bin/env node

const express = require("express")
const app = express()
const passport = require('passport'),
const auth = require('./auth'),
const cookieParser = require('cookie-parser'),
const cookieSession = require('cookie-session');

const fs = require('fs')
const config= require('./config')
const port = config.port

const bodyParser = require("body-parser")

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("886865227848-iei3i8t1n5arbur2khuvfdjr3jkd2985.apps.googleusercontent.com");

auth(passport);
app.use(passport.initialize());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/dist`))


const https = require('https')

const options = {
  ca : fs.readFileSync(config.ssl.ca),
  key: fs.readFileSync(config.ssl.key),
  cert:fs.readFileSync(config.ssl.cert)
}


https.createServer(options, app).listen(port,()=>{
    console.log(`listen on port:${port}`)
})

app.post("/login", function(req,res){
	console.log(req.body)
})

app.post('/google', async (req, res) => {
  const ticket = await client.verifyIdToken({
      idToken: req.body['token'],
      audience: "886865227848-iei3i8t1n5arbur2khuvfdjr3jkd2985.apps.googleusercontent.com",
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  console.log('User ID: '+userid);
})

