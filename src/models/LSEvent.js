import {  GetLocationView, LSEventLocation, LSEventStringToEnumMap, LSEventType } from "../globalScopedVars";
import { GetFullDateString, GetTwoTimesString } from "../utilities/DateStringUtilities";

export class LSEvent {
    eventTitle = "";
    eventDate=null;// = new Date();
    eventEndTime = null; // if end time is specified, assign this.
    eventDescription = null; // if there's a description we want to display before the event details, initialize an array of dom nodes or elements here
    eventPostDescription = null; //same for this 
    lsEventType = null;

    //Optional key if the event is part of a series / sublist:
    lsEventSublistKey = null; //should be a string
    eventLocation = LSEventLocation.STUDYTABLES;


    //Optional string overrides for certain fields
    eventTypeOverride=null;
    eventDateOverride=null;
    eventLocationOverride=null;


    constructor(title,date){
        this.eventTitle=title;
        if (date) {this.eventDate = date;}
    }


    //Returns a DOM element in the desired event format.
    getView(){
        const viewElem = document.createElement("div");
        const titleElem = document.createElement("strong");
        titleElem.innerHTML=this.eventTitle;

        //Include title
        viewElem.appendChild(titleElem);
        viewElem.appendChild(document.createElement("br"));

        //Include day of the event (including weekday)
        //console.log("Event date: "+this.eventDate);
        const dayString = GetFullDateString(this.eventDate,this.eventEndTime);
        const dayElem = document.createElement("span");
        dayElem.innerHTML=dayString;
        viewElem.appendChild(dayElem);
        viewElem.appendChild(document.createElement("br"));


        //Include event times
        const timeString = GetTwoTimesString(this.eventDate,this.eventEndTime);
        if (timeString){
            const timeElem = document.createElement("span");
            timeElem.innerHTML = timeString;
            viewElem.appendChild(timeElem);
            viewElem.appendChild(document.createElement("br"));

        }


        //Include location data
        const locationNode = GetLocationView(this.eventLocation,this.eventTitle,this.eventLocationOverride);
        viewElem.appendChild(locationNode);

        return viewElem;



    }


    //Reads fields from individual elemnts of JSON object array from the JSONGlobal.js module.
    //helper functions
    checkValidDate(jsonObject){
        if (
            jsonObject.Date === null ||
            jsonObject.Date === "" ||
            jsonObject.Date === " " ||
            jsonObject.Date === "tbd" ||
            jsonObject.Date === "TBD" 
        )
        {
            return false;
        }

        return true;
    }

    set24hrsTimeHelper(jsonObject){
        
        //Handle start and end time:
        let timeParse = jsonObject.StartTime.split(" ");
        timeParse=timeParse[0].split(":")
        let modifiedHours = parseInt(timeParse[0]);
        if (modifiedHours < 9) modifiedHours+=12; //cast to 24-hour clock if before 9 am
        this.eventDate.setHours(modifiedHours,timeParse[1]);
        //By default, set this event's end time to the same as its start time, +1 hr.
        this.eventEndTime=new Date(this.eventDate);
        this.eventEndTime.setHours(timeParse[0]+1,timeParse[1]);
        //If a specific end time is listed, however, mark it as such.
        timeParse = jsonObject.EndTime.split(" "); //remove trailing AM or PM
        timeParse = timeParse[0].split(":");
        modifiedHours = parseInt(timeParse[0]);
        if (modifiedHours < 9) modifiedHours+=12; 
        this.eventEndTime.setHours(modifiedHours,timeParse[1]);
        
    }
    parseEventTypeHelper(jsonObject){
        //Parse event type
        if (
            jsonObject.Department !== undefined &&
            jsonObject.Department !== null
        )
        {
            let mapResult = LSEventStringToEnumMap.get(jsonObject.Department.toString());
            if (mapResult !== undefined){
                this.lsEventType=mapResult;
            }
        }


        
    }
    //Helper function for displaying the event location.
    setEventLocationHelper(jsonObject){
        //If Location field of parsed CSV is blank, set LSEventLocation to Study Tables.
        if (
            jsonObject.Location === undefined 
            || jsonObject.Location === null
            || jsonObject.Location === ""
        )
        {
            //console.log("Location is undefinzz.");
            this.lsEventLocation=LSEventLocation.STUDYTABLES;
        }
        else if (jsonObject.Location !== "") 
        {
            this.eventLocationOverride = jsonObject.Location;
        }

    }

    
    //Main JSON object parsing method
    //Input individual JSON object from the global array in JSONGlobal.js
    setDataFromJSON(jsonObject){
        try{
            //Set default values based on fields from jsonObject defined in the JSONGlobal.js module
            this.eventTitle = jsonObject.OfficialWorkshopTitle;
            
            if (
                jsonObject.Date &&
                jsonObject.Date !== "" &&
                jsonObject.Date !== " " &&
                jsonObject.Date !== "TBD"

            ){

                this.eventDate=new Date(jsonObject.Date);
            }
            else {
                this.eventDate=`<b>Event Date: </b><span>TBD</span>`;
            }
            this.lsEventType = LSEventType.Other; //default to other
            this.lsEventLocation = LSEventLocation.STUDYTABLES; //default to Zoom study tables
            this.lsEventSublistKey = jsonObject.SublistKey;


            //Use helper functions to set complicated fields
            if (this.checkValidDate(jsonObject)){

                this.set24hrsTimeHelper(jsonObject);
            }
            this.setEventLocationHelper(jsonObject);
            this.parseEventTypeHelper(jsonObject);
            


        }
        

        catch(e)
        {
            console.log("In LSEvent.setDataFromJSON(): error while parsing: "+e);
        }


    }


}

export function LSEventListView(lsEventArray){
    //console.log("In LSEventListView");
    const listViewElem = document.createElement("div");
    if (Array.isArray(lsEventArray) &&
        lsEventArray.length>0    
    ){
        //console.log("In LSEventListView: it is an array");
        lsEventArray.forEach((elem,index)=>{
            if (index>0)
            {
                    listViewElem.appendChild(document.createElement("hr"));
            }
            listViewElem.appendChild(elem.getView());   

        });
        
    }
    return listViewElem;
    
}



