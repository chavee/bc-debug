// let beaconUUID = "c8a94f42-3cd5-483a-8adc-97473197b8b4";
let beaconUUID = "5991e161-bb46-432f-9bd8-b271f76f67d9";
let beaconIdentifier = "Morprom";
let global_beacons = {};

Ti.App.Properties.setString("f_beacon", "");

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
    minor == Ti.App.Properties.getString("inetBeaconData_minor")
  ) {
    return true;
  }
  return false;
}

console.log("begin:", Math.floor(Date.now()));
var BLE = null;
// var androidPlatformTools = require('bencoding.android.tools').createPlatform();
var isForeground = true;

if (OS_IOS) 
{
  BLE = require("appcelerator.ble");
} else
{
  BLE = require("com.liferay.beacons");
}

function isInterestedRegion(rssi)
{
  tag = "isInterestRegion:";
  let min_rssi = -96;
  if(OS_IOS)
  {
    // interested all
    return true;
  }
  else
  {
    if(rssi <= min_rssi)
    {
      // not interested region
      return false;
    }
    else
    {
      // interested region
      return true;
    }
  }
}

console.log("after lode lib:", Math.floor(Date.now()));
// --- ios ----------
var manager = null;
var iosDidRangeBeacons = null;
var iosDidChangeAuthorization = null;
// --- android ----------
var inBeconRange = null;

function beaconStartScan() {
  resetStateBeacon();
  if (OS_IOS) {
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
          break;
      }
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
              Ti.App.Properties.getString("inetBeaconData_minor")
          );
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

      if(! isInterestedRegion(proximity) )
      {
        console.log("Too far...");
      }
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
              "m)"
          );
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
              "m)"
          );
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
              "m)"
          );
          break;

        default:
          haveCase = false;
          alert("Beacon Location : UNKNOWN");
          break;
      }
      
      if (haveCase){
        // putApi(major, minor);
        // ..record beacon
      }

    };

    if (manager === null) {
      manager = BLE.createRegionManager();
      manager.addEventListener(
        "didChangeAuthorization",
        iosDidChangeAuthorization
      );
      manager.addEventListener("didRangeBeacons", iosDidRangeBeacons);

      var beaconRegion = BLE.createBeaconRegion({
        uuid: beaconUUID,
        // major: 32772,
        // minor: 3,
        identifier: beaconIdentifier,
      });
      manager.startRegionMonitoring({
        beaconRegion: beaconRegion,
      });
      manager.startRangingBeaconsInRegion({
        beaconRegion: beaconRegion,
      });
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

    console.log("after check perm:", Math.floor(Date.now()));

    androidBindingCallback = function (e) {
      tag = "androidBindingCallback: "
      console.log(tag, e);
    }

    inBeconRange = function (e) {
      var tag = "beaconRanges: ";
      console.log(tag, "I am in the " + e.identifier + " region");
      console.log(tag, "I see " + e.beacons.length + " beacons in this region:");
      console.log(tag, "----------------");
      e.beacons.forEach(function(beacon, index){
        // ... check rssi add to dialog
        // if not interestedRegion(rssi) ... not add to checkin dialog
        console.log(tag, "Beacon number: " + index);
        console.log(tag, "uuid: " + beacon.uuid);
        console.log(tag, "major: " + beacon.major);
        console.log(tag, "minor: " + beacon.minor);
        console.log(tag, "proximity: " + beacon.proximity);
        console.log(tag, "accuracy: " + beacon.accuracy);
        console.log(tag, "rssi: " + beacon.rssi);
        console.log(tag, "power: " + beacon.power);
        console.log("----------------");
        // .. do others ....
        var beacon_key = beacon.major + "-" + beacon.minor;
        if(beacon_key in global_beacons)
        {
          console.log(beacon_key + " beacon was recorded");
        }
        else
        {
          if(isInterestedRegion(beacon.rssi))
          {
            console.log(tag, "call location api");
            global_beacons[beacon_key] = {
              "major": beacon.major,
              "minor": beacon.minor,
              "rssi": beacon.rssi,
              "location": "กำลังค้นหาตำแหน่ง",
              "isRegistered": false,
              "ts": new Date().getTime()
            }
            // call locatioon api
            getLocation(beacon.major, beacon.minor, beacon_key);
          }
          else
          {
            console.log("Not interesed region.");
          }
        }
      });
    }

    BLE.addEventListener("beaconRanges", inBeconRange);

    var regionState = function (e) {
      var tag = "regionState: ";
      console.log(tag, "identifer: " + e.regionState);
    }

    BLE.addEventListener("onIBeaconServiceConnect", androidBindingCallback);

    console.log("add evnt complete:", Math.floor(Date.now()));

  var when_ready;
  var not_ready_count = 0;

  BLE.bindBeaconService();

  when_ready = setInterval(function(){
  if(!BLE.isReady())
  {
    console.log("not_ready_count=", not_ready_count);
    console.log("BLE Not ready");
    not_ready_count++;
    return;
  }

  Ti.API.info("Try", not_ready_count, "time, ",  "Okay! Module is ready!");  

  // console.log("checkAvailability=", BLE.checkAvailability());
  if(!BLE.checkAvailability())
  {
    alert("It's not support in your device!");
    return;
  }

  BLE.setBackgroundMode(false);
  BLE.setScanPeriods({
    foregroundScanPeriod: 5000,
    foregroundBetweenScanPeriod: 200,
    backgroundScanPeriod: 5000,
    backgroundBetweenScanPeriod: 200
  });

  BLE.startMonitoringForRegion({
    identifier: beaconIdentifier,
    uuid: beaconUUID,
  });
  
  clearInterval(when_ready);
  when_ready = null;
  }, 1000);

  var monit;  
  
  monit = setInterval(function() {
    // var isForeground = androidPlatformTools.isInForeground();
    if(!isForeground) {
      console.log("App in background. Stop scan.");
      BLE.stopScan();
      return;
    }
  });
  // end android
  }
}

var clearBCCache = setInterval(function() {
  var tag = "timeToClearBCCach?: ";
  for(var prop in global_beacons) {
    var dTs = new Date().getTime() - global_beacons[prop]["ts"];
    console.log(tag + global_beacons[prop]["location"] + " dTs=" + global_beacons[prop]["ts"] + " ms");
    if( dTs > 5*60*1000)
    {
      console.log("Yes, clear beacon cache.");
      delete global_beacons[prop];
    }
    else
    {
      console.log(tag + "No.");
    }
  }
}, 5000);

function beaconStopScan() {
  resetStateBeacon();
  if (OS_IOS) {
    manager.removeEventListener(
      "didChangeAuthorization",
      iosDidChangeAuthorization
    );
    manager.removeEventListener("didRangeBeacons", iosDidRangeBeacons);
  } else {
    BLE.stopMonitoringAllRegions();
    BLE.removeEventListener("beaconRanges", inBeconRange);
  }
}

function getLocation(this_major, this_minor, this_key) {
  tag = "getLocation: ";
  var xhr = Ti.Network.createHTTPClient();
  // hash_value
  var my_loc_code = md5_hash(`b1cf4b7ec203:1:${this_major}:${this_minor}`);
  console.log(tag + "my_hash: " + my_loc_code + " major:" + this_major + " minor:" + this_minor);

  xhr.onload = function(e) {
    var res_json = {};
    console.log(tag, this.status);
    console.log(tag, this.responseText);
    // alert(tag + this.responseText);
    res_json = JSON.parse(this.responseText);
    global_beacons[this_key]["isRegistered"] = true;
    console.log(tag, "res_json=", res_json);
    if("site_name" in res_json)
    {
      global_beacons[this_key]["location"] = res_json["site_name"];
    }
    else
    {
      global_beacons[this_key]["location"] = "-";
    }
    if("location_name" in res_json)
    {
      global_beacons[this_key]["location"] = global_beacons[this_key]["location"] + " " + res_json["location_name"];
    }
    alert(tag + this_key + ":" + global_beacons[this_key]["location"])
  };

  xhr.onerror = function(e) {
    console.log(tag, this.status);
    console.log(tag, this.responseText);
    if(this.status = 404)
    {
      global_beacons[this_key]["location"] = `ไม่พบตำแหน่ง ${global_beacons[this_key]["major"]}/${global_beacons[this_key]["major"]} ในระบบ`
    }
    else
    {
      global_beacons[this_key]["location"] = "กรุณาลองใหม่"
    }
  };
  xhr.timeout = 10000;
  xhr.open('GET', 'https://beacon-track.inet.co.th/beaconinfo?code=' + my_loc_code);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send();
}

function sortByProperty(property){  
  var tag = "sortByProp: ";
  return function(a, b){
     if(a[property] > b[property])
     {
        // alert(a["location"] + " " + a[property] + ">" + b["location"] + " " + b[property]);
        console.log(a["location"] + " " + a[property] + ">" + b["location"] + " " + b[property]);
        return -1;  
     }
     else if(a[property] < b[property])
     {
        // alert(a["location"] + " " + a[property] + "<" + b["location"] + " " + b[property]);
        console.log(a["location"] + " " + a[property] + "<" + b["location"] + " " + b[property]);
        return 1;  
     }
     return 0;  
  }  
}

function getLocationList()
{
  var tag = "getLocationList: ";
  var global_location = [];
  var location_list = "";
  // create arr of json of locations, filter only registered device
 
  for(var prop in global_beacons) {
    console.log(tag, "beacon ", global_beacons[prop]);
    // brinng registered region first!
    if(global_beacons[prop]["isRegistered"])
    {
      // add to location list
      global_location.push(global_beacons[prop]);
    }
  }

  // check number of location is less than 0

  /*
  var max_location = 3;
  if((global_beacons.length > global_location.length) && (global_location < max_location)) 
  {
    // add non registered beacon for show
    for(var prop in global_beacons) {
      if(! global_beacons[prop]["isRegistered"])
      {
        global_location.push(global_beacons[prop]);
      }
      
      if(global_location.length >= max_location)
      {
        console.log(tag, "location reach limit=", max_location);
        // sorting by rssi  getSortOrder(prop)
        global_sorting_loc = global_location.sort(getSortOrder["rssi"]);
        global_sorting_loc.forEach(function(loc_list, index){
          console.log(tag, "sorted_loc=", loc_list);
          location_list = location_list + loc_list["major"] + "-" + loc_list["minor"] + 
          ":" + loc_list["location"] + " " + loc_list["rssi"] + "dBm" + "; ";
        });
        alert(tag + location_list);
        return global_sorting_loc;
      }
    }
  }
  */
  
  console.log(tag, "global_location=", global_location);
  global_location.sort(sortByProperty("rssi"));
  global_location.forEach(function(sort_loc, index) {
    console.log(tag, "### sort_id=", index, "data=", sort_loc);
    location_list = location_list + sort_loc["location"] + " major=" + sort_loc["major"] + " minor=" + sort_loc["minor"] +
    " rssi=" + sort_loc["rssi"] + "; ";
  });
  alert(tag + "sorted_loc=" + location_list);
  return global_location;
}

function md5_hash(hash_seed) {
  var tag = "md5_hash";
  var my_md5 = Ti.Utils.md5HexDigest(hash_seed);
  return my_md5;
}

exports.beaconStartScan = beaconStartScan;
exports.beaconStopScan = beaconStopScan;
exports.getLocationList = getLocationList;