<?php
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
    $response = curl_helper($url);
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
    curl_setopt($ch,CURLOPT_ENCODING , ""); //accept all encodings
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);

    $response = curl_exec($curl);

    curl_close($curl);

    return $response;
  }
 ?>
