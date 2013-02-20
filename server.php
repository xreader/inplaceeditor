<?php

/**
 * @todo Write documentation to server implementation.
 * @author Dmitry Tretyakov <d.tretyakov@me.com>
 * @version 0.2
 */
require_once 'config.inc';
require_once 'htmlEntities.inc';

class Server {

  public $get_action = '';

  public function __construct() {
    $this->get_action = $_GET['action'];
    $this->config = new Config();
  }

  public function login() {
    if (!empty($_POST['username']) and !empty($_POST['password'])) {
      if ($_POST['username'] === Config::getUser() and sha1('#1_' . $_POST["password"] . '+%6') === Config::getPassword()) {
        session_start();
        (string) $_SESSION['user'] = $_POST['username'];
        header("Location: " . Config::getInstallPath());
        exit;
      }
    }
  }

  public function logout() {
    session_start();
    unset($_SESSION['user']);
    session_destroy();
    header("Location: " . Config::getInstallPath());
    exit;
  }

  public function isLoggedIn() {
    session_start();
    if (isset($_SESSION['user']) and $_SESSION['user'] === Config::getUser()) {
      echo "true";
      return true;
    } else {
      echo "false";
      return false;
    }
    exit;
  }

  public function save() {
    if ($this->isLoggedIn() === true) {
      if (!isset($_POST['name']) or !isset($_POST['content']))
        die("failed to save! \n");
      (string) $file = dirname(__FILE__) . "/" . $_POST['name'];
      (string) $content = $_POST['content'];
      $fh = fopen($file, 'w') or die("can't open file \n");
      fwrite($fh, stripcslashes($content));
      fclose($fh);
      echo "\n ok \n";
      return true;
    } else {
      header("Location: " . Config::getInstallPath());
      return false;
    }
  }

  public function duplicate() {
    if ($this->isLoggedIn() === true) {
      if (!isset($_POST['from']) or !isset($_POST['to']))
        die("Failed to save. \n");
      (string) $filename = dirname(__FILE__) . "/" . $_POST['from'];
      (string) $target = dirname(__FILE__) . "/" . $_POST['to'];
      (string) $basepath = '<head>' . "\n" . '<base href="' . Config::getInstallPath() . '" />';
      if (file_exists($filename) === true and is_file($filename) === true and !file_exists($target)) {
        $doc = file_get_contents($filename);
        file_put_contents($target, str_replace('<head>', $basepath, $doc));
        echo "\n File succesfully copied. \n";
        return true;
      } else {
        header("Location: " . Config::getInstallPath());
        return false;
      }
    }
  }

  public function mkdir() {
    if ($this->isLoggedIn() === true) {
      if (!isset($_POST['dirname']))
        die("No directory name provided! \n");
      (string) $newDirname = dirname(__FILE__) . "/" . $_POST['dirname'];
      if (!file_exists($newDirname)) {
        mkdir($newDirname, 0777);
        echo "\n Directory created \n";
      } else {
        header("Location: " . Config::getInstallPath());
      }
    }
  }

  public function create() {
    if ($this->isLoggedIn() === TRUE) {
      echo 'Start debugging';
      if (!isset($_POST['name']) or !isset($_POST['template']) or !isset($_POST['theme']))
        die('No filename provided!');

      echo "Post values privided";

      (string) $target = dirname(__FILE__) . "/" . $_POST['name'];
      (string) $filename = 'data/layout/' . $_POST['template'] . '.html';
      (string) $theme = $_POST['theme']['cssMin'];
      (string) $basepath = '<head>' . "\n" . '<base href="' . Config::getInstallPath() . '" />';
      if (file_exists($filename) === true and is_file($filename) === true and !file_exists($target)) {
        $doc = file_get_contents($filename);
        file_put_contents($target, str_replace('<head>', $basepath, str_replace('$bootstrap_css$', $theme, $doc)));
        echo 'HTML Written';
        return TRUE;
      } else {
        header("Location: " . Config::getInstallPath());
        return FALSE;
      }
    }
  }

}

$server = new Server();
switch ($server->get_action) {

  case 'login':
    $server->login();
    $loginPage = new HtmlEntities();
    echo $loginPage->getLoginPage();
    break;

  case 'logout':
    $server->logout();
    break;

  case 'save':
    $server->save();
    break;

  case 'isloggedin':
    $server->isLoggedIn();
    break;

  case 'duplicate':
    $server->duplicate();
    break;

  case 'mkdir':
    $server->mkdir();
    break;

  case 'create':
    $server->create();
    break;

  default:
    $errorPage = new HtmlEntities();
    echo $errorPage->getErrorPage();
    break;
}
?>