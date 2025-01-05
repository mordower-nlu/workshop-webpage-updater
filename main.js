//import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { LSEvent } from './src/models/LSEvent.js'


//CSS imports from website
import './src/styles/right-navigation-form.css';
import './src/styles/wysiwyg.css';
import './src/styles/addition.css';
import '/src/styles/styles.css';
import './src/styles/customstyles.css';

document.querySelector('#app').innerHTML = `
  <div id="main-div">
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

import "./src/initEventLists.js";
import { UpcomingEventsView } from './src/views/UpcomingEventsView.js'
import { GetFullEventArray, GlobalTitleMap, LSEventType, ParsePastEvents } from './src/globalScopedVars.js'
import { currentDate, displayUpcomingEvents, hideWelcomeWeek, TermID } from "./src/globalSettings.js";
import { PrimaryToggleSVG, SecondaryToggleSVG } from './src/views/SVGToggles.js'
import { LSEventAccordionView, NestedAccordionToggle, PrimaryAccordionToggle } from './src/views/AccordionView.js'
import { initializeAccordions } from './src/views/AccordionScripts.js';
import { AppendCustomViews } from './src/views/CustomEventViews.js';



//Main body
const mainDiv = document.createElement("div");
mainDiv.id ="main";

//
//const mainDiv = document.getElementById("main");

//Add upcoming events
if (displayUpcomingEvents){
  const upcomingEvents = UpcomingEventsView();
  mainDiv.appendChild(upcomingEvents);

  const subheader = document.createElement("div");
  subheader.innerHTML = `<h5>All Workshops & Events for the `+TermID+` Term:</h5><br/>`;
  mainDiv.appendChild(subheader);

}


//Iterate through enums and populate accordions
Object.values(LSEventType).forEach(
  (val)=>{
    if (
        (val === LSEventType.WELCOMEWEEK && hideWelcomeWeek === false) ||
        (val !== LSEventType.WELCOMEWEEK)
      )
      {
        let sectionTitle = GlobalTitleMap.get(val);
        if (sectionTitle){
          const childToAppend =LSEventAccordionView(sectionTitle,val,null); 
          if (childToAppend) {     mainDiv.appendChild(childToAppend);}
        }
      }

    

  }
)

AppendCustomViews(mainDiv); //Add the one-off weird stuff we have to manually code.

document.querySelector('#app').appendChild(mainDiv);

initializeAccordions();