var userid;
var recievers;
var volume = 50;
var interval = null;
var sound = new Audio("msg.wav");
var silent = false;
sound.setAttribute('type', 'audio/mp3');
sound.preload = 'auto';
sound.load();
function doLogin() {    	
    	  VK.Auth.getLoginStatus(function(response) {
          if (response.session) {
		    console.log("response");
			console.log(response);
			console.log(response.session.mid);
			userid = response.session.mid;
			init();
          } else {
            VK.Auth.login(
    	    null,
    	    VK.access.USERS 
    	  );
          }
        });
    	}
		
      function loginOpenAPI() {
    	  getInitData();
    	}
	  
      function getInitData() {
    	  VK.Api.call('users.get', {'uids':userid}, function(r) {
          	  if(r.response) {
          		
          		console.debug(r.response);
          		//current.song = new Audio(r.response[0].url);
          		current.pos = 0;
          		//current.song.setAttribute('type', 'audio/mp3');
          		//current.song.play();
				
				if(isCookieSet("volume")){
				volume = getCookie("volume");
				console.debug("From cookies "+volume);				
				}else{
				setCookie("volume",50,10);				
				console.debug("From code "+volume);		
				}
							
			
          	
			
        
          	  }
          	});
    	}



function playSound() {
  var click=sound;
  click.volume = volume/100;
  click.play();
}

















onSocketMessage = function(message) {
	var date;
	var messageXML =  ((new DOMParser()).parseFromString(message.data, "text/xml"));
	var friend;
	var from;
	var nick;
	var color;
	var messageType = messageXML.documentElement.getElementsByTagName("type")[0].firstChild.nodeValue;
	//console.debug(messageType);
	if(messageType == "addToFriendList"){
		color = messageXML.documentElement.getElementsByTagName("color")[0].firstChild.nodeValue;
		nick = messageXML.documentElement.getElementsByTagName("nick")[0].firstChild.nodeValue;
		friend = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue;
		date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;	
		addToFriends(friend,nick,date,color);
		
	}else if(messageType == "nickNameChange"){
		color = messageXML.documentElement.getElementsByTagName("color")[0].firstChild.nodeValue;
		 nick = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue ;	
		 from = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue ;	
		 date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		 console.debug("date "+date);
		 changeNick(nick,from,date);
	}else if(messageType == "colorChange"){		
		 color = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue ;	
		 from = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue ;	
		 date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		 console.debug("date "+date);
		 colorChange(color,from,date);
	}else if(messageType == "updateChatBox"){	
		
		color = messageXML.documentElement.getElementsByTagName("color")[0].firstChild.nodeValue;
		//alert(color); 
		friend = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue ;	
		 date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		 console.debug("date "+date);
		 updateChatBox(messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue,friend,date,color);
	}else if(messageType == "removeFromFriendList"){
		date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		nick = messageXML.documentElement.getElementsByTagName("nick")[0].firstChild.nodeValue;
		friend = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue;
		console.debug("date removeFromFriendList "+date);
		removeFromFriends(friend,nick,date);
	}
};


displayFriendList =function(){
	console.debug("List requested");
	var txt = document.createElement("div");
	document.getElementById("FriendList").innerHTML = '';
	document.getElementById("FriendList").appendChild(txt);	
	var getFriendListURI = 'getFriendList?userid='+ userid;
	var httpRequest = makeRequest(getFriendListURI,false);
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			var friendListXML = httpRequest.responseXML.getElementsByTagName("friend");
			for( var i =0 ; i < friendListXML.length ; i++){
				var color = friendListXML[i].getElementsByTagName("color")[0].firstChild.nodeValue
				addToFriends(friendListXML[i].getElementsByTagName("email")[0].firstChild.nodeValue,friendListXML[i].getElementsByTagName("name")[0].firstChild.nodeValue,dateFormat(),color);
			}
			
		}else {
			console.debug('There was a problem with the request.');
		}
	}
};


var friendsList= new Array();


 function addToFriends(friend,nick,date,color){
	console.debug("Friend add called");				
		var a = "<a id='"+friend+"' style='color:"+color+"'><b>"+nick+"</b></a>";
		var txt = document.createElement("div");
		txt.innerHTML = a;
		txt.style.cursor="pointer";
		txt.setAttribute("onclick","openChat(\""+friend+"\");");
		document.getElementById("FriendList").appendChild(txt);
		addSystemMessage(nick+" joined",date,false);
};

removeFromFriends = function(friend,nick,date){
	//check if the user already added
	var element =  document.getElementById(friend);
	if (typeof(element) != 'undefined' && element != null)
	{
		contains = true;
	}else{
		contains = false;
	}
	console.debug("contains: "+contains);
	if(contains){		
		document.getElementById("FriendList").removeChild(document.getElementById(friend).parentNode);
		addSystemMessage(nick+" left",date,false);
		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	}
};
changeNick = function(nick,friend,date){
	//check if the user already added
		console.debug("Friend nick change called to :"+nick);
		document.getElementById(friend).innerHTML = '<b>'+nick+'<b>'
		addSystemMessage(friend+" changed name to "+nick,date,true);
		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	
};
colorChange = function(color,friend,date){
	//check if the user already added
		console.debug("Friend color change called to :"+color);
		document.getElementById(friend).style.color = color;
		addSystemMessage(friend+" color changed",date,true);
		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	
};

closeWindow = function(friend){
	document.getElementById(friend+"chatBox").style.display="none";
}

openChat = function(friend){
	document.getElementById(friend+"chatBox").style.display = "block";
	document.getElementById(friend+"textarea").focus();
}

function sendMessage(){
	
	//var message = tinyMCE.get('messageBox').getContent();
	var message =  document.getElementById("messageBox").value;
	message = message.replace(/^[ ]*/,'').replace(/^[\n]*/,'');
	var re = /^[\/]/;	
	if(re.test(message)){		
		commandParser(message);
		document.getElementById("messageBox").value = '';
		return '';
	}else{
	if(message != '' || message != ''){			
	console.debug(message);
	//message = message.split('<').join('lt').split('>').join('gt');
	console.debug(message);
	socket.emit('sendchat', message);	
	}
	}
	document.getElementById("messageBox").value = '';
}
function getHistory(){
	
	
	console.debug("History");
	var sendMessageURI = '/message?action=2';
	$.ajax({
		  type: "POST",
		  url: sendMessageURI,
		//  data: { message: message}
		  
		  error: function (xhr, ajaxOptions, thrownError) {
		        alert(xhr.status);
		        alert(thrownError);
		        console.debug(thrownError);
		      }
		}).done(function( msg ) {
			console.debug("Done History fetch");
			
			console.debug(msg);
			var from;
			var text;
			//xmlDoc = $.parseXML( msg ),
		    //$xml = $( xmlDoc ),
			
			//var messageXML =  ((new DOMParser()).parseFromString(msg.data, "text/xml"));
			var messages = msg.documentElement.getElementsByTagName("message");
			console.debug(messages[0]);
			
			
			for(i = 0;i<messages.length;i++){
				//try{
				color = messages[i].getElementsByTagName("color")[0].firstChild.nodeValue;
				from = messages[i].getElementsByTagName("from")[0].firstChild.nodeValue;
				text = messages[i].getElementsByTagName("messageText")[0].firstChild.nodeValue;
				date = messages[i].getElementsByTagName("date")[0].firstChild.nodeValue;
				console.debug("color "+color);
				console.debug("from "+from);
				console.debug("text "+text);
				var mesgDiv = document.createElement("a");
				mesgDiv.innerHTML ="<b class='userColor' style='color:"+color+"'>"+date+' - '+from+"</b>:  "+ text+"<br />";
				console.debug(mesgDiv);
				var abc = document.getElementById("messageCont");	
					abc.appendChild(mesgDiv);
				  var elem = $('#messageCont');
				  elem.scrollTop(elem[0].scrollHeight);
				//}catch(err){
					//addSystemMessage('Error in history message',dateFormat());
				//}
			}
			
		});
	
}
function updateChatBox (message,from,date,color){
	console.debug("Updatecalled");
	playSound();
	var mesgDiv = document.createElement("a");
	
	mesgDiv.innerHTML ="<b class='userColor' style='color:"+color+"'>"+date+' - '+from+"</b>:  "+ message+"<br />";
	console.debug(mesgDiv);
	var abc = document.getElementById("messageCont");	
		abc.appendChild(mesgDiv);
	  var elem = $('#messageCont');
	  elem.scrollTop(elem[0].scrollHeight);
	  
};
function addSystemMessage(message,date,sound){
if(!silent){
	if(sound){
		playSound();
	}
	
	var mesgDiv = document.createElement("a");
	mesgDiv.innerHTML ="<b class='system'>&laquo;"+date+" - System &raquo;:  "+ message+"</b><br />";
	var abc = document.getElementById("messageCont");
	abc.appendChild(mesgDiv);
	var elem = $('#messageCont');
	console.debug("scrolling");
	elem.scrollTop(elem[0].scrollHeight);
	}
};
function dateFormat(){
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	if(h < 10 || 0){
		var strH = '0'+h;
	}else{
		var strH = h;
	}
	if(m < 10 || 0){
		var strM = '0'+m;
	}else{
		var strM = m;
	}
	if(s < 10 || 0){
		var strS = '0'+s;		
	}else{
		strS = s;
	}
	return strH+":"+strM+":"+strS;
	
	
}
var controllPressed = false;
function keyPressed(event){
	if(event.keyCode == 13){
	console.log("send message will start")
		sendMessage();
	}
	if(event.keyCode == 39){
		if(controllPressed){
			if(audioWindow!=null){
				audioWindow.playNext();			
			}
			
		}
	}
	if(event.keyCode == 37){
		if(controllPressed){
			if(audioWindow!=null){
				audioWindow.playPrev();		
			}
		
		}
	}
	if(event.keyCode == 17){
		controllPressed = true;		
	}
	
}
function keyReleased(event){
	if(event.keyCode == 17){
		controllPressed = false;		
	}
	
}	
var socket = null;
var reconnect_atemp = 0;
var allowed_retries = 1;
function init(){
	console.log('Init started');
	console.log(socket);
	socket = io.connect('http://spelltalking-guky.dotcloud.com/',{'force new connection':true,'max reconnection attempts':1,'reconnection limit':500});
	console.log('Socket object');
	
	// on connection to server, ask for user's name with an anonymous callback
	socket.on('connect', function(){
			document.getElementById("userid").innerHTML = userid;	
			//console.debug(userid);	
			//getHistory();
			// call the server-side function 'adduser' and send one parameter (value of prompt)
			socket.emit('adduser', userid);
	});

	// listener, whenever the server emits 'updatechat', this updates the chat body
	socket.on('updatechat', function (username, data, date, color) {
		//$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
		updateChatBox(data,username,date,color);
	});

	// listener, whenever the server emits 'updateusers', this updates the username list
	socket.on('updateusers', function(data) {
		$('#FriendList').empty();
		$.each(data, function(key, value) {
			if(value.id != userid){
			addToFriends(value.id,value.nick,dateFormat(),value.color);
			//$('#users').append('<div>' + value + '</div>');
			}
		});
	});
	socket.on('updateuser', function(type,user) {
		if(type = 'nick'){
			$('#'+user.id).html('<b>'+user.nick+'</b>');
		}
		if(type = 'color'){			
			$('#'+user.id).css("color",user.color);
		}
		
	});
	socket.on('disconnect', function () {
	addSystemMessage("Disconnected",dateFormat(),true);	
	});
	socket.on('error', function () {
	addSystemMessage("Error",dateFormat(),false);
	});
	socket.on('reconnect_failed', function () {
	addSystemMessage("Recconect failed",dateFormat(),false);
	reconnect_atemp = 0;
	clearOldSocket(socket);
	delete socket;
	init();
	}) ;
	socket.on('reconnect', function () {
	addSystemMessage("Recconected",dateFormat(),true);
	});
	socket.on('reconnecting', function () {
	addSystemMessage("Recconecting...",dateFormat(),false);
	});
	//document.getElementById("initLoginBtn").onclick = showLoginPage;
	//document.getElementById("loginBtn").onclick = loginUser;
	console.log(socket);
	console.log('Init end');
	//console.debug("tokenOpen");

}	
function clearOldSocket(socket){
//socket.$events = null;
	/*socket.on('connect',null);
	socket.on('updatechat',null);
	socket.on('updateusers',null);
	socket.on('updateuser',null);
	socket.on('disconnect',null);
	socket.on('error',null);
	socket.on('reconnect_failed',null);
	socket.on('reconnect',null);
	socket.on('reconnecting',null);	*/
}