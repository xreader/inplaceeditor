<?php

    //config
    $admin_user = 'admin';
    $admin_password = 'secret';

    //debug
    $debug = false;
    if ( $debug ) {
        echo "<p>Debug</p>";
        echo "<p>Action:".$_GET['action']."</p>";
        if (!empty($_POST['username'])) {
            echo "<p>Log in user:".$_POST['username']."</p>";
            echo "<p>Log in user:"."Password:".$_POST['password']."</p>";
        }
    }

    if ( $_GET['action'] == 'login' && empty( $_POST['user'] ) && empty( $_POST['password'] ) ) {
        echo "<html>";
        echo "<body>";
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
        echo "</body>";
        echo "</html>";
    } else if ( !empty( $_POST['username'] ) && !empty( $_POST['password'] ) ) {
        echo 'processing login request';
        if ( $_POST['username'] == $admin_user && $_POST['password'] == $admin_password ) {
            echo 'user authentificated';
            session_start();
            $_SESSION['user'] = $_POST['username'];
            if ( $debug ) {
                echo "user saved to session:".$_SESSION['user'];
                echo "ok";
            }else{
                header("Location: /");
            }
        } else {
            $host  = $_SERVER['HTTP_HOST'];
            $uri  = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
            $extra = 'server.php?action=login';
            header("Location: http://$host$uri/$extra");
            exit;
        }
    } else if ($_GET['action'] == 'isloggedin') {
        session_start();
        echo (isset( $_SESSION['user'] ) && $_SESSION['user'] == $admin_user)?'true':'false';
    } else if ($_GET['action'] == 'logout') {
        session_start();
        unset($_SESSION['user']);
        session_destroy();
        if ( $debug )
            echo "ok";
        else
            header("Location: /");
    } else if ($_GET['action'] == 'save') {
         session_start();
         session_regenerate_id();
         //check if logged in
        if ( isset( $_SESSION['user'] ) && $_SESSION['user'] == $admin_user ) {
            //save changes
            echo "user found in session:".$_SESSION['user']."\n";
            if (!isset($_POST['name']) || !isset($_POST['content']))
                die("failed to save!");
            $file = dirname(__FILE__)."/".$_POST['name'];
            echo 'filepath:'.$file;
            $content = $_POST['content'];
            echo "saving changes to:".$file."\n".$content;
            $fh = fopen($file, 'w') or die("can't open file");
            fwrite($fh, $content);
            fclose($fh);
            echo "ok";
        } else {
            //echo "session?".$_SESSION['user'];
            $host  = $_SERVER['HTTP_HOST'];
            $uri  = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
            $extra = 'server.php?action=login';
            header("Location: http://$host$uri/$extra");
            exit;
        }
    }
?>

