// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
const TIME_BLOCKS_COUNT = 8; // 8 hours/blocks
const STORAGE_STRING_EVENTS = "userEvents";

// Key = div id, value = textarea string
var events = {}

var today = dayjs();
var currentHour = today.format("HH");


function createTimeBlocks() {
  var calendar = $('<div id="calendar" class="container-lg px-5">');

  let divId = "hour-"; // Used to mark time block
  for (let i = 0; i <= TIME_BLOCKS_COUNT; i++) {
    let hour = (i + 9);
    divId += hour; // Calculate the id
    let hourAmPm = getAmPm(hour);
    let timeStatus = determinePastPresentFuture(hour); // Past, Present, or Future
    let event = events[divId] ? events[divId] : ""; // Check if event exists, if not then give an empty string

    let newBlock = $(`<div id=${divId} class="row time-block"></div>`);
    newBlock.addClass(timeStatus);

    let blockTime = $(`<div class="col-2 col-md-1 hour text-center py-3"></div>`);
    blockTime.text(hourAmPm);

    let blockTextArea = $(`<textarea class="col-8 col-md-10 description" rows="3"></textarea>`);
    blockTextArea.text(event)

    let blockSaveButton = $(`<button class="btn saveBtn col-2 col-md-1" aria-label="save"></button`);
    blockSaveButton.click(saveEvent); // Add click listener

    let saveButtonIcon = $(`<i class="fas fa-save" aria-hidden="true"></i>`);

    blockSaveButton.append(saveButtonIcon); // Add the icon into the button

    // Add all the elemnts into the block
    newBlock.append(blockTime);
    newBlock.append(blockTextArea);
    newBlock.append(blockSaveButton);

    // Add the new block to the calendar
    calendar.append(newBlock);
    divId = "hour-"; // reset the id to default before the next iteration runs
  }

  return calendar;
}


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

// Load user's saved events
function loadEvents() {
  let locStorage = JSON.parse(localStorage.getItem(STORAGE_STRING_EVENTS));
  
  if (locStorage) {
    events = locStorage;
  }
}


$(function () {
  let calendar = createTimeBlocks();
  $("main").append(calendar)

  $("#currentDay").text(today.format("dddd MMMM DD, YYYY HH:mm:ss"));

  
  // Automatically update the page every new hour.
  setInterval(() => {
    let timerTime = dayjs();
    let timerHour = timerTime.format("HH");

    if (timerHour !== currentHour) {
      currentHour = timerHour;
      $("#calendar").remove(); // Remove old calendar
      let calendar = createTimeBlocks();
      $("main").append(calendar) // Add back new calendar with updated time blocks
    }
    $("#currentDay").text(timerTime.format("dddd MMMM DD, YYYY HH:mm:ss"));
  }, 1000);
});

// Get the events outside of the document.ready().
loadEvents();