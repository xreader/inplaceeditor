<?php

/*
 * Configuration options:
 * username, password and server installation path.
 */

class Config {

  const ADMIN_USER = 'admin';
  const ADMIN_PASSWORD = 'secret';
  const INSTALLATION_BASEPATH = 'http://localhost/~talbot/inplaceeditor/';

  public static function getUser() {
    return self::ADMIN_USER;
  }

  public static function getPassword() {
    return self::ADMIN_PASSWORD;
  }

  public static function getInstallPath() {
    return self::INSTALLATION_BASEPATH;
  }

}

?>
