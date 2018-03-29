var data = [];

var chartsToUpdate = [];

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
                        percentage: splitMat[0],                        
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
        
        UpdateTotalChart(data);
    }
});

$(document).ready(() => {
    let learnMore = $('#learnMore');
    learnMore.click(() => {
        $('html, body').animate({scrollTop: $('#about').position().top}, 'slow');
    });

    $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
         && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');            
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {            
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) {
                        return false;
                    } else {
                        $target.attr('tabindex','-1');
                        $target.focus();
                    };
                });
            }
        }
    });

});

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};