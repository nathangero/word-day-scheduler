// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
const TIME_BLOCKS_COUNT = 8; // 8 hours/blocks
const STORAGE_STRING_EVENTS = "userEvents";
// Key = div id, value = textarea string
var events = {}

var today = dayjs();
var calendar = $("#calendar");

$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  let divId = "hour-"; // Used to mark time block
  for (let i = 0; i <= TIME_BLOCKS_COUNT; i++) {
    let hour = (i + 9);
    divId += hour; // Calculate the id
    let hourAmPm = getAmPm(hour);
    let timeStatus = determinePastPresentFuture(hour); // Past, Present, or Future
    let event = events[divId] ? events[divId] : ""; // Check if event exists, if not then give an empty string

    let newBlock = $(`<div id=${divId} class="row time-block ${timeStatus}"></div>`);
    let blockTime = $(`<div class="col-2 col-md-1 hour text-center py-3">${hourAmPm}</div>`);
    let blockTextArea = $(`<textarea class="col-8 col-md-10 description" rows="3">${event}</textarea>`);
    let blockSaveButton = $(`<button class="btn saveBtn col-2 col-md-1" aria-label="save"></button`);
    blockSaveButton.click(saveEvent); // Add click listener

    let saveButtonIcon = $(`<i class="fas fa-save" aria-hidden="true"></i>`);

    blockSaveButton.append(saveButtonIcon); // Add the icon into the button

    // Add all the elemnts into the block
    newBlock.append(blockTime);
    newBlock.append(blockTextArea);
    newBlock.append(blockSaveButton);

    calendar.append(newBlock);
    divId = "hour-"; // reset the id to default before the next iteration runs
  }


  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?


  // TODO: Add code to display the current date in the header of the page.
  $("#currentDay").text(today.format("dddd MMMM DD, YYYY"));


  // Do bonus? Change seconds? Maybe change the colors of the blocks every new hour?
  // setInterval(() => {
  //   today = dayjs();
  //   $("#currentDay").text(today.format("dddd MMMM DD, YYYY HH:MM:ss"));
  // }, 1000);
});

// Determine if hour should have AM or PM after it.
function getAmPm(hour) {
  if (hour <= 12) {
    return hour + " AM";
  } else {
    return (hour - 12) + " PM";
  }
}

/**
 * Compares if the hour is equal to the current time, earlier in the day or later in the day.
 * The return will determine what css class to give, which will determine what color the time block will be
 * @param {Number} hour The hour to compare to
 * @returns Either the string "past", "present", or "future".
 */
function determinePastPresentFuture(hour) {
  let currentHour = today.format("HH");

  if (hour == currentHour) {
    return "present";
  } else if (hour < currentHour) {
    return "past";
  } else if (hour > currentHour) {
    return "future";
  }
}

/**
 * click event listener to save the current event's text in localStorage
 * @param {Event} event 
 */
function saveEvent(event) {
  let button = $(event.target);
  let buttonParent = button.parent(); // Get to the parent 
  let textarea = buttonParent.find("textarea");
  let text = textarea.val();
  let parentId = buttonParent.attr("id"); // Get the id for localstorage

  events[parentId] = text;
  localStorage.setItem(STORAGE_STRING_EVENTS, JSON.stringify(events));
}


function loadEvents() {
  let locStorage = JSON.parse(localStorage.getItem(STORAGE_STRING_EVENTS));
  
  if (locStorage) {
    events = locStorage;
  }
}


loadEvents();