var device;

           
          /*  for(var a in groupDevicesIDList){
            groupDevicesIDList[a] = stringToArray(groupDevicesIDList[a]); 
           }
           for(var a in groupDevicesList){
            groupDevicesList[a] = stringToArray(groupDevicesList[a]); 
            console.log(groupDevicesList)
           }*/
         //=========================================================
        // call functions
        //=========================================================  
           function prepare(){
            //console.log(deviceID.length);
           // console.log(JSON.stringify(deviceID))
            device = new Device(uid,token);
            device.connect(deviceHost);
           }
            function writeH(name){
                var did = name.split("|")[0];
                var temp = name.split("|")[1];
				var pattern = /[a-z]/;
                if(!pattern.test(temp)){
                    temp = parseInt(temp);
                    if(temp>30||temp<1){
                        alert("Le jour n'est pas dans le cadre limite!")
                    }
                    var attr =JSON.stringify({"derog_mode":1,"derog_time":temp}) ;
                    var div1 = document.getElementById(did+"|derogJour");
                        //alert(div1.style.display);
                        if(div1.style.display=='block'){
                        div1.style.display='none';//show的display属性设置为block（显示）
                        }
                device.write(deviceHost,attr,did);
                }else{
                    /* var did = name.split("|")[0];
                var temp = name.split("|")[1]; */
                switch(temp){
                    case "cft":
                    var attr =JSON.stringify({"mode":temp}) ;
                    break;
                    case "eco":
                    var attr =JSON.stringify({"mode":temp}) ;
                    break;
                    case "fro":
                    var attr =JSON.stringify({"mode":temp}) ;
					break;
					case "stop":
					var attr =JSON.stringify({"mode":temp}) ;
					break;
                    case "derog_mode":
                    var obj = window.document.getElementById(name);
                    var reg = new RegExp("vacances_gris");
                    var srcLock = reg.exec(obj.src);
                    if(srcLock !== null){
                       // alert("1"+obj.src);
                        obj.src = "/images/vacances_vert.png";
                        var attr =JSON.stringify({}) ;
                        var div1 = document.getElementById(did+"|derogJour");
                       // alert(div1.style.display);
                        if(div1.style.display=='none'){
                        div1.style.display='block';//show的display属性设置为block（显示）
                        }
                        else{
                            div1.style.display='block';//show的display属性设置为block（显示）
                        }
                }
                    else{
                       // alert("0"+obj.src);
                        obj.src = "/images/vacances_gris.png";
                        //alert("0"+obj.src);
                        var attr =JSON.stringify({"derog_mode":0});
                        var div2 = document.getElementById(did+"|derogJour");
                        div2.style.display='none';//show的display属性设置为block（显示）
                    }
                    break;
                    case "lock_switch":
                    var obj = window.document.getElementById(name);
                    var reg = new RegExp("lock_gris");
                    var srcLock = reg.exec(obj.src);
                    //alert(srcLock);
                    if(srcLock !== null){
                     //   alert("1"+obj.src);
                        obj.src = "/images/lock_vert.png";
                        var attr =JSON.stringify({"lock_switch":1}) ;
                    }
                    else {
                       // alert("0"+obj.src);
                        obj.src = "/images/lock_gris.png";
                        var attr =JSON.stringify({"lock_switch":0}) ;
                    }
                    break;
                }
                device.write(deviceHost,attr,did);
                }
            }
            function writeG(name){
                var didG = name.split("|")[0];
                var temp = name.split("|")[1];
				var pattern = /[a-z]/;
				console.log(name);
                var didArray = didG.split(',');
                for(var a in didArray){
                    if(!pattern.test(temp)){
                    temp = parseInt(temp);
                    if(temp>30||temp<0){
                        alert("Le jour n'est pas dans le cadre limite!")
                    }else if(temp == 0){
                    var obj = window.document.getElementById(didArray[0]+"|derog_mode");
                    var div1 = document.getElementById(didArray[0]+"|derogJour");
                    var reg = new RegExp("vacances_gris");
                    var srcLock = reg.exec(obj.src);
                    if(srcLock !== null){
                        var div2 = document.getElementById(didArray[0]+"|derogJour");
                        div2.style.display='none';//show的display属性设置为block（显示）
                    }
                    }else{
                        var attr =JSON.stringify({"derog_mode":1,"derog_time":temp}) ;
                    var div1 = document.getElementById(didArray[0]+"|derogJour");
                        //alert(div1.style.display);
                        if(div1.style.display=='block'){
                        div1.style.display='none';//show的display属性设置为block（显示）
                        }
                device.write(deviceHost,attr,didArray[a]);
                    }
                    
                }else{
                    /* var did = name.split("|")[0];
                var temp = name.split("|")[1]; */
                switch(temp){
                    case "cft":
                    var attr =JSON.stringify({"mode":temp}) ;
                    break;
                    case "eco":
                    var attr =JSON.stringify({"mode":temp}) ;
                    break;
                    case "fro":
                    var attr =JSON.stringify({"mode":temp}) ;
					break;
					case "stop":
					var attr =JSON.stringify({"mode":temp}) ;
					break;
                    case "derog_mode":
                    var obj = window.document.getElementById(didArray[0]+"|derog_mode");
                    console.log(didArray[0]);
                    var reg = new RegExp("vacances_gris");
                    var srcLock = reg.exec(obj.src);
                    if(srcLock !== null){
                       // alert("1"+obj.src);
                        //obj.src = "/images/vacances_vert.png";
                        var attr =JSON.stringify({}) ;
                        var div1 = document.getElementById(didArray[0]+"|derogJour");
                      // alert(div1.style.display);
                        if(div1.style.display=='none'){
                        div1.style.display='block';//show的display属性设置为block（显示）
                        }
                        else{
                            div1.style.display='block';//show的display属性设置为block（显示）
                        }
                }
                    else{
                       // alert("0"+obj.src);
                       // obj.src = "/images/vacances_gris.png";
                      //  alert("0"+obj.src);
                        var attr =JSON.stringify({"derog_mode":0});
                        var div2 = document.getElementById(didArray[0]+"|derogJour");
                        div2.style.display='none';//show的display属性设置为block（显示）
                    }
                    break;
                    case "lock_switch":
                    var obj = window.document.getElementById(didArray[0]+'|lock_switch');
                    var reg = new RegExp("lock_gris");
                    var srcLock = reg.exec(obj.src);
                    //alert(srcLock);
                    if(srcLock !== null){
                     //   alert("1"+obj.src);
                        //obj.src = "/images/lock_vert.png";
                        var attr =JSON.stringify({"lock_switch":1}) ;
                    }
                    else {
                       // alert("0"+obj.src);
                      // obj.src = "/images/lock_gris.png";
                        var attr =JSON.stringify({"lock_switch":0}) ;
                    }
                    break;
                }
                device.write(deviceHost,attr,didArray[a]);
                }
                }
                
            }

            /*

        function getCookie(cname)
        {
        var name = cname+"=";
        var ca =window.document.cookie.split(';');
        console.log(ca);
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i].trim();
            
            if (c.indexOf(name)==0) {
                console.log("c"+c);
                return c.substring(name.length,c.length);}
        }
        return "";
        }

        function setCookie(cname,cvalue,exdays)
        {
        var d = new Date();
        d.setTime(d.getTime()+(exdays*60*1000));
        var expires = "expires="+d.toGMTString();
        console.log( cvalue + "; " + expires);
        window.document.cookie =  cname+"="+cvalue + "; " + expires;
        }*/

   
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

function putBindingZone(ev){
	var didArray = ev.name.split(',');
	for(var a in didArray){
		var request = getHTTPObject();
		if (request) {
			// open方法的三个参数分别是，请求类型，请求文件的路径(URL 相对于执行代码的当前页面或者是绝对路径)和是否异步（布尔值）
			request.open('PUT', "https://euapi.gizwits.com/app/bindings/"+didArray[a], true);
			// 服务器给XMLHttpRequest对象送回响应的时候被触发执行
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					// 后弹出，收到响应后才执行alert('Response Received!');
					
					/* var para = document.createElement("p");
					var txt = document.createTextNode(request.responseText);
					para.appendChild(txt);
					document.getElementById('new').appendChild(para); */
					window.location.reload();
				}
			};
			
			request.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
			request.setRequestHeader("X-Gizwits-User-token",token);
			request.setRequestHeader('Content-Type', 'application/json')
			// 这里的send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。调用send()之后，请求就会被分派到服务器。
			request.send('{"remark":"range=25|isdelete=1|gid=0|groupname=|grouprange=1"}');
		} else{
			alert('Sorry, your browser doesn\'t support XMLHttpRequest');
		}
		// 先弹出，等待响应的过程中先继续向后执行到这里
		//alert('Function Done!');
	}
	
}
function putBinding (ev) {
    console.log(ev);
    if (ev.className.indexOf('del_btn') < 0) return;
    var ele = ev.parentNode;
    ele.remove('div'); //remove the product
    var request = getHTTPObject();
    var did = ev.name;
   // alert(ev.name);
	if (request) {
		// open方法的三个参数分别是，请求类型，请求文件的路径(URL 相对于执行代码的当前页面或者是绝对路径)和是否异步（布尔值）
		request.open('PUT', "https://euapi.gizwits.com/app/bindings/"+did, true);
		// 服务器给XMLHttpRequest对象送回响应的时候被触发执行
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				//alert(request.responseText);
				// 后弹出，收到响应后才执行alert('Response Received!');
				
				/* var para = document.createElement("p");
				var txt = document.createTextNode(request.responseText);
				para.appendChild(txt);
                document.getElementById('new').appendChild(para); */
                window.location.reload();
			}
        };
        
        request.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
        request.setRequestHeader("X-Gizwits-User-token",token);
        request.setRequestHeader('Content-Type', 'application/json')
		// 这里的send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。调用send()之后，请求就会被分派到服务器。
		request.send('{"remark":"range=25|isdelete=1|gid=0|groupname=|grouprange=0"}');
	} else{
		alert('Sorry, your browser doesn\'t support XMLHttpRequest');
	}
	// 先弹出，等待响应的过程中先继续向后执行到这里
	//alert('Function Done!');
}
function getNewContent () {
	var request = getHTTPObject();
	if (request) {
		// open方法的三个参数分别是，请求类型，请求文件的路径(URL 相对于执行代码的当前页面或者是绝对路径)和是否异步（布尔值）
		request.open('GET', "https://euapi.gizwits.com/app/bindings", true);
		// 服务器给XMLHttpRequest对象送回响应的时候被触发执行
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				// 后弹出，收到响应后才执行alert('Response Received!');
				alert("a");
				/* var para = document.createElement("p");
				var txt = document.createTextNode(request.responseText);
				para.appendChild(txt);
				document.getElementById('new').appendChild(para); */
			}
        };
        console.log(token);
        request.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
        request.setRequestHeader("X-Gizwits-User-token",token);
		// 这里的send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。调用send()之后，请求就会被分派到服务器。
		request.send(null);
	} else{
		alert('Sorry, your browser doesn\'t support XMLHttpRequest');
	}
	// 先弹出，等待响应的过程中先继续向后执行到这里
	alert('Function Done!');
}

function selectDevice(ev){
	var obj=document.getElementById('grpDeviceAjoute');
	var index=obj.selectedIndex;
	var val = obj.options[index].value; //did
	if(val !== ''){
	var requestAjoutDevice = getHTTPObject();
	var requestGetProg = getHTTPObject();
	var requestPostProg = getHTTPObject();
	}
	var did = val;
	var grpdid = ev.form.id;
	var grpname = ev.form.name;
	var firstDeviceId = obj.name;
	var progOld;
	//alert(firstDeviceId);
	if (requestAjoutDevice) {
		requestAjoutDevice.open('PUT', "https://euapi.gizwits.com/app/bindings/"+did, true);
		requestAjoutDevice.onreadystatechange = function () {
			if (requestAjoutDevice.readyState === 4) {
			}
        };
        
        requestAjoutDevice.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
        requestAjoutDevice.setRequestHeader("X-Gizwits-User-token",token);
        requestAjoutDevice.setRequestHeader('Content-Type', 'application/json')
		requestAjoutDevice.send('{"remark":"range=25|isdelete=1|gid='+grpdid+'|groupname='+grpname+'|grouprange=1"}');
	} else{
		alert('Sorry, your browser doesn\'t support XMLHttpRequest');
	}
	if (requestGetProg) {
		requestGetProg.open('GET', "https://euapi.gizwits.com/app/devdata/"+firstDeviceId+"/latest", true);
		requestGetProg.onreadystatechange = function () {
			if (requestGetProg.readyState === 4) {
				//alert(requestGetProg.responseText);
				progOld = requestGetProg.responseText;
				var post1;
				var post2;
				var post3;
				var progPost = JSON.stringify((JSON.parse(progOld).attr));
				var progPostArray1 = progPost.split(',',30);
				for(var a=0;a<30;a++){
					post1 = progPostArray1.join();
				}
				post1 = post1+'}';
				device.write(deviceHost,post1,did);
				console.log(progPostArray1,"	",post1);

				var progPostArray2 = progPost.split(',');
				postArray2 = progPostArray2.slice(30,60);
				console.log(postArray2);
				post2 = postArray2.join();
				post2 = '{'+ post2 +'}';
				console.log(post2);
				device.write(deviceHost,post2,did);

				postArray3 = progPostArray2.slice(60,progPostArray2.length);
				console.log(postArray3);
				post3 = postArray3.join();
				post3 = '{'+ post3 ;
				console.log(post3);
				device.write(deviceHost,post3,did);
				window.location.reload();
			
			}
        };
        
        requestGetProg.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
        requestGetProg.setRequestHeader('Content-Type', 'application/json')
		requestGetProg.send(null);
	} else{
		alert('Sorry, your browser doesn\'t support XMLHttpRequest');
	}
	
}
function changeGrpNom(ev){
	var grpId = ev.form.id;
	var grpName = ev.value;
	var devicesId = ev.id;
	var deviceIDArray = devicesId.split(',');
	console.log(grpId,grpName,devicesId,deviceIDArray);
	for(var a in deviceIDArray){
		var request = getHTTPObject();
		console.log(deviceIDArray[a]);
		if (request) {
			// open方法的三个参数分别是，请求类型，请求文件的路径(URL 相对于执行代码的当前页面或者是绝对路径)和是否异步（布尔值）
			request.open('PUT', "https://euapi.gizwits.com/app/bindings/"+deviceIDArray[a], true);
			// 服务器给XMLHttpRequest对象送回响应的时候被触发执行
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					// 后弹出，收到响应后才执行alert('Response Received!');
					
				}
			};
			console.log(token);
			request.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
			request.setRequestHeader("X-Gizwits-User-token",token);
			request.setRequestHeader('Content-Type', 'application/json')
			// 这里的send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。调用send()之后，请求就会被分派到服务器。
			request.send('{"remark":"range=25|isdelete=1|gid='+grpId+'|groupname='+grpName+'|grouprange=1"}');
		} else{
			alert('Sorry, your browser doesn\'t support XMLHttpRequest');
		}
		// 先弹出，等待响应的过程中先继续向后执行到这里
		//alert('Function Done!');
	}
	
}
function changeNom(ev){
	var deviceName = ev.value;
	var deviceId = ev.id;
	console.log(deviceName,deviceId);
		var request = getHTTPObject();
		if (request) {
			// open方法的三个参数分别是，请求类型，请求文件的路径(URL 相对于执行代码的当前页面或者是绝对路径)和是否异步（布尔值）
			request.open('PUT', "https://euapi.gizwits.com/app/bindings/"+deviceId,true);
			// 服务器给XMLHttpRequest对象送回响应的时候被触发执行
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					// 后弹出，收到响应后才执行alert('Response Received!');
					
				}
			};
			console.log(token);
			request.setRequestHeader("X-Gizwits-Application-Id","c70a66ff039d41b4a220e198b0fcc8b3");
			request.setRequestHeader("X-Gizwits-User-token",token);
			request.setRequestHeader('Content-Type', 'application/json')
			// 这里的send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。调用send()之后，请求就会被分派到服务器。
			request.send('{"dev_alias":"'+deviceName+'"}');
		} else{
			alert('Sorry, your browser doesn\'t support XMLHttpRequest');
		}
		// 先弹出，等待响应的过程中先继续向后执行到这里
		//alert('Function Done!');
	}
	function supprimeBtn(ev){
	//	document.getElementsByClassName("btn2").removeAttribute("disabled");
		$("#grpDeviceAjoute").remove();
		$(ev).remove();
	}
	function modifyPosition(){
		if((nicknameList.length=1)&&(nicknameList[0]=='')){
			document.getElementById("right").style="margin-left:10px;";
		}else if(nicknameList.length>0){
			//document.getElementById("right").style="margin-left:400px;";
		}
	}          
	 function createSel(ev){
		var nicknameList = nicknameListS.split(',');
		if((nicknameList.length>0)&&(nicknameList[0]!=='')){
			var selAjoute = document.createElement('select');
			selAjoute.name = ev.id; //value + name to the first device as group id
			selAjoute.id = "grpDeviceAjoute";
			selAjoute.style = "display:block";
			ev.parentNode.appendChild(selAjoute);
			var optFirst = new Option('Liste','');
			// opt.setAttribute("onselect","selectDevice(this)");
			selAjoute.options.add(optFirst);
			for(var a = 1;a<nicknameList.length+1;a++){
				var opt = new Option(nicknameList[a-1],deviceID[a-1]);
			   // opt.setAttribute("onselect","selectDevice(this)");
				selAjoute.options.add(opt);
			}
			selAjoute.setAttribute("onchange","selectDevice(this)");
			//ev.setAttribute("disabled","true");
			var supprmeAjoute = document.createElement('button');
			supprmeAjoute.name = "supprmeAjoute";
			supprmeAjoute.id = "supprmeAjoute";
			supprmeAjoute.className = "del_produit_btn";
			supprmeAjoute.type = "button";
			supprmeAjoute.style = "float:right;"
			
			ev.parentNode.appendChild(supprmeAjoute);
			supprmeAjoute.setAttribute("onclick","supprimeBtn(this)"); 
			}else{
				alert("Il n'y a pas de produit!")
			}
	}
	function minus(ev){
		var value = ev.form.amount.value;
		if(value<31&value>1){
			ev.form.amount.value--;
		}
	}
	function add(ev){
		var value = ev.form.amount.value;
		if(value<30&value>0){
			ev.form.amount.value++;
		}
	}