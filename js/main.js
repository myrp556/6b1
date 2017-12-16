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

setInterval(function() {
    window.Comm.getLocalValue(function(items) {
        var in_quest = items["in-quest"];
        var run_quest = items["run-quest"];
        var quest = items["quest"];


        console.log("in-quest: "+in_quest+" run_quest: "+run_quest);

        if (in_quest > 0 && in_quest >= run_quest && quest!=null && quest.length > 0) {

            if ($(".pop-usual.pop-fail-other.pop-show").length) {
              window.Comm.stopQuest();
            }

            if (in_quest == 1 && run_quest == 0) {
                console.log("quest 1");
                window.Comm.setLocalValue("in-quest", 2, null);
                window.Comm.setLocalValue("run-quest", 1, null);
                location.href = "http://game.granbluefantasy.jp/#" + quest;
                return;
            }
            if (in_quest == 2 && run_quest == 1) {
                if ($('.cnt-quest').length == 0 || $(".ctn-qust").css("display")=='none') {
                  return;
                }
                console.log("quest 2");
                window.Comm.setLocalValue("run-quest", 2, null);

                var summons = $(".btn-supporter.lis-supporter");
                console.log("summon: " + $(".btn-supporter.lis-supporter").length);
                console.log("check: " + $(".pop-deck.supporter") + " " + $(".pop-deck.supporter").css("display"));
                //var selected_support =

                if ($(".pop-deck.supporter").css("display") == 'none') {
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
                      tap($(summon));
                      //window.Comm.waitUntil($(".pop-deck.supporter"), 2000);
                      break;
                    };
                  }
                }
                var cou = 0;

                var wait_press_quest_start = function() {
                  new Promise(function(resolve) {
                    console.log("in promise");
                    resolve();
                  }).then(sleep(1000)).then(function() {
                    console.log("wait tapping deck-ok for quest start");
                    cou += 1;
                    if ($(".pop-deck.supporter").css("display") == 'none') {
                      console.log("not found deck");
                      if (cou < 5) wait_press_quest_start();
                      else {
                        alter("quest cant not start for not found deck!");
                        window.Comm.stopQuest();
                      }
                    } else {
                      console.log('do next!');
                      //window.Comm.waitUntil($(".btn-usual-ok.se-quest-start"), 2000);
                      window.Comm.setLocalValue("in-quest", 3);
                      tap($(".btn-usual-ok.se-quest-start"));
                    }
                  });
                }
                wait_press_quest_start();

                return;
            }

            console.log("....");
            if (in_quest == 3 && run_quest <= 3) {
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

            if (window.location.href.includes("result")) {
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
              var cntRes = $('.cnt-result');
              if (cntRes.length > 0) {
                console.log("return quests");
                tap(cntRes.find('.btn-control.longname'));
                return;
              }
              var hellAppearance = $('.pop-usual.pop-hell-appearance')
              if (hellAppearance.length > 0) {
                alter("hell appear!");
                window.Comm.stopQuest();
                return;
              }
              var notifiTitle = $('.pop-usual.pop-notification-title.pop-show');
              if (notifiTitle.length > 0) {
                console.log("click title");
                tap(notifiTitle.find('.btn-usual-ok'));
                return;
              }

              console.log("retrive");
              window.Comm.setLocalValue("in-quest", 1, null);
              window.Comm.setLocalValue("run-quest", 0, null);

              return;
            }

            if (in_quest == 4 && run_quest == 3) {
              console.log("in battle!");

              if (battle()) return;

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

function attackStart() {
  tap($(".btn-attack-start"));
}

function tap(sle) {
    var obj = $(sle);
    if ($(sle)[0]) {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('tap', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        $(sle)[0].dispatchEvent(evt);
    } else {
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
