/*  content_lv_do.js  
  
  the script has the same rights as in a single website
  we can manipulate the dom here as usuly                         
     
*/ 

var dco_cbe = document.getElementById('dco_cbe');

browser.storage.local.get(null, function(data)
  { 
  var LVisActive = data.LVisActive;
  var LVEisActive = data.LVEisActive;
  var isActive = data.isActive; 
  var linkdelay = parseInt(data.option1);
  var i = 0;
  var ok = 0;
  var nok = 0;

  
  if( isActive )  
    {
    document.querySelectorAll('.dco_cbe_lk').forEach(function(dco_cbe_link) {
    var ld = i * linkdelay;             
      setTimeout(function(){  
          var url = dco_cbe_link.href;

          doRequest(url, 'HEAD', function(request) {
            if(request.status==200)
              {
              dco_cbe_link.classList.remove('dco_cbe_lk');   
              //dco_cbe_link.classList.add('dco_cbe_lk_ok');
              ok++;
              dco_cbe.innerHTML+='<span class="dco_cbe_lk_ok">ok: '+url+'</span><br />';
              }
            else
              {
              dco_cbe_link.classList.remove('dco_cbe_lk');   
              dco_cbe_link.classList.add('dco_cbe_lk_nok');
              nok++; 
              dco_cbe.innerHTML+='<span class="dco_cbe_lk_nok">'+request.status+': '+url+'</span><br />';             
              } 
            // 
            //dco_cbe.innerHTML= "ok: "+ok+'<br />';   
            //dco_cbe.innerHTML+= "nok: "+nok+'<br />';                          
            });
        }, ld);  
    
      i++;
      });   
        
   };    
      
  // console.log( JSON.stringify(data));
  
  
  
  });
