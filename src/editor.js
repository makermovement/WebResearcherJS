/// customizable variables
/// Go to https://keycode.info/ to find keycodes 

var createNoteKeyCode = 49 ;  // corresponds to 1 on keyboard
var saveAnnotationsKeyCode= 50; // corresponds to 2 on keyboard
var loadAnnotationsKeyCode=51 ; // corresponds to 3 on keyboard
var startmqttKeyCode=52 ; // corresponds to 4 on keyboard

// controls the specs of the notes
var defaultNoteColor = "#ffffcc";
var defaultFont= "13px";
var defaultOpacity = "80%";




//////// Importing libraries  /////////
var importJs=function(type, url){
  var s=document.createElement("script");
  s.setAttribute("type",type);
  s.setAttribute("src",url);
  s.setAttribute("async",false);
  document.body.appendChild(s);
};
// Libraries: jquery , popper, notify and pell  /////////////////////
importJs("text/javascript", "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js");
importJs("text/javascript", "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js");
importJs("text/javascript", "https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js");
importJs("text/css"       , "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css");
importJs("text/javascript", "https://unpkg.com/@popperjs/core@2"); // popper helps in aligning the annotations
importJs("text/javascript", "https://cdnjs.cloudflare.com/ajax/libs/pell/1.0.6/pell.min.js");// pell- text editor
importJs("text/css"       , "https://cdnjs.cloudflare.com/ajax/libs/pell/1.0.6/pell.css");
importJs("text/javascript", "https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js");



/////// variables used /////////
var note_count=1;
var webPageUrl = window.location.href.replace(/(^\w+:|^)\/\//, '');

// MQTT variables //
var broker = {
  hostname: '',
  port: ''
};
// MQTT client:
var client;
// client credentials:
var creds = {
  clientID: "wsbrowser_"+new Date().getUTCMilliseconds(),
  userName: '',
  password: ''
};
// topic to subscribe to when you connect:
var topic = '';





document.addEventListener('keydown', workerFunction);  
function workerFunction(e){
    
    var toggleHighlight= false;

    if(e.ctrlKey){
        ////// mqtt -block ///////////////
        //// initialize and run mqtt on hitting the Ctrl+4-key
        if(e.keyCode==startmqttKeyCode){ 

        var mqtt = document.createElement('script');
        mqtt.src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.min.js";
        mqtt.type="text/javascript";
        mqtt.async = false;
        mqtt.onload= load; //Connect to broker only after loading the module
        document.head.appendChild(mqtt);

        if(confirm("Use default mqtt server values?")){
        // MQTT client details:
        broker.hostname = 'public.cloud.shiftr.io';//'public.cloud.shiftr.io','public.cloud.shiftr.io'
        broker.port= '443';//443

        // client credentials:
        creds.userName ='public';
        creds.password = 'public';

        // topic to subscribe to when you connect:
        topic =  'notes';   
        }   
        else{
        // MQTT client details:
        broker.hostname =  prompt("Enter hostname,port,username,password,topic: ",'public.cloud.shiftr.io');//'public.cloud.shiftr.io','public.cloud.shiftr.io'
        broker.port= prompt("Enter port: ",'443');//443

        // client credentials:
        creds.userName = prompt("Username: ",'public');
        creds.password =  prompt("Password: ",'public');

        // topic to subscribe to when you connect:
        topic =  prompt("Topic: ",'notes');

        } 

        $.notify("connecting to server...","info")


        function load(){
          client = new Paho.Client(broker.hostname, Number(broker.port), creds.clientID);
          // set callback handlers for the client:
          client.onConnectionLost = onConnectionLost;
          client.onMessageArrived = onMessageArrived;
          // connect to the MQTT broker:
          client.connect({
            onSuccess: onConnect,       // callback function for when you connect
            userName: creds.userName,   // username
            password: creds.password,   // password
            useSSL: true,                // use SSL
            cleanSession : false,
            onFailure : onFailedConnect,
            keepAliveInterval : 10,
            reconnect : true
          });
        }

        // called when the client connects
        function onConnect() {
          $.notify('client is connected', "success");
          console.log('MQTT: Connected');
          client.subscribe(topic);
        }

        // called when the client connects
        function onFailedConnect() {
          $.notify('MQTT: Cannot connect to broker', "error");
            client = null;
        }

        // called when the client loses its connection
        function onConnectionLost(response) {
          console.log('MQTT: Disonnected');  
          if (response.errorCode !== 0) {
              $.notify('onConnectionLost:' + response.errorMessage, "error");
          }
        }





        }

            // called when a message arrives
        function onMessageArrived(message) {
          let receivedMessage = JSON.parse(message.payloadString.toString());
          if(receivedMessage[webPageUrl+'-clientid' ]!=creds.clientID){
            annotateReceivedMessage(receivedMessage);  
          }
          $.notify('MQTT: Received:' + message.payloadString, "info");
        }

        // called when you want to send a message:
        //https://gist.github.com/jenschr/0732777a2f512ae281466961cdb60137
        function sendMqttMessage(payload) {
          if (client.isConnected()) {

            var dict_message = {};

            dict_message[webPageUrl] = payload;
            dict_message[webPageUrl+'-clientid']= creds.clientID;

            var encode_obj= JSON.stringify(dict_message);
            var makeNewID = Number(new Date());
            var encode_obj1 = encode_obj.replaceAll("tooltip","tooltip"+ makeNewID);


            let msg = String(encode_obj1 );
            message = new Paho.Message(msg);
            message.destinationName = topic;
            message.qos = 2;
            /* undeliveredMessages.push({
                message: message,
                onMessageDeliveredCallback: onMessageDeliveredCallback
            }); */
            client.send(message);
            console.log("MQTT: Sent message to topic \'"+topic+"\'");
          }
        }

        function annotateReceivedMessage(message) {
            
          var UserUploadedAnnotations= message[webPageUrl];
          var AnnotationsBlock = document.createElement('div');
          console.log(message[webPageUrl+"-clientid"])
          AnnotationsBlock.id ="Mqtt-Annotations";
          AnnotationsBlock.innerHTML= UserUploadedAnnotations;
          console.log(UserUploadedAnnotations);
          document.body.appendChild(AnnotationsBlock);


          // Enable interactivity for all the imported annotations using jquery
          for(var dd1=0;dd1<AnnotationsBlock.childNodes.length;dd1++){
            for(var dd2=0;dd2<AnnotationsBlock.childNodes[dd1].childNodes.length;dd2++){
              $('#'+AnnotationsBlock.childNodes[dd1].childNodes[dd2].id).mousedown(handle_mousedown); 
            }

          // allows user to delete the imported annotation by clicking the right click after user confirmation
            AnnotationsBlock.childNodes[dd1].addEventListener('contextmenu', function(ev) {
            if(confirm("Are you sure you want to delete this imported note?")){
              ev.preventDefault();
              ev.target.remove();
              return false;
            }}, false);


          }
        }
        
        /// End of Mqtt block ///

        //////// save annotation block ///////
        /// Saves the annotations to local .txt file when Ctrl+3 is pressed
        if(e.keyCode==saveAnnotationsKeyCode){ 
            var dict = {};

            // grab all notes
            var allNotes=document.getElementsByClassName("ui-widget-content");
            var allNotes_html = ''

            for(var i=0;i<allNotes.length;i++){
                allNotes_html+= allNotes[i].outerHTML; // getting all notes  
            }

            dict[webPageUrl] = allNotes_html;
            var encode_obj= encodeURIComponent(JSON.stringify(dict));
            var makeNewID = Number(new Date());
            var encode_obj1 = encode_obj.replaceAll("tooltip","tooltip"+ makeNewID);

            // save note  as text file
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/txt;charset=utf-8,' + encode_obj1;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'annotations'+ webPageUrl +'.txt';
            hiddenElement.click();
          }

        
         /// End of save annotation block///

        
        
        
        
          /////////////// Upload annotations block //////////////////////
          // Allow user to upload annotations when the Ctrl+2 key is pressed- code adapted from 
          //https://stackoverflow.com/questions/19038919/is-it-possible-to-upload-a-text-file-to-input-in-html-js/19039880
        
        if(e.keyCode==loadAnnotationsKeyCode){ 
            function uploadText() {
              return new Promise((resolve) => {
                // create file input1`1
                const uploader = document.createElement('input')
                uploader.type = 'file'
                uploader.style.display = 'none'
                uploader.multiple=true;

                // listen for files
                uploader.addEventListener('change', () => {
                  const files = uploader.files

                  if (files.length) {
                    for(var dd=0;dd<files.length;dd++){
                      const reader = new FileReader()
                      reader.addEventListener('load', () => {
                        uploader.parentNode.removeChild(uploader)
                        resolve(reader.result)
                      })
                      reader.readAsText(files[0])
                    }  

                  }
                })

                // trigger input
                document.body.appendChild(uploader)
                uploader.click()
              })
            }

          // usage example
            uploadText().then(text => {
              //once loaded check update the html page if the dictionary has the notes for the current URL 
              var UserUploadedAnnotaions= JSON.parse(text)[webPageUrl ];
              var AnnotationsBlock = document.createElement('div');

              AnnotationsBlock.id ="ImportedAnnotations";
              AnnotationsBlock.innerHTML=UserUploadedAnnotaions;
              document.body.appendChild(AnnotationsBlock);


              // Enable interactivity for all the imported annoations using jquery
              for(var dd1=0;dd1<AnnotationsBlock.childNodes.length;dd1++){
                for(var dd2=0;dd2<AnnotationsBlock.childNodes[dd1].childNodes.length;dd2++){

                  $('#'+AnnotationsBlock.childNodes[dd1].childNodes[dd2].id).mousedown(handle_mousedown); 

                }

                  // allows user to delete the imported annotation by clicking the right click after user confirmation
                AnnotationsBlock.childNodes[dd1].addEventListener('contextmenu', function(ev) {
                if(confirm("Are you sure you want to delete this imported note?")){
                  ev.preventDefault();
                  ev.target.remove();
                  return false;
                }}, false);
              }
            })
          }

        /// End of upload-annotation block///

        /////////////// Hightlight + Annotate block //////////////////////
        // highlight and annotate  when Ctrl+1 key is pressed 

        if(e.keyCode ==createNoteKeyCode){ 

              ////////// highlighting ///////////
            if(window.getSelection().rangeCount >0){
              var selection = window.getSelection();
              var range = selection.getRangeAt(0);
              var newNode = document.createElement("span");
              newNode.id = "popcorn"+note_count;
        //       newNode.setAttribute("style", "background-color:#d9ffcc;");
//               newNode.addEventListener('mousedown', removeHighlight); 
//               function removeHighlight(){	
//                 newNode.setAttribute("style", "");  //removes the highlight
//               }


              newNode.appendChild(range.extractContents());``
              range.insertNode(newNode);
//               toggleHighlight = true;

            }


            ////////// annotate ///////////
            if(window.getSelection().rangeCount >0){
              var newNode1 = document.createElement("div");
              newNode1.classList.add("ui-widget-content");
              document.body.appendChild(newNode1)
              newNode1.setAttribute("style", "display: inline-block;overflow:auto;");  
                
             // allows user to delete the imported annotation by clicking the right click after user confirmation
            newNode1.addEventListener('contextmenu', function(ev) {
            if(confirm("Are you sure you want to delete this note?")){
              ev.preventDefault();
              ev.target.remove();
              return false;
            }}, false);



              /* 
              ///////// annotation using pell note ///////////
              with HTML: For tests only 
              newNode1.innerHTML= `
              <div id=`+"tooltip"+note_count + ` >
              <div>
                HTML output:
                <div id="html-output" style="white-space:pre-wrap;"></div>
              </div>
              </div>
                `; 
              */
              newNode1.innerHTML= `
              <div id=`+"tooltip"+note_count + ` class="pell" >
              </div>
              `;

              document.getElementById("tooltip"+note_count).setAttribute("style","height: 130px; width: 250px;\
              border: none;color: black;  padding: 15px 15px; text-align: enter;\
              text-decoration: none;  display: inline-block; overflow:auto;resize:both;background-color:"+defaultNoteColor+";font-size:"+ defaultFont +";opacity:"+defaultOpacity)

              const editor = pell.init({
                element: document.getElementById("tooltip"+note_count),
                onChange: html => {
        //           document.getElementById('markdown-output').innerHTML = turndown(html)
                },
                defaultParagraphSeparator: 'p',
                styleWithCSS: true,
                actions: [
                  'bold',
        //           'italic',
        //           'underline',
        //           'strikethrough',
        //           'heading1',
        //           'heading2',
        //           'paragraph',
                  'quote',
                  'olist',
                  'ulist',
                  'code',
                  {
                    icon: '&#128247;',
                    title: 'Image',
                    result: () => {
                      const url = window.prompt('Enter the image URL')
                      //this implemention is different from the pell documentation to account for resizing
                      if (url) document.execCommand('insertHTML',false, `
                      <div style=" resize: both; overflow:auto;">
                        <img width=100% height=100% src=`+url+"></div><br><br> ")
                    }
                  },

        //           {
        //             icon: '&#9751;',
        //             title: 'Toggle color',
        //             result: () => {
        // //               let userInputColor=prompt("Enter color you want to set in HTML code (e.g. #d9ccff for purple):");
        // //               console.log(userInputColor);
        //               if(document.getElementById(event.target.parentNode.parentNode.id).style.backgroundColor=="#ffffcc"){

        //                  document.getElementById(event.target.parentNode.parentNode.id).style.backgroundColor="#d9ccff";

        //               }

        //             }
        //           },


        //           {
        //             icon: '&#10006;',
        //             title: 'Destroy note',
        //             result: () => {
        //               $( '#'+"tooltip" +	event.target.className.slice(-1) ).remove(); // destroys the note
        //               $( '#'+"popcorn" +	event.target.className.slice(-1) ).attr("style", "");  //removes the highlight

        //             console.log("tooltip" +	event.target.className)

        //           }
        //           },
                  {
                    icon: '&#10154;',
                    title: 'Send note via mqtt',
                    result: () => {

                      sendMqttMessage(event.target.parentNode.parentNode.parentNode.outerHTML);

                    }
                  }

                ],
                classes: {
                  actionbar: 'pell-actionbar',
                  button: 'pell-button',
                  content: 'pell-content',
                  selected: 'pell-button-selected'
                }
              })

              editor.content.innerHTML = '<br><br><br><br><br><br>'

             ////// popper js block ///////////////////////
              const popcorn = document.querySelector("#"+"popcorn"+note_count);
              const tooltip = document.querySelector('#'+"tooltip"+note_count);
              const popper_instance = Popper.createPopper(popcorn, tooltip, {
                placement: 'auto',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                      offset: [0, 0],
                      },
                    },
                    { name: 'eventListeners', enabled: false }
                  ],
              });

              $('#'+"tooltip"+note_count).mousedown(handle_mousedown); // move popper
                
             //////////// drag the annotation across the document ///////////
            /// from stackexchange - https://stackoverflow.com/questions/38405569/jquery-calling-function-to-parent-element
            function handle_mousedown(e){
              window.my_dragging = {};
              my_dragging.pageX0 = e.pageX;
              my_dragging.pageY0 = e.pageY;
              my_dragging.elem = this;
              my_dragging.offset0 = $(this).offset();


              function handle_dragging(e){
                if(e.shiftKey){
                var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
                var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
                $(my_dragging.elem)
                .offset({top: top, left: left});
              }
              }

              function handle_mouseup(e){
                $('body')
                .off('mousemove', handle_dragging)
                .off('mouseup', handle_mouseup);
              }
              $('body')
                  .on('mouseup', handle_mouseup)
                  .on('mousemove', handle_dragging);
            }
      
              note_count+=1; // update note counter 

            }
          }
       /// End of Hightlight + Annotate block  ///
    } 
}



