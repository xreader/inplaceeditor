<?php

/*
 * Configuration options:
 * username, password and server installation path.
 */

class Config {

  const ADMIN_USER = 'admin';
  const ADMIN_PASSWORD = 'secret';
  const INSTALLATION_BASEPATH = 'http://localhost/~talbot/inplaceeditor/';

  public function getUser() {
    return self::ADMIN_USER;
  }

  public function getPassword() {
    return self::ADMIN_PASSWORD;
  }

  public function getInstallPath() {
    return self::INSTALLATION_BASEPATH;
  }

}

?>
