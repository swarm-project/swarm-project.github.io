function UpdateTotalChart(totalChartData){
    let ctx = document.getElementById('totalChart').getContext('2d');

    let chartMaterials = {};
    let totalNumberOfItems = 0;

    for(let i=0; i<totalChartData.length; i++){
      let obj = totalChartData[i];
      let materials = obj.materials;
      totalNumberOfItems += Number.parseInt(obj.amount);
      if(isNaN(totalNumberOfItems)){
        console.log("h");
      }

      for(let j=0; j<materials.length; j++){
        let mat = materials[j];

        if(chartMaterials[mat.name] === undefined){
          chartMaterials[mat.name] = 0;
        }
        chartMaterials[mat.name] += obj.amount * mat.percentage;
      }
    }

    // Normalize the data
    let normalizedData = [];
    for( var material in chartMaterials){
      let normalizedPercentage = chartMaterials[material] / totalNumberOfItems;
      normalizedData.push({
        name: material,
        percentage: normalizedPercentage,
        synthetic: IsSynthetic(material)
      });
    }

    // and sort it
    normalizedData = normalizedData.sort((a, b) => {
      return b.percentage - a.percentage;
    });

    // Now format it for chart.js
    let percentages = [];
    let materialLabels = [];
    let colors = [];
    let cottonColor = '#4A89DC';    
    let cottonPercent = 0;
    let syntheticColor = '#E9573F';
    let syntheticPercent = 0;
    let shadeIncrement = 0.1;

    let otherCotton = {
      name: 'Other Cellulosic',
      percentage: 0
    }

    let otherSynthetic = {
      name: 'Other Synthetic',
      percentage: 0,
    }
    
    for(let i=0; i<normalizedData.length; i++){
      let obj = normalizedData[i];
      obj.percentage = ((obj.percentage * 100) |0) / 100;

      // Group into 'other'
      if(obj.percentage < 0.6){
        if(obj.synthetic){
          otherSynthetic.percentage += obj.percentage;
        }
        else {
          otherCotton.percentage += obj.percentage;
        }
      }
      else {
        percentages.push(obj.percentage);
        materialLabels.push(obj.name);
        if(obj.synthetic){        
          colors.push(ShadeColor(syntheticColor, syntheticPercent));
          syntheticPercent += shadeIncrement;
        }
        else {
          colors.push(ShadeColor(cottonColor, cottonPercent));
          cottonPercent += shadeIncrement;
        }      
      }
    }

    // Now add the 'other' categories    
    otherCotton.percentage = ((otherCotton.percentage * 100) |0) / 100;
    otherSynthetic.percentage = ((otherSynthetic.percentage * 100) |0) / 100;

    percentages.push(otherSynthetic.percentage);
    percentages.push(otherCotton.percentage);
    
    materialLabels.push(otherSynthetic.name);
    materialLabels.push(otherCotton.name);
    
    colors.push(ShadeColor(syntheticColor, syntheticPercent));
    colors.push(ShadeColor(cottonColor, cottonPercent));    
    



    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
        datasets: [{
          data: percentages,
          backgroundColor: colors
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: materialLabels
      },  
      // Configuration options go here
      options: {
        legend: {
          position: 'right'
        }        
      }
    });
};


function IsSynthetic(name){
  switch(name.toLowerCase()){
    case "cashmere":
    case "cotton":    
    case "foam":
    case "hemp":
    case "jute":
    case "leather":
    case "linen":
    case "lyocell":
    case "paper":
    case "sherpa":
    case "silk":
    case "white duck down":
    case "wool":
      return false;
  }
  return true;
}

function ShadeColor(color, percent) {   
  var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}