function getInputMapping(inputSet,algorithm,minRange,maxRange)
{
    var result = [];

    if(!Array.isArray(inputSet))
    {
        inputSet = inputSet.split(",");
    }

    
    if(inputSet === "Please enter your own set of input...")
    {
        //return result;
    }
    switch (algorithm) {
        case "Division":
            result = getDivisionSet (inputSet,minRange,maxRange);
            break;
        case "Logarithmic":
            result = getLogarithmicSet(inputSet,minRange,maxRange);
            break;
        case "Modulo":
            result = getModuloSet(inputSet,minRange,maxRange);
            break;
    }
    return result;
    //return inputSet + " " + algorithm;
}

//get Division
function getDivisionSet(inputSet,minRange,maxRange){
    var inputSetExcludeNull = inputSet.filter(function(n) { return n !="null";});
    //console.log(inputSetExcludeNull);
    //console.log(inputSet);
    //var smallest = Math.min.apply(null, arrayOfNumbers.filter(function(n) { return !isNaN(n); }));

    var result = [1];
    var  dataShift;
    var _value = new Array();
    var dataMin = Math.min.apply(Math,inputSetExcludeNull);
    var dataMax = Math.max.apply(Math,inputSetExcludeNull);
    var dataRange = dataMax - dataMin;
    var newRange =  maxRange - minRange;
    var rangeScale;
    //console.log(dataMin);
    if(dataRange == 0){
        rangeScale = newRange / 1;
    }
    else{
        rangeScale = newRange / dataRange;
    }


    for(var i=0; i< inputSet.length; i++){

        dataShift = inputSet[i] - dataMin;
        _value.push((Math.round(dataShift * rangeScale) + +minRange));


    }

    return _value;
    //return result;
}

//get Logarithmic
function getLogarithmicSet(inputSet,minRange,maxRange){
    var inputSetExcludeNull = inputSet.filter(function(n) { return n !="null";});
    var dataMin = Math.min.apply(Math,inputSetExcludeNull);
    var dataMax = 0.0000000001;//min number greater than zero
    var _value = new Array();

    //scale to positives and take log
    for (var i=0; i < inputSet.length;i++)
    {
        if(inputSet[i] == "null")
        {
            _value.push("null");
        }else {
            _value.push(Math.log(inputSet[i] - dataMin + 1));
        }

    }


    var maxInValue = Math.max.apply(Math,_value.filter(function(n) { return n !="null";}));
    dataMax =  maxInValue < dataMax ? dataMax : maxInValue;


    for (var i=0; i < _value.length;i++)
    {

        _value[i] *= (maxRange - minRange)/ dataMax;
        _value[i] = parseInt(Math.round(_value[i]) + +minRange);


    }

    return _value;


}

//get Modulo
function getModuloSet(inputSet,minRange,maxRange){
    //may need a check
    var moddedData;
    var _value = new Array();
    var modNum = maxRange - minRange + 1;

    for(var i = 0; i < inputSet.length; i++)
    {
        moddedData = parseInt(inputSet[i] % modNum);
        if(moddedData < 0)
        {
            _value.push(maxRange + +moddedData);
        }
        else
        {
            _value.push(moddedData + +minRange);
        }
    }

    return _value;
}
