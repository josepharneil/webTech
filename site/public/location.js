"use strict";
addEventListener('load', start);
function start() 
{

    var eventHandler = function(event)
    {
        // 
    }

    window.addEventListener('resize', eventHandler, false);
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