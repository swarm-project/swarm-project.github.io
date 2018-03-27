var data = [];

// Get and format the data
$.ajax({
    url: "https://swarm-project.github.io/data.txt",
    success: (response) => {
        let lines = response.split('\n');
        for(let i=0; i<lines.length; i++){
            let line = lines[i].split(',');

            // Gather the material mixes
            let materials = [];
            for(let j=3; j<8; j++){
                let material = line[j];
                if(material && material !== ""){
                    let splitMat = material.split("%");

                    materials.push({
                        name: splitMat[1].trim().toProperCase(),
                        percentage: splitMat[0]
                    });
                }
            }

            let obj = {
                name: line[0].toProperCase(),
                amount: line[1],
                materials: materials                
            }
            if(obj.name.length > 0 && obj.amount !== undefined){
                data.push(obj);
            }
        }        
    }
});







String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};