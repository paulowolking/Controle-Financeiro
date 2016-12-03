chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
   window.open("main.html", "Controle Financeiro", "window settings");
});

// listener de exibir a notificação.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.type === "shownotification"){
        chrome.notifications.create('notify', request.opt, function(){})
    }
});
