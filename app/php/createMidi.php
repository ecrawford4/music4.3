<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

if (!isset($_POST['notedata']) || $_POST['notedata'] === '') {
    http_response_code(400);
    exit('Missing notedata');
}

$midiClassPath = __DIR__ . '/midi.class.php';
if (!is_file($midiClassPath)) {
    http_response_code(500);
    exit('MIDI library missing');
}

require_once $midiClassPath;

try {
    $txt = (string) $_POST['notedata'];
    $midi = new Midi();
    $midi->importTxt($txt);
    $destFilename = 'output3A.mid';
    $midi->downloadMidFile($destFilename);
} catch (Exception $e) {
    http_response_code(500);
    exit('Failed to create MIDI');
}
?>
