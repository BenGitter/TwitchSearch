/* Check if channel in list is online/offline/removed */
var names = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "brunofin", "noobs2ninjas"];
var objects = [];
var imgs = [];
for(var i = 0; i < names.length; i++){
  makeRequest(names[i], i);
}

setTimeout(function(){
    console.log(imgs);
},2000);
function makeRequest(name, i){
  $.getJSON('https://api.twitch.tv/kraken/streams/' + name + '?callback=?', function(data) {
    var status = "";
    objects.push(data);

    if(data.error != null){
      status = "removed";
    }else if(data.stream != null){
      status = "online";
      imgs.push(data.stream.channel.logo);
    }else{
      status = "offline";

    }
    var itemHTML = "<d";
    //$("#status lu").append("<li id='item" + i + "'>" + name + ": " + status + "</li>");
  });
}

/* Try search function */
//var search = "Henkie";
//$.getJSON('https://api.twitch.tv/kraken/search/channels?q=' + encodeURIComponent(search) + '&limit=5&callback=?', function(data){
//  console.log(data);
//});

function getLogoOffline(channel){
  return $.getJSON('https://api.twitch.tv/kraken/channels/' + channel, function(data){
  });
}

var d = getLogoOffline("freecodecamp");
console.log(d);

function resizing(){
  $("#iconBar input").width($("#iconBar").width()-$("#iconBar .btn-group").width()-30);
}

resizing();
$(window).on("resize", resizing);
