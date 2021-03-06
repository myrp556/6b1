'use strict';

var PopUp = {
    start: function() {
        console.log("pop up!");
        //window.localStorage.setItem("speed", 99);
        console.log($("#btn-speed"));

        console.log("check ban");
        var bg = chrome.extension.getBackgroundPage();
        console.log("ban: " + bg.ban());
        bg.ban();
        bg.run();

        $('#quick-attack').change(function() {
            var val = this.checked;
            window.Comm.setLocalValue('quick-attack', val);
        });
        window.Comm.getLocalValue(function(items) {
            var quick_attack = items['quick-attack'];
            $('#quick-attack').prop('checked', quick_attack);
        });

        $('#stuck-refresh').change(function() {
          var val = this.checked;
          window.Comm.setLocalValue('stuck-refresh', val);
        });
        window.Comm.getLocalValue(function(items) {
          var stuck_refresh = items['stuck-refresh'];
          $('#stuck-refresh').prop('checked', stuck_refresh);
        });

        var t = this;
        $("#fly-speed").click(function() {
            console.log("click speed");
            var speed = 1;
            if (window.localStorage.getItem("speed") > 0) {
                speed = 0;
            }
            setValue("speed", speed);
            t.refreshBtnSpeed();
        });
        t.refreshBtnSpeed();

        $("#quest-button").click(function() {
            console.log("quest click");
            window.Comm.getLocalValue(function(items) {
                var in_quest = items['in-quest'];
                if (in_quest > 0) {
                    console.log("stop quest");
                    window.Comm.stopQuest();
                } else {
                    console.log("start quest");
                    //var quest = "quest/supporter/11/0";
                    //quest = "quest/supporter/510031/5";
                    var quest = items['quest'];
                    window.Comm.startQuest(quest);
                }
                t.refreshQuestButton();
            });
        });
        t.refreshQuestButton();

        $("#cop-button").click(function() {
          window.Comm.stopQuest();
          window.Comm.getLocalValue(function(items) {
              var in_cop = items['in-cop'];
              if (in_cop > 0) {
                window.Comm.stopCop();
              } else {
                window.Comm.startCop();
              }
              t.refreshCopButton();
          });
        });
        t.refreshCopButton();

        var cop_options = $('.cop-option')
        console.log(cop_options);
        cop_options.click(function() {
          t.refreshCopOption(this.value);
        });

        window.Comm.getLocalValue(function(items) {
            var cop_option = items['cop-option'];
            if (cop_option && cop_option > 0) {
              $('.cop-option-'+cop_option)[0].checked = true;
            } else {
                $('.cop-option-0')[0].checked = true;
            }
        });

        $("#copy-quest").click(function() {
          window.Comm.getLocalValue(function(items) {
            var url = items['current-url'];
            window.Comm.setLocalValue('quest', url, null);
            $("#quest-url").val(url);
          });
        });

        window.Comm.getLocalValue(function(items) {
          var quest = items['quest'];
          var check_hell = items['check-hell'];
          $("#quest-url").val(quest);
          $("#check-hell").prop('checked', check_hell);
        });
        $('#check-hell').change(function() {
          console.log(this.checked);
            window.Comm.setLocalValue("check-hell", this.checked, null);
        });

        t.refreshBattlePrefence();
        $('#battle-prefrence').change(function() {
          console.log("prefrence changed");
          var prefrence = this.value;
          console.log(prefrence);
          window.Comm.setLocalValue('battle-prefrence', prefrence, null);
        })

        $('#auto-battle').click(function() {
          window.Comm.getLocalValue(function(items) {
            if (items['auto-battle'] > 0) {
              window.Comm.setLocalValue('action-list', [], null)
              window.Comm.setLocalValue('auto-battle', 0, null);
            } else {
              window.Comm.setLocalValue('auto-battle', 1, null);
            }
            t.refreshAutoBattle();
          });
        });
        t.refreshAutoBattle();

        $('#quest-list-button').click(function() {
          window.Comm.getLocalValue(function(items) {
            var quest_list = items['quest-list'];

            if (quest_list && quest_list.length>0) {
              console.log("stop quest list");
              window.Comm.setLocalValue('quest-list', [], null);
              window.Comm.stopQuest();
            } else {
              var i;
              var hard_quests_chks = $('.hard-quest-checkbox');
              var quest_list = [];
              for (i = 0; i < hard_quests_chks.length; i++) {
                var chk = $(hard_quests_chks[i]);
                if (chk.prop('checked')) {
                  console.log('add ' + chk.attr('url') + ' to quest list');
                  quest_list.push(chk.attr('url'));
                }
              }
              console.log(quest_list);
              window.Comm.setLocalValue('quest-list', quest_list, null);

              console.log("start quest list");
              if (quest_list.length > 0) {
                window.Comm.setLocalValue('quest', quest_list[0], null);
                window.Comm.startQuest();
              }

            }
            t.refreshQuestListButton();
          });
        });
        t.refreshQuestListButton();
        t.refreshQuestList();
    },


    refreshBtnSpeed: function() {
        if (window.localStorage.getItem("speed") > 0) {
            $("#fly-speed").val("stop speed");
        } else {
            $("#fly-speed").val("start speed");
        }
    },
    refreshQuestButton: function() {
        window.Comm.getLocalValue(function(items) {
            console.log(items['in-quest']);
            if (items['in-quest'] > 0) {
                $('#quest-button').val("stop quest");
            } else {
                $('#quest-button').val("start quest");
            }
        });
    },
    refreshCopButton: function() {
      window.Comm.getLocalValue(function(items) {
          var in_cop = items['in-cop'];
          if (in_cop > 0) {
            $("#cop-button").val("stop cop");
          } else {
            $("#cop-button").val("start cop");
          }
      });
    },
    refreshCopOption: function(v) {
        console.log("set cop-option: "+v);
        window.Comm.setLocalValue('cop-option', parseInt(v), null);
    },
    refreshBattlePrefence: function() {
        window.Comm.getLocalValue(function(items) {
            var prefrence = items['battle-prefrence'];
            var prefrences = window.Battle.prefrences;
            var html = "";
            var i;
            console.log("get prefrence " + prefrence);
            for (i in prefrences) {
              console.log(i);
              var selected = '';
              if (prefrence == i) {
                  html += "<option selected='selected' value='" + i + "'>" + i + "</option>";
              } else {
                  html += "<option value='" + i + "'>" + i + "</option>";
              }
            }
            $('#battle-prefrence').html(html);
            if (!prefrence) {
              //console.log($($('#battle-prefrence').find('option')[0]));
              prefrence = $($('#battle-prefrence').find('option')[0]).html();
              $($('#battle-prefrence').find('option')[0]).attr('selected', 'selected');
              window.Comm.setLocalValue('battle-prefrence', prefrence);
            }
        });
    },
    refreshAutoBattle: function() {
      window.Comm.getLocalValue(function(items) {
          var auto_battle = items['auto-battle'];
          if (auto_battle > 0) {
            $('#auto-battle').val("stop auto");
          } else {
            $('#auto-battle').val("start auto");
          }
      })
    },
    refreshQuestListButton: function() {
      window.Comm.getLocalValue(function(items) {
        var quest_list = items['quest-list'];
        if (quest_list && quest_list.length > 0) {
          $('#quest-list-button').val('stop quest list');
        } else {
          $('#quest-list-button').val('start quest list');
        }
      });
    },
    refreshQuestList: function() {
      window.Comm.getLocalValue(function(items) {
        var quest_list = items['quest-list'];
        var hard_quests_html = ''
        var i, j;
        for (i in window.Quest.hard_quests) {
          var quest = window.Quest.hard_quests[i];
          hard_quests_html += "<input type='checkbox' class='hard-quest-checkbox' id='"+i+"' url='"+quest.url+"'/>"
          hard_quests_html += "<label>"+quest.name+"</label>"
        }
        $('#hard-quests').html(hard_quests_html);
        for (i = 0; i < $('.hard-quest-checkbox').length; i++) {
          var blk = $($('.hard-quest-checkbox')[i]);
          var url = window.Quest.hard_quests[i].url;
          if (quest_list && quest_list.includes(url)) {
            console.log("has hard " + i);
            blk.prop('checked', 'true');
          }
        }
      });
    }


}

var setValue = function(tkey, value) {
    console.log("set value: " + tkey + "=>" + value);
    window.localStorage.setItem(tkey, value);
    var dic = {}
    dic[tkey] = value
    console.log(window.localStorage);
    chrome.storage.local.set(dic, function() {});
}

document.addEventListener("DOMContentLoaded", function() {
    var bg = chrome.extension.getBackgroundPage();
    PopUp.start();
});
