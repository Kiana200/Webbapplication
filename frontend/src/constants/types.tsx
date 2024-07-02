
export type eventClickedData = {
    el: any; // The HTML element for this event.
    event: eventObject; // The associated Event Object.
    jsEvent: any; // The native JavaScript event with low-level information such as click coordinates.
    view: viewObject; // The current View Object.
};

export type eventDraggedData = {
    event: eventObject; // The associated Event Object.
    relatedEvents: eventObject[]; // An array of other related Event Objects that were also affected. 
    oldEvent: eventObject; // An Event Object with data prior to the change
    revert: any; // A function that can be called to reverse this action
};

export type selectionInfo = {
    start: Date; // The associated Event Object.
    end: Date; // An array of other related Event Objects that were also affected. 
    startStr: string; // An Event Object with data prior to the change
    endStr: string; // A function that can be called to reverse this action
    allDay: boolean;
    jsEvent: any;
    view: viewObject;
};

// Info taken from https://fullcalendar.io/docs/event-object
export type eventObject = {
    id: string; // A unique identifier of an event. Useful for getEventById.
    groupId: string; // Events that share a groupId will be dragged and resized together automatically.
    allDay: boolean; // Determines if the event is shown in the “all-day” section of relevant views.
    start: Date | null;
    end: Date | null;
    title: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
}

// Info taken from https://fullcalendar.io/docs/view-object
export type viewObject = {
    type: string; // Name of one of the available views (a string).
    title: string; // Title text that is displayed at the top of the headerToolbar (such as “September 2009” or “Sep 7 - 13 2009”).
    activeStart: Date; // A Date that is the first visible day.
    activeEnd: Date; // A Date that is the last visible day. Note: This value is exclusive.
    currentStart: Date; // A Date that is the start of the interval the view is trying to represent. For example, in month view, this will be the first of the month. This value disregards hidden days.
    currentEnd: Date; // A Date that is the end of the interval the view is trying to represent. Note: This value is exclusive.
    calendar: any; // The master Calendar Object this view belongs to.
}