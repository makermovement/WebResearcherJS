// loading jquery , popper 
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



var note_count=1;

// highlight and annotate  when ` key is pressed 
// need to include other keystrokes 

document.addEventListener('keydown', highlightText);
function highlightText(e){
if(e.keyCode ==192){
if(window.getSelection().rangeCount >0){
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    var newNode = document.createElement("span");

    newNode.id = "popcorn"+note_count;
    newNode.setAttribute("style", "background-color: yellow;");
    newNode.appendChild(range.extractContents());
    range.insertNode(newNode)

console.log(note_count);
    var newNode1 = document.createElement("div");
    document.body.appendChild(newNode1);
    newNode1.classList.add("ui-widget-content");
    newNode1.id = "tooltip"+note_count;
    newNode1.innerHTML= `<p contenteditable="true" style="background-color: #4CAF50;border: none;color: white;  padding: 15px 32px;  text-align: enter;
  text-decoration: none;  display: inline-block;  font-size: 16px;" >`+ "Annotate here" +"</p>";
    
    

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

$('#'+"tooltip"+note_count).mousedown(handle_mousedown);
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
//   console.log($(this).setOptions({  placement: 'bottom-end'}))
//     const state =  popper_instance.setOptions({ offset: $(this).offset() });
   
 
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



// annotate when the evnet - 
// https://www.w3schools.com/jsref/dom_obj_event.asp
// document.addEventListener('keypress', AnnotateText);
// function AnnotateText(e){

// $(function() {
//   $(document.body).click(function(e) {
// var annotate = prompt('Type here');
// console.log(annotate);
//     var x = e.pageX + 'px';
//     var y = e.pageY + 'px';
//     var img = $('<p contenteditable="true"> </p>');
//     var div = $('<div contenteditable="true">').css({
//       "position": "absolute",
//       "left": x,
//       "top": y
//     });
//     div.append(img);
//     $(document.body).append(div);
//     e.stopPropagation();
//     })})
   
//    };
