//google.charts.setOnLoadCallback(drawChart);
function drawChart(index,pitchMapping,morphPercent,songMorph,morphValues){

    console.log("index:"+ index);
	console.log("percent:"+ morphPercent);
	if(morphPercent === undefined)
	{
			morphPercent = 10;
	}
    //console.log(pitchMapping);
    //console.log(songMorph);
    //console.log(morphPercent);
	if(songMorph === undefined || songMorph == "")
	{
        songMorph = "beethoven";
	}
	 var data = new google.visualization.DataTable();
	  data.addColumn('number', 'X');
	  data.addColumn('number', songMorph);
	  data.addColumn('number', 'Voice Data');
	  //var a= [0,0,0];
	  //var a2=[1,10,5];
	  var mainA=[];
	  //mainA.push(a);
	  //mainA.push(a2);
	var toAdd = 0;
	if(songMorph == "beethoven")
	{
		toAdd = 10;
	}else {
		toAdd = 1;
	}
	for(var i = 0; i< pitchMapping.length; i++)
	  {
	  	var arr=[];
	  	arr.push(i);
	  	arr.push(parseInt(morphValues[i]-morphPercent));
	  	arr.push(pitchMapping[i]);
	  	mainA.push(arr);
	  }
	  data.addRows(mainA);

	  var options = {
	    hAxis: {
	      title: ''
	    },
	    vAxis: {
	      title: ''
	    },
	    colors: ['#a52714', '#097138']
	  };

	var chartID = "chart_div"+index;
	var chart = new google.visualization.LineChart(document.getElementById(chartID));
    chart.draw(data, options);
    //var element = document.getElementById("morphElement");

    //element.id="morphElement";
    //element.innerHTML = mainA;
    //document.getElementById("morph").appendChild(element);
    //document.getElementById("chart_div").appendChild(element);


}