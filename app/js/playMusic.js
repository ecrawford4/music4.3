function playMusic(finalPitchArray,durationMapping,index,instrument,tempo)
{
    //var instrumentArray = {"acoustic_grand_piano": 0, "synth_drum": 118};
    var delay = 0; // play one note every quarter second
    var note = 50; // the MIDI note
    var velocity = 127; // how hard the note hits
    //var speedRate = 0.09;
    //MIDI.programChange(index, instrument.no); // set channel index to instrument value in array
    //MIDI.programChange(index, 24);
    //window.alert(MIDI.GM.byName[instrument.name].number);
    MIDI.programChange(index, MIDI.GM.byName[instrument.name].number);
    MIDI.setVolume(index, 127);
    //MIDI.programChange(0, 0); // set channel 0 to piano
    //MIDI.programChange(0, 118); // set channel 1 to guitar
    // play the note
    //MIDI.Player.BPM = 500;
    //MIDI.setVolume(0, 127);
    //MIDI.setVolume(1, 127);


    var startTime = 0;
    var endTime = 0;

    /* Convert durationMapping into tick temp
     * Because original 0 in duration will not be play so it should be mapped to music tick
     * */
    var noteDurations = [2,3,4,6,8,12,16,24,32,48];
    var durationMappingScale = new Array(durationMapping.length);
    for(var i = 0; i< durationMappingScale.length ; i++)
    {
        durationMappingScale[i] = noteDurations[durationMapping[i]];
    }

    //End converting duration tick


    for(var i = 0 ; i< finalPitchArray.length ; i++)
    {
        var pitchValue = finalPitchArray[i];

        if(isNaN(pitchValue)){
            //pitchValue == 150;
            startTime += durationMappingScale[i]/tempo;
            endTime = startTime;
        }else {
            MIDI.noteOn(index, pitchValue+20, velocity, startTime); //set tempo faster hardcode now, later change algorithm
            // MIDI.noteOn(1, 25, velocity, startTime+1);
            //track.add(createNoteOnEvent(pitchValue+20, startTime));
            startTime += durationMappingScale[i]/tempo;
            endTime = startTime;
            MIDI.noteOff(index, pitchValue + 20, endTime);
        }
    }
}

function playAll(allVoices,tempo)
{
    //var instrumentArray = {"acoustic_grand_piano": 0, "synth_drum": 118};
    var velocity = 127; // how hard the note hits
    //var speedRate = 0.09;
    var speedRate = 2;
    for(var k = 0; k < allVoices.length; k++)
    {
        var obj = allVoices[k];
        var muted = obj.muted;
        if(muted == 0)
        {

            var finalPitchArray = obj.finalPitchMapping;
            var durationMapping = obj.durationMapping;
            var instrument = obj.instrument;
            //MIDI.programChange(index, instrument.no);
            MIDI.programChange(k, MIDI.GM.byName[instrument.name].number);
            MIDI.setVolume(k, 127);

            var startTime = 0;
            var endTime = 0;
            /* Convert durationMapping into tick temp
             * Because original 0 in duration will not be play so it should be mapped to music tick
             * */
            var durationMappingScale = getDurationMappingScale(durationMapping);
            //End converting duration tick

            /**
             * Because the light up keyboard use timeout so it needs delta time,
             * newDurationMappingScale created for that purpose
             * For example, duration is 2,3,4,5
             * timeout needs to  be, 0, 2=2+0, 5 = 2+3, 9 = 4 +5
             */
            var durationMappingScaleForTimeOut = getDurationMappingScaleForTimeOut(durationMappingScale);

            for(var i = 0 ; i< finalPitchArray.length ; i++)
            {
                var pitchValue = finalPitchArray[i];
                MIDI.noteOn(k, pitchValue+20, velocity, startTime ); //set tempo faster hardcode now, later change algorithm
                // MIDI.noteOn(1, 25, velocity, startTime+1);
                startTime += durationMappingScale[i]/tempo;
                endTime = startTime;
                MIDI.noteOff(k, pitchValue + 20, endTime );
                //MIDI.noteOff(1, 25, endTime);

                (function (x,y,z) {
                    setTimeout(function () {
                            unColorKeys();
                            colorKey(finalPitchArray[x],y);
                            document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[x] ;

                        },
                        durationMappingScaleForTimeOut[x]*(1000/tempo));
                })(i,k,tempo);

            }


        }

    }
/*
    var voice_combine = [[1,1],[23,18],[0,18],[45,0],[0,28],[66,0],[0,35],[88,0],[0,45],[0,57],[0,66],[0,78],[0,88]];
    var timeout_combine = [[0,0],[6,6],[0,15],[18,0],[0,27],[30,0],[0,45],[54,0],[0,69],[0,105],[0,153],[0,159],[0,168]];
    for(var i = 0; i < 13; i ++)
    {
        var voiceE = voice_combine[i];
        var timeOutE = timeout_combine[i];
        alert("here");
        for(var j = 0; j<2; j++)
        {
            (function () {
                setTimeout(function () {
                        //alert("here")
                        unColorKeys();
                        colorKey(voiceE[0],0);
                        document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +voiceE[0] ;

                    },
                    timeOutE[0]*(1000/10));
            })();
        }


    }
*/
    /*
    * Play light
    * */


    /*
    for (var i = 0 ; i< finalPitchArray.length ; i++) {
        (function(index) {
            setTimeout(function()
                {
                    unColorKeys();
                    colorKey(index);
                    document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[index] ;
                    //document.getElementById("durationDisplay").innerHTML = document.getElementById("durationDisplay").innerHTML +"4,";
                },
                durationMappingScale[i] * 1000);
        })(i);
    }
    */

    /**
     * Process for timeout duration. newDurationMappingScale is cummulated duratio
     */


    //alert(durationMappingScale);
    /*
        for (var i = 0 ; i< finalPitchArray.length ; i++) {
            (function (x) {
                setTimeout(function () {
                    unColorKeys();
                    colorKey(finalPitchArray[x]);
                    document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[x] ;

                },
                    newDurationMappingScale[x]*1000);
            })(i);
        }
*/
    //unColorKeys();
    document.getElementById("pitchDisplay").innerHTML = "";
    /*End play ligh*/
}

/* Convert durationMapping into tick temp
     * Because original 0 in duration will not be play so it should be mapped to music tick
     * */
/*
function getDurationMappingScale(durationMapping)
{

    var noteDurations = [2,3,4,6,8,12,16,24,32,48];
    var durationMappingScale = new Array(durationMapping.length);
    for(var i = 0; i< durationMappingScale.length ; i++)
    {
        durationMappingScale[i] = noteDurations[durationMapping[i]];
    }
    return durationMappingScale;
}
*/
function getDurationMappingScaleForTimeOut(durationMappingScale)
{
    var durationMappingScaleForTimeOut = [];
    durationMappingScaleForTimeOut[0] = 0;
    for(var i = 1 ; i< durationMappingScale.length ; i++)
    {
        durationMappingScaleForTimeOut[i] = durationMappingScale[i-1] + durationMappingScaleForTimeOut[i-1];
    }
    return durationMappingScaleForTimeOut;
}

function colorKey(note,voiceNo)
{
    if(voiceNo == 0)
        $("#"+note).css("background","#ee421f");
    else if(voiceNo == 1)
        $("#"+note).css("background","#71ee13");
    else if(voiceNo == 2)
        $("#"+note).css("background","#132cee");
    else if(voiceNo == 3)
        $("#"+note).css("background","#ee19e4");
}

function unColorKeys()
{
    $(".keyWhite").css("background","white");
    $(".keyBlack").css("background","black");
}


var resumeF = false;

function createKeyboard(){
    var colors = document.getElementById("colors");
    var colorElements = [];
    for (var n = 0; n < 88; n++) {
        var d = document.createElement("div");
        d.style.cssFloat="left";
        d.innerHTML = MIDI.noteToKey[n + 21];
        colorElements.push(d);
        colors.appendChild(d);
        /*
        if(colorElements.length <= 88 ){

        }*/

    }
}