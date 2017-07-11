<?php
  include 'consts.php';

  //Requests supported:
  //POST: store JSON data, respond {statehash : <statehash>}
  //GET ?state=<hashValue> : respond with the contents of the corresponding file, error if not found

  const POST_STATE_FIELD = "state";
  const POST_STATEHASH_FIELD = "statehash";
  const GET_STATE_FIELD = "s";
  const JSON_STRING_LIMIT = 100000;

  $currDir = getcwd();
  $dataDir = $currDir . "/data";
  //Post request to store state to file
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stateData = $_POST[POST_STATE_FIELD];
    if ($stateData === '') {
      http_response_code(400);
      echo "No post data found";
      exit;
    }

    //Put the state field back in
    $outputStateData = array(POST_STATE_FIELD => $stateData);

    $jsonStateData = json_encode($outputStateData);
    if (strlen($jsonStateData) > JSON_STRING_LIMIT) {
      http_response_code(500);
      log_message("State string too long :" . strlen($jsonStateData));
      echo "State string too long (>" . JSON_STRING_LIMIT . " bytes)";
      exit;
    }

    $jsonHash = hash("sha256", $jsonStateData, false);

    //save jsonStateData to file $dataDir/$jsonHash
    $filename = $dataDir . "/" . $jsonHash;
    $fileret = file_put_contents($filename, $jsonStateData);
    //on error
    if ($fileret === FALSE) {
      http_response_code(500);
      log_message("Unable to write file " . $filename);
      echo "Unable to write file " . $filename;
      exit;
    }

    $response = array(POST_STATEHASH_FIELD => $jsonHash);
    header('Content-Type: application/json');
    echo json_encode($response);
    log_message("Saved state: " . $jsonHash, INFO);
  //Get request to fetch state
  } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $getStateHash = $_GET[GET_STATE_FIELD];
    $getStateHash = filter_var(trim(strval($getStateHash)), FILTER_SANITIZE_SPECIAL_CHARS);
    if ($getStateHash === FALSE) {
      http_response_code(400);
      echo "Invalid hash";
      exit;
    }

    $filename = $dataDir . "/" . $getStateHash;

    $jsonStateData = file_get_contents($filename);
    if ($jsonStateData === FALSE) {
      http_response_code(404);
      echo "Unable to find file for state " . $getStateHash;
      exit;
    }

    //respond with contents of the file
    header('Content-Type: application/json');
    echo $jsonStateData;
  }
?>
