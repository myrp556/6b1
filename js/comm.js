'use strict';

window.Comm = {
  'setLocalValue': function(key, value, callback) {
    var dic = {};
    dic[key] = value;
    chrome.storage.local.set(dic, callback);
  },

  'getLocalValue': function(callback) {
    chrome.storage.local.get(null, function(items) {
      if (callback != null) callback(items);
    });
  },

  'waitUntil': function(sel, lim) {
    var cou = 0;
    var step = 500;
    while (cou <= lim) {
      if ($(sel) && $(sel).css("display") != 'none') {
        console.log("appear");
        return;
      }
      sleep(step);
      cou += step;
    }
  },

  'getUrlPrefix': function() {
    var url = location.href;
    var conts = url.split('/');
    var prefix = conts[3];
    var sub = '';
    var re = /[\d]+/;
    if (conts.length > 4 && !re.test(conts[4])) {
      sub = conts[4];
    }
    return prefix+'/'+sub;
  },

  'startQuest': function(quest) {
    console.log("start quest " + quest);
    this.setLocalValue('in-quest', 1, null);
    this.setLocalValue('run-quest', 0, null);
    this.setLocalValue('battle-end', 0, null);
    //this.setLocalValue('quest', quest);

  },

  'abilityListReady_dot': function(l) {
    var flag = 0;
    var i;
    for (i in l) {
      var btn = this.getCharaAblilityBtn_dot(l[i]);
      if (btn == null) return false;
    }
    return true;
  },

  'getCharaAblilityBtn_dot': function(s) {
    var conts = s.split('.');
    if (conts.length < 2) return null;
    var c = s.split('.')[0];
    var a = s.split('.')[1];
    return this.getCharaAblilityBtn(c, a);
  },

  'getCharaAblilityBtn': function(chara, num) {
    var btn = $(".ability-character-num-"+chara+"-"+num);
    if (btn.length > 0) {
      var par = btn.parent();
      if (par.hasClass('btn-ability-unavailable') || par.hasClass('btn-ability-disable')) return null;
      return par;
    }
    return null;
  },

  'stopQuest': function() {
    console.log("stop quest");
    window.Comm.setLocalValue("in-quest", 0, null);
    window.Comm.setLocalValue("run-quest", 0, null);

  },

  'startCop': function() {
    console.log("start cop");
    this.setLocalValue('in-cop', 1, null);
    this.setLocalValue('run-cop', 0, null);
  },

  'stopCop': function() {
    console.log("stop cop");
    this.setLocalValue("in-cop", 0, null);
    this.setLocalValue("run-cop", 0, null);
  },

  'attackBtnReady': function() {
    return $(".btn-attack-start").length > 0 && $(".btn-attack-start").css("display") && $(".btn-attack-start").css("display")!='none' && $('.btn-attack-start').hasClass("display-on");
  },

  'abilityRailIsClear': function() {
    var rail = $('.prt-ability-rail-overlayer');
    if (rail.length == 0 || rail.hasClass('hide')) return true;
    return false;
  },

  'getSummonInfo': function(sel) {
    var summon = $(sel).find(".prt-supporter-summon");
    if (summon.length == 0) return null;
    var lv = parseInt(summon.find(".txt-summon-level").html().split(" ")[1].trim());
    var name = summon.html().split("</span> ")[1].trim();
    return [name, lv];
  },

  'tap': function(sle) {
    var obj = $(sle);
    if ($(sle)[0]) {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('tap', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        $(sle)[0].dispatchEvent(evt);
        return true;
    } else {
      return false;
    }
  },

  'selectSummon': function(summons, prefer_list) {
    //console.log("select in " + summons.length);
    //console.log(summons);
    prefer_list = ["ホワイトラビット", "カグヤ", "バハムート"];
    var i, j;
    var target = null;
    var lv = 0;
    var summon, summon_name, summon_lv, res;
    for (i in prefer_list) {
      var prefer = prefer_list[i];
      for (j in summons) {
        summon = summons[j];
        //console.log(summon);
        if (!summon || summon.length == 0 || typeof(summon) != 'object') continue;
        res = window.Comm.getSummonInfo($(summon));
        if (res == null || res.length<2) continue;
        summon_name = res[0];
        summon_lv = res[1];
        //console.log(summon_name + " " + summon_lv);
        if (summon_name == prefer) {
          if (summon_lv > lv) {
            lv = summon_lv;
            target = summon;
          }
        }
      }
      if (target && target != null) {
        return target;
      }
    }
    return summons[0];
  },

  'handle_battle_result': function() {
    var expRes = $('.pop-usual.pop-exp.pop-show');
    if (expRes.length > 0) {
      console.log("click res ok");
      tap(expRes.find('.btn-usual-ok'));
      return true;
    }
    var friendRequest = $('.pop-usual.pop-friend-request.pop-show');
    if (friendRequest.length > 0) {
      console.log("cancel friend request");
      tap(friendRequest.find(".btn-usual-cancel"));
      return true;
    }
    var newItem = $('.pop-usual.pop-newitem.pop-show');
    if (newItem.length > 0) {
      console.log("new item!");
      tap(newItem.find(".btn-usual-ok"));
      return true;
    }
    var reward = $('.pop-usual.pop-reward-item.pop-show')
    if (reward.length > 0) {
      console.log("reward");
      tap(reward.find('.btn-usual-ok'));
      return true;
    }
    var abilityItem = $('.pop-usual.pop-get-abilityitem.pop-show');
    if (abilityItem.length > 0) {
      console.log("ability item");
      tap(abilityItem.find('.btn-usual-ok'));
      return true;
    }
    var notifiTitle = $('.pop-usual.pop-notification-title.pop-show');
    if (notifiTitle.length > 0) {
      console.log("click title");
      tap(notifiTitle.find('.btn-usual-close'));
      return true;
    }

    var mission = $(".pop-usual.pop-mission-check.pop-show");
    if (mission.length > 0) {
      console.log("top mission");
      tap(mission.find(".btn-usual-close"));
      return true;
    }
    return false;
  }
}
