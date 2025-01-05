/*
 * Custom Content Goes Here
 *  
 */

import { PrimaryAccordionToggle } from "./AccordionView";

//View for Creative Writing Community
export function CWCView(){
    const resultDiv = document.createElement("div");

    resultDiv.appendChild(PrimaryAccordionToggle("NLU Creative Writing Community"));
    
    const divContentNode = document.createElement("div");
    divContentNode.className = "primary_accordion__content";
    const divContentText =`<p>
        All students at any level are welcome to join the Creative Writing Community every Wednesday from 12-1 PM, either in-person on the Chicago Campus at the Innovation Lab, or virtually with Zoom Code 874 682 8098.  Bring your lunch and enjoy some creative writing time between classes! Sharing is always optional.</p><p> This will be hosted by Diane Gillette with the Writing Initiative and Alyx Chandler with Learning Support. </p><p><b>How to Get There:</b> To get to the Innovation Lab, take the elevators up to the 3rd floor at 122 S. Michigan Ave. Turn right after exiting the elevator and go through the doors at the end of the hallway. On your left side will be a stairwell and another door. Enter that door. The first classroom on your right will be the Innovation Lab!

        </p>
        <p>
        If you're interested in joining us for some rollicking-good writing, please <a href="https://docs.google.com/forms/d/e/1FAIpQLSfRx0yMIE23PHqfP1mosWC_KIEqyqwtU5v44INIPtYq4rVyog/viewform" target="_blank">fill out this form</a>. We're looking forward to seeing you!
        </p>
        <hr>
        <span><strong>NLU Creative Writing Community</strong><br>
        Wednesdays from 12 PM - 1 PM (Chicago Time)
        <br><b>In-Person Location:</b> 122 S. Michigan Ave., Innovation Lab (3rd Floor)
        <br><span><strong>Zoom Code: </strong></span>874 682 8098
        <br><br>
       



        </span>`;
    divContentNode.innerHTML=divContentText;
    resultDiv.appendChild(divContentNode);
    
    return resultDiv;


}

//Manually add custom views here.
//Call in main.js
export function AppendCustomViews(parentNode){
    parentNode.appendChild(CWCView());
}