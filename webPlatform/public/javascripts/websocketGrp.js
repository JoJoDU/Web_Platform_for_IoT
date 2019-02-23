function DeviceGrp(uid,token){  //create an object to device
    this.onInit = undefined;
    this.onConnected = undefined;
    this.onOnlineStatusChanged = undefined;
    this.onReceivedAttrs = undefined;
    this.onError = undefined;

    
    this._appId = "c70a66ff039d41b4a220e198b0fcc8b3";
    
    
    this._apiHost = 'euapi.gizwits.com';
    this._connections = {};
    this._userId = uid;
    this._userToken = token;

    this._heartbeatInterval = 60;
    this._keepaliveTime = 180;
    this._autoSubscribe = false;
    }

function Connection(devicehost,callback){ //create an object to the websocket
     devicehost = devicehost.replace("\"","");
     devicehost = devicehost.replace("\"","");
     this._wsUrl = "wss://"+devicehost+":8880/ws/app/v1";
     this._websoket = undefined;
     this._callbackObj = callback;
   }

   DeviceGrp.prototype.connectG = function(deviceHost){
     var me = this;
     //console.log(deviceHost.length);
    // console.log(deviceHost.length());
     for(var b =0;b<deviceHost.length;b++){
        //console.log(deviceHost[b])
        var devicehostI = deviceHost[b].replace("\"","");
     var devicehostN = deviceHost[b].replace("\"","");
     var devicehost = devicehostN;
     //console.log(devicehost);
     var conn = me._connections[devicehost];
    // console.log(JSON.stringify(conn) );
     if(conn == undefined){
       conn = new Connection(devicehost,me);
       //console.log("connO"+JSON.stringify(conn));
     }
    // console.log("conn._websoket"+conn._websoket)
     if(conn._websoket == undefined || conn._websocket.readyState != conn._websocket.OPEN){
      me._connections[devicehost] = conn;
        conn._connectWS();
     }
     }
    
   }

   DeviceGrp.prototype.read = function(deviceHost){
        var me = this;
        //console.log("read?");
        var devicehostI = deviceHost.replace("\"","");
        var devicehostN = deviceHost.replace("\"","");
        var devicehost = devicehostN;
        var conn = me._connections[devicehost];
      if(conn == undefined){
        me._sendError("Websocket is not connected.");
          return;
      }
      //console.log("suc");
      conn._sendJson({
          cmd: "c2s_read",
          data: {
            did: deviceID,
            names:"mode"
          }
      });
   }

   DeviceGrp.prototype.write = function(deviceHost,name,did){
        var me = this;
       // console.log(name);
        var name = JSON.parse(name);
        console.log(name);
        //console.log(JSON.parse(name));
        console.log(did);
        //mode = JSON.stringify(mode);
        //var modeI = mode.replace(/\"/g, "");
        //console.log(JSON.stringify(modeI));
        for(var a= 0;a<deviceHost.length;a++){
            if(deviceID[a]=did){
                var devicehostI = deviceHost[a].replace("\"","");
                var devicehostN = deviceHost[a].replace("\"","");
                var devicehost = devicehostN;
                var conn = me._connections[devicehost];
            }
        }
        
     
      if(conn == undefined){
        me._sendError("Websocket is not connected.");
          return;
      }
      conn._sendJson({
        cmd: "c2s_write",
        data: {
          did: did,
          attrs:name
          }
      });
   }
    //=========================================================
    // websocket functions
    //=========================================================
    Connection.prototype._connectWS = function() {
    var conn = this;
   // console.log("conn._wsUrl"+conn._wsUrl);
    var websocket = new WebSocket(conn._wsUrl);
   // console.log("websocket"+JSON.stringify(websocket) );
    websocket.onopen = function(evt) { conn._onWSOpen(evt) };
    websocket.onclose = function(evt) { conn._onWSClose(evt) };
    websocket.onmessage = function(evt) { conn._onWSMessage(evt) };
    websocket.onerror = function(evt) { conn._onWSError(evt) };

    conn._websocket = websocket;
    };

    Connection.prototype._onWSOpen = function(evt) {
     //console.log("open?")
    var conn = this;
    conn._login();
    };

    Connection.prototype._onWSClose = function(evt) {
    var isOnline = false;
    var conn = this;
    conn._callbackObj._sendError("Websocket Connect failed, please try again after a moment.");
    };

    Connection.prototype._onWSMessage = function(evt) {
    var conn = this;
    var res = JSON.parse(evt.data);
    console.log(evt.data);
    switch (res.cmd) {
        case "pong":
        //console.log(res.cmd);
        break;
        case "login_res":
    if (res.data.success == true) {
    conn._startPing();
    }
    break;
    case "subscribe_res":
    break;
    case "s2c_online_status":
    isOnline = res.data.online;
    did = res.data.did;
    console.log(isOnline);
    if(isOnline=false){
        var picToChangeS = window.document.getElementById(did+"|schedule");
        picToChangeS.src = "/images/heatzy_gris.png";
        var picToChangec = window.document.getElementById(did+"|cft");
        picToChangec.src = "/images/confort_gri.png";
        var picToChange = window.document.getElementById(did+"|eco");
        picToChange.src = "/images/nuit_gri.png";
        var picToChangef = window.document.getElementById(did+"|fro");
        picToChangef.src = "/images/hg_gri.png";
        var picToChangeStop = window.document.getElementById(didR+"|stop");
        picToChangeStop.src = "/images/stop_gris.png"
    }
    else{
        var picToChangeS = window.document.getElementById(did+"|schedule");
        picToChangeS.src = "/images/heatzy_vert.png";
        var picToChangeStop = window.document.getElementById(didR+"|stop");
        picToChangeStop.src = "/images/stop_vert.png"
        conn._sendJson({
            cmd: "c2s_read",
            data:
            {
                "did": did,
                "names":"mode"
            }
        })
    }
    break;
    case "s2c_noti":  
    modeR = res.data.attrs.mode;
    programmation = res.data.attrs.timer_switch;
    vacances = res.data.attrs.derog_mode;
    lock = res.data.attrs.lock_switch;
    didR = res.data.did; //on/off change the color of on
    switch(programmation){
        case 0:
        var picToChange = window.document.getElementById(didR+"|schedule");
        picToChange.style.opacity = 0;
        break;
        case 1:
        var picToChange = window.document.getElementById(didR+"|schedule");
        
        picToChange.style.opacity = 1;
        break;
    }
    switch(lock){
        case 0:
        var picToChange = window.document.getElementById(didR+"|lock_switch");
        picToChange.src = "/images/lock_gris.png";
        break;
        case 1:
        var picToChange = window.document.getElementById(didR+"|lock_switch");
        picToChange.src = "/images/lock_vert.png";
        break;
    }
    switch(vacances){
        case 0:
        var picToChange = window.document.getElementById(didR+"|derog_mode");
        picToChange.src = "/images/vacances_gris.png";
        break;
        case 1:
        var picToChange = window.document.getElementById(didR+"|derog_mode");
        picToChange.src = "/images/vacances_vert.png";
        break;
    }
    switch(modeR){
    case "cft":
    //var deviceChangec = window.document.getElementById(didR+"|cft");
   // console.log(produitChangee.name);
    var picToChangec = window.document.getElementById(didR+"|cft");
   // console.log(picToChangec.name);
    picToChangec.src = "/images/confort_vert.png";
    var picToChangee = window.document.getElementById(didR+"|eco");
    picToChangee.src = "/images/nuit_gri.png";
    var picToChangef = window.document.getElementById(didR+"|fro");
    picToChangef.src = "/images/hg_gri.png";
    var picToChangeStop = window.document.getElementById(didR+"|stop");
    picToChangeStop.src = "/images/stop_vert.png"
    break;
    case "eco":
    var picToChangec = window.document.getElementById(didR+"|cft");
    picToChangec.src = "/images/confort_gri.png";
    var picToChange = window.document.getElementById(didR+"|eco");
    picToChange.src = "/images/nuit_vert.png";
    var picToChangef = window.document.getElementById(didR+"|fro");
    picToChangef.src = "/images/hg_gri.png";
    var picToChangeStop = window.document.getElementById(didR+"|stop");
    picToChangeStop.src = "/images/stop_vert.png"
    break;
    case "fro":
    var picToChangec = window.document.getElementById(didR+"|cft");
    picToChangec.src = "/images/confort_gri.png";
    var picToChange = window.document.getElementById(didR+"|eco");
    picToChange.src = "/images/nuit_gri.png";
    var picToChangef = window.document.getElementById(didR+"|fro");
    picToChangef.src = "/images/hg_vert.png"
    var picToChangeStop = window.document.getElementById(didR+"|stop");
    picToChangeStop.src = "/images/stop_vert.png"
    break;
    case "stop":
    var picToChangec = window.document.getElementById(didR+"|cft");
    picToChangec.src = "/images/confort_gri.png";
    var picToChange = window.document.getElementById(didR+"|eco");
    picToChange.src = "/images/nuit_gri.png";
    var picToChangef = window.document.getElementById(didR+"|fro");
    picToChangef.src = "/images/hg_gri.png"
    var picToChangeStop = window.document.getElementById(didR+"|stop");
    picToChangeStop.src = "/images/stop_gris.png"
}
break;
}
}
Connection.prototype._onWSError = function(evt) {
var conn = this;
conn._callbackObj._sendError("Websocket on error");
};
Connection.prototype._startPing = function() {
var conn = this;
var heartbeatInterval = conn._callbackObj._heartbeatInterval * 1000;
conn._heartbeatTimerId = window.setInterval(function() { conn._sendJson({ cmd: "ping" }) }, heartbeatInterval);

var reqDataGroup = [];

for (var i = 0; i < grpDevicesId.length; i++) { //differ group did
    if(grpDevicesId[i] !== ''){ 
        reqDataGroup.push({ did: grpDevicesId[i]});
    console.log(JSON.stringify(reqDataGroup))
    }
}
conn._sendJson({
    cmd: "subscribe_req",
    data:reqDataGroup
})

for (var i = 0; i < grpDevicesId.length; i++) {
    if(grpDevicesId[i]!==''){
        conn._sendJson({
            cmd: "c2s_read",
            data:
            {
                "did": grpDevicesId[i],
                "names":["mode","timer_switch"]
            }
        })
    }
   
}
};
Connection.prototype._sendJson = function(json) {
var conn = this;
var data = JSON.stringify(json);
console.log("data"+data);
var websocket = conn._websocket;
if (websocket.readyState == websocket.OPEN) {
    websocket.send(data);
// console.log("send?")
    return true;
} else {
    console.log("Send data error, websocket is not connected.");
    return false;
}
};
//=========================================================
// helper functions
//=========================================================
Connection.prototype._login = function() {
var conn = this;
//console.log("conn"+conn)
var keepalive = conn._callbackObj._keepaliveTime;
var autoSub = conn._callbackObj._autoSubscribe;
var json = {
    cmd: "login_req",
    data: {
    appid: conn._callbackObj._appId,
    uid: conn._callbackObj._userId,
    token: conn._callbackObj._userToken,
    p0_type: "attrs_v4",
    heartbeat_interval: keepalive, // default 180s
    auto_subscribe: autoSub
    }
};
conn._sendJson(json);
};
DeviceGrp.prototype._sendError = function(msg) {
if (this.onError) {
    this.onError(msg);
}
};

function newObj(){
deviceGrp = new DeviceGrp();
// console.log(JSON.stringify(device));
/* device.onInit = onInit;
device.onConnected = onConnected;
device.onOnlineStatusChanged = onOnlineStatusChanged;
device.onReceivedAttrs = onReceivedAttrs;
device.onError = onError;  */
}