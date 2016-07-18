//TO DO
/*
- Remove item after it has been removed from list by search

*/

/* Check if channel in list is online/offline/removed */
// Get list of names and sort them
function d(o){
  console.log(o);
}

d("JS started!");

function inArray(name, arr){
  for(var i = 0; i < arr.length; i++){
    if(name.toLowerCase() === arr[i].toLowerCase()){
      return true;
    }
  }
  return false;
}

function cl(){
  localStorage.removeItem("channelList");
  document.location.reload(true);
}

function storageAvailable(type){
  try{
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x,x);
    storage.removeItem(x);
    return true;
  }catch(e){
    return false;
  }
}

var standardList = ["H1Z1JustSurvive", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "brunofin", "noobs2ninjas"];
var channelList = [];

if(storageAvailable('localStorage')){
  if(!localStorage.getItem('channelList')){
    localStorage.setItem('channelList', JSON.stringify(standardList));
    channelList = standardList;
  }else{
    channelList = JSON.parse(localStorage.getItem('channelList'));
  }
}else{
  console.log("localStorage not available");
  channelList = standardList;
}

channelList = channelList.sort(function(a,b){
  return a.toLowerCase().localeCompare(b.toLowerCase());
});

//Empty search input
$("#iconBar input[type='search']").val("");

var objects = [];
var imgs = [];
for(var i = 0; i < channelList.length; i++){
  makeRequest(channelList[i], false);
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
        if(inArray(name, channelList)){
          itemHTML += '<h6><span>ONLINE</span> - ' + data.stream.game + '</h6><span title="Remove channel from your list" class="remove-item-search glyphicon glyphicon-remove"></span></div></div>';
        }else{
          itemHTML += '<h6><span>ONLINE</span> - ' + data.stream.game + '</h6></div></div>';
        }
        $($(itemHTML).fadeIn(400)).appendTo("#searchItems");
      }else{
        itemHTML += '<h6>' + data.stream.game + '</h6><span title="Remove channel from your list" class="remove-item glyphicon glyphicon-remove"></span></div></div>';
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

      if(search){
        itemHTML += (inArray(name, channelList)) ? '<h6></h6><span title="Remove channel from your list" class="remove-item-search glyphicon glyphicon-remove"></span></div></div>' : '<h6></h6></div></div>';
        $($(itemHTML).fadeIn(400)).appendTo("#searchItems");
      }else{
        itemHTML += '<h6></h6><span title="Remove channel from your list" class="remove-item glyphicon glyphicon-remove"></span></div></div>';
        $($(itemHTML).fadeIn(400)).appendTo("#offlineItems");
      }

      var id;
      if(search){
        id = "#search" + name.toLowerCase();
        getLogoOffline(name, id, true);
      }else{
        id = "#" + name.toLowerCase();
        getLogoOffline(name, id, false);
      }
    }

    // Remove button event handler
    $(".remove-item").on('click', function(){
      removeItemFromList($(this).parent().find("h3").html());
      var height = $(this).parent().parent().innerHeight() + "px";
      $(this).parent().parent().fadeOut(400, function(){
        $(this).prev().css("margin-bottom", height);
        $(this).prev().animate({
          "margin-bottom": "2px"
        }, 300);
        $(this).remove();
      });

    });

    //Remove button search event handlers
    $(".remove-item-search").on('click', function(){
      $(this).fadeOut(300);
      var name = $(this).parent().find("h3").html().toLowerCase();
      var id = "#" + name;
      $(id).remove();
      removeItemFromList(name);
    });

  });
}

function getLogoOffline(channel, id, search){
  $.getJSON('https://api.twitch.tv/kraken/channels/' + channel, function(data){
    var $id = $(id);
    $id.find(".img-responsive").attr('src', data.logo);
    var status = (data.status === null) ? "No status set" : data.status;
    if(search){
      $id.find("h6").html("<span>OFFLINE</span> - " + status);
    }else{
      $id.find("h6").html(status);
    }

    $id.find("h3").html(data.display_name);
  });
}

function removeItemFromList(channel){
  var name = channel.toLowerCase();
  var newList = [];
  for(var i = 0; i < channelList.length; i++){
    if(channelList[i].toLowerCase() === name){
      newList = channelList.slice(0,i).concat(channelList.slice(i+1, channelList.length));
      localStorage.setItem('channelList', JSON.stringify(newList));
      channelList = newList;
      break;
    }
  }

}


function resizing(){
  $("#iconBar input").width($("#iconBar").width()-$("#iconBar .btn-group").width()-30);
}

resizing();
$(window).on("resize", resizing);

// Event handlers sort buttons
oldState = "all";
$(".btn-group .btn").on('click', function(){
    if(oldState === "none"){
      return false;
    }
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

  $("#searchItems").html('<div class="col-xs-10 col-xs-offset-1 listHeader"><h5>Search results</h5><span id="close-results">Close results</span></div>');
  $.xhrPool.abortAll();
  newState = "none";
  if(oldState !== "none"){
    $(".non-search").slideUp(400);
    $("#searchItems").slideDown(400);
    $("#iconBar .btn-group .btn").attr("disabled", "true");
  }

  // Close results
  $("#close-results").on('click', function(){
    $(".non-search").slideDown(400);
    $("#searchItems").slideUp(400);
    oldState = "all";
    $("#iconBar input[type='search']").val("");
    $("#iconBar .btn-group .btn").removeAttr("disabled");
    $.xhrPool.abortAll();
  });

  $.getJSON('https://api.twitch.tv/kraken/search/channels?q=' + encodeURIComponent(searchVal) + '&limit=5&callback=?', function(data){
    $(data.channels).each(function(i, item){
      makeRequest(item.display_name, true);
    });
    if(data.channels.length === 0){
      var innerHTML = '<div id="no-results" class="col-xs-10 col-xs-offset-1 item"><h3>No results</h3></div>';
      $("#searchItems").append(innerHTML);
    }
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
