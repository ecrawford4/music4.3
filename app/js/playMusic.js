function playMusic(finalPitchArray,durationMapping,index,instrument,tempo)
{
    //var instrumentArray = {"acoustic_grand_piano": 0, "synth_drum": 118};
    var delay = 0; // play one note every quarter second
    var note = 50; // the MIDI note
    var velocity = 127; // how hard the note hits
    //var speedRate = 0.09;
    //window.alert(instrument.name +" " + instrument.no);
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
    //var finalPitchArray=[50,60,70,80,22];
    //var durationMappingScale=[1,2,3,6,1];
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
    //alert("play all");
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

            //alert(durationMappingScale);
            //End converting duration tick

            /**
             * Because the light up keyboard use timeout so it needs delta time,
             * newDurationMappingScale created for that purpose
             * For example, duration is 2,3,4,5
             * timeout needs to  be, 0, 2=2+0, 5 = 2+3, 9 = 4 +5
             */
            var durationMappingScaleForTimeOut = getDurationMappingScaleForTimeOut(durationMappingScale);


           //alert("new :" + durationMappingScaleForTimeOut);



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

function getDurationMappingScale(durationMapping)
{
    /* Convert durationMapping into tick temp
     * Because original 0 in duration will not be play so it should be mapped to music tick
     * */
    var noteDurations = [2,3,4,6,8,12,16,24,32,48];
    var durationMappingScale = new Array(durationMapping.length);
    for(var i = 0; i< durationMappingScale.length ; i++)
    {
        durationMappingScale[i] = noteDurations[durationMapping[i]];
    }
    return durationMappingScale;
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

function playAll2(allVoices,tempo)
{
    //alert(gl);
    /*
    var delay = 0; // play one note every quarter second
    var note = 80; // the MIDI note
    var velocity = 127; // how hard the note hits
    // play the note
    MIDI.programChange(0,0);
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, 0);
    MIDI.noteOff(0, note, 10);
    */
    song.push("data:audio/mid;base64,TVRoZAAAAAYAAQACABhNVHJrAAAAEwD/WAQEAhgIAP9RAw9CQAD/LwBNVHJrAAAAVwDAAQCQFngCgBZ4AJAfeAOAH3gAkCl4A4ApeACQM3gEgDN4AJA8eAaAPHgAkEZ4DIBGeACQT3gDgE94AJBZeBCAWXgAkGN4AoBjeACQbHgQgGx4AP8vAA==");
    player = MIDI.Player;
    player.timeWarp = 1; // speed the song is played back
    player.loadFile(song[songid++ % song.length]);
    player.start();
    var d = document.getElementById("pausePlayStop");

    if(player.playing)
    {
        d.src = "./img/pause.png";
    }else {
        d.src = "./img/play.png";
    }

}

function pause() {

    MIDI.Player.pause(true);
}

function resume() {
    MIDI.Player.resume();
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

function pausePlayStop(tempo,stop,loadData) {
    //d.src = "./img/pause.png";
    //alert(loadData);
    //console.log(loadData);
    var d = document.getElementById("playPauseBtn");
    d.src = "./img/pause.png";
   if(typeof player === 'undefined' || player.currentTime == player.endTime ||player.currentTime == 0 )
   {
       song.pop();
       var songData = "data:audio/mid;base64,"+loadData;
       //song.push("data:audio/mid;base64,TVRoZAAAAAYAAQACABhNVHJrAAAAEwD/WAQEAhgIAP9RAw9CQAD/LwBNVHJrAAAAVwDAAQCQFngCgBZ4AJAfeAOAH3gAkCl4A4ApeACQM3gEgDN4AJA8eAaAPHgAkEZ4DIBGeACQT3gDgE94AJBZeBCAWXgAkGN4AoBjeACQbHgQgGx4AP8vAA==");
       song.push(songData);
       player = MIDI.Player;
       player.timeWarp = 1; // speed the song is played back
       player.BPM = tempo;
       player.loadFile(song[0]);
       /// load up the piano keys

       MIDI.loader = new sketch.ui.Timer;

       var colors = document.getElementById("colors");
       colors.textContent = '';
       var colorElements = [];
       for (var n = 0; n < 88; n++) {
           var d = document.createElement("div");
           d.style.cssFloat="left";
           d.innerHTML = MIDI.noteToKey[n + 21];


            if(colorElements.length <= 88 ){
                colorElements.push(d);
                colors.appendChild(d);
            }

       }

       var colorMap = MIDI.Synesthesia.map();

       player.addListener(function(data) {
           var pianoKey = data.note - 21;
           var d = colorElements[pianoKey];
           if (d) {
               if (data.message === 144) {
                   var map = colorMap[data.note - 27];
                   if (map) d.style.background = map.hex;
                   d.style.color = "#fff";
               } else {
                   d.style.background = "";
                   d.style.color = "";
               }
           }
       });

       MIDIPlayerPercentage(player);
   }

   if(stop)
   {
       player.stop();
       d.src = "./img/play.png";
   }else {
       if(player.playing)
       {
           player.pause();
           d.src = "./img/play.png";
       }else {
           console.log("stop :" + stop);
           d.src = "./img/pause.png";
           player.start();

       }


   }
}

var MIDIPlayerPercentage = function(player) {
    // update the timestamp
    var time1 = document.getElementById("time1");
    var time2 = document.getElementById("time2");
    var capsule = document.getElementById("capsule");
    var timeCursor = document.getElementById("cursor");
    //
    eventjs.add(capsule, "drag", function(event, self) {
        eventjs.cancel(event);
        player.currentTime = (self.x) / 420 * player.endTime;
        if (player.currentTime < 0) player.currentTime = 0;
        if (player.currentTime > player.endTime) player.currentTime = player.endTime;
        if (self.state === "down") {
            player.pause(true);
        } else if (self.state === "up") {
            player.resume();
        }
    });
    //
    function timeFormatting(n) {
        var minutes = n / 60 >> 0;
        var seconds = String(n - (minutes * 60) >> 0);
        if (seconds.length == 1) seconds = "0" + seconds;
        return minutes + ":" + seconds;
    };

    player.setAnimation(function(data, element) {
        var percent = data.now / data.end;
        var now = data.now >> 0; // where we are now
        var end = data.end >> 0; // end of song
        if (now === end) { // go to next song
            var id = ++songid % song.length;
            //player.loadFile(song[id], player.start); // load MIDI
        }
        // display the information to the user
        timeCursor.style.width = (percent * 100) + "%";
        time1.innerHTML = timeFormatting(now);
        time2.innerHTML = "-" + timeFormatting(end - now);
    });
};


// Begin loading indication.

var player;
// MIDI files from Disklavier World
var songid = 0;
var song =
    [
    ];