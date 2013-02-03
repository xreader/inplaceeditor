<?php

/**
 *  Initializing new HTTP session 
 *  and config options 
 */
session_start();

//config
$admin_user = 'admin';
$admin_password = 'secret';

$HTML_HEADERS = '<!doctype html>
<!--[if lt IE 8]> <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="no-js ie9 oldie" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
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
  </head>';

$HTML_BODY_START = '<body>
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

      <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">';


$HTML_BODY_END = <<<'EOT'
</div><hr>
<footer><p>&copy; Company 2012</p></footer>
</div> <!-- /container -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script>
window . jQuery || document . write('<script src="js/libs/jquery-1.9.0.min.js"></script>');
</script>
<script>
  $("a").click(function() {
    window.location = this.href;
  });
</script>

<!-- script src="js/libs/bootstrap/bootstrap-transition.js"></script -->
<script src="js/libs/bootstrap/bootstrap-collapse.js"></script>
<!--[if lt IE 7 ]>
    <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
    <script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
<![endif]-->
</body>
</html>
EOT;

/**
 * Debugging application 
 */
$debug = false;
if ($debug) {
  echo "<h1>Debug</h1>";
  echo "<h3>Action: " . $_GET['action'] . "</h3>";
  if (!empty($_POST['username'])) {
    echo "<p>Log in user: " . $_POST['username'] . "</p>";
    echo "<p>Log in user password: " . $_POST['password'] . "</p>";
  }
}

if ($_GET['action'] === 'login' && empty($_POST['user']) && empty($_POST['password'])) {
  print $HTML_HEADERS;
  print $HTML_BODY_START;
  echo "<form id='login' action='server.php?action=login' method='post' accept-charset='UTF-8'>";
  echo "<fieldset>";
  echo "<legend>Login</legend>";
  echo "<input type='hidden' name='submitted' id='submitted' value='1'/>";
  echo "<label for='username' >UserName*:</label>";
  echo "<input type='text' name='username' id='username'  maxlength='50' />";
  echo "<label for='password' >Password*:</label>";
  echo "<input type='password' name='password' id='password' maxlength='50' />";
  echo "<input type='submit' name='Submit' value='Submit' />";
  echo "</fieldset>";
  echo "</form>";
  print $HTML_BODY_END;
} else if (!empty($_POST['username']) && !empty($_POST['password'])) {
  // echo '<div><p>processing login request</p>';
  if ($_POST['username'] === $admin_user && $_POST['password'] === $admin_password) {
    // echo '<p>user authentificated</p></div>';
    session_start();
    $_SESSION['user'] = $_POST['username'];
    if ($debug) {
      echo '<div class="debug"><p>user saved to session: ' . $_SESSION['user'];
      echo "<br><strong>ok</strong></p></div>";
    } else {
      echo $_SERVER['PATH_TRANSLATED'];
      header("Location: /~talbot/inplaceeditor/");
      exit;
    }
  } else {
    $host = $_SERVER['HTTP_HOST'];
    $uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
    $extra = '?action=login';
    header("Location: http://$host$uri/$extra");
    exit;
  }
} else if ($_GET['action'] === 'isloggedin') {
  session_start();
  echo (isset($_SESSION['user']) && $_SESSION['user'] === $admin_user) ? 'true' : 'false';
} else if ($_GET['action'] === 'logout') {
  session_start();
  unset($_SESSION['user']);
  session_destroy();
  if ($debug)
    echo "ok";
  else
    header("Location: /~talbot/inplaceeditor/");
} else if ($_GET['action'] == 'save') {
  session_start();
  session_regenerate_id();
//check if logged in
  if (isset($_SESSION['user']) && $_SESSION['user'] === $admin_user) {
//save changes
    echo "user found in session:" . $_SESSION['user'] . "\n";
    echo "POST name: " . $_POST['name'] . "\n";
    if (!isset($_POST['name']) or !isset($_POST['content']))
      die("failed to save!");
    $file = dirname(__FILE__) . "/" . $_POST['name'];
    echo 'filepath: ' . $file;
    $content = $_POST['content'];
    $fh = fopen($file, 'w') or die("can't open file");
    fwrite($fh, $content);
    fclose($fh);
    echo "ok";
  } else {
//echo "session?".$_SESSION['user'];
    $host = $_SERVER['HTTP_HOST'];
    $uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
    $extra = 'server.php?action=login';
    header("Location: http://$host$uri/$extra");
    exit;
  }
}
?>