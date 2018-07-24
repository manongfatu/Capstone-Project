var correlationResult = null;
var btnCompare = false;
var numberBarScores = {};

$(function(){

		$(".btn-compare-graph").click(function(event){
   	   btnCompare = true;

      compareGraph();


       $("#comparedInter").removeClass('hide');
      $("#comparedIntra").removeClass('hide');
      $("#comparedBarInterpret").removeClass('hide');

      $("#comparedBarInterpret").removeClass('hide');
    });	




		$("#exampleFormControlSelect1").change(function(event){
			// var arr = [79, 5, 18, 5, 32, 1, 16, 1, 82, 13];
			// var sorted = arr.slice().sort(function(a,b){return b-a});
			// var ranks = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

      $(".print").removeClass('hide');
      $("#comparedInter").addClass('hide');
      $("#comparedIntra").addClass('hide');
      $("#comparedBarInterpret").addClass('hide');

			$(".hidden-compared-year").removeClass('hide');
			var selectedYear = this.value;
			var options = "";

			$("#exampleFormControlSelect1").map(function(index, element){
        $flag = 0;

				$.each(element, function(key, values){
          if($flag == 0){
            options += "<option value='' hidden>School Year</option>";
            $flag++;
          }
					if(selectedYear != values.value && values.value != 0){
						options += "<option value='"+values.value+"'>"+"School Year "+values.value+"</option>";
					}
				});
			});
			$("#exampleFormControlSelect2").empty();
			$("#exampleFormControlSelect2").append(options);
      

      var hello = $("#exampleFormControlSelect1").val(); 
			var filteredStudents = $('#filteredStudents'),
            StudentListFilter = $('#StudentListFilter'),
            filteredStudentsDataTable = filteredStudents.DataTable();
			
			$.ajax({
				url: 'http://localhost/ease_itp_final/getFilterGraph/'+ this.value,
				method: 'get',
				dataType: 'json',
				success: function(data){
                    console.log(data);

          var studName = [];
					var interpersonal = [];
					var intrapersonal = [];
					var stress = [];
					var adaptability = [];
					var mood = [];
					var gwa = [];
					var totaleq = [];
					var gwac = [];
					console.log(data['a']);
					console.log(data['c']);














//***********data c DEFAULT EQ and GWA***********closing

					var properEQ = data['a'].reduce(function(result, current) {
				        result[current.student_id] = result[current.student_id] || [];
				        result[current.student_id].push(current);
				        return result;
				    }, {});
                    // console.log(Object.keys(properEQ).length);//length of (data)
				    var dataLen =Object.keys(properEQ).length;
				    console.log("total stud"+dataLen);
            $("#barInterpret").empty();
            $("#barInterpret").append(
    '<p>' + $("#exampleFormControlSelect1").val() + ': <b>'+ dataLen +'</b><br><b>Legend:</b><br><i>Low: 50-84 <br> Average: 85-114 <br> High: 115-170</i></p>'
    )           
          

                    //get the individual eq and gwa
				    var student_eq = [];
				    var student_gwa = [];
				    $.each(properEQ, function(keys, values){
				    	var gwaTotal = 0;

				  		student_eq.push({
                studName : values[0]['lastname'],
				  			studentId : values[0]['student_id'],
				  			interpersonal : values[0]['interpersonal'],
				  			intrapersonal : values[0]['intrapersonal'],
				  			stress : values[0]['stress'],
				  			adaptability : values[0]['adapt'],
				  			mood : values[0]['mood'],
				  			totaleqeq : values[0]['total_eq']
				  			});

              
				  		$.each(values, function(key, value){
				  			gwaTotal += value['gwa'];
				  		});

				  		gwaTotal = (gwaTotal/values.length).toFixed(3);

				  		student_gwa.push({
				  			studentId : values[0]['student_id'],
				  			studentGWA : gwaTotal
						});
					});

					
						
				 //    var searchId = 61;

					// for(x =0 ; x<student_eq.length; x++){
					// 	if(student_eq[x]==searchId){
					// 		console.log("stress: "+ student_eq[x]['stress']);
					// 	}	
					// }// stress = [50,20,25,40]

					

//     				var gwa = [];


                        //pushing the individual EQ and GWA
    					$.each(student_eq, function(keys, values){
                studName.push(values['studName']);
    						interpersonal.push(values['interpersonal']);
    						intrapersonal.push(values['intrapersonal']);
    						stress.push(values['stress']);
    						adaptability.push(values['adaptability']);
    						mood.push(values['mood']);
    						totaleq.push(values['totaleqeq']);    						
   						});


   						$.each(student_gwa, function(keys, values){
    						gwa.push(values['studentGWA']);
   						});

                


// *****************variables to be used on ranking*****************
   						var gwaCopy = gwa.slice(); 
   						var interpersonalCopy = interpersonal.slice();
   						var intrapersonalCopy = intrapersonal.slice();
						var stressCopy = stress.slice();
						var adaptabilityCopy = adaptability.slice();
						var moodCopy = mood.slice();
                    

// *****************variables to be used on graphs*****************
                        var namePerfectCopy = studName.slice();console.log(namePerfectCopy);
                        var gwaPerfectCopy = gwa.slice(); 
                        var interpersonalPerfectCopy = interpersonal.slice();
                        var intrapersonalPerfectCopy = intrapersonal.slice();
                        var stressPerfectCopy = stress.slice();
                        var adaptabilityPerfectCopy = adaptability.slice();
                        var moodPerfectCopy = mood.slice();
                        var totalEqPerfectCopy = totaleq.slice();
                        console.log(totalEqPerfectCopy);

						


//********************assignXY for correlation************************
//********************assignXY for correlation************************
var intraGwa  = assignXY(intrapersonalPerfectCopy,gwaPerfectCopy),
    interGwa  = assignXY(interpersonalPerfectCopy,gwaPerfectCopy),
    adaptGwa  = assignXY(adaptabilityPerfectCopy,gwaPerfectCopy),
    stressGwa = assignXY(stressPerfectCopy,gwaPerfectCopy),
    moodGwa   = assignXY(moodPerfectCopy,gwaPerfectCopy);

//Pearson Correlation Result
correlationResult ={
  intrapersonalinterpret: pearsonResults(intraGwa),
  interpersonalinterpret: pearsonResults(interGwa),
  adaptinterpret:         pearsonResults(adaptGwa),
  stressinterpret:        pearsonResults(stressGwa),
  moodinterpret:          pearsonResults(moodGwa)
}

  numberBarScores = {
    intrapersonal : countBarScores(intrapersonalCopy),
    interpersonal : countBarScores(interpersonalCopy),
    stress        : countBarScores(stressCopy),
    adaptability  : countBarScores(adaptabilityCopy),
    mood          : countBarScores(moodCopy),
    }

console.log(numberBarScores.intrapersonal);






var pearsonResult = [];
  $.each(correlationResult, function(keys, values){
      pearsonResult.push(values);
  });
  console.log("Pearson Result: "+ pearsonResult);


//********TABLE REPORT*********
//********TABLE REPORT*********
//********TABLE REPORT*********
var reportAllEq = [];
    for(let i=0;i<namePerfectCopy.length;i++){
      var obj = {name:namePerfectCopy[i],gwa:gwaPerfectCopy[i],inter:interpersonalPerfectCopy[i],intra:intrapersonalPerfectCopy[i],adapt:adaptabilityPerfectCopy[i],stress:stressPerfectCopy[i],mood:moodPerfectCopy[i],totalEq:totalEqPerfectCopy[i]};
      reportAllEq.push(obj);
    }
    
generateReportTable(reportAllEq);

var intrapret = "intrapersonalinterpret";
yearInterpret(intrapret);
var intrapretbar = "intrapersonal";
displayBarScores(intrapretbar);




//********************GRAPHS************************
//********************GRAPHS************************
//********************GRAPHS************************

//*********SCATTER PLOT*********
//INTERPERSONAL~GWA_SCATTERPLOT
    var interGwaData = [];
        for(let i=0;i<interpersonalPerfectCopy.length;i++){
            var obj = {x:interpersonalPerfectCopy[i],y:gwaPerfectCopy[i]};
                interGwaData.push(obj);
        }
    graphInterpersonalScatter(interGwaData);

//INTRAPERSONAL~GWA_SCATTERPLOT
    var intraGwaData = [];
        for(let i=0;i<intrapersonalPerfectCopy.length;i++){
            var obj = {x:intrapersonalPerfectCopy[i],y:gwaPerfectCopy[i]};
             intraGwaData.push(obj);
        }
    graphIntrapersonalScatter(intraGwaData);
   
//STRESS~GWA_SCATTERPLOT
    var stressGwaData = [];
        for(let i=0;i<stressPerfectCopy.length;i++){
            var obj = {x:stressPerfectCopy[i],y:gwaPerfectCopy[i]};
                stressGwaData.push(obj);
        }
    graphStressScatter(stressGwaData);
 
//MOOD~GWA_SCATTERPLOT
    var moodGwaData = [];
        for(let i=0;i<moodPerfectCopy.length;i++){
            var obj = {x:moodPerfectCopy[i],y:gwaPerfectCopy[i]};
             moodGwaData.push(obj);
        }
    graphMoodScatter(moodGwaData);

//ADAPT~GWA_SCATTERPLOT
    var adaptGwaData = [];
        for(let i=0;i<adaptabilityPerfectCopy.length;i++){
            var obj = {x:adaptabilityPerfectCopy[i],y:gwaPerfectCopy[i]};
                adaptGwaData.push(obj);
        }
    graphAdaptabilityScatter(adaptGwaData);

//**********BAR GRAPHS***********

// Interpersonal BarGraph
graphInterpersonalBar(interpersonalPerfectCopy);
//Intrapersonal BarGraph
graphIntrapersonalBar(intrapersonalPerfectCopy);

//Stress BarGraph
graphStressBar(stressPerfectCopy);

//Mood BarGraph
graphMoodBar(moodPerfectCopy);

//Adapt BarGraph
graphAdaptabilityBar(adaptabilityPerfectCopy);
			 } //success
	    }); //ajax
}); //button filter
				
	}); //function ending tag

//***list of functions***

function displayBarScores(key) {
console.log(key);
console.log(numberBarScores.key);
  $("#nBarInterpret").empty();
  $("#nBarInterpret").append("<br><b>School year:  " + $("#exampleFormControlSelect1").val() + "</b>" + numberBarScores[key]);

}

function countBarScores(key) {
var kani = [];


var y = [], sum=0,sum2=0,sum3=0;

    for(let i=0;i<key.length;i++){
        if(key[i]>=50 && key[i]<=84){
            sum =sum +1;
        }else if(key[i]>=85 && key[i]<=114){
            sum2 =sum2 +1;
        }else if(key[i]>=115 && key[i]<=170){
            sum3 =sum3 +1;
        }
    }
    y.push(sum);
    y.push(sum2);
    y.push(sum3);

    // kani.push("Low: <b>"+ sum + "</b><br>average: <b>" + sum2 + "</b><br>high: <b>" +sum3 + "</b>");

    kani.push(sum + " " + sum2 + " " + sum3);
 

    
  
   return kani;

} 


function generateReportTable(data){
  
        
    var studentReport = $('#studentReport'),
    studentReportFilter = $('#studentReportFilter'),
    studentReportDataTable = studentReport.DataTable();

    studentReportDataTable.clear();

                var row = [];
            

                for (var i = 0; i < data.length; i++) {

                    var j = data[i];

                   

                        row.push([
                             j.name
                            , j.gwa
                            , j.inter
                            , j.intra
                            , j.adapt
                            , j.stress
                            , j.mood
                            , j.totalEq
                            
                          
                        ]);     
                }

                for(var i = 0; i < row.length; i++) {
                    

                    studentReportDataTable.row.add([
                        
                        row[i][0],
                        row[i][1],
                        row[i][2],
                        row[i][3],
                        row[i][4],
                        row[i][5],
                        row[i][6],
                        row[i][7]
                        
                      
                    ]);

                 }

               studentReportDataTable.draw();

                
}



function yearInterpret(key){

  //SCATTER PLOT INTERPRETATION
	$("#pearsonInterpret").empty();
  $("#pearsonInterpret2").empty();



	if (correlationResult[key]<0){
		$("#pearsonInterpret").append('School year: <b>'+ $("#exampleFormControlSelect1").val()+'</b><br>Correlation Coefficient: <b><font color="green">' + correlationResult[key].toFixed(2) + '</font></b><br> Relationship:<font color="red"> Negative </font> (<b>GWA is increasing and ' +key.charAt(0).toUpperCase() +  key.slice(1,-9)+ ' is also increasing) </b>');	
	}


  else if(correlationResult[key]>=0 && correlationResult[key]<=0.19){
		$("#pearsonInterpret2").append('Strength of Relationship: <b><font color=red>Very Weak</b>' + "<a class='btn' title='More Information' href='defofterms' style=' padding: 1px 8px 1px 8px; font-size: 10pt; margin-left:1%; background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect='/defofterms'><i class='fa fa-question'></i> </a>");	
	}else if(correlationResult[key]>=0.20 && correlationResult[key]<=0.39){
		$("#pearsonInterpret2").append('Strength of Relationship: <b><font color=orange>Weak</b>'+ "<a class='btn' title='More Information' href='defofterms' style='padding: 1px 8px 1px 8px;  font-size: 10pt; margin-left:1%;background-color:#002663; border-color: #002663;color:white; border-radius: 100px;'   redirect ='/defofterms'><i class='fa fa-question'></i> </a>");  	
	}else if(correlationResult[key]>=0.40 && correlationResult[key]<=0.59){
		$("#pearsonInterpret2").append('Strength of Relationship: <b><font color=blue>Moderate</b>'+ "<a class='btn' title='More Information' href='defofterms' style='padding: 1px 8px 1px 8px;  font-size: 10pt; margin-left:1%;background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect ='/defofterms'><i class='fa fa-question'></i> </a>");  	
	}else if(correlationResult[key]>0.59 && correlationResult[key]<=0.79){
		$("#pearsonInterpret2").append('Strength of Relationship: <b><font color=green>Strong</b>'+ "<a class='btn' title='More Information' href='defofterms' style='padding: 1px 8px 1px 8px;  font-size: 10pt; margin-left:1%;background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect ='/defofterms'><i class='fa fa-question'></i> </a>"); 	
	}else if(correlationResult[key]>=0.80 && correlationResult[key]<=1.0){
		$("#pearsonInterpret2").append('Strength of Relationship: <b><font color=green>Very Strong</b>'+ "<a class='btn' title='More Information' href='defofterms'  style='padding: 1px 8px 1px 8px;  font-size: 10pt; margin-left:1%;background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect ='/defofterms'><i class='fa fa-question'></i> </a>");  	
	}
  if (correlationResult[key]>0){
    $("#pearsonInterpret").append('School year: <b>'+ $("#exampleFormControlSelect1").val()+'</b><br>Correlation Coefficient: <b><font color="green">' + correlationResult[key].toFixed(2) + '</font></b><br> Relationship: <font color="blue">Positive</font> (<b>GWA is decreasing while ' +key.charAt(0).toUpperCase() +  key.slice(1,-9)+ ' is increasing or vice versa) </b>');
    }
  else if(correlationResult[key]>=-0.19 && correlationResult[key]<=0){
    $("#pearsonInterpret2").append('Strength of Relationship: <b><font color=red>Very Weak</b>'+ "<a class='btn' title='More Information' href='defofterms' style=' padding: 1px 8px 1px 8px; font-size: 10pt; margin-left:1%; background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect='/defofterms'><i class='fa fa-question'></i> </a>"); 
  }else if(correlationResult[key]>=-0.39 && correlationResult[key]<=-0.20){
    $("#pearsonInterpret2").append('Strength of Relationship: <b><font color=orange>Weak</b> '+ "<a class='btn' title='More Information' href='defofterms' style=' padding: 1px 8px 1px 8px; font-size: 10pt; margin-left:1%; background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect='/defofterms'><i class='fa fa-question'></i> </a>"); 
  }else if(correlationResult[key]>=-0.59 && correlationResult[key]<=-0.40){
    $("#pearsonInterpret2").append('Strength of Relationship: <b><font color=blue>Moderate</b> '+ "<a class='btn' title='More Information' href='defofterms' style=' padding: 1px 8px 1px 8px; font-size: 10pt; margin-left:1%; background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect='/defofterms'><i class='fa fa-question'></i> </a>");
  }else if(correlationResult[key]>=-0.79 && correlationResult[key]<=-0.60){
    $("#pearsonInterpret2").append('Strength of Relationship: <b><font color=green>Strong</b> '+ "<a class='btn' title='More Information' href='defofterms' style=' padding: 1px 8px 1px 8px; font-size: 10pt; margin-left:1%; background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect='/defofterms'><i class='fa fa-question'></i> </a>"); 
  }else if(correlationResult[key]>=-1.0 && correlationResult[key]<=-0.8){
    $("#pearsonInterpret2").append('Strength of Relationship: <b><font color=green>Very Strong</b>'+ "<a class='btn' title='More Information' href='defofterms' style=' padding: 1px 8px 1px 8px; font-size: 10pt; margin-left:1%; background-color:#002663; border-color: #002663;color:white; border-radius: 100px;' redirect='/defofterms'><i class='fa fa-question'></i> </a>"); 
  }

   //SCATTER PLOT INTERPRETATION
}



function pearsonResults(values) {
var n = values.length;
if (n == 0) return 0;

let meanX = 0;
let meanY = 0;
for (var i = 0; i < n; i++) {
meanX += values[i].x / n
meanY += values[i].y / n
}console.log(meanX,meanY);

let num = 0;
let den1 = 0;
let den2 = 0;

for (var i = 0; i < n; i++) {
let dx = (values[i].x - meanX);
let dy = (values[i].y - meanY);
num += dx * dy
den1 += dx * dx
den2 += dy * dy
}

const den = Math.sqrt(den1) * Math.sqrt(den2);

if (den == 0) return 0;

return num / den;
}

function assignXY(eq, gwa){
  var a = [];
     for(let i=0;i<eq.length;i++){
         var obj = {x:eq[i],y:parseFloat(gwa[i])};
         a.push(obj);
     }
  return a;
}


//functions for c
function getAverage(data){
  var sum = 0;
    for( var i = 0; i < data.length; i++ ){
        sum += parseFloat( data[i], 10 ); //don't forget to add the base
    }

    var avg = (sum/data.length).toFixed(4);

    return avg;


}

function getdoublebar(orig,mean){

    var gg = [];
    for (var i=0; i < orig.length; i++){
      var temp = (parseFloat(orig[i])-mean).toFixed(4);
      gg.push(temp);

    }

  return gg;

}

function getraise2(data){
    var raise = [];
    for(var i=0; i< data.length; i++) {
      var temp =  (Math.pow(parseFloat(data[i]),2).toFixed(4));
      raise.push(temp);
    }

  return raise;  


}

function standardDeviation(numbersArr) {
    //--CALCULATE AVAREGE--
    var lint = (numbersArr.length-1);
    var total = 0;
    for(var key in numbersArr) 
       total += numbersArr[key];
 
    //--CALCULATE AVAREGE--
  
    //--CALCULATE STANDARD DEVIATION--
   
    var SDresult = Math.sqrt(total/lint); 
    //--CALCULATE STANDARD DEVIATION--
   	return SDresult;
    
}






      
//*******************below here is all about graphs***********************

//ScatterGraphs
function graphInterpersonalScatter(data){
    var options = {

       title: {
            display: true,
            text: 'Interpersonal and GWA Scatterplot',
            fontSize: 20,
            fontFamily: "product sans"},

        scales: {

            xAxes: [{

              ticks: {

                beginAtZero: true
              },
                scaleLabel: {
                  display: true,
                  labelString: 'Interpersonal Test Scores'
                            },

                scaleBeginAtZero : true,
                gridLines:{
               display:false, 
                lineWidth:0,
                color: "rgba(0,0,0,0.3)" 


              },
                type: 'linear',
                position: 'bottom',
                
            }],
            yAxes: [{
                ticks: {

                beginAtZero:true,
                   reverse: false,
                   stepSize: .5,
                   max: 5,
                   min: 1,
                   autoskip:false,
              },
                scaleLabel: {
                  display: true,
                  labelString: 'General Weighted Average'
                            },

                 gridLines:{display:false, lineWidth:0,color: "rgba(0,0,0,0.3)" }



            }]
        }
    }

var interData = { 
      labels:["INTERPERSONAL","GWA"],

        datasets: [{
            pointBorderWidth:1,
            pointBorderColor: 'rgba(0, 82, 204,1)',
            pointBackgroundColor: 'rgba(26, 117, 255,1)',
            borderColor:'rgba(0, 82, 204,1)',
            BackgroundColor:'rgba(26, 117, 255,1)',

            label: 'INTERPERSONAL and GWA',
            data: data,
        }
        ]
    };

 $("#interpersonalContainer").empty();
 $("#interpersonalContainer").append('<canvas id="interpersonal-Chart"></canvas>');
var ctx = document.getElementById("interpersonal-Chart").getContext("2d");
	ctx.clearRect(0, 0, ctx.width, ctx.height);
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: interData,
    options: options

});
	
}


function graphIntrapersonalScatter(data){
 

    var options = {

       title: {
            display: true,
            text: 'Intrapersonal and GWA Scatterplot',
            fontSize: 20,
        },

        scales: {

            xAxes: [{

              ticks: {

                beginAtZero: true
              },
                scaleLabel: {
                  display: true,
                  labelString: 'Intapersonal Test Scores'
                            },

                scaleBeginAtZero : true,
                gridLines:{
               display:false, 
                lineWidth:0,
                color: "rgba(0,0,0,0.3)" 


              },
                type: 'linear',
                position: 'bottom',
                
            }],
            yAxes: [{
                ticks: {

                 beginAtZero:true,
                   reverse: false,
                   stepSize: .5,
                   max: 5,
                   min: 1,
                   autoskip:false,
              },
                scaleLabel: {
                  display: true,
                  labelString: 'General Weighted Average'
                            },

                 gridLines:{display:false, lineWidth:0,color: "rgba(0,0,0,0.3)" }



            }]
        }
    }

var intraData = { 
      labels:["INTRAPERSONAL","GWA"],

        datasets: [{
            pointBorderWidth:1,
           pointBorderColor: 'rgba(0, 82, 204,1)',
            pointBackgroundColor: 'rgba(26, 117, 255,1)',
            borderColor:'rgba(0, 82, 204,1)',
            BackgroundColor:'rgba(26, 117, 255,1)',

            label: 'INTRAPERSONAL and GWA',
            data: data,
        }]
    };

 $("#intrapersonalContainer").empty();
 $("#intrapersonalContainer").append('<canvas id="intrapersonal-Chart"></canvas>');
var ctx = document.getElementById("intrapersonal-Chart").getContext("2d");
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: intraData,
    options: options

});
    
}


function graphStressScatter(data){
  
    var options = {

       title: {
            display: true,
            text: 'Stress Management and GWA Scatterplot',
            fontSize: 20,
        },

        scales: {

            xAxes: [{

              ticks: {

                beginAtZero: true
              },
                scaleLabel: {
                  display: true,
                  labelString: 'Stress Management Test Scores'
                            },

                scaleBeginAtZero : true,
                gridLines:{
                display:false, 
                lineWidth:0,
                color: "rgba(0,0,0,0.3)" 


              },
                type: 'linear',
                position: 'bottom',
                
            }],
            yAxes: [{
                ticks: {

                 beginAtZero:true,
                   reverse: false,
                   stepSize: .5,
                   max: 5,
                   min: 1,
                   autoskip:false,
              },
                scaleLabel: {
                  display: true,
                  labelString: 'General Weighted Average'
                            },

                 gridLines:{display:false, lineWidth:0,color: "rgba(0,0,0,0.3)" }



            }]
        }
    }

var stressData = { 
      labels:["STRESS MANAGEMENT","GWA"],

        datasets: [{
            pointBorderWidth:1,
            pointBorderColor: 'rgba(0, 82, 204,1)',
            pointBackgroundColor: 'rgba(26, 117, 255,1)',
            borderColor:'rgba(0, 82, 204,1)',
            BackgroundColor:'rgba(26, 117, 255,1)',

            label: 'STRESS MANAGEMENT and GWA',
            data: data,
        },

            ],
        }

  


$("#stressContainer").empty();
$("#stressContainer").append('<canvas id="stress-Chart"></canvas>');
var ctx = document.getElementById("stress-Chart").getContext("2d");
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: stressData,
    options: options

});
    
}


function graphAdaptabilityScatter(data){
    var options = {

       title: {
            display: true,
            text: 'Adaptability and GWA Scatterplot',
            fontSize: 20,
        },

        scales: {

            xAxes: [{

              ticks: {

                beginAtZero: true
              },
                scaleLabel: {
                  display: true,
                  labelString: 'Adaptability Test Scores'
                            },

                scaleBeginAtZero : true,
                gridLines:{
                display:false, 
                lineWidth:0,
                color: "rgba(0,0,0,0.3)" 


              },
                type: 'linear',
                position: 'bottom',
                
            }],
            yAxes: [{
                ticks: {

                 beginAtZero:true,
                   reverse: false,
                   stepSize: .5,
                   max: 5,
                   min: 1,
                   autoskip:false,
              },
                scaleLabel: {
                  display: true,
                  labelString: 'General Weighted Average'
                            },

                 gridLines:{display:false, lineWidth:0,color: "rgba(0,0,0,0.3)" }



            }]
        }
    }

var adaptData = { 
      labels:["ADAPTABILITY","GWA"],

        datasets: [{
            pointBorderWidth:1,
           pointBorderColor: 'rgba(0, 82, 204,1)',
            pointBackgroundColor: 'rgba(26, 117, 255,1)',
            borderColor:'rgba(0, 82, 204,1)',
            BackgroundColor:'rgba(26, 117, 255,1)',

            label: 'ADAPTABILITY and GWA',
            data: data,
        }]
    };

$("#adaptabilityContainer").empty();
$("#adaptabilityContainer").append('<canvas id="adaptability-Chart"></canvas>');
var ctx = document.getElementById("adaptability-Chart").getContext("2d");
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: adaptData,
    options: options

});     
    
}


function graphMoodScatter(data){

    var options = {

       title: {
            display: true,
            text: 'General Mood and GWA Scatterplot',
            fontSize: 20,
        },

        scales: {

            xAxes: [{

              ticks: {

                beginAtZero: true
              },
                scaleLabel: {
                  display: true,
                  labelString: 'General Mood Test Scores'
                            },

                scaleBeginAtZero : true,
                gridLines:{
                display:false, 
                lineWidth:0,
                color: "rgba(0,0,0,0.3)" 


              },
                type: 'linear',
                position: 'bottom',
                
            }],
            yAxes: [{
                ticks: {
                beginAtZero:true,
                   reverse: false,
                   stepSize: .5,
                   max: 5,
                   min: 1,
                   autoskip:false,
              },
                scaleLabel: {
                  display: true,
                  labelString: 'General Weighted Average'
                            },

                 gridLines:{display:false, lineWidth:0,color: "rgba(0,0,0,0.3)" }



            }]
        }

    }

var moodData = { 
      labels:["GENERAL MOOD","GWA"],

        datasets: [{
            pointBorderWidth:1,
           pointBorderColor: 'rgba(0, 82, 204,1)',
            pointBackgroundColor: 'rgba(26, 117, 255,1)',
            borderColor:'rgba(0, 82, 204,1)',
            BackgroundColor:'rgba(26, 117, 255,1)',

            label: 'GENERAL MOOD and GWA',
            data: data,
        }]
    };

$("#moodContainer").empty();
$("#moodContainer").append('<canvas id="mood-Chart"></canvas>');
var ctx = document.getElementById("mood-Chart").getContext("2d");
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: moodData,
    options: options

});
    
}

// **********BAR GRAPHS***********
function graphInterpersonalBar(data){

   var x = [],sum=0,sum2=0,sum3=0;
    for(let i=0;i<data.length;i++){
        if(data[i]>=50 && data[i]<=84){
            sum =sum +1;
        }else if(data[i]>=85 && data[i]<=114){
            sum2 =sum2 +1;
        }else if(data[i]>=115 && data[i]<=170){
            sum3 =sum3 +1;
        }
    }x.push(sum);x.push(sum2);x.push(sum3);

var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    max: data.length
                }
            }],
            xAxes: [{
            gridLines: {
                offsetGridLines: false
            }
        }]
        }
    }

var interData = { 
      labels:["LOW","AVERAGE","HIGH"],

        datasets: [{

            label: 'Summarized Interpersonal',
            data: x,
           backgroundColor: [
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)'
            ],
            borderColor: [
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)'
            ],
            borderWidth: 1
        }]
    };
$("#interpersonalBarContainer").empty();
$("#interpersonalBarContainer").append('<canvas id="interpersonal-BarChart"></canvas>');
var ctx = document.getElementById("interpersonal-BarChart").getContext("2d");
var barChart = new Chart(ctx, {
    type: 'bar',
    data: interData,
    options: options

});

}

function graphIntrapersonalBar(data){

var x = [],sum=0,sum2=0,sum3=0;
    for(let i=0;i<data.length;i++){
        if(data[i]>=50 && data[i]<=84){
            sum =sum +1;
        }else if(data[i]>=85 && data[i]<=114){
            sum2 =sum2 +1;
        }else if(data[i]>=115 && data[i]<=170){
            sum3 =sum3 +1;
        }
    }x.push(sum);x.push(sum2);x.push(sum3);

var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    max: data.length
                }
            }],
            xAxes: [{
            gridLines: {
                offsetGridLines: false
            }
        }]
        }
    }

var intraData = { 
      labels:["LOW","AVERAGE","HIGH"],

        datasets: [{

            label: 'Summarized Intrapersonal',
            data: x,
           backgroundColor: [
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)'
            ],
            borderColor: [
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)'
            ],
            borderWidth: 1
        }]
    };

$("#intrapersonalBarContainer").empty();
$("#intrapersonalBarContainer").append('<canvas id="intrapersonal-BarChart"></canvas>');
var ctx = document.getElementById("intrapersonal-BarChart").getContext("2d");
var barChart = new Chart(ctx, {
    type: 'bar',
    data: intraData,
    options: options

}); 

}

function graphStressBar(data){

var x = [],sum=0,sum2=0,sum3=0;
    for(let i=0;i<data.length;i++){
        if(data[i]>=50 && data[i]<=84){
            sum =sum +1;
        }else if(data[i]>=85 && data[i]<=114){
            sum2 =sum2 +1;
        }else if(data[i]>=115 && data[i]<=170){
            sum3 =sum3 +1;
        }
    }x.push(sum);x.push(sum2);x.push(sum3);

var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    max: data.length
                }
            }],
            xAxes: [{
            gridLines: {
                offsetGridLines: false
            }
        }]
        }
    }

var stressData = { 
      labels:["LOW","AVERAGE","HIGH"],

        datasets: [{

            label: 'Summarized stress Management',
            data: x,
           backgroundColor: [
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)'
            ],
            borderColor: [
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)'
            ],
            borderWidth: 1
        }]
    };

$("#stressBarContainer").empty();
$("#stressBarContainer").append('<canvas id="stress-BarChart"></canvas>');

var ctx = document.getElementById("stress-BarChart").getContext("2d");
var barChart = new Chart(ctx, {
    type: 'bar',
    data: stressData,
    options: options

});

}

function graphMoodBar(data){

var x = [],sum=0,sum2=0,sum3=0;
    for(let i=0;i<data.length;i++){
        if(data[i]>=50 && data[i]<=84){
            sum =sum +1;
        }else if(data[i]>=85 && data[i]<=114){
            sum2 =sum2 +1;
        }else if(data[i]>=115 && data[i]<=170){
            sum3 =sum3 +1;
        }
    }x.push(sum);x.push(sum2);x.push(sum3);

var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    max: data.length
                }
            }],
            xAxes: [{
            gridLines: {
                offsetGridLines: false
            }
        }]
        }
    }

var moodData = { 
      labels:["LOW","AVERAGE","HIGH"],

        datasets: [{

            label: 'Summarized General Mood',
            data: x,
           backgroundColor: [
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)'
            ],
            borderColor: [
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)'
            ],
            borderWidth: 1
        }]
    };
$("#moodBarContainer").empty();
$("#moodBarContainer").append('<canvas id="mood-BarChart"></canvas>');
var ctx = document.getElementById("mood-BarChart").getContext("2d");
var barChart = new Chart(ctx, {
    type: 'bar',
    data: moodData,
    options: options

});

}


function graphAdaptabilityBar(data){

var x = [],sum=0,sum2=0,sum3=0;
    for(let i=0;i<data.length;i++){
        if(data[i]>=50 && data[i]<=84){
            sum =sum +1;
        }else if(data[i]>=85 && data[i]<=114){
            sum2 =sum2 +1;
        }else if(data[i]>=115 && data[i]<=170){
            sum3 =sum3 +1;
        }
    }x.push(sum);x.push(sum2);x.push(sum3);

var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    max: data.length
                }
            }],
            xAxes: [{
            gridLines: {
                offsetGridLines: false
            }
        }]
        }
    }

var adaptData = { 
      labels:["LOW","AVERAGE","HIGH"],

        datasets: [{

            label: 'Summarized Adaptability',
            data: x,
           backgroundColor: [
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)',
                'rgba(255, 0, 0,0.7)'
            ],
            borderColor: [
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)',
                'rgba(204, 0, 0,1)'
            ],
            borderWidth: 1
        }]
    };

$("#adaptabilityBarContainer").empty();
$("#adaptabilityBarContainer").append('<canvas id="adaptability-BarChart"></canvas>');
var ctx = document.getElementById("adaptability-BarChart").getContext("2d");
var barChart = new Chart(ctx, {
    type: 'bar',
    data: adaptData,
    options: options

});

}






//example ni sa pag combine sa duha ka dataset
 // datasets: [{
 //            pointBorderWidth:1,
 //            pointBorderColor: 'rgba(0,0,0,1)',
 //            pointBackgroundColor: 'rgba(0,0,0,1)',
 //            borderColor:'rgba(0,0,0,1)',
 //            BackgroundColor:'rgba(51, 102, 255)',

 //            label: 'INTERPERSONAL and GWA',
 //            data: data,},
 //            {
 //            pointBorderWidth:1,
 //            pointBorderColor: 'rgba(51, 102, 255)',
 //            pointBackgroundColor: 'rgba(51, 102, 255)',
 //            borderColor:'rgba(51, 102, 255)',
 //            BackgroundColor:'rgba(51, 102, 255)',

 //            label: 'Scatter Dataset',
 //            data: [{
 //                x: 65,
 //                y: 2
 //            }, {
 //                x:90,
 //                y: 1
 //            }, {
 //                x: 55,
 //                y: 3
 //            },
 //            {
 //                x: 108,
 //                y: 4
 //            },
 //            {
 //                x:120,
 //                y: 2
 //            },
 //            {
 //                x:78,
 //                y: 3
 //            },
 //            {
 //                x: 88,
 //                y: 1
 //            }]
        
 //        }]
 //    };