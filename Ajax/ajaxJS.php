<?php
header('Content-Type:text/javascript');
//$calback_o = $_GET['JS_HTTP_REQUEST_CALLBACK'];
$callback = preg_replace('/[^A-Z0-9_]/i','',$_GET['JS_HTTP_REQUEST_CALLBACK']);
echo "/* JS request for callback : $callback. */\n";
if($callback){
	$date = date('r');
echo 
<<<JSON
	{$callback}({
		message:'request on {$date}'
	});
JSON;
}
?>