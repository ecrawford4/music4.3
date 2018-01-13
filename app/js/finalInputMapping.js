function getFinalInputMapping(pitchMapping,scaleOption,keyOptionIndex, pitchMinRange,pitchMaxRange)
{

    // Get array based on user choice and adjust for key
    var selectedScaleArray = adjustForKey(getScaleArray(scaleOption),keyOptionIndex);

    var result = createOutput(pitchMapping, selectedScaleArray, pitchMinRange, pitchMaxRange);
    return result;
}

function getScaleArray(choice){
    // All arrays are off by 3. Should be fixed eventually
    switch(choice){
        case "Blues":
            return new Array(0,2,1,0,1,0,0,0,-1,1,0,1);
        case "Chromatic":
            return new Array(0,0,0,0,0,0,0,0,0,0,0,0);
        case "Major":
            return new Array(0,1,0,1,0,0,1,0,1,0,1,0);
        case "Minor":
            return new Array(0,1,0,0,1,0,1,0,0,-1,0,1);
        case "Pentatonic1":
            return new Array(0,1,0,1,0,-1,1,0,1,0,-1,1);
        case "Pentatonic2":
            return new Array(0,-1,1,0,1,0,1,0,-1,1,0,1);
        case "Whole Tone":
            return new Array(0,1,0,1,0,1,0,1,0,1,0,1);
        case "Octatonic":
            return new Array(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
        case "Messiaen Mode 3":
            return new Array(0, 1, 0, 0, 2, 1, 0, 0, 0, 2, 1, 0);
        case "Messiaen Mode 4":
            return new Array(0, 0, 0, 2, 1, 0, 0, 0, 0, 2, 1, 0);
        case "Messiaen Mode 5":
            return new Array(0, 0, 3, 2, 1, 0, 0, 0, 3, 2, 1, 0);
        case "Messiaen Mode 6":
            return new Array(0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0);
        case "Morph":
            return new Array(0,0,0,0,0,0,0,0,0,0,0,0);
    }
}
/*
 [1,23,45,66,88]

 0,2,1,0,1,0,0,0,-1,1,0,1
 shift =1 ;
 0. 1,0,2,1,0,1,0,0,0,-1,1,0
 1. 0,1,0,2,1,0,1,0,0,0,-1,1
 2. 1,0,1,0,2,1,0,1,0,0,0,-1
 3. -1,1,0,1,0,2,1,0,1,0,0,0
 4. 0,-1,1,0,1,0,2,1,0,1,0,0
 5. 0,0,-1,1,0,1,0,2,1,0,1,0

 4. 0,-1,1,0,1,0,2,1,0,1,0,0
 [1,23,45,66,88]
 1 -1 = 0 */
function createOutput(textAreaData, scaleArray, minRange, maxRange){
    var result = textAreaData.slice();
    //var result = textAreaData;
    for(var i = 0; i < result.length; i++)
    {
        if(result[i] + scaleArray[result[i] % 12] > maxRange)
        {
            // Account for exceeding max by checking the next value down
            result[i] --;
            i --;
        }
        else if(result[i] + scaleArray[result[i] % 12] < minRange)
        {
            // Account for exceeding min
            result[i] ++;
            i --;
        }
        else
        {
            result[i] += scaleArray[result[i] % 12]; // this corresponds to the scale arrays
        }
    }
    return result;
}

function adjustForKey(array,index){
    //var shift = $("#so_key_options1").find("option:selected").index();
    var result = array.slice();
    var shift = index;
    for(var i = 0; i < shift + 4; i++) // +4 because arrays are off by 4. Needs to be shifted over eventually
    {
        var popped = result.pop();
        result.unshift(popped);
    }

    return result;
}