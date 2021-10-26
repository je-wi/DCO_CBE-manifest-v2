# DCO_CBE

The extension uses following JavaScript APIs:
* browserAction
* downloads
* i18n
* runtime
* storage
* tabs

### v01
Initial Version from CBE

### v02
* LV intern: validate all inern links
* LV extern: validate all extern links
* DCO Archive: show all issues with articles in one site
* DCO Archive: download all issues with articles as XML-Directory
* DCO Archive: download all PDF-galleys at once
* Options:
  * Validation delay in seconds
  * Journal URL
  * Journal Shortname

### v03
* DCO Archive: download all PDF-galleys at once as XML
* Options:
  * Download count
  * Download interval in seconds

## Link Validation
Looks for all a-Tags in the active Tab and marks them with an extra class, the attribute "dco_m" andd the attribute "href_origin". With the button in the popup everey marked url can validate with a HEAD-request.

![Screen](/readme_img/001_lv.jpg)

### LV intern
Top- and second-level domian must be the same to mark the link.

### LV extern
(Must be considered as deprecated. Modern Browser block most of the XMLHttpRequests to extern domains by CORS policy: 
```javascript
.. has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Top- and second-level domain must not be the same to mark the link.

## DCO Archive

![Screen](/readme_img/002_download.jpg)

### XML-Directory

### Download all Issues as PDF


### Download all Issues as XML
Same as PDF 

## Options

![Screen](/readme_img/003_options.jpg)

## Installation




