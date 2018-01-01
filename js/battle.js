'use strict';

window.Battle = {
  'prefrences': {
    'simple': {},
    '光': {
      'normal': ['1.1', '1.3', '2.1', '2.2', '2.3', '3.1', '4.2', '4.1', '4.3'],
      'linear': [
        ['1.2', '1.4']
      ]
    }
  },

  'tap_attack_start': function() {
      this.tap($('.btn-attack-start'));
  },

  'battle_step_forward': function(prefix) {
    window.Comm.getLocalValue(function(items){
      if (items['in-step-forward'] > 0) return;
      window.Comm.setLocalValue('in-step-forward', 1, null);
      var prefrence = items['battle-prefrence']
      var prefrences = window.Battle.prefrences;
      (function(){
        if (window.Comm.attackBtnReady()) {
          if (prefix.includes('raid_multi')) {
            var cop_option = items['cop-option'];
            if (cop_option == 1) {
              attackStart();
              return true;
            } else {
              var btn = window.Comm.getCharaAblilityBtn(1, 1);
              if (btn) {
                console.log("click ability");
                tap(btn);
                return true;
              } else {
                console.log("ability not ready");
              }
              return false;
            }
          } else {
            if (prefrence && prefrence in prefrences) {
              var plan = prefrences[prefrence];
              var i, j;
              if ('normal' in plan) {
                for (i in plan['normal']) {
                  var btn = window.Comm.getCharaAblilityBtn_dot(plan['normal'][i]);
                  if (btn != null && btn) {
                    if (!window.Comm.abilityRailIsClear()) {
                      console.log("waiting skill");
                      return;
                    }
                    if (window.Comm.tap(btn)) {
                      console.log("tap normal " + plan['normal'][i]);
                      return;
                    }
                  }
                }
              }
              if ('linear' in plan) {
                for (i in plan['linear']) {
                  var linear = plan['linear'][i];
                  if (window.Comm.abilityListReady_dot(linear)) {
                    if (!window.Comm.abilityRailIsClear()) {
                      console.log("waitting skill");
                      return;
                    }
                    for (j in linear) {
                      console.log("tap linear " + linear[j]);
                      window.Comm.tap(window.Comm.getCharaAblilityBtn_dot(linear[j]));
                    }
                    return;
                  }
                }
              }
              window.Battle.tap_attack_start();
            } else {
              window.Battle.tap_attack_start();
            }
          }
        } else {
          console.log("battle waitting");
        }
      })();
      window.Comm.setLocalValue('in-step-forward', 0, null);
    });
  }
}
