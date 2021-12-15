var Alloy=require("/alloy"),
Backbone=Alloy.Backbone,
_=Alloy._;




function __processArg(obj,key){
var arg=null;



return obj&&(arg=obj[key]||null),arg;
}

function Controller(){





if(require("/alloy/controllers/BaseController").apply(this,Array.prototype.slice.call(arguments)),this.__controllerPath="index",this.args=arguments[0]||{},arguments[0])var
__parentSymbol=__processArg(arguments[0],"__parentSymbol"),
$model=__processArg(arguments[0],"$model"),
__itemTemplate=__processArg(arguments[0],"__itemTemplate");var

$=this,
exports={},
__defers={};







exports.destroy=function(){},




_.extend($,$.__views);var


win=Ti.UI.createWindow({
title:"iBeacon Test",
backgroundColor:"#fff"}),


text="V2.5",
attr=Titanium.UI.createAttributedString({
text:text}),


version=Titanium.UI.createLabel({
top:480,
color:"black",
height:Titanium.UI.SIZE,
attributedString:attr}),


cidTextField=Ti.App.Properties.getString("inetBeaconData_cid");(
null==cidTextField||""==cidTextField)&&(
cidTextField="Enter Your CID");var

textField=Ti.UI.createTextField({
backgroundColor:"#ffeded",
color:"green",
hintText:cidTextField,
hintTextColor:"black",
top:25,
width:250,
height:40}),


b1=Ti.UI.createButton({
top:150,
title:"Start"}),


b2=Ti.UI.createButton({
top:200,
title:"Stop"}),


b_ble=Ti.UI.createButton({
top:250,
title:"BLE"}),


b_stop_ble=Ti.UI.createButton({
top:300,
title:"Stop BLE"}),


b_saveCid=Ti.UI.createButton({
top:75,

backgroundColor:"#9ce895",
title:"Save"}),


b_showData=Ti.UI.createButton({
top:425,
title:"Show"}),


b_sendData=Ti.UI.createButton({
top:500,
title:"Send Data "}),


b_md5_hash=Ti.UI.createButton({
top:350,
title:"Hash"}),


inetBeacon=Alloy.createController("inet_beacon/beacon");


b1.addEventListener("click",function(e){
alert("Start Monitoring"),
inetBeacon.beaconStartScan();
}),

b2.addEventListener("click",function(e){
alert("Stop Monitoring"),
inetBeacon.beaconStopScan();
}),

b_saveCid.addEventListener("click",function(e){
Ti.App.Properties.setString("inetBeaconData_cid",textField.value);
var cid=Ti.App.Properties.getString("inetBeaconData_cid");
alert("Cid "+cid+" has been saved");
}),

b_showData.addEventListener("click",function(e){var
cid=Ti.App.Properties.getString("inetBeaconData_cid"),
minor=Ti.App.Properties.getString("inetBeaconData_minor"),
major=Ti.App.Properties.getString("inetBeaconData_major");
console.log(cid);
var f_beacon=Ti.App.Properties.getString("f_beacon");
alert("found "+f_beacon);
}),

b_sendData.addEventListener("click",function(e){var
minor=Ti.App.Properties.getString("inetBeaconData_minor"),
major=Ti.App.Properties.getString("inetBeaconData_major");
inetBeacon.putApi(major,minor);
}),

b_ble.addEventListener("click",function(e){
alert("Start BLE"),
inetBeacon.BLEScan();
}),

b_stop_ble.addEventListener("click",function(e){
alert("Stop BLE"),
inetBeacon.stopBLE();
}),

b_md5_hash.addEventListener("click",function(e){
alert("Hash!"),
inetBeacon.md5_hash();
}),

win.add(b1),
win.add(b2),
win.add(version),
win.add(textField),
win.add(b_saveCid),
win.add(b_showData),
win.add(b_ble),
win.add(b_stop_ble),

win.add(b_md5_hash),
win.open(),









_.extend($,exports);
}

module.exports=Controller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlbXBsYXRlLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsUUFBQSxDQUFBLEtBQUEsQ0FBQSxRQURBO0FBRUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUZBOzs7OztBQU9BLFFBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQTs7OztBQUlBLE1BSEEsQ0FBQSxHQUdBLEdBRkEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxJQUVBLEVBQUEsR0FBQTtBQUNBOztBQUVBLFFBQUEsQ0FBQSxVQUFBLEVBQUE7Ozs7OztBQU1BLEdBSkEsT0FBQSxxQ0FBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUlBLENBSEEsS0FBQSxnQkFBQSxDQUFBLE9BR0EsQ0FGQSxLQUFBLElBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsRUFFQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxjQUFBLENBQUEsWUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxnQkFBQSxDQURBO0FBRUEsTUFBQSxDQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUZBO0FBR0EsY0FBQSxDQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsZ0JBQUEsQ0FIQSxDQU5BOztBQVdBLENBQUEsQ0FBQSxJQVhBO0FBWUEsT0FBQSxDQUFBLEVBWkE7QUFhQSxRQUFBLENBQUEsRUFiQTs7Ozs7Ozs7QUFxQkEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsQ0FyQkE7Ozs7O0FBMEJBLENBQUEsQ0FBQSxNQUFBLENBQUEs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R0EsQ0FIQSxDRGxFQTs7QUN1RUEsU0FBQSxDQUFBLGdCQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQ0EsRUFBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLENBQUEsU0FBQSxDQUFBLG9CQUFBLENBQUEsU0FBQSxDQUFBLEtBQUEsQ0FEQTtBQUVBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLENBQUEsU0FBQSxDQUFBLG9CQUFBLENBQUE7QUFDQSxLQUFBLENBQUEsT0FBQSxHQUFBLENBQUEsaUJBQUEsQ0FIQTtBQUlBLENBSkEsQ0R2RUE7O0FDNkVBLFVBQUEsQ0FBQSxnQkFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUEsb0JBQUEsQ0FEQTtBQUVBLEtBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUEsc0JBQUEsQ0FGQTtBQUdBLEtBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUEsc0JBQUEsQ0FIQTtBQUlBLE9BQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUpBO0FBS0EsR0FBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUEsVUFBQSxDQUFBO0FBQ0EsS0FBQSxDQUFBLFNBQUEsUUFBQSxDQU5BO0FBT0EsQ0FQQSxDRDdFQTs7QUNzRkEsVUFBQSxDQUFBLGdCQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQ0EsS0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxzQkFBQSxDQURBO0FBRUEsS0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxzQkFBQSxDQUZBO0FBR0EsVUFBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsS0FBQSxDQUhBO0FBSUEsQ0FKQSxDRHRGQTs7QUM0RkEsS0FBQSxDQUFBLGdCQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQ0EsS0FBQSxDQUFBLFdBQUEsQ0FEQTtBQUVBLFVBQUEsQ0FBQSxPQUFBLEVBRkE7QUFHQSxDQUhBLENENUZBOztBQ2lHQSxVQUFBLENBQUEsZ0JBQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLENBQUE7QUFDQSxLQUFBLENBQUEsVUFBQSxDQURBO0FBRUEsVUFBQSxDQUFBLE9BQUEsRUFGQTtBQUdBLENBSEEsQ0RqR0E7O0FDc0dBLFVBQUEsQ0FBQSxnQkFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUNBLEtBQUEsQ0FBQSxPQUFBLENBREE7QUFFQSxVQUFBLENBQUEsUUFBQSxFQUZBO0FBR0EsQ0FIQSxDRHRHQTs7QUMyR0EsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENEM0dBO0FDNEdBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDRDVHQTtBQzZHQSxHQUFBLENBQUEsR0FBQSxDQUFBLE9BQUEsQ0Q3R0E7QUM4R0EsR0FBQSxDQUFBLEdBQUEsQ0FBQSxTQUFBLENEOUdBO0FDK0dBLEdBQUEsQ0FBQSxHQUFBLENBQUEsU0FBQSxDRC9HQTtBQ2dIQSxHQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsQ0RoSEE7QUNpSEEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENEakhBO0FDa0hBLEdBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxDRGxIQTs7QUNvSEEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLENEcEhBO0FDcUhBLEdBQUEsQ0FBQSxJQUFBLEVEckhBOzs7Ozs7Ozs7O0FBdUNBLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0F2Q0E7QUF3Q0E7O0FBRUEsTUFBQSxDQUFBLE9BQUEsQ0FBQSxVIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEFsbG95ID0gcmVxdWlyZSgnL2FsbG95JyksXG5cdEJhY2tib25lID0gQWxsb3kuQmFja2JvbmUsXG5cdF8gPSBBbGxveS5fO1xuXG5cblxuXG5mdW5jdGlvbiBfX3Byb2Nlc3NBcmcob2JqLCBrZXkpIHtcblx0dmFyIGFyZyA9IG51bGw7XG5cdGlmIChvYmopIHtcblx0XHRhcmcgPSBvYmpba2V5XSB8fCBudWxsO1xuXHR9XG5cdHJldHVybiBhcmc7XG59XG5cbmZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7XG5cdFxuXHRyZXF1aXJlKCcvYWxsb3kvY29udHJvbGxlcnMvJyArICdCYXNlQ29udHJvbGxlcicpLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHR0aGlzLl9fY29udHJvbGxlclBhdGggPSAnaW5kZXgnO1xuXHR0aGlzLmFyZ3MgPSBhcmd1bWVudHNbMF0gfHwge307XG5cblx0aWYgKGFyZ3VtZW50c1swXSkge1xuXHRcdHZhciBfX3BhcmVudFN5bWJvbCA9IF9fcHJvY2Vzc0FyZyhhcmd1bWVudHNbMF0sICdfX3BhcmVudFN5bWJvbCcpO1xuXHRcdHZhciAkbW9kZWwgPSBfX3Byb2Nlc3NBcmcoYXJndW1lbnRzWzBdLCAnJG1vZGVsJyk7XG5cdFx0dmFyIF9faXRlbVRlbXBsYXRlID0gX19wcm9jZXNzQXJnKGFyZ3VtZW50c1swXSwgJ19faXRlbVRlbXBsYXRlJyk7XG5cdH1cblx0dmFyICQgPSB0aGlzO1xuXHR2YXIgZXhwb3J0cyA9IHt9O1xuXHR2YXIgX19kZWZlcnMgPSB7fTtcblxuXHQvLyBHZW5lcmF0ZWQgY29kZSB0aGF0IG11c3QgYmUgZXhlY3V0ZWQgYmVmb3JlIGFsbCBVSSBhbmQvb3Jcblx0Ly8gY29udHJvbGxlciBjb2RlLiBPbmUgZXhhbXBsZSBpcyBhbGwgbW9kZWwgYW5kIGNvbGxlY3Rpb25cblx0Ly8gZGVjbGFyYXRpb25zIGZyb20gbWFya3VwLlxuXHRcblxuXHQvLyBHZW5lcmF0ZWQgVUkgY29kZVxuXHRleHBvcnRzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7fTtcblxuXHQvLyBtYWtlIGFsbCBJRGVkIGVsZW1lbnRzIGluICQuX192aWV3cyBhdmFpbGFibGUgcmlnaHQgb24gdGhlICQgaW4gYVxuXHQvLyBjb250cm9sbGVyJ3MgaW50ZXJuYWwgY29kZS4gRXh0ZXJuYWxseSB0aGUgSURlZCBlbGVtZW50cyB3aWxsXG5cdC8vIGJlIGFjY2Vzc2VkIHdpdGggZ2V0VmlldygpLlxuXHRfLmV4dGVuZCgkLCAkLl9fdmlld3MpO1xuXG5cdC8vIENvbnRyb2xsZXIgY29kZSBkaXJlY3RseSBmcm9tIHRoZSBkZXZlbG9wZXIncyBjb250cm9sbGVyIGZpbGVcblx0X19NQVBNQVJLRVJfQ09OVFJPTExFUl9DT0RFX19cblxuXHQvLyBHZW5lcmF0ZWQgY29kZSB0aGF0IG11c3QgYmUgZXhlY3V0ZWQgYWZ0ZXIgYWxsIFVJIGFuZFxuXHQvLyBjb250cm9sbGVyIGNvZGUuIE9uZSBleGFtcGxlIGRlZmVycmVkIGV2ZW50IGhhbmRsZXJzIHdob3NlXG5cdC8vIGZ1bmN0aW9ucyBhcmUgbm90IGRlZmluZWQgdW50aWwgYWZ0ZXIgdGhlIGNvbnRyb2xsZXIgY29kZVxuXHQvLyBpcyBleGVjdXRlZC5cblx0XG5cblx0Ly8gRXh0ZW5kIHRoZSAkIGluc3RhbmNlIHdpdGggYWxsIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllc1xuXHQvLyBkZWZpbmVkIG9uIHRoZSBleHBvcnRzIG9iamVjdC5cblx0Xy5leHRlbmQoJCwgZXhwb3J0cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjtcbiIsInZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuICB0aXRsZTogXCJpQmVhY29uIFRlc3RcIixcbiAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIiB9KTtcblxuXG52YXIgdGV4dCA9IFwiVjIuNVwiO1xudmFyIGF0dHIgPSBUaXRhbml1bS5VSS5jcmVhdGVBdHRyaWJ1dGVkU3RyaW5nKHtcbiAgdGV4dDogdGV4dCB9KTtcblxuXG52YXIgdmVyc2lvbiA9IFRpdGFuaXVtLlVJLmNyZWF0ZUxhYmVsKHtcbiAgdG9wOiA0ODAsXG4gIGNvbG9yOiAnYmxhY2snLFxuICBoZWlnaHQ6IFRpdGFuaXVtLlVJLlNJWkUsXG4gIGF0dHJpYnV0ZWRTdHJpbmc6IGF0dHIgfSk7XG5cblxudmFyIGNpZFRleHRGaWVsZCA9IFRpLkFwcC5Qcm9wZXJ0aWVzLmdldFN0cmluZyhcImluZXRCZWFjb25EYXRhX2NpZFwiKTtcbmlmIChjaWRUZXh0RmllbGQgPT0gbnVsbCB8fCBjaWRUZXh0RmllbGQgPT0gXCJcIikge1xuICBjaWRUZXh0RmllbGQgPSBcIkVudGVyIFlvdXIgQ0lEXCI7XG59XG52YXIgdGV4dEZpZWxkID0gVGkuVUkuY3JlYXRlVGV4dEZpZWxkKHtcbiAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZWRlZCcsXG4gIGNvbG9yOiAnZ3JlZW4nLFxuICBoaW50VGV4dDogY2lkVGV4dEZpZWxkLFxuICBoaW50VGV4dENvbG9yOiAnYmxhY2snLFxuICB0b3A6IDI1LFxuICB3aWR0aDogMjUwLFxuICBoZWlnaHQ6IDQwIH0pO1xuXG5cbnZhciBiMSA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4gIHRvcDogMTUwLFxuICB0aXRsZTogXCJTdGFydFwiIH0pO1xuXG5cbnZhciBiMiA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4gIHRvcDogMjAwLFxuICB0aXRsZTogXCJTdG9wXCIgfSk7XG5cblxudmFyIGJfYmxlID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbiAgdG9wOiAyNTAsXG4gIHRpdGxlOiBcIkJMRVwiIH0pO1xuXG5cbnZhciBiX3N0b3BfYmxlID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbiAgdG9wOiAzMDAsXG4gIHRpdGxlOiBcIlN0b3AgQkxFXCIgfSk7XG5cblxudmFyIGJfc2F2ZUNpZCA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4gIHRvcDogNzUsXG4gIC8vIHJpZ2h0OiA5MCxcbiAgYmFja2dyb3VuZENvbG9yOiAnIzljZTg5NScsXG4gIHRpdGxlOiBcIlNhdmVcIiB9KTtcblxuXG52YXIgYl9zaG93RGF0YSA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4gIHRvcDogNDI1LFxuICB0aXRsZTogXCJTaG93XCIgfSk7XG5cblxudmFyIGJfc2VuZERhdGEgPSBUaS5VSS5jcmVhdGVCdXR0b24oe1xuICB0b3A6IDUwMCxcbiAgdGl0bGU6IFwiU2VuZCBEYXRhIFwiIH0pO1xuXG5cbnZhciBiX21kNV9oYXNoID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbiAgdG9wOiAzNTAsXG4gIHRpdGxlOiBcIkhhc2hcIiB9KTtcblxuXG52YXIgaW5ldEJlYWNvbiA9IEFsbG95LmNyZWF0ZUNvbnRyb2xsZXIoXCJpbmV0X2JlYWNvbi9iZWFjb25cIik7XG4vLyBpbmV0QmVhY29uLmJlYWNvblN0YXJ0U2NhbigpO1xuXG5iMS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgYWxlcnQoXCJTdGFydCBNb25pdG9yaW5nXCIpO1xuICBpbmV0QmVhY29uLmJlYWNvblN0YXJ0U2NhbigpO1xufSk7XG5cbmIyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBhbGVydChcIlN0b3AgTW9uaXRvcmluZ1wiKTtcbiAgaW5ldEJlYWNvbi5iZWFjb25TdG9wU2NhbigpO1xufSk7XG5cbmJfc2F2ZUNpZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgVGkuQXBwLlByb3BlcnRpZXMuc2V0U3RyaW5nKFwiaW5ldEJlYWNvbkRhdGFfY2lkXCIsIHRleHRGaWVsZC52YWx1ZSk7XG4gIHZhciBjaWQgPSBUaS5BcHAuUHJvcGVydGllcy5nZXRTdHJpbmcoXCJpbmV0QmVhY29uRGF0YV9jaWRcIik7XG4gIGFsZXJ0KFwiQ2lkIFwiICsgY2lkICsgXCIgaGFzIGJlZW4gc2F2ZWRcIik7XG59KTtcblxuYl9zaG93RGF0YS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgdmFyIGNpZCA9IFRpLkFwcC5Qcm9wZXJ0aWVzLmdldFN0cmluZyhcImluZXRCZWFjb25EYXRhX2NpZFwiKTtcbiAgdmFyIG1pbm9yID0gVGkuQXBwLlByb3BlcnRpZXMuZ2V0U3RyaW5nKFwiaW5ldEJlYWNvbkRhdGFfbWlub3JcIik7XG4gIHZhciBtYWpvciA9IFRpLkFwcC5Qcm9wZXJ0aWVzLmdldFN0cmluZyhcImluZXRCZWFjb25EYXRhX21ham9yXCIpO1xuICBjb25zb2xlLmxvZyhjaWQpO1xuICB2YXIgZl9iZWFjb24gPSBUaS5BcHAuUHJvcGVydGllcy5nZXRTdHJpbmcoXCJmX2JlYWNvblwiKTtcbiAgYWxlcnQoXCJmb3VuZCBcIiArIGZfYmVhY29uKTtcbn0pO1xuXG5iX3NlbmREYXRhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICB2YXIgbWlub3IgPSBUaS5BcHAuUHJvcGVydGllcy5nZXRTdHJpbmcoXCJpbmV0QmVhY29uRGF0YV9taW5vclwiKTtcbiAgdmFyIG1ham9yID0gVGkuQXBwLlByb3BlcnRpZXMuZ2V0U3RyaW5nKFwiaW5ldEJlYWNvbkRhdGFfbWFqb3JcIik7XG4gIGluZXRCZWFjb24ucHV0QXBpKG1ham9yLCBtaW5vcik7XG59KTtcblxuYl9ibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGFsZXJ0KFwiU3RhcnQgQkxFXCIpO1xuICBpbmV0QmVhY29uLkJMRVNjYW4oKTtcbn0pO1xuXG5iX3N0b3BfYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBhbGVydChcIlN0b3AgQkxFXCIpO1xuICBpbmV0QmVhY29uLnN0b3BCTEUoKTtcbn0pO1xuXG5iX21kNV9oYXNoLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBhbGVydChcIkhhc2ghXCIpO1xuICBpbmV0QmVhY29uLm1kNV9oYXNoKCk7XG59KTtcblxud2luLmFkZChiMSk7XG53aW4uYWRkKGIyKTtcbndpbi5hZGQodmVyc2lvbik7XG53aW4uYWRkKHRleHRGaWVsZCk7XG53aW4uYWRkKGJfc2F2ZUNpZCk7XG53aW4uYWRkKGJfc2hvd0RhdGEpO1xud2luLmFkZChiX2JsZSk7XG53aW4uYWRkKGJfc3RvcF9ibGUpO1xuLy8gd2luLmFkZChiX3NlbmREYXRhKTtcbndpbi5hZGQoYl9tZDVfaGFzaCk7XG53aW4ub3BlbigpOyJdLCJzb3VyY2VSb290IjoiZDpcXEdJQU5UXFx3dzJcXGJjLWRlYnVnXFxpbmV0dGliZWFjb24ifQ==
