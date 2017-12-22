'use strict';

setInterval(function() {
    window.Comm.getLocalValue(function(items) {
        var speed = items.speed;
        //console.log("speed: " + speed);
        if (speed > 0) {
            if ($("#onthefly").size() == 0) {
                $("<script>").attr("id", "onthefly").appendTo("body");
            }
            $("#onthefly").html("createjs.Ticker.setFPS(50)");
            $("#onthefly").remove();
        }
    });

}, 1000);

setInterval(function() {
    turnWaitCancel();
}, 10);

function turnWaitCancel() {
    if ("直前のターンを処理中です" == $("#pop div.txt-popup-body").html() &&
        $("#pop div.btn-usual-ok").attr("oshita") == undefined) {
        $("#pop div.btn-usual-ok").attr("oshita", "1");
        tap($("#pop div.btn-usual-ok"));
    }
}

function sleep(delay) {
  return function() {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, delay);
    });
  }
}

window.auto_quest = setInterval(function() {
    window.Comm.getLocalValue(function(items) {
        var in_quest = items["in-quest"];
        var run_quest = items["run-quest"];
        var quest = items["quest"];
        var battle_end = items["battle-end"];

        console.log("in-quest: "+in_quest+" run_quest: "+run_quest);

        if (in_quest > 0 && in_quest >= run_quest && quest!=null && quest.length > 0) {

            if ($(".pop-usual.pop-fail-other.pop-show").length) {
              window.Comm.stopQuest();
            }

            if (in_quest == 1 && run_quest == 0) {
                console.log("quest 1");
                window.Comm.setLocalValue("in-quest", 2, null);
                window.Comm.setLocalValue("run-quest", 1, null);
                window.Comm.setLocalValue('battle-end', 0, null);
                location.href = "http://game.granbluefantasy.jp/#" + quest;
                return;
            }
            if (in_quest == 2 && run_quest == 1) {
                if ($('.cnt-quest').length == 0 || $(".ctn-qust").css("display")=='none') {
                  return;
                }
                console.log("quest 2");

                var summons = $(".btn-supporter.lis-supporter");
                //var selected_support =
                console.log($(".pop-deck.supporter").css("display"));
                if (!$(".pop-deck.supporter").css("display") || $(".pop-deck.supporter").html().length < 10 || $(".pop-deck.supporter").css("display") == 'none') {
                  console.log("select summon");
                  var summon;
                  var i;
                  for (i in summons) {
                    summon = summons[i];
                    //console.log(summon);
                    //console.log(window.Comm.getSummonInfo($(summon)));
                    var res = window.Comm.getSummonInfo($(summon));
                    var name = res[0];
                    var lv = res[1];
                    if (name == "バハムート" || name == "カグヤ" || name == "ホワイトラビット") {
                      console.log("tap summon");
                      tap($(summon));
                      //window.Comm.waitUntil($(".pop-deck.supporter"), 2000);
                      return;
                    };
                  }
                  return;
                }
                var cou = 0;

                window.Comm.setLocalValue("run-quest", 2, null);
                var wait_press_quest_start = function() {
                  new Promise(function(resolve) {
                    console.log("in promise");
                    resolve();
                  }).then(sleep(1000)).then(function() {
                    console.log("wait tapping deck-ok for quest start");
                    cou += 1;
                    if (!$(".pop-deck.supporter").css("display") || $(".pop-deck.supporter").css("display") == 'none') {
                      console.log("not found deck");
                      if (cou < 10) wait_press_quest_start();
                      else {
                        alter("quest cant not start for not found deck!");
                        window.Comm.stopQuest();
                      }
                    } else {
                      cou -= 1;
                      console.log('do next!');
                      //window.Comm.waitUntil($(".btn-usual-ok.se-quest-start"), 2000);
                      if (tap($(".btn-usual-ok.se-quest-start"))) {
                        window.Comm.setLocalValue("in-quest", 3);
                      } else {
                        wait_press_quest_start();
                      }
                    }
                  });
                }
                wait_press_quest_start();

                return;
            }

            if (in_quest == 3 && run_quest <= 3) {
              var url = location.href
              var prefix = window.Comm.getUrlPrefix();

              console.log("in quest 3");
              window.Comm.setLocalValue("run-quest", 3, null);
              console.log("wait for battle start...");

              var pop_show = $(".pop-usual.pop-skip-result.pop-show");
              if (pop_show.length > 0) {
                console.log("skip result");
                tap(pop_show.find(".btn-usual-ok"));
                return;
              }
              if (window.Comm.attackBtnReady()) {
                window.Comm.setLocalValue("in-quest", 4, null);
                return;
              }
              return;
            }

            if (in_quest == 4 && run_quest == 3) {
              console.log(window.Comm.getUrlPrefix());
              var prefix = window.Comm.getUrlPrefix()
              if (prefix.includes("quest")) {
                console.log("set battle end");
                window.Comm.setLocalValue('battle-end', 1, null);
                window.Comm.stopQuest();
                window.Comm.startQuest(quest);
                return;
              }
              if (window.Comm.getUrlPrefix() == '#result/') {
                console.log("battle res");
                if (battle_end == 1) {
                  console.log('retrive');
                  window.Comm.setLocalValue('in-quest', 1, null);
                  window.Comm.setLocalValue('run-quest', 0, null);
                  return
                } else {

                  var expRes = $('.pop-usual.pop-exp.pop-show');
                  if (expRes.length > 0) {
                    console.log("click res ok");
                    tap(expRes.find('.btn-usual-ok'));
                    return;
                  }
                  var friendRequest = $('.pop-usual.friend-request.pop-show');
                  if (friendRequest.length > 0) {
                    console.log("cancle friend request");
                    tap(friendRequest.find(".btn-usual-cancle"));
                    return;
                  }
                  var newItem = $('.pop-usual.pop-newitem.pop-show');
                  if (newItem.length > 0) {
                    console.log("new item!");
                    tap(newItem.find(".btn-usual-ok"));
                    return;
                  }
                  var reward = $('.pop-usual.pop-reward-item.pop-show')
                  if (reward.length > 0) {
                    console.log("reward");
                    tap(reward.find('.btn-usual-ok'));
                    return;
                  }
                  var hellAppearance = $('.pop-usual.pop-hell-appearance')
                  if (hellAppearance.length > 0) {
                    window.Comm.stopQuest();
                    location.href = "http://game.granbluefantasy.jp/#quest/supporter/510051/5";
                    alert("hell appear!");
                    return;
                  }
                  var notifiTitle = $('.pop-usual.pop-notification-title.pop-show');
                  if (notifiTitle.length > 0) {
                    console.log("click title");
                    tap(notifiTitle.find('.btn-usual-ok'));
                    return;
                  }
                  var cntRes = $('.cnt-result');
                  if (cntRes.length > 0) {
                    console.log("return quests");
                    //window.Comm.setLocalValue('battle-end', 1, null);
                    tap(cntRes.find('.btn-control'));
                    return;
                  }
                }
              } else {
                console.log("in battle!");
                battle();
                return;
              }
            }
            return;
          }
      });
  }, 1000);


window.auto_cop = setInterval(function() {
  window.Comm.getLocalValue(function(items){
    //var in_cop = items['in-cop'];
    var run_cop = items['run-cop'];
    var prefix = window.Comm.getUrlPrefix();
    var isOwner = 1

    if (run_cop == 0) {
      console.log('in room waitting to start');
      if (prefix == '#coopraid/room') {
        if (isOwner > 0) {
          var btn_start = $('.btn-quest-start.multi');
          if (btn.length > 0) {
            console.log('tap quest start');
            tap(btn);
            return;
          }
        } else {

        }
      }
      if (prefix = 'raid/') {
        window.Comm.setLocalValue("run-cop", 1);
        return;
      }

    }
  });
}, 1000);





function battle() {
  if (window.Comm.attackBtnReady()) {
    attackStart();
    return true;
  }
  return false;
}

setInterval(function() {
  var conts = location.href.split('/');
  window.Comm.setLocalValue("current-url", conts.slice(3, conts.length).join("/"))
}, 500);

/*setInterval(function() {
  var stage = window.stage;
  console.log("state: "+stage);
  if (stage) {
    var gameStatus = stage.gGameStatus;
    var boss = gameStatus.boss;
    var turn = gameStatus.turn;
    var enemy_num = boss.length;
    var i;
    for (i = 0; i < enemy_num; i++) {
      if (enemy.alive != 1) continue;
      var enemy = boss[i];
      var mode = gameStatus.bossmode.looks.mode[i];
      // mode == 1 normal
      // mode == 2 od
      // mode == 3 break
      var gauge = gameStatus.bossmode.looks.gauge[i];
      // od charge
      var max_hp = enemy.hpmap;
      var hp = enemy.hp;
      var name = enemy.name;
      console.log([name, hp, max_hp, mode, gauge]);
    }
  }
}, 500);*/

function attackStart() {
  tap($(".btn-attack-start"));
}

function tap(sle) {
    var obj = $(sle);
    if ($(sle)[0]) {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('tap', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        $(sle)[0].dispatchEvent(evt);
        return true;
    } else {
      return false;
    }
}

setInterval(function() {
  if ($('.pop-usual.pop-hell-appearance').length > 0) {
    console.log("hell: appear!!!!!!!" );
  }
}, 1000);

/*
setInterval(function() {
  chrome.storage.local.get(null, function(items) {
    var key;
    var keys = Object.keys(items);
    for (key in items) {
      localStorage.setItem(key, items[key]);
    }
  });
}, 1000);

var setValue = function(key, value) {

}
*/
