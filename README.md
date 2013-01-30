InPlaceEditor
=============

Edit static HTML pages ( text content and HTML code ) with this simple InPlaceEditor
------------------------------------------------

**Usage example**

**getting html5 boilerplate bootstrap template**

`git clone https://github.com/verekia/initializr-bootstrap.git`

`cd initializr-bootstrap`

**getting inplace editor**

`git clone https://github.com/xreader/inplaceeditor.git`

`cp -r inplaceeditor/* .`

`rm -rf inplaceeditor`


**add inplaceeditor to index.html template before `</body>`**

`<script src="js/inplaceeditor.js"></script>`

**before starting the server node.js dependencies (conect & express) shold be installed**

`npm i`

**now local server can be started**

`node server.js`

**navigate to `http://localhost:3000`**

*You can edit the entire HTML page now!*


**Hints:**

HTML elements are highlited on mouse over

Click on the highligted area to start text eding.

Double click to edit HTML code


To finish editing element click anywhere else or press ESC

Use control buttons uppon right to save the page or dublicate it







