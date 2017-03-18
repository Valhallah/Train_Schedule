 $(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCYrmubmL2plY2nwaqmolT0KNZIi3IeYdU",
        authDomain: "train-project-60e31.firebaseapp.com",
        databaseURL: "https://train-project-60e31.firebaseio.com",
        storageBucket: "train-project-60e31.appspot.com",
        messagingSenderId: "407461736736"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    function refreshTable(snapshot) {
        $("#mainTableBody").empty();
        database.ref("/trains").once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                displayItem(data);
            });
        });
    }

    function displayItem(data) {
        // calculate the minutes until next arrival
        var minsUntilArrival = getNextOccurance(data.val().firstTrainTime, data.val().frequency);

        // append the row to the table
        $("#mainTableBody").append(
            "<tr>" +
            "<td>" + data.val().trainName + "</td>" +
            "<td>" + data.val().destination + "</td>" +
            "<td>" + data.val().frequency + "</td>" +
            // format the next arrival time in local time
            "<td>" + moment().add(minsUntilArrival, "minutes").format("h:mm a") + "</td>" +
            // display the calculated minutes until next arrival
            "<td>" + minsUntilArrival + "</td>" +
            "<td><input type=\"checkbox\" id=\"" + data.val().trainName + "\" class=\"selectedTrain\" /></td>" +
            "</tr>"
        );
    }

    $("#deleteSelected").on("click", function() {
        $("input:checked").each(function() {
            var trainName = $(this).attr("id");
            var dbRef = database.ref("/trains")
            dbRef.child(trainName).remove();
            alert(trainName);
        });
    });

    // set up interval to refresh table every 60 seconds
    //setInterval( refreshTable, 60000 );

    // function to calculate the next occurance of train
    function getNextOccurance(startTime, frequency) {
        // create a moment time based on military time input
        var startdateTime = moment(startTime, "HH:mm");

        // while this next occurance is in the past
        while (moment().diff(startdateTime) > 0) {
            // add the next frequency
            startdateTime = startdateTime.add(frequency, 'minutes');
        }

        // calculate the difference between now and the next occurance
        var duration = moment.duration(moment().diff(startdateTime) * (-1));
        // report the time in minutes
        var minutesUntilArrival = parseInt(duration.asMinutes() + 1);
        return minutesUntilArrival;
    }

    // refresh the table
    database.ref("/trains").on("child_added", function(snapshot) {
        displayItem(snapshot);
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $("#addTrain").on("click", function() {
        event.preventDefault();

        var trainName = "";
        var destination = "";
        var frequency = 0;
        var firstTrainTime = 0;

        trainName = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        frequency = $("#frequency-input").val().trim();
        firstTrainTime = $("#time-input").val().trim();

        database.ref("/trains").push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            firstTrainTime: firstTrainTime,
            //time user submittedon server time (keeps all stamps on same TZ)
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    });
});
