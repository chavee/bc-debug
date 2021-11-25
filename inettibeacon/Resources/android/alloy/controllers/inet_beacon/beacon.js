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
  this.__controllerPath = 'inet_beacon/beacon';
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
  // let beaconUUID = "c8a94f42-3cd5-483a-8adc-97473197b8b4";
  let beaconUUID = "5991e161-bb46-432f-9bd8-b271f76f67d9";
  let beaconIdentifier = "MyHome";

  function resetStateBeacon() {
    Ti.App.Properties.setString("inetBeaconData_major", null);
    Ti.App.Properties.setString("inetBeaconData_minor", null);
    Ti.App.Properties.setString("inetBeaconData_uuid", null);
  }
  function setStateBeacon(uuid, minor, major) {
    Ti.App.Properties.setString("inetBeaconData_major", major);
    Ti.App.Properties.setString("inetBeaconData_minor", minor);
    Ti.App.Properties.setString("inetBeaconData_uuid", uuid);
  }
  function isSameStateBefore(uuid, minor, major) {
    if (
    uuid == Ti.App.Properties.getString("inetBeaconData_uuid") &&
    major == Ti.App.Properties.getString("inetBeaconData_major") &&
    minor == Ti.App.Properties.getString("inetBeaconData_minor"))
    {
      return true;
    }
    return false;
  }

  var BLE = null;
  if (false) {
    BLE = require("appcelerator.ble");
  } else {
    BLE = require("com.liferay.beacons");
  }
  // --- ios ----------
  var manager = null;
  var iosDidRangeBeacons = null;
  var iosDidChangeAuthorization = null;
  // --- android ----------
  var androidEntered = null;
  var androidExited = null;
  var androidBeaconProximityCallback = null;

  function beaconStartScan() {
    resetStateBeacon();
    if (false) {
      // -------- IOS -----------------------
      iosDidChangeAuthorization = (e) => {
        Ti.API.info("didChangeAuthorization");
        switch (e.state) {
          case BLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED_ALWAYS:
            alert("Manager authorization is always");
            break;
          case BLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED_WHEN_IN_USE:
            alert("Manager authorization is when in use");
            break;
          case BLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_DENIED:
            alert("Manager authorization is denied");
            break;
          case BLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_NOT_DETERMINED:
            alert("Manager authorization is not determined");
            break;
          case BLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_RESTRICTED:
            alert("Manager authorization is powered restricted");
            break;
          default:
            alert("Unknown");
            break;}

      };

      iosDidRangeBeacons = (e) => {

        Ti.API.info("didRangeBeacons");
        var becaons = e.beacons;

        if (becaons.length === 0) {
          console.log("No beacon in range");
          if (Ti.App.Properties.getString("inetBeaconData_uuid") !== null) {
            alert(
            "Exit uuid: " +
            Ti.App.Properties.getString("inetBeaconData_uuid") +
            "  Major: " +
            Ti.App.Properties.getString("inetBeaconData_major") +
            "  Minor: " +
            Ti.App.Properties.getString("inetBeaconData_minor"));

            resetStateBeacon();
          }
          return;
        }

        var proximity = becaons[0].proximity;
        var accuracy = becaons[0].accuracy;
        var major = becaons[0].major;
        var minor = becaons[0].minor;
        var haveCase = true;

        // check state before
        if (isSameStateBefore(e.region.uuid, major, minor)) {
          return;
        }

        switch (proximity) {
          case BLE.BEACON_PROXIMITY_UNKNOWN:
            alert("Beacon Location : UNKNOWN");
            break;

          case BLE.BEACON_PROXIMITY_IMMEDIATE:
            // set beacon state only, but not use proximity
            setStateBeacon(e.region.uuid, major, minor);
            console.log(e.region.uuid + " Major: " + major + " Minor: " + minor);
            alert(
            "IMMEDIATE uuid: " +
            e.region.uuid +
            "  Major: " +
            major +
            "  Minor: " +
            minor +
            "  Approx: " +
            accuracy +
            "m)");

            break;

          case BLE.BEACON_PROXIMITY_NEAR:
            setStateBeacon(e.region.uuid, major, minor);
            console.log(e.region.uuid + " Major: " + major + " Minor: " + minor);
            alert(
            "NEAR uuid: " +
            e.region.uuid +
            "  Major: " +
            major +
            "  Minor: " +
            minor +
            "  Approx: " +
            accuracy +
            "m)");

            break;

          case BLE.BEACON_PROXIMITY_FAR:
            setStateBeacon(e.region.uuid, major, minor);
            console.log(e.region.uuid + " Major: " + major + " Minor: " + minor);
            alert(
            "FAR uuid: " +
            e.region.uuid +
            "  Major: " +
            major +
            "  Minor: " +
            minor +
            "  Approx: " +
            accuracy +
            "m)");

            break;

          default:
            haveCase = false;
            alert("Beacon Location : UNKNOWN");
            break;}


        if (haveCase) {
          putApi(major, minor);
        }

      };

      if (manager === null) {
        manager = BLE.createRegionManager();
        manager.addEventListener(
        "didChangeAuthorization",
        iosDidChangeAuthorization);

        manager.addEventListener("didRangeBeacons", iosDidRangeBeacons);

        var beaconRegion = BLE.createBeaconRegion({
          uuid: beaconUUID,
          // major: 32772,
          // minor: 3,
          identifier: beaconIdentifier });

        manager.startRegionMonitoring({
          beaconRegion: beaconRegion });

        manager.startRangingBeaconsInRegion({
          beaconRegion: beaconRegion });

      }

    } else {
      // -------- Android -----------------------
      // Check Permission Location
      var permissions = ["android.permission.ACCESS_FINE_LOCATION"];
      Ti.Android.requestPermissions(permissions, function (e) {
        if (e.success) {
          console.log("allow location success");
        } else {
          console.log("not allow location");
        }
      });

      //androidEntered callback
      var isEnterRegion = false;
      androidEntered = function (e) {
        let tag = "androidEntered:";
        console.log(tag, "entered region identifer: " + e.identifier);
        console.log(tag, e);
        isEnterRegion = true;
        alert(
        tag + "Enter");

      };

      //androidBeaconProximityCallback
      androidBeaconProximityCallback = function (e) {
        let tag = "proxCallback:";
        if (isEnterRegion) {
          // check is same state befor
          if (isSameStateBefore(e.uuid, e.major, e.minor)) {
            console.log(tag, "Same beacon");
            isConfirmExit = false;
            return;
          }
          // just record beacon, not use proximity
          setStateBeacon(e.uuid, e.major, e.minor);
          alert(
          tag + " " + e.uuid + " Major: " + e.major + " Minor: " + e.minor);

          //put message to bot
          putApi(e.major, e.minor);
          isEnterRegion = false;
        }
        console.log(tag, "identifer: " + e.identifier);
        console.log(tag, "uuid: " + e.uuid);
        console.log(tag, "major: " + e.major);
        console.log(tag, "minor: " + e.minor);
        console.log(tag, "proximity: " + e.proximity);
        console.log(tag, "accuracy: " + e.accuracy);
        console.log(tag, "rssi: " + e.rssi);
        console.log(tag, "power: " + e.power);
      };

      //androidExited callback
      var handle = null;
      var isConfirmExit = false;
      androidExited = function (e) {
        isConfirmExit = true;
        console.log("exited region identifer: " + e.identifier);

        if (Ti.App.Properties.getString("inetBeaconData_uuid") !== null && handle == null) {
          var countExit = 0;
          handle = setInterval(function () {
            console.log("isConfirmExit: " + isConfirmExit);
            if (countExit > 60 && isConfirmExit) {
              // Confirm exited signal
              alert(
              "Exit uuid: " +
              Ti.App.Properties.getString("inetBeaconData_uuid") +
              "  Major: " +
              Ti.App.Properties.getString("inetBeaconData_major") +
              "  Minor: " +
              Ti.App.Properties.getString("inetBeaconData_minor"));

              resetStateBeacon();
              clearInterval(handle);
              handle = null;
              console.log("it's really exit " + handle);
            } else if (!isConfirmExit) {
              // Reset Confirm Exit Interval
              clearInterval(handle);
              handle = null;
              console.log("it's not exit " + handle);
            }
            countExit++;
            console.log("count: " + countExit);
            return;
          }, 1000);
        }
      };

      BLE.addEventListener("enteredRegion", androidEntered);
      BLE.addEventListener("exitedRegion", androidExited);
      BLE.addEventListener("beaconProximity", androidBeaconProximityCallback);

      // Airports Beacon
      // UUID: 5991e161-bb46-432f-9bd8-b271f76f67d9

      // MyHome
      // c8a94f42-3cd5-483a-8adc-97473197b8b4
      BLE.startMonitoringForRegion({
        identifier: beaconIdentifier,
        uuid: beaconUUID });

      BLE.setBackgroundMode(false);

      BLE.setScanPeriods({
        foregroundScanPeriod: 5000,
        foregroundBetweenScanPeriod: 200,
        backgroundScanPeriod: 5000,
        backgroundBetweenScanPeriod: 200 });

      // end android
    }
  }

  function beaconStopScan() {
    resetStateBeacon();
    if (false) {
      manager.removeEventListener(
      "didChangeAuthorization",
      iosDidChangeAuthorization);

      manager.removeEventListener("didRangeBeacons", iosDidRangeBeacons);
    } else {
      BLE.stopMonitoringAllRegions();
      BLE.removeEventListener("enteredRegion", androidEntered);
      BLE.removeEventListener("exitedRegion", androidExited);
      BLE.removeEventListener("beaconProximity", androidBeaconProximityCallback);
    }
  }

  function putApi(major, minor) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.onload = function (e) {
      console.log(this.status);
      console.log(this.responseText);
    };
    xhr.onerror = function (e) {
      console.log(this.status);
      console.log(this.responseText);
    };
    xhr.timeout = 10000;
    // xhr.open('PUT','https://morprom-beacon.nexpie.io');
    xhr.open('PUT', 'https://beacon-track.inet.co.th');
    xhr.setRequestHeader('X-API-KEY', 'RvBmll9opEnVZ3aBH6wygN7VXKr7DIYw');
    xhr.setRequestHeader("content-type", "application/json");
    var params = {
      uid: Ti.App.Properties.getString("inetBeaconData_cid"),
      major: major,
      minor: minor };

    xhr.send(JSON.stringify(params));
  }

  exports.beaconStartScan = beaconStartScan;
  exports.beaconStopScan = beaconStopScan;
  exports.putApi = putApi;

  // Generated code that must be executed after all UI and
  // controller code. One example deferred event handlers whose
  // functions are not defined until after the controller code
  // is executed.


  // Extend the $ instance with all functions and properties
  // defined on the exports object.
  _.extend($, exports);
}

module.exports = Controller;
//# sourceMappingURL=file://d:\GIANT\ww2\inettibeacon/build/map/Resources\android\alloy\controllers\inet_beacon\beacon.js.map