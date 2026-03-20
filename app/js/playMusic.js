var playbackState = {
    isPlaying: false,
    isPaused: false,
    timeouts: [],
    tempo: 120,
    voicesData: [],
    voiceStates: [],
    scope: null,
    activeNoteByVoice: {},
    activeVoicesByNote: {}
};

var voiceColors = ["#ee421f", "#71ee13", "#132cee", "#ee19e4", "#f5a623", "#1fbad6", "#7b61ff", "#ff6f91"];

function playAll(allVoices, tempo, scope) {
    stopPlayback(scope); // reset any previous run

    var safeTempo = normalizeTempo(tempo);

    playbackState.isPlaying = true;
    playbackState.isPaused = false;
    playbackState.tempo = safeTempo;
    playbackState.voicesData = allVoices || [];
    playbackState.voiceStates = [];
    playbackState.scope = scope || null;
    playbackState.activeNoteByVoice = {};
    playbackState.activeVoicesByNote = {};

    var velocity = 127;

    for (var k = 0; k < playbackState.voicesData.length; k++) {
        var obj = playbackState.voicesData[k];
        if (!obj || obj.muted) continue;

        var finalPitchArray = obj.finalPitchMapping || [];
        var durationMapping = obj.durationMapping;
        var instrument = obj.instrument || {};
        if (!finalPitchArray.length) continue;

        if (instrument.name && MIDI.GM.byName[instrument.name]) {
            MIDI.programChange(k, MIDI.GM.byName[instrument.name].number);
        }
        MIDI.setVolume(k, 127);

        var durationMappingScale = getDurationMappingScale(durationMapping);
        var voiceState = {
            voiceNo: k,
            notes: finalPitchArray,
            durationScale: durationMappingScale,
            nextNoteIndex: 0,
            timerId: null,
            nextDueAt: 0,
            waitUntilNextMs: 0,
            velocity: velocity,
            completed: false
        };

        playbackState.voiceStates.push(voiceState);
        scheduleNextNoteForVoice(voiceState, 0);
    }

    if (!playbackState.voiceStates.length) {
        playbackState.isPlaying = false;
        playbackState.isPaused = false;
    }
}

function scheduleNextNoteForVoice(voiceState, delayMs) {
    if (!playbackState.isPlaying || playbackState.isPaused || voiceState.completed) return;

    var timerId = setTimeout(function() {
        removeTimer(timerId);
        voiceState.timerId = null;

        if (!playbackState.isPlaying || playbackState.isPaused) return;

        if (voiceState.nextNoteIndex >= voiceState.notes.length) {
            voiceState.completed = true;
            finalizePlaybackIfFinished();
            return;
        }

        var noteIndex = voiceState.nextNoteIndex;
        var pitch = voiceState.notes[noteIndex];

        setVoiceActiveNote(voiceState.voiceNo, pitch);
        updatePitchDisplaySafe(playbackState.scope, pitch, voiceState.voiceNo);

        MIDI.noteOn(voiceState.voiceNo, pitch + 20, voiceState.velocity, 0);
        MIDI.noteOff(voiceState.voiceNo, pitch + 20, 0);

        voiceState.nextNoteIndex = noteIndex + 1;

        if (voiceState.nextNoteIndex >= voiceState.notes.length) {
            voiceState.completed = true;
            clearVoiceActiveNote(voiceState.voiceNo);
            finalizePlaybackIfFinished();
            return;
        }

        var durationValue = voiceState.durationScale[noteIndex];
        var nextDelayMs = getDelayMsFromDuration(durationValue, playbackState.tempo);

        voiceState.waitUntilNextMs = nextDelayMs;
        scheduleNextNoteForVoice(voiceState, nextDelayMs);
    }, delayMs);

    voiceState.timerId = timerId;
    voiceState.nextDueAt = Date.now() + delayMs;
    voiceState.waitUntilNextMs = delayMs;
    playbackState.timeouts.push(timerId);
}

function pausePlayback() {
    if (!playbackState.isPlaying || playbackState.isPaused) return;

    playbackState.isPaused = true;

    var now = Date.now();
    for (var i = 0; i < playbackState.voiceStates.length; i++) {
        var voiceState = playbackState.voiceStates[i];
        if (voiceState.timerId !== null) {
            clearTimeout(voiceState.timerId);
            removeTimer(voiceState.timerId);
            var remaining = voiceState.nextDueAt - now;
            voiceState.waitUntilNextMs = remaining > 0 ? remaining : 0;
            voiceState.timerId = null;
        }
    }

    silenceAllNotes();
    clearAllVoiceHighlights();
    unColorKeys();
}

function resumePlayback(allVoices, scope) {
    if (!playbackState.isPaused) return;

    playbackState.isPaused = false;
    if (scope) {
        playbackState.scope = scope;
    }

    for (var i = 0; i < playbackState.voiceStates.length; i++) {
        var voiceState = playbackState.voiceStates[i];
        if (voiceState.completed || voiceState.nextNoteIndex >= voiceState.notes.length) {
            continue;
        }

        scheduleNextNoteForVoice(voiceState, voiceState.waitUntilNextMs || 0);
    }
}

function stopPlayback(scope) {
    var targetScope = scope || playbackState.scope;

    playbackState.isPlaying = false;
    playbackState.isPaused = false;
    playbackState.scope = targetScope || null;

    clearAllTimers();
    playbackState.voiceStates = [];
    playbackState.voicesData = [];

    silenceAllNotes();
    clearAllVoiceHighlights();

    unColorKeys();
    if (targetScope && targetScope.clearPitchDisplay) {
        safeScopeInvoke(targetScope, targetScope.clearPitchDisplay);
    }
}

function clearAllTimers() {
    for (var i = 0; i < playbackState.timeouts.length; i++) {
        clearTimeout(playbackState.timeouts[i]);
    }

    playbackState.timeouts = [];

    for (var j = 0; j < playbackState.voiceStates.length; j++) {
        playbackState.voiceStates[j].timerId = null;
        playbackState.voiceStates[j].nextDueAt = 0;
        playbackState.voiceStates[j].waitUntilNextMs = 0;
    }
}

function removeTimer(timerId) {
    for (var i = 0; i < playbackState.timeouts.length; i++) {
        if (playbackState.timeouts[i] === timerId) {
            playbackState.timeouts.splice(i, 1);
            return;
        }
    }
}

function finalizePlaybackIfFinished() {
    if (!playbackState.isPlaying) return;

    for (var i = 0; i < playbackState.voiceStates.length; i++) {
        if (!playbackState.voiceStates[i].completed) {
            return;
        }
    }

    playbackState.isPlaying = false;
    playbackState.isPaused = false;
    clearAllTimers();
    clearAllVoiceHighlights();
    unColorKeys();
}

function silenceAllNotes() {
    if (typeof MIDI.stopAllNotes === "function") {
        try {
            MIDI.stopAllNotes();
            return;
        } catch (e) {
        }
    }

    for (var ch = 0; ch < 16; ch++) {
        for (var note = 0; note < 128; note++) {
            try {
                MIDI.noteOff(ch, note, 0);
            } catch (e) {
            }
        }
    }
}

function getDelayMsFromDuration(durationValue, tempo) {
    var scaleValue = durationValue;
    if (typeof scaleValue !== "number" || isNaN(scaleValue)) {
        scaleValue = 6;
    }
    return scaleValue * 2 * (1000 / normalizeTempo(tempo));
}

function normalizeTempo(tempo) {
    var parsedTempo = parseFloat(tempo);
    if (!parsedTempo || parsedTempo <= 0) {
        return 120;
    }
    return parsedTempo;
}

function updatePitchDisplaySafe(scope, pitch, voiceNo) {
    if (!scope || !scope.updatePitchDisplay) return;
    safeScopeInvoke(scope, function() {
        scope.updatePitchDisplay(pitch, voiceNo);
    });
}

function setVoiceActiveNote(voiceNo, note) {
    clearVoiceActiveNote(voiceNo);

    if (typeof note !== "number" || note <= 0) {
        return;
    }

    var keyId = String(note);
    var activeVoiceList = playbackState.activeVoicesByNote[keyId] || [];
    if (activeVoiceList.indexOf(voiceNo) === -1) {
        activeVoiceList.push(voiceNo);
    }

    playbackState.activeVoicesByNote[keyId] = activeVoiceList;
    playbackState.activeNoteByVoice[voiceNo] = keyId;
    applyNoteColor(keyId);
}

function clearVoiceActiveNote(voiceNo) {
    var keyId = playbackState.activeNoteByVoice[voiceNo];
    if (!keyId) {
        return;
    }

    delete playbackState.activeNoteByVoice[voiceNo];

    var activeVoiceList = playbackState.activeVoicesByNote[keyId] || [];
    for (var i = activeVoiceList.length - 1; i >= 0; i--) {
        if (activeVoiceList[i] === voiceNo) {
            activeVoiceList.splice(i, 1);
        }
    }

    if (!activeVoiceList.length) {
        delete playbackState.activeVoicesByNote[keyId];
        resetSingleKeyColor(keyId);
        return;
    }

    playbackState.activeVoicesByNote[keyId] = activeVoiceList;
    applyNoteColor(keyId);
}

function clearAllVoiceHighlights() {
    playbackState.activeNoteByVoice = {};
    playbackState.activeVoicesByNote = {};
}

function applyNoteColor(keyId) {
    var activeVoiceList = playbackState.activeVoicesByNote[keyId] || [];
    if (!activeVoiceList.length) {
        resetSingleKeyColor(keyId);
        return;
    }

    var voiceNo = activeVoiceList[activeVoiceList.length - 1];
    colorKey(parseInt(keyId, 10), voiceNo);
}

function resetSingleKeyColor(keyId) {
    var keyElement = $("#" + keyId);
    if (!keyElement.length) return;

    if (keyElement.hasClass("keyBlack")) {
        keyElement.css("background", "#000000");
    } else {
        keyElement.css("background", "#ffffff");
    }
}

function safeScopeInvoke(scope, fn) {
    if (!scope || !fn) return;

    if (typeof scope.$applyAsync === "function") {
        scope.$applyAsync(fn);
    } else {
        fn();
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
    $("#" + note).css("background", getVoiceColorByIndex(voiceNo));
}

function unColorKeys() {
    $(".keyWhite").css("background", "#ffffff");
    $(".keyBlack").css("background", "#000000");
}

function createKeyboard() {
    return true;
}

function getVoiceColorByIndex(voiceNo) {
    if (typeof voiceNo !== "number") {
        return voiceColors[0];
    }

    return voiceColors[voiceNo % voiceColors.length];
}
