var express = require('express');
var util = require("util");
var welcomePage = require('./welcomePage.js');

var http = require('http');
var config = require('../config');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var app = express();
var device = [];
var tokenList;
var token_fresh;
var uid;
var devicesList = []; //devices' id
var nicknameList = []; //devices' dev_alias
var deviceHost = []; //devices' host name

var grpName =[];
var grpId = [];
                  
var grpDevicesId = [];
var grpDevices = [];
for(var a= 0; a<30;a++){ //define a 2 dimensional array 
    grpDevicesId[a] = [];
    grpDevices[a] = [];
}
var devicesInGrp = [];
var devicesIDInGrp = [];
const host = 'euapi.gizwits.com';
const gizwitsAppId = config.heatzy_Id;
var data1 = welcomePage.data1;
app.use(express.static("public"));
router.get('/', function (req, res) { //render the data to begin the picture
    var remarkArray = [];
    tokenList = req.query.token;
    token_fresh = tokenList;
    uid =  req.query.uid;
    console.log(req.query);
    grpDevicesId = [];
    grpDevices = [];
    grpId = [];
    grpName = [];
    devicesList = [];
    nicknameList = [];
    deviceHost = [];
    for(var a= 0; a<30;a++){ //define a 2 dimensional array 
        grpDevicesId[a] = [];
        grpDevices[a] = [];
    }
    getDevicesList(tokenList).then((deviceSelect) => {
        responseDevice = deviceSelect;
        if(responseDevice==undefined){
         res.render('deviceControl', {
             title: 'Heatzy',
             nicknameList: [],
             devicesList: [],
             tokenPost: [],
             deviceHost: [],
             uid:uid,
             devicesInGrp:[],
             devicesIDInGrp:[],
             err:undefined
         });
         
     }    
        console.log(responseDevice); //differ into groupes,m2m[did],sandbox[did],transfer them to json and then subscribe
        for (var d in responseDevice) {
                 var remark = responseDevice[d].remark;
                 deviceHost.push(responseDevice[d].host);
                 var kv = new Map();
                 remark = remark.split('|');
                 //console.log(remark);
                 for(var i = 0;i<remark.length;i++){
                  //console.log(remark[i]);
                  var temp = remark[i].split('=');
                  var key = temp[0];
                  var value = temp[1];
                  //console.log(key,value);
                  kv.set(key,value);
                 }
                 
                 remarkArray.push(kv);
                 //console.log(d);
                 if(remarkArray[d].get('gid') == 0){
                    //console.log("no group"+remarkArray);
                    /* grpDevicesId = [];
                    grpDevices = [];
                    grpId = [];
                    grpName = []; 
                    for(var a= 0; a<20;a++){ //define a 2 dimensional array 
                        grpDevicesId[a] = [];
                        grpDevices[a] = [];
                    }*/
                    /*  device = []; //导致只显示最后一个，而且grpdevicesId没空
                     devicesList = [];
                     nicknameList = []; */ //initialize the array, if not, it can't receive the group info correctly
                         device.push(responseDevice[d]);
                         devicesList.push(responseDevice[d].did);
                         
                         if (!responseDevice[d].dev_alias) {
                             nicknameList.push(responseDevice[d].mac);
                             // console.log(nicknameList[d]);
                         } else {
                             nicknameList.push(responseDevice[d].dev_alias);
                             // nicknameList[d] = response.devices[d].dev_alias;
                         }
                      }else{
                          grpId[remarkArray[d].get('gid')] = remarkArray[d].get('gid');
                          grpName[remarkArray[d].get('gid')] = remarkArray[d].get('groupname');
                          grpDevicesId[remarkArray[d].get('gid')].push(responseDevice[d].did);
                          if (!responseDevice[d].dev_alias) {
                            grpDevices[remarkArray[d].get('gid')].push(responseDevice[d].mac);
                            // console.log(nicknameList[d]);
                        } else {
                            grpDevices[remarkArray[d].get('gid')].push(responseDevice[d].dev_alias);
                            // nicknameList[d] = response.devices[d].dev_alias;
                        }
                          grpDevices[remarkArray[d].get('gid')] = rep(grpDevices[remarkArray[d].get('gid')]);
                          grpDevicesId[remarkArray[d].get('gid')] = rep(grpDevicesId[remarkArray[d].get('gid')]);
                         
                          /*  console.log(grpDevices,grpDevicesId);
                          if(grpId.length == 0){
                                  grpId.push(remarkArray[d].get('gid'));
                                  grpName.push(remarkArray[d].get('groupname'));
                                  console.log("grpname"+grpName);
                                  grpDevices[d].push(responseDevice.devices[d]Id.did);
                                  console.log(grpDeviceIds[d]);
                          }else{
                              for(var j=0; j<grpId.length;j++){
                                  console.log("j"+grpId[j]);
                                  if(grpId[j] !== remarkArray[d].get('gid')){ //if the grpid is new, i put it into the grpid array
                                      grpId.push(remarkArray[d].get('gid'));
                                      grpName.push(remarkArray[d].get('groupname'));
                                      console.log("grpname"+grpName);
                                      var num = grpId.length - 1;
                                      grpDevices[num].push(responseDevice.devices[d]Id.did);
                                      console.log(grpDeviceIds[d]);
                                  }else{
                                      grpDevices[j].push(responseDevice.devices[d]Id.did);
                                      console.log(grpDevIdices);
                                  }
                              }
                             
                          } */
                          
                          //console.log(grpName);
                      }
     
                    
                      nicknameList = rep(nicknameList);
                      devicesList = rep(devicesList);
                     // tokenList = rep(tokenList);
                      deviceHost = rep(deviceHost);
                      grpDevices = rep(grpDevices);
                     // grpDevicesId = rep(grpDevicesId);
                      ///grpId = rep(grpId);
                     // grpName = rep(grpName);
                     // rep();
                     // console.log(grpDevicesId);
                    //  console.log(tokenList);
                     // console.log(grpDevices,grpDevicesId,grpName,grpId);
                    //  console.log(deviceHost);
                    /* 
                      app.locals["nicknameList"]=nicknameList;
                      app.locals["devicesList"]=devicesList;
                      app.locals["deviceHost"]=deviceHost;
                      app.locals["uid"] = uid;
                      app.locals["tokenPost"] = token_fresh;
                      app.locals["data"] = data1; */
                 }
                /*  getGroup(token_fresh).then(function (bodyGetGrp) {   In fact,this is important for creating a group an controling by group,but app group developped the app using remark
                  var groupObj = JSON.parse(bodyGetGrp);
                  //console.log(groupObj);
                  for(var d=0;d<groupObj.length;d++){
                     (function(d){
                      grpsName.push(groupObj[d].group_name);
                      grpsId.push(groupObj[d].id);
                      grpsName = rep(grpsName);
                      grpsId = rep(grpsId); getGrpDevicesList(token_fresh,groupObj[d].id).then((bodyGetGrpDevicesLiIdst)=>{
                          var groupObjDevicesList = JSON.parse(bodyGetGrpDevicesIdList);
                          
                         for(var h=0;h< groupObjDevicesList.length;h++){
                             (function(h){
                              groupDevicesID.push(groupObjDevicesList[h].did);
                              groupDevices.push(groupObjDevicesList[h].dev_alias);
                              groupDevicesID = rep(groupDevicesID);
                              groupDevices = rep(groupDevices);
                              groupDevicesIDS = groupDevicesID.join("-"); //transfer array to string with -,and then make an array for list
                              groupDevicesS = groupDevices.join("-");
                             })(h);
                         }
                           groupDevicesIDList.push(groupDevicesIDS );
                          groupDevicesList.push(groupDevicesS);
                          groupDevicesIDList = rep(groupDevicesIDList);
                          groupDevicesList = rep(groupDevicesList); 
                          console.log(groupDevicesList);
                          console.log(groupDevicesIDList);
                          for(var i=0;i<groupDevicesIDList.length;i++){
                              var reg = new RegExp("\-");
                              console.log(groupDevicesList[i]);    
                              if(reg.test(groupDevicesList[i])){
                                 groupDevicesListArray[i] = groupDevicesList[i].split('-');
                                 groupDevicesIDListArray[i] = groupDevicesIDList[i].split('-');
                                          
                              }
                              else{
                                  groupDevicesListArray[i] = '';
                                  groupDevicesIDListArray[i] = groupDevicesIDList[i];
                              } 
                         }  
                         console.log("zhu"+groupDevicesListArray,groupDevicesIDListArray);  
                 
                      })
                  })(d);
                  }
                  console.log(grpsId,grpsName);
                 }); */
                 //groupDevicesList = stringToArray(groupDevicesList);
                // res.redirect("/deviceControl" + "?token=" + token_fresh); //render to the page devicecontrol using the token
               
                  res.render('deviceControl', {
                      title: 'Heatzy',
                      nicknameList: nicknameList,
                      devicesList: devicesList,
                      tokenPost: token_fresh,
                      deviceHost: deviceHost,
                      uid:uid,
                      grpName:grpName,
                      grpId:grpId,
                      grpDevices:grpDevices,
                      grpDevicesId:grpDevicesId,
                      err:undefined
                  });
         }).catch(function (err) {
             console.log(err);
         });
     })
router.post('/', urlencodedParser, function (req, res) {
    //var deviceControl = req.body.
    //var text = JSON.stringify(req);
    var nameSchedule = ""
    var token = req.query.token;
    var uid = req.query.uid;
    console.log("req.body =:" + util.inspect(req.query, {
        depth: null
    }))
    /* var modeOrigin = req.body.mode;
    if (modeOrigin !== undefined) {
        console.log("mode: " + modeOrigin);
        var did = modeOrigin.split("|")[0];
        var mode = modeOrigin.split("|")[1];
    }
    var tokenList = token_fresh;
    controlDevice(did, mode, tokenList);
    console.log("tokenList is :" + tokenList);
    console.log("req is :" + util.inspect(req.body, {
        depth: null
    }));  */
    var infoSchedule = req.body.schedule;
    if (infoSchedule !== undefined) {
        var didSchedule = infoSchedule.split("|")[0];
        nameSchedule = infoSchedule.split("|")[1];
        tokenList = infoSchedule.split("|")[2];
        uid = infoSchedule.split("|")[3];
        res.redirect('/deviceSchedule_origin' + '?token=' + tokenList + "&name=" + nameSchedule + "&did=" + didSchedule + "&mode=0"+"&uid="+uid)
    
        console.log("schedule: " + infoSchedule);
    }else {
        var token = req.query.token;
        var uid = req.query.uid;
        var zoneName;
        if(req.body.nomZone == ''){
            zoneName = "Zone";
        }else{
             zoneName = req.body.nomZone;
        }
       
        var zoneDevicesPost = req.body.produitList;
        zoneDevices = zoneDevicesPost;
        console.log("zoneDevicesPost1"+uid);
        
        console.log(req.body);
        if(zoneDevicesPost !== undefined){
            //var uid = zoneDevicesPost[0].split('|')[2];
            modifyRemark(token,zoneDevicesPost,zoneName).then((bodyGetRemark)=>{
                console.log(bodyGetRemark);
                res.redirect("/deviceControl?token="+token+"&uid="+uid);
        })
        }
            
       
       
       /* createGroup(token,zoneName).then((body)=>{
        var bodyObj = JSON.parse(body);
        if(bodyObj.error_message=="group name already used!"){
            console.log(bodyObj.error_message);
            getGroup(token).then((bodyGetGrp)=>{
                console.log("bodyGetGrp"+bodyGetGrp);//have to render the page
                if(body.group_name==zoneName){
                var groupAncientId = body.id;
                addDevices(token,groupAncientId,zoneDevices); 
                }
            });
            
            res.render('deviceControl', {
                title: 'Heatzy',
                nicknameList: nicknameList,
                devicesList: devicesList,
                tokenPost: token_fresh,
                deviceHost: deviceHost,
                uid:uid,
                err:bodyObj.error_message
            }); 
        }
        else{
            groupId = JSON.parse(body).id;
            console.log(groupId);
            addDevices(token,groupId,zoneDevices);
        }
    
       }); */
    }
    //formmethod="post" type="submit" formaction="deviceSchedule?token=" +<%=tokenSchedule%>
})
function rep(arr) { //delete double datas
    var ret = [];
     for (var i = 0; i < arr.length; i++) {
         if (arr.indexOf(arr[i]) == i) {
             ret.push(arr[i]);
        }
   }
     return ret;
 }
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
            
            var responseDevice = [];
            let deviceSelect = [];
            res.setEncoding('utf-8');
            res.on('data', (d) => {
                //console.log(d);
                body += d;
               //console.log("data"+body);
            }); // store each response chunk
            res.on('end', () => {
                var device = JSON.parse(body);
                for (var d in device.devices) {
                    responseDevice.push(device.devices[d]);
                }
                for (var a=0;a<responseDevice.length; a++) {
                    if (responseDevice[a].product_key == ("4fc968a21e7243b390e9ede6f1c6465d")|responseDevice[a].product_key == ("51d16c22a5f74280bc3cfe9ebcdc6402")){
                        //console.log(responseDevice[a]);
                        deviceSelect.push(responseDevice[a]);
                    }
                    if(a==(responseDevice.length-1)){
                        //console.log(deviceSelect);
                        resolve(deviceSelect);
                    } 
                }
                
                
            });
            res.on('error', (error) => {
                reject(error);
            });

        });
    });
}
function createGroup(token,grpName){
    var path_group = '/app/group';
    return new Promise(function (resolve, reject) {
             var body = {
                 "group_name": grpName,
                 "lang": 'en'
             };
             var bodyString = JSON.stringify(body);
             // console.log(bodyString);
             var options = {
                 hostname: host,
                 path: path_group,
                 method: 'POST',
                 headers: {
                     'X-Gizwits-User-token' : token,
                     'X-Gizwits-Application-Id': gizwitsAppId
                 }
             };
             //console.log(options);
             var req = http.request(options, (res) => {
                let body = ''; // var to store the response chunks
                 console.log(`STATUS: ${res.statusCode}`);
                 console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                 res.setEncoding('utf8');
 
                 res.on('data', (d) => {
                    console.log(d);
                    body += d;
                }); // store each response chunk
                res.on('end', () => {
                    console.log(body);
                   
                        resolve(body);
                });
             });
             req.on('error', (e) => {
                 reject(e);
                 console.log(`problem with request: ${e.message}`);
                
             });
 
             // write data to request body
             req.write(bodyString);
             req.end();
         });
 }
 function modifyRemark(token,didArray,zoneName){
   
    console.log("didArray.length"+typeof didArray);
    return new Promise(function (resolve, reject) {
        if((typeof didArray) == "string"){    //for one product
 //console.log(didArray[a])
 var devicesOrigin = didArray.split('|');
 var did = devicesOrigin[0];
 var gid =parseInt(devicesOrigin[1])+1;
 var body = {
     "remark": 'range=25|isdelete=1|gid='+gid+'|groupname='+zoneName+'|grouprange=1'
 };
 var path_group = '/app/bindings/'+did;

 var bodyString = JSON.stringify(body);
      var options = {
          hostname: host,
          path: path_group,
          method: 'PUT',
          headers: {
              'X-Gizwits-User-token' : token,
              'X-Gizwits-Application-Id': gizwitsAppId
          }
      };
      //console.log(options);
      var req = http.request(options, (res) => {
         let bodyGetRemark = ''; // var to store the response chunks
          console.log(`STATUS: ${res.statusCode}`);
          console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
          res.setEncoding('utf8');

          res.on('data', (d) => {
             console.log(d);
             bodyGetRemark += d;
         }); // store each response chunk
         res.on('end', () => {
             console.log(bodyGetRemark);
             resolve(bodyGetRemark);
         });
      });
      req.on('error', (e) => {
          reject(e);
          console.log(`problem with request: ${e.message}`);
          
      });

      req.write(bodyString);// write data to request body
      req.end();
        }else{
            for(var a in didArray){
                //console.log(didArray[a])
                var devicesOrigin = didArray[a].split('|');
                var did = devicesOrigin[0];
                var gid =parseInt(devicesOrigin[1])+1;
                var body = {
                    "remark": 'range=25|isdelete=1|gid='+gid+'|groupname='+zoneName+'|grouprange=1'
                };
                var path_group = '/app/bindings/'+did;
    
                var bodyString = JSON.stringify(body);
                     var options = {
                         hostname: host,
                         path: path_group,
                         method: 'PUT',
                         headers: {
                             'X-Gizwits-User-token' : token,
                             'X-Gizwits-Application-Id': gizwitsAppId
                         }
                     };
                     //console.log(options);
                     var req = http.request(options, (res) => {
                        let bodyGetRemark = ''; // var to store the response chunks
                         console.log(`STATUS: ${res.statusCode}`);
                         console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                         res.setEncoding('utf8');
         
                         res.on('data', (d) => {
                            console.log(d);
                            bodyGetRemark += d;
                        }); // store each response chunk
                        res.on('end', () => {
                            console.log(bodyGetRemark);
                            if(a == (didArray.length-1)){ //to determine if all of the element in array has been transfered
                                resolve(bodyGetRemark);
                            }
                        });
                     });
                     req.on('error', (e) => {
                         reject(e);
                         console.log(`problem with request: ${e.message}`);
                         
                     });
         
                     req.write(bodyString);// write data to request body
                     req.end();
            }
            for(var a in didArray){
                //console.log(didArray[a])
                var devicesOrigin = didArray[a].split('|');
                var gid =parseInt(devicesOrigin[1])+1;
                var did = devicesOrigin[0];
                var body = {"attrs":{
                    "mode":"cft",
                    "timer_switch":0,
                    "lock_switch":0,
                    "derog_mode":0,
                    "derog_time":0
                }};
                var path_group = "/app/control/"+did;
    
                var bodyString = JSON.stringify(body);
                     var options = {
                         hostname: host,
                         path: path_group,
                         method: 'POST',
                         headers: { 
                             'Accept': 'application/json',
                             'Content-Type': 'application/json',
                             'X-Gizwits-User-token' : token,
                             'X-Gizwits-Application-Id': gizwitsAppId
                         }
                     };
                     //console.log(options);
                     var req = http.request(options, (res) => {
                        let bodyGetRemark = ''; // var to store the response chunks
                         console.log(`STATUS: ${res.statusCode}`);
                         console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                         res.setEncoding('utf8');
         
                         res.on('data', (d) => {
                            console.log(d);
                            bodyGetRemark += d;
                        }); // store each response chunk
                        res.on('end', () => {
                            console.log(bodyGetRemark);
                            if(a == (didArray.length-1)){ //to determine if all of the element in array has been transfered
                                resolve(bodyGetRemark);
                            }
                        });
                     });
                     req.on('error', (e) => {
                         reject(e);
                         console.log(`problem with request: ${e.message}`);
                         
                     });
         
                     req.write(bodyString);// write data to request body
                     req.end();
            }
        }
        
        
         });
 }
 function addDevices(token,groupId,dids){
    var path_group = '/app/group/'+groupId+'/devices?show_detail={show_detail}';
    return new Promise(function (resolve, reject) {
             var body =  dids;
             var bodyString = JSON.stringify(body);
             // console.log(bodyString);
             var options = {
                 hostname: host,
                 path: path_group,
                 method: 'POST',
                 headers: {
                     'X-Gizwits-User-token' : token,
                     'X-Gizwits-Application-Id': gizwitsAppId
                 }
             };
             //console.log(options);
             var req = http.request(options, (res) => {
                let body = ''; // var to store the response chunks
                 console.log(`STATUS: ${res.statusCode}`);
                 console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                 res.setEncoding('utf8');
 
                 res.on('data', (d) => {
                    console.log(d);
                    body += d;
                }); // store each response chunk
                res.on('end', () => {
                    console.log(body);
                   
                        resolve(body);
                });
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
 function getGrpDevicesList(){
    var path_group = '/app/group/'+grpId+'/devices';
    return new Promise(function (resolve, reject) {
            
             var options = {
                 hostname: host,
                 path: path_group,
                 method: 'DELETE',
                 headers: {
                     'X-Gizwits-User-token' : token,
                     'X-Gizwits-Application-Id': gizwitsAppId
                 }
             };
             //console.log(options);
             var req = http.request(options, (res) => {
                let bodyGetGrpDevicesList = ''; // var to store the response chunks
                 console.log(`STATUS: ${res.statusCode}`);
                 console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                 res.setEncoding('utf8');
 
                 res.on('data', (d) => {
                    console.log(d);
                    bodyGetGrpDevicesList += d;
                }); // store each response chunk
                res.on('end', () => {
                    console.log(bodyGetGrpDevicesList);
                    resolve(bodyGetGrpDevicesList);
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
 function deleteGroup(token,grpId){
    var path_group = '/app/group/'+grpId;
    return new Promise(function (resolve, reject) {
            
             var options = {
                 hostname: host,
                 path: path_group,
                 method: 'DELETE',
                 headers: {
                     'X-Gizwits-User-token' : token,
                     'X-Gizwits-Application-Id': gizwitsAppId
                 }
             };
             //console.log(options);
             var req = http.request(options, (res) => {
                let body = ''; // var to store the response chunks
                 console.log(`STATUS: ${res.statusCode}`);
                 console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                 res.setEncoding('utf8');
 
                 res.on('data', (d) => {
                    console.log(d);
                    body += d;
                }); // store each response chunk
                res.on('end', () => {
                    console.log(body);
                    resolve(body);
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
module.exports = router;
