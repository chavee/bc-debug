var Alloy = require('/alloy'),
Backbone = Alloy.Backbone,
_ = Alloy._;




function __processArg(obj, key) {
  var arg = null;
  if (obj) {
    arg = obj[key] || null;
  }
  return arg;
}

function Controller() {

  require('/alloy/controllers/' + 'BaseController').apply(this, Array.prototype.slice.call(arguments));
  this.__controllerPath = 'index';
  this.args = arguments[0] || {};

  if (arguments[0]) {
    var __parentSymbol = __processArg(arguments[0], '__parentSymbol');
    var $model = __processArg(arguments[0], '$model');
    var __itemTemplate = __processArg(arguments[0], '__itemTemplate');
  }
  var $ = this;
  var exports = {};
  var __defers = {};

  // Generated code that must be executed before all UI and/or
  // controller code. One example is all model and collection
  // declarations from markup.


  // Generated UI code
  exports.destroy = function () {};

  // make all IDed elements in $.__views available right on the $ in a
  // controller's internal code. Externally the IDed elements will
  // be accessed with getView().
  _.extend($, $.__views);

  // Controller code directly from the developer's controller file
  var win = Ti.UI.createWindow({
    title: "iBeacon Test",
    backgroundColor: "#fff" });


  var text = "Debug Version 1.0.5";
  var attr = Titanium.UI.createAttributedString({
    text: text });


  var version = Titanium.UI.createLabel({
    top: 480,
    color: 'black',
    height: Titanium.UI.SIZE,
    attributedString: attr });


  var cidTextField = Ti.App.Properties.getString("inetBeaconData_cid");
  if (cidTextField == null || cidTextField == "") {
    cidTextField = "Enter Your cid";
  }
  var textField = Ti.UI.createTextField({
    backgroundColor: '#ffeded',
    color: 'green',
    hintText: cidTextField,
    hintTextColor: 'black',
    top: 25,
    width: 250,
    height: 40 });


  var b1 = Ti.UI.createButton({
    top: 150,
    title: "Start Monitoring" });


  var b2 = Ti.UI.createButton({
    top: 200,
    title: "Stop Monitoring" });


  var b_saveCid = Ti.UI.createButton({
    top: 75,
    // right: 90,
    backgroundColor: '#9ce895',
    title: "Save" });


  var b_showData = Ti.UI.createButton({
    top: 425,
    title: "Show Data " });


  var b_sendData = Ti.UI.createButton({
    top: 500,
    title: "Send Data " });


  var inetBeacon = Alloy.createController("inet_beacon/beacon");

  b1.addEventListener("click", function (e) {
    alert("Start Monitoring");
    inetBeacon.beaconStartScan();
  });

  b2.addEventListener("click", function (e) {
    alert("Stop Monitoring");
    inetBeacon.beaconStopScan();
  });

  b_saveCid.addEventListener("click", function (e) {
    Ti.App.Properties.setString("inetBeaconData_cid", textField.value);
    var cid = Ti.App.Properties.getString("inetBeaconData_cid");
    alert("Cid " + cid + " has been saved");
  });

  b_showData.addEventListener("click", function (e) {
    var cid = Ti.App.Properties.getString("inetBeaconData_cid");
    var minor = Ti.App.Properties.getString("inetBeaconData_minor");
    var major = Ti.App.Properties.getString("inetBeaconData_major");
    console.log(cid);
    alert("Cid: " + cid + "\nMajor: " + major + "\nMinor: " + minor);

  });

  b_sendData.addEventListener("click", function (e) {
    var minor = Ti.App.Properties.getString("inetBeaconData_minor");
    var major = Ti.App.Properties.getString("inetBeaconData_major");
    inetBeacon.putApi(major, minor);
  });

  win.add(b1);
  win.add(b2);
  win.add(version);
  win.add(textField);
  win.add(b_saveCid);
  win.add(b_showData);
  // win.add(b_sendData);
  win.open();

  // Generated code that must be executed after all UI and
  // controller code. One example deferred event handlers whose
  // functions are not defined until after the controller code
  // is executed.


  // Extend the $ instance with all functions and properties
  // defined on the exports object.
  _.extend($, exports);
}

module.exports = Controller;
//# sourceMappingURL=file://d:\GIANT\ww2\inettibeacon/build/map/Resources\android\alloy\controllers\index.js.map