<?php
function set_status($code, $text) {
    if (!headers_sent()) {
        header('HTTP/1.1 ' . $code . ' ' . $text);
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log('createMidi.php: invalid request method: ' . $_SERVER['REQUEST_METHOD']);
    set_status(405, 'Method Not Allowed');
    exit('Method Not Allowed');
}

if (!isset($_POST['notedata']) || $_POST['notedata'] === '') {
    error_log('createMidi.php: missing notedata payload');
    set_status(400, 'Bad Request');
    exit('Missing notedata');
}

$midiClassPath = __DIR__ . '/midi.class.php';
if (!is_file($midiClassPath)) {
    error_log('createMidi.php: missing MIDI class at ' . $midiClassPath);
    set_status(500, 'Internal Server Error');
    exit('MIDI library missing');
}

require_once $midiClassPath;

set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    $txt = (string) $_POST['notedata'];
    $txt = str_replace("\r", '', $txt);
    $txt = trim($txt) . "\n";

    $midi = new Midi();
    $midi->importTxt($txt);

    $binaryMidi = $midi->getMid();
    if ($binaryMidi === '' || $binaryMidi === false) {
        throw new Exception('MIDI generation returned empty data');
    }

    $destFilename = 'output3A.mid';

    header('Content-Type: application/octet-stream');
    header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
    header('Content-Disposition: attachment; filename="' . $destFilename . '"');
    header('Pragma: no-cache');
    header('Content-Length: ' . strlen($binaryMidi));

    echo $binaryMidi;
} catch (Exception $e) {
    error_log('createMidi.php: ' . $e->getMessage());
    set_status(500, 'Internal Server Error');
    exit('Failed to create MIDI');
}

restore_error_handler();
?>
