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
        var prefix = window.Comm.getUrlPrefix();
        var check_hell = items['check-hell'];
        var quest_list = items['quest-list'];

        if (in_quest > 0) {
          console.log("in-quest: "+in_quest+" run_quest: "+run_quest);
        }

        if (in_quest > 0 && in_quest >= run_quest && quest!=null && quest.length > 0) {

            if ($(".pop-usual.pop-fail-other.pop-show").length) {
              window.Comm.stopQuest();
            }

            if (in_quest == 1 && run_quest == 0) {
                console.log("quest 1");
                window.Comm.setLocalValue("in-quest", 2, null);
                window.Comm.setLocalValue("run-quest", 1, null);
                window.Comm.setLocalValue('battle-end', 0, null);
                location.href = "http://game.granbluefantasy.jp/" + quest;
                return;
            }
            if (in_quest == 2 && run_quest == 1) {
                if ($('.pop-usual.common-pop-error.pop-show').length > 0) {
                  if (quest_list && quest_list.length > 0) {
                    if (window.Quest.enter_next_quest()) {
                      return;
                    }
                  }
                }

                if ($('.cnt-quest').length == 0 || $(".ctn-qust").css("display")=='none') {
                  return;
                }
                console.log("quest 2");

                var summons = $(".btn-supporter.lis-supporter");
                //var selected_support =
                console.log($(".pop-deck.supporter").css("display"));
                if (!$(".pop-deck.supporter").css("display") || $(".pop-deck.supporter").html().length < 10 || $(".pop-deck.supporter").css("display") == 'none') {
                  console.log("select summon");
                  /*
                  var summon;
                  var i;
                  for (i in summons) {
                    summon = summons[i];
                    //console.log(summon);
                    //console.log(window.Comm.getSummonInfo($(summon)));
                    var res = window.Comm.getSummonInfo($(summon));
                    var name = res[0];
                    var lv = res[1];
                    if (name == "ホワイトラビット" || name == "バハムート" || name == "カグヤ") {
                      console.log("tap summon");
                      tap($(summon));
                      //window.Comm.waitUntil($(".pop-deck.supporter"), 2000);
                      return;
                    };
                  }
                  */
                  tap($(window.Comm.selectSummon(summons, [])));
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
                        window.Comm.setLocalValue("in-quest", 3, null);
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

              console.log("in quest 3");
              window.Comm.setLocalValue("run-quest", 3, null);
              console.log("wait for battle start...");

              if ($('.pop-usual.common-pop-error.pop-show').length > 0) {
                if (quest_list && quest_list.length > 0) {
                  if (window.Quest.enter_next_quest()) return;
                }
              }

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
              if (prefix.includes("quest")) {
                console.log("set battle end");
                window.Comm.setLocalValue('battle-end', 1, null);
                window.Comm.stopQuest();
                window.Comm.startQuest(quest);
                return;
              }
              if (window.Comm.getUrlPrefix().includes('result')) {
                console.log("battle res");
                if (!check_hell) {
                  window.Comm.setLocalValue('battle-end', 1, null);
                  window.Comm.stopQuest();
                  window.Comm.startQuest(quest);
                  return;
                }

                if (window.Comm.handle_battle_result()) return;

                var hellAppearance = $('.pop-usual.pop-hell-appearance')
                if (hellAppearance.length > 0) {
                  window.Comm.stopQuest();
                  location.href = "http://game.granbluefantasy.jp/#quest/supporter/510051/5";
                  alert("hell appear!");
                  return;
                }
                var cntRes = $('.cnt-result');
                if (cntRes.length > 0) {
                  console.log("return quests");
                  //window.Comm.setLocalValue('battle-end', 1, null);
                  tap(cntRes.find('.btn-control'));
                  return;
                }
              } else {
                console.log("in battle!");
                //battle(prefix);
                window.Battle.battle_step_forward();
                return;
              }
            }
            return;
          }
      });
  }, 500);


window.auto_cop = setInterval(function() {
  window.Comm.getLocalValue(function(items){
    var in_cop = items['in-cop'];
    var run_cop = items['run-cop'];
    var prefix = window.Comm.getUrlPrefix();
    // 0 single, 1 owner, 2 member
    var cop_option = items['cop-option'];
    var cop_cou = items['cop-cou'];
    if (!cop_cou) cop_cou = 0;
    if (in_cop > 0) {
      console.log(cop_option + " in-cop: "+in_cop+" run-cop: "+run_cop);
    }

    if (in_cop == 1 && run_cop == 0) {
      console.log('in room waitting to start');
      if (prefix.includes('raid_multi')) {
        console.log("into raid multi");
        window.Comm.setLocalValue('in-cop', 2, null);
        window.Comm.setLocalValue('run-cop', 1, null);
        return;
      }
      if (prefix == '#coopraid/room') {
        if (cop_option < 2) {
          var btn_start = $('.btn-quest-start.multi');
          if (btn_start.length > 0 && !btn_start.hasClass('disable')) {
            console.log('tap cop start');
            window.Comm.setLocalValue('run-cop', 1, null);
            tap(btn_start);
            return;
          }else {
            console.log("owner waitting");
          }
        } else {
            var btn_retract = $('.btn-retraction-ready');
            if (btn_retract.length > 0) {
              window.Comm.setLocalValue('run-cop', 1, null);
            }
            var btn_ready = $('.btn-execute-ready.se-ok');
            if (btn_ready.length > 0 && !btn_ready.hasClass('disable')) {
              console.log('tap cop ready');
              window.Comm.setLocalValue('run-cop', 1, null);
              tap(btn_ready);
              return;
            } else {
               console.log("member waitting");
            }
        }
        cop_cou += 1;
        if (cop_cou >= 15) {
          window.Comm.setLocalValue('cop-cou', 0);
          location.reload();
        } else {
          window.Comm.setLocalValue('cop-cou', cop_cou);
        }
      }
    }
    if (in_cop == 1 && run_cop == 1) {
      if (prefix == '#raid_multi/') {
        window.Comm.setLocalValue("in-cop", 2, null);
        return;
      }
      var stamina = $('.pop-usual.pop-stamina.pop-show')
      if (stamina.length > 0) {
        alert("no ap enough!");
        window.Comm.stopCop();
        return;
      }
    }

    if (in_cop == 2 && run_cop == 1) {
      if (prefix.includes('quest') || prefix.includes("main")) {
        location.href = "http://game.granbluefantasy.jp/#coopraid";
        return;
      }
      if (prefix.includes('raid_multi')) {
        console.log("in battle");
        //battle(prefix);
        window.Battle.battle_step_forward();
      } else {
        console.log("enter multi raid res");
        window.Comm.setLocalValue("in-cop", 3, null);
      }
      return;
    }

    if (in_cop == 3) {
      if (prefix == '#coopraid/room') {
        console.log("back to start");
        window.Comm.setLocalValue("in-cop", 1, null);
        window.Comm.setLocalValue('run-cop', 0, null);
        return;
      }
      if (prefix.includes("result_multi")) {
        console.log("multi res");

        if (window.Comm.handle_battle_result()) return;
        if ($(".btn-control").length > 0) {
          console.log("back to room");
          tap($(".btn-control"));
          return;
        }
      }
    }
  });
}, 500);

window.auto_battle = setInterval(function() {
  window.Comm.getLocalValue(function(items) {
      var auto_battle = items['auto-battle'];
      var prefix = window.Comm.getUrlPrefix();
      if (auto_battle > 0) {
        if (prefix.includes('raid_multi') || prefix.includes('raid')) {
          window.Battle.battle_step_forward();
        } else {
          window.Comm.setLocalValue('auto-battle', 0);
        }
      }
  });
}, 500);


setInterval(function() {
  var conts = location.href.split('/');
  //console.log(conts.slice(3, conts.length).join("/"));
  window.Comm.setLocalValue("current-url", conts.slice(3, conts.length).join("/"), null)
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

$(document).keypress(function(e) {
    window.Comm.getLocalValue(function(items) {
      var last_key = items['last-key'];
      var key = e.which;
      console.log(key);
      window.Comm.setLocalValue('last-key', key, null);
      if (key == 116) {
        attackStart();
      }
      if (key == 122) {
        tap($('.btn-auto'));
      }
      if (key == 112 && last_key == 112) {
        // p
          location.href = "http://game.granbluefantasy.jp/#mypage";
      }
      if (key == 117 && last_key == 117) {
        // u
          location.href = "http://game.granbluefantasy.jp/#quest/extra";
      }
      if (key == 105 && last_key == 105) {
        // i
        if (location.href != "http://game.granbluefantasy.jp/#coopraid/offer/null/0/1") {
          location.href = "http://game.granbluefantasy.jp/#coopraid/offer/null/0/1";
        } else {
          tap($('.btn-refresh-list'));
        }
      }
      if (key == 121 && last_key == 121) {
        // y
        location.reload();
      }
    });
});
var attack_btn_is_set_callback = 0;
var on_attack_btn_click = function() {
    console.log('attack click');
    //attack_btn_is_set_callback = 0;
    window.Comm.getLocalValue(function(items) {
      var stuck_refresh = items['stuck-refresh'];
      if (stuck_refresh && $('.btn-attack-start').hasClass('display-on')) {
        location.reload();
      } else {
        //$('.btn-attack-start').one('click', on_attack_btn_click);
        //attack_btn_is_set_callback = 1;
      }
    });
}
var prefix = window.Comm.getUrlPrefix()
if (prefix == '#raid_multi/' || prefix == '#raid/') {
  var timer_attack_btn = setInterval(function() {
    //console.log("find attack button");
      if (attack_btn_is_set_callback == 0 && $('.btn-attack-start').length>0) {
        //console.log("attack button find");
        clearInterval(timer_attack_btn);
        $('.btn-attack-start').bind('tap', on_attack_btn_click);
        $('.btn-attack-start').bind('click', on_attack_btn_click);
        attack_btn_is_set_callback = 1;
      }
  }, 200);
}
