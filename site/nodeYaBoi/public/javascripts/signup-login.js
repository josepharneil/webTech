"use strict";

// var db = sql.Database("../../databases/data.db");

addEventListener('load', start);
function start() 
{
    openHamburger();

    window.addEventListener('resize', eventHandler, false);
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