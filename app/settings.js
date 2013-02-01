var audioWindow = null;
commandParser = function(command){
	
	var cmd = command.substring(1);
	cmd = cmd.split(" ");	
	if(cmd.length > 1 || cmd[0]=="audio" || cmd[0]=="img"){
		
	switch(cmd[0]){
	case 'set':
		switch(cmd[1]){
		case 'nick': 
			var regexp = /\W+/;		
			//alert(cmd[2].replace(regexp,'E'));
			
			if(cmd[2].search(regexp) == -1){
				setNickName(cmd[2]);
			}else{ 
				addSystemMessage("Unsuported chars in nick name(only letters and numbers)",dateFormat());
			}
			break;
		case 'color': 
			var regexp = /^#[A-F0-9]{6}/;		
			//alert(cmd[2].replace(regexp,'E'));
			//alert(cmd[2].search(regexp));
			if(cmd[2].search(regexp) == 0){
				//alert(cmd[2])
				setColorName(cmd[2].substring(1));
			}else{ 
				addSystemMessage("Invalid color",dateFormat());
			}
			break;	
		case 'volume': 
			if(parseFloat(cmd[2]) >= 0 && parseFloat(cmd[2]) <= 1){
				setCookie("volume",volume,parseFloat(cmd[2])*100);
				volume = parseFloat(cmd[2])*100;				
				addSystemMessage("Volume changed to "+volume,dateFormat());
			}else{ 
				addSystemMessage("Invalid volume",dateFormat());
			}
			break;	
		case 'silent':
			if(cmd[2] == 'true'){
				silent = true;				
			}
			else if(cmd[2] == 'false'){
				silent = false;				
			}else{
			addSystemMessage("Unknow argument for silent: "+cmd[1],dateFormat());
			}
			
		break;
		default: addSystemMessage("Unknow argument: "+cmd[1],dateFormat()); break;	
		}
		break;	
	case 'audio':
		console.debug("audio");
		
		switch(cmd[1]){
		case 'next':
			if(audioWindow!=null){
				audioWindow.playNext();				
			}
			
			break;
		case 'hide': 
			if(audioWindow!=null){				
				var abc = audioWindow.document.getElementById("AudioPlayer");
				abc.style.visibility ='hidden'
			}
			break;	
		case 'show': 
			//var abc = document.getElementById("AudioPlayer");
			//abc.style.visibility ='visible';
			
			audioWindow = window.open("http://spelltalking-guky.dotcloud.com/audio",'Music',
						   'width=501,height=275,menubar=no,status=no,location=no,toolbar=no,scrollbars=no');
			break;	
		case 'prev': 
			if(audioWindow!=null){
				audioWindow.playPrev();				
			}			
			break;	
		case 'play': 
			if(audioWindow!=null){
				audioWindow.play();				
			}			
			break;	
//		case 'drop':
//		var script = document.createElement("script"); 
//		script.src="http://gravityscript.googlecode.com/svn/trunk/gravityscript.js"; 
//		document.getElementById('AudioPlayer').appendChild(script);void(0);break;
		}
		break;
	case 'img':
		console.debug("img");
		document.getElementById("messageBox").value = "<img src='"+cmd[1]+"' style='width:"+cmd[2]+";height:"+cmd[3]+"'/>";		
		sendMessage();
		
		break;	
	default:addSystemMessage("Unknow command: "+cmd[0],dateFormat());	break;
	}
	}else{
		addSystemMessage("Wrong command format missing arguments",dateFormat());
	}
};
setNickName = function(nickName){
	if(socket != null){
		socket.emit('setnick', nickName);	
	}
}
setColorName = function(color){
	if(socket != null){
		socket.emit('setcolor', color);	
	}
}
$(document).ready(function(){
	console.debug('click handler');
//	  $("#messageCont").click(function(event){
//		  
//		  console.debug(event.target.nodeName);
//		  if(event.target.nodeName == 'IMG'){
//			  console.debug(event.target.width);
//			  console.debug(event.target.height);
//		  if(event.target.height > 300 || event.target.width > 300){
//			  console.debug((event.target.height*0.5));
//			  console.debug((event.target.width*0.5));
//			  event.target.height = (event.target.height*0.5);
//			  event.target.width = (event.target.width*0.5);
//		  }else{
//			  console.debug((event.target.height*0.5));
//			  console.debug((event.target.width*0.5));
//			  event.target.height =  (event.target.height*1.5);
//			  event.target.width =  (event.target.width*1.5) ;
//		  }
//		
//		  }
//	  });
	  
	
});
function getCookie(c_name)
		{
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		  {
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
			{
			return unescape(y);
			}
		  }
		}

		function setCookie(c_name,value,exdays)
		{
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
		}

		function isCookieSet(name)
		{
		var cookie=getCookie(name);
		if (cookie!=null && cookie!="")
		  {
			return true;
		  }
		else 
		  {
			return false;
		  }
		}