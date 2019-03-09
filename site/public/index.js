"use strict";
addEventListener('load', start);
function start() 
{
    recentsHover();
    aboutScroll();
    recentsScroll();
    mapScroll();
    openHamburger();

    var eventHandler = function(event)
    {
        recentsHover();
    }

    window.addEventListener('resize', eventHandler, false);
}

//============= Create map =============//
var mapCentre = new google.maps.LatLng(35, 0);

var mapOptions = 
{
  zoom: 2,
  center: mapCentre,
  mapTypeId: 'hybrid',
  disableDefaultUI: true,
  zoomControl: true,
  minZoom: 2,
  maxZoom: 5,
};

var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

// Place markers
CreateMarker(new google.maps.LatLng(36, 140),"tokyo.html","Tokyo");
CreateMarker(new google.maps.LatLng(22, 104),"tokyo.html","Sapa");
CreateMarker(new google.maps.LatLng(25, 83),"tokyo.html","Varanasi");
CreateMarker(new google.maps.LatLng(65, -18),"tokyo.html","Iceland");
CreateMarker(new google.maps.LatLng(39, -9),"tokyo.html","Lisbon");
CreateMarker(new google.maps.LatLng(-23, -43),"tokyo.html","Rio de Janeiro");
CreateMarker(new google.maps.LatLng(37, -120),"tokyo.html","Yosemite");
CreateMarker(new google.maps.LatLng(-13, -73),"tokyo.html","Machu Pichu");


CreateMarker(new google.maps.LatLng(7, 30),"","Boi's location");





//============= Functions =============//
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


function openHamburger()
{
    var ham = document.getElementsByClassName("hamburger-icon-container");

    ham[0].addEventListener("click",
    function()
    {
        this.classList.toggle("change");

        //Find header
        var mobileMenuContainer = document.getElementById("mobile-menu-container");

        if(mobileMenuContainer.style.maxHeight != "800px")
        {
            mobileMenuContainer.style.maxHeight = "800px";
        }
        else
        {
            mobileMenuContainer.style.maxHeight = null;
        }
    });
}


function CreateMarker(latLng, url, hoverText)
{
    // Create marker
    var marker = new google.maps.Marker({
        position: latLng,
        url: url,
    });

    // Info window
    var infoWindow = new google.maps.InfoWindow({content: hoverText});

    // Hover
    marker.addListener('mouseover', function(){infoWindow.open(map,marker);});
    marker.addListener('mouseout', function(){infoWindow.close(map,marker);});

    // Click
    google.maps.event.addListener(marker, 'click', function()
    {console.log("clicked");window.location.href = this.url;});

    //Set on map
    marker.setMap(map);
}

function CreateMarker(latLng, url, hoverText, image)
{
    // Create marker
    var marker = new google.maps.Marker({
        position: latLng,
        url: url,
        icon: image,
    });

    // Info window
    var infoWindow = new google.maps.InfoWindow({content: hoverText});

    // Hover
    marker.addListener('mouseover', function(){infoWindow.open(map,marker);});
    marker.addListener('mouseout', function(){infoWindow.close(map,marker);});

    // Click
    google.maps.event.addListener(marker, 'click', function()
    {console.log("clicked");window.location.href = this.url;});

    //Set on map
    marker.setMap(map);
}