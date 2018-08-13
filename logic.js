  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBIrUSjoetpZP8TXUWBoQFw7BhBZgQvmCk",
    authDomain: "first-firebase-f79a1.firebaseapp.com",
    databaseURL: "https://first-firebase-f79a1.firebaseio.com",
    projectId: "first-firebase-f79a1",
    storageBucket: "first-firebase-f79a1.appspot.com",
    messagingSenderId: "400844399528"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var name = "";
  var destination = "";
  var start = "";
  var frequency = "";
  var n = 1;
  var keys = "";

  $("#add-train").on("click", function(event) {
    event.preventDefault();

    name = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    start = $("#start-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    database.ref().push({
      name: name,
      destination: destination,
      start: start,
      frequency: frequency,
    });

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
  });

  database.ref().on("child_added", function(childSnapshot) {
    database.ref().on("value", function(snapshot) {
      var sv = snapshot.val();
      console.log(snapshot.val());
      keys = Object.keys(sv);
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
    var key = keys[n];

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().frequency;

    var convertedStart = moment(trainStart, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(convertedStart), "minutes");
    var remainder = diffTime % trainFreq;
    var timeToNext = trainFreq - remainder;
    var nextTime = moment().add(timeToNext, "minutes");
    var nextTimeFormatted = moment(nextTime).format("hh:mm A");

    $("#train-table").append(`
      <tr class="trainData" data-value="${n}">
      <th>${n}</th>
      <td>${childSnapshot.val().name}</td>
      <td>${childSnapshot.val().destination}</td>
      <td>${childSnapshot.val().frequency}</td>
      <td>${nextTimeFormatted}</td>
      <td>${timeToNext}</td>
      <td><input type='button' value='X' data-key='${key}' class='removeData btn btn-danger btn-circle btn-xs'></td>
      </tr>
      `);
    n++;
  }, function(errorObject){
    console.log("Errors handled: " + errorObject.code)
  });

  //not working
  $("#train-table").on("click", ".removeData", function() {
    $(this).closest("tr").remove();
    key = $(this).attr("data-key");
    database.ref().child(key).remove();
  });