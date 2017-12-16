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

  'startQuest': function(quest) {
    console.log("start quest " + quest);
    this.setLocalValue('in-quest', 1);
    this.setLocalValue('run-quest', 0);
    this.setLocalValue('quest', quest);
  },

  'stopQuest': function() {
    console.log("stop quest");
    window.Comm.setLocalValue("in-quest", 0);
    window.Comm.setLocalValue("run-quest", 0);
  },

  'attackBtnReady': function() {
    return $(".btn-attack-start").length > 0 && $(".btn-attack-start").css("display")!='none' && $('.btn-attack-start').hasClass("display-on");
  },

  'getSummonInfo': function(sel) {
    var summon = sel.find(".prt-supporter-summon");
    var lv = parseInt(summon.find(".txt-summon-level").html().split(" ")[1].trim());
    var name = summon.html().split("</span> ")[1].trim();
    return [name, lv];
  }
}
