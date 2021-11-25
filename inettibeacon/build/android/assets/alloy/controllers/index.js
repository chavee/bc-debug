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


text="Debug Version 1.0.5",
attr=Titanium.UI.createAttributedString({
text:text}),


version=Titanium.UI.createLabel({
top:480,
color:"black",
height:Titanium.UI.SIZE,
attributedString:attr}),


cidTextField=Ti.App.Properties.getString("inetBeaconData_cid");(
null==cidTextField||""==cidTextField)&&(
cidTextField="Enter Your cid");var

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
title:"Start Monitoring"}),


b2=Ti.UI.createButton({
top:200,
title:"Stop Monitoring"}),


b_saveCid=Ti.UI.createButton({
top:75,

backgroundColor:"#9ce895",
title:"Save"}),


b_showData=Ti.UI.createButton({
top:425,
title:"Show Data "}),


b_sendData=Ti.UI.createButton({
top:500,
title:"Send Data "}),


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
console.log(cid),
alert("Cid: "+cid+"\nMajor: "+major+"\nMinor: "+minor);

}),

b_sendData.addEventListener("click",function(e){var
minor=Ti.App.Properties.getString("inetBeaconData_minor"),
major=Ti.App.Properties.getString("inetBeaconData_major");
inetBeacon.putApi(major,minor);
}),

win.add(b1),
win.add(b2),
win.add(version),
win.add(textField),
win.add(b_saveCid),
win.add(b_showData),

win.open(),









_.extend($,exports);
}

module.exports=Controller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlbXBsYXRlLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsUUFBQSxDQUFBLEtBQUEsQ0FBQSxRQURBO0FBRUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUZBOzs7OztBQU9BLFFBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUNBLEdBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQTs7OztBQUlBLE1BSEEsQ0FBQSxHQUdBLEdBRkEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxJQUVBLEVBQUEsR0FBQTtBQUNBOztBQUVBLFFBQUEsQ0FBQSxVQUFBLEVBQUE7Ozs7OztBQU1BLEdBSkEsT0FBQSxxQ0FBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLFNBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUlBLENBSEEsS0FBQSxnQkFBQSxDQUFBLE9BR0EsQ0FGQSxLQUFBLElBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsRUFFQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxjQUFBLENBQUEsWUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxnQkFBQSxDQURBO0FBRUEsTUFBQSxDQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsUUFBQSxDQUZBO0FBR0EsY0FBQSxDQUFBLFlBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsZ0JBQUEsQ0FIQSxDQU5BOztBQVdBLENBQUEsQ0FBQSxJQVhBO0FBWUEsT0FBQSxDQUFBLEVBWkE7QUFhQSxRQUFBLENBQUEsRUFiQTs7Ozs7Ozs7QUFxQkEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsQ0FyQkE7Ozs7O0FBMEJBLENBQUEsQ0FBQSxNQUFBLENBQUEs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LENBdkNBO0FBd0NBOztBQUVBLE1BQUEsQ0FBQSxPQUFBLENBQUEsVSIsInNvdXJjZXNDb250ZW50IjpbInZhciBBbGxveSA9IHJlcXVpcmUoJy9hbGxveScpLFxuXHRCYWNrYm9uZSA9IEFsbG95LkJhY2tib25lLFxuXHRfID0gQWxsb3kuXztcblxuXG5cblxuZnVuY3Rpb24gX19wcm9jZXNzQXJnKG9iaiwga2V5KSB7XG5cdHZhciBhcmcgPSBudWxsO1xuXHRpZiAob2JqKSB7XG5cdFx0YXJnID0gb2JqW2tleV0gfHwgbnVsbDtcblx0fVxuXHRyZXR1cm4gYXJnO1xufVxuXG5mdW5jdGlvbiBDb250cm9sbGVyKCkge1xuXHRcblx0cmVxdWlyZSgnL2FsbG95L2NvbnRyb2xsZXJzLycgKyAnQmFzZUNvbnRyb2xsZXInKS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblx0dGhpcy5fX2NvbnRyb2xsZXJQYXRoID0gJ2luZGV4Jztcblx0dGhpcy5hcmdzID0gYXJndW1lbnRzWzBdIHx8IHt9O1xuXG5cdGlmIChhcmd1bWVudHNbMF0pIHtcblx0XHR2YXIgX19wYXJlbnRTeW1ib2wgPSBfX3Byb2Nlc3NBcmcoYXJndW1lbnRzWzBdLCAnX19wYXJlbnRTeW1ib2wnKTtcblx0XHR2YXIgJG1vZGVsID0gX19wcm9jZXNzQXJnKGFyZ3VtZW50c1swXSwgJyRtb2RlbCcpO1xuXHRcdHZhciBfX2l0ZW1UZW1wbGF0ZSA9IF9fcHJvY2Vzc0FyZyhhcmd1bWVudHNbMF0sICdfX2l0ZW1UZW1wbGF0ZScpO1xuXHR9XG5cdHZhciAkID0gdGhpcztcblx0dmFyIGV4cG9ydHMgPSB7fTtcblx0dmFyIF9fZGVmZXJzID0ge307XG5cblx0Ly8gR2VuZXJhdGVkIGNvZGUgdGhhdCBtdXN0IGJlIGV4ZWN1dGVkIGJlZm9yZSBhbGwgVUkgYW5kL29yXG5cdC8vIGNvbnRyb2xsZXIgY29kZS4gT25lIGV4YW1wbGUgaXMgYWxsIG1vZGVsIGFuZCBjb2xsZWN0aW9uXG5cdC8vIGRlY2xhcmF0aW9ucyBmcm9tIG1hcmt1cC5cblx0XG5cblx0Ly8gR2VuZXJhdGVkIFVJIGNvZGVcblx0ZXhwb3J0cy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge307XG5cblx0Ly8gbWFrZSBhbGwgSURlZCBlbGVtZW50cyBpbiAkLl9fdmlld3MgYXZhaWxhYmxlIHJpZ2h0IG9uIHRoZSAkIGluIGFcblx0Ly8gY29udHJvbGxlcidzIGludGVybmFsIGNvZGUuIEV4dGVybmFsbHkgdGhlIElEZWQgZWxlbWVudHMgd2lsbFxuXHQvLyBiZSBhY2Nlc3NlZCB3aXRoIGdldFZpZXcoKS5cblx0Xy5leHRlbmQoJCwgJC5fX3ZpZXdzKTtcblxuXHQvLyBDb250cm9sbGVyIGNvZGUgZGlyZWN0bHkgZnJvbSB0aGUgZGV2ZWxvcGVyJ3MgY29udHJvbGxlciBmaWxlXG5cdF9fTUFQTUFSS0VSX0NPTlRST0xMRVJfQ09ERV9fXG5cblx0Ly8gR2VuZXJhdGVkIGNvZGUgdGhhdCBtdXN0IGJlIGV4ZWN1dGVkIGFmdGVyIGFsbCBVSSBhbmRcblx0Ly8gY29udHJvbGxlciBjb2RlLiBPbmUgZXhhbXBsZSBkZWZlcnJlZCBldmVudCBoYW5kbGVycyB3aG9zZVxuXHQvLyBmdW5jdGlvbnMgYXJlIG5vdCBkZWZpbmVkIHVudGlsIGFmdGVyIHRoZSBjb250cm9sbGVyIGNvZGVcblx0Ly8gaXMgZXhlY3V0ZWQuXG5cdFxuXG5cdC8vIEV4dGVuZCB0aGUgJCBpbnN0YW5jZSB3aXRoIGFsbCBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXNcblx0Ly8gZGVmaW5lZCBvbiB0aGUgZXhwb3J0cyBvYmplY3QuXG5cdF8uZXh0ZW5kKCQsIGV4cG9ydHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG4iLCJ2YXIgd2luID0gVGkuVUkuY3JlYXRlV2luZG93KHtcbiAgdGl0bGU6IFwiaUJlYWNvbiBUZXN0XCIsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCIgfSk7XG5cblxudmFyIHRleHQgPSBcIkRlYnVnIFZlcnNpb24gMS4wLjVcIjtcbnZhciBhdHRyID0gVGl0YW5pdW0uVUkuY3JlYXRlQXR0cmlidXRlZFN0cmluZyh7XG4gIHRleHQ6IHRleHQgfSk7XG5cblxudmFyIHZlcnNpb24gPSBUaXRhbml1bS5VSS5jcmVhdGVMYWJlbCh7XG4gIHRvcDogNDgwLFxuICBjb2xvcjogJ2JsYWNrJyxcbiAgaGVpZ2h0OiBUaXRhbml1bS5VSS5TSVpFLFxuICBhdHRyaWJ1dGVkU3RyaW5nOiBhdHRyIH0pO1xuXG5cbnZhciBjaWRUZXh0RmllbGQgPSBUaS5BcHAuUHJvcGVydGllcy5nZXRTdHJpbmcoXCJpbmV0QmVhY29uRGF0YV9jaWRcIik7XG5pZiAoY2lkVGV4dEZpZWxkID09IG51bGwgfHwgY2lkVGV4dEZpZWxkID09IFwiXCIpIHtcbiAgY2lkVGV4dEZpZWxkID0gXCJFbnRlciBZb3VyIGNpZFwiO1xufVxudmFyIHRleHRGaWVsZCA9IFRpLlVJLmNyZWF0ZVRleHRGaWVsZCh7XG4gIGJhY2tncm91bmRDb2xvcjogJyNmZmVkZWQnLFxuICBjb2xvcjogJ2dyZWVuJyxcbiAgaGludFRleHQ6IGNpZFRleHRGaWVsZCxcbiAgaGludFRleHRDb2xvcjogJ2JsYWNrJyxcbiAgdG9wOiAyNSxcbiAgd2lkdGg6IDI1MCxcbiAgaGVpZ2h0OiA0MCB9KTtcblxuXG52YXIgYjEgPSBUaS5VSS5jcmVhdGVCdXR0b24oe1xuICB0b3A6IDE1MCxcbiAgdGl0bGU6IFwiU3RhcnQgTW9uaXRvcmluZ1wiIH0pO1xuXG5cbnZhciBiMiA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4gIHRvcDogMjAwLFxuICB0aXRsZTogXCJTdG9wIE1vbml0b3JpbmdcIiB9KTtcblxuXG52YXIgYl9zYXZlQ2lkID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbiAgdG9wOiA3NSxcbiAgLy8gcmlnaHQ6IDkwLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjOWNlODk1JyxcbiAgdGl0bGU6IFwiU2F2ZVwiIH0pO1xuXG5cbnZhciBiX3Nob3dEYXRhID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbiAgdG9wOiA0MjUsXG4gIHRpdGxlOiBcIlNob3cgRGF0YSBcIiB9KTtcblxuXG52YXIgYl9zZW5kRGF0YSA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4gIHRvcDogNTAwLFxuICB0aXRsZTogXCJTZW5kIERhdGEgXCIgfSk7XG5cblxudmFyIGluZXRCZWFjb24gPSBBbGxveS5jcmVhdGVDb250cm9sbGVyKFwiaW5ldF9iZWFjb24vYmVhY29uXCIpO1xuXG5iMS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgYWxlcnQoXCJTdGFydCBNb25pdG9yaW5nXCIpO1xuICBpbmV0QmVhY29uLmJlYWNvblN0YXJ0U2NhbigpO1xufSk7XG5cbmIyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBhbGVydChcIlN0b3AgTW9uaXRvcmluZ1wiKTtcbiAgaW5ldEJlYWNvbi5iZWFjb25TdG9wU2NhbigpO1xufSk7XG5cbmJfc2F2ZUNpZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgVGkuQXBwLlByb3BlcnRpZXMuc2V0U3RyaW5nKFwiaW5ldEJlYWNvbkRhdGFfY2lkXCIsIHRleHRGaWVsZC52YWx1ZSk7XG4gIHZhciBjaWQgPSBUaS5BcHAuUHJvcGVydGllcy5nZXRTdHJpbmcoXCJpbmV0QmVhY29uRGF0YV9jaWRcIik7XG4gIGFsZXJ0KFwiQ2lkIFwiICsgY2lkICsgXCIgaGFzIGJlZW4gc2F2ZWRcIik7XG59KTtcblxuYl9zaG93RGF0YS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgdmFyIGNpZCA9IFRpLkFwcC5Qcm9wZXJ0aWVzLmdldFN0cmluZyhcImluZXRCZWFjb25EYXRhX2NpZFwiKTtcbiAgdmFyIG1pbm9yID0gVGkuQXBwLlByb3BlcnRpZXMuZ2V0U3RyaW5nKFwiaW5ldEJlYWNvbkRhdGFfbWlub3JcIik7XG4gIHZhciBtYWpvciA9IFRpLkFwcC5Qcm9wZXJ0aWVzLmdldFN0cmluZyhcImluZXRCZWFjb25EYXRhX21ham9yXCIpO1xuICBjb25zb2xlLmxvZyhjaWQpO1xuICBhbGVydChcIkNpZDogXCIgKyBjaWQgKyBcIlxcbk1ham9yOiBcIiArIG1ham9yICsgXCJcXG5NaW5vcjogXCIgKyBtaW5vcik7XG5cbn0pO1xuXG5iX3NlbmREYXRhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICB2YXIgbWlub3IgPSBUaS5BcHAuUHJvcGVydGllcy5nZXRTdHJpbmcoXCJpbmV0QmVhY29uRGF0YV9taW5vclwiKTtcbiAgdmFyIG1ham9yID0gVGkuQXBwLlByb3BlcnRpZXMuZ2V0U3RyaW5nKFwiaW5ldEJlYWNvbkRhdGFfbWFqb3JcIik7XG4gIGluZXRCZWFjb24ucHV0QXBpKG1ham9yLCBtaW5vcik7XG59KTtcblxud2luLmFkZChiMSk7XG53aW4uYWRkKGIyKTtcbndpbi5hZGQodmVyc2lvbik7XG53aW4uYWRkKHRleHRGaWVsZCk7XG53aW4uYWRkKGJfc2F2ZUNpZCk7XG53aW4uYWRkKGJfc2hvd0RhdGEpO1xuLy8gd2luLmFkZChiX3NlbmREYXRhKTtcbndpbi5vcGVuKCk7Il0sInNvdXJjZVJvb3QiOiJkOlxcR0lBTlRcXHd3MlxcaW5ldHRpYmVhY29uIn0=
