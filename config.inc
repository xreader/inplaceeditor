<?php

/*
 * Configuration options:
 * username, password and server installation path.
 */

class Config {

  /**
   * Page/site administration and location information.
   * 
   * @staticvar String ADMIN_USER Administrator's login name
   * @staticvar String ADMIN_PASSWORD Administrator's password, both in plain text
   * @staticvar String INSTALLATION_BASEPATH Location of server.php file. 
   * Localhost by default.
   */
  private static $ADMIN_USER = 'admin';
  // SHA-1 Hash for secret
  private static $ADMIN_PASSWORD = '25d563e27fea7bd403527fdbb64b6727fd0c853c';
  private static $INSTALLATION_BASEPATH = 'http://localhost/';

  /**
   * Simple static getters for config.
   * 
   * @return String Returns Admin user name
   */
  public static function getUser() {
    return self::$ADMIN_USER;
  }

  /**
   * 
   * @return String Returns Admin password
   */
  public static function getPassword() {
    return self::$ADMIN_PASSWORD;
  }

  /**
   * 
   * @return String Returns Installation Basepath
   */
  public static function getInstallPath() {
    return self::$INSTALLATION_BASEPATH;
  }

}

