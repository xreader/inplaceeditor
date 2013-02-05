<?php

/*
 * Configuration options:
 * username and password in plain text((
 */

class Config {

  const ADMIN_USER = 'admin';
  const ADMIN_PASSWORD = 'secret';
  const INSTALLATION_BASEPATH = '/~talbot/inplaceeditor/';

  public $is_logged_in = false;

  public function getUser() {
    return self::ADMIN_USER;
  }

  public function getPassword() {
    return self::ADMIN_PASSWORD;
  }

  public function getInstallPath() {
    return self::INSTALLATION_BASEPATH;
  }

  public function getLoggedIn() {
    return $this->is_logged_in;
  }

  public function setLoggedIn($bool) {
    $this->is_logged_in = $bool;
  }

}

?>
