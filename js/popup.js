'use strict';

var PopUp = {
    start: function() {
        console.log("pop up!");
        //window.localStorage.setItem("speed", 99);
        console.log($("#btn-speed"));

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
                    var quest = "quest/supporter/11/0";
                    window.Comm.startQuest(quest);
                }
                t.refreshQuestButton();
            });
        });
        t.refreshQuestButton();
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
