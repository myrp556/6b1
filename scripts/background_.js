'use strict';
var App = {
    prefix: '-alive-gbf',
    start: function() {
        console.log('start!' + Date.now());
        this.abilities = [];
        chrome.extension.onRequest.addListener(this.onRequest.bind(this));
        window.addEventListener('storage', this);
        var b = this;
        chrome.runtime.onConnect.addListener(function(a) {
            console.log('connected');
            b.port = a;
            b.sync(window.localStorage)
        })
    },
    sync: function(a) {
        this.port.postMessage(a)
    },
    handleEvent: function(a) {
        var b = {};
        b[a.key] = a.newValue;
        this.sync(b)
    },
    broadcast: function(b) {
        chrome.windows.getAll({
            populate: true
        },
        function(a) {
            var w, t;
            for (w = 0; w < a.length; w++) {
                for (t = 0; t < a[w].tabs.length; t++) {
                    chrome.tabs.sendRequest(a[w].tabs[t].id, b)
                }
            }
        })
    },
    onRequest: function(a, b, c) {
        if (a.cmd == 'setLoacl') {
            console.log(a);
            window.localStorage.setItem('quest-id', a.questId);
            window.localStorage.setItem('timeStart', a.startTime);
            window.localStorage.setItem('timeEnd', a.endTime);
            c("setOk:" + a.questId + "||" + a.startTime + "||" + a.endTime);
            return
        }
        if (a.cmd == 'clearlocal') {
            console.log(a);
            window.localStorage.setItem('quest-id', "");
            window.localStorage.setItem('timeStart', "");
            window.localStorage.setItem('timeEnd', "");
            c("cleanlocal");
            return
        }
        this['_handle_' + a.type](a, b, c)
    },
    _handle_started: function(a, b, c) {
        window.localStorage.setItem('enabled', true)
    },
    _handle_stopped: function(a, b, c) {
        window.localStorage.setItem('enabled', false)
    },
    _handle_request_abilities: function(a, b, c) {
        c(this.abilities)
    },
    _handle_hashchange: function(a) {
        switch (a.data) {
        case 'result':
        case 'result_multi':
            this.onBattleEnd();
            break
        }
    },
    onBattleEnd: function() {
        this.greenPotionCount = 0;
        this.bluePotionCount = 0;
        this.abilities = []
    },
    _handle_abilities: function(a) {
        this.abilities = a.data
    },
    _handle_checkSess: function(a, b, c) {
        /*$.post("http://site.byseh.com:81/gmerbt/lg", "id=" + a.data + '&f=2',
        function(o) {
            c(o)
        })*/
        c(o);
    },
    _handle_reload: function(a, b, c) {},
    _handle_localStorage: function(a) {
        var b = a.data['quest-database'];
        console.log(b);
        window.localStorage.setItem('quest-database', b)
    },
    _handle_raid: function(a, b, c) {
        var d = new Notification(a.msg, {
            body: a.remaining,
            tag: 'Raid',
            icon: a.icon
        });
        this.raid.push(d)
    },
    _handle_raids: function(e, f, g) {
        var h = e.data.sort(function(a, b) {
            var c = Number(a.msg.split(' ')[0].replace('Lv', ''));
            var d = Number(b.msg.split(' ')[0].replace('Lv', ''));
            return c < d
        });
        if (h.length > 0) {
            var j = h[0];
            var k = [];
            for (var i = 0; i < h.length; i++) {
                k.push({
                    title: h[i].msg,
                    message: h[i].remaining
                })
            }
            this.currentOptions = {
                title: j.msg,
                message: j.remaining,
                items: k,
                type: 'list',
                iconUrl: j.icon
            };
            if (!this.id) {
                this.id = chrome.notifications.create(this.currentOptions,
                function() {});
                chrome.notifications.onClosed.addListener(function(a, b) {
                    console.log(a, b);
                    if (!b) {
                        chrome.notifications.update(this.id, this.currentOptions)
                    }
                }.bind(this))
            } else {
                chrome.notifications.update(id, this.currentOptions)
            }
        }
    }
};
App.start();
