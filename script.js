/* Check if channel in list is online/offline/removed */
// Get list of names and sort them
var names = ["H1Z1JustSurvive", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "brunofin", "noobs2ninjas"];
names = names.sort(function(a,b){
  return a.toLowerCase().localeCompare(b.toLowerCase());
});

var objects = [];
var imgs = [];
for(var i = 0; i < names.length; i++){
  makeRequest(names[i], false);
}


function makeRequest(name, search){
  $.getJSON('https://api.twitch.tv/kraken/streams/' + name + '?callback=?', function(data) {
    var status = "";
    var imgURL = "http://placehold.it/100x100";
    var itemHTML = "";
    objects.push(data);

    if("error" in data){
      status = "error";
    }else if(data.stream !== null){
      status = "online";
      imgs.push(data.stream.channel.logo);
      imgURL = data.stream.channel.logo;
      if(search){
        itemHTML = '<div id="search' + name.toLowerCase() + '" class="col-xs-10 col-xs-offset-1 item online"><div class="col-xs-3">';
      }else{
        itemHTML = '<div id="' + name.toLowerCase() + '" class="col-xs-10 col-xs-offset-1 item online"><div class="col-xs-3">';
      }
      itemHTML += '<img class="img-responsive" src="' + imgURL + '"  /></div><div class="col-xs-9">';
      itemHTML += '<h3>' + data.stream.channel.display_name + '</h3>';
      if(search){
        itemHTML += '<h6><span>ONLINE</span> - ' + data.stream.game + '</h6></div></div>';
        $($(itemHTML).fadeIn(400)).appendTo("#searchItems");
      }else{
        itemHTML += '<h6>' + data.stream.game + '</h6></div></div>';
        $($(itemHTML).fadeIn(400)).appendTo("#onlineItems");
      }
    }else{
      status = "offline";
      if(search){
        itemHTML = '<div id="search' + name.toLowerCase() + '" class="col-xs-10 col-xs-offset-1 item offline"><div class="col-xs-3">';
      }else{
        itemHTML = '<div id="' + name.toLowerCase() + '" class="col-xs-10 col-xs-offset-1 item offline"><div class="col-xs-3">';
      }
      itemHTML += '<img class="img-responsive" src="' + imgURL + '"  /></div><div class="col-xs-9">';
      itemHTML += '<h3>' + name + '</h3>';
      itemHTML += '<h6></h6></div></div>';
      if(search){
        $($(itemHTML).fadeIn(400)).appendTo("#searchItems");
      }else{
        $($(itemHTML).fadeIn(400)).appendTo("#offlineItems");
      }

      var id;
      if(search){
        id = "#search" + name.toLowerCase();
        getLogoOffline(name, id, true)
      }else{
        id = "#" + name.toLowerCase();
        getLogoOffline(name, id, false);
      }
    }

  });
}



function getLogoOffline(channel, id, search){
  $.getJSON('https://api.twitch.tv/kraken/channels/' + channel, function(data){
    var $id = $(id);
    $id.find(".img-responsive").attr('src', data.logo);
    if(search){
      $id.find("h6").html("<span>OFFLINE</span> - " + data.status);
    }else{
      $id.find("h6").html(data.status);
    }

    $id.find("h3").html(data.display_name);
  });
}

function resizing(){
  $("#iconBar input").width($("#iconBar").width()-$("#iconBar .btn-group").width()-30);
}

resizing();
$(window).on("resize", resizing);

// Event handlers sort buttons
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

// Search functionality
$("#iconBar input[type='search']").on('input', function(){
  var searchVal = $(this).val();

  if(searchVal.length < 1){
    oldState = "all";
    $(".non-search").slideDown(400);
    $("#searchItems").slideUp(400);
    return false;
  }

  $("#searchItems").html('<div class="col-xs-10 col-xs-offset-1 listHeader"><h5>Search results</h5></div>');
  $.xhrPool.abortAll();
  newState = "none";
  if(oldState !== "none"){
    $(".non-search").slideUp(400);
    $("#searchItems").slideDown(400);
  }

  $.getJSON('https://api.twitch.tv/kraken/search/channels?q=' + encodeURIComponent(searchVal) + '&limit=5&callback=?', function(data){
    $(data.channels).each(function(i, item){
      makeRequest(item.display_name, true);

    });
  });
});


// Code for aborting all current AJAX request: http://tjrus.com/blog/stop-all-active-ajax-requests
$.xhrPool = []; // array of uncompleted requests
$.xhrPool.abortAll = function() { // our abort function
    $(this).each(function(idx, jqXHR) {
        jqXHR.abort();
    });
    $.xhrPool.length = 0;
};

$.ajaxSetup({
    beforeSend: function(jqXHR) { // before jQuery send the request we will push it to our array
        $.xhrPool.push(jqXHR);
    },
    complete: function(jqXHR) { // when some of the requests completed it will splice from the array
        var index = $.xhrPool.indexOf(jqXHR);
        if (index > -1) {
            $.xhrPool.splice(index, 1);
        }
    }
});
