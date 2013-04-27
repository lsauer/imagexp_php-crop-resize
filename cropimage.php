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


/* Parameters:
 *   $src 		...absolute path to the source picture, including the name
 *   $pos		...array containing (T,L,H,W); should be associative
 *   [$res]		...optional: tuple containing (W,H); constrains or resizes the image
 *   [$qual]	...optional: quality
 *   [$intf]	...optional: API interface -> e.g. SOAP
**/

include_once("imgxp.php");

//check if at HTTP paramteres are passed
if(!$_POST && !$_GET)
	die("please pass all required variables to the cropimage script");

if(!isset($_POST[pos]))
	die("please pass the size-constraints to the cropimage script");

if(!$_GET[res][w] || $_GET[res][w] == 'NaN'){
	$_GET[res][w] = $_GET[pos][w];
}
if(!$_GET[res][h] || $_GET[res][h] == 'NaN'){
	$_GET[res][h] = $_GET[pos][h];
}

//create and output image according the parameters
//assume image/jpeg by default
header("Content-Type: image/jpeg");
$image = new imgXP($_GET[res][w], $_GET[res][h], $_GET[src], $_GET[qual]);
$image->crop($_GET[pos]);
$image->output();
$image->destroy();

?>
