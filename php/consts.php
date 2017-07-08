<?php
  const LOG_DIR ="./log/";
  const ERROR = "ERROR";
  const INFO = "INFO";
  const PROXY_CACHE_DIR = "./cache/";
  const PROXY_CACHE_EXPIRE_TIME = 86400;

  function log_message($message, $type = "ERROR") {
    date_default_timezone_set('UTC');
    $logFile = LOG_DIR . $type . ".log";
    error_log(date(DATE_ISO8601) . " " . $type . " " . $_SERVER['REMOTE_ADDR'] . " : " . $message . "\n",
                3, $logFile);
  }
?>
