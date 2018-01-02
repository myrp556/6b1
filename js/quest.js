//"javascript:(function(){var id = JSON.stringify(stage.gGameStatus.boss.param[0].enemy_id); if(id== "\"6005070\""){ alert("buhui");} else{alert("hui");}})();"

window.Quest = {
  'hard_quests': [
    {'name': '风-hard',
      'url': '#quest/supporter/300041/1'},
    {'name': '土-hard',
      'url': '#quest/supporter/300191/1'},
    {'name': '火-hard',
      'url': '#quest/supporter/300091/1'},
    {'name': '光-hard',
      'url': '#quest/supporter/300221/1'},
    {'name': '水-hard',
      'url': '#quest/supporter/300151/1'},
    {'name': '暗-hard',
      'url': '#quest/supporter/300251/1'}
  ],
  'magena_quests': [
    {'name': '风-magena',
      'url': '#quest/supporter/300051/1/0/18'},
    {'name': '土-magena',
      'url': '#quest/supporter/300261/1/0/21'},
    {'name': '火-magena',
      'url': '#quest/supporter/300101/1/0/19'},
    {'name': '光-magena',
      'url': '#quest/supporter/300271/1/0/26'},
    {'name': '水-magena',
      'url': ''},
    {'name': '暗-magena',
      'url': '#quest/supporter/300281/1/0/31'}
  ],

  'enter_next_quest': function() {
    window.Comm.getLocalValue(function(items) {
      var quest_list = items['quest-list'];
      quest_list.splice(0, 1);
      window.Comm.setLocalValue('quest-list', quest_list);
      if (quest_list.length > 0) {
        window.setLocalValue('quest', quest_list[0], null);
        window.Comm.startQuest();
        return true;
      } else {
        window.Comm.stopQuest();
        alert("quest finish");
        return true;
      }
      return false;
    });

  }
}
