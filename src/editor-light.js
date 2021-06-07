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

				
				newNode.appendChild(range.extractContents());
				range.insertNode(newNode);
        toggleHighlight = true;

        
			////////// annotate ///////////

				var newNode1 = document.createElement("div");
        newNode1.offsetLeft=newNode.offsetLeft;
        newNode1.offsetTop=newNode.offsetTop+20;     
        
				newNode1.setAttribute("style", "z-index:100;display: inline-block;height: 100px; resize: both; overflow:auto; position: relative; left: 20px;");    
         newNode.parentNode.appendChild(newNode1);

//         range.insertNode(newNode1);


			//   very simple sticky note interface 
			   newNode1.innerHTML= `<p contenteditable="true" style="background-color: #ffffcc;border: none;color: black;  padding: 15px 32px; text-align: enter;text-decoration: none;  display: inline-block;  font-size: 16px; resize: both; overflow:auto;" >`+ "Annotate here" +"</p>";
        
        newNode1.addEventListener('dblclick', removeAnnotate); 
				function removeAnnotate(){	
//           newNode1.innertHTML="";              //removes the note
// 					newNode1.setAttribute("style", "");  //removes the highlight
          newNode1.remove();
				}
        

		note_count+=1; // update note counter 

}   


}

}
