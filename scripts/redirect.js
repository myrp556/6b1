if(!window.localStorage.getItem('block-id')||window.localStorage.getItem('block-id')==undefined){
	window.localStorage.setItem('block-id',"gbf.game.mbga.jp/ob,game.granbluefantasy.jp/ob,gbf.game.mbga.jp/gc,game.granbluefantasy.jp/gc")
}

function add(){
	var arr = new Array();
	if(window.localStorage.getItem('block-id')==""){
		arr.push("gbf.game.mbga.jp/ob","game.granbluefantasy.jp/ob","gbf.game.mbga.jp/gc","game.granbluefantasy.jp/gc")
	}else{
		arr=  window.localStorage.getItem('block-id').split(",");
		arr.push("gbf.game.mbga.jp/ob","game.granbluefantasy.jp/ob","gbf.game.mbga.jp/gc","game.granbluefantasy.jp/gc")
	}
	for(i in arr){
		arr[i]="*://"+arr[i]+"*";
	}
	chrome.webRequest.onBeforeRequest.addListener(
	  function(details) {
		console.log(window.localStorage.getItem('block-id'))
		console.log("will block your url :"+details.url);	
		//console.log(document.cookie);
		return {redirectUrl: "http://139.196.233.143:9001/getObInfo"};
	  },
	  {urls: arr},
	  ["blocking"]);
	
	chrome.webRequest.onBeforeSendHeaders.addListener(
	  function(details) {
		 var len = details.requestHeaders.length;
		// var c =new Object();
		// c = {name:"Cookie",value:localStorage.getItem('RegExp')}
		 details.requestHeaders.push()
		 details.requestHeaders[len]=new Object();
		 details.requestHeaders[len]= {name:"Cookie",value:localStorage.getItem('RegExp')}
		//details.requestHeaders[len].name = 'Cookie';
		//details.requestHeaders[len].vale = localStorage.getItem('RegExp');
		//console.log(details.requestHeaders[len].value);	
		return { requestHeaders: details.requestHeaders };
	  },
	  {urls:  ["*://139.196.233.143/*"]},
	  ["blocking", "requestHeaders"]);
	

	  
}	  

function changeUesrAgent(){
	var IOS_APP="Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13F69"
	var IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1"
	var CHROMEAPP="Mozilla/5.0 (Linux; U; Android 2.3.4; ja-jp; SBM003SH Build/S4040) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1; ChromeApp"
	chrome.webRequest.onBeforeSendHeaders.addListener(
	  function(details) {
					
					var uA;
					if(localStorage["userAgent"]=="0"){
						return { requestHeaders: details.requestHeaders};
					}	
					if(localStorage["userAgent"]=="1") uA=IOS
					if(localStorage["userAgent"]=="2") uA=IOS_APP
					if(localStorage["userAgent"]=="3") uA=CHROMEAPP
                    for (var i = 0; i < details.requestHeaders.length; ++i) {
                        if (details.requestHeaders[i].name === 'User-Agent') {
                            details.requestHeaders[i].value = uA;
                        }
                    }
                    return { requestHeaders: details.requestHeaders };
	  },
	  {urls:  ["<all_urls>"]},
	  ["blocking", "requestHeaders"]);
	  
	chrome.webRequest.onBeforeSendHeaders.addListener(
	  function(details) {
		 var len = details.requestHeaders.length-1;
		 localStorage.setItem('RegExp',details.requestHeaders[len].value)
		 return;
	  },
	  {urls:  ["*://gbf.game.mbga.jp/*","*://game.granbluefantasy.jp/*"]},
	  ["blocking", "requestHeaders"]);  
	  
}	 

add();
changeUesrAgent();