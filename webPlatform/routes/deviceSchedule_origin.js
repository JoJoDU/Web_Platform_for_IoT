var express = require('express');
var router = express.Router();
var app = express();
var util = require("util");
var bodyParser = require('body-parser');
var ws = require('ws');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
app.use(express.static("public"));
const host = 'euapi.gizwits.com';
var config = require('../config');
const gizwitsAppId = config.heatzy_Id;
var http = require('http');
var uid;
router.get('/', function (req, res) {
    var token = req.query.token;
    var didR = req.query.did;
    var didArr = didR.split(',');
    var name = req.query.name;
    uid = req.query.uid;
    var modeDisplay;
    var mode;
    var strS='';
    var devicesList = [];
   
    var lundi = [];
    var mardi = [];
    var mercredi = [];
    var jeudi = [];
    var vendredi = [];
    var samedi = [];
    var dimanche = [];
    var schedule;
    function sendReq() { 
        return new Promise(function (resolve, reject) {
    var sock = new ws("wss://eusandbox.gizwits.com:8880/ws/app/v1");
    sock.on("open", function () {
        console.log("connect success !!!!");
        var jsonLog = {
            cmd: "login_req",
            data: {
            appid: "c70a66ff039d41b4a220e198b0fcc8**",
            uid: uid,
            token: token,
            p0_type: "attrs_v4",
            heartbeat_interval: 180*1000, // default 180s
            auto_subscribe: true
            }
        };
        sock.send(JSON.stringify(jsonLog));
    });
     
    sock.on("error", function(err) {
        console.log("error: ", err);
    });
     
    sock.on("close", function() {
        console.log("close");
    });
     
    sock.on("message", function(data) {
    var res = JSON.parse(data);
   // console.log(data);
    switch (res.cmd) {
        case "pong":
        //console.log(res.cmd);
        break;
        case "login_res":
    if (res.data.success == true) {
        var jsonRead = {
            cmd: "c2s_read",
            data: {
              did: didArr[0],
              names:"mode"
            }
        }
        sock.send(JSON.stringify(jsonRead));
        setInterval(()=>{
        sock.send(JSON.stringify({ cmd: "ping" }));
        },100*1000);
    }
    break;
    case "subscribe_res":
    break;
    case "s2c_noti":  
    var plan_p =[];
    modeDisplay = res.data.attrs.mode;
    schedule = res.data.attrs.timer_switch;
    var plan_unit =JSON.stringify(res.data.attrs).split("\,") ;
    console.log("lengtn"+plan_unit.length);
    for (i = 0; i < plan_unit.length; i++) {
       // console.log(plan_unit[i]);
        var reg = new RegExp("_data");
       // console.log(reg.exec(plan_unit[i]));
        if (reg.exec(plan_unit[i]) != null){
            plan_p.push(plan_unit[i].replace("}}",""));
        }
    //if(i == (plan_unit.length-1)){
       // console.log(plan_p)
    
    
    }
   // console.log(plan_p);
    var data = [modeDisplay,plan_p];
    resolve(data);
    break;
}
    });
}
        )};
   
    sendReq().then(function (data){
        switch(data[0]){ //data[0] is modeDisplay
            case "cft":
            mode = 0;
            break;
            case "eco":
            mode = 1;
            break;
            case "fro":
            mode = 2;
            break;
        }
        var plan_p = data[1];
        //console.log("plan: " + plan_p);
        var p1 = [];    //Monday
        var p2 = [];    //Tuseday
        var p3 = [];    //Wednesday
        var p4 = [];    //Thursday
        var p5 = [];    //Friday
        var p6 = [];    //Saturday
        var p7 = [];    //Sunday
        if(plan_p==null){
            setTimeout(() => {
                console.log("length: " + plan_p.length + plan_p[0] + plan_p[0].substr(2, 1));
            }, 1000);
        }
        //console.log("length: " + plan_p.length + plan_p[0] + plan_p[0].substr(2, 1));
        for (i = 0; i < plan_p.length; i++) {
            if (plan_p[i].substr(2, 1) == 1) {
                p1.push(plan_p[i])
            }
        }
        for (i = 0; i < plan_p.length; i++) {
            if (plan_p[i].substr(2, 1) == 2) {
                p2.push(plan_p[i])
            }
        }
        for (i = 0; i < plan_p.length; i++) {
            if (plan_p[i].substr(2, 1) == 3) {
                p3.push(plan_p[i])
            }
        }
        for (i = 0; i < plan_p.length; i++) {
            if (plan_p[i].substr(2, 1) == 4) {
                p4.push(plan_p[i])
            }
        }
        for (i = 0; i < plan_p.length; i++) {
            if (plan_p[i].substr(2, 1) == 5) {
                p5.push(plan_p[i])
            }
        }
        for (i = 0; i < plan_p.length; i++) {
            if (plan_p[i].substr(2, 1) == 6) {
                p6.push(plan_p[i])
            }
        }
        for (i = 0; i < plan_p.length; i++) {
            if (plan_p[i].substr(2, 1) == 7) {
                p7.push(plan_p[i])
            }
        }
       // console.log(p1 + p2 + p3 + p4 + p5 + p6 + p7);
        p1 = setOrder(p1);
        p2 = setOrder(p2);
        p3 = setOrder(p3);
        p4 = setOrder(p4);
        p5 = setOrder(p5);
        p6 = setOrder(p6);
        p7 = setOrder(p7);
        //console.log(p1);
        //console.log(p1[1]);
       // console.log(p1[1].split(":")[1])
        //var l= [];
        //for (j=0;j<12;j++){
        var lundi_1 = parseInt(p1[1].split(":")[1]).toString(2);
        //l[j]=parseInt(p1[j].split(":")[1]).toString(2) ;
        //console.log("l: "+l[j]);
        //console.log("push list: "+inverseNumber(l[j]));
        //  console.log("push list: "+(inverseNumber(parseInt(p1[1].split(":")[1]).toString(2))).substr(0,2) )
        //  console.log("push list: "+(inverseNumber((parseInt(p1[i].split(":")[1])).toString(2))).substr(0, 2));
        //}
       /*  console.log(lundi_1);
        console.log("lundi_1 inverse: " + inverseNumber(lundi_1));
        console.log(lundi_1.split(2))
        console.log("00:00: " + lundi_1.substr(0, 2));
        console.log("00:30: " + lundi_1.substr(2, 2));
        console.log("01:00: " + lundi_1.substr(4, 2));
        console.log("01:30: " + lundi_1.substr(6, 2)); */
        var lundi_2 = "10101";
       // console.log("01:30: " + lundi_2.substr(6, 2));
        //lundi
        for (i = 0; i < 12; i++) {
            lundi.push((inverseNumber(parseInt(p1[i].split(":")[1]).toString(2))).substr(0, 2));
            // console.log("lundi list inverse: "+(inverseNumber(parseInt(p1[i].split(":")[1]).toString(2))).substr(0, 2))
            lundi.push((inverseNumber(parseInt(p1[i].split(":")[1]).toString(2))).substr(2, 2));
            lundi.push((inverseNumber(parseInt(p1[i].split(":")[1]).toString(2))).substr(4, 2));
            lundi.push((inverseNumber(parseInt(p1[i].split(":")[1]).toString(2))).substr(6, 2));
            // lundi.push((parseInt(p1[i].split(":")[1]).toString(2)).substr(0, 2));
            // lundi.push((parseInt(p1[i].split(":")[1]).toString(2)).substr(2, 2));
            // lundi.push((parseInt(p1[i].split(":")[1]).toString(2)).substr(4, 2));
            // lundi.push((parseInt(p1[i].split(":")[1]).toString(2)).substr(6, 2));
            mardi.push((inverseNumber(parseInt(p2[i].split(":")[1]).toString(2))).substr(0, 2));
            mardi.push((inverseNumber(parseInt(p2[i].split(":")[1]).toString(2))).substr(2, 2));
            mardi.push((inverseNumber(parseInt(p2[i].split(":")[1]).toString(2))).substr(4, 2));
            mardi.push((inverseNumber(parseInt(p2[i].split(":")[1]).toString(2))).substr(6, 2));
            mercredi.push((inverseNumber(parseInt(p3[i].split(":")[1]).toString(2))).substr(0, 2));
            mercredi.push((inverseNumber(parseInt(p3[i].split(":")[1]).toString(2))).substr(2, 2));
            mercredi.push((inverseNumber(parseInt(p3[i].split(":")[1]).toString(2))).substr(4, 2));
            mercredi.push((inverseNumber(parseInt(p3[i].split(":")[1]).toString(2))).substr(6, 2));
            jeudi.push((inverseNumber(parseInt(p4[i].split(":")[1]).toString(2))).substr(0, 2));
            jeudi.push((inverseNumber(parseInt(p4[i].split(":")[1]).toString(2))).substr(2, 2));
            jeudi.push((inverseNumber(parseInt(p4[i].split(":")[1]).toString(2))).substr(4, 2));
            jeudi.push((inverseNumber(parseInt(p4[i].split(":")[1]).toString(2))).substr(6, 2));
            vendredi.push((inverseNumber(parseInt(p5[i].split(":")[1]).toString(2))).substr(0, 2));
            vendredi.push((inverseNumber(parseInt(p5[i].split(":")[1]).toString(2))).substr(2, 2));
            vendredi.push((inverseNumber(parseInt(p5[i].split(":")[1]).toString(2))).substr(4, 2));
            vendredi.push((inverseNumber(parseInt(p5[i].split(":")[1]).toString(2))).substr(6, 2));
            samedi.push((inverseNumber(parseInt(p6[i].split(":")[1]).toString(2))).substr(0, 2));
            samedi.push((inverseNumber(parseInt(p6[i].split(":")[1]).toString(2))).substr(2, 2));
            samedi.push((inverseNumber(parseInt(p6[i].split(":")[1]).toString(2))).substr(4, 2));
            samedi.push((inverseNumber(parseInt(p6[i].split(":")[1]).toString(2))).substr(6, 2));
            dimanche.push((inverseNumber(parseInt(p7[i].split(":")[1]).toString(2))).substr(0, 2));
            dimanche.push((inverseNumber(parseInt(p7[i].split(":")[1]).toString(2))).substr(2, 2));
            dimanche.push((inverseNumber(parseInt(p7[i].split(":")[1]).toString(2))).substr(4, 2));
            dimanche.push((inverseNumber(parseInt(p7[i].split(":")[1]).toString(2))).substr(6, 2));
        }
       /*  console.log("lundi: " + lundi);
        console.log("mardi: " + mardi); */
        lundi = addZero(lundi);
        mardi = addZero(mardi);
        mercredi = addZero(mercredi);
        jeudi = addZero(jeudi);
        vendredi = addZero(vendredi);
        samedi = addZero(samedi);
        dimanche = addZero(dimanche);
       /*  console.log("add l: " + lundi);
        console.log("add m: " + mardi);
        console.log("add m: " + mercredi);
        console.log("add j: " + jeudi);
        console.log("add v: " + vendredi);
        console.log("add s: " + samedi);
        console.log("add d: " + dimanche); */

        res.render('deviceSchedule_origin', {
            nickname: name,
            token: token,
            did: didR,
            schedule:schedule,
            mode: mode,
            lundi: lundi,
            mardi: mardi,
            mercredi: mercredi,
            jeudi: jeudi,
            vendredi: vendredi,
            samedi: samedi,
            dimanche: dimanche,
            error:undefined
        })
    });
        // res.render('deviceSchedule', { nickname: name },{ lundi: lundi}, {mardi: mardi}, {mercredi: mercredi}, {jeudi: jeudi}, {vendredi: vendredi}, {samedi: samedi}, {dimanche: dimanche});
       
  


    //  res.render('deviceSchedule', { nickname: name },{ lundi: lundi}, {mardi: mardi}, {mercredi: mercredi}, {jeudi: jeudi}, {vendredi: vendredi}, {samedi: samedi}, {dimanche: dimanche});


})
router.post('/', function (req, res) {
    console.log("finish later")
    console.log("req.body =:" + util.inspect(req.query, {
        depth: null
    }));
    console.log("modereq is :" + tokenList);
    //var tokenList = token_fresh;
    console.log("tokenList is :" + tokenList);
    console.log("req is :" + util.inspect(req.body, {
        depth: null
    }));
   /*  console.log("lundi: " + req.body.lundi);
    console.log("m: " + req.body.mardi);
    console.log("m: " + req.body.mercredi);
    console.log("j: " + req.body.jeudi);
    console.log("v: " + req.body.vendredi);
    console.log("s: " + req.body.samedi);
    console.log("d: " + req.body.dimanche); */

    //console.log("lundi array: "+req.body.lundi.split(",")str)
    //var hourControl = req.body.hour;
    // var minuteControl = req.body.minute;
    var mode_schedule = new Array();
    for (i = 0; i < 7; i++) {
        mode_schedule[i] = new Array();
        for (j = 0; j < 12; j++) {
            mode_schedule[i][j] = "";
        }
    }
    var lundi_old = req.body.lundi;
    var mardi_old = req.body.mardi;
    var mercedi_old = req.body.mercredi;
    var jeudi_old = req.body.jeudi;
    var vendredi_old = req.body.vendredi;
    var samedi_old = req.body.samedi;
    var dimanche_old = req.body.dimanche;
    var startControl = req.body.start;
    var endControl = req.body.end;
    var startControl2 = req.body.start2;
    var endControl2 = req.body.end2;
    var startControl3 = req.body.start3;
    var endControl3 = req.body.end3;
    var startControl4 = req.body.start4;
    var endControl4 = req.body.end4;
    var startControl5 = req.body.start5;
    var endControl5 = req.body.end5;
    var startControl6 = req.body.start6;
    var endControl6 = req.body.end6;
    var startControl7 = req.body.start7;
    var endControl7 = req.body.end7;

    //console.log("starcontrol: " + startControl);
    
    var myDate = new Date();
    var date = myDate.getDay();
    var hour = myDate.getHours();
    var min = myDate.getMinutes();
    console.log( "         Day:", date);
    
    console.log( "        Hour:", hour);

console.log( "        Hour:", min);
    var dataExtra = {};
    dataExtra["time_week"]=date;
    dataExtra["time_hour"]=hour;
    dataExtra["time_min"]=min;
    var value;
    var bodyP =(req.body);
    for(var i in bodyP){
        if(bodyP['confirm.x']){
            value = bodyP[i];
        }
    }
    console.log("what"+value);
    if (value == undefined) {
        value = req.body.annuler;
        var tokenList = value.split("|")[0];
        var nameSchedule = value.split("|")[1];
        var didSchedule = value.split("|")[2];
        var mode = value.split("|")[3];
        //dataExtra["timer_switch"] = 0;
        controlDeviceLundiByScheduler(didSchedule, dataExtra, tokenList).then((strs)=>{
            res.redirect('/deviceControl' + '?token=' + tokenList+"&uid="+uid);
        });
    }
    else{
var tokenList = value.split("|")[0];
    var nameSchedule = value.split("|")[1];
    var didSchedule = value.split("|")[2];
    /*
    if (didSchedule=="return"){
        res.redirect('/deviceControl' + '?token=' + tokenList);
    }
    */
    var mode = value.split("|")[3];
    var deviceControl = didSchedule;
   // dataExtra["timer_switch"]=1;
    var modeControl = "0";
    var modeReal;
    //var lundi_new = lundi_old;
    var lundi_new = [];
    var mardi_new = [];
    var mercedi_new = [];
    var jeudi_new = [];
    var vendredi_new = [];
    var samedi_new = [];
    var dimanche_new = [];
    if (mode == "0") {
        modeReal = "00"; //parseInt(00000000,2);
    }
    if (mode == "1") {
        modeReal = "10"; //parseInt(01010101,2);
    }
    if (mode == "2") {
        modeReal = "01" //parseInt(10101010,2);
    }
    //for (i=startControl;i<endControl;i++){
    //    lundi_new[i]="00";
    //}
     for (i = 0; i < 48; i++) {
        lundi_new[i] = lundi_old.split(",")[i];
        mardi_new[i] = mardi_old.split(",")[i];
        mercedi_new[i] = mercedi_old.split(",")[i];
        jeudi_new[i] = jeudi_old.split(",")[i];
        vendredi_new[i] = vendredi_old.split(",")[i];
        samedi_new[i] = samedi_old.split(",")[i];
        dimanche_new[i] = dimanche_old.split(",")[i];
       /* if (i < startControl) {
            lundi_new[i] = lundi_old.split(",")[i];
        } else if (i >= startControl && i < endControl) {
            lundi_new[i] = modeReal;
        } else if (i >= endControl) {
            lundi_new[i] = lundi_old.split(",")[i];
        }
        if (i < startControl2) {
            mardi_new[i] = mardi_old.split(",")[i];
        } else if (i >= startControl2 && i < endControl2) {
            mardi_new[i] = modeReal;
        } else if (i >= endControl2) {
            mardi_new[i] = mardi_old.split(",")[i];
        }
        if (i < startControl3) {
            mercedi_new[i] = mercedi_old.split(",")[i];
        } else if (i >= startControl3 && i < endControl3) {
            mercedi_new[i] = modeReal;
        } else if (i >= endControl3) {
            mercedi_new[i] = mercedi_old.split(",")[i];
        }
        if (i < startControl4) {
            jeudi_new[i] = jeudi_old.split(",")[i];
        } else if (i >= startControl4 && i < endControl4) {
            jeudi_new[i] = modeReal;
        } else if (i >= endControl4) {
            jeudi_new[i] = jeudi_old.split(",")[i];
        }
        if (i < startControl5) {
            vendredi_new[i] = vendredi_old.split(",")[i];
        } else if (i >= startControl5 && i < endControl5) {
            vendredi_new[i] = modeReal;
        } else if (i >= endControl5) {
            vendredi_new[i] = vendredi_old.split(",")[i];
        }
        if (i < startControl6) {
            samedi_new[i] = samedi_old.split(",")[i];
        } else if (i >= startControl6 && i < endControl6) {
            samedi_new[i] = modeReal;
        } else if (i >= endControl6) {
            samedi_new[i] = samedi_old.split(",")[i];
        }
        if (i < startControl7) {
            dimanche_new[i] = dimanche_old.split(",")[i];
        } else if (i >= startControl7 && i < endControl7) {
            dimanche_new[i] = modeReal;
        } else if (i >= endControl7) {
            dimanche_new[i] = dimanche_old.split(",")[i];
        }*/
    } 
    console.log("new lundi array: " + lundi_new);
    console.log("new mardi_new array: " + mardi_new);
    console.log("new mercedi_new array: " + mercedi_new);
    console.log("new jeudi_new array: " + jeudi_new);
    console.log("new vendredi_new array: " + vendredi_new);
    console.log("new samedi_new array: " + samedi_new);
    console.log("new dimanche_new array: " + dimanche_new); 
    var int_start_mieux = parseInt(startControl / 4);
    var int_end_mieux = parseInt(endControl / 4);
    var int_start_mieux2 = parseInt(startControl2 / 4);
    var int_end_mieux2 = parseInt(endControl2 / 4);
    var int_start_mieux3 = parseInt(startControl3 / 4);
    var int_end_mieux3 = parseInt(endControl3 / 4);
    var int_start_mieux4 = parseInt(startControl4 / 4);
    var int_end_mieux4 = parseInt(endControl4 / 4);
    var int_start_mieux5 = parseInt(startControl5 / 4);
    var int_end_mieux5 = parseInt(endControl5 / 4);
    var int_start_mieux6 = parseInt(startControl6 / 4);
    var int_end_mieux6 = parseInt(endControl6 / 4);
    var int_start_mieux7 = parseInt(startControl7 / 4);
    var int_end_mieux7 = parseInt(endControl7 / 4);
    var lundi_origin = [];
    var mardi_origin = [];
    var mercedi_origin = [];
    var jeudi_origin = [];
    var vendredi_origin = [];
    var samedi_origin = [];
    var dimanche_origin = [];
    for (i = 0; i < 12; i++) {
        console.log(lundi_new.length);
        var transformer = [];
        transformer.push(lundi_new[4 * i]);
        transformer.push(lundi_new[4 * i + 1]);
        transformer.push(lundi_new[4 * i + 2]);
        transformer.push(lundi_new[4 * i + 3]);
        //transformer.push(lundi_new.split(",")[4*i+3]);
         console.log("transformer: " + transformer);

        console.log("split lundi: " + transformer.length); 
        lundi_origin[i] = transformer.join("");
        //console.log("array chaine: " + lundi_origin[i]);
        lundi_origin[i] = inverseNumber(lundi_origin[i]);
        console.log("inverseNumber: " + lundi_origin[i]);
        // console.log(lundi_origin[i].join(""));
        lundi_origin[i] = parseInt(lundi_origin[i], 2);
        //console.log("number in Dex: " + lundi_origin)
        transformer = [];
    }
    for (i = 0; i < 12; i++) {
        var transformer = [];
        transformer.push(mardi_new[4 * i]);
        transformer.push(mardi_new[4 * i + 1]);
        transformer.push(mardi_new[4 * i + 2]);
        transformer.push(mardi_new[4 * i + 3]);
        //transformer.push(lundi_new.split(",")[4*i+3]);
        mardi_origin[i] = transformer.join("");
        mardi_origin[i] = inverseNumber(mardi_origin[i]);
        console.log("inverseNumber: " + mardi_origin[i]);
        // console.log(lundi_origin[i].join(""));
        mardi_origin[i] = parseInt(mardi_origin[i], 2);
        transformer = [];
    }
    for (i = 0; i < 12; i++) {
        var transformer = [];
        transformer.push(mercedi_new[4 * i]);
        transformer.push(mercedi_new[4 * i + 1]);
        transformer.push(mercedi_new[4 * i + 2]);
        transformer.push(mercedi_new[4 * i + 3]);
        //transformer.push(lundi_new.split(",")[4*i+3]);
        mercedi_origin[i] = transformer.join("");
        mercedi_origin[i] = inverseNumber(mercedi_origin[i]);
        console.log("inverseNumber: " + mercedi_origin[i]);
        // console.log(lundi_origin[i].join(""));
        mercedi_origin[i] = parseInt(mercedi_origin[i], 2);
        transformer = [];
    }
    for (i = 0; i < 12; i++) {
        var transformer = [];
        transformer.push(jeudi_new[4 * i]);
        transformer.push(jeudi_new[4 * i + 1]);
        transformer.push(jeudi_new[4 * i + 2]);
        transformer.push(jeudi_new[4 * i + 3]);
        //transformer.push(lundi_new.split(",")[4*i+3]);
        jeudi_origin[i] = transformer.join("");
        jeudi_origin[i] = inverseNumber(jeudi_origin[i]);
        console.log("inverseNumber: " + jeudi_origin[i]);
        // console.log(lundi_origin[i].join(""));
        jeudi_origin[i] = parseInt(jeudi_origin[i], 2);
        transformer = [];
    }
    for (i = 0; i < 12; i++) {
        var transformer = [];
        transformer.push(vendredi_new[4 * i]);
        transformer.push(vendredi_new[4 * i + 1]);
        transformer.push(vendredi_new[4 * i + 2]);
        transformer.push(vendredi_new[4 * i + 3]);
        //transformer.push(lundi_new.split(",")[4*i+3]);
        vendredi_origin[i] = transformer.join("");
        vendredi_origin[i] = inverseNumber(vendredi_origin[i]);
        console.log("inverseNumber: " + vendredi_origin[i]);
        // console.log(lundi_origin[i].join(""));
        vendredi_origin[i] = parseInt(vendredi_origin[i], 2);
        transformer = [];
    }
    for (i = 0; i < 12; i++) {
        var transformer = [];
        transformer.push(samedi_new[4 * i]);
        transformer.push(samedi_new[4 * i + 1]);
        transformer.push(samedi_new[4 * i + 2]);
        transformer.push(samedi_new[4 * i + 3]);
        //transformer.push(lundi_new.split(",")[4*i+3]);
        samedi_origin[i] = transformer.join("");
        samedi_origin[i] = inverseNumber(samedi_origin[i]);
        console.log("inverseNumber: " + samedi_origin[i]);
        // console.log(lundi_origin[i].join(""));
        samedi_origin[i] = parseInt(samedi_origin[i], 2);
        transformer = [];
    }
    for (i = 0; i < 12; i++) {
        var transformer = [];
        transformer.push(dimanche_new[4 * i]);
        transformer.push(dimanche_new[4 * i + 1]);
        transformer.push(dimanche_new[4 * i + 2]);
        transformer.push(dimanche_new[4 * i + 3]);
        //transformer.push(lundi_new.split(",")[4*i+3]);
        dimanche_origin[i] = transformer.join("");
        dimanche_origin[i] = inverseNumber(dimanche_origin[i]);
        console.log("inverseNumber: " + dimanche_origin[i]);
        // console.log(lundi_origin[i].join(""));
        dimanche_origin[i] = parseInt(dimanche_origin[i], 2);
        transformer = [];
    }
    console.log("did : " + deviceControl + "  mode : " + modeControl);
    //var time = hourControl+':'+minuteControl;
    //console.log("time: "+time);
    //setTime(tokenList, deviceControl, modeControl, dayControl, time);
    var int_start = parseInt(startControl / 2) + 1;
    console.log("start: " + int_start);

    var int_end = parseInt(endControl / 2) + 1;
    console.log("end: " + int_end);
    for (i = 1; i < 13; i++) {
        // controlDeviceByScheduler(deviceControl, lundi_origin[i-1], "p1_data" + i, tokenList)
        mode_schedule[0][i - 1] = lundi_origin[i - 1];
    }
    for (i = 1; i < 13; i++) {
        mode_schedule[1][i - 1] = mardi_origin[i - 1];
        // controlDeviceByScheduler(deviceControl, mardi_origin[i-1], "p2_data" + i, tokenList)
    }
    for (i = 1; i < 13; i++) {
        mode_schedule[2][i - 1] = mercedi_origin[i - 1];
        //controlDeviceByScheduler(deviceControl, mercedi_origin[i-1], "p3_data" + i, tokenList)
    }
    for (i = 1; i < 13; i++) {
        mode_schedule[3][i - 1] = jeudi_origin[i - 1];
        //controlDeviceByScheduler(deviceControl, jeudi_origin[i-1], "p4_data" + i, tokenList)
    }
    for (i = 1; i < 13; i++) {
        mode_schedule[4][i - 1] = vendredi_origin[i - 1];
        //controlDeviceByScheduler(deviceControl, vendredi_origin[i-1], "p5_data" + i, tokenList)
    }
    for (i = 1; i < 13; i++) {
        mode_schedule[5][i - 1] = samedi_origin[i - 1];
        //controlDeviceByScheduler(deviceControl, samedi_origin[i-1], "p6_data" + i, tokenList)
    }
    for (i = 1; i < 13; i++) {
        mode_schedule[6][i - 1] = dimanche_origin[i - 1];
        // controlDeviceByScheduler(deviceControl, dimanche_origin[i-1], "p7_data" + i, tokenList)
        //console.log("p7: "+i)
    }/* 
    console.log("mode_schedule: " + mode_schedule)
    console.log("mode1 1: " + mode_schedule[0])
    console.log("mode1: " + mode_schedule[0][0])
    console.log("mode2: " + mode_schedule[0][1]) */
    var data1 = {};
    var data2 = {};
    var data3 = {};
    for (var i = 1; i < 2; i++) {
        for (var j = 1; j < 13; j++) {
           // console.log("i: " + i);
           // console.log("j: " + j);
            data1["p" + i + "_data" + j] = mode_schedule[i - 1][j - 1];
        }
    }
  
    /* var data1 = JSON.stringify(data1)
    console.log(data1);
    res.render('deviceControl', {
        title: 'Heatzy',
        nicknameList: nicknameList,
        devicesList: devicesList,
        tokenPost: token_fresh,
        deviceHost: deviceHost,
        uid:uid,
        dataDid:deviceControl,
        data:data1
    }); */
     for (var i = 2; i < 5; i++) {
        for (var j = 1; j < 13; j++) {
            data2["p" + i + "_data" + j] = mode_schedule[i - 1][j - 1];
        }
    }
    for (var i = 5; i < 8; i++) {
        for (var j = 1; j < 13; j++) {
            data3["p" + i + "_data" + j] = mode_schedule[i - 1][j - 1];
        }
    }
    
    //var mode_lundi = {"p1_data1": mode[0][0], "p1_data2":mode[0][1], "p1_data3": mode[0][2], "p1_data4":mode[0][3], "p1_data5": mode[0][4], "p1_data6":mode[0][5], "p1_data7": mode[0][6], "p1_data8":mode[0][7],"p1_data9": mode[0][8], "p1_data10":mode[0][9], "p1_data11": mode[0][10], "p1_data12":mode[0][11]};
    //var mode_lundi_test = {"p1_data1": 0, "p1_data2":0, "p1_data3": 0, "p1_data4":0, "p1_data5": 0, "p1_data6":0, "p1_data7": 0, "p1_data8":0,"p1_data9": 0, "p1_data10":0, "p1_data11": 0, "p1_data12":0}
    /* var temp = deviceControl+"|"+modeControl;
    var deviceTemp =  Device(uid,token_fresh);
    deviceTemp.connnect("eusandbox.gizwits.com");
    deviceTemp.write("eusandbox.gizwits.com",temp);*/
    controlDeviceLundiByScheduler(deviceControl, data1, tokenList).then((strS)=>{
        controlDeviceLundiByScheduler(deviceControl, data2, tokenList).then((strS)=>{
            controlDeviceLundiByScheduler(deviceControl, data3, tokenList).then((strS)=>{
               
                    controlDeviceLundiByScheduler(deviceControl, dataExtra, tokenList).then(()=>{
                        res.redirect('/deviceControl' + '?token=' + tokenList+"&uid="+uid);
                    });
                })
            })
        })
    /* setTimeout(() => {
        controlDeviceLundiByScheduler(deviceControl, data2, tokenList);
    }, 1000);
    setTimeout(() => {
        controlDeviceLundiByScheduler(deviceControl, data3, tokenList);
    }, 2000);
    setTimeout(() => {
        controlDeviceLundiByScheduler(deviceControl, data4, tokenList);
    }, 3000); 
    //controlDeviceScheduleTogetther(deviceControl, tokenList, mode_schedule);
    //controlDevice(deviceControl,modeControl,tokenList);
    setTimeout(() => {
        // res.redirect('/deviceControl' + '?token=' + tokenList);},4000);
       // res.redirect('/deviceSchedule_orgin' + '?token=' + tokenList + "&name=" + nameSchedule + "&did=" + didSchedule + "&mode=" + mode);
       res.redirect('/deviceControl' + '?token=' + tokenList);
    }, 4000);
 */
    //res.redirect('/timeTask'+'?token='+tokenList);

    }
})   
function setOrder(array) {
    var array1 = [];
    for (i = 0; i < array.length; i++) {
       // console.log(i+"= " + array[i]);
        var order = array[i].split('\a')[2].split('\"')[0];
        //var value = array[i].split(':')[1];
        array1[order - 1] = array[i]
    }
    return array1;

}
function inverseNumber(num) {
    var num_inver = "";
    var unit_list = num.split("");
    // console.log("unit_list: "+unit_list)
    var unit_inver = []
    for (j = 0; j < unit_list.length; j++) {
        unit_inver[j] = unit_list[unit_list.length - 1 - j];
    }
    num_inver = unit_inver.join("");
    // console.log("num inverse: "+num_inver);
    return num_inver;

}

function addZero(array) {
    for (var i in array) {
        if (array[i] == "1") {
            array[i] = "10"
        }
        if (array[i] == "0") {
            array[i] = "00"
        }
        if (array[i] == "") {
            array[i] = "00"
        } else {
            continue;
        }
    }
    return array;
}
function controlDeviceLundiByScheduler(did, modeLundi, token) {
    var didA = did.split(',');
   
        return new Promise((resolve, reject) => { 
            for(var a in didA){
            console.log("modeLundi"+JSON.stringify(modeLundi) );
            var strS='';
            var body = {
                "attrs": modeLundi
        };
        var bodyString = JSON.stringify(body);
            console.log("modeInt: " +JSON.stringify(modeLundi) )
            var options = {
                hostname: host,
                path: '/app/control/'+didA[a],
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Gizwits-Application-Id': gizwitsAppId,
                    'X-Gizwits-User-token': token
                            }
            };
            console.log("options"+JSON.stringify(options));
            var req = http.request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
        
                res.on('data', (chunk) => {
                    strS += chunk;
                   // console.log(`return BODY: ${chunk}`);
                    //var plan = JSON.parse(str);
                    console.log("controlDeviceByScheduler: " + strS);
                });
                
                res.on('end', () => {
                    console.log("controlDeviceByScheduler: " + strS);
                    if(a ==(didA.length-1)){
                        console.log(a);
                        resolve(strS);
                    }
                })
            });
            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                res.render("deviceSchedule_origin",{
                    error:e.message
                })
                reject(e);
            });
            req.write(bodyString);
            req.end();
        }
        });
    }



module.exports = router;
