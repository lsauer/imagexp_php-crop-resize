<img src="https://lh6.googleusercontent.com/-aoxWTEUnKbU/T8zEJwVnRCI/AAAAAAAAAtg/XcT1wgxAPic/w200-h120/imgxp_2000_client-server-image-processing_shot_3.jpg" style="border:0px; margin:10px; margin-right:30px; float:left;">


#ImageXP
##### PHP- GDLib based image editing via a client-server model

---

**author**: Lorenz Lo Sauer (c) 2003  
**website**: https://github.com/lsauer/imagexp_php-crop-resize  
**license**: LGPL, GPL license  
**description**: ImageXP was used in client project as a photo editor plugin for a pre-existing Content Management System, and provided advanced editing capabilities not available at that time to web-browsers.
The project started as a crop/resize tool which is free and open source.  
**note**: PHP 4.0 only offered basic OOP and may not be compatible with current PHP versions.

<example>

 * 
 **POST/GET Parameters** `cropimage.php`: 	
  >*   `src` 		...absolute path to the source picture, including the name  
  >*   `pos`		...array containing (T,L,H,W); should be associative  
  >*   `[res]`		...*optional*: tuple containing (W,H); constrains or resizes the image  
  >*   `[qual]`	...*optional*: quality  
  >*   `[intf]`	...*optional*: API interface -> e.g. SOAP  



 *	
  **Parameters** `class imgXP`: 	


 >*   `$path` 		...absolute path to the picture w. filename
 >*   `$posT`		...offset to top position in px
 >*   `$posL`		...offset to left position in px
 >*   `$posH`		...width in px
 >*   `$posW`		...height in px
 >*   `[$resX]`	...optional: constrain width / x
 >*   `[$resy]`	...optional: constrain height / y
 >*   `[$qual]`	...optional: quality
 >*   `[$intf]`		...optional: API interface -> e.g. SOAP




</example>


###Purpose

As client-server based web-tool, for resizing, cropping as well as crop-resizing user uploaded jpeg images.   
A crop-canvas is overlayed and can be moved and resized to set the final size and the parameters to be forwarded to `cropimage.php`. 

###File Structure

```
~/LSAUER.GITHUB.COM/IMAGEXP_PHP-CROP-RESIZE
│   cropimage.php                //API handling POST or GET requests
│   imgxp.php                    //Class containing the ImageXP functionality 
│   README.md                    //this file :)
│
├───code
│       cropXP.js
│       genmoveXP.js             //JS 1.2 tool for canvas-resizing
│       style.css                //CSS2 stylesheets for ImageXP
│
├───html
│       pic_cont_resize.html    //client ImageXP application
│
├───img                        //Image resources for the canvas-overlay
│       null.gif
│       pic_resize_rand_h.gif
│       pic_resize_rand_v.gif
│       sel_box_bl.gif
│       sel_box_br.gif
│       sel_box_tl.gif
│       sel_box_tr.gif
│       sel_mid.gif
│
└───pic                        //Sample pictures
        macr2036.jpg
        product_sm_imgxp.gif
        Sonnenuntergang.jpg
        Winter.jpg
```


###Useful links: 
- www.php.net
- libgd.bitbucket.org/
