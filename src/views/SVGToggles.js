//This file creates the SVG images we use for button icons for our accordion toggles.

export function PrimaryToggleSVG(){ 
  let toggleSpan = document.createElement("span");
  toggleSpan.className = "svg svg--plus primary_accordion__toggle__icon"; 
  toggleSpan.innerHTML = 
  `
   <svg   width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
         <path d="M9.4 0l-.001 6.999L16 7v2.4l-6.601-.001L9.4 16H7l-.001-6.601L0 9.4V7l6.999-.001L7 0z"/>
       </svg>
     `
    
    
    return toggleSpan;
    };


export function SecondaryToggleSVG() {
  let toggleSpan = document.createElement("span");
  toggleSpan.className = "svg svg--plus primary_accordion__toggle__icon"; 
  toggleSpan.innerHTML = 
`
           <svg className="svg svg--plus secondary_accordion__toggle__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
               <path d="M0 8 L16 16 L16 0 Z"></path>
             </svg>
   `
  
  
  return toggleSpan;
  };