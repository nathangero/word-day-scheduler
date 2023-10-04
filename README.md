# Work Day Scheduler

## Description

The purpose of this project is to create a daily planner. It shows the standard working hours from 9am-5pm, highlights the current hour in red, the past hours in gray, and the upcoming hours in green. There's also a save button that will save whatever text you enter into the browser's local storage, so when the user refreshes/returns back to the page, it'll load what was in the colored boxes.

The aim was to practice using Dayjs with times and dates, and using JQuery to traverse the DOM and also dynamically create elements and their classes.

Link to deployment here: [https://nathangero.github.io/work-day-scheduler/](https://nathangero.github.io/work-day-scheduler/)

## Learning Points

* JQuery makes adding/editing DOM elements very short and simple. The code to right is much shorter than normal JavaScript.
    * Being able to create a whole element and putting in the whole string like ```var calendar = $('<div id="calendar" class="container-lg px-5">');``` is very convenient!
    * JQuery makes it very easy to traverse elements post event listener. There's an example of the code doing that [here](#getting-the-textarea-value)
* Dayjs is **very** easy to use. It made getting and formatting dates and times easy.
* Combining Bootstrap and CSS is incredibly useful. It's nice that we can use the bootstrap classes but also be able to customize them to our liking. An example is using the "past", "present", and "future" classes to determine the time block background color.

## Code Snippets

### Getting the textarea value

This for loop dynamically creates and adds each time block with their appropriate classes and text (if an event was saved). The purpose of making it dynamic was so if the amount of time blocks to be shown would ever change, it's not harded coded. Also, it makes it easy to change the class of the div depending on the current time of the browser.
```js
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
```

This function traverses the DOM to get the textarea value and the id of the div its inside of.
```js
function saveEvent(event) {
  let button = $(event.target);
  let buttonParent = button.parent(); // Get to the parent 
  let textarea = buttonParent.find("textarea");
  let text = textarea.val();
  let parentId = buttonParent.attr("id"); // Get the id for localstorage

  /* Save event in local storage */
}
```

### Extra touch

This function will change the time blocks automatically if the hour changes while the user is still on the site. I was very proud of this because it helped me understand how to make the time blocks dynamically outside of the ```$(function () {}```.
```js
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
```

## Images


## Credits

### Resources

[JQuery .click()](https://www.w3schools.com/jquery/event_click.asp)