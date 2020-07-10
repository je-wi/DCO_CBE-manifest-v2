'use strict';

/*  background.js  
                         
    @need js/browser.js
    @need js/extension.functions.js 
           
    @need browser.runtime
    @need browser.storage
    @need browser.i18n
    @need browser.browserAction
    @need browser.tabs        
*/ 

browser.runtime.onInstalled.addListener(function() {
  browser.storage.local.clear();
  var bw = {};
  //var o3 = {};
    browser.storage.local.set({
    isActive:false, 
    LVisActive:false, 
    LVEisActive:false, 
    archiveLoaded:false,
    tabId:0, 
    windowId:0, 
    previousTabId:0, 
    previousWindowId:0, 
    option1: 100,    
    option2:'https://journals.ub.uni-heidelberg.de',
    option3: 'dco',
    //option3: JSON.stringify(o3),     
    bodywith: JSON.stringify(bw)
   }, function() { });
  browser.browserAction.setBadgeText({text: 'OFF'});
  browser.browserAction.setBadgeBackgroundColor({color: "gray"});          
 });
 
 
// activate tab
browser.tabs.onActivated.addListener(function(info) { 

  browser.storage.local.get(null, function(dataLast) {
  var previousTabId = dataLast.tabId;
  var previousWindowId = dataLast.windowId;     
        
   browser.storage.local.set({tabId: info.tabId, previousTabId:previousTabId, windowId:info.windowId, previousWindowId:previousWindowId  }, function() {
     browser.storage.local.get(null, function(data)
      {  
      execScripts(data);
      });
    }); 
  });
});     

// refreshing page
browser.tabs.onUpdated.addListener(function(info) { 

   browser.storage.local.get(null, function(data)
    {      
    //execScripts(data);
    }); 
}); 


browser.runtime.onMessage.addListener(
  function(arg, sender, sendResponse) {
    if(arg.message!=undefined && arg.message=='download')
      {
      var pdfs=arg.pdfs;
      //console.log(args); 
      for(var i=0;i<pdfs.length;i++)
        {
        browser.downloads.download({url: pdfs[i][0],filename: pdfs[i][1]},function(){} );
        }     
      }
    sendResponse({response: "response from background script"});
});
