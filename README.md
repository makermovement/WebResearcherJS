
# WebReseacherJS 
<img width=300px src="logo.png">

WebResearcher is a simple web annotation tool written in javascript.

### Installation

Create a bookmarklet using the code available under bookmarklet/editor-bookmarklet and you are good to go! 

### Controls 
<img width=650px src="demo.gif">


Load bookmarklet on the webpage you would like to annotate and select some region in the webpage. 
- **Ctrl + 1**: Create note near selection
  - Hold on the shift key and drag the note anywhere on the webpage
  - Resize as needed
  - Right click on any note to destroy it.
- **Ctrl + 2**: Save all annotations in current webpage as .txt to local drive
- **Ctrl + 3**: Load annotations from local drive
- **Ctrl + 4**: Initialize a mqtt-server to share notes
  - Once a mqtt-server is setup, each note has a "Send note via mqtt" button which upon clicking, will transmit these notes.


### Video demo

