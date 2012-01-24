// ==UserScript==
// @name          Conquer Club Private Message Team
// @version       0.3
// @namespace     http://userscripts.org/
// @description   Adds a button in team games to private message entire team
// @author        ThrushAAX
// @include       http://www.conquerclub.com/game.php?game=*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js
// ==/UserScript==

var gamenumber = 0;
var username = null;

if(/www.conquerclub.com\/game.php\?game=(\d+)/.test(window.location.href) ){
    gamenumber = RegExp.$1;
}

if(gamenumber){
    doWork();
}

function getMyName(){
    if(username) return username;
    
    if($("#leftColumn").find('a:first').html().match(/logout <b>(.+?)<\/b>/)) {
        username = RegExp.$1;      
    }
    
    return username;
}

function doWork(){
    //get type
    var type = $("#dashboard").find('dt:contains("Game Type")').next().text();
    var teamsize;
    
    if( type == 'Quadruples' ){
        teamsize = 4;
    }
    else if( type=='Triples'){
        teamsize = 3;
    }
    else if( type == 'Doubles'){
        teamsize = 2;
    }
    else { // some other type we don't care about
        return;
    }
    
    //get players ids
    var playerids = [];
    var myindex = -1;
    
    for(var i = 1; i <= 8; i++){
        var a = $("#stat_rank_"+i);
        
        if( !a.length){ // didn't find the item, so no more players
            break;
        }
        
        if(/u=(\d+)/.test( a.attr("href") )){
            playerids.push(RegExp.$1);
            
            var playername = $("#stat_player_"+i).text().split(":")[1];
        
            if(playername == getMyName() ){
                myindex = i - 1;
            }
        }
    }    
    
    if( myindex < 0){      // I'm not in this game!
        return;
    }
    
    //console.log(myindex, playerids);
    
    var myid = playerids[myindex];
    var startindex;
    
    if( teamsize == 2 ){   //handle doubles
        startindex = (Math.floor(myindex / 2) * 2);
    }
    else {  //handle tripples and quads
        startindex = myindex < teamsize ? 0 : teamsize;
    }
    
    // get the ids of the people in your team excluding yourself
    var teamplayers = playerids.splice(startindex,teamsize);
    teamplayers.splice(teamplayers.indexOf(myid),1);
    
    //console.log(startindex,teamsize, teamplayers  );
    
    
    //make fake post form to add users to pm form    
    var form='<form id="PMTEAMFORM" method="post" action="http://www.conquerclub.com/forum/ucp.php?i=pm&mode=compose">';
    
    for( var i = 0; i < teamplayers.length - 1; i++){
        form += '<input type="hidden" name="address_list[u]['+ teamplayers[i] +']" value="to"/>';
    }
    
    // reqiored to get form not to give error..
    form += '<input type="hidden" name="add_to['+teamplayers[teamplayers.length-1] +']" value="Add"/>';
    
    form += '<input type="hidden" name="subject" value="Our team game '+gamenumber+'"/>'
    form += '<input type="hidden" name="message" value="[Game]'+gamenumber+'[/Game]"/>'
    form += '<input type="submit" name="" value="" style="display:none;" />'
    form += '</form>';
    

    $('<button>PM Teammates</button>').insertAfter("#players").click(function(){
        var evt = document.createEvent("HTMLEvents");
	evt.initEvent("submit", true, true);
        $(form).insertAfter("#chat-form").get(0).dispatchEvent(evt);
    });
    
}