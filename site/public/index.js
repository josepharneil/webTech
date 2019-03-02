"use strict";
addEventListener('load', start);
function start() 
{
    // console.log(document.getElementById("recents-item-link"));
    // document.getElementById("recents-item-link").addEventListener("mouseover", function()
    // {
    //     console.log(document.getElementById("recents-h1"));
    //     document.getElementById("recents-h1").style.fontSize = "50px";
    //     console.log(document.getElementById("recents-img"));
    //     document.getElementById("recents-img").style.filter = "blur(5px)";
    // });

    // document.getElementById("recents-item-link").addEventListener("mouseout", function()
    // {
    //     document.getElementById("recents-h1").style.fontSize = "40px";
    //     document.getElementById("recents-img").style.filter = "blur(0px)";
    // });

    // document.getElementsByClassName("about-text")[0].style.fontSize = "4px";

    recentsHover();
}

function recentsHover()
{
    //Find all recents-items
    var recentsItemsLinks = document.getElementsByClassName("recents-item-links");

    //For each recents-item
    for (var i = 0; i < recentsItemsLinks.length; i++)
    {
        var childs = recentsItemsLinks[i].children;
        childs[0].style.filter = "blur(0px)";
        childs[1].style.fontSize = "40px";

        recentsItemsLinks[i].addEventListener("mouseover", function()
        {
            var childs = this.children;
            childs[0].style.filter = "blur(5px)";
            childs[1].style.fontSize = "50px";
        });

        recentsItemsLinks[i].addEventListener("mouseout", function()
        {
            var childs = this.children;
            childs[0].style.filter = "blur(0px)";
            childs[1].style.fontSize = "40px";
        });
    }
}

// function accordion()
// {
//     var acc = document.getElementsByClassName("accordion-button");
//     var i;

//     for (i = 0; i < acc.length; i++) 
//     {
//         acc[i].addEventListener("click", function() 
//         {
//             this.classList.toggle("active");
//             var panel = this.nextElementSibling;
//             if (panel.style.display === "block") 
//             {
//                 panel.style.display = "none";
//             } 
//             else 
//             {
//                 panel.style.display = "block";
//             }
//         });
//     }
// }