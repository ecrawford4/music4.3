<?php
function set_status_500() {
    if (!headers_sent()) {
        header('HTTP/1.1 500 Internal Server Error');
    }
}

header('Content-Type: application/json; charset=utf-8');

$sourcePath = __DIR__ . '/trueBeethoven';
if (!is_readable($sourcePath)) {
    error_log('readFile.php: source not readable: ' . $sourcePath);
    set_status_500();
    echo json_encode(array('error' => 'Source file is not readable'));
    exit;
}

$result = file($sourcePath, FILE_IGNORE_NEW_LINES);
if ($result === false) {
    error_log('readFile.php: file() returned false for: ' . $sourcePath);
    set_status_500();
    echo json_encode(array('error' => 'Failed to read source file'));
    exit;
}

echo json_encode($result);