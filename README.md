InPlaceEditor
=============

Edit static HTML pages ( text content and HTML code ) with this simple InPlaceEditor
------------------------------------------------------------------------------------

Working demo can be [found here](http://xreader.github.com/inplaceeditor/demo.html "Demo")

An article (in russian) can be [found here](http://habrahabr.ru/post/167647/ "Article")

**Usage example**

**getting html5 boilerplate bootstrap template**

`git clone https://github.com/verekia/initializr-bootstrap.git`

`cd initializr-bootstrap`

**getting inplace editor**

`git clone https://github.com/xreader/inplaceeditor.git`

`cp -r inplaceeditor/* .`

`rm -rf inplaceeditor`


**add inplaceeditor to index.html template after jquery.min.js **

`<script src="js/inplaceeditor.js"></script>`

PHP instructions
----------------
just edit js/inplaceeditor.js and change

`var SEVER = 'NODE';`

to

`var SEVER = 'PHP';`

change admin user and password and host name in config.inc

  `private static $ADMIN_USER = 'admin';`
  
  `private static $ADMIN_PASSWORD = 'secret';`
  
  `private static $INSTALLATION_BASEPATH = 'http://localhost/';`


Node.js instructions
--------------------

**before starting the server node.js dependencies (conect & express) shold be installed**

`npm i`

**now local server can be started**

`node server.js`

**navigate to `http://localhost:3000/login` and login with admin/secret**

*You can edit the entire HTML page now!*


**Hints:**

HTML elements are highlited on mouse over

Click on the highligted area to start text eding.

Double click to edit HTML code


To finish editing element click anywhere else or press ESC

Use control buttons uppon right to save the page or dublicate it







