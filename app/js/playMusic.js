var playbackState = {
    isPlaying: false,
    isPaused: false,
    currentVoiceIndex: 0,
    currentNoteIndex: 0,
    timeouts: [],
    tempo: 120
};


function playAll(allVoices, tempo, scope) {
    stopPlayback(scope);

    playbackState.isPlaying = true;
    playbackState.isPaused = false;
    playbackState.tempo = tempo;
    playbackState.currentVoiceIndex = 0;
    playbackState.currentNoteIndex = 0;

    scope.clearPitchDisplay();

    var velocity = 127;

    for (var k = 0; k < allVoices.length; k++) {
        var obj = allVoices[k];
        if (obj.muted !== 0) continue;

        var finalPitchArray = obj.finalPitchMapping;
        var durationMapping = obj.durationMapping;
        var instrument = obj.instrument;

        MIDI.programChange(k, MIDI.GM.byName[instrument.name].number);
        MIDI.setVolume(k, 127);

        var durationMappingScale = getDurationMappingScale(durationMapping);
        var durationMappingScaleForTimeOut = getDurationMappingScaleForTimeOut(durationMappingScale);

        var startTime = 0;

        for (var i = 0; i < finalPitchArray.length; i++) {
            var pitchValue = finalPitchArray[i];

            MIDI.noteOn(k, pitchValue + 20, velocity, startTime);
            startTime += (durationMappingScale[i] * 2) / tempo;
            var endTime = startTime;
            MIDI.noteOff(k, pitchValue + 20, endTime);

            (function (x, voiceNo) {
                var timeoutId = setTimeout(function () {
                    if (playbackState.isPaused || !playbackState.isPlaying) return;

                    unColorKeys();
                    colorKey(finalPitchArray[x], voiceNo);

                    scope.$apply(function () {
                        scope.updatePitchDisplay(finalPitchArray[x]);
                    });

                    playbackState.currentVoiceIndex = voiceNo;
                    playbackState.currentNoteIndex = x;
                }, durationMappingScaleForTimeOut[x] * 2 * (1000 / tempo));
                playbackState.timeouts.push(timeoutId);
            })(i, k);
        }
    }
}

function pausePlayback() {
    playbackState.isPaused = true;
    // Prevent future coloring/timeouts from executing
    playbackState.timeouts.forEach(clearTimeout);
    playbackState.timeouts = [];
}

function resumePlayback(allVoices) {
    if (!playbackState.isPlaying || !playbackState.isPaused) return;
    playbackState.isPaused = false;

    // Resume from the last known position
    var voiceIndex = playbackState.currentVoiceIndex;
    var noteIndex = playbackState.currentNoteIndex;

    // Slice from where we left off and replay
    var obj = allVoices[voiceIndex];
    var finalPitchArray = obj.finalPitchMapping.slice(noteIndex);
    var durationMapping = obj.durationMapping.slice(noteIndex);

    // Call playAll again but only with the sliced arrays
    playAll([{
        finalPitchMapping: finalPitchArray,
        durationMapping: durationMapping,
        instrument: obj.instrument,
        muted: 0
    }], playbackState.tempo);
}

function stopPlayback(scope) {
    playbackState.isPlaying = false;
    playbackState.isPaused = false;

    playbackState.timeouts.forEach(clearTimeout);
    playbackState.timeouts = [];

    for (var ch = 0; ch < 16; ch++) {
        for (var note = 0; note < 128; note++) {
            try {
                MIDI.noteOff(ch, note, 0);
            } catch (e) {}
        }
    }

    unColorKeys();

    if (scope) {
        scope.$apply(function () {
            scope.clearPitchDisplay();
        });
    }
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