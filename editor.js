//////////////////// Importing libraries 
// Libraries: jquery , popper and pell  /////////////////////
var jquery_load = document.createElement('script');
jquery_load.src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
jquery_load.type="text/javascript";
document.head.appendChild(jquery_load);

var jquery_load1 = document.createElement('script');
jquery_load1.src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js";
jquery_load1.type="text/javascript";
document.head.appendChild(jquery_load1);

var jquery_load2 = document.createElement('script');
jquery_load2.src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css";
jquery_load2.type="text/css";
document.head.appendChild(jquery_load2);

// popper helps in aligning the annotations

var popper_load = document.createElement('script');
popper_load.src="https://unpkg.com/@popperjs/core@2";
popper_load.type="text/javascript";
document.head.appendChild(popper_load);

// pell- text editor 
var pell_load = document.createElement('script');
pell_load.src="https://unpkg.com/pell";
pell_load.type="text/javascript";
document.head.appendChild(pell_load);

var pell_css = document.createElement('script');
pell_css.src="https://unpkg.com/pell/dist/pell.min.css";
pell_css.type="text/css";
document.head.appendChild(pell_css);


//// variables
var note_count=1;



/////////////// Hightlight + Annotate block //////////////////////
// highlight and annotate  when tilde(`) key is pressed 

document.addEventListener('keydown', highlightText);  

function highlightText(e){
		if(e.keyCode ==192){	
			////////// highlighting ///////////
			if(window.getSelection().rangeCount >0){
				
				var selection = window.getSelection();
				var range = selection.getRangeAt(0);
				var newNode = document.createElement("span");
				newNode.id = "popcorn"+note_count;
				newNode.setAttribute("style", "background-color:#d9ffcc;");
				newNode.appendChild(range.extractContents());``
				range.insertNode(newNode)

		
				var newNode1 = document.createElement("div");
				document.body.appendChild(newNode1);
				newNode1.classList.add("ui-widget-content");
        document.body.appendChild(newNode1)

        
				newNode1.setAttribute("style", "z-index:100;display: inline-block;height: 375px; resize: both; overflow:auto;");    

			//   very simple sticky note interface 
			//   newNode1.innerHTML= `<p contenteditable="true" style="background-color: #ffffcc;border: none;color: black;  padding: 15px 32px; text-align: enter;
			//   text-decoration: none;  dis`play: inline-block;  font-size: 16px; resize: both; overflow:auto;" >`+ "Annotate here" +"</p>";


			/////////// annotation using pell note ///////////

			// with HTML: For tests only 
			// newNode1.innerHTML= `
			// <div id=`+"tooltip"+note_count + ` >
			// <div>
			//   HTML output:
			//   <div id="html-output" style="white-space:pre-wrap;"></div>
			// </div>
			// </div>
			//  `;


			  newNode1.innerHTML= `
			<div id=`+"tooltip"+note_count + ` >
			</div>
			 `;

			document.getElementById("tooltip"+note_count).setAttribute("style","max-width:50%;max-height:50%;background-color: #ffffcc;border: none;color: black;  padding: 15px 32px; text-align: enter;text-decoration: none;  display: inline-block;  font-size: 16px; resize: both; overflow:auto;")



			const editor = pell.init({
			  element: document.getElementById("tooltip"+note_count),
			  onChange: html => {
				document.getElementById('html-output').textContent = html
			  },
			  defaultParagraphSeparator: 'p',
			  styleWithCSS: true,
			  actions: [
					'bold',
					'italic',
					'underline',
					'strikethrough',
					'heading1',
					'heading2',
					'paragraph',
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
          
			 {
				icon: '&#10006;',
				title: 'Destroy note',
				result: () => {
          		$( '#'+"tooltip" +	event.target.className.slice(-1) ).remove()
				}
			}
          
          
          
			  ],
			  classes: {
				actionbar: 'pell-actionbar-'+note_count,
				button: 'pell-button-'+note_count,
				content: 'pell-content-'+note_count,
				selected: 'pell-button-selected-'+note_count
			  }
			})

            
			editor.content.innerHTML = 'Enter annotation here '






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





		note_count+=1; // update note counter 

}   
}
}

//////////// drag the annotation across the document ///////////
/// from stackexchange - insert link here 
function handle_mousedown(e){
    window.my_dragging = {};
    my_dragging.pageX0 = e.pageX;
    my_dragging.pageY0 = e.pageY;
    my_dragging.elem = this;
    my_dragging.offset0 = $(this).offset();

 
 function handle_dragging(e){
        var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
        var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
        $(my_dragging.elem)
        .offset({top: top, left: left});
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

 
