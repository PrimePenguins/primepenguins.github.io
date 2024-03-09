<?php
    // Get the JSON data sent from the client
    $data = file_get_contents('php://input');

    // Decode the JSON data
    $decodedData = json_decode($data);

    // Save the decoded data to a JSON file
    $file = 'saved_game.json';
    file_put_contents($file, json_encode($decodedData));

    // Response to the client
    echo 'Game data saved successfully.';
?>
