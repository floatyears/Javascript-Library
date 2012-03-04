function fileValidate(file){
	if(!file.value || !file.accept) return false;
	var ext = file.value.match(/\.(\w+)$/i)[1].toLowerCase();
	var accepts = file.accept.split(',');
	for(var i = 0; i < accepts.length; i++){
		var filename;
		if(filename = accepts[i].split('/')[1]){
			if(ext == filename.toLowerCase()) return true;
		}
	}
	return false;
}

function handleError(){
	if(fileValidate(this) && hasClass(this,'error')){
		removeClass(this,'error');
	}else{
		//alert("Please Upload the file with right format!")
		if(!hasClass(this,'error')){
			addClass(this,'error');
		}
	}
}

function addProgressBar(form){

	//验证上传的文件格式
	var allInputs = document.getElementsByTagName('input'),fileInputs = [];
	for(var i = 0; i < allInputs.length; i++){
		if(allInputs[i].getAttribute('type') == 'file'){
			addEvent(allInputs[i],'change',handleError);
			fileInputs.push(allInputs[i]);
		}
	}
	
	//通过将form的target属性设置为iframe，提交之后就会跳转到这个iframe。最终还是在同一个页面。
	var uploadFrame = document.createElement('div');
	uploadFrame.innerHTML = '<iframe name="uploadFrame" id="uploadFrame"></iframe>';
	setStyleById(uploadFrame,{'width':'0px','height':'0px','border':'0px','z-index':'-1','visibility':'hidden'});
	document.body.appendChild(uploadFrame);
	form.setAttribute('target','uploadFrame');
	
	//
	var uniqueId = "A"+Math.floor(Math.random()*100000000000000000);
	console.log(uniqueId);
	var uploadId = document.createElement('input');
	uploadId.setAttribute('type','hidden');
	uploadId.setAttribute('value',uniqueId);
	uploadId.setAttribute('name','APC_UPLOAD_PROGRESS');
	form.insertBefore(uploadId,form.firstChild);
	
	var progressMessage = getByClassName('progressMessage')[0],progressSpan = getByClassName('progressSpan')[0];
	
	function updateProgressBar(percent,message,status){
		progressMessage.innerHTML = message;
		removeClass(progressMessage,'error');
		removeClass(progressMessage,'complete');
		removeClass(progressMessage,'waiting');
		removeClass(progressMessage,'uploading');
		addClass(progressMessage,status);
		
		setStyleById(progressSpan,{'width':percent})
	}
	
	updateProgressBar('0%','waiting for upload','waiting')
	
	addEvent(form,'submit',function(e){
		var hasFiles = false;
		for(var i = 0; i < fileInputs.length; i++){
			if(fileInputs[i].value){
				hasFiles = true;
			}
			handleError.apply(fileInputs[i],null);
		}
		if(!hasFiles){
			e = getEvent(e);
			e.preventDefault();
			alert('Please select the file to upload!');
			return false;
		}
		function warning(e){
			e = getEvent(e);
			e.preventDefault();
			alert('There is an upload in progress.please wait...');
		}
		for(var i = 0; i < fileInputs.length; i++){
			addEvent(fileInputs[i],'mousedown',warning);
		}
		function clearWarning(){
			for(var i = 0; i < fileInputs.length; i++){
				deleteEvent(fileInputs[i],'mousedown',warning);
			}
			//更新ID值，让下一次上传的值跟前一次不同
			uniqueId = "A"+Math.floor(Math.random()*100000000000000000);
			uploadId.setAttribute('value',uniqueId);
		}
	});
	
	var counter = 0;
	
	var request; 
	
	var progressWatcher = function(){
		reqeust = ajaxRequest(form.action + (form.action.indexOf('?') == -1 ? '?' : '&') + 'key=' +uniqueId + '&sim=' + (++counter),{
			jsonResponseListener:function(reaponse){
				if(!response){
					updateProgressBar('0%','Invalid from progress watcher','error');
					clearWarning();
				}else if(response.error){
					updateProgressBar('0%',response.error,'error');
					clearWarning();
				}
				else if(response.done ==1){
					updateProgressBar('100%','Upload Complete','complete');
					clearWarning();
					if(modificationHandler.constructor == Function){
						modificationHandler(response);
					}
				}
				else{
					updateProgressBar(Math.round(response.curren/response.total*100) + '%',response.current + 'of' + response.total + 'Upload File: ' + response.currentFileName, 'uploading');
					setTimeout(progressWathcer,1000);
				}
			},
			errorListener:function(){
				updateProgressBar('0%',this.status,'error');
				clearWarning();
			}
		});
		//reqest.send(null)
	}
	setTimeout(progressWatcher,1000);
}