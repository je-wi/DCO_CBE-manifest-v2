/*
xml-sitemap from ojs 
https://journals.ub.uni-heidelberg.de/index.php/dco/sitemap
contain a set of viewable urls
*/

var xml_div;
var content2show;   

//window.addEventListener('DOMContentLoaded', function (event) {

  browser.storage.local.get(null, function(data)
    {  
   
    //var url = data.option2+'/index.php/'+data.option3+'/issue/archive';
    //doRequest(url, 'GET', function(request) {
    //if(request.status==200)
     // {  
      /* doc is the original document parsed from the request - we will copy things from there to this document (dco_archive.html) */
      
      //var doc = new DOMParser().parseFromString(request.responseText, 'text/html');
      var doc = document.cloneNode(true);

      /* add the archive body to the visible div */
      var body = doc.querySelector('body');
      //document.querySelector('body').innerHTML = body.innerHTML;
      
      /* add the invisible div on the end of body - the div is for dco_issues.xml */
      var xml_div = document.createElement("text");
      xml_div.classList.add('display_none');
      xml_div.setAttribute('id','dco_archive_content');      
      xml_div.setAttribute('date', getDateFromNow(1) );           
      document.querySelector('body').appendChild(xml_div);      
      xml_div = document.querySelector('#dco_archive_content');      
     
     
      /* copy all links (primarily css and favicon) from HTML-head */
      for(var value of doc.querySelectorAll('head link'))
        {
        //document.querySelector('head').appendChild(value);
        }

      /* copy all classes to body */
      for(var value of body.classList.values()) 
        {
        //document.querySelector('body').classList.add(value);
        }
        
      /* remove all the script stuff (primary js) */
      for(var value of document.querySelectorAll('script')) 
        {
        //value.parentNode.removeChild(value);
        }      

      /* content slider div */  
      var content_slider = document.querySelector('#content_slider')
      //if(content_slider!=null) 
      //  content_slider.classList.add('display_none');  

        
      /*     
      content_slider.addEventListener('click',function()
        {
        
        var sidebar = document.querySelector(".pkp_structure_sidebar");
        //var sidebarWidth = sidebar.outerWidth; 
        var sidebarStyles = window.getComputedStyle(sidebar);
        var sidebarWidth = sidebarStyles.getPropertyValue('width'); 
        console.log(sidebarWidth);          

        var is_invisible = (this.classList.contains('content_toggle'))?true:false; 
        if(is_invisible)
          {
          document.querySelector(".pkp_structure_main").style.width='';
          //document.querySelector("#content_slider.left").style.left=sidebarWidth + 'px';
          document.querySelector("#content_slider.right").style.right=sidebarWidth;
          this.classList.remove("content_toggle"),
          document.querySelector("#pkp_content_main").classList.remove("main_toggle");
          sidebar.style.display='block';              
          }
        else
          {
          document.querySelector(".pkp_structure_main").style.width='100%';
          //document.querySelector("#content_slider.left").style.left='0px';
          document.querySelector("#content_slider.right").style.right='0px';
          this.classList.add( "content_toggle" );
          document.querySelector("#pkp_content_main").classList.add( "main_toggle" ); 
          sidebar.style.display='none';                
          }
        });
     */ 
        
          
       

      /* remove the original content of the archive-site - will be particular filled */
      var content2show = document.querySelector('.issues_archive');        
      content2show.innerHTML='';
      
      /* central images from block plugin */
      addLeadingHost(document,data.option2);
      // suche nach alle a hrefs und img src die mit / beginnen
      // https://journals.ub.uni-heidelberg.de/public/site/images/meyer/dfg_logo_blau.png      

      var all_issues = doc.querySelectorAll('.obj_issue_summary .title'); 
      for(var i=0;i<all_issues.length;i++)
        {
        /* hidden xml_div - begin */
        var issue = all_issues[i];
        var href = issue.getAttribute('href').trim();
        var title = issue.innerHTML.trim();
        var issue_id = 'issue_id_'+href.replace(data.option2+'/index.php/'+data.option3+'/issue/view/',''); 
        
        var issueElement = document.createElement("div");
        issueElement.setAttribute('type','bibliography');
        issueElement.setAttribute('subtype','issue');
        issueElement.setAttribute('title',title);
        issueElement.setAttribute('id',issue_id); //htmlids
        
        xml_div.appendChild(issueElement);
        
        var listBiblElement = document.createElement("listbibl");
        issueElement.appendChild(listBiblElement);
        
        var biblElement = document.createElement("bibl");
        biblElement.setAttribute('type','publication');  
        biblElement.setAttribute('subtype','completeIssue');     
        listBiblElement.appendChild(biblElement);     
        
        var urlViewElement = document.createElement("url");
        urlViewElement.setAttribute('type','view');
        urlViewElement.innerHTML=href;
        biblElement.appendChild(urlViewElement);
        /* hidden xml_div - end */    
        
        
        /* visible content div -begin */  
        var titleElement2show = document.createElement('h1');
        titleElement2show.innerHTML = title;
        content2show.appendChild(titleElement2show);
        
        var issue_sum = issue.parentNode;
        issue_sum.setAttribute('id',issue_id);
        issue_sum.classList.add('obj_issue_toc');
        content2show.appendChild(issue_sum);

        var hr2sep = document.createElement('hr');
        hr2sep.setAttribute('style','border: 0; border-top: 1px solid #2968a6; margin-bottom:20px; margin-top:10px;'); 
        content2show.appendChild(hr2sep);
        /* visible content div -end */           


        // because of async request we can only processing infos from the request itself and not from the calling environment
        // so we have to operate with the issue id
        doRequest(href, 'GET', function(request) { 
        
        // issue id from request 
        var id = 'issue_id_'+request.responseURL.replace(data.option2+'/index.php/'+data.option3+'/issue/view/','');         
        var urlElement = xml_div.querySelector('#'+id+' url[type="view"]');
        urlElement.setAttribute('status',request.status); 
        var listBiblElement = xml_div.querySelector('#'+id+' listbibl');            

        if(request.status==200)
          {
          var doc_issue = new DOMParser().parseFromString(request.responseText, 'text/html');
          
          /* visible content div -begin */   
          var issueElement2show = content2show.querySelector('#'+id);
          /* visible content div -end */  
                      
          var issue_galleys = doc_issue.querySelector('.galleys');          
          if(issue_galleys!=null)
            {
            var issue_galleys_list = issue_galleys.querySelectorAll('.obj_galley_link');
            for(var g=0; g<issue_galleys_list.length;g++)
              {
              var galleyElement = document.createElement("url");
              galleyElement.setAttribute('type',issue_galleys_list[g].innerText.trim());
              galleyElement.innerHTML=issue_galleys_list[g].getAttribute('href');
              urlElement.parentNode.appendChild(galleyElement);
              }            
            
            /* visible content div -begin */   
            issueElement2show.appendChild(issue_galleys);
            issueElement2show.appendChild(document.createElement('br'));
            issueElement2show.appendChild(document.createElement('br'));
            /* visible content div -end */                  
            
            }//end if

          var dco_sections = doc_issue.querySelectorAll('.sections div.section');
          for(var s=0; s<dco_sections.length; s++)
            {

            var section = dco_sections[s];
            var section_id = section.getAttribute('id');
            var section_name = '';            
            var section_title = section.querySelector('h2');
            if( section_title!=null )
              section_name = section_title.innerText.trim();   

            /* visible content div -begin */  
            var minus_circle = section.querySelectorAll('.fa-minus-circle');
            for(var mc=0; mc<minus_circle.length;mc++)
              {
              minus_circle[mc].parentNode.removeChild(minus_circle[mc]);
              }               
            issueElement2show.appendChild(section); 
            /* visible content div -end */                      
            

            var section_articles = section.querySelectorAll('ul[class="articles"] li .obj_article_summary'); 

            for(var sas=0; sas<section_articles.length;sas++)
              {
              var s_article = section_articles[sas]; 
                          
              var s_article_element = s_article.querySelector('.title a');
              var s_article_view_href = s_article_element.getAttribute('href').trim();
              var s_article_name = s_article_element.innerText.trim();


              var s_article_authors = '';
              var s_article_authors_element = s_article.querySelector('.meta .authors');
              if( s_article_authors_element ) s_article_authors = s_article_authors_element.innerText.trim();
               
              var s_article_pages = '';
              var s_article_pages_element = s_article.querySelector('.meta .pages');
              if( s_article_pages_element ) s_article_pages = s_article_pages_element.innerText.trim();          
              

              var biblElement = document.createElement("bibl");
              biblElement.setAttribute('type','publication');  
              biblElement.setAttribute('subtype',section_name);
              biblElement.setAttribute('title',s_article_name);
              biblElement.setAttribute('authors',s_article_authors);
              biblElement.setAttribute('pages',s_article_pages);
              listBiblElement.appendChild(biblElement);
              
              var article_view = s_article.querySelector('.title a');
              var viewurl = article_view.getAttribute('href').trim(); 
              var urlElement = document.createElement("url");
              urlElement.setAttribute('type','view');
              urlElement.innerHTML=viewurl;     
                       
              var article_id = 'article_id_'+viewurl.replace(data.option2+'/index.php/'+data.option3+'/article/view/','');     
              biblElement.setAttribute('id',article_id);   
              biblElement.appendChild(urlElement);
              
              /* visible content div -begin */     
              s_article.setAttribute('id',article_id);           
              /* visible content div -end */                 
              
              /*              */
              //galleys of article and pid
              doRequest(viewurl, 'GET', function(ArticleRequest) {
              
                var article_id = 'article_id_'+ArticleRequest.responseURL.replace(data.option2+'/index.php/'+data.option3+'/article/view/','');     
                var biblElement = xml_div.querySelector('#'+article_id);
                var urlElement = xml_div.querySelector('#'+article_id+' url[type="view"]');
                urlElement.setAttribute('status',ArticleRequest.status);
                
                var doc_article = new DOMParser().parseFromString(ArticleRequest.responseText, 'text/html');
                var galleys_links = doc_article.querySelectorAll('.galleys_links li a');
                for(var gli=0; gli<galleys_links.length; gli++)
                  {
                  var galley_link = galleys_links[gli];
                  var galley_href = galley_link.getAttribute('href').trim();
                  var galley_type = galley_link.innerText.trim();
                  var urlElement = document.createElement("url");
                  urlElement.setAttribute('type',galley_type);
                  urlElement.innerHTML=galley_href;
                  biblElement.appendChild(urlElement);
                  if( galley_type=="PDF" )
                    {
                    var urlElement2 = document.createElement("url");
                    urlElement2.setAttribute('type','downloadPDF');
                    urlElement2.innerHTML=galley_href.replace('/view/','/download/');
                    biblElement.appendChild(urlElement2);
                    }
                  
                  }
                  
                /* visible content div -begin */ 
                var article_div = document.querySelector('#'+article_id);  
                /* visible content div -end */
                
                
                var pids = doc_article.querySelectorAll('.pubid_list');
                for(var pi=0; pi<pids.length; pi++)
                  {
                  var pid = pids[pi];
                  var pid_label = pid.querySelector('.label').innerText.trim();
                  var pid_value_el = pid.querySelector('.value a');
                  
                  /* remove citaviPicker */
                  var cit_pid = pid_value_el.querySelector('span');
                  pid_value_el.remove(cit_pid); 
                  
                  var pid_value = pid_value_el.getAttribute('href').trim();                                   
                  
                  var pidElement = document.createElement("url");
                  pidElement.setAttribute('type',pid_label.replace(':',''));
                  pidElement.innerHTML=pid_value; 
                  biblElement.appendChild(pidElement);

                  /* visible content div -begin */ 
                  var pidPElement = document.createElement("p");
                  pidPElement.innerHTML = pid_label + ' <a href="'+pid_value+'">' + pid_value + '</a>';
                  article_div.appendChild(pidPElement); 
                  /* visible content div -end */                                    
                  
                  }              
              
              });
              
              }//end for
        

            
            /*
            
            var pdf_views = section.querySelectorAll('.obj_galley_link.pdf');
            for( var p=0;p<pdf_views.length;p++ )
              {
              var pdfurl = pdf_views[p].getAttribute('href').trim().replace('view','download');
              var fname2download = pdfurl.replace(data.option2+'/index.php/'+data.option3+'/article/download/','');
              fname2download = data.option3+'_'+fname2download.replace(/\//g,'_')+'.pdf';
              console.log(fname2download);
            //if(s<1)
              //{
             // var downloading = browser.downloads.download({url: pdfurl,filename: fname}); 
              //}              
              }
              */
            
         
            
            }//end for 
            
            
                  
          //urlViewElement.setAttribute('status',request.status);
          
          
          }//end if     
         

        
                
        });
        

  
                
        }//end for
        
      
      /* visible content div -begin */ 
      var issue_cover = content2show.querySelectorAll('.cover');
      issue_cover.forEach(function(item){
        item.classList.add('float_none','mbo');
       });

      var issue_title = content2show.querySelectorAll('.obj_issue_summary .title');
      issue_title.forEach(function(item){
        item.parentNode.insertBefore(document.createElement("p"),item);
       });
      /* visible content div -end */  

      
  //    }
  //  else
  //    {
     
  //    }
      
       
    window.setTimeout(someExtraButtons,5000);
    //}); 



     
    //window.setTimeout(execScriptsTimeout,8000,data); 
    });



//});

function execScriptsTimeout(data)
  {
  execScripts(data); //chrome wont this 'Extension manifest must request permission to access this host.' 
  
  /*
  var scrpt2exec = document.createElement('script');
  scrpt2exec.type = 'text/javascript';

  if( data.isActive )
    {
    scrpt2exec.src = 'js/content_lv.js';
    document.querySelector('body').appendChild(scrpt2exec);
    var scrpt2exec2 = document.createElement('script');
    scrpt2exec2.type = 'text/javascript';
    scrpt2exec2.src = 'js/content_lv_do.js';
    document.querySelector('body').appendChild(scrpt2exec2);
    }
  else
    {
    scrpt2exec.src = 'js/content_lv.unload.js';
    document.querySelector('body').appendChild(scrpt2exec);
    }
  */  
    
  }


function someExtraButtons()
  {
  var content2show = document.querySelector('.issues_archive');    
  //content2show.appendChild(document.createElement('HR'));

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
    
    // tei header, body 
    
        decodeRequest(content, data.option3+"_issues_"+getDateFromNow(2)+".xml", content);    
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
        var content2show = document.querySelector('.issues_archive');             
        var pdfs = content2show.querySelectorAll('.obj_galley_link.pdf');  
        var pdfs_array = [];         
        for( var p=0; p<pdfs.length; p++ )
          {
          var pdfurl = pdfs[p].getAttribute('href').trim().replace('view','download');  
          var n = pdfurl.indexOf("download/")+9;
          var zu = ( pdfurl.indexOf('issue')!=-1 )?'issue':'article';
          var fname2download = pdfurl.substring( n );
            fname2download = data.option3+'_'+zu+'_'+fname2download.replace(/\//g,'_')+'.pdf'; 
          //console.log(fname2download+': '+pdfurl);
                     
          //browser.downloads.download({url: pdfurl,filename: fname2download},function(){} ); // content_scripts cant directly download - we have to send it to the background 
          pdfs_array[p]= [pdfurl, fname2download]; 
          } 
          
        var param = {pdfs : pdfs_array, message: 'download'};
        browser.runtime.sendMessage(param, function(response) { 
        //console.log(response); 
        } );        
      }); 
 
    });        
  
  /* localization of html-elements */
  content2show.querySelectorAll('.localize').forEach(function(node) {
    localizeNode(node);
    });    
  
  }
  
  
    


function decodeRequest(doc,fileName,el) 
  {
  var fileType = 'text/plain';   
  var oSerializer = new XMLSerializer();
  var sXML = oSerializer.serializeToString(doc);
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
