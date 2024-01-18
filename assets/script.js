$(document).ready(function () {
    // Initialize with the current day
    var currentDay = dayjs();
    updateCalendar(currentDay);

    // Button click event to go to the previous day
    $("#prevDayBtn").on("click", function () {
        currentDay = currentDay.subtract(1, 'day');
        updateCalendar(currentDay);
    });

    // Button click event to go to the next day
    $("#nextDayBtn").on("click", function () {
        currentDay = currentDay.add(1, 'day');
        updateCalendar(currentDay);
    });

    // Function to create time blocks for standard business hours
    function createTimeBlocks(day) {
        var container = $(".container");
        var currentTime = dayjs();

        // Display the current time
        $("#currentTime").text("Current Time: " + currentTime.format("h:mm A"));

        for (var hour = 9; hour <= 17; hour++) {
            var startTime = day.hour(hour).minute(0);
            var endTime = day.hour(hour + 1).minute(0);

            var timeBlock = $("<div>").addClass("time-block row");
            var hourColumn = $("<div>").addClass("hour col-md-1").text(startTime.format("hA"));
            var textArea = $("<textarea>").addClass("description col-md-10");

            // Color-code time blocks based on past, present, and future
            if (currentTime.isBefore(endTime)) {
                timeBlock.addClass(currentTime.isBefore(startTime) ? "future" : "present");
            } else {
                timeBlock.addClass("past");
            }

            var saveBtn = $("<button>").addClass("saveBtn col-md-1").html('<i class="fas fa-save"></i>');

            // Load events from local storage
            var savedEvent = localStorage.getItem("event-" + day.format("YYYY-MM-DD") + "-" + hour);
            if (savedEvent) {
                textArea.val(savedEvent);
            }

            // Save event to local storage when save button is clicked
            saveBtn.on("click", function () {
                var eventText = $(this).siblings("textarea").val();
                var eventHour = parseInt($(this).parent().index()) + 9; // Adjust index to match hours

                localStorage.setItem("event-" + day.format("YYYY-MM-DD") + "-" + eventHour, eventText);
            });

            timeBlock.append(hourColumn, textArea, saveBtn);
            container.append(timeBlock);
        }
    }

    // Function to update the calendar for the specified day
    function updateCalendar(day) {
        // Display current day at the top of the calendar
        $("#currentDay").text(day.format("dddd, MMMM D"));

        // Clear existing time blocks
        $(".container").empty();

        // Create time blocks for the specified day
        createTimeBlocks(day);
    }

    // Update the current time every minute
    setInterval(function () {
        var currentTime = dayjs();
        $("#currentTime").text("Current Time: " + currentTime.format("h:mm A"));
        // Update time blocks based on current time
        updateCalendar(currentTime);
    }, 60000);
});
