import { JSONString } from "./JSONGlobal";


// ---
// Pseudo-Enums 
// Since vanilla JS doesn't support enums like TypeScript does, but I want enum-like syntax for this code (in case we need to add/remove keys used in other modules), I create global-scoped immutable objects whose fields work just like enums. 
// Coder needs to ensure values aren't repeated along multiple keys.
//
export const LSEventType = {
    OTHER : -1,
    ELL : 0,
    APA : 1,
    MTH : 2,
    ENG : 3,
    CSIS : 4,
    CWC : 5,
    WELCOMEWEEK : 6,
    STUDYJAMS : 7
}
export const LSEventLocation = {
    TBD : -1,
    STUDYTABLES : 0,
    LSSPACE : 1,
    WHEELINGSPACE : 2,
    DEN : 3,
    ATRIUM : 4,
    OTHER : 5
}




// 
//Global Maps that allow us to track how many events of each type there are.

//Ideal type signature: Map<string,LSEventType>
export var LSEventStringToEnumMap = new Map(); //Silly workaround from when I had the app directly parse the CSV rather than converting to JSON. Might not be necessary anymore.
 
//Ideal type signature: Map<LSEventType, LSEventData>
export var GlobalEventMap = new Map(); //Used to categorize events by whether they're APA vs. MTH, etc. 

//Ideal type signature: Map<string, LSEventData>
export var GlobalSublistMap = new Map(); //Used to track events that are part of a series. For example: "MTH-101 Milestone Workshops".

//Enum to section title map
export var GlobalTitleMap = new Map(); //Used to fetch the title names for each accordion section. Another dumb workaround from me not planning this code well womp womp.



//
// Functions for initializing each of the dictionaries above
// Update as needed for new event types
export function InitializeStringEnumMap(){
    LSEventStringToEnumMap.set("Other",LSEventType.Other);
    LSEventStringToEnumMap.set("APA",LSEventType.APA);
    LSEventStringToEnumMap.set("MTH",LSEventType.MTH);
    LSEventStringToEnumMap.set("CSIS",LSEventType.CSIS);
    LSEventStringToEnumMap.set("ENG",LSEventType.ENG);
    LSEventStringToEnumMap.set("ELL",LSEventType.ELL);

    LSEventStringToEnumMap.set("Welcome Week",LSEventType.WELCOMEWEEK);
    LSEventStringToEnumMap.set("Study Jams",LSEventType.STUDYJAMS);

}
export function InitializeGlobalEventListMap(){
    let entries = Object.entries(LSEventType);
    entries.forEach(element => {
        GlobalEventMap.set(element[1],new Array());
    });

    //if (debug) {console.log(GlobalEventMap);}

}
export function InitializeTitleMap(){
    if (GlobalTitleMap){
        GlobalTitleMap.set(LSEventType.APA,"APA Formatting Workshops");
        GlobalTitleMap.set(LSEventType.CSIS,"Computer Science & Information Systems Events and Workshops");
        GlobalTitleMap.set(LSEventType.CWC,"NLU Creative Writing Community Events and Workshops");
        GlobalTitleMap.set(LSEventType.ELL,"Events and Workshops for English Language Learners");
        GlobalTitleMap.set(LSEventType.ENG,"Writing Skills and ENG Workshops");
        GlobalTitleMap.set(LSEventType.MTH,"MTH Workshops");
        GlobalTitleMap.set(LSEventType.STUDYJAMS,"Study Jams");
        GlobalTitleMap.set(LSEventType.WELCOMEWEEK,"Welcome Week Events");
    }

}







//Misc. stuff that should probably be migrated to a different module.

//This function splits a list of events into past and current/future events.
export function ParsePastEvents(eventList,referenceDate){
    let pastArray = new Array();
    let futureArray = new Array();
    
    
    const dateSortFunction = (lsEventA,lsEventB)=>{
        if (lsEventA.eventDate < lsEventB.eventDate){
            return -1;
        }
        else{
            return 1;
        }
    }


    //Populates future and past lists from whole list
    eventList.forEach(
        (elem)=>{
            if (elem.eventDate < referenceDate){
                pastArray.push(elem);
                
            }
            else {
                futureArray.push(elem);
                
            }
        }
    )
    pastArray.sort(dateSortFunction);
    futureArray.sort(dateSortFunction);

    return {past:pastArray,future:futureArray};

}


//This iterates through the whole list of events and smooshes them into one big array.
//It creates a deep copy, so use sparingly.
export function GetFullEventArray(){
    let fullEventArray=new Array();
    GlobalEventMap.forEach((subarray)=>{
        //console.log("In GetFullEventArray: ",subarray);
        fullEventArray=fullEventArray.concat(subarray);


    })
    return fullEventArray;
}




//Produces a DOM node that contains the "Location: " text.
export function GetLocationView(location, key,override){
    const resultSpan = document.createElement("span");
    resultSpan.key = key;

    //Add bold text as "header" for the location
    const locationElement = document.createElement("strong");
    locationElement.innerHTML = (location === LSEventLocation.STUDYTABLES && !override)? "Zoom Link: ":"Location: ";
    resultSpan.appendChild(locationElement);


    //Add specific content for the location
    const specificLocationSpan = document.createElement("span");
    if(override){
        specificLocationSpan.innerHTML = override;
        
    }
    else {
        switch(location){
            case LSEventLocation.ATRIUM:
                specificLocationSpan.innerHTML = "Chicago Campus - The 2nd-Floor Atrium";
                break;
            case LSEventLocation.DEN:
                specificLocationSpan.innerHTML = "The Den (Chicago Campus, Room 6005)";
                break;
    
            case LSEventLocation.LSSPACE:
                specificLocationSpan.innerHTML = "The Learning Support Space (Chicago Campus, Room 6003)";
                break;
    
            case LSEventLocation.WHEELING:
                specificLocationSpan.innerHTML = "Wheeling Campus, Room 331";
                break;
    
            case LSEventLocation.TBD:
                specificLocationSpan.innerHTML = `<em>TBD</em>.`;
                break;
    
            case LSEventLocation.OTHER:
            case LSEventLocation.STUDYTABLES:
                specificLocationSpan.innerHTML= `<a title="Study Tables Zoom" href="https://nl.zoom.us/my/studytables" target="_blank" rel="noopener">https://nl.zoom.us/my/studytables</a>`;
                break;
    
           
        }
    }
    
    resultSpan.appendChild(specificLocationSpan);

    return resultSpan;
}