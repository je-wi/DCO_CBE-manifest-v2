'use strict';

/* addLeadingHost
   changes relative paths of href and img beginning with '/' to absolute paths 
   @var node (Dom Element)
   @var host (String)
*/     
function addLeadingHost(node,host)
  {
  var allImg = node.querySelectorAll('img, href');
  for(var i=0; i<allImg.length; i++)
    {
    var src = allImg[i].getAttribute('src');
    if( src != null && src.substring(0,1)=='/' )
      {
      allImg[i].setAttribute('src_origin',src);
      src = host+src;
      allImg[i].setAttribute('src',src);
      }
    
    var href = allImg[i].getAttribute('href');
    if( href != null && href.substring(0,1)=='/' )
      {
      allImg[i].setAttribute('href_origin',href);
      href = host+href;
      allImg[i].setAttribute('href',href);
      }      
    }                
  }

 /* addMultibleOptionElement
    add an input element to parent as child
   @var parent_element (DOM Element)
*/  
function addMultibleOptionElement(parent)
  {
  var prefix = parent.getAttribute('id');
  var els =  document.querySelectorAll('#'+prefix+' .opt_multible');
  var last_el = els[ (els.length-1) ];
 
  var last_id = -1;
  if( last_el && ast_el.getAttribute('id') )
    last_id = parseInt(last_el.getAttribute('id').replace(prefix+"_", '' ));
  
  var new_id =last_id+1;
  createMultibleOptionElement(new_id,'',parent);
  }

 /*  createMultibleOptionElement
   is used by building the options from storage and adding an element to the option
   @var id (int)
   @var value (String)
   @var parent_element (DOM Element)     
*/  
function createMultibleOptionElement(id,value,parent)
  {
    var inp = document.createElement("INPUT");
    var prefix = parent.getAttribute('id');
    inp.setAttribute("type", "text"); 
    inp.setAttribute("id", prefix+"_"+id);
    inp.setAttribute("value",value);      
    inp.classList.add('opt_multible');       
    parent.appendChild(inp);  
    
    var rem = document.createElement("A");
    rem.setAttribute("href", "#");   
    rem.setAttribute("id", prefix+"rem_"+id);
    rem.setAttribute("remid", prefix+"_"+id);  
    rem.innerHTML="DEL";  
    rem.classList.add('opt_multible_minus'); 
    
    // on click remove the input
    rem.addEventListener("click", function(){             
      var inp_rem = document.querySelector('#'+this.getAttribute('remid'));
      inp_rem.parentNode.removeChild(inp_rem);
      this.parentNode.removeChild(this);
    });
    parent.appendChild(rem);  
  }


/* countCharInString
   @var thestring (String)
   @var char2count (String)
   @return number (int)
*/  
function countCharInString(str,c)
  {
  var num = 0;
  for(var i=0;i<str.length;i++) 
    {
  	if(str[i] === c)
  		num++;
    }
  
  return num;
  } 

  
 /* dcoArchiveSomeExtraButtons
  put some buttons at the end of archive-site
  uses global document in tab 
*/ 
function dcoArchiveSomeExtraButtons()
  {
  var content2show = document.querySelector('.issues_archive');   
  var dco_cbe_co = document.getElementById('dco_cbe_co');
   
  var dlButton = document.createElement('BUTTON');
  dlButton.setAttribute('id','downloadXML');
  dlButton.innerHTML='downloadXML';
  dlButton.classList.add('display_block','popup_button','localize');
  dlButton.setAttribute('data-localize','downloadXML');
  content2show.appendChild(dlButton);
  
  dlButton.addEventListener("click", function(el)
    {  
    browser.storage.local.get(null, function(data)
      { 
      var content = document.querySelector('#dco_archive_content'); 
      
      /* remove citavi-picker-content */
      content.querySelectorAll('url span').forEach(function(el) {
        el.parentNode.removeChild(el);
      }); 
      
      var xmlfile = data.option3+"_issues_"+getDateFromNow(2)+".xml";  
       
dco_cbe_co.innerHTML='<br>downloading:<br>'+xmlfile+'<br>'+dco_cbe_co.innerHTML;  

      downloadElementAsXML(content, xmlfile, content);    
      });      
    });

  var dlButton2 = document.createElement('BUTTON');
  dlButton2.setAttribute('id','downloadAllPDF');
  dlButton2.innerHTML='downloadAllPDF';
  dlButton2.classList.add('display_block','popup_button','localize');
  dlButton2.setAttribute('data-localize','downloadAllPDF');
  content2show.appendChild(dlButton2);
  dlButton2.addEventListener("click", function(el)
    { 
    browser.storage.local.get(null, function(data)
      { 
      if( window.confirm(browser.i18n.getMessage('bulkdownload')) )
        {      
      
        var content2show = document.querySelector('.issues_archive');             
        var pdfs = content2show.querySelectorAll('.obj_galley_link.pdf');  
        var pdfs_array = []; 

dco_cbe_co.innerHTML='<br>downloading:<br>'+dco_cbe_co.innerHTML;

          /* log download-status to local storage */
          var dl = {};
          for(var p=0; p<pdfs.length;p++ ) 
            { 
            var pdfurl = pdfs[p].getAttribute('href').trim().replace('view','download');  
            var n = pdfurl.indexOf("download/")+9;
            var zu = ( pdfurl.indexOf('issue')!=-1 )?'issue':'article';
            var fname2download = pdfurl.substring( n );
              fname2download = data.option3+'_'+zu+'_'+fname2download.replace(/\//g,'_')+'.pdf'; 

            dl[p] = {};
            dl[p]['url'] = pdfurl;
            dl[p]['type'] = 'pdf';
            dl[p]['state'] = 'queue';
            dl[p]['name'] = fname2download; 
            
            dco_cbe_co.innerHTML='<br>queued: '+fname2download+''+dco_cbe_co.innerHTML;                     
            } 
          dco_cbe_co.innerHTML='<br>'+pdfs.length+' downloads queued'+dco_cbe_co.innerHTML;
          
          browser.storage.local.remove('downloads',function() {});
          browser.storage.local.set({ downloads: JSON.stringify(dl) }, function() { 
            
            var param = {message: 'download_pdf'};
            browser.runtime.sendMessage(param, function(response) { 
            });//send message  
          
          /*           
            browser.storage.local.get(null, function(newdata) {
                 console.dir( JSON.parse(newdata.downloads));
              });//storage get             
         */   
                     
          });//storage set          
        }//if         
      });//strorage get 
 
    });//event listener 
    
    

  var dlButton3 = document.createElement('BUTTON');
  dlButton3.setAttribute('id','downloadAllPDFasBlob');
  dlButton3.innerHTML='blob';
  dlButton3.classList.add('display_block','popup_button','localize');
  dlButton3.setAttribute('data-localize','downloadAllPDFasBlob');
  content2show.appendChild(dlButton3);    
  dlButton3.addEventListener("click", function(el)
    { 
    browser.storage.local.get(null, function(data)
      {
      
      if( window.confirm(browser.i18n.getMessage('bulkdownload')) )
        {
          var dco_archive_content = document.querySelector('#dco_archive_content');
          //var dco_archive_content = dco_archive_c.cloneNode(true);
          
          var pdfs = dco_archive_content.querySelectorAll('[type="downloadPDF"]');
          var length=pdfs.length;
           
          /* log download-status to local storage */
          var dl = {};
          for(var p=0; p<length;p++ ) 
            {
            let pdf2down = pdfs[p].innerHTML.trim().replace('view','download'); 
            
            dl[p] = {};
            dl[p]['url'] = pdf2down;
            dl[p]['type'] = 'xml';
            dl[p]['state'] = 'queue';
            
            let n = pdf2down.indexOf("download/")+9;
            let zu = ( pdf2down.indexOf('issue')!=-1 )?'issue':'article';
            let fname2download = pdf2down.substring( n );
            fname2download = data.option3+'_'+zu+'_'+fname2download.replace(/\//g,'_')+'.xml';            
            
            dl[p]['name'] = fname2download; 
            } 
          
          browser.storage.local.remove('downloads',function() {});
          browser.storage.local.set({ downloads: JSON.stringify(dl) }, function() { 
          
            for(var p=0; p<length;p++ ) 
              {     
      
              let embed = document.createElement("embed");
              embed.setAttribute('encoding','base64');
              embed.setAttribute('encoding-type','application/pdf');        
              Array.prototype.slice.call(pdfs[p].parentNode.attributes).forEach(function(item) {        
                embed.setAttribute(item.name,item.value);
              }); 
              let request = new XMLHttpRequest();
              let pdf2down = pdfs[p].innerHTML.trim().replace('view','download');

              request.open('GET', pdf2down, true);
              request.responseType = 'blob'; 
              request.extraInfo = p; 

              request.onload = function() {
      
                let reader = new FileReader();
                reader.extraInfo = request.extraInfo;
                reader.extraInfo2 = request.responseURL;
                reader.readAsDataURL(request.response);
                
                reader.onload =  function(e){
                embed.innerHTML=e.target.result.replace('data:application/pdf;base64,','');
                
                let pdfurl = reader.extraInfo2;
                let n = pdfurl.indexOf("download/")+9;
                let zu = ( pdfurl.indexOf('issue')!=-1 )?'issue':'article';
                let fname2download = pdfurl.substring( n );
                  fname2download = data.option3+'_'+zu+'_'+fname2download.replace(/\//g,'_')+'.xml';           
                downloadElementAsXML(embed, fname2download, dco_archive_content);  
      
      dco_cbe_co.innerHTML='<br>'+fname2download+' loaded'+dco_cbe_co.innerHTML;
                
                updateDLstatus(pdfurl,true);  

                 
                 }; //reader onload
                reader.onerror = function(event) {
                  console.log("Failed to read file!\n\n" + reader.error);
                 };//reader onerror
                  
              };//request onload
              request.send();                 
              /*                   */
            
            };//for
             

            
            
          });//storage set
                    
          

                 
        }//end if
      
      });        
    }); 
                 
  
  /* localization of html-elements */
  content2show.querySelectorAll('.localize').forEach(function(node) {
    localizeNode(node);
    });    
  
  }  


/* doRequest
   
   @var url (String)
   @var method (String)
   @var callback (callback-function)

   @use 
   doRequest(url, 'HEAD', function(data) {
     console.log(data.status);
    });

request.status:

100 Continue	The server has received the request headers, and the client should proceed to send the request body
101 Switching Protocols	The requester has asked the server to switch protocols
103 Checkpoint	Used in the resumable requests proposal to resume aborted PUT or POST requests

200 OK	The request is OK (this is the standard response for successful HTTP requests)
201 Created	The request has been fulfilled, and a new resource is created 
202 Accepted	The request has been accepted for processing, but the processing has not been completed
203 Non-Authoritative Information	The request has been successfully processed, but is returning information that may be from another source
204 No Content	The request has been successfully processed, but is not returning any content
205 Reset Content	The request has been successfully processed, but is not returning any content, and requires that the requester reset the document view
206 Partial Content	The server is delivering only part of the resource due to a range header sent by the client

300 Multiple Choices	A link list. The user can select a link and go to that location. Maximum five addresses  
301 Moved Permanently	The requested page has moved to a new URL 
302 Found	The requested page has moved temporarily to a new URL 
303 See Other	The requested page can be found under a different URL
304 Not Modified	Indicates the requested page has not been modified since last requested
306 Switch Proxy	No longer used
307 Temporary Redirect	The requested page has moved temporarily to a new URL
308 Resume Incomplete	Used in the resumable requests proposal to resume aborted PUT or POST requests

400 Bad Request	The request cannot be fulfilled due to bad syntax
401 Unauthorized	The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided
402 Payment Required	Reserved for future use
403 Forbidden	The request was a legal request, but the server is refusing to respond to it
404 Not Found	The requested page could not be found but may be available again in the future
405 Method Not Allowed	A request was made of a page using a request method not supported by that page
406 Not Acceptable	The server can only generate a response that is not accepted by the client
407 Proxy Authentication Required	The client must first authenticate itself with the proxy
408 Request Timeout	The server timed out waiting for the request
409 Conflict	The request could not be completed because of a conflict in the request
410 Gone	The requested page is no longer available
411 Length Required	The "Content-Length" is not defined. The server will not accept the request without it 
412 Precondition Failed	The precondition given in the request evaluated to false by the server
413 Request Entity Too Large	The server will not accept the request, because the request entity is too large
414 Request-URI Too Long	The server will not accept the request, because the URL is too long. Occurs when you convert a POST request to a GET request with a long query information 
415 Unsupported Media Type	The server will not accept the request, because the media type is not supported 
416 Requested Range Not Satisfiable	The client has asked for a portion of the file, but the server cannot supply that portion
417 Expectation Failed	The server cannot meet the requirements of the Expect request-header field
418 I'm a teapot The server refuses the attempt to brew coffee with a teapot.
421 Misdirected Request The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.
422 Unprocessable Entity (WebDAV) The request was well-formed but was unable to be followed due to semantic errors.
423 Locked (WebDAV) The resource that is being accessed is locked.
424 Failed Dependency (WebDAV) The request failed due to failure of a previous request.
425 Too Early Indicates that the server is unwilling to risk processing a request that might be replayed.
426 Upgrade Required The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).
428 Precondition Required The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
429 Too Many Requests The user has sent too many requests in a given amount of time ("rate limiting").
431 Request Header Fields Too Large The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.
451 Unavailable For Legal Reasons The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.

500 Internal Server Error	A generic error message, given when no more specific message is suitable
501 Not Implemented	The server either does not recognize the request method, or it lacks the ability to fulfill the request
502 Bad Gateway	The server was acting as a gateway or proxy and received an invalid response from the upstream server
503 Service Unavailable	The server is currently unavailable (overloaded or down)
504 Gateway Timeout	The server was acting as a gateway or proxy and did not receive a timely response from the upstream server
505 HTTP Version Not Supported	The server does not support the HTTP protocol version used in the request
511 Network Authentication Required	The client needs to authenticate to gain network access
*/  
function doRequest(url, wr, callback)
  {
  var request = new XMLHttpRequest();
  //url = url+ ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
  request.open(wr, url);
  request.setRequestHeader('Content-Type', 'text/html');
  //request.setRequestHeader(' X-Content-Type-Options:', 'nosniff');
  request.addEventListener('load', function(event) {
      callback(request);
      });
  request.send();
  } 
  
  
/* downloadElementAsXML
   download a dom element as xml; el is used to appenChild, click and removeChild
   @var doc (Dom Element)
   @var fileName (String)
   @var el (Dom Element)
   @use downloadElementAsXML(content, "my.xml", content);  
*/ 
function downloadElementAsXML(domel,fileName,el) 
  {
  var fileType = 'text/plain';   
  var oSerializer = new XMLSerializer();
  var sXML = oSerializer.serializeToString(domel);
  sXML = '<?xml version="1.0" encoding="UTF-8"?>' + sXML;
 
  var blob = new Blob([sXML], { type: fileType });
  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  el.appendChild(a);
  a.click();
  el.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
  }  
 

 /* execScripts
    execute the 'main script' in tab-context
    its a kind of generic script call
          
    @var storage-data (browser.storage.local)
    @need browser.i18n
    @need browser.tabs
    @need browser.runtime
 */
function execScripts(data)
  {
  var tabId = data.tabId;
  var archive_url = data.option2+'/index.php/'+data.option3+'/issue/archive';

  if( typeof(tabId) == 'undefined' || tabId == null || tabId==0 ) 
    {
    return;
    } 

  browser.tabs.get(tabId, function(tab) 
    {
    if(browser.runtime.lastError)  
      console.log('There was an error in execScripts : \n' + browser.runtime.lastError.message);

     
    /* the tab and the popup are separeted - so we have to load some js and css in tab-context */
    if(!browser.runtime.lastError && tab && tab.url && tab.url.substring(0,6)!="chrome" && tab.url.substring(0,5)!="about" && tab.url.substring(0,11)!="view-source" && tab.url.substring(0,26)!="https://chrome.google.com/" ) 
      {
        // console.log("we are in tabId "+tabId+" with url "+tab.url);       

        /* browser.js */
        browser.tabs.executeScript(tabId, { file: 'js/browser.js' }, function() 
          {
          if (browser.runtime.lastError) 
            console.log('There was an error injecting script js/browser.js: \n' + browser.runtime.lastError.message);
          });   

        /* extension_functions.js */  
        browser.tabs.executeScript(tabId, { file: 'js/extension.functions.js' }, function() 
          {
          if (browser.runtime.lastError)
            console.log('There was an error injecting script js/extension.functions.js: \n' + browser.runtime.lastError.message);
          });           

        /* css file  */   
        browser.tabs.insertCSS(tabId, { file: 'css/main.css' }, function() 
          {
          if (browser.runtime.lastError)
            console.log('There was an error inserting css css/main.css: \n' + browser.runtime.lastError.message);
          }); 
             
      
        /* content-script */
        if( data.isActive )
          {
                   
          browser.tabs.executeScript(tabId, { file: 'js/content_lv.js' }, function() 
            {
            //console.dir(document.querySelector('body'));
            
            if (browser.runtime.lastError)
              console.log('There was an error injecting script js/content_lv.js: \n' + browser.runtime.lastError.message);
            });
           
          
          }
        else
          {
          
          browser.tabs.executeScript(tabId, { file: 'js/content_lv.unload.js' }, function() 
            {
            if (browser.runtime.lastError)
              console.log('There was an error injecting script js/content_lv.unload.js: \n' + browser.runtime.lastError.message);
            });            
          }
      
      } 
    else
      {
      // console.log("will do nothing");
      
      }

    });     
  }

/* getDateFromNow
   return a datestring from now
   @var w (int)
   1: 30/06/2020
   2: 2020-06-30
   @return date (int)  
*/    
function getDateFromNow(w=1)
  {
  var r = '';
  var today = new Date();
  var dd = today.getDate();
  if(dd<10) dd='0'+dd; 
  var mm = today.getMonth()+1;
  if(mm<10) mm='0'+mm;  
  var yyyy = today.getFullYear();

  switch(w)
    {
    case 2:
      r = yyyy+'-'+mm+'-'+dd;
    break;
    case 1:
      r = dd+'/'+mm+'/'+yyyy;  
    default:
    break;
    }
  return r;
  }

/* getHighestZ
   return the highest z-index from DOM Element childs
    - does not always work -   
   @return z-index (int)
*/   
function getHighestZ(doc)
  {
  var z = 0;
  var el;
  doc.querySelectorAll('*').forEach(function(node) {
    var nz = window.getComputedStyle(node).zIndex;
    if( typeof(nz) != 'undefined' && nz != null && nz!='' )
      {
      nz = parseInt(nz);
      if(nz>z)
        {
        z=nz;
        el=node;        
        }
      }
    }); 

  //if(el)
  //  el.classList.add('dco_cbe_zindex');
       
  return z;
  }    
  
/* listenDownloadsChange
      
   @need browser.downloads
   @need browser.storage
   @use browser.downloads.onChanged.addListener(listenDownloadsChange);
*/
function listenDownloadsChange(item) 
  {
  if(item.state && item.state.current=== "complete" )
    {
    var id = item.id;
    browser.storage.local.get(null, function(newdata) 
      {
      var dls = JSON.parse(newdata.downloads);
      var length = Object.keys(dls).length;      
      for(var d=0; d<length;d++)
        {
        let dltype = dls[d]['type'] || '';
        let dlname = dls[d]['name'] || '';
        let dlurl = dls[d]['url'] || ''; 
        let dlstate = dls[d]['state'] || ''; 
         if(dltype=='pdf' && dlstate==id) 
           {
           updateDLstatus(dlurl,'complete');
//console.log(d+': '+dlurl);

          browser.tabs.executeScript(newdata.tabId, { code: 'var dco_cbe_co = document.getElementById("dco_cbe_co"); if(dco_cbe_co) dco_cbe_co.innerHTML="<br>completed: '+dlname+'"+dco_cbe_co.innerHTML;' }, function() 
            {
            if (browser.runtime.lastError) 
              console.log('There was an error injecting script in listenOnMessage: \n' + browser.runtime.lastError.message);
            });


           /* necessary if the startBulkDownload takes only one at a time */
           /* recursiv function-call */
           /* ff had sometimes problems and stopped the recursive call - we try it with timeout */
           window.setTimeout(startBulkDownload,1000,dltype);
           //startBulkDownload(dltype);
           }             
          }//for     
      }); //storage get
    }//if
  }
  
/* listenOnInstalled
      
   @need browser.storage
   @need browser.browserAction   
   @use browser.runtime.onInstalled.addListener(listenOnInstalled);
*/
function listenOnInstalled()
  {
  browser.storage.local.clear();
  var bw = {};
  var dl = {};
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
    downloads: JSON.stringify(dl),    
    bodywith: JSON.stringify(bw)
   }, function() { });
  browser.browserAction.setBadgeText({text: 'OFF'});
  browser.browserAction.setBadgeBackgroundColor({color: "gray"});  
  } 
  
/* listenOnMessage
      
   @need browser.storage
   @use browser.runtime.onMessage.addListener(listenOnMessage);
*/
function listenOnMessage(arg, sender, sendResponse)
  {
  if(arg.message!=undefined && arg.message=='download_pdf')
    {
    /* safari dont support downloads */      
    startBulkDownload('pdf');
    sendResponse({response: "Downloads started"});     
    } 
  return true;    
  }   
  
/* listenTabActivated
      
   @need browser.storage
   @use browser.tabs.onActivated.addListener(listenTabActivated);
*/
function listenTabActivated(info)
  {
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
  } 
  
/* listenTabUpdated
      
   @need browser.storage
   @use browser.tabs.onUpdated.addListener(listenTabUpdated);
*/
function listenTabUpdated(info)
  {
   browser.storage.local.get(null, function(data)
    { 
    browser.tabs.get(data.tabId, function(tab) 
      {
      if( tab.status == 'complete' )
        {
        // first three 'loading'-events an then one 'complete'
        // dom manipulation will not trigger the event

        }

      }); 
    });   
  }   

/* localizeNode
   reads the attribute 'data-localize' from node and replace the innerHTML with the localized message
   @var node (DOM Element)                          
   @need browser.i18n
*/  
function localizeNode(node)
  {
  var localizeKey = node.getAttribute('data-localize');
  if( localizeKey!= null && localizeKey!='' )
    {
    var localizeMessage = browser.i18n.getMessage(localizeKey);

    if( localizeMessage!='' )
      {
       if(node.nodeName=="INPUT")
         node.value=localizeMessage;
        else
         node.innerHTML = localizeMessage;    
      }

    }
  }


/*
for debugging
log the changes from storage in debugging-console - we only use the 'local'-area
@use browser.storage.onChanged.addListener(logStorageChange);
*/
function logStorageChange(changes, area)
  {
  if( area=='local')
    {
    let changedItems = Object.keys(changes);
     
      for (let item of changedItems) {
        console.log(item + " has changed:");
        //console.log("Old value: ");
        //console.log(changes[item].oldValue);
        //console.log("New value: ");
        console.log(changes[item].newValue);
      }    
    }   
  }  
  
/* 
   markILinksInDOC
   search for all a-tags in a document and add a class
   the location-object is used to differentiate between intern / extern
   @var document (document-object)
   @var location (window.location)
   @var 'intern' or 'extern' (String)
   @return markerscount (int)
   @need splitHostname
   @use
   markILinksInDOC(document,window.location,'intern');
*/
function markILinksInDOC(doc,loc,w)
  {
  // doc.constructor.name = undefined in FF 
  // loc.constructor.name = undefined in FF
  
  /*
  if( typeof(loc)!=='object' || loc.constructor.name!=='Location')
    {
    console.error('loc is not a Location-Object in getLinksInDocument: '+loc);
    return false;    
    }
    
  if( typeof(doc)!=='object' || doc.constructor.name!=='HTMLDocument')
    {
    console.error('doc is not a HTMLDocument in getLinksInDocument: '+doc);
    return false;    
    } 
*/ 
 
 var counter=0;   
 var aa=doc.querySelectorAll('a');
  for(var i=0;i<aa.length;i++ )
    {
    var lk = aa[i];
    var href = lk.getAttribute('href');
    var ism = lk.getAttribute('dco_m'); // if the attribute is null (correct in current DOM spec)  or "" (old DOM 3) then the link is not allready marked
    
    if( ism==null || ism=="" )
      {
      // mark the link 
      
      }
    else
      {
      // next iteration in the loop
      continue;
      }
      
    
    lk.setAttribute('dco_href_orig',href);

    if( typeof(href) != 'undefined' && href != null && href!='' )
      {
      href = href.trim();
      
      if( href.substring(0,2)=='//' )
        {
        if( w=='intern' )
          {
          href = href.replace('//','');
          href = loc.protocol+'//'+href;  
          lk.setAttribute('href',href);
          lk.setAttribute('dco_m','intern'); 
          lk.classList.add('dco_cbe_lk');
          counter++;          
          }             
        }      
      else if( href.substring(0,1)=='/' )
        {
        if( w=='intern' )
          {
          href = loc.protocol+'//'+loc.hostname+href;
          lk.setAttribute('href',href); 
          lk.setAttribute('dco_m','intern');            
          lk.classList.add('dco_cbe_lk'); 
          counter++;            
          }               
        }
      else if( href.substring(0,1)=='#' )
        {
        if( w=='intern' )
          {
          href = loc.protocol+'//'+loc.hostname+href;
          lk.setAttribute('href',href);
          lk.setAttribute('dco_m','intern');           
          lk.classList.add('dco_cbe_lk');   
          counter++;                       
          }                 
        }        
      else if(href.substring(0,6)=='mailto' )
        {

        }
      else if(href.substring(0,5)=='about')
        {
 
        }
      else if(href.substring(0,10)=='javascript')
        {

        }
      else if(href.substring(0,5)=='https') 
        {
        if( loc.protocol=='http:' ) //mixed content
          {
          
          }
        
        var urlobject = new URL(href);        
        var url_domains = splitHostname(urlobject.hostname);
        var loc_domains = splitHostname(loc.hostname);

        if( url_domains['top']==loc_domains['top'] && url_domains['second']==loc_domains['second'] )
          {
          if( w=='intern' )
            {
            lk.classList.add('dco_cbe_lk'); 
            lk.setAttribute('dco_m','intern');   
            counter++;             
            }           
          }
        else
          {
          if( w=='extern' )
            {
            lk.classList.add('dco_cbe_lk'); 
            lk.setAttribute('dco_m','extern'); 
            counter++;                           
            }
         
          }
        } 
      else if(href.substring(0,4)=='http' )
        {
        if( loc.protocol=='https:' ) //mixed content
          {
          href = href.replace('http:','https:');
          lk.setAttribute('href',href);
          }

        var urlobject = new URL(href);        
        var url_domains = splitHostname(urlobject.hostname);
        var loc_domains = splitHostname(loc.hostname);
        if( url_domains['top']==loc_domains['top'] && url_domains['second']==loc_domains['second'] )
          {
          if( w=='intern' )
            {
            lk.classList.add('dco_cbe_lk');  
            lk.setAttribute('dco_m','intern'); 
            counter++;                          
            }

          }
        else
          {
          if( w=='extern' )
            {
            lk.classList.add('dco_cbe_lk');  
            lk.setAttribute('dco_m','extern'); 
            counter++;               
            }
         
          }
        } 
      else
        {
        // relative url
        if( w=='intern' )
          {
          var lastsl = loc.href.lastIndexOf('/');
          var path = loc.href.substring(0,lastsl);
          href = path+'/'+href;
          lk.setAttribute('href',href);
          lk.classList.add('dco_cbe_lk');   
          lk.setAttribute('dco_m','intern');
          counter++;   
          }//end if       
        }//end else
              
      }//end if
    
    }//end for    
  return counter;    
  }    
  

/* saveTheOptions
   save the options in browser.storage
               
   @need browser.i18n
   @need browser.storage
*/
function saveTheOptions()
  {
  var opt1 = document.querySelector('#option1').value;
  var opt2 = document.querySelector('#option2').value;
  var opt3 = document.querySelector('#option3').value;
  
  /*
  var opt3 = {};
  var opt3_els =  document.querySelectorAll('#option3 .opt_multible');
  var nid = 0;
  for(var i=0;i<opt3_els.length;i++ )
    {
    var el = opt3_els[i];
    if( el.value!="" )
      {
      opt3[nid] = el.value; 
      nid++;
      }
    
    }
  */

  var status = document.querySelector('#status');
  var savedMess = browser.i18n.getMessage('savedOpt') || 'Options saved.';
        
  browser.storage.local.set({
    option1: opt1,
    //option3: JSON.stringify(opt3),
    option2: opt2, 
    option3: opt3       
    }, function() {
      status.textContent = savedMess;
      setTimeout(function() { 
        status.textContent = ''; 
        //window.close(); 
        }, 1450);
    });  
  }
  

 
  
/* setTheOptions
   load the options from browser.storage
               
   @need browser.i18n
   @need browser.storage
*/ 
function setTheOptions()
  {
  var opt1_el = document.querySelector('#option1');
  var opt2_el = document.querySelector('#option2'); 
  var opt3_el = document.querySelector('#option3');    
  /*
  var opt3_el = document.querySelector('#option3');
  var opt3_el_add = document.querySelector('#option3add');
  opt3_el_add.addEventListener("click", function(){
    addMultibleOptionElement(opt3_el);
    }, false);
  */  
  
  var status = document.querySelector('#status');
  var loadMess = browser.i18n.getMessage('loadOpt') || 'Options loaded.';  
   
  browser.storage.local.get(null, function(data)
    {
    // set option1 value
    opt1_el.value = data.option1;
    opt2_el.value = data.option2;    
    opt3_el.value = data.option3;    
    
    // add foreach data.option3 one input element
    /*
    var opts = JSON.parse(data.option3);
    for (var prop in opts) 
      {
      createMultibleOptionElement(prop, opts[prop], opt3_el);
      } 
    */   
    
    status.textContent = loadMess;
    setTimeout(function() { status.textContent = ''; }, 1450);
    });   
  } 


/* splitHostname
  split the parts of domain
                 
  @var hostname (String)
  @return top/second/third-level (array)
*/   
function splitHostname(hostname)
  {
  var r = [ 'top', 'second', 'third' ];
      r['top']    = '';
      r['second'] = '';
      r['third']  = '';  
  
  var parts = hostname.split('.');
  
  if(parts.length==2) 
    {
    r['top'] = parts[1];
    r['second'] = parts[0];
    r['third'] = '';   
    }
  else if(parts.length==3)
    {
    r['top'] = parts[2];
    r['second'] = parts[1];
    r['third'] = parts[0];       
    }
  else if(parts.length>3)
    {
    r['top'] = parts[parts.length-1];
    r['second'] = parts[parts.length-2];
    r['third'] = parts[parts.length-3];       
    }
  else
    {
    // localhost
    
    }
  return r;
  } 

/* startBulkDownload
   download files stored in storage.local.downloads
   
   @var type (String)
   @need browser.downloads
   @need browser.storage
*/
function startBulkDownload(type)
  {
  browser.storage.local.get(null, function(newdata) 
    {
    var dls = JSON.parse(newdata.downloads);
    var something2down = false;
    var length = Object.keys(dls).length;

    for(var d=0; d<length; d++)
      {
      var dltype = dls[d]['type'];
      var dlname = dls[d]['name'];
      var dlurl = dls[d]['url']; 
      var dlstate = dls[d]['state'];
       
      if( dltype==type && dlstate=='queue' )
        {
        something2down = true;
        browser.downloads.download({url: dlurl,filename: dlname},function(prom){ 
          
        // it returns the id from downloadItem - download isn't completed at this time 
        if( typeof(prom) == 'number' )
          {
          // state is set to downloadItem.id
          updateDLstatus(dlurl,prom);         
          }//if
        });//download
        
        
        /* without the break all downloads will start immediately */
        /* with break only only one file at once will downloaded FF has problems with this */
        break;        
        }//if               
      }//for
    
    if( !something2down )
      {
      //console.log('nichts mehr');
      }
    }); //storage get    
  }  
  
/* 
   UnMarkILinksInDOC
   search for all a-tags in a document with attribue dco_m
   @var document (document-object)
   @var 'intern' or 'extern' (String)
   @need splitHostname
   
   @use
   UnMarkILinksInDOC(document,'intern');
*/
function UnMarkILinksInDOC(doc,w)  
  {
  // doc.constructor.name = undefined in FF
  /*
  if( typeof(doc)!=='object' || doc.constructor.name!=='HTMLDocument')
    {
    console.error('doc is not a HTMLDocument in getLinksInDocument: '+doc);
    return false;    
    } 
  */
    
  var aa=doc.querySelectorAll('[dco_m='+w+']');  
  for(var i=0;i<aa.length;i++ )
    {
    var lk = aa[i];
    if(w=='intern')
      {
      lk.classList.remove("dco_cbe_lk");
      lk.classList.remove("dco_cbe_lk_ok");
      lk.classList.remove("dco_cbe_lk_nok");       
      }
      
    if(w=='extern')
      {
      lk.classList.remove("dco_cbe_lk");
      lk.classList.remove("dco_cbe_lk_ok");
      lk.classList.remove("dco_cbe_lk_nok");       
      }
     
    lk.removeAttribute('dco_href_orig');
    lk.removeAttribute('dco_m');    
    }
      
  }

/* 
   updateDLstatus
   set status of dl-url
   @var url (string)
   @var b (string | number)
*/  
function updateDLstatus(url,b)
  {
  browser.storage.local.get(null, function(data) {
    var dls = JSON.parse(data.downloads);
    var length = Object.keys(dls).length;
    for(var d=0; d<length;d++)
      {
      var dltype = dls[d]['type'];
      var dlname = dls[d]['name'];
      var dlurl = dls[d]['url']; 
      var dlstate = dls[d]['state']; 
      if( dlurl==url )
        dls[d]['state'] = b;
        browser.storage.local.set({ downloads: JSON.stringify(dls) }, function() {                  
          });//storage set         
        }//for      
    });//storage get    
  }       
