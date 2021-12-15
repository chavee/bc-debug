var win = Ti.UI.createWindow({
  title: "iBeacon Test",
  backgroundColor: "#fff",
});

var text =  "V2.5";
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
  cidTextField = "Enter Your CID"
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
  title: "Start",
});

var b2 = Ti.UI.createButton({
  top: 200,
  title: "Stop",
});

var b_ble = Ti.UI.createButton({
  top: 250,
  title: "BLE",
});

var b_stop_ble = Ti.UI.createButton({
  top: 300,
  title: "Stop BLE",
});

var b_saveCid = Ti.UI.createButton({
  top: 75,
  // right: 90,
  backgroundColor: '#9ce895',
  title: "Save",
});

var b_showData = Ti.UI.createButton({
  top: 425,
  title: "Show",
});

var b_sendData = Ti.UI.createButton({
  top: 500,
  title: "Send Data ",
});

var b_md5_hash = Ti.UI.createButton({
  top: 350,
  title: "Hash"
});

var inetBeacon = Alloy.createController("inet_beacon/beacon");
// inetBeacon.beaconStartScan();

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
  var f_beacon = Ti.App.Properties.getString("f_beacon");
  alert("found " + f_beacon);
})

b_sendData.addEventListener("click", function (e) {
  var minor = Ti.App.Properties.getString("inetBeaconData_minor");
  var major = Ti.App.Properties.getString("inetBeaconData_major");
  inetBeacon.putApi(major, minor);
})

b_ble.addEventListener("click", function(e) {
  alert("Start BLE");
  inetBeacon.BLEScan();
});

b_stop_ble.addEventListener("click", function(e) {
  alert("Stop BLE");
  inetBeacon.stopBLE();
});

b_md5_hash.addEventListener("click", function(e) {
  alert("Hash!");
  inetBeacon.md5_hash();
});

win.add(b1);
win.add(b2);
win.add(version);
win.add(textField);
win.add(b_saveCid);
win.add(b_showData);
win.add(b_ble);
win.add(b_stop_ble);
// win.add(b_sendData);
win.add(b_md5_hash);
win.open();

