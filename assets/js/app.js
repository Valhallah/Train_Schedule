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


  database.ref("/trains").on("value", function(snapshot) {
      $("#mainTableBody").empty();
      snapshot.forEach(function(data) {
        $("#mainTableBody").append(
            "<tr>" +
            "<td>"+ data.val().trainName + "</td>" +
            "<td>"+ data.val().destination + "</td>" +
            "<td>"+ data.val().frequency + "</td>" +
            "<td>"+ "-" + "</td>" +
            "<td>"+ "-" + "</td>" +
             + "</tr>"
        );
      });
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
    frequency = $("#time-input").val().trim();
    firstTrainTime= $("#frequency-input").val().trim();

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
