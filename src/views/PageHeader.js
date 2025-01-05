import { allEventsConcluded, TermID } from "../globalSettings";


export function GetPageHeader(rootNode){
    const item1 = `<h1>Learning Support Events &amp; Workshops:</h1>`;
    const description = (allEventsConcluded)?`<h5>Our workshop series has concluded for the `+TermID+` term. Stay tuned for more workshops coming soon, though!</h5>`:`<p>All events and workshops will take place over <a href="https://nl.edu/learning-support/studytables/">Study Tables</a>, unless otherwise stated.</p>
<p>To learn more about our different events, click on the items below:</p>`;

    rootNode.innerHTML = item1+description+`<hr/>`;

}


