import { GetFullEventArray, GlobalEventMap, InitializeGlobalEventListMap, InitializeStringEnumMap, InitializeTitleMap } from "./globalScopedVars";
import { debug } from "./globalSettings";
import { JSONString } from "./JSONGlobal";
import { LSEvent } from "./models/LSEvent";

InitializeStringEnumMap();
InitializeGlobalEventListMap();
InitializeTitleMap();

const lsEventData = JSON.parse(JSONString); //global array of JSON objects

//if (debug) {console.log("lsEventData : ",lsEventData);}


function InitializeEventList(){
    lsEventData.forEach((elem)=>{
        
        //if (debug) {console.log("in InitializeEventList. JSONObject: ",elem);}
        
        let lsEvent = new LSEvent(null,null);
        //if (debug) {console.log("In InitializeEventList. New lsEvent: ",lsEvent);}

        lsEvent.setDataFromJSON(elem);
        //if (debug) {console.log("In InitializeEventList. Parsed lsEvent: ",lsEvent);}

        
        if (lsEvent !== undefined){
            if (GlobalEventMap.get(lsEvent.lsEventType)){
                GlobalEventMap.get(lsEvent.lsEventType)?.push(lsEvent);
            }
        } 
    });

    //Sorts the array of event lists by start time/date
    GlobalEventMap.forEach((elem)=>{
        if (elem.sort !== undefined){
            elem.sort((a,b)=>{

                return (a.eventDate<b.eventDate)? -1:1;
    
            })    
        }
        


    })


}

InitializeEventList();


