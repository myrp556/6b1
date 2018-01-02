function ban(){
  console.log("run ban");
	var arr = new Array();
	if(window.localStorage.getItem('block-id')=="" || !window.localStorage.getItem('block-id')) {
		arr.push("gbf.game.mbga.jp/ob","game.granbluefantasy.jp/ob","gbf.game.mbga.jp/gc","game.granbluefantasy.jp/gc")
	}else{
		arr=  window.localStorage.getItem('block-id').split(",");
		arr.push("gbf.game.mbga.jp/ob","game.granbluefantasy.jp/ob","gbf.game.mbga.jp/gc","game.granbluefantasy.jp/gc")
	}
	for(i in arr){
		arr[i]="*://"+arr[i]+"*";
	}
  console.log("ban: "+arr);
	chrome.webRequest.onBeforeRequest.addListener(
	  function(details) {
		console.log(window.localStorage.getItem('block-id'))
		console.log("will block your url :"+details.url);
		//console.log(document.cookie);
		//return {redirectUrl: "http://139.196.233.143:9001/getObInfo"};
    return {redirectUrl: "http://124.193.235.253/gmerbt/getObInfo"};
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
	  //{urls:  ["*://139.196.233.143/*"]},
    {urls:  ["*://124.193.235.253/*"]},
	  ["blocking", "requestHeaders"]);

    return "yes yes yes";
}

function run() {
    console.log("run");
}

ban();
