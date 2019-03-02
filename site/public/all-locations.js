"use strict";
addEventListener('load', start);
function start() 
{
    accordion();
    recentsHover();
    

    var eventHandler = function(event)
    {
        recentsHover();
    }

    window.addEventListener('resize', eventHandler, false);
}



function accordion()
{
    var acc = document.getElementsByClassName("accordion-button");
    var i;

    for (i = 0; i < acc.length; i++) 
    {
        acc[i].addEventListener("click", function() 
        {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight)
            {
                // panel.style.display = "none";
                panel.style.maxHeight = null;
            } 
            else 
            {
                // panel.style.display = "block";
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
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