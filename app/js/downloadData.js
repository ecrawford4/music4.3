function getDownloadData(tempo, allVoices) {

    //alert("into getDownloadData" +allVoices.finalPitchMapping);
    return createMidi("",tempo, allVoices);
}
function createMidi(type,tempo, allVoices)
{

    //add 20 to current pitch values
    //var channel=1;
    //get tempo
    //var tempo=60;
    // get voice amount
    var voiceNum = 1;
    //alert("bpm set at: "+ tempo);
    var microTempo=60000000/tempo;

    var division=24; //change to 480 when done
    if(type=='MTC')
        division=24

    var basedata = 'MFile 0 1 '+division+'|MTrk|0 TimeSig 4/4 24 8|0 Tempo '+microTempo+'|0 Meta TrkEnd|TrkEnd';
    var basedataArray=basedata.split('|');

    var mididata;
    mididata =basedataArray.join('\r\n');
    //window.alert(mididata);
    //window.alert(mididata);
    //var encodedData = window.btoa(mididata);
    //window.alert(encodedData);
    /*
     for(i=0; i<voiceNum;i++)
     {
     var track=createTrack(basedataArray,voiceArray[i], i+1, microTempo, type);
     mididata=mididata+'\r\n'+track;
     }*/


    for(var i = 0 ; i < allVoices.length; i++)
    {
        var channel = i+1;
        var track=createTrack(basedataArray,allVoices[i], channel, microTempo, type);
        mididata=mididata+'\r\n'+track;
    }



    //alert(mididata);
    return mididata;
    //console.log(mididata);
    //console.log(window.btoa(mididata));
    //var encodedData = window.btoa(mididata);
    //alert(encodedData);
    //document.forms['download'].notedata.value=mididata;





}

function createTrack( basedataArray, voice,channel,microTempo,type)
{
        //0 PrCh ch=10 p=1 For change piano
    var nThisDuration;
    //var nowDur = 0;
    var pitchArray = voice.finalPitchMapping;
    var durationMapping = voice.durationMapping;
    var durationMappingScale= getDurationMappingScale(durationMapping);
    var midiNotes = new Array(pitchArray.length);
    var startTime = 0;
    var endTime = 0;
    // get instrument string

    var instrumentNo = MIDI.GM.byName[voice.instrument.name].number+1; //midi number in programming is 0-index so  must plus 1
    //var trackdata = 'MTrk' //|0 Meta Text "'+voice.instrumentString+'"|0 ParCh='+channel+' p='+voice.instrument+' v=120';
    var trackdata = 'MTrk|0 PrCh ch='+ channel +' p=' + instrumentNo; //|0 Meta Text "'+voice.instrumentString+'"|0 ParCh='+channel+' p='+voice.instrument+' v=120';
    var trackdataArray = trackdata.split('|');

    for(var i=0; i < midiNotes.length; i++)
    {
        midiNotes[i] = pitchArray[i]+20;
        if (isNaN(midiNotes[i]))
        {
            alert('note ' + i + ' is invalid. Notes must be integers.');
            return;
        }
        if ((midiNotes[i]<0) || (midiNotes[i]>=127))
        {
            alert('note ' + midiNotes[i]+"= "+"midiNotes[" +i+"]"+ ' is invalid. Notes must be valid midi notes between 0 and 127.');
            return;
        }

        if (type=="MTC")
            nThisDuration=getMidiClocks(durationMapping[i]);
        else //SMPTE event time division
            nThisDuration= (1 << durationMapping[i])*24;

        if (isNaN(nThisDuration))
        {
            alert('duration ' + i + ' is invalid. must be integer.');
            return;
        }

        if (midiNotes[i] > 20)
        {
            //Add to the MIDI data an "On" event
            trackdataArray.push(startTime +' On ch='+channel+ ' n='+midiNotes[i]+ ' v=120');
            startTime += durationMappingScale[i];
            endTime = startTime;
            //Add to the MIDI data an "Off" event
            trackdataArray.push(endTime  +' Off ch='+channel+' n='+midiNotes[i]+ ' v=120');
        }
        //nowDur += 6; // Increment a 16th note
    }
    trackdataArray.push(endTime +' Meta TrkEnd');
    trackdataArray.push('TrkEnd');

    return trackdataArray.join('\r\n');
}

function getDurationMappingScale(durationMapping)
{
    /* Convert durationMapping into tick temp
     * Because original 0 in duration will not be play so it should be mapped to music tick
     * */
    //var noteDurations = [2,3,4,6,8,12,16,24,32,48];
    var noteDurations = [6,9,12,18,24,36,48,72,96,144];
    var durationMappingScale = new Array(durationMapping.length);
    for(var i = 0; i< durationMappingScale.length ; i++)
    {
        durationMappingScale[i] = noteDurations[durationMapping[i]];
    }
    return durationMappingScale;
}