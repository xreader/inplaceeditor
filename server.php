<?php

require_once 'config.inc';
require_once 'htmlEntities.inc';

class Server {

  public $get_action = '';
  private $config;

  public function __construct() {
    $this->get_action = $_GET['action'];
    $this->config = new Config();
  }

  public function login() {
    if (!empty($_POST['username']) and !empty($_POST['password'])) {
      if ($_POST['username'] === $this->config->getUser() and $_POST['password'] === $this->config->getPassword()) {
        session_start();
        $_SESSION['user'] = $_POST['username'];
        header("Location: " . $this->config->getInstallPath());
        exit;
      }
    }
  }

  public function logout() {
    session_start();
    unset($_SESSION['user']);
    session_destroy();
    header("Location: " . $this->config->getInstallPath());
    exit;
  }

  public function isLoggedIn() {
    session_start();
    if (isset($_SESSION['user']) and $_SESSION['user'] === $this->config->getUser()) {
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
      $file = dirname(__FILE__) . "/" . $_POST['name'];
      $content = $_POST['content'];
      $fh = fopen($file, 'w') or die("can't open file \n");
      fwrite($fh, stripcslashes($content));
      fclose($fh);
      echo "\n ok \n";
    } else {
      header("Location: " . $this->config->getInstallPath());
    }
  }

  public function duplicate() {
    if ($this->isLoggedIn() === true) {
      if (!isset($_POST['from']) or !isset($_POST['to']))
        die("Failed to save due to uupropriate pararmetres! \n");
      $filename = dirname(__FILE__) . "/" . $_POST['from'];
      $target = dirname(__FILE__) . "/" . $_POST['to'];
      if (file_exists($filename) === true and is_file($filename) === true and !file_exists($target)) {
        copy($filename, $target);
        echo "\n ok \n";
      } else {
        header("Location: " . $this->config->getInstallPath());
      }
    }
  }

  public function mkdir() {
    if ($this->isLoggedIn() === true) {
      if (!isset($_POST['dirname']))
        die("No directory name provided! \n");
      $newDirname = dirname(__FILE__) . "/" . $_POST['dirname'];
      if (!file_exists($newDirname)) {
        mkdir($newDirname, 0777);
        echo "\n Directory created \n";
      } else {
        header("Location: " . $this->config->getInstallPath());
      }
    }
  }

}

(object) $server = new Server();
switch ($server->get_action) {
  case 'login':
    $server->login();
    (object) $loginPage = new HtmlEntities();
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
    (object) $errorPage = new HtmlEntities();
    echo $errorPage->getErrorPage();
    break;
}
?>