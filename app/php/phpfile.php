<?php
    //echo "1234";

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$rawData = $request->rawData;
    //@$pass = $request->pass;


    require('./midi.class.php');

    //echo $txt;
    //echo '\r\n \r\n';
    $midi = new Midi();
    //echo "midi made";

    $midi->importTxt($rawData);
    //echo $midi->getTrackCount();
    //$destFilename  = 'output3A.mid';
    //echo $destFilename;

    ///$tracks=$midi->tracks();
    echo base64_encode($midi->getMid());
    //$midi->downloadMidFile($destFilename); //not from a midi file
    //echo $email;
    //print_r($email);

?>