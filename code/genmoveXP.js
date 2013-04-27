    /**************************************************
    *                                                 *
    *              I M A G E  X P   v.1               *
    *              ---------------------              *
    *                                                 *
    * Platform : independent                          *
    * Requires : PHP >4.x, w. GDlib, MySQL 3.x        *
    * Licence  : LGPL, GPL                            *
    * Author   : Lorenz Lo S. (sl@cyion.com)          *
    *               (c) 2003                          *
    **************************************************/
/*
* TODO:
*	-clean up code
*	-generalize code for imgXP
*
*/

/*
* Setting up globals
*
* keywords: all keys for normal dragable element
* handlekeys: keys for dragable elements by a handle
* prevtags: tags where handles are suppressed
*/

var keywords = /^(moveme|dragobject|handle|Drag here!)$/;
var handlekeys = /^(handle|Drag here!)$/;
var prevtags = /^(html|head|title|body)$/i;
var dragobject = null;
var relX=0, relY=0, sY=0, sX=0;

var ie5 = document.all != null && document.getElementsByTagName != null;
var moz = !ie5 && document.getElementById != null && document.layers == null;

/*setHandler:
	action: generic assignment of mousevents
	fired:  onLoadInit, arbitrary
*/
function setHandler(){

	document.onmousedown = moveme_onmousedown;
	document.onmouseup = moveme_onmouseup;
	document.onmousemove = moveme_onmousemove;
}

/*moveme_onmousedown:
	action: assigns object handle, and calculate offsets
	fired:  onMouseDown
*/
function moveme_onmousedown() {
	//scr.Element... reference of the object for which the event is intended (the element that initiated the event).
	//declare the object clicked to variable el
	var el = window.event.srcElement;

	//check if el is the tag-element marked for draging , else traverse nested elements above of the current clicked element
	while(!keywords.test(el.getAttribute("handle"))){
		if(prevtags.test(el.tagName) || !el){
			dragobject = null;
			return false;
		}
		el = el.parentElement;
	}

	//set dragobject either for a handle or directly in case of a handle and if exist
	dragobject = ((handlekeys.test(el.getAttribute("handle"))) ? document.getElementById((el.getAttribute("handlefor") ? el.getAttribute("handlefor") : 'handle')) : el);

	//alert(dragobject.title)
	//set the current position for restoring later
	relY = dragobject.currentStyle.top;
	relX = dragobject.currentStyle.left;

	//alert(el.style.left+' X '+el.style.top)
	sY = (window.event.clientY ? window.event.clientY : window.event.screenY) - parseInt(relY);
	sX = (window.event.clientX ? window.event.clientX : window.event.screenX) - parseInt(relX);

	//update info
	boxInfo();
	
	dragobject.style.filter='alpha(opacity=30)';

	//Setting it to false cancels the default action of the source element of the event, in this case setting the textmark(textcursor)!
	window.event.returnValue = false;
	window.event.cancelBubble = true;
}

/*moveme_onmousemove:
	action: deals with movement, does border limitation and cancels bubble event handling
	fired:  onMouseUp
*/
function moveme_onmousemove() {
	if (dragobject){
		if ((window.event.clientX && window.event.clientY) >= 0 ) {
			var work_space = document.getElementById('work_space');

			var relPosX = parseInt(dragobject.style.left)-parseInt(work_space.offsetLeft);
			var relPosY = parseInt(dragobject.style.top)-parseInt(work_space.offsetTop);

			var evX = (window.event.clientX ? window.event.clientX : window.event.screenX) - sX;
			var evY = (window.event.clientY ? window.event.clientY : window.event.screenY) - sY;

			//window.status = "X: "+relPosX+"/ Y:"+relPosY
			//do movement and
			if(1>relPosX>0 || 1>relPosY>0){
				dragobject.style.left = (evX > parseInt(work_space.offsetLeft) ? evX : parseInt(work_space.offsetLeft)) + "px";
				dragobject.style.top  = (evY > parseInt(work_space.offsetTop)  ? evY : parseInt(work_space.offsetTop))  + "px";
			}else{
				dragobject.style.left = (evX < (parseInt(work_space.offsetLeft)+parseInt(work_space.offsetWidth)-parseInt(dragobject.style.width)) ? evX : (parseInt(work_space.offsetLeft)+parseInt(work_space.offsetWidth)-parseInt(dragobject.style.width))) + "px";
				dragobject.style.top  = (evY < (parseInt(work_space.offsetTop)+parseInt(work_space.offsetHeight)-parseInt(dragobject.style.height)) ? evY : (parseInt(work_space.offsetTop)+parseInt(work_space.offsetHeight)-parseInt(dragobject.style.height)))  + "px";
			}
			//window.status = dragobject.style.height
			/*
			if(!relPosX || relPosX>0){window.status = "0";
				dragobject.style.left = (window.event.clientX ? window.event.clientX : window.event.screenX) - sX + "px";
			}else if(relPosX<0){window.status = "1";


			}*/
			/*if(!relPosY || relPosY>0){
				dragobject.style.top = evY + "px";
			}*/
		}
		
		//update info slows down to much
		//boxInfo();
		
		//Setting it to false cancels the default action of the source element of the event, in this case marking text!
		window.event.returnValue = false;
		/* A Boolean value specifying the return value from the event handler. Setting it to false cancels
		 * the default action of the source element of the event.
		*/
		//A Boolean value specifying whether the current event should bubble up the hierarchy of event handlers.
		window.event.cancelBubble = true;
	}
}

/*onLoadInit:
	action: sets object handle to void; releases handle
	fired:  onMouseUp
*/
function moveme_onmouseup() {
	//update info
	boxInfo();
	dragobject.style.filter='alpha(opacity=60)';
	
	if(dragobject){
		dragobject = null;
	}
}
