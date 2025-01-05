function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var toggles = document.querySelectorAll('.accordion__toggle');

var toggle = function toggle() {
this.classList.toggle('accordion__toggle--active');
};

_toConsumableArray(toggles).forEach(function (el) {
el.addEventListener('click', toggle);
});



const primaryAccordionFrameClassName = "primary_accordion";
const primaryAccordionToggleClassName = "primary_accordion__toggle";
const primaryAccordionActiveClassName = "primary_accordion__toggle--active";
const primaryAccordionSvgClassName = "primary_accordion__svg";
const primaryAccordionContentClassName = "primary_accordion__content";
const nestedAccordionFrameClassName = "nested_accordion";
const nestedAccordionToggleClassName = "nested_accordion__toggle";
const nestedAccordionActiveClassName = "nested_accordion__toggle--active";
const nestedAccordionContentClassName = "nested_accordion__content";
const primaryIconClassName = "primary_accordion__toggle__icon";
const secondaryIconClassName = "secondary_accordion__toggle__icon";

const autoScroll = false; 

const scrollBehavior = "smooth"; 
const scrollOptions = {block: "start", inline: "nearest",behavior:scrollBehavior};


var selectionId=-1; 

export function closeUnselectedPanes(){
    let primaryArray = _toConsumableArray(document.querySelectorAll("."+primaryAccordionActiveClassName));
    

    primaryArray.forEach((elem)=>
    {
        let indexQueryResult = elem.getAttribute('index');
        if (    
            indexQueryResult !== undefined && 
            indexQueryResult !== selectionId
            )
            {
                elem.classList.remove(primaryAccordionActiveClassName);
            }
    });
}

export function primaryScrollHelper(caller)
{
    if (!autoScroll) {return;}

    if (caller.classList.contains(primaryAccordionActiveClassName)) {
    
        caller.scrollIntoView(scrollOptions);

    }
    else
    {
        let primaryFrame = _toConsumableArray(document.querySelectorAll("."+primaryAccordionFrameClassName));
        if (
            primaryFrame !== null &&
            Array.isArray(primaryFrame) &&
            primaryFrame.length > 0)
        {
            primaryFrame[0].scrollIntoView(scrollOptions);
        }
    }
}

export var primaryToggle = function primaryClickCallback() {

    if (
        this.classList === undefined || 
        this.classList.contains === undefined
        )
    {
        throw new TypeError("Callback attached to undefined item");
    }

    if (this.classList.contains(primaryAccordionActiveClassName))
    {
        selectionId = -1;
        this.classList.remove(primaryAccordionActiveClassName);
    }
    else 
    {
        if (this.getAttribute('index') !== undefined)
        {
            selectionId = this.getAttribute("index");
        }
        this.classList.add(primaryAccordionActiveClassName);
    }
    primaryScrollHelper(this);
    closeUnselectedPanes();
}

export var nestedToggle = function nestedCallback() {
    this.classList.toggle(nestedAccordionActiveClassName);
    if(autoScroll){this.scrollIntoView(scrollOptions);}
}



export function initializeAccordions(){
    let subToggles = _toConsumableArray(document.querySelectorAll('.'+nestedAccordionToggleClassName));
    
    subToggles.forEach( (el)=>
        {
            el.addEventListener('click', nestedToggle);
        }
    );


    let primToggles = _toConsumableArray(document.querySelectorAll('.'+primaryAccordionToggleClassName));
    primToggles.forEach( (el,index)=>
        {
            el.setAttribute("index",index);
            el.addEventListener('click',primaryToggle);
        }
    );
    
}


//initializeAccordions();
