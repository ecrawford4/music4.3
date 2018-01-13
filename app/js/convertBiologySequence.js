function convertInputFormat(arrayString)
{
    arrayString = arrayString.replace(/(\r\n|\n|\r)/gm," ");
    arrayString = arrayString.replace(/\s+/g, '');
    arrayString = arrayString.replace(/,/g, '');
    arrayString = arrayString.replace(/[0-9]/g, '');
    arrayString.trim();
    arrayString = arrayString.toUpperCase();
    arrayString = arrayString.split("").join(",");
    return arrayString;
}

function convert(selectedSet,arrayString,nitrogenBases,bioType,proteinValues) {
    var result = [];

    convertInputFormat(arrayString);
    //alert(arrayString);
    if(!Array.isArray(arrayString))
    {
        arrayString = arrayString.split(",");
    }

    if(selectedSet === "Protein")
    {


        var proteinValues=[-2.1,-1.7,-1.3,-1.1,-0.7,-0.7,-0.5,0.0,0.1,0.3,0.5,0.5,
                            0.8,0.9,1.2,1.2,1.8,1.9,2.0,2.8];//Double
        var proteinNames = "WFLIMYVCPTASQNGHREDK";


/*
        var proteinValuesJson = [
            {
                name : "W", value : -2.1
            },
            {
                name : "F", value : -1.7
            },
            {
                name : "L", value : -1.3
            },
            {
                name : "I", value : -1.1
            },
            {
                name : "M", value : -0.7
            },
            {
                name : "Y", value : -0.7
            },
            {
                name : "V", value : -0.7
            },
            {
                name : "C", value : -0.7
            },
            {
                name : "P", value : -0.7
            }
        ];
*/
        var conversionVal = 10;
        for(var i = 0; i< arrayString.length; i++)
        {
            //find index
            var letterIndex = proteinNames.indexOf(arrayString[i]);
            /*
            //alert(arrayString);
            for(var j = 0; j < proteinValues.length; j++)
            {
                //alert("ok");
                if(arrayString[i] === proteinValues[j].letter)
                {
                    letterIndex = j;
                    //alert(letterIndex);
                    break;
                }
            }
            */
            //alert(proteinValues[letterIndex]);

            result[i] = parseInt(proteinValues[letterIndex] * conversionVal);



        }

         /*
         switch (arrayString[i]) {
         case "W":
         result[i] = proteinValues[0] * conversionVal;
         break;
         case "F":
         result[i] = proteinValues[1] * conversionVal;
         break;
         case "L":
         result[i] = proteinValues[2] * conversionVal;
         break;
         case "I":
         result[i] = proteinValues[3] * conversionVal;
         break;
         case "M":
         result[i] = proteinValues[4] * conversionVal;
         break;
         }
         */

    }
    else
    {
        for(var i = 0; i< arrayString.length; i++)
        {
            switch (arrayString[i]) {
                case "A":
                    result[i] = parseInt(nitrogenBases.A);
                    break;
                case "U":
                    result[i] = parseInt(nitrogenBases.U);
                    break;
                case "T":
                    result[i] = parseInt(nitrogenBases.T);
                    break;
                case "C":
                    result[i] = parseInt(nitrogenBases.C);
                    break;
                case "G":
                    result[i] = parseInt(nitrogenBases.G);
                    break;
            }

        }

        //Convert values to according bioType

        switch (bioType) {
            case "singleBases":
                //result not change
                break;
            case "codons":
                result = codonsConvert(result);
                break;
            case "duplicates":
                result = duplicatesConvert(arrayString);
                break;
        }
    }

    //alert(result);
    return result;
    //return arrayString;

}

//Group into 3
function codonsConvert(result)
{
    if(result.length % 3 > 0)
    {
        //Please add 2 more letters to the sequence or remove 1.
        var s = "Please add " + (3 - result.length % 3) + " more letters to the sequence or remove " + result.length % 3;
        alert(s);
        return;
    }
    var newResult = [];
    var j = 0;
    for(var i = 0; i < result.length; i+=3)
    {
        newResult[j] = parseInt(result[i]+ "" + result[i+1]+ "" + result[i+2]);
        j++;
    }
    return newResult;
}

//Count executive repitive values
function duplicatesConvert(arrayString)
{

    //var demoA = ["A","A","C","A","T","G","A","G","A","C","C","C"];
    //alert(demoA);
    var newResult = [];
    var stop = false;
    var i=0;
    var j ;
    while(!stop)
    {
        var counter = 0;
        for(j= i; j < arrayString.length; j++)
        {
            if(arrayString[i]===arrayString[j])
            {
                //alert ("i j " + i + " " + j);
                counter++;
                if(j == arrayString.length-1)
                {
                    stop = true;
                    break;
                }
            }else
            {

                i = j;
                //alert(i);
                break;
            }

        }
        newResult.push(counter);
    }
    //2,4,6,8
//2,1,1,1,3,2,1
    //alert(newResult);
    return newResult;
}