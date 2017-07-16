<?php
  include 'consts.php';
  //expected get parameter is ?path=/data/XXX.json
  //example: ?path=/data/modules.json
  //see https://github.com/smurfy/mwo-api-sample/tree/master/api-sample
  //for details on smurfy api paths
  $options = array (
    'host' => 'https://mwo.smurfy-net.de/api/',
    'pathParam' => 'path'
  );

  $pathParam = isset($_GET[$options['pathParam']]) ? $_GET[$options['pathParam']] : '';

  //gzip response
  //reference: https://stackoverflow.com/questions/19043284/how-to-get-send-gzip-content-as-php-response
  ob_start("ob_gzhandler");

  if ($pathParam != '') {
    $url = $options['host'] . $pathParam;
    //sanity check on path so get requests can't read outside the php data directory
    $ret = preg_match("/^data\/[^\.]+\.json$/", $pathParam, $matches);
    if (!$ret) {
      http_response_code(400);
      echo "Unexpected path: " . $pathParam;
      log_message("Unexpected path" . $pathParam);
      exit;
    }
    //try to get file from cache
    $response = getFromCache($pathParam);
    if ($response == FALSE) {
      $http_response = curl_helper($url);
      log_message("File loaded from smurfy: " . $url, INFO);
      if ($http_response['code'] == 200) {
        $response = $http_response['response'];
        writeToCache($pathParam, $response);
      } else {
        http_response_code($http_response['code']);
        log_message("Error fetching " . $pathParam);
        echo $http_response['response'];
        exit;
      }
    }
    //respond
    header('Content-Type: application/json');
    echo $response;
  } else {
    echo "{'error' : 'no path parameter provided'}";
  }

  ob_end_flush(); //gzip response

  function curl_helper($url) {
    $curl = curl_init();

    $headers = array('Content-Type: application/json');

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl,CURLOPT_ENCODING , ""); //accept all encodings
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);

    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    return array(
      'code' => $httpcode,
      'response' => $response
    );
  }

  //Cache results from smurfy. Cache expiry time is set to 1 day (see consts.php)
  function getFromCache($path) {
    $cacheFile = PROXY_CACHE_DIR . $path;
    if (!file_exists($cacheFile)) {
      log_message("Cache file not found: " .$cacheFile, INFO);
      return false;
    }
    $mtime = filemtime($cacheFile);
    if (!$mtime) {
      log_message("Cache file modify time error: " .$cacheFile);
      return FALSE;
    }
    if (time() - $mtime > PROXY_CACHE_EXPIRE_TIME) {
      log_message("Cache file expired: " . $cacheFile, INFO);
      return FALSE;
    }
    return file_get_contents($cacheFile);
  }
  function writeToCache($path, $contents) {
    $cacheFile = PROXY_CACHE_DIR . $path;
    if (!file_exists(dirname($cacheFile))) {
      mkdir(dirname($cacheFile), 0755, true);
    }
    $ret = file_put_contents($cacheFile, $contents);
    if ($ret == FALSE) {
      log_message("Error writing cache file " . $cacheFile, ERROR);
    }
    log_message("File written to cache: " . $cacheFile, INFO);
  }
 ?>
