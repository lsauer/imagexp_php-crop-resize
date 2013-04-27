<?

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
 * Parameters:
 *   $path 		...absolute path to picture
 *   $posT		...offset to top position in px
 *   $posL		...offset to left position in px
 *   $posH		...width in px
 *   $posW		...height in px
 *   [$resX]	...optional: constraint width / x
 *   [$resy]	...optional: constraint height / y
 *   [$qual]	...optional: quality
 *   $intf]		...optional: API interface -> e.g. SOAP
**/

$gdver = 2; // set to 2 if you have gd2 installed

//base imageXP class with GD lib invocations and crop/resize functions
class imgXP {
	var $img;			//resource handle containing the image
	var $width;			//image width in px
	var $height;		//image height in px
	var $path;			//array containing absolute path to image location and storage path for (processed image dump
	var $editable;		//image locking
	var $colorSet;		//not yet used; contains color palette
	var $quality;		//sets quality for recompression

	//constructor
	function imgXP($w, $h, $path="", $quality=75 ) {
		global $gdver;

		$this->path = $path;
		$this->quality = $quality;
		$this->width = $w;
		$this->height = $h;
		$this->img = ($gdver>=2) ? imagecreatetruecolor($w, $h) : imagecreate($w, $h);
		return $this->img;
	}
	//image locking
	function isEditable(){
		return $this->$editable;
	}

	//either toggle imgLock or pass directly
	function toggleLock($lock=' '){
		if($lock!=' '){
			$this->editable = $lock;
		}else{
			$this->editable = $this->editable ? 0 : 1;
		}
		return $this->$editable;
	}

	//crop/resize method.
	//param var $pos; ...array containing T,L,H,W
	//note: pass arguments as an array containing (left,top,width,height) or single values
	function crop($l,$t=0,$w=0,$h=0){
		if(is_array($l)){
			//check if the passed array is associative and make a copy
			$pos = $l[w] ? $l : array("l"=>$l[0],"t"=>$l[1],"w"=>$l[2],"h"=>$l[3]);
		}else{
			$pos = array("l"=>$l,"t"=>$t,"w"=>$w,"h"=>$h);
		}

		$img = imagecreatefromjpeg ($this->path);
		imagecopyresampled($this->img, $img, 
								0,0, $pos[l], $pos[t], 
								$this->width, $this->height, $pos[w], $pos[h]
		);
		imagedestroy($img);
		return $new;
	}

	function output($fname=""){
		imagejpeg($this->img, $fname, $this->quality);
	}

	function destroy(){
		imagedestroy($this->img);
	}
} // end of class imgXP


?>
