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
      if ($_POST['username'] == $this->config->getUser() and $_POST['password'] == $this->config->getPassword()) {
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
      fwrite($fh, $content);
      fclose($fh);
      echo "\n ok \n";
    } else {
      header("Location: " . $this->config->getInstallPath());
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

  default:
    (object) $errorPage = new HtmlEntities();
    echo $errorPage->getErrorPage();
    break;
}
?>