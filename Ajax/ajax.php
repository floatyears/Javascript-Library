<?php
if(isset($_SERVER['HTTP_X_AJAX_REQUEST'])){
	header('My-Ajax-Response: '.$_SERVER['HTTP_X_AJAX_REQUEST']);
	echo 'Hello EveryBody';
}
else{
	echo 'Hello';
	//echo $_SERVER['HTTP_ACCEPT'];
}
?>