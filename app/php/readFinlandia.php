<?php
//echo 123;
$file_handle = fopen("Finlandia", "r");
//$result = array();
$result="";
while (!feof($file_handle)) {
    $line = fgets($file_handle);

    //$line = str_replace(array("\r", "\n"), '', $line);
    //echo $line;
    $result[] = $line;
    //$result += $line;
}

fclose($file_handle);
//echo $result;
echo json_encode($result);
?>