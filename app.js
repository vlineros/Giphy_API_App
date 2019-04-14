var themeThings = ["lion", "tiger", "bear"];
var apiImageAnimates = [];
var apiImageStills = [];
var apiRatings = [];
var faveImageAnimates = [];
var faveImageStills = [];
var faveRatings = [];
var offset = 0;
var faveIsShowing = false;

function printButtons() {
  $("#button-space").empty();
  for (var i = 0; i < themeThings.length; i++) {
    var a = $("<button>");
    a.addClass("thing");
    a.attr("data-name", themeThings[i]);
    a.text(themeThings[i]);
    a.css("padding", "5px 10px 5px")
      .css("background-color", "darkseagreen")
      .css("margin", "5px")
      .css("border", "2px solid darkgreen");
    $("#button-space")
      .css("border", "5px solid darkgreen")
      .css("border-top", "2px solid darkgreen")
      .append(a);
  }
}

function printImages() {
  $("<img id='load-image'src= images/loading.gif width='150px'>")
    .css("max-width", "100%")
    .appendTo($("#button-space"));
  setTimeout(function() {
    for (var i = 0; i < 10; i++) {
      var newGif = $("<div>");
      newGif.css("display", "inline-block").css("margin", "5px");
      var newImage = $("<img>");
      var newRating = $("<p>");
      newRating.text("Rating: " + apiRatings[i]);
      newImage.attr("data-rating", apiRatings[i]);
      newImage.attr("src", apiImageStills[i]);
      newImage.attr("class", "gifImage");
      newImage.attr("data-state", "still");
      newImage.attr("data-still", apiImageStills[i]);
      newImage.attr("data-animate", apiImageAnimates[i]);
      newGif.append(newImage).append(newRating);
      $("#gif-space").prepend(newGif);
    }
    $("#load-image").remove();
    apiImageAnimates = [];
    apiImageStills = [];
  }, 2000);
}
function printFavorites() {
  if (faveIsShowing === false) {
    faveImageAnimates = JSON.parse(localStorage.getItem("faveAnimates"));
    faveImageStills = JSON.parse(localStorage.getItem("faveStills"));
    faveRatings = JSON.parse(localStorage.getItem("faveRatings"));
    for (var i = 0; i < faveImageStills.length; i++) {
      var newFave = $("<div>");
      newFave.css("display", "inline-block").css("margin", "5px");
      var newImage = $("<img>");
      var newRating = $("<p>");
      newRating.text("Rating: " + faveRatings[i]);
      newImage.attr("src", faveImageStills[i]);
      newImage.attr("class", "faveImage");
      newImage.attr("data-state", "still");
      newImage.attr("data-still", faveImageStills[i]);
      newImage.attr("data-animate", faveImageAnimates[i]);
      newFave.append(newImage).append(newRating);
      $("#favorites-space")
        .css("border", "5px solid darkgreen")
        .prepend(newFave);
      faveIsShowing = true;
    }
  } else {
    //delete the favorites and erase the border created
    $("#favorites-space").empty();
    $("#favorites-space").css("border", "none");
    localStorage.setItem("faveAnimates", JSON.stringify(faveImageAnimates));
    localStorage.setItem("faveStills", JSON.stringify(faveImageStills));
    localStorage.setItem("faveRatings", JSON.stringify(faveRatings));
    faveIsShowing = false;
  }
}
//NEED TO CREATE FUNCTION THAT GRABS FAVE LIST FROM LOCAL STORAGE

function saveToFaves(obj) {
  console.log("made it!");
  faveImageAnimates.push(obj.attr("data-animate"));
  faveImageStills.push(obj.attr("data-still"));
  faveRatings.push(obj.attr("data-rating"));
  localStorage.setItem("faveAnimates", JSON.stringify(faveImageAnimates));
  localStorage.setItem("faveStills", JSON.stringify(faveImageStills));
  localStorage.setItem("faveRatings", JSON.stringify(faveRatings));

  // NEED TO CREATE FUNCTION THAT ADDS GIF TO FAVES IMAGE ARRAYS
}

$("#add-button").on("click", function(event) {
  event.preventDefault();
  var newThing = $("#thing-input")
    .val()
    .trim();
  themeThings.push(newThing);
  printButtons();
});

$(document).on("click", ".thing", function() {
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    $(this).attr("data-name") +
    "&api_key=dc6zaTOxFJmzC&rating=pg&limit=10&offset=" +
    offset;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    for (i = 0; i < response.data.length; i++) {
      var gifStillUrl = response.data[i].images.fixed_height_still.url;
      var gifAnimateUrl = response.data[i].images.fixed_height.url;
      var gifRating = response.data[i].rating;
      apiImageStills.push(gifStillUrl);
      apiImageAnimates.push(gifAnimateUrl);
      apiRatings.push(gifRating);
    }
  });
  offset += 10;
  printImages();
});

$(document).on("click", ".gifImage", function() {
  var state = $(this).attr("data-state");
  if (state === "still") {
    var URL = $(this).attr("data-animate");
    $(this).attr("src", URL);
    $(this).attr("data-state", "animate");
  } else {
    var URL = $(this).attr("data-still");
    $(this).attr("src", URL);
    $(this).attr("data-state", "still");
  }
});
$(document).on("click", ".faveImage", function() {
  var state = $(this).attr("data-state");
  if (state === "still") {
    var URL = $(this).attr("data-animate");
    $(this).attr("src", URL);
    $(this).attr("data-state", "animate");
  } else {
    var URL = $(this).attr("data-still");
    $(this).attr("src", URL);
    $(this).attr("data-state", "still");
  }
});
$(document).on("dblclick", ".gifImage", function() {
  saveToFaves($(this));
});
$("#favorites-button").on("click", function() {
  printFavorites();
});
printButtons();
