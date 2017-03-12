<?php
header('Content-Type: application/json');

if (!empty($_FILES["file"])) {

   $file = $_FILES["file"];

   $dest =  basename($file["name"]);
   move_uploaded_file($file["tmp_name"], $dest);

   echo json_encode([
        "uploaded" => true,
        "data" => [
            'url' => "http://localhost/" . $dest
        ]
    ]);

} else {
    echo json_encode([
        "uploaded" => false
    ]);
}

