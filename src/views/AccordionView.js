/*
All of this is me refactoring the TSX from the original version of this app into vanilla JS.
*/

import { GlobalEventMap, ParsePastEvents } from "../globalScopedVars";
import { hideEmptyEventTypeAccordions, TermID } from "../globalSettings";
import { LSEventListView } from "../models/LSEvent";
import { PrimaryToggleSVG, SecondaryToggleSVG } from "./SVGToggles";


//Constructs the nodes for the pre-and-post descriptions of the event, depending on whether it's an array of strings/dom elements, or whether it's a single string.
function ParseDescriptionHelper(content){
    let resultNode = null;
    
    if (content){
        resultNode = document.createElement("span");
    }
    else {
        return;
    }

    if (
        Array.isArray(content)        
    ){

        
        content.forEach(
            (elem)=>{
                const contentNode = document.createElement("span");
                contentNode.innerHTML=elem; 

                resultNode.appendChild(contentNode);

            }

        );

    }
    else {
        //Assumes the predescription is just a single string if it's not an array.
        resultNode.innerHTML=content;
    }

    return resultNode;

}





//View for when a sublist is empty.
export function SublistConcludedView(title){
    let returnString = "The "+title+" event series has concluded for the "+TermID+" term. Stay tuned for more events, coming soon!";
    return returnString;
}

//Toggle button for nested accordion
export function NestedAccordionToggle(title){
    const nestedAccordionNode = document.createElement("button");
    nestedAccordionNode.className ="nested_accordion__toggle nested_accordion__toggle--active";
    nestedAccordionNode.innerHTML = title;
    nestedAccordionNode.appendChild(SecondaryToggleSVG());
    

    return nestedAccordionNode;


}




//Parameters copied and pasted from React version of app:
//{title:string,eventList:Array<LSEvent>,preDescription:Array<ReactElement>|null,postDescription:Array<ReactElement>|null}
export function NestedAccordionContent(title,eventList,preDescription,postDescription){
    const nestedContentElem = document.createElement("div");
    nestedContentElem.className ="nested_accordion__content";
    
    let parsedArray = ParsePastEvents(eventList);
    
    //If the entire list of events is empty for this nested accordion, display "no more events this term."
    if (parsedArray.future.length===0){
        nestedContentElem.innerHTML = SublistConcludedView(title);
        
        return nestedContentElem;
    }


    //Add a description of the event before the list
    const preDescriptionNode=ParseDescriptionHelper(preDescription);
    if (preDescriptionNode){preDescriptionNode.appendChild(document.createElement("hr"));//add divider.
    }
   
       

        
    
    const postDescriptionContentNode=ParseDescriptionHelper(postDescription);
    
    if (preDescriptionNode) {nestedContentElem.appendChild(preDescriptionNode);}
    
    nestedContentElem.appendChild(LSEventListView(eventList));
    
    
    if (postDescriptionContentNode){
        nestedContentElem.appendChild(document.createElement("hr"));
        nestedContentElem.appendChild(postDescriptionContentNode);
    }

    

    return nestedContentElem;

}

//Parameters from React version: { title:string,eventList:Array<LSEvent>,preDescription:Array<ReactElement>|null,postDescription:Array<ReactElement>|null}
export function NestedAccordion(title,eventList,preDescription,postDescription){
    const nestedAccordion = document.createElement("div");
    nestedAccordion.appendChild(NestedAccordionToggle(title));
    nestedAccordion.appendChild(NestedAccordionContent(title,eventList,preDescription,postDescription));

    
    return nestedAccordion;
}



//PRIMARY ACCORDION


//Helper function that checks for all the sublist items then separates one-offs from series events
//eventList should be an array of LSEvents.
export function SeparateSublistsHelperFunction(eventList){
    let nestedSublistMap = new Map(); //Type: <string,Array<LSEvent>>
    let oneOffEvents = new Array();

    eventList.forEach(
        (elem)=>{
            if (elem.lsEventSublistKey){
                if(nestedSublistMap.get(elem.lsEventSublistKey)===undefined){
                    nestedSublistMap.set(elem.lsEventSublistKey,[elem]);

                }
                else
                {
                    (nestedSublistMap.get(elem.lsEventSublistKey))?.push(elem);
                }



            }
            else
            {
                oneOffEvents.push(elem);
            }

        }
    )
    //console.log(nestedSublistMap);
    //console.log(oneOffEvents);

    return {oneOffs:oneOffEvents,sublists:nestedSublistMap};
    
}





//The button for the main accordion items
export function PrimaryAccordionToggle(title){
    const toggleNode = document.createElement("button");
    toggleNode.className="primary_accordion__toggle primary_accordion__toggle--active";
    const titleSpan = document.createElement("span");
    titleSpan.innerHTML = title;
    toggleNode.append(titleSpan);
    toggleNode.append(PrimaryToggleSVG());

   return toggleNode;
}


//Parameters: {title,eventList}:{title:string,eventList:Array<LSEvent>}
export function PrimaryAccordionContent(title,eventList){

    //Node to return at the end
    const primaryAccordionContentNode = document.createElement("div"); 
    primaryAccordionContentNode.className="primary_accordion__content";

  
    //
    if (eventList.length<1 ||
        eventList == null
    ){
        primaryAccordionContentNode.innerHTML = `There are no `+title+` scheduled for the remainder of the `+TermID +` term.<br/> Stay tuned for more events coming soon!`;    }

    //Split future and past events
    let parsedArray = ParsePastEvents(eventList);
    
    //Separates one-off events from event series
    let sublistHelperResult = SeparateSublistsHelperFunction(parsedArray.future);

    //Add one-off events first
    if (sublistHelperResult.oneOffs.length>0){
        
        primaryAccordionContentNode.appendChild(LSEventListView(sublistHelperResult.oneOffs));
    }

    //Populates list of event series
    //Iterates through the sublists Map object
    let sublistArray = new Array();
    sublistHelperResult.sublists.forEach(
        (elem,key)=>{
            let sublistObject= {
                lsEventSublistKey:key,
                lsEventType:elem[0].lsEventType,
                lsEventList:elem
            }
            sublistArray.push(sublistObject);
        }
    )
    sublistArray.sort((a,b)=>{
        
        return (a.lsEventSublistKey).localeCompare(b.lsEventSublistKey);
    });

    let sublistDiv = null; //default to null
    if (sublistArray.length>0){
        sublistDiv=document.createElement("div");

        sublistArray.forEach(
            (elem,index)=>{
                if(index>0){
                    sublistDiv.appendChild(document.createElement("hr"));
                }
                sublistDiv.appendChild(NestedAccordion(elem.lsEventSublistKey,elem.lsEventList,null,null));

            }
        )
    }

    
    //Create divider if there are both one-offs and series events
    let sectionDividerNode = null;
    if (sublistHelperResult.oneOffs.length>0 && sublistHelperResult.sublists.size>0){
        sectionDividerNode = document.createElement("hr");

    }

    

    //Appends children to final node we'll return
    if (sectionDividerNode) {primaryAccordionContentNode.appendChild(sectionDividerNode);}
    if (sublistDiv) {primaryAccordionContentNode.appendChild(sublistDiv);}
    /* return <>
        <LSEventListView title={title} eventList={sublistHelperResult.oneOffs}/>
        {separator}
        {sublistJsx}
        <LSPastEventsView title={title} eventList={parsedArray.past}/>


    </>;*/

    return primaryAccordionContentNode;
}




//Full Accordion:
//Types: {title:string,lsEventType:LSEventType,preDescription:null|any}
export function LSEventAccordionView(title,lsEventType,preDescription){
    const RawEventList = GlobalEventMap.get(lsEventType); //Get complete array of all events under a given event type ID
    let eventArrays = (RawEventList !== undefined)?ParsePastEvents(RawEventList):null;
    
    //If there are no future events and we hide empty accordions, return null.
    if (eventArrays.future.length===0 && hideEmptyEventTypeAccordions){
        return null;
    }


    let curatedEventList = null;
    //if (eventArrays.future.length>0){
        curatedEventList = PrimaryAccordionContent(title,eventArrays.future);
    //}
   

    //Construct the div we plan to return
    const resultDiv = document.createElement("div"); //return this div.
    resultDiv.appendChild(PrimaryAccordionToggle(title));
    if (preDescription){
        resultDiv.appendChild(ParseDescriptionHelper(preDescription));
        resultDiv.appendChild(document.createElement("hr"));
    }
    if(curatedEventList){
        resultDiv.appendChild(curatedEventList);
    }


    
    return resultDiv;



}