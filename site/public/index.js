"use strict";
addEventListener('load', start);
function start() 
{
    recentsHover();
    aboutScroll();
    recentsScroll();
    mapScroll();

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