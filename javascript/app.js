 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAv0PahkFgm0hp3aD9jpZCK1h2VIVrIfa0",
    authDomain: "train-scheduler-8a9f8.firebaseapp.com",
    databaseURL: "https://train-scheduler-8a9f8.firebaseio.com",
    projectId: "train-scheduler-8a9f8",
    storageBucket: "train-scheduler-8a9f8.appspot.com",
    messagingSenderId: "652522494148"
  };
  firebase.initializeApp(config);


  // Create a variable to reference the database.
  var database = firebase.database();

  // Initial Values
  var trainName = "";
  var destination = "";
  var firstTrain = 0;
  var frequency = "";

  
  // Capture Button Click
  $("#addTrain").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    trainName = $("#train")
      .val()
      .trim();
    destination = $("#destination")
      .val()
      .trim();
    firstTrain = $("#time")
      .val()
      .trim();
    frequency = $("#frequency")
      .val()
      .trim();

    // Code for handling the push
    database.ref("/trains").push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  $("#currentTime").text('Current Time ' + moment().format('h:mm:ss a'));


  database.ref("/trains").on(
    "value",
    function(snapshot) {
      trainName = snapshot.val().trainName;
      destination = snapshot.val().destination;
      firstTrain = snapshot.val().firstTrain;
      frequency = snapshot.val().frequency;
    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );


  database.ref("/trains").on(
    "child_added",
    function(childSnapshot) {
   // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().frequency);
      console.log(childSnapshot.val().firstTrain);

      // full list of items to the well
  $("#train-display").append(
    "<div class='well'>" +
      childSnapshot.val().trainName +
      "</div>"
      );
  $("#destination-display").append(
        "<div class='well'>" +
          childSnapshot.val().destination +
          "</div>"
      );
  $("#frequency-display").append(
        "<div class='well'>" +
          childSnapshot.val().frequency +
          "</div>"
      );

  $("#time-display").append(
        "<div class='well'>" +
          + firstTrain +
          "</div>"
      );
  $("#minutesAway-display").append(
        "<div class='well'>" +
          childSnapshot.val().firstTrain +
          "</div>"
      );  
      
      
      var tFrequency = childSnapshot.val().frequency;
      var firstTime = childSnapshot.val().firstTrain;
  

      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
  
      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      console.log(tRemainder);
  
      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      
      // Handle the errors
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
