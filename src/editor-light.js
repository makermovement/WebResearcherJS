/// editor.js but with a less fancier note editor but this implemtnation does not require any external libraries


//// variables
var note_count=1;



/////////////// Hightlight + Annotate block //////////////////////
// highlight and annotate  when tilde(`) key is pressed 

document.addEventListener('keydown', highlightText);  

function highlightText(e){
  	var toggleHighlight= false;
		if(e.keyCode ==192){
			////////// highlighting ///////////
			if(window.getSelection().rangeCount >0){
				
				var selection = window.getSelection();
				var range = selection.getRangeAt(0);
				var newNode = document.createElement("span");
				newNode.id = "popcorn"+note_count;
				newNode.setAttribute("style", "background-color:#d9ffcc;");
				newNode.addEventListener('mousedown', removeHighlight); 
				function removeHighlight(){	
					newNode.setAttribute("style", "");  //removes the highlight
				}


				newNode.appendChild(range.extractContents());``
				range.insertNode(newNode);
        toggleHighlight = true;

      }

    
    }
        

        
              
        
  if(e.keyCode ==49){	
			////////// annotate ///////////
			if(window.getSelection().rangeCount >0){
				var newNode1 = document.createElement("div");
				document.body.appendChild(newNode1);
				newNode1.classList.add("ui-widget-content");
        document.body.appendChild(newNode1)

        
				newNode1.setAttribute("style", "z-index:100;display: inline-block;height: 375px; resize: both; overflow:auto;");    


			//   very simple sticky note interface 
			   newNode1.innerHTML= `<p contenteditable="true" style="background-color: #ffffcc;border: none;color: black;  padding: 15px 32px; text-align: enter;text-decoration: none;  display: inline-block;  font-size: 16px; resize: both; overflow:auto;" >`+ "Annotate here" +"</p>";

		note_count+=1; // update note counter 

}   
}
}





