
// loading jquery , popper , quill 
// there might be better way to import these
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

// better text editor 
var quill_load = document.createElement('script');
quill_load.src="https://unpkg.com/pell";
quill_load.type="text/javascript";
document.head.appendChild(quill_load);


var pell_css = document.createElement('script');
pell_css.src="https://unpkg.com/pell/dist/pell.min.css";
pell_css.type="text/css";
document.head.appendChild(pell_css);





// `var quill_load1 = document.createElement('script');
// quill_load1.src="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.core.js";
// quill_load1.type="text/javascript";
// document.head.appendChild(quill_load1);




// document.head.appendChild(jquery_load2);
// var quill_css1 = document.createElement('script');
// quill_css1.src="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.core.css";
// quill_css1.type="text/css";
// document.head.appendChild(quill_css1);







// end-import 

var note_count=1;

// highlight and annotate  when ` key is pressed 
// need to include other keystrokes 

document.addEventListener('keydown', highlightText);
function highlightText(e){
    // create popper to highlight 
if(e.keyCode ==192){
if(window.getSelection().rangeCount >0){
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    var newNode = document.createElement("span");

    newNode.id = "popcorn"+note_count;
    newNode.setAttribute("style", "background-color:#d9ffcc;display: inline-block;;");
    newNode.appendChild(range.extractContents());``
    range.insertNode(newNode)

console.log(note_count);
    var newNode1 = document.createElement("div");
    document.body.appendChild(newNode1);
    newNode1.classList.add("ui-widget-content");
//     newNode1.id = "tooltip"+note_count;
    newNode1.setAttribute("style", "height: 375px; resize: both; overflow:auto;");    
//   very simple note 
//     newNode1.innerHTML= `<p contenteditable="true" style="background-color: #ffffcc;border: none;color: black;  padding: 15px 32px; text-align: enter;
//   text-decoration: none;  dis`play: inline-block;  font-size: 16px; resize: both; overflow:auto;" >`+ "Annotate here" +"</p>";
    
    
// a pell note 

newNode1.innerHTML= `
<div id=`+"tooltip"+note_count + ` >
<div>
  HTML output:
  <div id="html-output" style="white-space:pre-wrap;"></div>
</div>
</div>
 `;
    
document.getElementById("tooltip"+note_count).setAttribute("style","background-color: #ffffcc;border: none;color: black;  padding: 15px 32px; text-align: enter;text-decoration: none;  dis`play: inline-block;  font-size: 16px; resize: both; overflow:auto;")
  
    
document.getElementById("html-output").setAttribute("style","  margin: 0;white-space: pre-wrap; font-size=4px")

    
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
        'line', {
          name: 'image',
          result: () => {
            const url = window.prompt('Enter the image URL')
            if (url) pell.exec('insertImage', this.ensureHTTP(url))
          }
        },
        {
          name: 'link',
          result: () => {
            const url = window.prompt('Enter the link URL')
            if (url) pell.exec('createLink', this.ensureHTTP(url))
          }
        }
  ],
  classes: {
    actionbar: 'pell-actionbar-custom-name',
    button: 'pell-button-custom-name',
    content: 'pell-content-custom-name',
    selected: 'pell-button-selected-custom-name'
  }
})

// editor.content<HTMLElement>
// To change the editor's content:
editor.content.innerHTML = 'dfasdfa '
    
    
    
    
    
    
    
    const popcorn = document.querySelector("#"+"popcorn"+note_count);

    const tooltip = document.querySelector('#'+"tooltip"+note_count);
    
    
    
const popper_instance = Popper.createPopper(popcorn, tooltip, {
  placement: 'auto',
   modifiers: [
     {
       name: 'offset',
       options: {
         offset: [0, 8],
       },
    },
{ name: 'eventListeners', enabled: false }
   ],
});

$('#'+"tooltip"+note_count).mousedown(handle_mousedown); // move popper

    
    
    
    
    note_count+=1;


}   
}
}


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



