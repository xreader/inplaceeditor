<?php

require_once 'config.inc';

/**
 * html.inc is an includes file with HTML headers and HTML body
 *
 * @author talbot
 */
class HtmlEntities {

// NOWDOC fot HTML headers
  private $HTML_HEADER = <<<'EOT'
<!doctype html>
<!--[if lt IE 8]> <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="no-js ie9 oldie" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
EOT;
// NOWDOC for HTML head section
  private $HTML_HEAD = <<<'EOT'
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title></title>
    <meta name="description" content="">
    <meta name="author" content="">

    <meta name="viewport" content="width=device-width,initial-scale=1">

    <link rel="stylesheet" href="css/bootstrap.css">
    <style>
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
    </style>
    <link rel="stylesheet" href="css/bootstrap-responsive.css">
    <link rel="stylesheet" href="css/style.css">

    <!-- 	<link rel="stylesheet/less" href="less/style.less"> -->
    <!-- 	<script src="js/libs/less-1.2.1.min.js"></script>  -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
EOT;
// NOWDOC for beginning of the BODY
  private $HTML_BODY_START = <<<'EOT'
  <body>
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">Project name</a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
    <div class="container">
      <div class="hero-unit">
EOT;
// NOWDOC for login form
  private $HTML_LOGIN_FORM = <<<'EOT'
<form id='login' action='server.php?action=login' method='post' accept-charset='UTF-8'>
  <fieldset><legend>Login</legend>
    <input type='hidden' name='submitted' id='submitted' value='1'/>
    <label for='username' >UserName*:</label>
      <input type='text' name='username' id='username'  maxlength='50' />
    <label for='password' >Password*:</label>
      <input type='password' name='password' id='password' maxlength='50' />
    <input type='submit' name='Submit' value='Submit' />
  </fieldset></form>
EOT;
// NOWDOC for the end of the BODY
  private $HTML_BODY_END = <<<'EOT'
</div><hr>
<footer><p>&copy; Company 2012</p></footer>
</div> <!-- /container -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<!-- script>
window.jQuery || document.write("<script src='js/libs/jquery-1.9.0.min.js'></script>");
</script -->
<script>
  $("a").click(function() {
    window.location = this.href;
  });
</script>

<script src="js/libs/bootstrap/bootstrap-transition.js"></script>
<script src="js/libs/bootstrap/bootstrap-collapse.js"></script>
<!--[if lt IE 7 ]>
    <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
    <script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
<![endif]-->
</body>
</html>
EOT;
  private $HTML_ERROR_HEAD = <<<'EOT'
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>404 Error :: Page not Found</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <meta name="viewport" content="width=device-width,initial-scale=1">

    <link rel="stylesheet" href="css/bootstrap.css">
    <style>
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
    </style>
    <link rel="stylesheet" href="css/bootstrap-responsive.css">
    <link rel="stylesheet" href="css/style.css">

    <!-- 	<link rel="stylesheet/less" href="less/style.less"> -->
    <!-- 	<script src="js/libs/less-1.2.1.min.js"></script>  -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
EOT;
  private $HTML_ERROR_BODY_START = <<<EOT
 <h1>Error 404</h1>
 <h3><em>Page you are looking for is not found on this server.</em></h3>
 <br><h2><a href="
EOT;
  private $HTML_ERROR_BODY_END = '">Return to Home Page.</a></h2>';

  public function getLoginPage() {
    $loginPage = $this->HTML_HEADER . $this->HTML_HEAD . $this->HTML_BODY_START . $this->HTML_LOGIN_FORM . $this->HTML_BODY_END;
    return $loginPage;
  }

  public function getErrorPage() {
    $errorPage = $this->HTML_HEADER . $this->HTML_ERROR_HEAD . $this->HTML_BODY_START . $this->HTML_ERROR_BODY_START . Config::getInstallPath() . $this->HTML_ERROR_BODY_END . $this->HTML_BODY_END;
    return $errorPage;
  }

}

