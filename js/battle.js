'use strict';

window.Battle = {
  'prefrences': {
    'attack': {},
    'スラ爆': {'normal': ['1.1'], 'refresh-ability': true, 'refresh-attack': true},
    '光': {
      'normal': ['1.1', '1.3', '2.1', '2.2', '2.3', '3.1', '4.2', '4.1', '4.3'],
      'linear': [
        ['1.2', '1.4']
      ]
    },
    'トレハン': {
      'normal': ['1.2', '1.3', '4.2', '1.4', '3.1', '3.3', '2.1', '2.2', '2.3', '4.1', '4.3']
    },
    '暗帽子': {
      'normal': ['1.2', '1.3', '2.2', '2.1', '4.2', '4.1', '3.2', '3.1', '3.3', '1.1', '1.4']
    },
    '火哈士奇': {
      'normal': ['1.4', '1.2', '1.3', '2.4', '3.3', '4.3', '1.1', '2.1', '2.2', '3.1', '4.1']
    }
  },

  'tap_attack_start': function() {
      return window.Comm.tap($('.btn-attack-start'));
  },

  'get_turn_number': function() {
    var prt_number = $('.prt-number');
    var turn_num = 0;
    var i;
    if (prt_number.length > 0) {
      for (i in $('.prt-number').children()) {
          if (i == $('.prt-number').children().length-1) break;
          var blk = $($('.prt-number').children()[i]);
          if (blk.css('display') != 'none') {
            var cls = blk.attr('class');
            var conts = cls.split('n');
            if (conts.length > 1) {
              turn_num = turn_num * 10 + parseInt(conts[2]);
            }
          }
      }
      return turn_num;
    } else {
      return 0;
    }
  },

  'battle_step_forward': function() {
    //console.log('battle step forward');
    var btn_res = $('.btn-result');
    if (btn_res.length > 0 && btn_res.parent().length > 0 && btn_res.parent().css('display') != 'none') {
      window.Comm.tap(btn_res);
      return;
    }

    var turn_num = this.get_turn_number();
    console.log("turn " + turn_num);
    if (turn_num == 1) {
      window.Comm.setLocalValue('action-list', [], null);
      //window.Comm.setLocalValue('attack-tapped', false, null);
      //window.Comm.setLocalValue('abili-tapped', false, null);
    }

    var rematch = $('.pop-usual.pop-rematch-fail.pop-show');
    if (rematch.length > 0) {
      console.log("rematch fail");
      window.Comm.tap(rematch.find(".btn-usual-ok"));
      return;
    }

    var trial = $('.pop-usual.pop-trialbattle-notice.pop-show');
    if (trial.length > 0) {
      console.log("trial");
      window.Comm.tap(trial.find('.btn-usual-close'));
      return;
    }

    window.Comm.getLocalValue(function(items){
      //if (items['in-step-forward'] > 0) return;
      window.Comm.setLocalValue('in-step-forward', 1, null);
      var prefrence = items['battle-prefrence'];
      var prefrences = window.Battle.prefrences;
      var action_list = items['action-list'];
      if (!action_list || typeof(action_list) == 'undefined') {
        action_list = [];
      }
      var planC = null;
      var abili_tapped = items['abili-tapped'], attack_tapped = items['attack-tapped'];
      var tap_abili = false, tap_attack = false;

      if (prefrences && prefrence && prefrences[prefrence]) planC = prefrences[prefrence];
      //console.log("prefrence " + prefrence);
      //console.log("action-list" + action_list);

      (function() {
        var i, j, k;
        if ((!action_list || action_list.length == 0 ) && planC) {
          for (i in planC['normal']) {
            var btn = window.Comm.getCharaAblilityBtn_dot(planC['normal'][i]);
            if (btn != null && btn) {
              console.log("add normal " + planC['normal'][i]);
              action_list.push(planC['normal'][i]);
            }
          }
          for (i in planC['linear']) {
            var linear = planC['linear'][i];
            if (window.Comm.abilityListReady_dot(linear)) {
              for (j in linear) {
                console.log("add linear " + linear[j]);
                //window.Comm.tap(window.Comm.getCharaAblilityBtn_dot(linear[j]));
                action_list.push(linear[j]);
              }
            }
          }
        }
        if (window.Comm.attackBtnReady()) {
          window.Comm.setLocalValue('attack-tapped', false, null);
          (function() {
            if (window.Comm.abilityRailIsClear()) {
              window.Comm.setLocalValue('abili-tapped', false, null);
              if (action_list && action_list.length > 0) {
                for (i in action_list) {
                  var btn = window.Comm.getCharaAblilityBtn_dot(action_list[i]);
                  action_list.splice(i, 1);
                  if (btn) {
                    tap_abili = window.Comm.tap(btn);
                    return;
                  }
                }
              }
              tap_attack = window.Battle.tap_attack_start();
            } else {
              //console.log("in skill");
            }
          }) ();
        } else {
          //console.log("attack btn not ready");
        }
      })();

      window.Comm.setLocalValue('in-step-forward', 0, null);
      window.Comm.setLocalValue('action-list', action_list, null);

      if (!tap_attack && planC['refresh-attack'] && attack_tapped) {
        console.log("attack refresh");
        location.reload();
        //return;
      }
      //console.log("abli-tap: " + tap_abili + " refresh abili: " + planC['refresh-ability'] + " abili-tapped: " + abili_tapped);
      if (!tap_abili && planC['refresh-ability'] && abili_tapped) {
        console.log("abili refresh");
        location.reload();
        //return;
      }

      window.Comm.setLocalValue('attack-tapped', tap_attack, null);
      window.Comm.setLocalValue('abili-tapped', tap_abili, null);

    });
  }
}
