import { nextTermID, TermID } from "../globalSettings";
import { LSEventAccordionView, NestedAccordionToggle, PrimaryAccordionToggle } from "./AccordionView";
import { GlobalEventMap } from "../globalScopedVars";
import { currentDate } from "../globalSettings";
import { GetFridayOfWeek, GetMegaShortDateString, GetMondayOfWeek } from "../utilities/DateStringUtilities";


//Function for getting the upcoming events
export function GetUpcomingEventList(offset){
    let upcomingDates=new Array();
    let todayDate=GetMondayOfWeek(currentDate,offset);
    let weekFromTodayDate = GetFridayOfWeek(todayDate,0);

    //console.log("Date in one week: ")

    GlobalEventMap.forEach(
        (array)=>{

            //console.log("Array I'm looking at: ",array);
            array.forEach(

                (lsEvent)=>{
                    
                    if (
                        (lsEvent.eventDate >= todayDate) &&
                        (lsEvent.eventDate <= weekFromTodayDate)

                    )
                    {
                        //console.log("Push this sucker");
                        upcomingDates.push(lsEvent);
                    }

                }


            )

        }


    );
    //console.log(upcomingDates);
    return upcomingDates.sort((lsEventA,lsEventB)=>{
        if (lsEventA.eventDate < lsEventB.eventDate){
            return -1;
        }
        else{
            return 1;
        }
    });
}

//Helper function for generating the "Hey, no more events this term, dood! Sorry!" content.
export function GetNoMoreEventsView(currentTerm,nextTerm,parentNode){ 
    const nodes = [
        document.createElement("p"),
        document.createElement("p")
    ];

    nodes[0].innerHTML="Learning Support\'s Events & Workshops series has concluded for the "+currentTerm+" term.";
    nodes[1].innerHTML="Stay tuned for more events, starting "+nextTerm+".";


    //Attach nodes to parent:
    nodes.forEach((elem)=>{
        parentNode.appendChild(elem);
    });

}


export function UpcomingEventsSubAccordion(offset){
    let upcomingEventList = GetUpcomingEventList(offset);
    let todayDate=GetMondayOfWeek(currentDate,offset);
    let weekFromTodayDate = GetFridayOfWeek(todayDate,0);
    const shortDateString = GetMegaShortDateString(todayDate)+" - "+GetMegaShortDateString(weekFromTodayDate);

     //Wrapper div
     const upcomingNestedAccordionDiv = document.createElement("div");
     //upcomingAccordionDiv.id = "upcoming";
 
     //Populate accordion content
     const contentNode = document.createElement("div");
     //contentNode.id="upcoming-content";
     contentNode.className="nested_accordion__content";
     
 
     if (upcomingEventList.length === 0){
         //GetNoMoreEventsView(TermID,nextTermID,contentNode);
         contentNode.innerHTML = `<p>There are no Learning Support-sponsored events scheduled from `+shortDateString+`.</p>`;
     }
     else {
         upcomingEventList.forEach(
             (ev,index)=>{
                 if (index>0){contentNode.appendChild(document.createElement("hr"));}
                 contentNode.appendChild(ev.getView());
             }
         );
 
     }
 
     upcomingNestedAccordionDiv.appendChild(NestedAccordionToggle(shortDateString+":"));
     upcomingNestedAccordionDiv.appendChild(contentNode);

     return upcomingNestedAccordionDiv;
}

export function UpcomingEventsView(){
    let upcomingEventList1 = GetUpcomingEventList(0);
    let upcomingEventList2 = GetUpcomingEventList(1);
    
    //Get dates:
    let todayDate=GetMondayOfWeek(currentDate,0);
    let weekFromTodayDate = GetFridayOfWeek(todayDate,1);
    const shortDateString = GetMegaShortDateString(todayDate)+" - "+GetMegaShortDateString(weekFromTodayDate);

    //Wrapper div
    const upcomingAccordionDiv = document.createElement("div");
    //upcomingAccordionDiv.id = "upcoming";

    //Populate accordion content
    const contentNode = document.createElement("div");
    //contentNode.id="upcoming-content";
    contentNode.className="primary_accordion__content";
    

    if (upcomingEventList1.length+upcomingEventList2.length === 0){
        //GetNoMoreEventsView(TermID,nextTermID,contentNode);
        contentNode.innerHTML = `<p>There are no Learning Support-sponsored events scheduled from `+shortDateString+`.</p><p>Stay tuned for more events coming soon!</p>`;
    }
    else {
       contentNode.appendChild(UpcomingEventsSubAccordion(0));
       contentNode.appendChild(document.createElement("hr"));
       contentNode.appendChild(UpcomingEventsSubAccordion(1));

    }

    upcomingAccordionDiv.appendChild(PrimaryAccordionToggle("Upcoming Events ("+shortDateString+"):"));
    upcomingAccordionDiv.appendChild(contentNode);
    upcomingAccordionDiv.appendChild(document.createElement("hr"));
    

    return upcomingAccordionDiv;


}