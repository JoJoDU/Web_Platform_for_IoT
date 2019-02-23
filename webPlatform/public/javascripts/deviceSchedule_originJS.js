function getHTTPObject () {
	// IE7之前的版本中不支持原生的XHR对象
	if (typeof XMLHttpRequest === "undefined") {
		XMLHttpRequest = function() {
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
				catch (e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
				catch (e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP"); }
				catch (e) {}
			return false;
		}
	}
	return new XMLHttpRequest();
}

function scheduleOff(ev){
    var valueOri = ev.value;
    valueOriArr = valueOri.split('|');
    var token = valueOriArr[0];
    var did_ori = valueOriArr[1];
    did_ori = String(did_ori);
    var didArray = did_ori.split(',');
  //  var request = getHTTPObject();
  for(var a in didArray){
    var request = getHTTPObject();
    if (request) {
        // open方法的三个参数分别是，请求类型，请求文件的路径(URL 相对于执行代码的当前页面或者是绝对路径)和是否异步（布尔值）
        request.open('POST', "https://euapi.gizwits.com/app/control/"+didArray[a], true);
        // 服务器给XMLHttpRequest对象送回响应的时候被触发执行
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                // 后弹出，收到响应后才执行
                var obj = document.getElementById('schedule');
                obj.src = "/images/schedule_off.png";
                obj.onclick = function(){
                    scheduleOn(obj);
            };
                
                /* var para = document.createElement("p");
                var txt = document.createTextNode(request.responseText);
                para.appendChild(txt);
                document.getElementById('new').appendChild(para); */
            }
        };
        
        request.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
        request.setRequestHeader("X-Gizwits-User-token",token);
        request.setRequestHeader('Content-Type', 'application/json')
        // 这里的send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。调用send()之后，请求就会被分派到服务器。
        request.send('{"attrs":{"timer_switch":0}}');
    } else{
        alert('Sorry, your browser doesn\'t support XMLHttpRequest');
    }
    // 先弹出，等待响应的过程中先继续向后执行到这里
    //alert('Function Done!');
}
}
function scheduleOn(ev){
    var valueOri = ev.value;
    valueOriArr = valueOri.split('|');
    var token = valueOriArr[0];
    var did_ori = valueOriArr[1];
    did_ori = String(did_ori);
    var didArray = did_ori.split(',');
  //  var request = getHTTPObject();
  for(var a in didArray){
    var request = getHTTPObject();
    if (request) {
        // open方法的三个参数分别是，请求类型，请求文件的路径(URL 相对于执行代码的当前页面或者是绝对路径)和是否异步（布尔值）
        request.open('POST', "https://euapi.gizwits.com/app/control/"+didArray[a], true);
        // 服务器给XMLHttpRequest对象送回响应的时候被触发执行
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                // 后弹出，收到响应后才执行
                var obj = document.getElementById('schedule');
                obj.src = "/images/schedule_on.png";
                obj.onclick = function(){
                    scheduleOff(obj);
            };
                /* var para = document.createElement("p");
                var txt = document.createTextNode(request.responseText);
                para.appendChild(txt);
                document.getElementById('new').appendChild(para); */
            }
        };
        
        request.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
        request.setRequestHeader("X-Gizwits-User-token",token);
        request.setRequestHeader('Content-Type', 'application/json')
        // 这里的send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。调用send()之后，请求就会被分派到服务器。
        request.send('{"attrs":{"timer_switch":1}}');
    } else{
        alert('Sorry, your browser doesn\'t support XMLHttpRequest');
    }
    // 先弹出，等待响应的过程中先继续向后执行到这里
    //alert('Function Done!');
}
}
