<?php
if(isset($_SERVER['HTTP_MY_AJAX_REQUEST'])){
	header('My-Ajax-Response: '.$_SERVER['HTTP_MY_AJAX_REQUEST']);
	echo 'Hello';
}
else{
	echo 'Hello';
}
?>