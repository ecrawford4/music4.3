function convertToArray(arrayString) {
    var result = arrayString.split(",");
    for(var i in result)
    {
        if(isNaN(parseInt(result[i])))
        {
            result[i] = result[i];  // for BioSet, because include string
        }
        else
        {
            result[i] = parseFloat(result[i]); // for not BioSet, because include numbers
        }

    }
    return result;

}

function changeInput(utilFunc,inputTemp) {
    if(!Array.isArray(inputTemp))
    { //If is is a string, split to array of string and convert to array of int
        //alert("not array" + inputTemp);
        //console.log(inputTemp);
        //If it is a column-style data, do not convert to array,otherwise, convert to array
        if(inputTemp.match("\n"))
        {
            //alert("have new  line");
        }else
        {
            //alert("coonver");
            inputTemp = convertToArray(inputTemp);
        }
    }
console.log(inputTemp);
    switch (utilFunc.main) {
        case "reverse":
            return reverse(inputTemp);
        case "invert":
            switch (utilFunc.invertType) {
                case "invertAvg":
                    return invertAvg(inputTemp);
                case "invertValue":
                    return invertValue(inputTemp,utilFunc.customVal);
            }

        case "parseByRange":
            return parseByRange(inputTemp,utilFunc.low, utilFunc.high);
        case "sampleRate":
            return sampleRate(inputTemp,utilFunc.sampleRateNo,utilFunc.sampleRateType);

        case "addCommas":
            return addCommas(inputTemp,utilFunc.comma);
        case "replace":
            return replace(inputTemp,utilFunc.replaceCharFrom,utilFunc.replaceCharTo);
        case "multiplyDecimals":
            return multiplyDecimals(inputTemp,utilFunc.multiplyNo,utilFunc.multiplyType);
        case "ascIIConversion":
            return ascIIConversion(inputTemp);
        case "columnConversion":
            return columnConversion(inputTemp,utilFunc.columnNo,utilFunc.decimalPrecision);
        case "convertSilence":
            return convertSilence(inputTemp,utilFunc.silenceNo);
    }



}

function reverse(inputTemp) {
    var result = inputTemp.slice();
    return result.reverse();

}

function invertAvg(inputTemp) {
    /*Copy the temp array to another, then sort that arr, to find min max, then can find middle arr*/
    var tempArr =inputTemp.slice();
    tempArr.sort(compareNumbers); //need to use compareNumbers because array in javascript sort by unicode string
    //alert(tempArr[0] +" " + tempArr[tempArr.length-1]);
    //var mid = Math.round((max+min)/2); //everything will be inverted around this value
    var mid = (tempArr[0]+tempArr[tempArr.length-1])/2.0;

    var result = [];
    for(var i = 0; i < inputTemp.length; i++) {
        var dif = Math.abs(inputTemp[i]-mid);
        if(inputTemp[i] > mid)
            result[i] = Math.round(mid-dif);
        else
            result[i] = Math.round(mid+dif);
    }
    //pitchInputArr.reverse();
    return result;

}

function compareNumbers(a, b) {
    return a - b;
}

function invertValue(inputTemp,customVal) {

    var tempArr =inputTemp.slice();
    var result=[];
    customVal = parseInt(customVal);
    for(var i = 0; i < tempArr.length; i++){

        var dif = Math.abs(tempArr[i] - customVal);

        if(tempArr[i] > customVal){
            result[i] = Math.round(customVal-dif);
        }
        else {
            result[i] = Math.round(customVal+dif);
        }
    }

    return result;
}

function parseByRange(inputTemp,low, high)
{
    var tempArr =inputTemp.slice();
    var result=[];

    low = parseInt(low);
    high = parseInt(high);


    for(var i = 0; i < tempArr.length; i++){
        result[i] = tempArr[i];
        //var note = parseInt(content[i], 10);

        if(tempArr[i] < low || tempArr[i] > high) {
            result[i] = 0;
        }
    }
    return result;

}

function addCommas(inputTemp,comma) {


    var tempArrS1 =inputTemp.slice()+"";
    var tempArrS2 =inputTemp.slice()+"";
    var result=[];
    var step = parseInt(comma);
    var beginIndex = 0;
    var stop = false;
    var i =0;
    while(!stop)
    {
        //alert(tempArrS1.substring(beginIndex,beginIndex+step));
        result[i] = parseInt(tempArrS1.substring(beginIndex,beginIndex+step));
        beginIndex += step;
        if(beginIndex > (tempArrS1.length-1))
        {
            stop = true;
        }
        i++;
    }
    return result;
}

function sampleRate(inputTemp, sampleRateNo, sampleRateType) {
    var result=[];
    var tempArr =inputTemp.slice();
    sampleRateNo = parseInt(sampleRateNo);




    for(var i = 0 ; i < tempArr.length; i += sampleRateNo)
    {
        var sum = 0;
        var subArr = [];
        for(var j = i; j < (i + sampleRateNo) && j < tempArr.length; j++)
        {
            subArr.push(inputTemp[j]);
            sum += inputTemp[j];
        }
        //alert(subArr);
        switch (sampleRateType) {
            case "average":
                //alert(subArr);
                result.push(getAverage(subArr));
                break;
            case "median":
                result.push(getMedian(subArr));
                break;
            case "actual":
                getActual(subArr,sampleRateNo) !== undefined ? result.push(getActual(subArr,sampleRateNo)) : "";
                break;
        }
    }
    return result;
}

function getAverage(arr)
{
    var sum = 0;
    for(var i = 0; i < arr.length; i++)
    {
        sum += arr[i];
    }

    return Math.round(sum/arr.length);
}

function getMedian(arr)
{
    arr.sort(compareNumbers);
    var index = Math.floor(arr.length/2);
    if(arr.length % 2 == 0)
    {
        return Math.round((arr[index] + arr[index])/2);
    }else
    {
        return arr[index];
    }

}

function getActual(arr,sampleRateNo) {
    return arr[sampleRateNo-1];
}

function compareNumbers(a, b) {
    return a - b;
}

function replace(inputTemp,replaceCharFrom,replaceCharTo){
    var tempArr =inputTemp.slice();
    var result=[];
    replaceCharFrom = parseFloat(replaceCharFrom);
    replaceCharTo = parseFloat(replaceCharTo);
    for(var i=0; i < tempArr.length; i++)
    {
        if(tempArr[i] == replaceCharFrom)
        {
            console.log("equals");
            result.push(replaceCharTo);
        }else
        {
            result.push(tempArr[i]);
        }
    }

    return result;
}

function multiplyDecimals(inputTemp,multiplyNo,multiplyType) {
    var tempArr =inputTemp.slice();

    var result=[];
    multiplyNo = parseInt(multiplyNo);

    for(var i=0; i < tempArr.length; i++)
    {
        switch (multiplyType) {
            case "floor":
                //alert(subArr);
                result.push(Math.floor(parseFloat(tempArr[i])*multiplyNo));
                break;
            case "ceiling":
                result.push(Math.ceil(tempArr[i]*multiplyNo));
                break;
            case "round":
                result.push(Math.round(tempArr[i]*multiplyNo));
                break;
        }
        //result.push(tempArr[i]*multiplyNo);
    }
    return result;

}

function ascIIConversion(inputTemp) {
    var tempArr =inputTemp.slice();
    var result=[];
    for(var i=0; i < tempArr.length; i++)
    {
        result.push(tempArr[i].charCodeAt(0));
    }
    return result;
}

function  getProcessedInput(demoInput,check,columnNo,decimalDigits) {
    //If check is undefined, check.colum will cause error
    if(typeof  check === 'undefined')
    {
        alert("no  check");
    }else
    {

    }
    //alert(demoInput +" " + check.column +" " + check.commasPlaceHld + " " + check.decimals
      // +" " + columnNo + " " + decimalDigits);
    var lines = demoInput.trim().split(/\s*[\r\n]+\s*/g);
    var displayText="Process Input is: \n";

    var arrAllLines = [];
    for(var i in lines)
    {
        var arr = lines[i].trim().split(/\s+/g);
        arrAllLines.push(arr);
    }
    for(var i in arrAllLines)
    {
        //var arr = lines[i].trim().split(/\s+/g);
        //arrAllLines.push(arr);
        //alert(arrAllLines[i]);
    }


}

function  columnConversion(inputTemp,columnNo,decimalPrecision) {
    var result = [];
    columnNo = parseInt(columnNo);
    decimalPrecision = parseInt(decimalPrecision);
    var lines = inputTemp.trim().split(/\s*[\r\n]+\s*/g);
    var arrAllLines = [];
    for(var i in lines)
    {
        var arr = lines[i].trim().split(/\s+/g);
        arrAllLines.push(arr);
    }

    //var str = "Column " + columnNo + "\n";

    for(var i in arrAllLines)
    {
        var temp = arrAllLines[i][columnNo-1].split("");
        var dotIndex = temp.indexOf(".");
        if(dotIndex > -1){
            temp.splice(dotIndex,1);
        }
        temp = temp.slice(0,dotIndex+decimalPrecision);
        var convertedValue = parseInt(temp.join('')); //join value in array and convert to int
        //console.log(convertedValue);
        result.push(convertedValue);
    }
    //alert(str);
    return result;
}

function convertSilence(inputTemp,silenceNo){
    //console.log(parseFloat(Number.MIN_VALUE));
    //console.log(parseFloat("e"));
    var tempArr =inputTemp.slice();
    var result=[];
    for(var i=0; i < tempArr.length; i++)
    {
        if(tempArr[i] == silenceNo)
        {
            tempArr[i] = "null";
        }
        result.push(tempArr[i]);
    }
    return result;

}