var playbackState = {
    isPlaying: false,
    isPaused: false,
    currentVoiceIndex: 0,
    currentNoteIndex: 0,
    timeouts: [],
    tempo: 120,
    voicesData: []
};

function playAll(allVoices, tempo, scope) {
    stopPlayback(scope); // reset any previous run

    playbackState.isPlaying = true;
    playbackState.isPaused = false;
    playbackState.tempo = tempo;
    playbackState.currentVoiceIndex = 0;
    playbackState.currentNoteIndex = 0;
    playbackState.voicesData = allVoices;

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
            (function(voiceNo, noteIndex, pitch, startDelay) {
                var timeoutId = setTimeout(function() {
                    if (!playbackState.isPlaying || playbackState.isPaused) return;

                    unColorKeys();
                    colorKey(pitch, voiceNo);
                    scope.updatePitchDisplay(pitch);

                    playbackState.currentVoiceIndex = voiceNo;
                    playbackState.currentNoteIndex = noteIndex;
                }, startDelay);

                playbackState.timeouts.push(timeoutId);
            })(k, i, finalPitchArray[i], durationMappingScaleForTimeOut[i] * 2 * (1000 / tempo));

            startTime += (durationMappingScale[i] * 2) / tempo;
            MIDI.noteOn(k, finalPitchArray[i] + 20, velocity, startTime);
            MIDI.noteOff(k, finalPitchArray[i] + 20, startTime);
        }
    }
}

function pausePlayback() {
    playbackState.isPaused = true;
    playbackState.timeouts.forEach(clearTimeout);
    playbackState.timeouts = [];
}

function resumePlayback(allVoices, scope) {
    if (!playbackState.isPaused) return;

    playbackState.isPaused = false;
    var voiceNo = playbackState.currentVoiceIndex;
    var noteIndex = playbackState.currentNoteIndex;

    var obj = playbackState.voicesData[voiceNo];

    playFromNote(obj, voiceNo, noteIndex + 1, playbackState.tempo, scope);
}

function playFromNote(voiceObj, voiceNo, startNoteIndex, tempo, scope) {
    var velocity = 127;

    var finalPitchArray = voiceObj.finalPitchMapping.slice(startNoteIndex);
    var durationMapping = voiceObj.durationMapping.slice(startNoteIndex);

    var durationMappingScale = getDurationMappingScale(durationMapping);
    var durationMappingScaleForTimeOut = getDurationMappingScaleForTimeOut(durationMappingScale);

    var startTime = 0;

    for (var i = 0; i < finalPitchArray.length; i++) {
        (function(noteIndex, pitch, startDelay) {
            var timeoutId = setTimeout(function() {
                if (!playbackState.isPlaying || playbackState.isPaused) return;

                unColorKeys();
                colorKey(pitch, voiceNo);
                scope.updatePitchDisplay(pitch);

                playbackState.currentVoiceIndex = voiceNo;
                playbackState.currentNoteIndex = startNoteIndex + noteIndex;
            }, startDelay);

            playbackState.timeouts.push(timeoutId);
        })(i, finalPitchArray[i], durationMappingScaleForTimeOut[i] * 2 * (1000 / tempo));

        startTime += (durationMappingScale[i] * 2) / tempo;
        MIDI.noteOn(voiceNo, finalPitchArray[i] + 20, velocity, startTime);
        MIDI.noteOff(voiceNo, finalPitchArray[i] + 20, startTime);
    }
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
    if (scope && scope.clearPitchDisplay) {
        scope.clearPitchDisplay();
    }
}

function getDurationMappingScaleForTimeOut(durationMappingScale) {
    var durationMappingScaleForTimeOut = [];
    durationMappingScaleForTimeOut[0] = 0;
    for (var i = 1; i < durationMappingScale.length; i++) {
        durationMappingScaleForTimeOut[i] = durationMappingScale[i - 1] + durationMappingScaleForTimeOut[i - 1];
    }
    return durationMappingScaleForTimeOut;
}

function colorKey(note, voiceNo) {
    if (voiceNo == 0)
        $("#" + note).css("background", "#ee421f");
    else if (voiceNo == 1)
        $("#" + note).css("background", "#71ee13");
    else if (voiceNo == 2)
        $("#" + note).css("background", "#132cee");
    else if (voiceNo == 3)
        $("#" + note).css("background", "#ee19e4");
}

function unColorKeys() {
    $(".keyWhite").css("background", "#ffffff");
    $(".keyBlack").css("background", "#000000");
}
