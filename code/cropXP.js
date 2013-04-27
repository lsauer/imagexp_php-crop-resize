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
*	-generic resize
*	-optimize resizing
*	-bug: movement restriction abrogated at sector carving line
*	-check all four quadrants for movement restriction
*
*/


var mouseState=null;
var work_canvas=null;

/*onLoadInit:
	action: ubiquitous function to initialize and handle code
	fired:  document onLoad
*/
function onLoadInit(){
	initSettings();
	initUnselectable();
	setHandler();
	initProp();
	initInfoBox();
}

/*initSettings:
	action: initializes settings for the script
	fired:  onLoadInit
*/
function initSettings(){
	var isIE = document.all ? true : false;
	var win = self.document.getElementById('idBody');

	//contains the current available document sizes(X,Y)
	window.currentWidth = isIE ? win.offsetWidth : window.innerWidth;
	window.currentHeigth = isIE ? win.offsetHeight : window.innerHeight;
}

/*boxInfo:
	action: updates box info
	fired:  arbitrary
*/ 
function boxInfo(){
	var work_space = document.getElementById('work_space');
	work_canvas = document.getElementById('work_canvas');
	
	//Info Box
	var iposX = document.getElementById('i_width');
	var iposY = document.getElementById('i_height');
	var irelL = document.getElementById('i_rell');
	var irelT = document.getElementById('i_relt');

	iposX.innerHTML = window.event.offsetX;
	iposY.innerHTML = window.event.offsetY;
	irelL.innerHTML = parseInt(work_canvas.style.left)-parseInt(work_space.offsetLeft);
	irelT.innerHTML = parseInt(work_canvas.style.top)-parseInt(work_space.offsetTop);
		
	//Crop Box
	var cposX = document.getElementById('c_width');
	var cposY = document.getElementById('c_height');
	var csize = document.getElementById('c_size');

	cposX.innerHTML = parseInt(work_canvas.style.width);
	cposY.innerHTML = parseInt(work_canvas.style.height);

	//estimate final filesize => get percentage of canvas in relation to workspace
	var perc = ((parseInt(work_canvas.style.width)*parseInt(work_canvas.style.height))
               /(parseInt(work_space.width)*parseInt(work_space.height)))
	csize.innerHTML = Math.round(work_space.fileSize*perc)+600; //~600bytes header
}

/*cropResizeDown:
	action: sets mouse state to down and initialize various measure properties
	fired:  onMouseUp
*/ 
function cropResize(pos){
	if(mouseState == 'down'){
		var xMin = 30, yMin = 30; //The smallest width/height possible
		var work_space = document.getElementById('work_space');
		work_canvas = document.getElementById('work_canvas');
		
		//prepare maximums for drawing limitation pertaining all four sides
		var eMaxW = work_space.width-parseInt(work_canvas.style.left)+parseInt(work_space.offsetLeft);
		var sMaxH = work_space.height-parseInt(work_canvas.style.top)+parseInt(work_space.offsetTop);
		
		var wMaxL = parseInt(work_space.offsetLeft);
		var wMaxW = parseInt(work_canvas.offsetLeft)+parseInt(work_canvas.style.width)-parseInt(work_space.offsetLeft);
		
		var nMaxT = parseInt(work_space.offsetTop);
		var nMaxH = parseInt(work_canvas.offsetTop)+parseInt(work_canvas.style.height)-parseInt(work_space.offsetTop);

		//do action according to passed direction
		if (pos.indexOf("e") != -1)
			work_canvas.style.width = Math.max(xMin, Math.min(eMaxW,work_canvas.width + window.event.clientX - work_canvas.grabx)) + "px";

		if (pos.indexOf("s") != -1)
			work_canvas.style.height = Math.max(yMin, Math.min(sMaxH,work_canvas.height + window.event.clientY - work_canvas.graby)) + "px";

		if (pos.indexOf("w") != -1) {
			work_canvas.style.left = Math.max(wMaxL,Math.min(work_canvas.left + window.event.clientX - work_canvas.grabx, work_canvas.left + work_canvas.width - xMin)) + "px";
			work_canvas.style.width = Math.min(wMaxW,Math.max(xMin, work_canvas.width - window.event.clientX + work_canvas.grabx)) + "px";
		}
		if (pos.indexOf("n") != -1) {
			work_canvas.style.top = Math.max(nMaxT,Math.min(work_canvas.top + window.event.clientY - work_canvas.graby, work_canvas.top + work_canvas.height - yMin)) + "px";
			work_canvas.style.height = Math.min(nMaxH,Math.max(yMin, work_canvas.height - window.event.clientY + work_canvas.graby)) + "px";
		}

		//update box info
		boxInfo();
		//window.event.returnValue = false;
		//window.event.cancelBubble = true;
	}else
		return true;
}

/*cropResizeDown:
	action: sets mouse state to down and initialize various measure properties
	fired:  onMouseUp
*/ 
function cropResizeDown(){
	mouseState='down';
	
	work_canvas.style.filter='alpha(opacity=30)';
	work_canvas.grabx = window.event.clientX;
	work_canvas.graby = window.event.clientY;
	work_canvas.width = work_canvas.offsetWidth;
	work_canvas.height = work_canvas.offsetHeight;
	work_canvas.left = work_canvas.offsetLeft;
	work_canvas.top = work_canvas.offsetTop;

	//window.event.returnValue = false;
	//window.event.cancelBubble = true;
}

/*cropResizeUp:
	action: sets mouse state to up, required for the resizing function
	fired:  onMouseUp
*/ 
function cropResizeUp(){
	mouseState='up';
	
	work_canvas.style.filter='alpha(opacity=60)';
}

/*initInfoBox:
	action: fills info box data with properties of the work_space
	fired:  onLoadInit
*/ 
function initInfoBox(){
	var infoNames = new Array("p_width", "p_height", "p_sizeKB", "p_type");
	var infoAttr = new Array("width", "height", "fileSize", "src.split('.').pop()");
	var obj, attr;
	//var work_space = document.getElementsByName('work_space')[0];

	for(i=0;i<infoNames.length;i++){
		obj = document.getElementById(infoNames[i]);
		attr = eval("document.getElementById('work_space')."+infoAttr[i]);

		obj.innerHTML = attr;
	}
}

/*initUnselectable:
	action: Ensure the display interface is not selectable, by making all elements unselectable=on
	fired:  onLoadInit, arbitrary
*/ 
function initUnselectable(){
	var unselect = new Array();
	unselect['input'] = unselect['button'] = unselect['textfield'] = 1;
	var tags = document.getElementsByTagName('*');

	for (i=0; i < tags.length; i++){
		var tagname = tags[i].tagName.toLowerCase();

		if(unselect[tagname])
			tags[i].unselectable = "off";
		else
			tags[i].unselectable = "on";
	}
}

/*passForward:
	action: compiles data, packs it into a string and passes it forward
	method: http-GET
	fired:  onClick
*/ 
function passForward(){
	//absolute path to script
	var urlGET='../cropimage.php?';
	var work_space = document.getElementById('work_space');
	
	//compile basic params
	var irelL = document.getElementById('i_rell').innerHTML;
	var irelT = document.getElementById('i_relt').innerHTML;
	var cposX = document.getElementById('c_width').innerHTML;
	var cposY = document.getElementById('c_height').innerHTML;
	
	urlGET += 'src='+work_space.src;
	urlGET += '&pos[l]='+irelL+'&pos[t]='+irelT+'&pos[w]='+cposX+'&pos[h]='+cposY;
	
	//compile additional parameters
	var sresW = document.getElementById('s_width').value;
	var sresH = document.getElementById('s_height').value;
	var squal = document.getElementById('s_qual').value;
	
	urlGET += '&res[w]='+parseInt(sresW)+'&res[h]='+parseInt(sresH)+'&qual='+squal;

	//now pass forward
	document.getElementById('fr_preview').src = urlGET;
}

/*initProperties:
	action: initializes proportions of the workcanvas
	fired:  onLoadInit
*/ 
function initProp(){
	work_canvas = document.getElementById('work_canvas');
	
	if(!work_canvas.style.top)
		work_canvas.style.top = work_canvas.offsetTop+'px';
	if(!work_canvas.style.left)
		work_canvas.style.left = work_canvas.offsetLeft+'px';
	if(!work_canvas.style.height)
		work_canvas.style.height = work_canvas.offsetHeight+'px';
	if(!work_canvas.style.width)
		work_canvas.style.width = work_canvas.offsetWidth+'px';
}