var Alloy=require("/alloy"),
Backbone=Alloy.Backbone,
_=Alloy._,












Controller=function(){



function getControllerParam(){
return self.__widgetId?{
widgetId:self.__widgetId,
name:self.__controllerPath}:
self.__controllerPath;
}var roots=[],self=this;

this.__iamalloy=!0,
_.extend(this,Backbone.Events,{
__views:{},
__events:[],
__proxyProperties:{},
setParent:function(parent){
var len=roots.length;

if(len){


this.parent=parent.__iamalloy?parent.parent:

parent;


for(var i=0;i<len;i++)
roots[i].__iamalloy?
roots[i].setParent(this.parent):

this.parent.add(roots[i])}


},
addTopLevelView:function(view){
roots.push(view);
},
addProxyProperty:function(key,value){
this.__proxyProperties[key]=value;
},
removeProxyProperty:function(key){
delete this.__proxyProperties[key];
},




















getTopLevelViews:function(){
return roots;
},

















getView:function(id){return(
"undefined"==typeof id||null===id?
roots[0]:

this.__views[id]);
},
removeView:function(id){
delete this[id],
delete this.__views[id];
},

getProxyProperty:function(name){
return this.__proxyProperties[name];
},











































getViews:function(){
return this.__views;
},



















destroy:function(){


},


getViewEx:function(opts){
var recurse=opts.recurse||!1;
if(recurse){
var view=this.getView();return(
view?

view.__iamalloy?
view.getViewEx({recurse:!0}):

view:null);

}
return this.getView();

},


getProxyPropertyEx:function(name,opts){
var recurse=opts.recurse||!1;
if(recurse){
var view=this.getProxyProperty(name);return(
view?

view.__iamalloy?
view.getProxyProperty(name,{recurse:!0}):

view:null);

}
return this.getView(name);

},







































createStyle:function(opts){
return Alloy.createStyle(getControllerParam(),opts);
},




UI:{
create:function(apiName,opts){
return Alloy.UI.create(getControllerParam(),apiName,opts);
}},


































addClass:function(proxy,classes,opts){
return Alloy.addClass(getControllerParam(),proxy,classes,opts);
},




















removeClass:function(proxy,classes,opts){
return Alloy.removeClass(getControllerParam(),proxy,classes,opts);
},





















resetClass:function(proxy,classes,opts){
return Alloy.resetClass(getControllerParam(),proxy,classes,opts);
},







































updateViews:function(args){
var views=this.getViews();









return _.isObject(args)&&_.each(_.keys(args),function(key){var elem=views[key.substring(1)];0===key.indexOf("#")&&"#"!==key&&_.isObject(elem)&&"function"==typeof elem.applyProperties&&elem.applyProperties(args[key])}),this;
},

















addListener:function(proxy,type,callback){return(
!proxy.id&&(
proxy.id=_.uniqueId("__trackId"),

_.has(this.__views,proxy.id))?void
Ti.API.error("$.addListener: "+proxy.id+" was conflict."):(




proxy.addEventListener(type,callback),
this.__events.push({
id:proxy.id,
view:proxy,
type:type,
handler:callback}),


proxy.id));
},



















getListener:function(proxy,type){
return _.filter(this.__events,function(event,index){return!(
proxy&&proxy.id!==event.id||
type&&type!==event.type);




});
},


























removeListener:function(proxy,type,callback){








return this.__events.forEach(function(event,index){proxy&&proxy.id!==event.id||type&&type!==event.type||callback&&callback!==event.handler||(event.view.removeEventListener(event.type,event.handler),delete self.__events[index])}),this;
}});

};
module.exports=Controller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkFsbG95IiwicmVxdWlyZSIsIkJhY2tib25lIiwiXyIsIkNvbnRyb2xsZXIiLCJnZXRDb250cm9sbGVyUGFyYW0iLCJzZWxmIiwiX193aWRnZXRJZCIsIndpZGdldElkIiwibmFtZSIsIl9fY29udHJvbGxlclBhdGgiLCJyb290cyIsIl9faWFtYWxsb3kiLCJleHRlbmQiLCJFdmVudHMiLCJfX3ZpZXdzIiwiX19ldmVudHMiLCJfX3Byb3h5UHJvcGVydGllcyIsInNldFBhcmVudCIsInBhcmVudCIsImxlbiIsImxlbmd0aCIsImkiLCJhZGQiLCJhZGRUb3BMZXZlbFZpZXciLCJ2aWV3IiwicHVzaCIsImFkZFByb3h5UHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsInJlbW92ZVByb3h5UHJvcGVydHkiLCJnZXRUb3BMZXZlbFZpZXdzIiwiZ2V0VmlldyIsImlkIiwicmVtb3ZlVmlldyIsImdldFByb3h5UHJvcGVydHkiLCJnZXRWaWV3cyIsImRlc3Ryb3kiLCJnZXRWaWV3RXgiLCJvcHRzIiwicmVjdXJzZSIsImdldFByb3h5UHJvcGVydHlFeCIsImNyZWF0ZVN0eWxlIiwiVUkiLCJjcmVhdGUiLCJhcGlOYW1lIiwiYWRkQ2xhc3MiLCJwcm94eSIsImNsYXNzZXMiLCJyZW1vdmVDbGFzcyIsInJlc2V0Q2xhc3MiLCJ1cGRhdGVWaWV3cyIsImFyZ3MiLCJ2aWV3cyIsImlzT2JqZWN0IiwiZWFjaCIsImtleXMiLCJlbGVtIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsImFwcGx5UHJvcGVydGllcyIsImFkZExpc3RlbmVyIiwidHlwZSIsImNhbGxiYWNrIiwidW5pcXVlSWQiLCJoYXMiLCJUaSIsIkFQSSIsImVycm9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZXIiLCJnZXRMaXN0ZW5lciIsImZpbHRlciIsImV2ZW50IiwiaW5kZXgiLCJyZW1vdmVMaXN0ZW5lciIsImZvckVhY2giLCJyZW1vdmVFdmVudExp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QyxDQUszQyxNQUFPaEUsQ0FBQUEsSUFBSSxDQUFDVSxRQUFMLENBQWMwRCxLQUFkLENBTG9DLENBTzVDLENBUEQsQ0FRQSxDQUFPLElBQVA7QUFDQSxDQTdkOEIsQ0FBaEMsQ0FaMkI7O0FBMmUzQixDO0FBQ0RJLE1BQU0sQ0FBQ0MsT0FBUCxDQUFpQjNFLFUiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQWxsb3kgPSByZXF1aXJlKCcvYWxsb3knKSxcblx0QmFja2JvbmUgPSBBbGxveS5CYWNrYm9uZSxcblx0XyA9IEFsbG95Ll87XG5cbi8qKlxuICogQGNsYXNzIEFsbG95LkNvbnRyb2xsZXJcbiAqIEBleHRlbmRzIEJhY2tib25lLkV2ZW50c1xuICogVGhlIGJhc2UgY2xhc3MgZm9yIEFsbG95IGNvbnRyb2xsZXJzLlxuICpcbiAqIEVhY2ggY29udHJvbGxlciBpcyBhc3NvY2lhdGVkIHdpdGggYSBVSSBoaWVyYXJjaHksIGRlZmluZWQgaW4gYW4gWE1MIGZpbGUgaW4gdGhlXG4gKiBgdmlld3NgIGZvbGRlci4gRWFjaCBlbGVtZW50IGluIHRoZSB2aWV3IGhpZXJhcmNoeSBpcyBlaXRoZXIgYSBUaXRhbml1bSB7QGxpbmsgVGl0YW5pdW0uVUkuVmlldyBWaWV3fVxuICogb3IgYW5vdGhlciBBbGxveSBjb250cm9sbGVyIG9yIHdpZGdldC4gRWFjaCBBbGxveSBjb250cm9sbGVyIG9yIHdpZGdldCBjYW4gYWRkaXRpb25hbGx5IGNvbnRhaW5cbiAqIFRpdGFuaXVtIFZpZXdzIGFuZC9vciBtb3JlIGNvbnRyb2xsZXJzIGFuZCB3aWRnZXRzLlxuICpcbiAqL1xudmFyIENvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJvb3RzID0gW107XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHRmdW5jdGlvbiBnZXRDb250cm9sbGVyUGFyYW0oKSB7XG5cdFx0cmV0dXJuIHNlbGYuX193aWRnZXRJZCA/IHtcblx0XHRcdHdpZGdldElkOiBzZWxmLl9fd2lkZ2V0SWQsXG5cdFx0XHRuYW1lOiBzZWxmLl9fY29udHJvbGxlclBhdGhcblx0XHR9IDogc2VsZi5fX2NvbnRyb2xsZXJQYXRoO1xuXHR9XG5cblx0dGhpcy5fX2lhbWFsbG95ID0gdHJ1ZTtcblx0Xy5leHRlbmQodGhpcywgQmFja2JvbmUuRXZlbnRzLCB7XG5cdFx0X192aWV3czoge30sXG5cdFx0X19ldmVudHM6IFtdLFxuXHRcdF9fcHJveHlQcm9wZXJ0aWVzOiB7fSxcblx0XHRzZXRQYXJlbnQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRcdFx0dmFyIGxlbiA9IHJvb3RzLmxlbmd0aDtcblxuXHRcdFx0aWYgKCFsZW4pIHsgcmV0dXJuOyB9XG5cblx0XHRcdGlmIChwYXJlbnQuX19pYW1hbGxveSkge1xuXHRcdFx0XHR0aGlzLnBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBhcmVudCA9IHBhcmVudDtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRpZiAocm9vdHNbaV0uX19pYW1hbGxveSkge1xuXHRcdFx0XHRcdHJvb3RzW2ldLnNldFBhcmVudCh0aGlzLnBhcmVudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5wYXJlbnQuYWRkKHJvb3RzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YWRkVG9wTGV2ZWxWaWV3OiBmdW5jdGlvbih2aWV3KSB7XG5cdFx0XHRyb290cy5wdXNoKHZpZXcpO1xuXHRcdH0sXG5cdFx0YWRkUHJveHlQcm9wZXJ0eTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0dGhpcy5fX3Byb3h5UHJvcGVydGllc1trZXldID0gdmFsdWU7XG5cdFx0fSxcblx0XHRyZW1vdmVQcm94eVByb3BlcnR5OiBmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlbGV0ZSB0aGlzLl9fcHJveHlQcm9wZXJ0aWVzW2tleV07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEBtZXRob2QgZ2V0VG9wTGV2ZWxWaWV3c1xuXHRcdCAqIFJldHVybnMgYSBsaXN0IG9mIHRoZSByb290IHZpZXcgZWxlbWVudHMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29udHJvbGxlci5cblxuXHRcdCAqICMjIyMgRXhhbXBsZVxuXHRcdCAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBkaXNwbGF5cyB0aGUgYGlkYCBvZiBlYWNoIHRvcC1sZXZlbCB2aWV3IGFzc29jaWF0ZWQgd2l0aCB0aGVcblx0XHQgKiBjb250cm9sbGVyOlxuXG5cdC8vIGluZGV4LmpzXG5cdHZhciB2aWV3cyA9ICQuZ2V0VG9wTGV2ZWxWaWV3cygpO1xuXHRmb3IgKGVhY2ggaW4gdmlld3MpIHtcblx0XHR2YXIgdmlldyA9IHZpZXdzW2VhY2hdO1xuXHRcdGNvbnNvbGUubG9nKHZpZXcuaWQpO1xuXHR9XG5cblx0XHQgKlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7QXJyYXkuPChUaXRhbml1bS5VSS5WaWV3fEFsbG95LkNvbnRyb2xsZXIpPn1cblx0XHQgKi9cblx0XHRnZXRUb3BMZXZlbFZpZXdzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiByb290cztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCBnZXRWaWV3XG5cdFx0ICogUmV0dXJucyB0aGUgc3BlY2lmaWVkIHZpZXcgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29udHJvbGxlci5cblx0XHQgKlxuXHRcdCAqIElmIG5vIGBpZGAgaXMgc3BlY2lmaWVkLCByZXR1cm5zIHRoZSBmaXJzdCB0b3AtbGV2ZWwgdmlldy5cblx0XHQgKlxuXHRcdCAqICMjIyMgRXhhbXBsZVxuXHRcdCAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBnZXRzIGEgcmVmZXJlbmNlIHRvIGEgYDxXaW5kb3cvPmAgb2JqZWN0XG5cdFx0ICogd2l0aCB0aGUgYGlkYCBvZiBcImxvZ2luV2luXCIgYW5kIHRoZW4gY2FsbHMgaXRzIFtvcGVuKCldKFRpdGFuaXVtLlVJLldpbmRvdykgbWV0aG9kLlxuXG5cdHZhciBsb2dpbldpbmRvdyA9ICQuZ2V0VmlldygnbG9naW5XaW4nKTtcblx0bG9naW5XaW5kb3cub3BlbigpO1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IFtpZF0gSUQgb2YgdGhlIHZpZXcgdG8gcmV0dXJuLlxuXHRcdCAqIEByZXR1cm4ge1RpdGFuaXVtLlVJLlZpZXcvQWxsb3kuQ29udHJvbGxlcn1cblx0XHQgKi9cblx0XHRnZXRWaWV3OiBmdW5jdGlvbihpZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcgfHwgaWQgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIHJvb3RzWzBdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX192aWV3c1tpZF07XG5cdFx0fSxcblx0XHRyZW1vdmVWaWV3OiBmdW5jdGlvbihpZCkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbaWRdO1xuXHRcdFx0ZGVsZXRlIHRoaXMuX192aWV3c1tpZF07XG5cdFx0fSxcblxuXHRcdGdldFByb3h5UHJvcGVydHk6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9fcHJveHlQcm9wZXJ0aWVzW25hbWVdO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBAbWV0aG9kIGdldFZpZXdzXG5cdFx0ICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIElEZWQgdmlldyBlbGVtZW50cyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjb250cm9sbGVyLlxuXHRcdCAqXG5cdFx0ICogIyMjIyBFeGFtcGxlXG5cdFx0ICogR2l2ZW4gdGhlIGZvbGxvd2luZyBYTUwgdmlldzpcblxuXHQ8QWxsb3k+XG5cdFx0PFRhYkdyb3VwIGlkPVwidGFic1wiPlxuXHRcdFx0PFRhYiB0aXRsZT1cIlRhYiAxXCIgaWNvbj1cIktTX25hdl91aS5wbmdcIiBpZD1cInRhYjFcIj5cblx0XHRcdFx0PFdpbmRvdyB0aXRsZT1cIlRhYiAxXCIgaWQ9XCJ3aW4xXCI+XG5cdFx0XHRcdFx0PExhYmVsIGlkPVwibGFiZWwxXCI+SSBhbSBXaW5kb3cgMTwvTGFiZWw+XG5cdFx0XHRcdDwvV2luZG93PlxuXHRcdFx0PC9UYWI+XG5cdFx0XHQ8VGFiIHRpdGxlPVwiVGFiIDJcIiBpY29uPVwiS1NfbmF2X3ZpZXdzLnBuZ1wiIGlkPVwidGFiMlwiPlxuXHRcdFx0XHQ8V2luZG93IHRpdGxlPVwiVGFiIDJcIiBpZD1cIndpbmQyXCI+XG5cdFx0XHRcdFx0PExhYmVsIGlkPVwibGFiZWwyXCI+SSBhbSBXaW5kb3cgMjwvTGFiZWw+XG5cdFx0XHRcdDwvV2luZG93PlxuXHRcdFx0PC9UYWI+XG5cdFx0PC9UYWJHcm91cD5cblx0XHQ8VmlldyBpZD1cIm90aGVydmlld1wiPjwvVmlldz5cblx0PC9BbGxveT5cblxuXHRcdCogVGhlIGZvbGxvd2luZyB2aWV3LWNvbnRyb2xsZXIgb3V0cHV0cyB0aGUgaWQgb2YgZWFjaCB2aWV3IGluIHRoZSBoaWVyYXJjaHkuXG5cblx0dmFyIHZpZXdzID0gJC5nZXRWaWV3cygpO1xuXHRmb3IgKGVhY2ggaW4gdmlld3MpIHtcblx0XHR2YXIgdmlldyA9IHZpZXdzW2VhY2hdO1xuXHRcdGNvbnNvbGUubG9nKHZpZXcuaWQpO1xuXHR9XG5cblx0W0lORk9dIDogICB3aW4xXG5cdFtJTkZPXSA6ICAgbGFiZWwxXG5cdFtJTkZPXSA6ICAgdGFiMVxuXHRbSU5GT10gOiAgIHdpbmQyXG5cdFtJTkZPXSA6ICAgbGFiZWwyXG5cdFtJTkZPXSA6ICAgdGFiMlxuXHRbSU5GT10gOiAgIHRhYnNcblx0W0lORk9dIDogICBvdGhlcnZpZXdcblxuXHRcdCAqIEByZXR1cm4ge0FycmF5LjwoVGl0YW5pdW0uVUkuVmlld3xBbGxveS5Db250cm9sbGVyKT59XG5cdFx0ICovXG5cdFx0Z2V0Vmlld3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX192aWV3cztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCBkZXN0cm95XG5cdFx0ICogRnJlZXMgYmluZGluZyByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29udHJvbGxlciBhbmQgaXRzXG5cdFx0ICogVUkgY29tcG9uZW50cy4gSXQgaXMgY3JpdGljYWwgdGhhdCB0aGlzIGlzIGNhbGxlZCB3aGVuIGVtcGxveWluZ1xuXHRcdCAqIG1vZGVsL2NvbGxlY3Rpb24gYmluZGluZyBpbiBvcmRlciB0byBhdm9pZCBwb3RlbnRpYWwgbWVtb3J5IGxlYWtzLlxuXHRcdCAqICQuZGVzdHJveSgpIHNob3VsZCBiZSBjYWxsZWQgd2hlbmV2ZXIgYSBjb250cm9sbGVyJ3MgVUkgaXMgdG9cblx0XHQgKiBiZSBcImNsb3NlZFwiIG9yIHJlbW92ZWQgZnJvbSB0aGUgYXBwLiBTZWUgdGhlIFtEZXN0cm95aW5nIERhdGEgQmluZGluZ3NdKCMhL2d1aWRlL0Rlc3Ryb3lpbmdfRGF0YV9CaW5kaW5ncylcblx0XHQgKiB0ZXN0IGFwcGxpY2F0aW9uIGZvciBhbiBleGFtcGxlIG9mIHRoaXMgYXBwcm9hY2guXG5cblx0XHQgKiAjIyMjIEV4YW1wbGVcblx0XHQgKiBJbiB0aGUgZm9sbG93aW5nIGV4YW1wbGUgdGhlIHZpZXctY29udHJvbGxlciBmb3IgYSB7QGxpbmsgVGl0YW5pdW0uVUkuV2luZG93IFdpbmRvd30gb2JqZWN0IG5hbWVkIGBkaWFsb2dgXG5cdFx0ICogY2FsbHMgaXRzIGBkZXN0cm95KClgIG1ldGhvZCBpbiByZXNwb25zZSB0byB0aGUgV2luZG93IG9iamVjdCBiZWluZyBjbG9zZWQuXG5cblxuXHQkLmRpYWxvZy5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xuXHRcdCQuZGVzdHJveSgpO1xuXHR9KTtcblx0XHQgKi9cblx0XHRkZXN0cm95OiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGRlc3Ryb3koKSBpcyBkZWZpbmVkIGR1cmluZyB0aGUgY29tcGlsZSBwcm9jZXNzIGJhc2VkIG9uXG5cdFx0XHQvLyB0aGUgVUkgY29tcG9uZW50cyBhbmQgYmluZGluZyBjb250YWluZWQgd2l0aGluIHRoZSBjb250cm9sbGVyLlxuXHRcdH0sXG5cblx0XHQvLyBnZXRWaWV3RXggZm9yIGFkdmFuY2VkIHBhcnNpbmcgYW5kIGVsZW1lbnQgdHJhdmVyc2FsXG5cdFx0Z2V0Vmlld0V4OiBmdW5jdGlvbihvcHRzKSB7XG5cdFx0XHR2YXIgcmVjdXJzZSA9IG9wdHMucmVjdXJzZSB8fCBmYWxzZTtcblx0XHRcdGlmIChyZWN1cnNlKSB7XG5cdFx0XHRcdHZhciB2aWV3ID0gdGhpcy5nZXRWaWV3KCk7XG5cdFx0XHRcdGlmICghdmlldykge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHZpZXcuX19pYW1hbGxveSkge1xuXHRcdFx0XHRcdHJldHVybiB2aWV3LmdldFZpZXdFeCh7IHJlY3Vyc2U6IHRydWUgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHZpZXc7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFZpZXcoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gZ2V0UHJveHlQcm9wZXJ0eUV4IGZvciBhZHZhbmNlZCBwYXJzaW5nIGFuZCBlbGVtZW50IHRyYXZlcnNhbFxuXHRcdGdldFByb3h5UHJvcGVydHlFeDogZnVuY3Rpb24obmFtZSwgb3B0cykge1xuXHRcdFx0dmFyIHJlY3Vyc2UgPSBvcHRzLnJlY3Vyc2UgfHwgZmFsc2U7XG5cdFx0XHRpZiAocmVjdXJzZSkge1xuXHRcdFx0XHR2YXIgdmlldyA9IHRoaXMuZ2V0UHJveHlQcm9wZXJ0eShuYW1lKTtcblx0XHRcdFx0aWYgKCF2aWV3KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH0gZWxzZSBpZiAodmlldy5fX2lhbWFsbG95KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHZpZXcuZ2V0UHJveHlQcm9wZXJ0eShuYW1lLCB7IHJlY3Vyc2U6IHRydWUgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHZpZXc7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFZpZXcobmFtZSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEBtZXRob2QgY3JlYXRlU3R5bGVcblx0XHQgKiBDcmVhdGVzIGEgZGljdGlvbmFyeSBvZiBwcm9wZXJ0aWVzIGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgc3R5bGVzLlxuXHRcdCAqXG5cdFx0ICpcblx0XHQgKiBZb3UgY2FuIHVzZSB0aGlzIGRpY3Rpb25hcnkgd2l0aCB0aGUgdmlldyBvYmplY3Qnc1xuXHRcdCAqIHtAbGluayBUaXRhbml1bS5VSS5WaWV3I21ldGhvZC1hcHBseVByb3BlcnRpZXMgYXBwbHlQcm9wZXJ0aWVzfSBtZXRob2Rcblx0XHQgKiBvciBhIGNyZWF0ZSBvYmplY3QgbWV0aG9kLCBzdWNoIGFzIHtAbGluayBUaXRhbml1bS5VSSNtZXRob2QtY3JlYXRlVmlldyBUaXRhbml1bS5VSS5jcmVhdGVWaWV3fS5cblx0XHQgKiAjIyMjIEV4YW1wbGVzXG5cdFx0ICogVGhlIGZvbGxvd2luZyBjcmVhdGVzIGEgbmV3IHN0eWxlIG9iamVjdCB0aGF0IGlzIHBhc3NlZCBhcyBhIHBhcmFtZXRlclxuXHRcdCAqIHRvIHRoZSB7QGxpbmsgVGl0YW5pdW0uVUkjbWV0aG9kLWNyZWF0ZUxhYmVsIFRpLlVJLmNyZWF0ZUxhYmVsKCl9IG1ldGhvZC5cblxuXHR2YXIgc3R5bGVBcmdzID0ge1xuXHRhcGlOYW1lOiAnVGkuVUkuTGFiZWwnLFxuXHRcdGNsYXNzZXM6IFsnYmx1ZScsJ3NoYWRvdycsJ2xhcmdlJ10sXG5cdFx0aWQ6ICd0ZXN0ZXInLFxuXHRcdGJvcmRlcldpZHRoOiAyLFxuXHRcdGJvcmRlclJhZGl1czogMTYsXG5cdFx0Ym9yZGVyQ29sb3I6ICcjMDAwJ1xuXHR9O1xuXHR2YXIgc3R5bGVPYmplY3QgPSAkLmNyZWF0ZVN0eWxlKHN0eWxlQXJncyk7XG5cdHRlc3RMYWJlbCA9IFRpLlVJLmNyZWF0ZUxhYmVsKHN0eWxlT2JqZWN0KTtcblxuXHRcdCAqIFRoZSBuZXh0IGV4YW1wbGUgdXNlcyB0aGUge0BsaW5rIFRpdGFuaXVtI21ldGhvZC1hcHBseVByb3BlcnRpZXMgYXBwbHlQcm9wZXJ0aWVzKCl9IG1ldGhvZFxuXHRcdCAqIHRvIGFwcGx5IGEgc3R5bGUgb2JqZWN0IHRvIGFuIGV4aXN0aW5nIEJ1dHRvbiBjb250cm9sIChidXR0b24gbm90IHNob3duKS5cblxuXHR2YXIgc3R5bGUgPSAkLmNyZWF0ZVN0eWxlKHtcblx0XHRjbGFzc2VzOiBhcmdzLmJ1dHRvbixcblx0XHRhcGlOYW1lOiAnQnV0dG9uJyxcblx0XHRjb2xvcjogJ2JsdWUnXG5cdH0pO1xuXHQkLmJ1dHRvbi5hcHBseVByb3BlcnRpZXMoc3R5bGUpO1xuXHRcdCAqIEBwYXJhbSB7QWxsb3lTdHlsZURpY3R9IG9wdHMgRGljdGlvbmFyeSBvZiBzdHlsZXMgdG8gYXBwbHkuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtEaWN0aW9uYXJ5fVxuXHRcdCAqIEBzaW5jZSAxLjIuMFxuXG5cdFx0ICovXG5cdFx0Y3JlYXRlU3R5bGU6IGZ1bmN0aW9uKG9wdHMpIHtcblx0XHRcdHJldHVybiBBbGxveS5jcmVhdGVTdHlsZShnZXRDb250cm9sbGVyUGFyYW0oKSwgb3B0cyk7XG5cdFx0fSxcblxuXHRcdC8qXG5cdFx0ICogRG9jdW1lbnRlZCBpbiBkb2NzL2FwaWRvYy9jb250cm9sbGVyLmpzXG5cdFx0ICovXG5cdFx0VUk6IHtcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oYXBpTmFtZSwgb3B0cykge1xuXHRcdFx0XHRyZXR1cm4gQWxsb3kuVUkuY3JlYXRlKGdldENvbnRyb2xsZXJQYXJhbSgpLCBhcGlOYW1lLCBvcHRzKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCBhZGRDbGFzc1xuXHRcdCAqIEFkZHMgYSBUU1MgY2xhc3MgdG8gdGhlIHNwZWNpZmllZCB2aWV3IG9iamVjdC5cblx0XHQgKlxuXHRcdCAqIFlvdSBjYW4gYXBwbHkgYWRkaXRpb25hbCBzdHlsZXMgd2l0aCB0aGUgYG9wdHNgIHBhcmFtZXRlci4gVG8gdXNlIHRoaXMgbWV0aG9kXG5cdFx0ICogZWZmZWN0aXZlbHkgeW91IG1heSBuZWVkIHRvIGVuYWJsZSBhdXRvc3R5bGluZ1xuXHRcdCAqIG9uIHRoZSB0YXJnZXQgWE1MIHZpZXcuIFNlZSBbQXV0b3N0eWxlXSgjIS9ndWlkZS9EeW5hbWljX1N0eWxlcy1zZWN0aW9uLTM3NTMwNDE1X0R5bmFtaWNTdHlsZXMtQXV0b3N0eWxlKVxuXHRcdCAqIGluIHRoZSBBbGxveSBkZXZlbG9wZXIgZ3VpZGUuXG5cdFx0ICogIyMjIyBFeGFtcGxlXG5cdFx0ICogVGhlIGZvbGxvd2luZyBhZGRzIHRoZSBUU1MgY2xhc3NlcyBcIi5yZWRiZ1wiIGFuZCBcIi5iaWdnZXJcIiB0byBhIHtAbGluayBUaXRhbml1bS5VSS5MYWJlbH1cblx0XHQgKiBvYmplY3QgcHJveHkgYGxhYmVsMWAsIGFuZCBhbHNvIHNldHMgdGhlIGxhYmVsJ3MgYHRleHRgIHByb3BlcnR5IHRvIFwiQ2FuY2VsXCIuXG5cblx0Ly8gaW5kZXguanNcblx0JC5hZGRDbGFzcygkLmxhYmVsMSwgJ3JlZGJnIGJpZ2dlcicsIHt0ZXh0OiBcIkNhbmNlbFwifSk7XG5cblRoZSAncmVkYmcnIGFuZCAnYmlnZ2VyJyBjbGFzc2VzIGFyZSBzaG93biBiZWxvdzpcblxuXHQvLyBpbmRleC50c3Ncblx0XCIucmVkYmdcIiA6IHtcblx0XHRjb2xvcjogJ3JlZCdcblx0fVxuXHRcIi5iaWdnZXJcIjoge1xuXHRcdGZvbnQgOiB7XG5cdFx0ICAgZm9udFNpemU6ICczNidcblx0XHR9XG5cdH1cblxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm94eSBWaWV3IG9iamVjdCB0byB3aGljaCB0byBhZGQgY2xhc3MoZXMpLlxuXHRcdCAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPi9TdHJpbmd9IGNsYXNzZXMgQXJyYXkgb3Igc3BhY2Utc2VwYXJhdGVkIGxpc3Qgb2YgY2xhc3NlcyB0byBhcHBseS5cblx0XHQgKiBAcGFyYW0ge0RpY3Rpb25hcnl9IFtvcHRzXSBEaWN0aW9uYXJ5IG9mIHByb3BlcnRpZXMgdG8gYXBwbHkgYWZ0ZXIgY2xhc3NlcyBoYXZlIGJlZW4gYWRkZWQuXG5cdFx0ICogQHNpbmNlIDEuMi4wXG5cdFx0ICovXG5cdFx0YWRkQ2xhc3M6IGZ1bmN0aW9uKHByb3h5LCBjbGFzc2VzLCBvcHRzKSB7XG5cdFx0XHRyZXR1cm4gQWxsb3kuYWRkQ2xhc3MoZ2V0Q29udHJvbGxlclBhcmFtKCksIHByb3h5LCBjbGFzc2VzLCBvcHRzKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCByZW1vdmVDbGFzc1xuXHRcdCAqIFJlbW92ZXMgYSBUU1MgY2xhc3MgZnJvbSB0aGUgc3BlY2lmaWVkIHZpZXcgb2JqZWN0LlxuXHRcdCAqXG5cdFx0ICogWW91IGNhbiBhcHBseSBhZGRpdGlvbmFsIHN0eWxlcyBhZnRlciB0aGUgcmVtb3ZhbCB3aXRoIHRoZSBgb3B0c2AgcGFyYW1ldGVyLlxuXHRcdCAqIFRvIHVzZSB0aGlzIG1ldGhvZCBlZmZlY3RpdmVseSB5b3UgbWF5IG5lZWQgdG8gZW5hYmxlIGF1dG9zdHlsaW5nXG5cdFx0ICogb24gdGhlIHRhcmdldCBYTUwgdmlldy4gU2VlIFtBdXRvc3R5bGVdKCMhL2d1aWRlL0R5bmFtaWNfU3R5bGVzLXNlY3Rpb24tMzc1MzA0MTVfRHluYW1pY1N0eWxlcy1BdXRvc3R5bGUpXG5cdFx0ICogaW4gdGhlIEFsbG95IGRldmVsb3BlciBndWlkZS5cblx0XHQgKiAjIyMjIEV4YW1wbGVcblx0XHQgKiBUaGUgZm9sbG93aW5nIHJlbW92ZXMgdGhlIFwicmVkYmdcIiBhbmQgXCJiaWdnZXJcIiBUU1MgY2xhc3NlcyBmcm9tIGEge0BsaW5rIFRpdGFuaXVtLlVJLkxhYmVsfVxuXHRcdCAqIG9iamVjdCBwcm94eSBgbGFiZWwxYCwgYW5kIGFsc28gc2V0cyB0aGUgbGFiZWwncyBgdGV4dGAgcHJvcGVydHkgdG8gXCIuLi5cIi5cblxuXHQkLnJlbW92ZUNsYXNzKCQubGFiZWwxLCAncmVkYmcgYmlnZ2VyJywge3RleHQ6IFwiLi4uXCJ9KTtcblxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm94eSBWaWV3IG9iamVjdCBmcm9tIHdoaWNoIHRvIHJlbW92ZSBjbGFzcyhlcykuXG5cdFx0ICogQHBhcmFtIHtBcnJheTxTdHJpbmc+L1N0cmluZ30gY2xhc3NlcyBBcnJheSBvciBzcGFjZS1zZXBhcmF0ZWQgbGlzdCBvZiBjbGFzc2VzIHRvIHJlbW92ZS5cblx0XHQgKiBAcGFyYW0ge0RpY3Rpb25hcnl9IFtvcHRzXSBEaWN0aW9uYXJ5IG9mIHByb3BlcnRpZXMgdG8gYXBwbHkgYWZ0ZXIgdGhlIGNsYXNzIHJlbW92YWwuXG5cdFx0ICogQHNpbmNlIDEuMi4wXG5cdFx0ICovXG5cdFx0cmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKHByb3h5LCBjbGFzc2VzLCBvcHRzKSB7XG5cdFx0XHRyZXR1cm4gQWxsb3kucmVtb3ZlQ2xhc3MoZ2V0Q29udHJvbGxlclBhcmFtKCksIHByb3h5LCBjbGFzc2VzLCBvcHRzKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCByZXNldENsYXNzXG5cdFx0ICogU2V0cyB0aGUgYXJyYXkgb2YgVFNTIGNsYXNzZXMgZm9yIHRoZSB0YXJnZXQgVmlldyBvYmplY3QsIGFkZGluZyB0aGUgY2xhc3NlcyBzcGVjaWZpZWQgYW5kXG5cdFx0ICogcmVtb3ZpbmcgYW55IGFwcGxpZWQgY2xhc3NlcyB0aGF0IGFyZSBub3Qgc3BlY2lmaWVkLlxuXHRcdCAqXG5cdFx0ICogWW91IGNhbiBhcHBseSBjbGFzc2VzIG9yIHN0eWxlcyBhZnRlciB0aGUgcmVzZXQgdXNpbmcgdGhlIGBjbGFzc2VzYCBvciBgb3B0c2AgcGFyYW1ldGVycy5cblx0XHQgKiBUbyB1c2UgdGhpcyBtZXRob2QgZWZmZWN0aXZlbHkgeW91IG1heSBuZWVkIHRvIGVuYWJsZSBhdXRvc3R5bGluZ1xuXHRcdCAqIG9uIHRoZSB0YXJnZXQgWE1MIHZpZXcuIFNlZSBbQXV0b3N0eWxlXSgjIS9ndWlkZS9EeW5hbWljX1N0eWxlcy1zZWN0aW9uLTM3NTMwNDE1X0R5bmFtaWNTdHlsZXMtQXV0b3N0eWxlKVxuXHRcdCAqIGluIHRoZSBBbGxveSBkZXZlbG9wZXIgZ3VpZGUuXG5cblx0XHQgKiAjIyMjIEV4YW1wbGVcblx0XHQgKiBUaGUgZm9sbG93aW5nIHJlbW92ZXMgYWxsIHByZXZpb3VzbHkgYXBwbGllZCBzdHlsZXMgb24gYGxhYmVsMWAgYW5kIHRoZW4gYXBwbGllc1xuXHRcdCAqIHRoZSBUU1MgY2xhc3MgJ25vLXN0eWxlJy5cblxuXHQkLnJlc2V0Q2xhc3MoJC5sYWJlbDEsICduby1zdHlsZScpO1xuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm94eSBWaWV3IG9iamVjdCB0byByZXNldC5cblx0XHQgKiBAcGFyYW0ge0FycmF5PFN0cmluZz4vU3RyaW5nfSBbY2xhc3Nlc10gQXJyYXkgb3Igc3BhY2Utc2VwYXJhdGVkIGxpc3Qgb2YgY2xhc3NlcyB0byBhcHBseSBhZnRlciB0aGUgcmVzZXQuXG5cdFx0ICogQHBhcmFtIHtEaWN0aW9uYXJ5fSBbb3B0c10gRGljdGlvbmFyeSBvZiBwcm9wZXJ0aWVzIHRvIGFwcGx5IGFmdGVyIHRoZSByZXNldC5cblx0XHQgKiBAc2luY2UgMS4yLjBcblx0XHQgKi9cblx0XHRyZXNldENsYXNzOiBmdW5jdGlvbihwcm94eSwgY2xhc3Nlcywgb3B0cykge1xuXHRcdFx0cmV0dXJuIEFsbG95LnJlc2V0Q2xhc3MoZ2V0Q29udHJvbGxlclBhcmFtKCksIHByb3h5LCBjbGFzc2VzLCBvcHRzKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCB1cGRhdGVWaWV3c1xuXHRcdCAqIEFwcGxpZXMgYSBzZXQgb2YgcHJvcGVydGllcyB0byB2aWV3IGVsZW1lbnRzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNvbnRyb2xsZXIuXG5cdFx0ICogVGhpcyBtZXRob2QgaXMgdXNlZnVsIGZvciBzZXR0aW5nIHByb3BlcnRpZXMgb24gcmVwZWF0ZWQgZWxlbWVudHMgc3VjaCBhc1xuXHRcdCAqIHtAbGluayBUaXRhbml1bS5VSS5UYWJsZVZpZXdSb3cgVGFibGVWaWV3Um93fSBvYmplY3RzLCByYXRoZXIgdGhhbiBuZWVkaW5nIHRvIGhhdmUgYSBjb250cm9sbGVyXG5cdFx0ICogZm9yIHRob3NlIGNoaWxkIGNvbnRyb2xsZXJzLlxuXHRcdCAqICMjIyMgRXhhbXBsZVxuXHRcdCAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSB1c2VzIHRoaXMgbWV0aG9kIHRvIHVwZGF0ZSBhIExhYmVsIGluc2lkZSBhIFRhYmxlVmlld1JvdyBvYmplY3Rcblx0XHQgKiBiZWZvcmUgYWRkaW5nIGl0IHRvIGEgVGFibGVWaWV3LlxuXG5cdFx0ICogVmlldy1jb250cm9sbGVyIGZpbGU6IGNvbnRyb2xsZXJzL2luZGV4LmpzXG5cblx0Zm9yICh2YXIgaT0wOyBpIDwgMTA7IGkrKykge1xuXHQgIHZhciByb3cgPSBBbGxveS5jcmVhdGVDb250cm9sbGVyKFwidGFibGVyb3dcIik7XG5cdCAgcm93LnVwZGF0ZVZpZXdzKHtcblx0ICBcdFwiI3RoZUxhYmVsXCI6IHtcblx0ICBcdFx0dGV4dDogXCJJIGFtIHJvdyAjXCIgKyBpXG5cdCAgXHR9XG5cdCAgfSk7XG5cdCAgJC50YWJsZVZpZXcuYXBwZW5kUm93KHJvdy5nZXRWaWV3KCkpO1xuXHR9O1xuXG5cdFx0XHQgKiBYTUwgdmlldzogdmlld3MvdGFibGVyb3cueG1sXG5cblx0PEFsbG95PlxuXHRcdDxUYWJsZVZpZXdSb3c+XG5cdFx0XHQ8TGFiZWwgaWQ9XCJ0aGVMYWJlbFwiPjwvTGFiZWw+XG5cdFx0PC9UYWJsZVZpZXdSb3c+XG5cdDwvQWxsb3k+XG5cblx0XHRcdCAqIFhNTCB2aWV3OiB2aWV3cy9pbmRleC54bWxcblxuXHQ8VGFibGVWaWV3IGlkPVwidGFibGVWaWV3XCI+XG5cdDwvVGFibGVWaWV3PlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBhcmdzIEFuIG9iamVjdCB3aG9zZSBrZXlzIGFyZSB0aGUgSURzIChpbiBmb3JtICcjaWQnKSBvZiB2aWV3cyB0byB3aGljaCB0aGUgc3R5bGVzIHdpbGwgYmUgYXBwbGllZC5cblx0XHQgKiBAc2luY2UgMS40LjBcblxuXHRcdCAqL1xuXHRcdHVwZGF0ZVZpZXdzOiBmdW5jdGlvbihhcmdzKSB7XG5cdFx0XHR2YXIgdmlld3MgPSB0aGlzLmdldFZpZXdzKCk7XG5cdFx0XHRpZiAoXy5pc09iamVjdChhcmdzKSkge1xuXHRcdFx0XHRfLmVhY2goXy5rZXlzKGFyZ3MpLCBmdW5jdGlvbihrZXkpIHtcblx0XHRcdFx0XHR2YXIgZWxlbSA9IHZpZXdzW2tleS5zdWJzdHJpbmcoMSldO1xuXHRcdFx0XHRcdGlmIChrZXkuaW5kZXhPZignIycpID09PSAwICYmIGtleSAhPT0gJyMnICYmIF8uaXNPYmplY3QoZWxlbSkgJiYgdHlwZW9mIGVsZW0uYXBwbHlQcm9wZXJ0aWVzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHQvLyBhcHBseSB0aGUgcHJvcGVydGllcyBidXQgbWFrZSBzdXJlIHdlJ3JlIGFwcGx5aW5nIHRoZW0gdG8gYSBUaS5VSSBvYmplY3QgKG5vdCBhIGNvbnRyb2xsZXIpXG5cdFx0XHRcdFx0XHRlbGVtLmFwcGx5UHJvcGVydGllcyhhcmdzW2tleV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCBhZGRMaXN0ZW5lclxuXHRcdCAqIEFkZHMgYSB0cmFja2VkIGV2ZW50IGxpc3RlbmVycyB0byBhIHZpZXcgcHJveHkgb2JqZWN0LlxuXHRcdCAqIEJ5IGRlZmF1bHQsIGFueSBldmVudCBsaXN0ZW5lciBkZWNsYXJlZCBpbiBYTUwgaXMgdHJhY2tlZCBieSBBbGxveS5cblx0XHQgKlxuXHRcdCAqICMjIyMgRXhhbXBsZVxuXHRcdCAqIEFkZCBhbiBldmVudCB0byB0aGUgdHJhY2tpbmcgdGFyZ2V0LlxuXG5cdCQuYWRkTGlzdGVuZXIoJC5hVmlldywgJ2NsaWNrJywgb25DbGljayk7XG5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJveHkgUHJveHkgdmlldyBvYmplY3QgdG8gbGlzdGVuIHRvLlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIE5hbWUgb2YgdGhlIGV2ZW50LlxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIHRvIGludm9rZSB3aGVuIHRoZSBldmVudCBpcyBmaXJlZC5cblx0XHQgKiBAcmV0dXJucyB7U3RyaW5nfSBJRCBhdHRyaWJ1dGUgb2YgdGhlIHZpZXcgb2JqZWN0LiAgSWYgb25lIGRvZXMgbm90IGV4aXN0LCBBbGxveSB3aWxsIGNyZWF0ZSBhIHVuaXF1ZSBJRC5cblx0XHQgKiBAc2luY2UgMS43LjBcblx0XHQgKi9cblx0XHRhZGRMaXN0ZW5lcjogZnVuY3Rpb24ocHJveHksIHR5cGUsIGNhbGxiYWNrKSB7XG5cdFx0XHRpZiAoIXByb3h5LmlkKSB7XG5cdFx0XHRcdHByb3h5LmlkID0gXy51bmlxdWVJZCgnX190cmFja0lkJyk7XG5cblx0XHRcdFx0aWYgKF8uaGFzKHRoaXMuX192aWV3cywgcHJveHkuaWQpKSB7XG5cdFx0XHRcdFx0VGkuQVBJLmVycm9yKCckLmFkZExpc3RlbmVyOiAnICsgcHJveHkuaWQgKyAnIHdhcyBjb25mbGljdC4nKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cHJveHkuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjayk7XG5cdFx0XHR0aGlzLl9fZXZlbnRzLnB1c2goe1xuXHRcdFx0XHRpZDogcHJveHkuaWQsXG5cdFx0XHRcdHZpZXc6IHByb3h5LFxuXHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRoYW5kbGVyOiBjYWxsYmFja1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBwcm94eS5pZDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCBnZXRMaXN0ZW5lclxuXHRcdCAqIEdldHMgYWxsIHRoZSB0cmFja2VkIGV2ZW50IGxpc3RlbmVycyBvZiB0aGUgdmlldy1jb250cm9sbGVyIG9yXG5cdFx0ICogb25seSB0aGUgb25lcyBzcGVjaWZpZWQgYnkgdGhlIHBhcmFtZXRlcnMuICBQYXNzaW5nIG5vIHBhcmFtZXRlcnMsXG5cdFx0ICogcmV0cmlldmVzIGFsbCB0cmFja2VkIGV2ZW50IGxpc3RlbmVycy4gU2V0IGEgcGFyYW1ldGVyIHRvIGBudWxsYFxuXHRcdCAqIGlmIHlvdSBkbyBub3Qgd2FudCB0byByZXN0cmljdCB0aGUgbWF0Y2ggdG8gdGhhdCBwYXJhbWV0ZXIuXG5cdFx0ICpcblx0XHQgKiAjIyMjIEV4YW1wbGVcblx0XHQgKiBHZXQgYWxsIGV2ZW50cyBib3VuZCB0byB0aGUgdmlldy1jb250cm9sbGVyLlxuXG5cdHZhciBsaXN0ZW5lciA9ICQuZ2V0TGlzdGVuZXIoKTtcblxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBbcHJveHldIFByb3h5IHZpZXcgb2JqZWN0LlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBbdHlwZV0gTmFtZSBvZiB0aGUgZXZlbnQuXG5cdFx0ICogQHJldHVybnMge0FycmF5PFRyYWNrZWRFdmVudExpc3RlbmVyPn0gTGlzdCBvZiB0cmFja2VkIGV2ZW50IGxpc3RlbmVycy5cblx0XHQgKiBAc2luY2UgMS43LjBcblx0XHQgKi9cblxuXHRcdGdldExpc3RlbmVyOiBmdW5jdGlvbihwcm94eSwgdHlwZSkge1xuXHRcdFx0cmV0dXJuIF8uZmlsdGVyKHRoaXMuX19ldmVudHMsIGZ1bmN0aW9uKGV2ZW50LCBpbmRleCkge1xuXHRcdFx0XHRpZiAoKCFwcm94eSB8fCBwcm94eS5pZCA9PT0gZXZlbnQuaWQpICYmXG5cdFx0XHRcdFx0KCF0eXBlIHx8IHR5cGUgPT09IGV2ZW50LnR5cGUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQG1ldGhvZCByZW1vdmVMaXN0ZW5lclxuXHRcdCAqIFJlbW92ZXMgYWxsIHRyYWNrZWQgZXZlbnQgbGlzdGVuZXJzIG9yIG9ubHkgdGhlIG9uZXNcblx0XHQgKiBzcGVjaWZpZWQgYnkgdGhlIHBhcmFtZXRlcnMuIFBhc3Npbmcgbm8gcGFyYW1ldGVycyxcblx0XHQgKiByZW1vdmVzIGFsbCB0cmFja2VkIGV2ZW50IGxpc3RlbmVycy4gIFNldCBhIHBhcmFtZXRlciB0byBgbnVsbGBcblx0XHQgKiBpZiB5b3UgZG8gbm90IHdhbnQgdG8gcmVzdHJpY3QgdGhlIG1hdGNoIHRvIHRoYXQgcGFyYW1ldGVyLlxuXHRcdCAqXG5cdFx0ICogIyMjIyBFeGFtcGxlXG5cdFx0ICogV2hlbiB0aGUgd2luZG93IGlzIGNsb3NlZCwgcmVtb3ZlIGFsbCB0cmFja2VkIGV2ZW50IGxpc3RlbmVycy5cblxuXHQ8QWxsb3k+XG5cdFx0PFdpbmRvdyBvbk9wZW49XCJkb09wZW5cIiBvbkNsb3NlPVwiZG9DbG9zZVwiPlxuXHRcdFx0PExhYmVsIGlkPVwibGFiZWxcIiBvbkNsaWNrPVwiZG9DbGlja1wiPkhlbGxvLCB3b3JsZDwvTGFiZWw+XG5cdFx0PC9XaW5kb3c+XG5cdDwvQWxsb3k+XG5cblx0ZnVuY3Rpb24gZG9DbG9zZSgpIHtcblx0XHQkLnJlbW92ZUxpc3RlbmVyKCk7XG5cdH1cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gW3Byb3h5XSBQcm94eSB2aWV3IG9iamVjdCB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGZyb20uXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IFt0eXBlXSBOYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUuXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBDYWxsYmFjayB0byByZW1vdmUuXG5cdFx0ICogQHJldHVybnMge0FsbG95LkNvbnRyb2xsZXJ9IENvbnRyb2xsZXIgaW5zdGFuY2UuXG5cdFx0ICogQHNpbmNlIDEuNy4wXG5cdFx0ICovXG5cdFx0cmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uKHByb3h5LCB0eXBlLCBjYWxsYmFjaykge1xuXHRcdFx0dGhpcy5fX2V2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50LCBpbmRleCkge1xuXHRcdFx0XHRpZiAoKCFwcm94eSB8fCBwcm94eS5pZCA9PT0gZXZlbnQuaWQpICYmXG5cdFx0XHRcdFx0KCF0eXBlIHx8IHR5cGUgPT09IGV2ZW50LnR5cGUpICYmXG5cdFx0XHRcdFx0KCFjYWxsYmFjayB8fCBjYWxsYmFjayA9PT0gZXZlbnQuaGFuZGxlcikpIHtcblx0XHRcdFx0XHRldmVudC52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQudHlwZSwgZXZlbnQuaGFuZGxlcik7XG5cdFx0XHRcdFx0ZGVsZXRlIHNlbGYuX19ldmVudHNbaW5kZXhdO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0fSk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuIl0sInNvdXJjZVJvb3QiOiJkOlxcR0lBTlRcXHd3MlxcaW5ldHRpYmVhY29uXFxSZXNvdXJjZXNcXGFuZHJvaWRcXGFsbG95XFxjb250cm9sbGVycyJ9
