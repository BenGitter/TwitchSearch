/* Check if channel in list is online/offline/removed */
var names = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "brunofin", "noobs2ninjas"];
var objects = [];
var imgs = [];
for(var i = 0; i < names.length; i++){
  makeRequest(names[i], i);
}


function makeRequest(name, i){
  $.getJSON('https://api.twitch.tv/kraken/streams/' + name + '?callback=?', function(data) {
    var status = "";
    var imgURL = "";
    var itemHTML = "";
    objects.push(data);

    if("error" in data){
      status = "error";
    }else if(data.stream !== null){
      status = "online";
      imgs.push(data.stream.channel.logo);
      imgURL = data.stream.channel.logo;
      itemHTML = '<div id="' + name + '" class="col-xs-10 col-xs-offset-1 item"><div class="col-xs-3">';
      itemHTML += '<img class="img-responsive" src="' + imgURL + '"  /></div><div class="col-xs-9">';
      itemHTML += '<h3>' + name + '</h3></div></div>';

      $("#onlineItems").append(itemHTML);
    }else{
      status = "offline";
      itemHTML = '<div id="' + name + '" class="col-xs-10 col-xs-offset-1 item"><div class="col-xs-3">';
      itemHTML += '<img class="img-responsive" src="' + imgURL + '"  /></div><div class="col-xs-9">';
      itemHTML += '<h3>' + name + '</h3></div></div>';
      $("#offlineItems").append(itemHTML);
      getLogoOffline(name);
    }

    console.log(status);

  });
}

/* Try search function */
//var search = "Henkie";
//$.getJSON('https://api.twitch.tv/kraken/search/channels?q=' + encodeURIComponent(search) + '&limit=5&callback=?', function(data){
//  console.log(data);
//});

function getLogoOffline(channel){
  $.getJSON('https://api.twitch.tv/kraken/channels/' + channel, function(data){
    var id = "#" + channel;
    $(id).find(".img-responsive").attr('src', data.logo);
  });
}
//
// var d = getLogoOffline("freecodecamp");
// console.log(d);

function resizing(){
  $("#iconBar input").width($("#iconBar").width()-$("#iconBar .btn-group").width()-30);
}

resizing();
$(window).on("resize", resizing);

// Event handlers sort buttons
// Maybe use list functions?
oldState = "all";
$(".btn-group .btn").on('click', function(){
    var newState = $(this).data("sort");
    if(newState !== oldState){
      if(oldState === "all"){
        if(newState === "online"){
          $("#offlineItems").slideUp(400);
        }else{
          $("#onlineItems").slideUp(400);
        }
      }

      if(oldState === "online"){
        if(newState === "all"){
          $("#offlineItems").slideDown(400);
        }else{
          $("#onlineItems").slideUp(400);
          $("#offlineItems").slideDown(400);
        }
      }

      if(oldState === "offline"){
        if(newState === "all"){
          $("#onlineItems").slideDown(400);
        }else{
          $("#onlineItems").slideDown(400);
          $("#offlineItems").slideUp(400);
        }
      }
      oldState = newState;
    }

});
