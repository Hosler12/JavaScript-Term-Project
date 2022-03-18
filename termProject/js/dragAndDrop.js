$(function()
{
    $("#MoveMe1").draggable();
    $("#MoveMe2").draggable();
    $("#MoveMe3").draggable();
    $("#MoveMe4").draggable();
    $("#MoveMe5").draggable();
    $("#MoveMe6").draggable();
    $("#MoveMe7").draggable();
    $('#check').on('click',function(){
        var pos1 = $('#MoveMe1').position();
        var pos2 = $('#MoveMe2').position();
        var pos3 = $('#MoveMe3').position();
        var pos4 = $('#MoveMe4').position();
        var pos5 = $('#MoveMe5').position();
        var pos6 = $('#MoveMe6').position();
        var pos7 = $('#MoveMe7').position();
        
        if (pos1.top > pos2.top){
            document.getElementById('information').innerHTML = 'Hydrogen is misplaced'
        }
        else if (pos2.top > pos6.top){
            document.getElementById('information').innerHTML = 'Natural Gas is misplaced'
        }
        else if (pos6.top > pos3.top){
            document.getElementById('information').innerHTML = 'Steam is misplaced'
        }
        else if (pos3.top > pos7.top){
            document.getElementById('information').innerHTML = 'Oxygen is misplaced'
        }
        else if (pos7.top > pos4.top){
            document.getElementById('information').innerHTML = 'Propane is misplaced'
        }
        else if (pos4.top > pos5.top){
            document.getElementById('information').innerHTML = 'Carbon Dioxide is misplaced'
        }
        else{
            document.getElementById('information').innerHTML = 'Well done. You are now ready to do this in the real world.'
        }
    });
});