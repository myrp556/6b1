'use strict';

var Popup = {
	start: function() {
    //this.initSkills();
	console.log("popup: start");
	console.log(window.localStorage);

	var bg = chrome.extension.getBackgroundPage();
	var self = this;
    this.initQuests();
	//this.setCheckboxs(".ck",array);
	$("select").select2({dropdownCssClass: 'dropdown-inverse'});
    $('#timeStart').val(window.localStorage.getItem('timeStart'));
    $('#timeEnd').val(window.localStorage.getItem('timeEnd'));
	$('#block-id').val(window.localStorage.getItem('block-id'));
    $('#blockStart').on('click', function() {
		alert("椿佬的菊花爆破完毕！你可以插入你的URL进行测试。");
		$('#block-id').trigger('change');
		bg.add();
    });
	$('#quest-name').val(window.localStorage.getItem('quest-name'));
	$('#quest-id').val(window.localStorage.getItem('quest-id'));
    $('#start').on('click', function() {

      $('#quest-id').trigger('change');
    });
    $('#stop').on('click', function() {
      $('#quest-id').val('').trigger('change');
    });
	$('#select-id').val(window.localStorage.getItem('select-id'));
    $('#OK').on('click', function() {
      $('#select-id').trigger('change');
    });
	$('#seachEx-1').val(window.localStorage.getItem('seachEx-1'));


	$('input[name="reloadtime"]').val(window.localStorage.getItem('reloadtime'));
	$('#setreloadtime-ok').on('click', function() {
      $('#reloadtime').trigger('change');
    });
	$('#coopreloadtime-ok').on('click', function() {
      $('#coopreloadtime').trigger('change');
    });
    $('input[name="ptcoopraid"]').val([localStorage["ptcoopraid"]]);
	$('input[name="ptcoopraid"]').change(function() {
		localStorage["ptcoopraid"] = $('input[name="ptcoopraid"]:checked').val();
	});

	$('#coopFriSelect').val(window.localStorage.getItem('coopFriSelect')).trigger('change');
	$('#coopSecSelect').val(window.localStorage.getItem('coopSecSelect')).trigger('change');
	$('#coopThrSelect').val(window.localStorage.getItem('coopThrSelect')).trigger('change');

	$('input[name="speed"]').val([localStorage["speed"]]);
	$('input[name="speed"]').change(function() {
		localStorage["speed"] = $('input[name="speed"]:checked').val();
	});

	$('input[name="userAgent"]').val([localStorage["userAgent"]]);
	$('input[name="userAgent"]').change(function() {
		localStorage["userAgent"] = $('input[name="userAgent"]:checked').val();
	});

	$('input[name="ptZokusei"]').val([localStorage["ptZokusei"]]);
	$('input[name="ptZokusei"]').change(function() {
		localStorage["ptZokusei"] = $('input[name="ptZokusei"]:checked').val();
	});
	$('input[name="ptSearchType"]').val([localStorage["ptSearchType"]]);
	$('input[name="ptSearchType"]').change(function() {
		localStorage["ptSearchType"] = $('input[name="ptSearchType"]:checked').val();
	});
	$('#skill-1-1').val(window.localStorage.getItem('skill-1-1'));
	$('#skill-1-2').val(window.localStorage.getItem('skill-1-2'));
	$('#skill-1-3').val(window.localStorage.getItem('skill-1-3'));
	$('#skill-1-4').val(window.localStorage.getItem('skill-1-4'));

	$('#skill-2-1').val(window.localStorage.getItem('skill-2-1'));
	$('#skill-2-2').val(window.localStorage.getItem('skill-2-2'));
	$('#skill-2-3').val(window.localStorage.getItem('skill-2-3'));
	$('#skill-2-4').val(window.localStorage.getItem('skill-2-4'));

	$('#skill-3-1').val(window.localStorage.getItem('skill-3-1'));
	$('#skill-3-2').val(window.localStorage.getItem('skill-3-2'));
	$('#skill-3-3').val(window.localStorage.getItem('skill-3-3'));
	$('#skill-3-4').val(window.localStorage.getItem('skill-3-4'));

	$('#skill-4-1').val(window.localStorage.getItem('skill-4-1'));
	$('#skill-4-2').val(window.localStorage.getItem('skill-4-2'));
	$('#skill-4-3').val(window.localStorage.getItem('skill-4-3'));
	$('#skill-4-4').val(window.localStorage.getItem('skill-4-4'));

	$('#summon-1').val(window.localStorage.getItem('summon-1'));
	$('#summon-2').val(window.localStorage.getItem('summon-2'));
	$('#summon-3').val(window.localStorage.getItem('summon-3'));
	$('#summon-4').val(window.localStorage.getItem('summon-4'));
	$('#summon-5').val(window.localStorage.getItem('summon-5'));
	$('#summon-6').val(window.localStorage.getItem('summon-6'));

	$('#seachTwitter').val(window.localStorage.getItem('seachTwitter'));
	$('#seachEx-1').val(window.localStorage.getItem('seachEx-1'));
	$('#seachEx-2').val(window.localStorage.getItem('seachEx-2'));
	$('#seachEx-3').val(window.localStorage.getItem('seachEx-3'));
	$('#seachEx-4').val(window.localStorage.getItem('seachEx-4'));
	$('#seachEx-5').val(window.localStorage.getItem('seachEx-5'));
	$('#seachEx-6').val(window.localStorage.getItem('seachEx-6'));
	$('#saveList').on('click', function() {
		$("#seachTwitter").trigger('change');
		for(var i=1;i<=6;i++){
			    $("#seachEx-"+i).trigger('change');
	}});
	$('#saveList').on('click', function() {
		for(var i=1;i<=4;i++){
			for(var j=1;j<=4;j++){
			   $("#skill-"+i+"-"+j).trigger('change');
			}}
		for(var i=1;i<=6;i++){
			    $("#summon-"+i).trigger('change');
		}
	});
	$('#tolist').on('click',function(eve) {
		console.log('22333=='+eve)
		self.setDatabase(eve);
    });
	$('#clearlist').on('click',function() {
	//	window.localStorage.setItem('getMissonStart','stop');
		window.localStorage.setItem('misson-database','{}');
		window.localStorage.setItem('quest-database','{}');
		self.initQuests();
		console.log('clear-ok')
    });
    $('form').on('click', '[data-quest-id]', function() {
      $('#quest-id').val($(this)[0].dataset.questId).trigger('change');
    });
    $('form').on('change', 'input[type=checkbox]', function() {
      console.log($(this).attr('name'), $(this).is(":checked"));
      window.localStorage.setItem($(this).attr('name'), $(this).is(":checked"));
    });
	$('form').on('switchChange.bootstrapSwitch', 'input[type=checkbox]', function(e,data) {
	  console.log($(this).attr('name'),data);
      window.localStorage.setItem($(this).attr('name'), data);
    });
    $('form').on('change', 'input[type=text]', function() {
      console.log($(this).attr('name'), $(this).val());
      window.localStorage.setItem($(this).attr('name'), $(this).val());
    });
	$('form').on('change', 'select', function() {
      console.log($(this).attr('name'), $(this).val());
      window.localStorage.setItem($(this).attr('name'), $(this).val());
    });
    $('form input[type=checkbox]').each(function() {
      if (window.localStorage.getItem($(this).attr('name')) === 'true') {
		console.log($(this).attr('name'));
        $(this).bootstrapSwitch('state', true);
      }
    });/*
	$("btnsub").on('click', function() {
        var newResult=[];
        jQuery("input[type=checkbox][name=checkbox]").each(function(index){
			jQuery(this).trigger('change');
            if(jQuery(this).attr("checked")=="checked")
                newResult[index]= 1;
            else
                newResult[index]= 0;
        });

		window.localStorage["result"]= newResult.toString();
	});	*/
},
/*
   setCheckboxs: function(CKname,array) {
    $(CKname).each(function (index, ele) {
        if (array[index] == "1") {
            $(ele).attr("checked", true);
        }
        else {
            $(ele).attr("checked", false);
        }
        $(ele).click(function () {
            if ($(ele).attr("checked") == "checked") {
                $(ele).attr("checked", false);
            }
            else {
                $(ele).attr("checked", true);
            }
        });
    });
  },*/
 initMission: function() {
	var d = setInterval(function(){
			console.log('initMission')
			console.log('quest-id==='+$('#quest-id').value )
			if(window.localStorage.getItem('getMissonStart')=='start'){
				console.log('getMissonStart = start')
				var url = window.localStorage.getItem('MissonCall')
				if($('#quest-id').value == undefined){
					$('#stop').click;
					$('#quest-id').value = url;
					$('#start').click;
				}
			}
	} ,1000);
  },
  initQuests: function() {
	$('#misson-list').empty();
	var arr = ['btn-primary','btn-info','btn-danger','btn-success','btn-warning','btn-inverse'];
	var misson = window.localStorage.getItem('misson-database');
	if(!misson){
		return;
	}
	misson = jQuery.parseJSON(misson);
	for (var id in misson) {
      if (misson[id].hash) {
		var index = Math.floor((Math.random()*arr.length));
        $('#misson-list').append('<button class="btn '+arr[index]+' btn-sx active" style="width: 360px;" data-misson-id="'+misson[id].hash+'" data-misson-start = "'+misson[id].start+'" data-misson-end = "'+misson[id].end+'" >'+(misson[id].questName || misson[id].hash)+'|start:'+misson[id].start+'|end=:'+misson[id].end+'</button')
      }
    }
  },
   sendCommand: function(command, callback) {
		chrome.extension.sendRequest(command, callback ||
		function() {});
	},
  setDatabase: function(eve) {
			var target = '';
			target =eve.target;
			var timeStart = window.localStorage.getItem('timeStart');
			var timeEnd = window.localStorage.getItem('timeEnd');
			var mission = {};
			mission.questId =  window.localStorage.getItem('quest-id');
			mission.hash = window.localStorage.getItem('quest-id');
			mission.start = window.localStorage.getItem('timeStart');
			mission.end = window.localStorage.getItem('timeEnd');
			mission.questName = window.localStorage.getItem('quest-name');
			//if(questId==''){return}
			var currentDatabase = window.localStorage.getItem('misson-database');
			if (currentDatabase== undefined||currentDatabase=='') {
				console.log("currentDatabase=false")
				currentDatabase = {};
			} else {
				currentDatabase = jQuery.parseJSON(currentDatabase);
			}
			currentDatabase[mission.questName] = currentDatabase[mission.questName] || {};
			for (var key in mission) {
				if (mission[key]) {
					currentDatabase[mission.questName][key] = mission[key];
				}
			}
			window.localStorage.setItem('misson-database', JSON.stringify(currentDatabase));
			this.sendCommand({
				type: 'localStorage',
				data: window.localStorage
			})
			this.initQuests();
  },
	showFirst:function (){
		var manifest=chrome.runtime.getManifest();
		var html="<h4>" + manifest.name + " - " + manifest.version + "</h4><hr/>";

		html+='<div class="logon"><label for="lbl" style="color: #ff0000;position: relative;" id="info"></label><div class="col-lg-12" name="lbl"><div class="input-group"><span class="input-group-addon" >密码</span><input class="form-control" type="text" name="logon-pwd" value="" id="logon-pwd" class="txt_h txt_h_30" placeholder="此处输入密码" />'+
		'<span class="input-group-btn">'+
									'<button type="submit" class="btn btn-primary btn-sx active" id="logon-ok">确定</button> '+
								'</span>	'+
		'</div><!-- /input-group --></div>'+
		'</div><!-- /.col-lg-6-6 --><br>';

		console.log("showfirst");
		var app=this;
		$("div.tab").hide();
		$("div#lg").show();
		$("div#lg").html(html);

		$("form").submit(function(){
			$("#info").text("");
			if($("#logon-pwd").val().length==0)
				return false;
			/*$.ajax({type: 'POST',
				data: $(this).serialize() + '&f=1',
				url: 'http://site.byseh.com:81/gmerbt/lg',
				success: function (d) {
					console.log("popup: showfirst :: success-response: "+d);
					try
					{
					var o=JSON.parse(d);
					// hack...
					o.code = 0;
					o.id = 1;
					console.log("data=" + o);
					if(o.code==0){
						chrome.extension.sendRequest({type: 'checkSess', data: o.id},
						function(o){
							try {
							var d=JSON.parse(o);
							if(0==d.code){
								app.main();
							} else {
								app.showFirst();
							} } catch(e){
								app.showFirst();
							}
						});
					} else {
						$("#info").text("登录失败！");
					}
				}	catch(e){
					console.log(e);
					$("#info").text("登录失败！");
				}
				},
				error: function (xhr) {
					$("#info").text("系统发生错误,请稍后再试！");
				}
			});*/
			app.main();
			window.localStorage.setItem('sess-id',0);
			return false;
		});
	},
	init:function(){
		var app=this;
		var sessId=window.localStorage.getItem('sess-id');
		console.log("init!!!!");
		//app.main();
		if(!sessId){
			this.showFirst();
		} else {
			/*
			try
					{
			this.sendCommand({type: 'checkSess', data: sessId},
				function(o){
					try{
					var d=JSON.parse(o);
					if(0==d.code){
						app.main();
					} else {
						app.showFirst();
					} } catch(e){
						app.showFirst();
					}
				});
				} catch(e){
						app.showFirst();
					}
					*/
				app.main();
		}

	},
	main:function(){
		$("div#lg").hide();
		$("div.tab").show();
		this.start();
	}
};
document.addEventListener('DOMContentLoaded', function () {
	var bg = chrome.extension.getBackgroundPage();
	console.log(bg.bg_ground);
	console.log("document loaded!");
  Popup.init();
});
