"use strict";
addEventListener('load', start);
function start() 
{
    recentsHover();
    aboutScroll();
    recentsScroll();
    mapScroll();
    // insertGoogleMap();

    var eventHandler = function(event)
    {
        recentsHover();
    }

    window.addEventListener('resize', eventHandler, false);
}

function aboutScroll()
{
    var about = document.getElementById("about-button");
    about.addEventListener("click",function()
    {
        document.querySelector("#about").scrollIntoView({behavior:"smooth"});
    });
}

function recentsScroll()
{
    var about = document.getElementById("recents-button");
    about.addEventListener("click",function()
    {
        document.querySelector("#recents").scrollIntoView({behavior:"smooth"});
    });
}

function mapScroll()
{
    var about = document.getElementById("map-button");
    about.addEventListener("click",function()
    {
        document.querySelector("#map").scrollIntoView({behavior:"smooth"});
    });
}


function recentsHover()
{
    var tabletMaxWidth = window.matchMedia("(max-width: 960px)");
    var tabletMinWidth = window.matchMedia("(min-width: 401px)");
    
    var smallFont = "40px";
    var bigFont = "50px";

    if(tabletMaxWidth.matches && tabletMinWidth.matches)
    {
        var smallFont = "25px"
        var bigFont = "32px"
    }


    //Find all recents-items
    var recentsItemsLinks = document.getElementsByClassName("recents-item-links");

    //For each recents-item
    for (var i = 0; i < recentsItemsLinks.length; i++)
    {
        var childs = recentsItemsLinks[i].children;
        childs[0].style.filter = "blur(0px)";
        childs[1].style.fontSize = smallFont;

        recentsItemsLinks[i].addEventListener("mouseover", function()
        {
            var childs = this.children;
            childs[0].style.filter = "blur(5px)";
            childs[1].style.fontSize = bigFont;
        });

        recentsItemsLinks[i].addEventListener("mouseout", function()
        {
            var childs = this.children;
            childs[0].style.filter = "blur(0px)";
            childs[1].style.fontSize = smallFont
        });
    }
}


var isMenuOpen = false;

function openHamburger(x)
{
    x.classList.toggle("change");

    //Find header
    var mobileMenuContainer = document.getElementById("mobile-menu-container");

    // console.log(mobileMenuContainer);
    // console.log(mobileMenuContainer);

    // var 
    // console.log(mobileMenuContainer.style.maxHeight);

    // if(mobileMenuContainer.style.maxHeight == null)
    if(!isMenuOpen)
    {
        mobileMenuContainer.style.maxHeight = "800px";
        // mobileMenuContainer.style.display = "flex";
        isMenuOpen = true;
    }
    else
    {
        mobileMenuContainer.style.maxHeight = null;
        // mobileMenuContainer.style.display = "none";
        isMenuOpen = false;
    }
}

// function insertGoogleMap()
// {
//     var mapProp = 
//     {
//         center:new google.maps.LatLng(51.508742,-0.120850),
//         zoom: 5,
//     };

//     var map = new google.maps.Map(document.getElementById("google-map"),mapProp);
// }

// function insertGoogleMap() 
// {
//     // The location of Uluru
//     var uluru = {lat: -25.344, lng: 131.036};
//     // The map, centered at Uluru
//     var map = new google.maps.Map
//     (
//         document.getElementById('google-map'), {zoom: 4, center: uluru});
//     // The marker, positioned at Uluru
//     var marker = new google.maps.Marker({position: uluru, map: map});
// }


// function myMap() {
//     var mapProp= {
//         center:new google.maps.LatLng(51.508742,-0.120850),
//         zoom:5,
//     };
//     var map = new google.maps.Map(document.getElementById("google-map"),mapProp);
//     }


// var map = new google.maps.Map(document.getElementById('google-map'), 
// {
//     center: {lat: 30, lng: 0},
//     zoom: 3
//     map: google.maps.MapTypeId.ROADMAP
// });

var myLatlng = new google.maps.LatLng(35, 0);

var mapOptions = 
{
  zoom: 2,
  center: myLatlng,
  mapTypeId: 'hybrid',
  disableDefaultUI: true,
  zoomControl: true
};

var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!",
    url: "tokyo.html",
});

var infoWindow = new google.maps.InfoWindow({
    content: "boi"
});

marker.addListener('mouseover', function(){
    infoWindow.open(map,marker);
})

marker.addListener('mouseout', function(){
    infoWindow.close(map,marker);
})

marker.setMap(map);

google.maps.event.addListener(marker, 'click', function()
{
    console.log("clicked");
    window.location.href = this.url;
});

var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
var beachMarker = new google.maps.Marker({
  position: {lat: -33.890, lng: 151.274},
  map: map,
  icon: image
});

