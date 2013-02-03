<?php

/*
 * Configuration options:
 * username and password in plane text((
 * @To-Do check username and password without using of plane text.
 */

class Config {

  private static $admin_user = 'admin';
  private static $admin_password = 'secret';
  private static $installation_basepath = '/~talbot/inplaceeditor/';

  public function getUser() {
    return self::$admin_user;
  }

  public function getPassword() {
    return self::$admin_password;
  }

  public function getInstallPath() {
    return self::$installation_basepath;
  }

}

?>
