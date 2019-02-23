var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var app = express();
const host = 'euapi.gizwits.com';
var config = require('../config');
const gizwitsAppId = config.heatzy_Id;
var http = require('http');
app.use(express.static("public"));
router.get('/', function (req, res) {
    res.render("resetPwd",{
		err:''
	})
})
router.post('/', urlencodedParser, function (req, res) {
   // console.log(req);
    response = {
        username: req.body.username
    }
    var mail = response.username;
    console.log(mail);
    if(mail == ''){
        var errmessage = 'Email est vide!';
	    res.render("resetPwd",{
		err:errmessage
	})
    }else{
    var strS='';
    var body = {
        "email": mail
    };
    var bodyString = JSON.stringify(body);
    var options = {
        hostname: host,
        path: '/app/reset_password',
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
            console.log("reset psw: " + strS);
        })
    });
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    req.write(bodyString);
    req.end();
    res.redirect("/resetDown");
}
    })
    module.exports = router;
    