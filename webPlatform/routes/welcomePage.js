var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static("public"));
var session = require('express-session');
var router = express.Router();
var morgan = require('morgan');
var config = require('../config');
//var wsM = require('wss');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
var http = require('http');
var exec = require('child_process').exec
var token_fresh = "f90c872fb56a4bf88ce706af539a264d";

var client_id;
var input_password;
var datalog;
var responseDevice = '';
var device = [];

var dataToken = ''; //token
var dataUid = ''; //uid
var uid;
var mode_now = [];
var mode_new = [];
var state_ifttt = "";
const host = 'euapi.gizwits.com';
const gizwitsAppId = config.heatzy_Id;
var ejs = require('ejs');
var crypto = require("crypto");
var os = require("os");
var util = require("util");
var fs = require('fs');
var path = require('path');
var wsConnection = require('../public/javascripts/websocket');
app.set('view engine', 'ejs');
//app.engine("html",require("ejs").__express);
//app.engine('html', ejs._express);
//app.set('view engine','html');
// configure app
app.use(morgan('dev')); // log requests to the console
app.use(express.static(__dirname + '/public'));
// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}))
var port = process.env.PORT ||8000; // set our port
router.get('/', function (req, res) {
    res.render('welcomePage', {
        title: 'welcomePage',
        err:undefined,
        errMot:undefined
    });

    // filereadImg('/image/HEATZY LOGO.png',res);
})

app.use('/static', express.static('public'));
router.post('/', urlencodedParser, function (req, res) { //connect to the server by using http api
    console.log(req.body);
            if ((req.body.username)&&(req.body.password)) {

                response = {
                    username: req.body.username,
                    password: req.body.password
                };
               // req.session.username = req.body.username;
                //req.session.password = req.body.password;
                console.log("pwd=" + req.body.password);
                client_id = response.username;
                input_password = response.password;
                var stdout_spl;
                var resultat;
                console.log(client_id + input_password);
                let path_loin = "/app/login";
        
                function sendReq() { //get token,uid
                    return new Promise(function (resolve, reject) {
                        var body = {
                            "username": client_id,
                            "password": input_password,
                            "lang": 'en'
                        };
                        var bodyString = JSON.stringify(body);
                        // console.log(bodyString);
                        var options = {
                            hostname: host,
                            path: path_loin,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Accept': 'application/json',
                                'X-Gizwits-Application-Id': gizwitsAppId
                            }
                        };
                        //console.log(options);
                        var req = http.request(options, (res) => {
                            console.log(`STATUS: ${res.statusCode}`);
                            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                            res.setEncoding('utf8');
        
                            res.on('data', (chunk) => {
                                console.log(`BODY: ${chunk}`);
                                stdout_spl = chunk.split(" ", 2)[1]; 
                                stdout_spl1 = chunk.split(" ", 4)[3]; //console.log(stdout_spl1);
                                resultat = stdout_spl.split("\"", 2)[1];
                                resultat1 = stdout_spl1.split("\"", 4)[1];
                                console.log("token : " + resultat);
                                console.log("uid : " + resultat1);
                                dataToken = resultat;
                                dataUid = resultat1;
                            });
                            res.on('end', () => {
                                console.log('No more data in response.');
                                resolve([dataToken,dataUid]); 
                            })
                        });
                        req.on('error', (e) => {
                            reject(e);
                            console.log(`problem with request: ${e.message}`);
                            res.render("welcomePage",{
                                err:e.message,
                                errMot:undefined
                            })
                        });
        
                        // write data to request body
                        req.write(bodyString);
                        req.end();
                    });
                }
        
                sendReq().then(function (data) {
                    var devicesList = [];
                    var nicknameList = [];
                    var deviceHost = [];
                    var remarkArray = [];
                    var grpName =[];
                    var grpId = [];
                    var grpDevicesId = [];
                    var grpDevices = [];
                    for(var a= 0; a<20;a++){ //define a 2 dimensional array 
                        grpDevicesId[a] = [];
                        grpDevices[a] = [];
                    }
                    /* var groupDevices = [];
                    var groupDevicesID = [];
                    var groupDevicesS = '';
                    var groupDevicesIDS = '';
                    var groupDevicesListArray = [];
                    var groupDevicesIDListArray = [];
                    var groupDevicesList = [];
                    var groupDevicesIDList = []; */
                    token_fresh = data[0];  //return token and uid to paremeter token_fresh,uid
                    uid = data[1];
                    console.log(uid+token_fresh);
                    if(token_fresh == undefined){
                        res.render("welcomePage",{
                            err:undefined,
                            errMot:"Erreur d'identification. Veuillez verifier des informations."
                        })
                    }else{
                        var tokenList = token_fresh;
                        getDevicesList(tokenList).then((body) => {
                   
                  responseDevice = JSON.parse(body);
                  console.log("body"+JSON.stringify(responseDevice.devices));
                  if(JSON.stringify(responseDevice.devices) =='[]'){
                   res.redirect("/deviceBinding");
               }else{ 
                res.redirect("/deviceControl" + "?token=" + token_fresh+"&uid="+uid);
                }
                   })
                    }
                    
                }).catch(function (err) {
                    console.log(err);
                });
            }
            //create account
            else if (req.body.username == '') {
                    res.render("welcomePage",{
                        err:undefined,
                        errMot:"Erreur d'identification. Veuillez verifier des informations."
                    })
                  }
            else if(req.body.password == ''){
                    res.render("welcomePage",{
                        err:undefined,
                        errMot:"Erreur d'identification. Veuillez verifier des informations."
                    })
                  }
        else{
            var username_new = req.body.usernameCreate;
          var password_new = req.body.passwordCreate;
          var password_repeate = req.body.repeatCreate;

      if (password_new !== password_repeate) {
		var errmessage = 'Mot de passe est différent!';
	    res.render("welcomePage",{
        err:errmessage,
        errMot:undefined
	})
      }else if(password_new == '' |username_new == '' |password_repeate == '') {
        var errmessage = "Erreur d'identification!";
	    res.render("welcomePage",{
        err:errmessage,
        errMot:undefined
        })
      }
      else {
          var strS='';
          var body = {
              "username": username_new,
              "password": password_new,
              "lang": "en",
          };
          var bodyString = JSON.stringify(body);
          var options = {
              hostname: host,
              path: '/app/users',
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'X-Gizwits-Application-Id':gizwitsAppId
                          }
          };
          //console.log(options);
          var req = http.request(options, (res) => {
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
              res.setEncoding('utf8');
      
              res.on('data', (chunk) => {
                  strS += chunk;
                 // console.log(`return BODY: ${chunk}`);
                  //var plan = JSON.parse(str);
              });
              // console.log(chunk);
              res.on('end', () => {
                  console.log('No more data in response.');
              })
              res.on('end', () => {
                  console.log("create user: " + strS);
              })
          });
          req.on('error', (e) => {
              console.log(`problem with request: ${e.message}`);
          });
          req.write(bodyString);
          req.end();
          res.render("welcomePage",{
              err:"Vous êtes déjà membre de la famille Heatzy! Essayez de vous connecter!",
              errMot:undefined
          });
          }
        }
})
function getDevicesList(token) {
    return new Promise((resolve, reject) => {
       
            let path = "/app/bindings";
        console.log('API Request: ' + host + path+token);

        let options = {
            hostname: host,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Gizwits-Application-Id': gizwitsAppId,
                'X-Gizwits-User-token': token
            }
        };
        http.get(options, (res) => {
            let body = ''; // var to store the response chunks
            res.setEncoding('utf-8');
            res.on('data', (d) => {
                console.log(d);
                body += d;
            }); // store each response chunk
            res.on('end', () => {
                resolve(body);
            });
            res.on('error', (error) => {
                reject(error);
            });

        });
        
    });
}
function getGroup(token){
    //delete the name of double group
   var path_group = '/app/group';
   return new Promise(function (resolve, reject) {
           
            var options = {
                hostname: host,
                path: path_group,
                method: 'GET',
                headers: {
                    'X-Gizwits-User-token' : token,
                    'X-Gizwits-Application-Id': gizwitsAppId
                }
            };
            //console.log(options);
            var req = http.request(options, (res) => {
               let bodyGetGrp = ''; // var to store the response chunks
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');

                res.on('data', (d) => {
                   console.log(d);
                   bodyGetGrp += d;
               }); // store each response chunk
               res.on('end', () => {
                   console.log(bodyGetGrp);
                   resolve(bodyGetGrp);
               });
            });
            req.on('error', (e) => {
                reject(e);
                console.log(`problem with request: ${e.message}`);
                
            });

            // write data to request body
            req.end();
        });
}
function getGrpDevicesList(token,gIdrpId){
    var path_group = '/app/group/'+grpId+'/devices';
    return new Promise(function (resolve, reject) {
            
             var options = {
                 hostname: host,
                 path: path_group,
                 method: 'GET',
                 headers: {
                     'X-Gizwits-User-token' : token,
                     'X-Gizwits-Application-Id': gizwitsAppId
                 }
             };
             //console.log(options);
             var req = http.request(options, (res) => {
                let bodyGetGrpDevicesList = ''; // var to store the response Idchunks
                 console.log(`STATUS: ${res.statusCode}`);
                 console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                 res.setEncoding('utf8');
 
                 res.on('data', (d) => {
                    //console.log(d);
                    bodyGetGrpDevicesListId += d;
                }); // store each response chunk
                res.on('end', () => {
                    //console.log(bodyGetGrpDevicesIdList);
                    resolve(bodyGetGrpDevicesIdList);
                });
             });
             req.on('error', (e) => {
                 reject(e);
                 console.log(`problem with request: ${e.message}`);
                 
             });
 
             // write data to request body
             req.end();
         });
 }
 function rep(arr) { //delete double datas
    var ret = [];
     for (var i = 0; i < arr.length; i++) {
         if (arr.indexOf(arr[i]) == i) {
             ret.push(arr[i]);
        }
   }
     return ret;
 }
 function stringToArray(stringChange){
                      var stringChangeN = 'b123bc456d'.replace(/\d/g,'Q');
                      console.log(stringChangeN);
                      return stringChangeN;
     }  
module.exports = router;