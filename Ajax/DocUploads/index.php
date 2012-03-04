<?php
$uploads = new DirectoryIterator('./uploads');
//$path = dirname(__FILE__);
//echo $uploads;
//$uploadFiles = $_FILES;
$apc = apc_fetch('upload_0');
//echo $apc;
$files = array();
foreach($uploads as $file){
	if($file->isDot() && $file->isFile()){
		$files[] = sprintf(
			'<li><a href="uploads/%s">%s</a> <em>%skb</em></li>',
			$file->getFilename(),
			$file->getFilename(),
			round($file->getSize()/1024)
		);
	}
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>File Uploads</title>
	<link rel="stylesheet" href="../../common.css" />
	<style type="text/css">
		h1{font:bold 20px Arial;margin:20px;}
		form{margin:20px;}
		form legend{font:bold 16px 'Segoe UI';}
		form input{margin:10px;}
		form input[type=submit]{padding:5px;font:14px 'Segoe UI';}
		input[type=file].error:after{content:'Please Upload the file with right format!';color:red;float:left;}
		.progressBar{border:1px solid #333;height:20px;width:200px;margin:10px;}
		.progressSpan{height:100%;width:20%;display:block;background:blue;}
	</style>
	<script type="text/javascript" src="../../library.js"></script>
	<script type="text/javascript" src="loader.js"></script>
	<!---->
	<script type="text/javascript">
	window.onload = function(){
		var form = document.getElementsByTagName('form')[0];
		addProgressBar(form);
	}
	</script>
	
</head>
<body>
	<h1>File Uploader with Progress</h1>
	<div id="content">
		<form action="uploads/" enctype="multipart/form-data" method="post" id="uploadForm">
			<fieldset>
				<legend>Upload a file</legend>
				<!-- <p>File Upload:</p> -->
				<div class="fileSelector">
					<label for="newFile_1">File 1:</label>
					<input type="file" id="newFile_1" name="newFile_1" accept="imgage/gif,image/jpg" />
				</div>
				<input type="submit" value="uploadFiles" />
			</fieldset>
		</form>
		<p class="progressMessage">Progressing:</p>
		<div class="progressBar"><span class="progressSpan"></span></div>
		<div id="browserPane">
			<h2>
				<span id="fileCount">
					<?php echo count($files); ?> 
				</span>
				Existing Files in <em>uploads/</em>
			</h2>
			<ul id="fileList">
				<?php echo join($files,"\n\t\t\t\t"); ?>
			</ul>
			<p>Output:</p>
			<p><?php //foreach($_FILES as $uploadfile){
				//$uploadfile->
				print_r($_FILES);
				echo $apc."1";
			//}?></p>
		</div>
	</div>
</body>
</html>