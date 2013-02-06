<?php

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
      if ($_POST['username'] === Config::getUser() and $_POST['password'] === Config::getPassword()) {
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
    } else {
      header("Location: " . Config::getInstallPath());
    }
  }

  public function duplicate() {
    if ($this->isLoggedIn() === true) {
      if (!isset($_POST['from']) or !isset($_POST['to']))
        die("Failed to save due to uupropriate pararmetres! \n");
      (string) $filename = dirname(__FILE__) . "/" . $_POST['from'];
      (string) $target = dirname(__FILE__) . "/" . $_POST['to'];
      if (file_exists($filename) === true and is_file($filename) === true and !file_exists($target)) {
        copy($filename, $target);
        echo "\n ok \n";
      } else {
        header("Location: " . Config::getInstallPath());
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

  default:
    $errorPage = new HtmlEntities();
    echo $errorPage->getErrorPage();
    break;
}
?>