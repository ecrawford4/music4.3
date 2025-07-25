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
                //MIDI.noteOn(1, 25, velocity, startTime+1);
                startTime += (durationMappingScale[i]*2)/tempo;
                endTime = startTime;
                MIDI.noteOff(k, pitchValue + 20, endTime );
                //MIDI.noteOff(1, 25, endTime);

                (function (x,y,z) {
                    setTimeout(function () {
                            unColorKeys();
                            colorKey(finalPitchArray[x],y);
                            document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[x] ;

                        },
                        durationMappingScaleForTimeOut[x]*2*(1000/tempo));
                })(i,k,tempo);
            }
            unColorKeys();
        }
        unColorKeys();
    }
    unColorKeys();
    document.getElementById("pitchDisplay").innerHTML = "";
    /*End play ligh*/
}

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

/**
 * 
 * @param {*} note 
 * @param {*} voiceNo 
 */
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

/**
 * clears the colors from the keys on the keyboard
 */
function unColorKeys()
{
    $(".keyWhite").css("background","#ffffff");
    $(".keyBlack").css("background","#000000");
}

var resumeF = false;

/**
 * createKeyboard function initializes the keyboard
 */
function createKeyboard(){
    var colors = document.getElementById("colors");
    var colorElements = [];
    for (var n = 0; n < 88; n++) {
        var d = document.createElement("div");
        d.style.cssFloat="left";
        d.innerHTML = MIDI.noteToKey[n + 21];
        colorElements.push(d);
        colors.appendChild(d);
    }
}