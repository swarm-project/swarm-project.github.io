$(document).ready(() => {
    let ctx = document.getElementById('total').getContext('2d');

    let chartMaterials = {};
    let totalNumberOfItems = 0;

    for(let i=0; i<data.length; i++){
      let obj = data[i];
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
        percentage: normalizedPercentage
      });
    }

    // and sort it
    normalizedData = normalizedData.sort((a, b) => {
      return b.percentage - a.percentage;
    });

    // Now format it for chart.js
    let percentages = [];
    let materialLabels = [];
    for(let i=0; i<normalizedData.length; i++){
      let obj = normalizedData[i];
      percentages.push(obj.percentage);
      materialLabels.push(obj.name);
    }


    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
        datasets: [{
          data: percentages
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: materialLabels
      },  
      // Configuration options go here
      options: {}
    });
});