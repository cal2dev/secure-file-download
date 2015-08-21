/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
      //  var listeningElement = parentElement.querySelector('.listening');
      //  var receivedElement = parentElement.querySelector('.received');

      //  listeningElement.setAttribute('style', 'display:none;');
      //  receivedElement.setAttribute('style', 'display:block;');
		app.main();
        console.log('Received Event: ' + id);
    },
    file_link:'',
    main: function() {
    	app.set_status('Looking For login Credentials...');
        var username = window.localStorage.getItem("uname");
		var password = window.localStorage.getItem("pword");
		if(username != null && password != null)
		{
			if(username != false && password != false)
			{
				if(username != "" && password != "")
				{
					app.set_status('Logged Sucessfully');
					app.show_login(0);
					app.get_file_link('12');
					app.show_donload(1);
				}
			}
			app.set_status('Please Login');
		}else{
			app.set_status('Please Login');
			app.show_login(1);
			app.show_donload(0);
		}
		
    	$("#login_form").bind('submit', function (e) { 
    	    var isValid = true;
    	    if (!isValid) {
    	        e.preventDefault();
    	        return false;
    	    }
    	    else {
    	    	var formData = $("#login_form").serialize();
    	    	app.submit_form(formData);
    	        e.preventDefault();
    	        return false;
    	    }
    	});
    	$("#download_pdf").on('click', function(){
    		alert("here");
    		var url = app.file_link; 
    		var downloadUrl = app.file_link;
    		var relativeFilePath = "secure-file/file.pdf";  // using an absolute path also does not work

    		/*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
    			app.set_status('Requesting to download File');
    		   var fileTransfer = new FileTransfer();
    		   fileTransfer.download(
    		      downloadUrl,
    		      // The correct path!
    		      fileSystem.root.toURL() + '/' + relativeFilePath,

    		      function (entry) {
    		         alert("File Downloaded Succesfully- "+fileSystem.root.toURL() + '/' + relativeFilePath);
    		         app.set_status('File Downloaded');
    		      },
    		      function (error) {
    		    	  alert("Error during download. Code = " + error.code);
    		    	  app.set_status('Error in file Downloadng');
    		      }
    		   );
    		});*/
    		   
    		});
    	$("#logout").on('click', function(){
    		 window.localStorage.removeItem("uname");
             window.localStorage.removeItem("pword");
             app.show_login(1);
             app.show_donload(0);
             
             
    	});
    },
    	submit_form: function(formData) {
    				app.show_login(0);
    				var url= "http://23.21.71.132/phonegap/index.php";
    				var jqxhr = $.ajax({
    									type: "POST",
			    					  	url: url,
			    					  	data: formData+"&action=validate_me",
				      					dataType: 'json',
				      					crossDomain: true,
				      					cache: false,
				      					beforeSend: function( xhr ) {
				      						app.set_status('Connecting');
				      					}
			    					})
			    				  .done(function(data) {
			    					  var res=data.response;
			    						var message=data.message;
			    						var details=data.details;
				    					if(res==1){
				    						var un=$("#uname").val();
				    						var pw=$("#pword").val();
				    						
				    						window.localStorage.setItem("uname", un);
				    						window.localStorage.setItem("pword", pw);
				    						
				    						
				    						app.show_login(0);
				    						app.get_file_link('12');
				    						$("#file_content").css("display", "block");
				    						
				    					}else{
				    						app.show_login(1);
				    						app.set_status(message);
				    					}
				    					
			    				  })
			    				  .fail(function() {
			    					  app.set_status('Failed');
			    					  app.show_login(1);
			    					
			    					  app.show_donload(1);
			    				  })
			    				  .always(function() {
			    					//  app.set_status('Completed');
			    				  });
    				 
    				 
    				/*jqxhr.always(function() {
    				  alert( "second complete" );
    				});*/
    				
    			return true;
    },
    get_file_link: function(fid) {
    	var url= "http://23.21.71.132/phonegap/index.php";
		var jqxhr = $.ajax({
							type: "POST",
    					  	url: url,
    					  	data: "action=get_file&fileId="+fid,
	      					dataType: 'json',
	      					crossDomain: true,
	      					cache: false,
	      					beforeSend: function( xhr ) {
	      						app.set_status('Getting File');
	      					}
    					})
    				  .done(function(data) {
    					  var res=data.response;
    						var message=data.message;
    						var details=data.details;
    						var link=data.link;
	    					if(res==1){
	    						app.file_link=link;
	    					}else{
	    						
	    					}
	    					app.set_status(message);
    				  })
    				  .fail(function() {
    					  app.set_status('Failed');
    				  })
    				  .always(function() {
    					//  app.set_status('Completed');
    				  });
		 
    },
    set_status: function(message) {
    	$("#status").html(message);
    },
    show_login: function(tab) {
	    	if(tab==1){ 
	    		$("#login_form_content").css("display", "block");
	    	}else{
	    		$("#login_form_content").css("display", "none");
	    		$("#login_form").trigger('reset');
	    	}
    },
    show_donload: function(tab) {
			if(tab==2){ 
						$("#file_content" ).empty();
			    	}else if(tab==1){
			    		$("#file_content").css("display", "block");
			    	}else{
				    	$("#file_content").css("display", "none");
				    }
    }
};

app.initialize();

/****************************************
 *Function for height adjust  
 ****************************************/
function contentHeight() {
    var screen = $.mobile.getScreenHeight(),
        header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
        footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
        /* content div has padding of 1em = 16px (32px top+bottom). This step
   can be skipped by subtracting 32px from content var directly. */
        contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
        content = screen - header - footer - contentCurrent;
    /* apply result */
    $(".ui-content").height(content);
}

$(document).on("pagecontainertransition", contentHeight);
$(window).on("throttledresize orientationchange", contentHeight);