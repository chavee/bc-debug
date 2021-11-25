var win = Ti.UI.createWindow({
  title: "iBeacon Test",
  backgroundColor: "#fff",
});

var text =  "Debug Version 1.0.5";
var attr = Titanium.UI.createAttributedString({
    text: text
});

var version = Titanium.UI.createLabel({
  top: 480,
  color: 'black',
  height: Titanium.UI.SIZE,
  attributedString: attr
});

var cidTextField = Ti.App.Properties.getString("inetBeaconData_cid");
if(cidTextField == null || cidTextField == ""){
  cidTextField = "Enter Your cid"
}
var textField = Ti.UI.createTextField({
  backgroundColor: '#ffeded',
  color: 'green',
  hintText: cidTextField ,
  hintTextColor: 'black',
  top: 25,
  width: 250,
  height: 40
});

var b1 = Ti.UI.createButton({
  top: 150,
  title: "Start Monitoring",
});

var b2 = Ti.UI.createButton({
  top: 200,
  title: "Stop Monitoring",
});

var b_saveCid = Ti.UI.createButton({
  top: 75,
  // right: 90,
  backgroundColor: '#9ce895',
  title: "Save",
});

var b_showData = Ti.UI.createButton({
  top: 425,
  title: "Show Data ",
});

var b_sendData = Ti.UI.createButton({
  top: 500,
  title: "Send Data ",
});

var inetBeacon = Alloy.createController("inet_beacon/beacon");

b1.addEventListener("click", function (e) {
  alert("Start Monitoring");
  inetBeacon.beaconStartScan()
})

b2.addEventListener("click", function (e) {
  alert("Stop Monitoring");
  inetBeacon.beaconStopScan()
})

b_saveCid.addEventListener("click", function (e) {
  Ti.App.Properties.setString("inetBeaconData_cid", textField.value);
  var cid = Ti.App.Properties.getString("inetBeaconData_cid");
  alert("Cid "  + cid + " has been saved");
})

b_showData.addEventListener("click", function (e) {
  var cid = Ti.App.Properties.getString("inetBeaconData_cid");
  var minor = Ti.App.Properties.getString("inetBeaconData_minor");
  var major = Ti.App.Properties.getString("inetBeaconData_major");
  console.log(cid);
  alert("Cid: " + cid + "\nMajor: " + major + "\nMinor: " + minor);
 
})

b_sendData.addEventListener("click", function (e) {
  var minor = Ti.App.Properties.getString("inetBeaconData_minor");
  var major = Ti.App.Properties.getString("inetBeaconData_major");
  inetBeacon.putApi(major, minor);
})

win.add(b1);
win.add(b2);
win.add(version);
win.add(textField);
win.add(b_saveCid);
win.add(b_showData);
// win.add(b_sendData);
win.open();

