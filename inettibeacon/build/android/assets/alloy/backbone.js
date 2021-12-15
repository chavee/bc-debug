






(function(){var


















Backbone,root=this,previousBackbone=root.Backbone,slice=Array.prototype.slice,splice=Array.prototype.splice;



Backbone="undefined"==typeof exports?root.Backbone={}:exports,



Backbone.VERSION="0.9.2";


var _=root._;
_||"undefined"==typeof require||(_=require("/alloy/underscore"));


var $=root.jQuery||root.Zepto||root.ender;






Backbone.setDomLibrary=function(lib){
$=lib;
},



Backbone.noConflict=function(){

return root.Backbone=previousBackbone,this;
},




Backbone.emulateHTTP=!1,





Backbone.emulateJSON=!1;var





eventSplitter=/\s+/,










Events=Backbone.Events={



on:function(events,callback,context){

var calls,event,node,tail,list;
if(!callback)return this;for(
events=events.split(eventSplitter),
calls=this._callbacks||(this._callbacks={});




event=events.shift();)
list=calls[event],
node=list?list.tail:{},
node.next=tail={},
node.context=context,
node.callback=callback,
calls[event]={tail:tail,next:list?list.next:node};


return this;
},




off:function(events,callback,context){
var event,calls,node,tail,cb,ctx;


if(calls=this._callbacks){
if(!(events||callback||context))

return delete this._callbacks,this;for(




events=events?events.split(eventSplitter):_.keys(calls);
event=events.shift();)


if(node=calls[event],delete calls[event],node&&(callback||context))for(

tail=node.tail;
(node=node.next)!==tail;)
cb=node.callback,
ctx=node.context,(
callback&&cb!==callback||context&&ctx!==context)&&
this.on(event,cb,ctx);




return this}
},





trigger:function(events){
var event,node,calls,tail,args,all,rest;
if(!(calls=this._callbacks))return this;for(
all=calls.all,
events=events.split(eventSplitter),
rest=slice.call(arguments,1);



event=events.shift();){
if(node=calls[event])for(
tail=node.tail;
(node=node.next)!==tail;)
node.callback.apply(node.context||this,rest);


if(node=all)for(
tail=node.tail,
args=[event].concat(rest);
(node=node.next)!==tail;)
node.callback.apply(node.context||this,args);


}

return this;
}};




Events.bind=Events.on,
Events.unbind=Events.off;






var Model=Backbone.Model=function(attributes,options){
var defaults;
attributes||(attributes={}),
options&&options.parse&&(attributes=this.parse(attributes)),(
defaults=getValue(this,"defaults"))&&(
attributes=_.extend({},defaults,attributes)),

options&&options.collection&&(this.collection=options.collection),
this.attributes={},
this._escapedAttributes={},
this.cid=_.uniqueId("c"),
this.changed={},
this._silent={},
this._pending={},
this.set(attributes,{silent:!0}),

this.changed={},
this._silent={},
this._pending={},
this._previousAttributes=_.clone(this.attributes),
this.initialize.apply(this,arguments);
};


_.extend(Model.prototype,Events,{


changed:null,



_silent:null,



_pending:null,



idAttribute:"id",



initialize:function(){},


toJSON:function(options){
return _.clone(this.attributes);
},


get:function(attr){
return this.attributes[attr];
},


escape:function(attr){
var html;
if(html=this._escapedAttributes[attr])return html;
var val=this.get(attr);
return this._escapedAttributes[attr]=_.escape(null==val?"":""+val);
},



has:function(attr){
return null!=this.get(attr);
},



set:function(key,value,options){
var attrs,attr,val;












if(_.isObject(key)||null==key?(attrs=key,options=value):(attrs={},attrs[key]=value),options||(options={}),!attrs)return this;

if(attrs instanceof Model&&(attrs=attrs.attributes),options.unset)for(attr in attrs)attrs[attr]=void 0;


if(!this._validate(attrs,options))return!1;


this.idAttribute in attrs&&(this.id=attrs[this.idAttribute]);var

changes=options.changes={},
now=this.attributes,
escaped=this._escapedAttributes,
prev=this._previousAttributes||{};


for(attr in attrs)
val=attrs[attr],(


!_.isEqual(now[attr],val)||options.unset&&_.has(now,attr))&&(
delete escaped[attr],
(options.silent?this._silent:changes)[attr]=!0),



options.unset?delete now[attr]:now[attr]=val,



_.isEqual(prev[attr],val)&&_.has(now,attr)==_.has(prev,attr)?(



delete this.changed[attr],
delete this._pending[attr]):(this.changed[attr]=val,!options.silent&&(this._pending[attr]=!0));





return options.silent||this.change(options),this;
},



unset:function(attr,options){

return(options||(options={})).unset=!0,this.set(attr,null,options);
},



clear:function(options){

return(options||(options={})).unset=!0,this.set(_.clone(this.attributes),options);
},




fetch:function(options){
options=options?_.clone(options):{};var
model=this,
success=options.success;





return options.success=function(resp,status,xhr){return!!model.set(model.parse(resp,xhr),options)&&void(success&&success(model,resp))},options.error=Backbone.wrapError(options.error,model,options),(this.sync||Backbone.sync).call(this,"read",this,options);
},




save:function(key,value,options){
var attrs,current;












if(_.isObject(key)||null==key?(attrs=key,options=value):(attrs={},attrs[key]=value),options=options?_.clone(options):{},options.wait){
if(!this._validate(attrs,options))return!1;
current=_.clone(this.attributes);
}


var silentOptions=_.extend({},options,{silent:!0});
if(attrs&&!this.set(attrs,options.wait?silentOptions:options))
return!1;var




model=this,
success=options.success;
options.success=function(resp,status,xhr){
var serverAttrs=model.parse(resp,xhr);return(
options.wait&&(
delete options.wait,
serverAttrs=_.extend(attrs||{},serverAttrs)),!!

model.set(serverAttrs,options)&&void(
success?
success(model,resp):

model.trigger("sync",model,resp,options)));

},


options.error=Backbone.wrapError(options.error,model,options);var
method=this.isNew()?"create":"update",
xhr=(this.sync||Backbone.sync).call(this,method,this,options);

return options.wait&&this.set(current,silentOptions),xhr;
},




destroy:function(options){
options=options?_.clone(options):{};var
model=this,
success=options.success,

triggerDestroy=function(){
model.trigger("destroy",model,model.collection,options);
};

if(this.isNew())

return triggerDestroy(),!1;


options.success=function(resp){
options.wait&&triggerDestroy(),
success?
success(model,resp):

model.trigger("sync",model,resp,options);

},

options.error=Backbone.wrapError(options.error,model,options);
var xhr=(this.sync||Backbone.sync).call(this,"delete",this,options);

return options.wait||triggerDestroy(),xhr;
},




url:function(){
var base=getValue(this,"urlRoot")||getValue(this.collection,"url")||urlError();return(
this.isNew()?base:
base+("/"==base.charAt(base.length-1)?"":"/")+encodeURIComponent(this.id));
},



parse:function(resp,xhr){
return resp;
},


clone:function(){
return new this.constructor(this.attributes);
},


isNew:function(){
return null==this.id;
},




change:function(options){
options||(options={});
var changing=this._changing;



for(var attr in this._changing=!0,this._silent)this._pending[attr]=!0;


var changes=_.extend({},options.changes,this._silent);

for(var attr in this._silent={},changes)
this.trigger("change:"+attr,this,this.get(attr),options);

if(changing)return this;for(;


!_.isEmpty(this._pending);){



for(var attr in this._pending={},this.trigger("change",this,options),this.changed)
this._pending[attr]||this._silent[attr]||
delete this.changed[attr];

this._previousAttributes=_.clone(this.attributes);
}


return this._changing=!1,this;
},



hasChanged:function(attr){return(
arguments.length?
_.has(this.changed,attr):!_.isEmpty(this.changed));
},







changedAttributes:function(diff){
if(!diff)return!!this.hasChanged()&&_.clone(this.changed);
var val,changed=!1,old=this._previousAttributes;
for(var attr in diff)
_.isEqual(old[attr],val=diff[attr])||(
(changed||(changed={}))[attr]=val);

return changed;
},



previous:function(attr){return(
arguments.length&&this._previousAttributes?
this._previousAttributes[attr]:null);
},



previousAttributes:function(){
return _.clone(this._previousAttributes);
},



isValid:function(){
return!this.validate(this.attributes);
},




_validate:function(attrs,options){
if(options.silent||!this.validate)return!0;
attrs=_.extend({},this.attributes,attrs);
var error=this.validate(attrs,options);return!
error||(
options&&options.error?
options.error(this,error,options):

this.trigger("error",this,error,options),!1);


}});









var Collection=Backbone.Collection=function(models,options){
options||(options={}),
options.model&&(this.model=options.model),
options.comparator&&(this.comparator=options.comparator),
this._reset(),
this.initialize.apply(this,arguments),
models&&this.reset(models,{silent:!0,parse:options.parse});
};


_.extend(Collection.prototype,Events,{



model:Model,



initialize:function(){},



toJSON:function(options){
return this.map(function(model){return model.toJSON(options)});
},



add:function(models,options){
var i,index,length,model,cid,id,cids={},ids={},dups=[];





for(options||(options={}),models=_.isArray(models)?models.slice():[models],(i=0,length=models.length);i<length;i++){
if(!(model=models[i]=this._prepareModel(models[i],options)))
throw new Error("Can't add an invalid model to a collection");



if(cid=model.cid,id=model.id,cids[cid]||this._byCid[cid]||null!=id&&(ids[id]||this._byId[id])){
dups.push(i);
continue;
}
cids[cid]=ids[id]=model;
}for(


i=dups.length;
i--;)
models.splice(dups[i],1);




for(i=0,length=models.length;i<length;i++)
(model=models[i]).on("all",this._onModelEvent,this),
this._byCid[model.cid]=model,
null!=model.id&&(this._byId[model.id]=model);








if(this.length+=length,index=null==options.at?this.models.length:options.at,splice.apply(this.models,[index,0].concat(models)),this.comparator&&this.sort({silent:!0}),options.silent)return this;
for(i=0,length=this.models.length;i<length;i++)
cids[(model=this.models[i]).cid]&&(
options.index=i,
model.trigger("add",model,this,options));

return this;
},



remove:function(models,options){
var i,l,index,model;


for(options||(options={}),models=_.isArray(models)?models.slice():[models],(i=0,l=models.length);i<l;i++)
model=this.getByCid(models[i])||this.get(models[i]),
model&&(
delete this._byId[model.id],
delete this._byCid[model.cid],
index=this.indexOf(model),
this.models.splice(index,1),
this.length--,
options.silent||(
options.index=index,
model.trigger("remove",model,this,options)),

this._removeReference(model));

return this;
},


push:function(model,options){


return model=this._prepareModel(model,options),this.add(model,options),model;
},


pop:function(options){
var model=this.at(this.length-1);

return this.remove(model,options),model;
},


unshift:function(model,options){


return model=this._prepareModel(model,options),this.add(model,_.extend({at:0},options)),model;
},


shift:function(options){
var model=this.at(0);

return this.remove(model,options),model;
},


get:function(id){return(
null==id?void 0:
this._byId[null==id.id?id:id.id]);
},


getByCid:function(cid){
return cid&&this._byCid[cid.cid||cid];
},


at:function(index){
return this.models[index];
},


where:function(attrs){return(
_.isEmpty(attrs)?[]:
this.filter(function(model){
for(var key in attrs)
if(attrs[key]!==model.get(key))return!1;

return!0;
}));
},




sort:function(options){

if(options||(options={}),!this.comparator)throw new Error("Cannot sort a set without a comparator");
var boundComparator=_.bind(this.comparator,this);






return 1==this.comparator.length?this.models=this.sortBy(boundComparator):this.models.sort(boundComparator),options.silent||this.trigger("reset",this,options),this;
},


pluck:function(attr){
return _.map(this.models,function(model){return model.get(attr)});
},




reset:function(models,options){
models||(models=[]),
options||(options={});
for(var i=0,l=this.models.length;i<l;i++)
this._removeReference(this.models[i]);




return this._reset(),this.add(models,_.extend({silent:!0},options)),options.silent||this.trigger("reset",this,options),this;
},




fetch:function(options){
options=options?_.clone(options):{},
void 0===options.parse&&(options.parse=!0);var
collection=this,
success=options.success;





return options.success=function(resp,status,xhr){collection[options.add?"add":"reset"](collection.parse(resp,xhr),options),success&&success(collection,resp)},options.error=Backbone.wrapError(options.error,collection,options),(this.sync||Backbone.sync).call(this,"read",this,options);
},




create:function(model,options){
var coll=this;


if(options=options?_.clone(options):{},model=this._prepareModel(model,options),!model)return!1;
options.wait||coll.add(model,options);
var success=options.success;









return options.success=function(nextModel,resp,xhr){options.wait&&coll.add(nextModel,options),success?success(nextModel,resp):nextModel.trigger("sync",model,resp,options)},model.save(null,options),model;
},



parse:function(resp,xhr){
return resp;
},




chain:function(){
return _(this.models).chain();
},


_reset:function(options){
this.length=0,
this.models=[],
this._byId={},
this._byCid={};
},


_prepareModel:function(model,options){

if(options||(options={}),!(model instanceof Model)){
var attrs=model;
options.collection=this,
model=new this.model(attrs,options),
model._validate(model.attributes,options)||(model=!1);
}else model.collection||(
model.collection=this);

return model;
},


_removeReference:function(model){
this==model.collection&&
delete model.collection,

model.off("all",this._onModelEvent,this);
},





_onModelEvent:function(event,model,collection,options){
("add"==event||"remove"==event)&&collection!=this||(
"destroy"==event&&
this.remove(model,options),

model&&event==="change:"+model.idAttribute&&(
delete this._byId[model.previous(model.idAttribute)],
this._byId[model.id]=model),

this.trigger.apply(this,arguments));
}});




var methods=["forEach","each","map","reduce","reduceRight","find",
"detect","filter","select","reject","every","all","some","any",
"include","contains","invoke","max","min","sortBy","sortedIndex",
"toArray","size","first","initial","rest","last","without","indexOf",
"shuffle","lastIndexOf","isEmpty","groupBy"];


_.each(methods,function(method){
Collection.prototype[method]=function(){
return _[method].apply(_,[this.models].concat(_.toArray(arguments)));
};
});var






Router=Backbone.Router=function(options){
options||(options={}),
options.routes&&(this.routes=options.routes),
this._bindRoutes(),
this.initialize.apply(this,arguments);
},



namedParam=/:\w+/g,
splatParam=/\*\w+/g,
escapeRegExp=/[-[\]{}()+?.,\\^$|#\s]/g;


_.extend(Router.prototype,Events,{



initialize:function(){},







route:function(route,name,callback){









return Backbone.history||(Backbone.history=new History),_.isRegExp(route)||(route=this._routeToRegExp(route)),callback||(callback=this[name]),Backbone.history.route(route,_.bind(function(fragment){var args=this._extractParameters(route,fragment);callback&&callback.apply(this,args),this.trigger.apply(this,["route:"+name].concat(args)),Backbone.history.trigger("route",this,name,args)},this)),this;
},


navigate:function(fragment,options){
Backbone.history.navigate(fragment,options);
},




_bindRoutes:function(){
if(this.routes){
var routes=[];
for(var route in this.routes)
routes.unshift([route,this.routes[route]]);

for(var i=0,l=routes.length;i<l;i++)
this.route(routes[i][0],routes[i][1],this[routes[i][1]])}

},



_routeToRegExp:function(route){



return route=route.replace(escapeRegExp,"\\$&").replace(namedParam,"([^/]+)").replace(splatParam,"(.*?)"),new RegExp("^"+route+"$");
},



_extractParameters:function(route,fragment){
return route.exec(fragment).slice(1);
}});var








History=Backbone.History=function(){
this.handlers=[],
_.bindAll(this,"checkUrl");
},


routeStripper=/^[#\/]/,


isExplorer=/msie [\w.]+/;


History.started=!1,


_.extend(History.prototype,Events,{



interval:50,



getHash:function(windowOverride){var
loc=windowOverride?windowOverride.location:window.location,
match=loc.href.match(/#(.*)$/);
return match?match[1]:"";
},



getFragment:function(fragment,forcePushState){
if(null==fragment)
if(this._hasPushState||forcePushState){
fragment=window.location.pathname;
var search=window.location.search;
search&&(fragment+=search);
}else
fragment=this.getHash();



return fragment.indexOf(this.options.root)||(fragment=fragment.substr(this.options.root.length)),fragment.replace(routeStripper,"");
},



start:function(options){
if(History.started)throw new Error("Backbone.history has already been started");
History.started=!0,



this.options=_.extend({},{root:"/"},this.options,options),
this._wantsHashChange=!1!==this.options.hashChange,
this._wantsPushState=!!this.options.pushState,
this._hasPushState=!!(this.options.pushState&&window.history&&window.history.pushState);var
fragment=this.getFragment(),
docMode=document.documentMode,
oldIE=isExplorer.exec(navigator.userAgent.toLowerCase())&&(!docMode||7>=docMode);

oldIE&&(
this.iframe=$("<iframe src=\"javascript:0\" tabindex=\"-1\" />").hide().appendTo("body")[0].contentWindow,
this.navigate(fragment)),




this._hasPushState?
$(window).bind("popstate",this.checkUrl):
this._wantsHashChange&&"onhashchange"in window&&!oldIE?
$(window).bind("hashchange",this.checkUrl):
this._wantsHashChange&&(
this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),




this.fragment=fragment;var
loc=window.location,
atRoot=loc.pathname==this.options.root;return(



this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!atRoot?(
this.fragment=this.getFragment(null,!0),
window.location.replace(this.options.root+"#"+this.fragment),!0):(





this._wantsPushState&&this._hasPushState&&atRoot&&loc.hash&&(
this.fragment=this.getHash().replace(routeStripper,""),
window.history.replaceState({},document.title,loc.protocol+"//"+loc.host+this.options.root+this.fragment)),


this.options.silent?void 0:
this.loadUrl()));

},



stop:function(){
$(window).unbind("popstate",this.checkUrl).unbind("hashchange",this.checkUrl),
clearInterval(this._checkUrlInterval),
History.started=!1;
},



route:function(route,callback){
this.handlers.unshift({route:route,callback:callback});
},



checkUrl:function(e){
var current=this.getFragment();return(
current==this.fragment&&this.iframe&&(current=this.getFragment(this.getHash(this.iframe))),
current!=this.fragment&&void(
this.iframe&&this.navigate(current),
this.loadUrl()||this.loadUrl(this.getHash())));
},




loadUrl:function(fragmentOverride){var
fragment=this.fragment=this.getFragment(fragmentOverride),
matched=_.any(this.handlers,function(handler){
if(handler.route.test(fragment))

return handler.callback(fragment),!0;

});
return matched;
},








navigate:function(fragment,options){
if(!History.started)return!1;
options&&!0!==options||(options={trigger:options});
var frag=(fragment||"").replace(routeStripper,"");
this.fragment==frag||(


this._hasPushState?(
0!=frag.indexOf(this.options.root)&&(frag=this.options.root+frag),
this.fragment=frag,
window.history[options.replace?"replaceState":"pushState"]({},document.title,frag)):



this._wantsHashChange?(
this.fragment=frag,
this._updateHash(window.location,frag,options.replace),
this.iframe&&frag!=this.getFragment(this.getHash(this.iframe))&&(


!options.replace&&this.iframe.document.open().close(),
this._updateHash(this.iframe.location,frag,options.replace))):





window.location.assign(this.options.root+fragment),

options.trigger&&this.loadUrl(fragment));
},



_updateHash:function(location,fragment,replace){
replace?
location.replace(location.toString().replace(/(javascript:|#).*$/,"")+"#"+fragment):

location.hash=fragment;

}});var







View=Backbone.View=function(options){
this.cid=_.uniqueId("view"),
this._configure(options||{}),
this._ensureElement(),
this.initialize.apply(this,arguments),
this.delegateEvents();
},


delegateEventSplitter=/^(\S+)\s*(.*)$/,


viewOptions=["model","collection","el","id","attributes","className","tagName"];


_.extend(View.prototype,Events,{


tagName:"div",



$:function(selector){
return this.$el.find(selector);
},



initialize:function(){},




render:function(){
return this;
},



remove:function(){

return this.$el.remove(),this;
},






make:function(tagName,attributes,content){
var el=document.createElement(tagName);


return attributes&&$(el).attr(attributes),content&&$(el).html(content),el;
},



setElement:function(element,delegate){




return this.$el&&this.undelegateEvents(),this.$el=element instanceof $?element:$(element),this.el=this.$el[0],!1!==delegate&&this.delegateEvents(),this;
},
















delegateEvents:function(events){
if(events||(events=getValue(this,"events")))

for(var key in this.undelegateEvents(),events){
var method=events[key];

if(_.isFunction(method)||(method=this[events[key]]),!method)throw new Error("Method \""+events[key]+"\" does not exist");var
match=key.match(delegateEventSplitter),
eventName=match[1],selector=match[2];
method=_.bind(method,this),
eventName+=".delegateEvents"+this.cid,
""===selector?
this.$el.bind(eventName,method):

this.$el.delegate(selector,eventName,method);

}
},




undelegateEvents:function(){
this.$el.unbind(".delegateEvents"+this.cid);
},




_configure:function(options){
this.options&&(options=_.extend({},this.options,options));
for(var
attr,i=0,l=viewOptions.length;i<l;i++)attr=viewOptions[i],
options[attr]&&(this[attr]=options[attr]);

this.options=options;
},





_ensureElement:function(){
if(!this.el){
var attrs=getValue(this,"attributes")||{};
this.id&&(attrs.id=this.id),
this.className&&(attrs["class"]=this.className),
this.setElement(this.make(this.tagName,attrs),!1);
}else
this.setElement(this.el,!1);

}});




var extend=function(protoProps,classProps){
var child=inherits(this,protoProps,classProps);

return child.extend=this.extend,child;
};


Model.extend=Collection.extend=Router.extend=View.extend=extend;





var methodMap={
create:"POST",
update:"PUT",
delete:"DELETE",
read:"GET"};

















Backbone.sync=function(method,model,options){
var type=methodMap[method];


options||(options={});


var params={type:type,dataType:"json"};




































return options.url||(params.url=getValue(model,"url")||urlError()),!options.data&&model&&("create"==method||"update"==method)&&(params.contentType="application/json",params.data=JSON.stringify(model.toJSON())),Backbone.emulateJSON&&(params.contentType="application/x-www-form-urlencoded",params.data=params.data?{model:params.data}:{}),Backbone.emulateHTTP&&("PUT"===type||"DELETE"===type)&&(Backbone.emulateJSON&&(params.data._method=type),params.type="POST",params.beforeSend=function(xhr){xhr.setRequestHeader("X-HTTP-Method-Override",type)}),"GET"===params.type||Backbone.emulateJSON||(params.processData=!1),$.ajax(_.extend(params,options));
},


Backbone.wrapError=function(onError,originalModel,options){
return function(model,resp){
resp=model===originalModel?resp:model,
onError?
onError(originalModel,resp,options):

originalModel.trigger("error",originalModel,resp,options);

};
};var





ctor=function(){},




inherits=function(parent,protoProps,staticProps){
var child;































return child=protoProps&&protoProps.hasOwnProperty("constructor")?protoProps.constructor:function(){parent.apply(this,arguments)},_.extend(child,parent),ctor.prototype=parent.prototype,child.prototype=new ctor,protoProps&&_.extend(child.prototype,protoProps),staticProps&&_.extend(child,staticProps),child.prototype.constructor=child,child.__super__=parent.prototype,child;
},



getValue=function(object,prop){return(
object&&object[prop]?
_.isFunction(object[prop])?object[prop]():object[prop]:null);
},


urlError=function(){
throw new Error("A \"url\" property or function must be specified");
};

}).call(global);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tib25lLmpzIl0sIm5hbWVzIjpbIkJhY2tib25lIiwicm9vdCIsInByZXZpb3VzQmFja2JvbmUiLCJzbGljZSIsIkFycmF5IiwicHJvdG90eXBlIiwic3BsaWNlIiwiZXhwb3J0cyIsIlZFUlNJT04iLCJfIiwicmVxdWlyZSIsIiQiLCJqUXVlcnkiLCJaZXB0byIsImVuZGVyIiwic2V0RG9tTGlicmFyeSIsImxpYiIsIm5vQ29uZmxpY3QiLCJlbXVsYXRlSFRUUCIsImVtdWxhdGVKU09OIiwiZXZlbnRTcGxpdHRlciIsIkV2ZW50cyIsIm9uIiwiZXZlbnRzIiwiY2FsbGJhY2siLCJjb250ZXh0IiwiY2FsbHMiLCJldmVudCIsIm5vZGUiLCJ0YWlsIiwibGlzdCIsInNwbGl0IiwiX2NhbGxiYWNrcyIsInNoaWZ0IiwibmV4dCIsIm9mZiIsImNiIiwiY3R4Iiwia2V5cyIsInRyaWdnZXIiLCJhcmdzIiwiYWxsIiwicmVzdCIsImNhbGwiLCJhcmd1bWVudHMiLCJhcHBseSIsImNvbmNhdCIsImJpbmQiLCJ1bmJpbmQiLCJNb2RlbCIsImF0dHJpYnV0ZXMiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJwYXJzZSIsImdldFZhbHVlIiwiZXh0ZW5kIiwiY29sbGVjdGlvbiIsIl9lc2NhcGVkQXR0cmlidXRlcyIsImNpZCIsInVuaXF1ZUlkIiwiY2hhbmdlZCIsIl9zaWxlbnQiLCJfcGVuZGluZyIsInNldCIsInNpbGVudCIsIl9wcmV2aW91c0F0dHJpYnV0ZXMiLCJjbG9uZSIsImluaXRpYWxpemUiLCJpZEF0dHJpYnV0ZSIsInRvSlNPTiIsImdldCIsImF0dHIiLCJlc2NhcGUiLCJodG1sIiwidmFsIiwiaGFzIiwia2V5IiwidmFsdWUiLCJhdHRycyIsImlzT2JqZWN0IiwidW5zZXQiLCJfdmFsaWRhdGUiLCJpZCIsImNoYW5nZXMiLCJub3ciLCJlc2NhcGVkIiwicHJldiIsImlzRXF1YWwiLCJjaGFuZ2UiLCJjbGVhciIsImZldGNoIiwibW9kZWwiLCJzdWNjZXNzIiwicmVzcCIsInN0YXR1cyIsInhociIsImVycm9yIiwid3JhcEVycm9yIiwic3luYyIsInNhdmUiLCJjdXJyZW50Iiwid2FpdCIsInNpbGVudE9wdGlvbnMiLCJzZXJ2ZXJBdHRycyIsIm1ldGhvZCIsImlzTmV3IiwiZGVzdHJveSIsInRyaWdnZXJEZXN0cm95IiwidXJsIiwiYmFzZSIsInVybEVycm9yIiwiY2hhckF0IiwibGVuZ3RoIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJjaGFuZ2luZyIsIl9jaGFuZ2luZyIsImlzRW1wdHkiLCJoYXNDaGFuZ2VkIiwiY2hhbmdlZEF0dHJpYnV0ZXMiLCJkaWZmIiwib2xkIiwicHJldmlvdXMiLCJwcmV2aW91c0F0dHJpYnV0ZXMiLCJpc1ZhbGlkIiwidmFsaWRhdGUiLCJDb2xsZWN0aW9uIiwibW9kZWxzIiwiY29tcGFyYXRvciIsIl9yZXNldCIsInJlc2V0IiwibWFwIiwiYWRkIiwiaSIsImluZGV4IiwiY2lkcyIsImlkcyIsImR1cHMiLCJpc0FycmF5IiwiX3ByZXBhcmVNb2RlbCIsIkVycm9yIiwiX2J5Q2lkIiwiX2J5SWQiLCJwdXNoIiwiX29uTW9kZWxFdmVudCIsImF0Iiwic29ydCIsInJlbW92ZSIsImwiLCJnZXRCeUNpZCIsImluZGV4T2YiLCJfcmVtb3ZlUmVmZXJlbmNlIiwicG9wIiwidW5zaGlmdCIsIndoZXJlIiwiZmlsdGVyIiwiYm91bmRDb21wYXJhdG9yIiwic29ydEJ5IiwicGx1Y2siLCJjcmVhdGUiLCJjb2xsIiwibmV4dE1vZGVsIiwiY2hhaW4iLCJtZXRob2RzIiwiZWFjaCIsInRvQXJyYXkiLCJSb3V0ZXIiLCJyb3V0ZXMiLCJfYmluZFJvdXRlcyIsIm5hbWVkUGFyYW0iLCJzcGxhdFBhcmFtIiwiZXNjYXBlUmVnRXhwIiwicm91dGUiLCJuYW1lIiwiaGlzdG9yeSIsIkhpc3RvcnkiLCJpc1JlZ0V4cCIsIl9yb3V0ZVRvUmVnRXhwIiwiZnJhZ21lbnQiLCJfZXh0cmFjdFBhcmFtZXRlcnMiLCJuYXZpZ2F0ZSIsInJlcGxhY2UiLCJSZWdFeHAiLCJleGVjIiwiaGFuZGxlcnMiLCJiaW5kQWxsIiwicm91dGVTdHJpcHBlciIsImlzRXhwbG9yZXIiLCJzdGFydGVkIiwiaW50ZXJ2YWwiLCJnZXRIYXNoIiwid2luZG93T3ZlcnJpZGUiLCJsb2MiLCJsb2NhdGlvbiIsIndpbmRvdyIsIm1hdGNoIiwiaHJlZiIsImdldEZyYWdtZW50IiwiZm9yY2VQdXNoU3RhdGUiLCJfaGFzUHVzaFN0YXRlIiwicGF0aG5hbWUiLCJzZWFyY2giLCJzdWJzdHIiLCJzdGFydCIsIl93YW50c0hhc2hDaGFuZ2UiLCJoYXNoQ2hhbmdlIiwiX3dhbnRzUHVzaFN0YXRlIiwicHVzaFN0YXRlIiwiZG9jTW9kZSIsImRvY3VtZW50IiwiZG9jdW1lbnRNb2RlIiwib2xkSUUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImlmcmFtZSIsImhpZGUiLCJhcHBlbmRUbyIsImNvbnRlbnRXaW5kb3ciLCJjaGVja1VybCIsIl9jaGVja1VybEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJhdFJvb3QiLCJoYXNoIiwicmVwbGFjZVN0YXRlIiwidGl0bGUiLCJwcm90b2NvbCIsImhvc3QiLCJsb2FkVXJsIiwic3RvcCIsImNsZWFySW50ZXJ2YWwiLCJlIiwiZnJhZ21lbnRPdmVycmlkZSIsIm1hdGNoZWQiLCJhbnkiLCJoYW5kbGVyIiwidGVzdCIsImZyYWciLCJfdXBkYXRlSGFzaCIsIm9wZW4iLCJjbG9zZSIsImFzc2lnbiIsInRvU3RyaW5nIiwiVmlldyIsIl9jb25maWd1cmUiLCJfZW5zdXJlRWxlbWVudCIsImRlbGVnYXRlRXZlbnRzIiwiZGVsZWdhdGVFdmVudFNwbGl0dGVyIiwidmlld09wdGlvbnMiLCJ0YWdOYW1lIiwic2VsZWN0b3IiLCIkZWwiLCJmaW5kIiwicmVuZGVyIiwibWFrZSIsImNvbnRlbnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRFbGVtZW50IiwiZWxlbWVudCIsImRlbGVnYXRlIiwidW5kZWxlZ2F0ZUV2ZW50cyIsImlzRnVuY3Rpb24iLCJldmVudE5hbWUiLCJjbGFzc05hbWUiLCJwcm90b1Byb3BzIiwiY2xhc3NQcm9wcyIsImNoaWxkIiwiaW5oZXJpdHMiLCJtZXRob2RNYXAiLCJ0eXBlIiwicGFyYW1zIiwiZGF0YVR5cGUiLCJkYXRhIiwiY29udGVudFR5cGUiLCJKU09OIiwic3RyaW5naWZ5IiwiX21ldGhvZCIsImJlZm9yZVNlbmQiLCJzZXRSZXF1ZXN0SGVhZGVyIiwicHJvY2Vzc0RhdGEiLCJhamF4Iiwib25FcnJvciIsIm9yaWdpbmFsTW9kZWwiLCJjdG9yIiwicGFyZW50Iiwic3RhdGljUHJvcHMiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fc3VwZXJfXyIsIm9iamVjdCIsInByb3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFPQSxDQUFDLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQlBBLFFBbkJPLENBT1BDLElBQUksQ0FBRyxJQVBBLENBV1BDLGdCQUFnQixDQUFHRCxJQUFJLENBQUNELFFBWGpCLENBY1BHLEtBQUssQ0FBR0MsS0FBSyxDQUFDQyxTQUFOLENBQWdCRixLQWRqQixDQWVQRyxNQUFNLENBQUdGLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsTUFmbEI7Ozs7QUF1QlZOLFFBdkJVLENBb0JZLFdBQW5CLFFBQU9PLENBQUFBLE9BcEJBLENBdUJDTixJQUFJLENBQUNELFFBQUwsQ0FBZ0IsRUF2QmpCLENBcUJDTyxPQXJCRDs7OztBQTJCWFAsUUFBUSxDQUFDUSxPQUFULENBQW1CLE9BM0JSOzs7QUE4QlgsR0FBSUMsQ0FBQUEsQ0FBQyxDQUFHUixJQUFJLENBQUNRLENBQWI7QUFDS0EsQ0FBRCxFQUEwQixXQUFuQixRQUFPQyxDQUFBQSxPQS9CUCxHQStCaUNELENBQUMsQ0FBR0MsT0FBTyxDQUFDLG1CQUFELENBL0I1Qzs7O0FBa0NYLEdBQUlDLENBQUFBLENBQUMsQ0FBR1YsSUFBSSxDQUFDVyxNQUFMLEVBQWVYLElBQUksQ0FBQ1ksS0FBcEIsRUFBNkJaLElBQUks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QUFBQSxLQUFKLENBQVUsa0RBQVYsQ0FBTjtBQUNBLENBNzRDVTs7QUErNENWLENBLzRDRCxFQSs0Q0dqRyxJQS80Q0gsUSIsInNvdXJjZXNDb250ZW50IjpbIi8vICAgICBCYWNrYm9uZS5qcyAwLjkuMlxuXG4vLyAgICAgKGMpIDIwMTAtMjAxMiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgSW5jLlxuLy8gICAgIEJhY2tib25lIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLy8gICAgIEZvciBhbGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbi8vICAgICBodHRwOi8vYmFja2JvbmVqcy5vcmdcblxuKGZ1bmN0aW9uKCl7XG5cbi8vIEluaXRpYWwgU2V0dXBcbi8vIC0tLS0tLS0tLS0tLS1cblxuLy8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCAoYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIGBnbG9iYWxgXG4vLyBvbiB0aGUgc2VydmVyKS5cbnZhciByb290ID0gdGhpcztcblxuLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBCYWNrYm9uZWAgdmFyaWFibGUsIHNvIHRoYXQgaXQgY2FuIGJlXG4vLyByZXN0b3JlZCBsYXRlciBvbiwgaWYgYG5vQ29uZmxpY3RgIGlzIHVzZWQuXG52YXIgcHJldmlvdXNCYWNrYm9uZSA9IHJvb3QuQmFja2JvbmU7XG5cbi8vIENyZWF0ZSBhIGxvY2FsIHJlZmVyZW5jZSB0byBzbGljZS9zcGxpY2UuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgc3BsaWNlID0gQXJyYXkucHJvdG90eXBlLnNwbGljZTtcblxuLy8gVGhlIHRvcC1sZXZlbCBuYW1lc3BhY2UuIEFsbCBwdWJsaWMgQmFja2JvbmUgY2xhc3NlcyBhbmQgbW9kdWxlcyB3aWxsXG4vLyBiZSBhdHRhY2hlZCB0byB0aGlzLiBFeHBvcnRlZCBmb3IgYm90aCBDb21tb25KUyBhbmQgdGhlIGJyb3dzZXIuXG52YXIgQmFja2JvbmU7XG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdEJhY2tib25lID0gZXhwb3J0cztcbn0gZWxzZSB7XG5cdEJhY2tib25lID0gcm9vdC5CYWNrYm9uZSA9IHt9O1xufVxuXG4vLyBDdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnkuIEtlZXAgaW4gc3luYyB3aXRoIGBwYWNrYWdlLmpzb25gLlxuQmFja2JvbmUuVkVSU0lPTiA9ICcwLjkuMic7XG5cbi8vIFJlcXVpcmUgVW5kZXJzY29yZSwgaWYgd2UncmUgb24gdGhlIHNlcnZlciwgYW5kIGl0J3Mgbm90IGFscmVhZHkgcHJlc2VudC5cbnZhciBfID0gcm9vdC5fO1xuaWYgKCFfICYmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcpKSBfID0gcmVxdWlyZSgnL2FsbG95L3VuZGVyc2NvcmUnKTtcblxuLy8gRm9yIEJhY2tib25lJ3MgcHVycG9zZXMsIGpRdWVyeSwgWmVwdG8sIG9yIEVuZGVyIG93bnMgdGhlIGAkYCB2YXJpYWJsZS5cbnZhciAkID0gcm9vdC5qUXVlcnkgfHwgcm9vdC5aZXB0byB8fCByb290LmVuZGVyO1xuXG4vLyBTZXQgdGhlIEphdmFTY3JpcHQgbGlicmFyeSB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgRE9NIG1hbmlwdWxhdGlvbiBhbmRcbi8vIEFqYXggY2FsbHMgKGEuay5hLiB0aGUgYCRgIHZhcmlhYmxlKS4gQnkgZGVmYXVsdCBCYWNrYm9uZSB3aWxsIHVzZTogalF1ZXJ5LFxuLy8gWmVwdG8sIG9yIEVuZGVyOyBidXQgdGhlIGBzZXREb21MaWJyYXJ5KClgIG1ldGhvZCBsZXRzIHlvdSBpbmplY3QgYW5cbi8vIGFsdGVybmF0ZSBKYXZhU2NyaXB0IGxpYnJhcnkgKG9yIGEgbW9jayBsaWJyYXJ5IGZvciB0ZXN0aW5nIHlvdXIgdmlld3Ncbi8vIG91dHNpZGUgb2YgYSBicm93c2VyKS5cbkJhY2tib25lLnNldERvbUxpYnJhcnkgPSBmdW5jdGlvbihsaWIpIHtcblx0JCA9IGxpYjtcbn07XG5cbi8vIFJ1bnMgQmFja2JvbmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYEJhY2tib25lYCB2YXJpYWJsZVxuLy8gdG8gaXRzIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoaXMgQmFja2JvbmUgb2JqZWN0LlxuQmFja2JvbmUubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuXHRyb290LkJhY2tib25lID0gcHJldmlvdXNCYWNrYm9uZTtcblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vLyBUdXJuIG9uIGBlbXVsYXRlSFRUUGAgdG8gc3VwcG9ydCBsZWdhY3kgSFRUUCBzZXJ2ZXJzLiBTZXR0aW5nIHRoaXMgb3B0aW9uXG4vLyB3aWxsIGZha2UgYFwiUFVUXCJgIGFuZCBgXCJERUxFVEVcImAgcmVxdWVzdHMgdmlhIHRoZSBgX21ldGhvZGAgcGFyYW1ldGVyIGFuZFxuLy8gc2V0IGEgYFgtSHR0cC1NZXRob2QtT3ZlcnJpZGVgIGhlYWRlci5cbkJhY2tib25lLmVtdWxhdGVIVFRQID0gZmFsc2U7XG5cbi8vIFR1cm4gb24gYGVtdWxhdGVKU09OYCB0byBzdXBwb3J0IGxlZ2FjeSBzZXJ2ZXJzIHRoYXQgY2FuJ3QgZGVhbCB3aXRoIGRpcmVjdFxuLy8gYGFwcGxpY2F0aW9uL2pzb25gIHJlcXVlc3RzIC4uLiB3aWxsIGVuY29kZSB0aGUgYm9keSBhc1xuLy8gYGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZGAgaW5zdGVhZCBhbmQgd2lsbCBzZW5kIHRoZSBtb2RlbCBpbiBhXG4vLyBmb3JtIHBhcmFtIG5hbWVkIGBtb2RlbGAuXG5CYWNrYm9uZS5lbXVsYXRlSlNPTiA9IGZhbHNlO1xuXG4vLyBCYWNrYm9uZS5FdmVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIHNwbGl0IGV2ZW50IHN0cmluZ3NcbnZhciBldmVudFNwbGl0dGVyID0gL1xccysvO1xuXG4vLyBBIG1vZHVsZSB0aGF0IGNhbiBiZSBtaXhlZCBpbiB0byAqYW55IG9iamVjdCogaW4gb3JkZXIgdG8gcHJvdmlkZSBpdCB3aXRoXG4vLyBjdXN0b20gZXZlbnRzLiBZb3UgbWF5IGJpbmQgd2l0aCBgb25gIG9yIHJlbW92ZSB3aXRoIGBvZmZgIGNhbGxiYWNrIGZ1bmN0aW9uc1xuLy8gdG8gYW4gZXZlbnQ7IHRyaWdnZXJgLWluZyBhbiBldmVudCBmaXJlcyBhbGwgY2FsbGJhY2tzIGluIHN1Y2Nlc3Npb24uXG4vL1xuLy8gICAgIHZhciBvYmplY3QgPSB7fTtcbi8vICAgICBfLmV4dGVuZChvYmplY3QsIEJhY2tib25lLkV2ZW50cyk7XG4vLyAgICAgb2JqZWN0Lm9uKCdleHBhbmQnLCBmdW5jdGlvbigpeyBhbGVydCgnZXhwYW5kZWQnKTsgfSk7XG4vLyAgICAgb2JqZWN0LnRyaWdnZXIoJ2V4cGFuZCcpO1xuLy9cbnZhciBFdmVudHMgPSBCYWNrYm9uZS5FdmVudHMgPSB7XG5cblx0Ly8gQmluZCBvbmUgb3IgbW9yZSBzcGFjZSBzZXBhcmF0ZWQgZXZlbnRzLCBgZXZlbnRzYCwgdG8gYSBgY2FsbGJhY2tgXG5cdC8vIGZ1bmN0aW9uLiBQYXNzaW5nIGBcImFsbFwiYCB3aWxsIGJpbmQgdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG5cdG9uOiBmdW5jdGlvbihldmVudHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG5cblx0dmFyIGNhbGxzLCBldmVudCwgbm9kZSwgdGFpbCwgbGlzdDtcblx0aWYgKCFjYWxsYmFjaykgcmV0dXJuIHRoaXM7XG5cdGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcblx0Y2FsbHMgPSB0aGlzLl9jYWxsYmFja3MgfHwgKHRoaXMuX2NhbGxiYWNrcyA9IHt9KTtcblxuXHQvLyBDcmVhdGUgYW4gaW1tdXRhYmxlIGNhbGxiYWNrIGxpc3QsIGFsbG93aW5nIHRyYXZlcnNhbCBkdXJpbmdcblx0Ly8gbW9kaWZpY2F0aW9uLiAgVGhlIHRhaWwgaXMgYW4gZW1wdHkgb2JqZWN0IHRoYXQgd2lsbCBhbHdheXMgYmUgdXNlZFxuXHQvLyBhcyB0aGUgbmV4dCBub2RlLlxuXHR3aGlsZSAoZXZlbnQgPSBldmVudHMuc2hpZnQoKSkge1xuXHRcdGxpc3QgPSBjYWxsc1tldmVudF07XG5cdFx0bm9kZSA9IGxpc3QgPyBsaXN0LnRhaWwgOiB7fTtcblx0XHRub2RlLm5leHQgPSB0YWlsID0ge307XG5cdFx0bm9kZS5jb250ZXh0ID0gY29udGV4dDtcblx0XHRub2RlLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0Y2FsbHNbZXZlbnRdID0ge3RhaWw6IHRhaWwsIG5leHQ6IGxpc3QgPyBsaXN0Lm5leHQgOiBub2RlfTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIFJlbW92ZSBvbmUgb3IgbWFueSBjYWxsYmFja3MuIElmIGBjb250ZXh0YCBpcyBudWxsLCByZW1vdmVzIGFsbCBjYWxsYmFja3Ncblx0Ly8gd2l0aCB0aGF0IGZ1bmN0aW9uLiBJZiBgY2FsbGJhY2tgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrcyBmb3IgdGhlXG5cdC8vIGV2ZW50LiBJZiBgZXZlbnRzYCBpcyBudWxsLCByZW1vdmVzIGFsbCBib3VuZCBjYWxsYmFja3MgZm9yIGFsbCBldmVudHMuXG5cdG9mZjogZnVuY3Rpb24oZXZlbnRzLCBjYWxsYmFjaywgY29udGV4dCkge1xuXHR2YXIgZXZlbnQsIGNhbGxzLCBub2RlLCB0YWlsLCBjYiwgY3R4O1xuXG5cdC8vIE5vIGV2ZW50cywgb3IgcmVtb3ZpbmcgKmFsbCogZXZlbnRzLlxuXHRpZiAoIShjYWxscyA9IHRoaXMuX2NhbGxiYWNrcykpIHJldHVybjtcblx0aWYgKCEoZXZlbnRzIHx8IGNhbGxiYWNrIHx8IGNvbnRleHQpKSB7XG5cdFx0ZGVsZXRlIHRoaXMuX2NhbGxiYWNrcztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vIExvb3AgdGhyb3VnaCB0aGUgbGlzdGVkIGV2ZW50cyBhbmQgY29udGV4dHMsIHNwbGljaW5nIHRoZW0gb3V0IG9mIHRoZVxuXHQvLyBsaW5rZWQgbGlzdCBvZiBjYWxsYmFja3MgaWYgYXBwcm9wcmlhdGUuXG5cdGV2ZW50cyA9IGV2ZW50cyA/IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKSA6IF8ua2V5cyhjYWxscyk7XG5cdHdoaWxlIChldmVudCA9IGV2ZW50cy5zaGlmdCgpKSB7XG5cdFx0bm9kZSA9IGNhbGxzW2V2ZW50XTtcblx0XHRkZWxldGUgY2FsbHNbZXZlbnRdO1xuXHRcdGlmICghbm9kZSB8fCAhKGNhbGxiYWNrIHx8IGNvbnRleHQpKSBjb250aW51ZTtcblx0XHQvLyBDcmVhdGUgYSBuZXcgbGlzdCwgb21pdHRpbmcgdGhlIGluZGljYXRlZCBjYWxsYmFja3MuXG5cdFx0dGFpbCA9IG5vZGUudGFpbDtcblx0XHR3aGlsZSAoKG5vZGUgPSBub2RlLm5leHQpICE9PSB0YWlsKSB7XG5cdFx0Y2IgPSBub2RlLmNhbGxiYWNrO1xuXHRcdGN0eCA9IG5vZGUuY29udGV4dDtcblx0XHRpZiAoKGNhbGxiYWNrICYmIGNiICE9PSBjYWxsYmFjaykgfHwgKGNvbnRleHQgJiYgY3R4ICE9PSBjb250ZXh0KSkge1xuXHRcdFx0dGhpcy5vbihldmVudCwgY2IsIGN0eCk7XG5cdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQ2FsbGJhY2tzIGFyZVxuXHQvLyBwYXNzZWQgdGhlIHNhbWUgYXJndW1lbnRzIGFzIGB0cmlnZ2VyYCBpcywgYXBhcnQgZnJvbSB0aGUgZXZlbnQgbmFtZVxuXHQvLyAodW5sZXNzIHlvdSdyZSBsaXN0ZW5pbmcgb24gYFwiYWxsXCJgLCB3aGljaCB3aWxsIGNhdXNlIHlvdXIgY2FsbGJhY2sgdG9cblx0Ly8gcmVjZWl2ZSB0aGUgdHJ1ZSBuYW1lIG9mIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgYXJndW1lbnQpLlxuXHR0cmlnZ2VyOiBmdW5jdGlvbihldmVudHMpIHtcblx0dmFyIGV2ZW50LCBub2RlLCBjYWxscywgdGFpbCwgYXJncywgYWxsLCByZXN0O1xuXHRpZiAoIShjYWxscyA9IHRoaXMuX2NhbGxiYWNrcykpIHJldHVybiB0aGlzO1xuXHRhbGwgPSBjYWxscy5hbGw7XG5cdGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcblx0cmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuXHQvLyBGb3IgZWFjaCBldmVudCwgd2FsayB0aHJvdWdoIHRoZSBsaW5rZWQgbGlzdCBvZiBjYWxsYmFja3MgdHdpY2UsXG5cdC8vIGZpcnN0IHRvIHRyaWdnZXIgdGhlIGV2ZW50LCB0aGVuIHRvIHRyaWdnZXIgYW55IGBcImFsbFwiYCBjYWxsYmFja3MuXG5cdHdoaWxlIChldmVudCA9IGV2ZW50cy5zaGlmdCgpKSB7XG5cdFx0aWYgKG5vZGUgPSBjYWxsc1tldmVudF0pIHtcblx0XHR0YWlsID0gbm9kZS50YWlsO1xuXHRcdHdoaWxlICgobm9kZSA9IG5vZGUubmV4dCkgIT09IHRhaWwpIHtcblx0XHRcdG5vZGUuY2FsbGJhY2suYXBwbHkobm9kZS5jb250ZXh0IHx8IHRoaXMsIHJlc3QpO1xuXHRcdH1cblx0XHR9XG5cdFx0aWYgKG5vZGUgPSBhbGwpIHtcblx0XHR0YWlsID0gbm9kZS50YWlsO1xuXHRcdGFyZ3MgPSBbZXZlbnRdLmNvbmNhdChyZXN0KTtcblx0XHR3aGlsZSAoKG5vZGUgPSBub2RlLm5leHQpICE9PSB0YWlsKSB7XG5cdFx0XHRub2RlLmNhbGxiYWNrLmFwcGx5KG5vZGUuY29udGV4dCB8fCB0aGlzLCBhcmdzKTtcblx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG5cdH1cblxufTtcblxuLy8gQWxpYXNlcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG5FdmVudHMuYmluZCAgID0gRXZlbnRzLm9uO1xuRXZlbnRzLnVuYmluZCA9IEV2ZW50cy5vZmY7XG5cbi8vIEJhY2tib25lLk1vZGVsXG4vLyAtLS0tLS0tLS0tLS0tLVxuXG4vLyBDcmVhdGUgYSBuZXcgbW9kZWwsIHdpdGggZGVmaW5lZCBhdHRyaWJ1dGVzLiBBIGNsaWVudCBpZCAoYGNpZGApXG4vLyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBhbmQgYXNzaWduZWQgZm9yIHlvdS5cbnZhciBNb2RlbCA9IEJhY2tib25lLk1vZGVsID0gZnVuY3Rpb24oYXR0cmlidXRlcywgb3B0aW9ucykge1xuXHR2YXIgZGVmYXVsdHM7XG5cdGF0dHJpYnV0ZXMgfHwgKGF0dHJpYnV0ZXMgPSB7fSk7XG5cdGlmIChvcHRpb25zICYmIG9wdGlvbnMucGFyc2UpIGF0dHJpYnV0ZXMgPSB0aGlzLnBhcnNlKGF0dHJpYnV0ZXMpO1xuXHRpZiAoZGVmYXVsdHMgPSBnZXRWYWx1ZSh0aGlzLCAnZGVmYXVsdHMnKSkge1xuXHRhdHRyaWJ1dGVzID0gXy5leHRlbmQoe30sIGRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcblx0fVxuXHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLmNvbGxlY3Rpb24pIHRoaXMuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcblx0dGhpcy5hdHRyaWJ1dGVzID0ge307XG5cdHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzID0ge307XG5cdHRoaXMuY2lkID0gXy51bmlxdWVJZCgnYycpO1xuXHR0aGlzLmNoYW5nZWQgPSB7fTtcblx0dGhpcy5fc2lsZW50ID0ge307XG5cdHRoaXMuX3BlbmRpbmcgPSB7fTtcblx0dGhpcy5zZXQoYXR0cmlidXRlcywge3NpbGVudDogdHJ1ZX0pO1xuXHQvLyBSZXNldCBjaGFuZ2UgdHJhY2tpbmcuXG5cdHRoaXMuY2hhbmdlZCA9IHt9O1xuXHR0aGlzLl9zaWxlbnQgPSB7fTtcblx0dGhpcy5fcGVuZGluZyA9IHt9O1xuXHR0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG5cdHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuLy8gQXR0YWNoIGFsbCBpbmhlcml0YWJsZSBtZXRob2RzIHRvIHRoZSBNb2RlbCBwcm90b3R5cGUuXG5fLmV4dGVuZChNb2RlbC5wcm90b3R5cGUsIEV2ZW50cywge1xuXG5cdC8vIEEgaGFzaCBvZiBhdHRyaWJ1dGVzIHdob3NlIGN1cnJlbnQgYW5kIHByZXZpb3VzIHZhbHVlIGRpZmZlci5cblx0Y2hhbmdlZDogbnVsbCxcblxuXHQvLyBBIGhhc2ggb2YgYXR0cmlidXRlcyB0aGF0IGhhdmUgc2lsZW50bHkgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCB0aW1lXG5cdC8vIGBjaGFuZ2VgIHdhcyBjYWxsZWQuICBXaWxsIGJlY29tZSBwZW5kaW5nIGF0dHJpYnV0ZXMgb24gdGhlIG5leHQgY2FsbC5cblx0X3NpbGVudDogbnVsbCxcblxuXHQvLyBBIGhhc2ggb2YgYXR0cmlidXRlcyB0aGF0IGhhdmUgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBgJ2NoYW5nZSdgIGV2ZW50XG5cdC8vIGJlZ2FuLlxuXHRfcGVuZGluZzogbnVsbCxcblxuXHQvLyBUaGUgZGVmYXVsdCBuYW1lIGZvciB0aGUgSlNPTiBgaWRgIGF0dHJpYnV0ZSBpcyBgXCJpZFwiYC4gTW9uZ29EQiBhbmRcblx0Ly8gQ291Y2hEQiB1c2VycyBtYXkgd2FudCB0byBzZXQgdGhpcyB0byBgXCJfaWRcImAuXG5cdGlkQXR0cmlidXRlOiAnaWQnLFxuXG5cdC8vIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuXHQvLyBpbml0aWFsaXphdGlvbiBsb2dpYy5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXt9LFxuXG5cdC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG1vZGVsJ3MgYGF0dHJpYnV0ZXNgIG9iamVjdC5cblx0dG9KU09OOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHJldHVybiBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG5cdH0sXG5cblx0Ly8gR2V0IHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG5cdGdldDogZnVuY3Rpb24oYXR0cikge1xuXHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuXHR9LFxuXG5cdC8vIEdldCB0aGUgSFRNTC1lc2NhcGVkIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cblx0ZXNjYXBlOiBmdW5jdGlvbihhdHRyKSB7XG5cdHZhciBodG1sO1xuXHRpZiAoaHRtbCA9IHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzW2F0dHJdKSByZXR1cm4gaHRtbDtcblx0dmFyIHZhbCA9IHRoaXMuZ2V0KGF0dHIpO1xuXHRyZXR1cm4gdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl0gPSBfLmVzY2FwZSh2YWwgPT0gbnVsbCA/ICcnIDogJycgKyB2YWwpO1xuXHR9LFxuXG5cdC8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBhdHRyaWJ1dGUgY29udGFpbnMgYSB2YWx1ZSB0aGF0IGlzIG5vdCBudWxsXG5cdC8vIG9yIHVuZGVmaW5lZC5cblx0aGFzOiBmdW5jdGlvbihhdHRyKSB7XG5cdHJldHVybiB0aGlzLmdldChhdHRyKSAhPSBudWxsO1xuXHR9LFxuXG5cdC8vIFNldCBhIGhhc2ggb2YgbW9kZWwgYXR0cmlidXRlcyBvbiB0aGUgb2JqZWN0LCBmaXJpbmcgYFwiY2hhbmdlXCJgIHVubGVzc1xuXHQvLyB5b3UgY2hvb3NlIHRvIHNpbGVuY2UgaXQuXG5cdHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuXHR2YXIgYXR0cnMsIGF0dHIsIHZhbDtcblxuXHQvLyBIYW5kbGUgYm90aFxuXHRpZiAoXy5pc09iamVjdChrZXkpIHx8IGtleSA9PSBudWxsKSB7XG5cdFx0YXR0cnMgPSBrZXk7XG5cdFx0b3B0aW9ucyA9IHZhbHVlO1xuXHR9IGVsc2Uge1xuXHRcdGF0dHJzID0ge307XG5cdFx0YXR0cnNba2V5XSA9IHZhbHVlO1xuXHR9XG5cblx0Ly8gRXh0cmFjdCBhdHRyaWJ1dGVzIGFuZCBvcHRpb25zLlxuXHRvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXHRpZiAoIWF0dHJzKSByZXR1cm4gdGhpcztcblx0aWYgKGF0dHJzIGluc3RhbmNlb2YgTW9kZWwpIGF0dHJzID0gYXR0cnMuYXR0cmlidXRlcztcblx0aWYgKG9wdGlvbnMudW5zZXQpIGZvciAoYXR0ciBpbiBhdHRycykgYXR0cnNbYXR0cl0gPSB2b2lkIDA7XG5cblx0Ly8gUnVuIHZhbGlkYXRpb24uXG5cdGlmICghdGhpcy5fdmFsaWRhdGUoYXR0cnMsIG9wdGlvbnMpKSByZXR1cm4gZmFsc2U7XG5cblx0Ly8gQ2hlY2sgZm9yIGNoYW5nZXMgb2YgYGlkYC5cblx0aWYgKHRoaXMuaWRBdHRyaWJ1dGUgaW4gYXR0cnMpIHRoaXMuaWQgPSBhdHRyc1t0aGlzLmlkQXR0cmlidXRlXTtcblxuXHR2YXIgY2hhbmdlcyA9IG9wdGlvbnMuY2hhbmdlcyA9IHt9O1xuXHR2YXIgbm93ID0gdGhpcy5hdHRyaWJ1dGVzO1xuXHR2YXIgZXNjYXBlZCA9IHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzO1xuXHR2YXIgcHJldiA9IHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyB8fCB7fTtcblxuXHQvLyBGb3IgZWFjaCBgc2V0YCBhdHRyaWJ1dGUuLi5cblx0Zm9yIChhdHRyIGluIGF0dHJzKSB7XG5cdFx0dmFsID0gYXR0cnNbYXR0cl07XG5cblx0XHQvLyBJZiB0aGUgbmV3IGFuZCBjdXJyZW50IHZhbHVlIGRpZmZlciwgcmVjb3JkIHRoZSBjaGFuZ2UuXG5cdFx0aWYgKCFfLmlzRXF1YWwobm93W2F0dHJdLCB2YWwpIHx8IChvcHRpb25zLnVuc2V0ICYmIF8uaGFzKG5vdywgYXR0cikpKSB7XG5cdFx0ZGVsZXRlIGVzY2FwZWRbYXR0cl07XG5cdFx0KG9wdGlvbnMuc2lsZW50ID8gdGhpcy5fc2lsZW50IDogY2hhbmdlcylbYXR0cl0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIFVwZGF0ZSBvciBkZWxldGUgdGhlIGN1cnJlbnQgdmFsdWUuXG5cdFx0b3B0aW9ucy51bnNldCA/IGRlbGV0ZSBub3dbYXR0cl0gOiBub3dbYXR0cl0gPSB2YWw7XG5cblx0XHQvLyBJZiB0aGUgbmV3IGFuZCBwcmV2aW91cyB2YWx1ZSBkaWZmZXIsIHJlY29yZCB0aGUgY2hhbmdlLiAgSWYgbm90LFxuXHRcdC8vIHRoZW4gcmVtb3ZlIGNoYW5nZXMgZm9yIHRoaXMgYXR0cmlidXRlLlxuXHRcdGlmICghXy5pc0VxdWFsKHByZXZbYXR0cl0sIHZhbCkgfHwgKF8uaGFzKG5vdywgYXR0cikgIT0gXy5oYXMocHJldiwgYXR0cikpKSB7XG5cdFx0dGhpcy5jaGFuZ2VkW2F0dHJdID0gdmFsO1xuXHRcdGlmICghb3B0aW9ucy5zaWxlbnQpIHRoaXMuX3BlbmRpbmdbYXR0cl0gPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0ZGVsZXRlIHRoaXMuY2hhbmdlZFthdHRyXTtcblx0XHRkZWxldGUgdGhpcy5fcGVuZGluZ1thdHRyXTtcblx0XHR9XG5cdH1cblxuXHQvLyBGaXJlIHRoZSBgXCJjaGFuZ2VcImAgZXZlbnRzLlxuXHRpZiAoIW9wdGlvbnMuc2lsZW50KSB0aGlzLmNoYW5nZShvcHRpb25zKTtcblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gUmVtb3ZlIGFuIGF0dHJpYnV0ZSBmcm9tIHRoZSBtb2RlbCwgZmlyaW5nIGBcImNoYW5nZVwiYCB1bmxlc3MgeW91IGNob29zZVxuXHQvLyB0byBzaWxlbmNlIGl0LiBgdW5zZXRgIGlzIGEgbm9vcCBpZiB0aGUgYXR0cmlidXRlIGRvZXNuJ3QgZXhpc3QuXG5cdHVuc2V0OiBmdW5jdGlvbihhdHRyLCBvcHRpb25zKSB7XG5cdChvcHRpb25zIHx8IChvcHRpb25zID0ge30pKS51bnNldCA9IHRydWU7XG5cdHJldHVybiB0aGlzLnNldChhdHRyLCBudWxsLCBvcHRpb25zKTtcblx0fSxcblxuXHQvLyBDbGVhciBhbGwgYXR0cmlidXRlcyBvbiB0aGUgbW9kZWwsIGZpcmluZyBgXCJjaGFuZ2VcImAgdW5sZXNzIHlvdSBjaG9vc2Vcblx0Ly8gdG8gc2lsZW5jZSBpdC5cblx0Y2xlYXI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0KG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSkpLnVuc2V0ID0gdHJ1ZTtcblx0cmV0dXJuIHRoaXMuc2V0KF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKSwgb3B0aW9ucyk7XG5cdH0sXG5cblx0Ly8gRmV0Y2ggdGhlIG1vZGVsIGZyb20gdGhlIHNlcnZlci4gSWYgdGhlIHNlcnZlcidzIHJlcHJlc2VudGF0aW9uIG9mIHRoZVxuXHQvLyBtb2RlbCBkaWZmZXJzIGZyb20gaXRzIGN1cnJlbnQgYXR0cmlidXRlcywgdGhleSB3aWxsIGJlIG92ZXJyaWRlbixcblx0Ly8gdHJpZ2dlcmluZyBhIGBcImNoYW5nZVwiYCBldmVudC5cblx0ZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgPyBfLmNsb25lKG9wdGlvbnMpIDoge307XG5cdHZhciBtb2RlbCA9IHRoaXM7XG5cdHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuXHRvcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuXHRcdGlmICghbW9kZWwuc2V0KG1vZGVsLnBhcnNlKHJlc3AsIHhociksIG9wdGlvbnMpKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYgKHN1Y2Nlc3MpIHN1Y2Nlc3MobW9kZWwsIHJlc3ApO1xuXHR9O1xuXHRvcHRpb25zLmVycm9yID0gQmFja2JvbmUud3JhcEVycm9yKG9wdGlvbnMuZXJyb3IsIG1vZGVsLCBvcHRpb25zKTtcblx0cmV0dXJuICh0aGlzLnN5bmMgfHwgQmFja2JvbmUuc3luYykuY2FsbCh0aGlzLCAncmVhZCcsIHRoaXMsIG9wdGlvbnMpO1xuXHR9LFxuXG5cdC8vIFNldCBhIGhhc2ggb2YgbW9kZWwgYXR0cmlidXRlcywgYW5kIHN5bmMgdGhlIG1vZGVsIHRvIHRoZSBzZXJ2ZXIuXG5cdC8vIElmIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBhdHRyaWJ1dGVzIGhhc2ggdGhhdCBkaWZmZXJzLCB0aGUgbW9kZWwnc1xuXHQvLyBzdGF0ZSB3aWxsIGJlIGBzZXRgIGFnYWluLlxuXHRzYXZlOiBmdW5jdGlvbihrZXksIHZhbHVlLCBvcHRpb25zKSB7XG5cdHZhciBhdHRycywgY3VycmVudDtcblxuXHQvLyBIYW5kbGUgYm90aCBgKFwia2V5XCIsIHZhbHVlKWAgYW5kIGAoe2tleTogdmFsdWV9KWAgLXN0eWxlIGNhbGxzLlxuXHRpZiAoXy5pc09iamVjdChrZXkpIHx8IGtleSA9PSBudWxsKSB7XG5cdFx0YXR0cnMgPSBrZXk7XG5cdFx0b3B0aW9ucyA9IHZhbHVlO1xuXHR9IGVsc2Uge1xuXHRcdGF0dHJzID0ge307XG5cdFx0YXR0cnNba2V5XSA9IHZhbHVlO1xuXHR9XG5cdG9wdGlvbnMgPSBvcHRpb25zID8gXy5jbG9uZShvcHRpb25zKSA6IHt9O1xuXG5cdC8vIElmIHdlJ3JlIFwid2FpdFwiLWluZyB0byBzZXQgY2hhbmdlZCBhdHRyaWJ1dGVzLCB2YWxpZGF0ZSBlYXJseS5cblx0aWYgKG9wdGlvbnMud2FpdCkge1xuXHRcdGlmICghdGhpcy5fdmFsaWRhdGUoYXR0cnMsIG9wdGlvbnMpKSByZXR1cm4gZmFsc2U7XG5cdFx0Y3VycmVudCA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcblx0fVxuXG5cdC8vIFJlZ3VsYXIgc2F2ZXMgYHNldGAgYXR0cmlidXRlcyBiZWZvcmUgcGVyc2lzdGluZyB0byB0aGUgc2VydmVyLlxuXHR2YXIgc2lsZW50T3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zLCB7c2lsZW50OiB0cnVlfSk7XG5cdGlmIChhdHRycyAmJiAhdGhpcy5zZXQoYXR0cnMsIG9wdGlvbnMud2FpdCA/IHNpbGVudE9wdGlvbnMgOiBvcHRpb25zKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIEFmdGVyIGEgc3VjY2Vzc2Z1bCBzZXJ2ZXItc2lkZSBzYXZlLCB0aGUgY2xpZW50IGlzIChvcHRpb25hbGx5KVxuXHQvLyB1cGRhdGVkIHdpdGggdGhlIHNlcnZlci1zaWRlIHN0YXRlLlxuXHR2YXIgbW9kZWwgPSB0aGlzO1xuXHR2YXIgc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2Vzcztcblx0b3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcblx0XHR2YXIgc2VydmVyQXR0cnMgPSBtb2RlbC5wYXJzZShyZXNwLCB4aHIpO1xuXHRcdGlmIChvcHRpb25zLndhaXQpIHtcblx0XHRkZWxldGUgb3B0aW9ucy53YWl0O1xuXHRcdHNlcnZlckF0dHJzID0gXy5leHRlbmQoYXR0cnMgfHwge30sIHNlcnZlckF0dHJzKTtcblx0XHR9XG5cdFx0aWYgKCFtb2RlbC5zZXQoc2VydmVyQXR0cnMsIG9wdGlvbnMpKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRzdWNjZXNzKG1vZGVsLCByZXNwKTtcblx0XHR9IGVsc2Uge1xuXHRcdG1vZGVsLnRyaWdnZXIoJ3N5bmMnLCBtb2RlbCwgcmVzcCwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEZpbmlzaCBjb25maWd1cmluZyBhbmQgc2VuZGluZyB0aGUgQWpheCByZXF1ZXN0LlxuXHRvcHRpb25zLmVycm9yID0gQmFja2JvbmUud3JhcEVycm9yKG9wdGlvbnMuZXJyb3IsIG1vZGVsLCBvcHRpb25zKTtcblx0dmFyIG1ldGhvZCA9IHRoaXMuaXNOZXcoKSA/ICdjcmVhdGUnIDogJ3VwZGF0ZSc7XG5cdHZhciB4aHIgPSAodGhpcy5zeW5jIHx8IEJhY2tib25lLnN5bmMpLmNhbGwodGhpcywgbWV0aG9kLCB0aGlzLCBvcHRpb25zKTtcblx0aWYgKG9wdGlvbnMud2FpdCkgdGhpcy5zZXQoY3VycmVudCwgc2lsZW50T3B0aW9ucyk7XG5cdHJldHVybiB4aHI7XG5cdH0sXG5cblx0Ly8gRGVzdHJveSB0aGlzIG1vZGVsIG9uIHRoZSBzZXJ2ZXIgaWYgaXQgd2FzIGFscmVhZHkgcGVyc2lzdGVkLlxuXHQvLyBPcHRpbWlzdGljYWxseSByZW1vdmVzIHRoZSBtb2RlbCBmcm9tIGl0cyBjb2xsZWN0aW9uLCBpZiBpdCBoYXMgb25lLlxuXHQvLyBJZiBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCB3YWl0cyBmb3IgdGhlIHNlcnZlciB0byByZXNwb25kIGJlZm9yZSByZW1vdmFsLlxuXHRkZXN0cm95OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zID8gXy5jbG9uZShvcHRpb25zKSA6IHt9O1xuXHR2YXIgbW9kZWwgPSB0aGlzO1xuXHR2YXIgc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2VzcztcblxuXHR2YXIgdHJpZ2dlckRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcblx0XHRtb2RlbC50cmlnZ2VyKCdkZXN0cm95JywgbW9kZWwsIG1vZGVsLmNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuXHR9O1xuXG5cdGlmICh0aGlzLmlzTmV3KCkpIHtcblx0XHR0cmlnZ2VyRGVzdHJveSgpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdG9wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3ApIHtcblx0XHRpZiAob3B0aW9ucy53YWl0KSB0cmlnZ2VyRGVzdHJveSgpO1xuXHRcdGlmIChzdWNjZXNzKSB7XG5cdFx0c3VjY2Vzcyhtb2RlbCwgcmVzcCk7XG5cdFx0fSBlbHNlIHtcblx0XHRtb2RlbC50cmlnZ2VyKCdzeW5jJywgbW9kZWwsIHJlc3AsIG9wdGlvbnMpO1xuXHRcdH1cblx0fTtcblxuXHRvcHRpb25zLmVycm9yID0gQmFja2JvbmUud3JhcEVycm9yKG9wdGlvbnMuZXJyb3IsIG1vZGVsLCBvcHRpb25zKTtcblx0dmFyIHhociA9ICh0aGlzLnN5bmMgfHwgQmFja2JvbmUuc3luYykuY2FsbCh0aGlzLCAnZGVsZXRlJywgdGhpcywgb3B0aW9ucyk7XG5cdGlmICghb3B0aW9ucy53YWl0KSB0cmlnZ2VyRGVzdHJveSgpO1xuXHRyZXR1cm4geGhyO1xuXHR9LFxuXG5cdC8vIERlZmF1bHQgVVJMIGZvciB0aGUgbW9kZWwncyByZXByZXNlbnRhdGlvbiBvbiB0aGUgc2VydmVyIC0tIGlmIHlvdSdyZVxuXHQvLyB1c2luZyBCYWNrYm9uZSdzIHJlc3RmdWwgbWV0aG9kcywgb3ZlcnJpZGUgdGhpcyB0byBjaGFuZ2UgdGhlIGVuZHBvaW50XG5cdC8vIHRoYXQgd2lsbCBiZSBjYWxsZWQuXG5cdHVybDogZnVuY3Rpb24oKSB7XG5cdHZhciBiYXNlID0gZ2V0VmFsdWUodGhpcywgJ3VybFJvb3QnKSB8fCBnZXRWYWx1ZSh0aGlzLmNvbGxlY3Rpb24sICd1cmwnKSB8fCB1cmxFcnJvcigpO1xuXHRpZiAodGhpcy5pc05ldygpKSByZXR1cm4gYmFzZTtcblx0cmV0dXJuIGJhc2UgKyAoYmFzZS5jaGFyQXQoYmFzZS5sZW5ndGggLSAxKSA9PSAnLycgPyAnJyA6ICcvJykgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pZCk7XG5cdH0sXG5cblx0Ly8gKipwYXJzZSoqIGNvbnZlcnRzIGEgcmVzcG9uc2UgaW50byB0aGUgaGFzaCBvZiBhdHRyaWJ1dGVzIHRvIGJlIGBzZXRgIG9uXG5cdC8vIHRoZSBtb2RlbC4gVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gaXMganVzdCB0byBwYXNzIHRoZSByZXNwb25zZSBhbG9uZy5cblx0cGFyc2U6IGZ1bmN0aW9uKHJlc3AsIHhocikge1xuXHRyZXR1cm4gcmVzcDtcblx0fSxcblxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kZWwgd2l0aCBpZGVudGljYWwgYXR0cmlidXRlcyB0byB0aGlzIG9uZS5cblx0Y2xvbmU6IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5hdHRyaWJ1dGVzKTtcblx0fSxcblxuXHQvLyBBIG1vZGVsIGlzIG5ldyBpZiBpdCBoYXMgbmV2ZXIgYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyLCBhbmQgbGFja3MgYW4gaWQuXG5cdGlzTmV3OiBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuaWQgPT0gbnVsbDtcblx0fSxcblxuXHQvLyBDYWxsIHRoaXMgbWV0aG9kIHRvIG1hbnVhbGx5IGZpcmUgYSBgXCJjaGFuZ2VcImAgZXZlbnQgZm9yIHRoaXMgbW9kZWwgYW5kXG5cdC8vIGEgYFwiY2hhbmdlOmF0dHJpYnV0ZVwiYCBldmVudCBmb3IgZWFjaCBjaGFuZ2VkIGF0dHJpYnV0ZS5cblx0Ly8gQ2FsbGluZyB0aGlzIHdpbGwgY2F1c2UgYWxsIG9iamVjdHMgb2JzZXJ2aW5nIHRoZSBtb2RlbCB0byB1cGRhdGUuXG5cdGNoYW5nZTogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXHR2YXIgY2hhbmdpbmcgPSB0aGlzLl9jaGFuZ2luZztcblx0dGhpcy5fY2hhbmdpbmcgPSB0cnVlO1xuXG5cdC8vIFNpbGVudCBjaGFuZ2VzIGJlY29tZSBwZW5kaW5nIGNoYW5nZXMuXG5cdGZvciAodmFyIGF0dHIgaW4gdGhpcy5fc2lsZW50KSB0aGlzLl9wZW5kaW5nW2F0dHJdID0gdHJ1ZTtcblxuXHQvLyBTaWxlbnQgY2hhbmdlcyBhcmUgdHJpZ2dlcmVkLlxuXHR2YXIgY2hhbmdlcyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zLmNoYW5nZXMsIHRoaXMuX3NpbGVudCk7XG5cdHRoaXMuX3NpbGVudCA9IHt9O1xuXHRmb3IgKHZhciBhdHRyIGluIGNoYW5nZXMpIHtcblx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZTonICsgYXR0ciwgdGhpcywgdGhpcy5nZXQoYXR0ciksIG9wdGlvbnMpO1xuXHR9XG5cdGlmIChjaGFuZ2luZykgcmV0dXJuIHRoaXM7XG5cblx0Ly8gQ29udGludWUgZmlyaW5nIGBcImNoYW5nZVwiYCBldmVudHMgd2hpbGUgdGhlcmUgYXJlIHBlbmRpbmcgY2hhbmdlcy5cblx0d2hpbGUgKCFfLmlzRW1wdHkodGhpcy5fcGVuZGluZykpIHtcblx0XHR0aGlzLl9wZW5kaW5nID0ge307XG5cdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB0aGlzLCBvcHRpb25zKTtcblx0XHQvLyBQZW5kaW5nIGFuZCBzaWxlbnQgY2hhbmdlcyBzdGlsbCByZW1haW4uXG5cdFx0Zm9yICh2YXIgYXR0ciBpbiB0aGlzLmNoYW5nZWQpIHtcblx0XHRpZiAodGhpcy5fcGVuZGluZ1thdHRyXSB8fCB0aGlzLl9zaWxlbnRbYXR0cl0pIGNvbnRpbnVlO1xuXHRcdGRlbGV0ZSB0aGlzLmNoYW5nZWRbYXR0cl07XG5cdFx0fVxuXHRcdHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcblx0fVxuXG5cdHRoaXMuX2NoYW5naW5nID0gZmFsc2U7XG5cdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIERldGVybWluZSBpZiB0aGUgbW9kZWwgaGFzIGNoYW5nZWQgc2luY2UgdGhlIGxhc3QgYFwiY2hhbmdlXCJgIGV2ZW50LlxuXHQvLyBJZiB5b3Ugc3BlY2lmeSBhbiBhdHRyaWJ1dGUgbmFtZSwgZGV0ZXJtaW5lIGlmIHRoYXQgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLlxuXHRoYXNDaGFuZ2VkOiBmdW5jdGlvbihhdHRyKSB7XG5cdGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuICFfLmlzRW1wdHkodGhpcy5jaGFuZ2VkKTtcblx0cmV0dXJuIF8uaGFzKHRoaXMuY2hhbmdlZCwgYXR0cik7XG5cdH0sXG5cblx0Ly8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgYXR0cmlidXRlcyB0aGF0IGhhdmUgY2hhbmdlZCwgb3Jcblx0Ly8gZmFsc2UgaWYgdGhlcmUgYXJlIG5vIGNoYW5nZWQgYXR0cmlidXRlcy4gVXNlZnVsIGZvciBkZXRlcm1pbmluZyB3aGF0XG5cdC8vIHBhcnRzIG9mIGEgdmlldyBuZWVkIHRvIGJlIHVwZGF0ZWQgYW5kL29yIHdoYXQgYXR0cmlidXRlcyBuZWVkIHRvIGJlXG5cdC8vIHBlcnNpc3RlZCB0byB0aGUgc2VydmVyLiBVbnNldCBhdHRyaWJ1dGVzIHdpbGwgYmUgc2V0IHRvIHVuZGVmaW5lZC5cblx0Ly8gWW91IGNhbiBhbHNvIHBhc3MgYW4gYXR0cmlidXRlcyBvYmplY3QgdG8gZGlmZiBhZ2FpbnN0IHRoZSBtb2RlbCxcblx0Ly8gZGV0ZXJtaW5pbmcgaWYgdGhlcmUgKndvdWxkIGJlKiBhIGNoYW5nZS5cblx0Y2hhbmdlZEF0dHJpYnV0ZXM6IGZ1bmN0aW9uKGRpZmYpIHtcblx0aWYgKCFkaWZmKSByZXR1cm4gdGhpcy5oYXNDaGFuZ2VkKCkgPyBfLmNsb25lKHRoaXMuY2hhbmdlZCkgOiBmYWxzZTtcblx0dmFyIHZhbCwgY2hhbmdlZCA9IGZhbHNlLCBvbGQgPSB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXM7XG5cdGZvciAodmFyIGF0dHIgaW4gZGlmZikge1xuXHRcdGlmIChfLmlzRXF1YWwob2xkW2F0dHJdLCAodmFsID0gZGlmZlthdHRyXSkpKSBjb250aW51ZTtcblx0XHQoY2hhbmdlZCB8fCAoY2hhbmdlZCA9IHt9KSlbYXR0cl0gPSB2YWw7XG5cdH1cblx0cmV0dXJuIGNoYW5nZWQ7XG5cdH0sXG5cblx0Ly8gR2V0IHRoZSBwcmV2aW91cyB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUsIHJlY29yZGVkIGF0IHRoZSB0aW1lIHRoZSBsYXN0XG5cdC8vIGBcImNoYW5nZVwiYCBldmVudCB3YXMgZmlyZWQuXG5cdHByZXZpb3VzOiBmdW5jdGlvbihhdHRyKSB7XG5cdGlmICghYXJndW1lbnRzLmxlbmd0aCB8fCAhdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzKSByZXR1cm4gbnVsbDtcblx0cmV0dXJuIHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlc1thdHRyXTtcblx0fSxcblxuXHQvLyBHZXQgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBtb2RlbCBhdCB0aGUgdGltZSBvZiB0aGUgcHJldmlvdXNcblx0Ly8gYFwiY2hhbmdlXCJgIGV2ZW50LlxuXHRwcmV2aW91c0F0dHJpYnV0ZXM6IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gXy5jbG9uZSh0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMpO1xuXHR9LFxuXG5cdC8vIENoZWNrIGlmIHRoZSBtb2RlbCBpcyBjdXJyZW50bHkgaW4gYSB2YWxpZCBzdGF0ZS4gSXQncyBvbmx5IHBvc3NpYmxlIHRvXG5cdC8vIGdldCBpbnRvIGFuICppbnZhbGlkKiBzdGF0ZSBpZiB5b3UncmUgdXNpbmcgc2lsZW50IGNoYW5nZXMuXG5cdGlzVmFsaWQ6IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gIXRoaXMudmFsaWRhdGUodGhpcy5hdHRyaWJ1dGVzKTtcblx0fSxcblxuXHQvLyBSdW4gdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBuZXh0IGNvbXBsZXRlIHNldCBvZiBtb2RlbCBhdHRyaWJ1dGVzLFxuXHQvLyByZXR1cm5pbmcgYHRydWVgIGlmIGFsbCBpcyB3ZWxsLiBJZiBhIHNwZWNpZmljIGBlcnJvcmAgY2FsbGJhY2sgaGFzXG5cdC8vIGJlZW4gcGFzc2VkLCBjYWxsIHRoYXQgaW5zdGVhZCBvZiBmaXJpbmcgdGhlIGdlbmVyYWwgYFwiZXJyb3JcImAgZXZlbnQuXG5cdF92YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuc2lsZW50IHx8ICF0aGlzLnZhbGlkYXRlKSByZXR1cm4gdHJ1ZTtcblx0YXR0cnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRycyk7XG5cdHZhciBlcnJvciA9IHRoaXMudmFsaWRhdGUoYXR0cnMsIG9wdGlvbnMpO1xuXHRpZiAoIWVycm9yKSByZXR1cm4gdHJ1ZTtcblx0aWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lcnJvcikge1xuXHRcdG9wdGlvbnMuZXJyb3IodGhpcywgZXJyb3IsIG9wdGlvbnMpO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMudHJpZ2dlcignZXJyb3InLCB0aGlzLCBlcnJvciwgb3B0aW9ucyk7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cbn0pO1xuXG4vLyBCYWNrYm9uZS5Db2xsZWN0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFByb3ZpZGVzIGEgc3RhbmRhcmQgY29sbGVjdGlvbiBjbGFzcyBmb3Igb3VyIHNldHMgb2YgbW9kZWxzLCBvcmRlcmVkXG4vLyBvciB1bm9yZGVyZWQuIElmIGEgYGNvbXBhcmF0b3JgIGlzIHNwZWNpZmllZCwgdGhlIENvbGxlY3Rpb24gd2lsbCBtYWludGFpblxuLy8gaXRzIG1vZGVscyBpbiBzb3J0IG9yZGVyLCBhcyB0aGV5J3JlIGFkZGVkIGFuZCByZW1vdmVkLlxudmFyIENvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uID0gZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdGlmIChvcHRpb25zLm1vZGVsKSB0aGlzLm1vZGVsID0gb3B0aW9ucy5tb2RlbDtcblx0aWYgKG9wdGlvbnMuY29tcGFyYXRvcikgdGhpcy5jb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yO1xuXHR0aGlzLl9yZXNldCgpO1xuXHR0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0aWYgKG1vZGVscykgdGhpcy5yZXNldChtb2RlbHMsIHtzaWxlbnQ6IHRydWUsIHBhcnNlOiBvcHRpb25zLnBhcnNlfSk7XG59O1xuXG4vLyBEZWZpbmUgdGhlIENvbGxlY3Rpb24ncyBpbmhlcml0YWJsZSBtZXRob2RzLlxuXy5leHRlbmQoQ29sbGVjdGlvbi5wcm90b3R5cGUsIEV2ZW50cywge1xuXG5cdC8vIFRoZSBkZWZhdWx0IG1vZGVsIGZvciBhIGNvbGxlY3Rpb24gaXMganVzdCBhICoqQmFja2JvbmUuTW9kZWwqKi5cblx0Ly8gVGhpcyBzaG91bGQgYmUgb3ZlcnJpZGRlbiBpbiBtb3N0IGNhc2VzLlxuXHRtb2RlbDogTW9kZWwsXG5cblx0Ly8gSW5pdGlhbGl6ZSBpcyBhbiBlbXB0eSBmdW5jdGlvbiBieSBkZWZhdWx0LiBPdmVycmlkZSBpdCB3aXRoIHlvdXIgb3duXG5cdC8vIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cblx0Ly8gVGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYSBDb2xsZWN0aW9uIGlzIGFuIGFycmF5IG9mIHRoZVxuXHQvLyBtb2RlbHMnIGF0dHJpYnV0ZXMuXG5cdHRvSlNPTjogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24obW9kZWwpeyByZXR1cm4gbW9kZWwudG9KU09OKG9wdGlvbnMpOyB9KTtcblx0fSxcblxuXHQvLyBBZGQgYSBtb2RlbCwgb3IgbGlzdCBvZiBtb2RlbHMgdG8gdGhlIHNldC4gUGFzcyAqKnNpbGVudCoqIHRvIGF2b2lkXG5cdC8vIGZpcmluZyB0aGUgYGFkZGAgZXZlbnQgZm9yIGV2ZXJ5IG5ldyBtb2RlbC5cblx0YWRkOiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcblx0dmFyIGksIGluZGV4LCBsZW5ndGgsIG1vZGVsLCBjaWQsIGlkLCBjaWRzID0ge30sIGlkcyA9IHt9LCBkdXBzID0gW107XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdG1vZGVscyA9IF8uaXNBcnJheShtb2RlbHMpID8gbW9kZWxzLnNsaWNlKCkgOiBbbW9kZWxzXTtcblxuXHQvLyBCZWdpbiBieSB0dXJuaW5nIGJhcmUgb2JqZWN0cyBpbnRvIG1vZGVsIHJlZmVyZW5jZXMsIGFuZCBwcmV2ZW50aW5nXG5cdC8vIGludmFsaWQgbW9kZWxzIG9yIGR1cGxpY2F0ZSBtb2RlbHMgZnJvbSBiZWluZyBhZGRlZC5cblx0Zm9yIChpID0gMCwgbGVuZ3RoID0gbW9kZWxzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKCEobW9kZWwgPSBtb2RlbHNbaV0gPSB0aGlzLl9wcmVwYXJlTW9kZWwobW9kZWxzW2ldLCBvcHRpb25zKSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBhZGQgYW4gaW52YWxpZCBtb2RlbCB0byBhIGNvbGxlY3Rpb25cIik7XG5cdFx0fVxuXHRcdGNpZCA9IG1vZGVsLmNpZDtcblx0XHRpZCA9IG1vZGVsLmlkO1xuXHRcdGlmIChjaWRzW2NpZF0gfHwgdGhpcy5fYnlDaWRbY2lkXSB8fCAoKGlkICE9IG51bGwpICYmIChpZHNbaWRdIHx8IHRoaXMuX2J5SWRbaWRdKSkpIHtcblx0XHRkdXBzLnB1c2goaSk7XG5cdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGNpZHNbY2lkXSA9IGlkc1tpZF0gPSBtb2RlbDtcblx0fVxuXG5cdC8vIFJlbW92ZSBkdXBsaWNhdGVzLlxuXHRpID0gZHVwcy5sZW5ndGg7XG5cdHdoaWxlIChpLS0pIHtcblx0XHRtb2RlbHMuc3BsaWNlKGR1cHNbaV0sIDEpO1xuXHR9XG5cblx0Ly8gTGlzdGVuIHRvIGFkZGVkIG1vZGVscycgZXZlbnRzLCBhbmQgaW5kZXggbW9kZWxzIGZvciBsb29rdXAgYnlcblx0Ly8gYGlkYCBhbmQgYnkgYGNpZGAuXG5cdGZvciAoaSA9IDAsIGxlbmd0aCA9IG1vZGVscy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdChtb2RlbCA9IG1vZGVsc1tpXSkub24oJ2FsbCcsIHRoaXMuX29uTW9kZWxFdmVudCwgdGhpcyk7XG5cdFx0dGhpcy5fYnlDaWRbbW9kZWwuY2lkXSA9IG1vZGVsO1xuXHRcdGlmIChtb2RlbC5pZCAhPSBudWxsKSB0aGlzLl9ieUlkW21vZGVsLmlkXSA9IG1vZGVsO1xuXHR9XG5cblx0Ly8gSW5zZXJ0IG1vZGVscyBpbnRvIHRoZSBjb2xsZWN0aW9uLCByZS1zb3J0aW5nIGlmIG5lZWRlZCwgYW5kIHRyaWdnZXJpbmdcblx0Ly8gYGFkZGAgZXZlbnRzIHVubGVzcyBzaWxlbmNlZC5cblx0dGhpcy5sZW5ndGggKz0gbGVuZ3RoO1xuXHRpbmRleCA9IG9wdGlvbnMuYXQgIT0gbnVsbCA/IG9wdGlvbnMuYXQgOiB0aGlzLm1vZGVscy5sZW5ndGg7XG5cdHNwbGljZS5hcHBseSh0aGlzLm1vZGVscywgW2luZGV4LCAwXS5jb25jYXQobW9kZWxzKSk7XG5cdGlmICh0aGlzLmNvbXBhcmF0b3IpIHRoaXMuc29ydCh7c2lsZW50OiB0cnVlfSk7XG5cdGlmIChvcHRpb25zLnNpbGVudCkgcmV0dXJuIHRoaXM7XG5cdGZvciAoaSA9IDAsIGxlbmd0aCA9IHRoaXMubW9kZWxzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKCFjaWRzWyhtb2RlbCA9IHRoaXMubW9kZWxzW2ldKS5jaWRdKSBjb250aW51ZTtcblx0XHRvcHRpb25zLmluZGV4ID0gaTtcblx0XHRtb2RlbC50cmlnZ2VyKCdhZGQnLCBtb2RlbCwgdGhpcywgb3B0aW9ucyk7XG5cdH1cblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gUmVtb3ZlIGEgbW9kZWwsIG9yIGEgbGlzdCBvZiBtb2RlbHMgZnJvbSB0aGUgc2V0LiBQYXNzIHNpbGVudCB0byBhdm9pZFxuXHQvLyBmaXJpbmcgdGhlIGByZW1vdmVgIGV2ZW50IGZvciBldmVyeSBtb2RlbCByZW1vdmVkLlxuXHRyZW1vdmU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuXHR2YXIgaSwgbCwgaW5kZXgsIG1vZGVsO1xuXHRvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXHRtb2RlbHMgPSBfLmlzQXJyYXkobW9kZWxzKSA/IG1vZGVscy5zbGljZSgpIDogW21vZGVsc107XG5cdGZvciAoaSA9IDAsIGwgPSBtb2RlbHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0bW9kZWwgPSB0aGlzLmdldEJ5Q2lkKG1vZGVsc1tpXSkgfHwgdGhpcy5nZXQobW9kZWxzW2ldKTtcblx0XHRpZiAoIW1vZGVsKSBjb250aW51ZTtcblx0XHRkZWxldGUgdGhpcy5fYnlJZFttb2RlbC5pZF07XG5cdFx0ZGVsZXRlIHRoaXMuX2J5Q2lkW21vZGVsLmNpZF07XG5cdFx0aW5kZXggPSB0aGlzLmluZGV4T2YobW9kZWwpO1xuXHRcdHRoaXMubW9kZWxzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0dGhpcy5sZW5ndGgtLTtcblx0XHRpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG5cdFx0b3B0aW9ucy5pbmRleCA9IGluZGV4O1xuXHRcdG1vZGVsLnRyaWdnZXIoJ3JlbW92ZScsIG1vZGVsLCB0aGlzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0dGhpcy5fcmVtb3ZlUmVmZXJlbmNlKG1vZGVsKTtcblx0fVxuXHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBBZGQgYSBtb2RlbCB0byB0aGUgZW5kIG9mIHRoZSBjb2xsZWN0aW9uLlxuXHRwdXNoOiBmdW5jdGlvbihtb2RlbCwgb3B0aW9ucykge1xuXHRtb2RlbCA9IHRoaXMuX3ByZXBhcmVNb2RlbChtb2RlbCwgb3B0aW9ucyk7XG5cdHRoaXMuYWRkKG1vZGVsLCBvcHRpb25zKTtcblx0cmV0dXJuIG1vZGVsO1xuXHR9LFxuXG5cdC8vIFJlbW92ZSBhIG1vZGVsIGZyb20gdGhlIGVuZCBvZiB0aGUgY29sbGVjdGlvbi5cblx0cG9wOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHZhciBtb2RlbCA9IHRoaXMuYXQodGhpcy5sZW5ndGggLSAxKTtcblx0dGhpcy5yZW1vdmUobW9kZWwsIG9wdGlvbnMpO1xuXHRyZXR1cm4gbW9kZWw7XG5cdH0sXG5cblx0Ly8gQWRkIGEgbW9kZWwgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgY29sbGVjdGlvbi5cblx0dW5zaGlmdDogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcblx0bW9kZWwgPSB0aGlzLl9wcmVwYXJlTW9kZWwobW9kZWwsIG9wdGlvbnMpO1xuXHR0aGlzLmFkZChtb2RlbCwgXy5leHRlbmQoe2F0OiAwfSwgb3B0aW9ucykpO1xuXHRyZXR1cm4gbW9kZWw7XG5cdH0sXG5cblx0Ly8gUmVtb3ZlIGEgbW9kZWwgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBjb2xsZWN0aW9uLlxuXHRzaGlmdDogZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgbW9kZWwgPSB0aGlzLmF0KDApO1xuXHR0aGlzLnJlbW92ZShtb2RlbCwgb3B0aW9ucyk7XG5cdHJldHVybiBtb2RlbDtcblx0fSxcblxuXHQvLyBHZXQgYSBtb2RlbCBmcm9tIHRoZSBzZXQgYnkgaWQuXG5cdGdldDogZnVuY3Rpb24oaWQpIHtcblx0aWYgKGlkID09IG51bGwpIHJldHVybiB2b2lkIDA7XG5cdHJldHVybiB0aGlzLl9ieUlkW2lkLmlkICE9IG51bGwgPyBpZC5pZCA6IGlkXTtcblx0fSxcblxuXHQvLyBHZXQgYSBtb2RlbCBmcm9tIHRoZSBzZXQgYnkgY2xpZW50IGlkLlxuXHRnZXRCeUNpZDogZnVuY3Rpb24oY2lkKSB7XG5cdHJldHVybiBjaWQgJiYgdGhpcy5fYnlDaWRbY2lkLmNpZCB8fCBjaWRdO1xuXHR9LFxuXG5cdC8vIEdldCB0aGUgbW9kZWwgYXQgdGhlIGdpdmVuIGluZGV4LlxuXHRhdDogZnVuY3Rpb24oaW5kZXgpIHtcblx0cmV0dXJuIHRoaXMubW9kZWxzW2luZGV4XTtcblx0fSxcblxuXHQvLyBSZXR1cm4gbW9kZWxzIHdpdGggbWF0Y2hpbmcgYXR0cmlidXRlcy4gVXNlZnVsIGZvciBzaW1wbGUgY2FzZXMgb2YgYGZpbHRlcmAuXG5cdHdoZXJlOiBmdW5jdGlvbihhdHRycykge1xuXHRpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIFtdO1xuXHRyZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24obW9kZWwpIHtcblx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcblx0XHRpZiAoYXR0cnNba2V5XSAhPT0gbW9kZWwuZ2V0KGtleSkpIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0pO1xuXHR9LFxuXG5cdC8vIEZvcmNlIHRoZSBjb2xsZWN0aW9uIHRvIHJlLXNvcnQgaXRzZWxmLiBZb3UgZG9uJ3QgbmVlZCB0byBjYWxsIHRoaXMgdW5kZXJcblx0Ly8gbm9ybWFsIGNpcmN1bXN0YW5jZXMsIGFzIHRoZSBzZXQgd2lsbCBtYWludGFpbiBzb3J0IG9yZGVyIGFzIGVhY2ggaXRlbVxuXHQvLyBpcyBhZGRlZC5cblx0c29ydDogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXHRpZiAoIXRoaXMuY29tcGFyYXRvcikgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc29ydCBhIHNldCB3aXRob3V0IGEgY29tcGFyYXRvcicpO1xuXHR2YXIgYm91bmRDb21wYXJhdG9yID0gXy5iaW5kKHRoaXMuY29tcGFyYXRvciwgdGhpcyk7XG5cdGlmICh0aGlzLmNvbXBhcmF0b3IubGVuZ3RoID09IDEpIHtcblx0XHR0aGlzLm1vZGVscyA9IHRoaXMuc29ydEJ5KGJvdW5kQ29tcGFyYXRvcik7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5tb2RlbHMuc29ydChib3VuZENvbXBhcmF0b3IpO1xuXHR9XG5cdGlmICghb3B0aW9ucy5zaWxlbnQpIHRoaXMudHJpZ2dlcigncmVzZXQnLCB0aGlzLCBvcHRpb25zKTtcblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gUGx1Y2sgYW4gYXR0cmlidXRlIGZyb20gZWFjaCBtb2RlbCBpbiB0aGUgY29sbGVjdGlvbi5cblx0cGx1Y2s6IGZ1bmN0aW9uKGF0dHIpIHtcblx0cmV0dXJuIF8ubWFwKHRoaXMubW9kZWxzLCBmdW5jdGlvbihtb2RlbCl7IHJldHVybiBtb2RlbC5nZXQoYXR0cik7IH0pO1xuXHR9LFxuXG5cdC8vIFdoZW4geW91IGhhdmUgbW9yZSBpdGVtcyB0aGFuIHlvdSB3YW50IHRvIGFkZCBvciByZW1vdmUgaW5kaXZpZHVhbGx5LFxuXHQvLyB5b3UgY2FuIHJlc2V0IHRoZSBlbnRpcmUgc2V0IHdpdGggYSBuZXcgbGlzdCBvZiBtb2RlbHMsIHdpdGhvdXQgZmlyaW5nXG5cdC8vIGFueSBgYWRkYCBvciBgcmVtb3ZlYCBldmVudHMuIEZpcmVzIGByZXNldGAgd2hlbiBmaW5pc2hlZC5cblx0cmVzZXQ6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuXHRtb2RlbHMgIHx8IChtb2RlbHMgPSBbXSk7XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5tb2RlbHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0dGhpcy5fcmVtb3ZlUmVmZXJlbmNlKHRoaXMubW9kZWxzW2ldKTtcblx0fVxuXHR0aGlzLl9yZXNldCgpO1xuXHR0aGlzLmFkZChtb2RlbHMsIF8uZXh0ZW5kKHtzaWxlbnQ6IHRydWV9LCBvcHRpb25zKSk7XG5cdGlmICghb3B0aW9ucy5zaWxlbnQpIHRoaXMudHJpZ2dlcigncmVzZXQnLCB0aGlzLCBvcHRpb25zKTtcblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gRmV0Y2ggdGhlIGRlZmF1bHQgc2V0IG9mIG1vZGVscyBmb3IgdGhpcyBjb2xsZWN0aW9uLCByZXNldHRpbmcgdGhlXG5cdC8vIGNvbGxlY3Rpb24gd2hlbiB0aGV5IGFycml2ZS4gSWYgYGFkZDogdHJ1ZWAgaXMgcGFzc2VkLCBhcHBlbmRzIHRoZVxuXHQvLyBtb2RlbHMgdG8gdGhlIGNvbGxlY3Rpb24gaW5zdGVhZCBvZiByZXNldHRpbmcuXG5cdGZldGNoOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zID8gXy5jbG9uZShvcHRpb25zKSA6IHt9O1xuXHRpZiAob3B0aW9ucy5wYXJzZSA9PT0gdW5kZWZpbmVkKSBvcHRpb25zLnBhcnNlID0gdHJ1ZTtcblx0dmFyIGNvbGxlY3Rpb24gPSB0aGlzO1xuXHR2YXIgc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2Vzcztcblx0b3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcblx0XHRjb2xsZWN0aW9uW29wdGlvbnMuYWRkID8gJ2FkZCcgOiAncmVzZXQnXShjb2xsZWN0aW9uLnBhcnNlKHJlc3AsIHhociksIG9wdGlvbnMpO1xuXHRcdGlmIChzdWNjZXNzKSBzdWNjZXNzKGNvbGxlY3Rpb24sIHJlc3ApO1xuXHR9O1xuXHRvcHRpb25zLmVycm9yID0gQmFja2JvbmUud3JhcEVycm9yKG9wdGlvbnMuZXJyb3IsIGNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuXHRyZXR1cm4gKHRoaXMuc3luYyB8fCBCYWNrYm9uZS5zeW5jKS5jYWxsKHRoaXMsICdyZWFkJywgdGhpcywgb3B0aW9ucyk7XG5cdH0sXG5cblx0Ly8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgbW9kZWwgaW4gdGhpcyBjb2xsZWN0aW9uLiBBZGQgdGhlIG1vZGVsIHRvIHRoZVxuXHQvLyBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5LCB1bmxlc3MgYHdhaXQ6IHRydWVgIGlzIHBhc3NlZCwgaW4gd2hpY2ggY2FzZSB3ZVxuXHQvLyB3YWl0IGZvciB0aGUgc2VydmVyIHRvIGFncmVlLlxuXHRjcmVhdGU6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG5cdHZhciBjb2xsID0gdGhpcztcblx0b3B0aW9ucyA9IG9wdGlvbnMgPyBfLmNsb25lKG9wdGlvbnMpIDoge307XG5cdG1vZGVsID0gdGhpcy5fcHJlcGFyZU1vZGVsKG1vZGVsLCBvcHRpb25zKTtcblx0aWYgKCFtb2RlbCkgcmV0dXJuIGZhbHNlO1xuXHRpZiAoIW9wdGlvbnMud2FpdCkgY29sbC5hZGQobW9kZWwsIG9wdGlvbnMpO1xuXHR2YXIgc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2Vzcztcblx0b3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obmV4dE1vZGVsLCByZXNwLCB4aHIpIHtcblx0XHRpZiAob3B0aW9ucy53YWl0KSBjb2xsLmFkZChuZXh0TW9kZWwsIG9wdGlvbnMpO1xuXHRcdGlmIChzdWNjZXNzKSB7XG5cdFx0c3VjY2VzcyhuZXh0TW9kZWwsIHJlc3ApO1xuXHRcdH0gZWxzZSB7XG5cdFx0bmV4dE1vZGVsLnRyaWdnZXIoJ3N5bmMnLCBtb2RlbCwgcmVzcCwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9O1xuXHRtb2RlbC5zYXZlKG51bGwsIG9wdGlvbnMpO1xuXHRyZXR1cm4gbW9kZWw7XG5cdH0sXG5cblx0Ly8gKipwYXJzZSoqIGNvbnZlcnRzIGEgcmVzcG9uc2UgaW50byBhIGxpc3Qgb2YgbW9kZWxzIHRvIGJlIGFkZGVkIHRvIHRoZVxuXHQvLyBjb2xsZWN0aW9uLiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBpcyBqdXN0IHRvIHBhc3MgaXQgdGhyb3VnaC5cblx0cGFyc2U6IGZ1bmN0aW9uKHJlc3AsIHhocikge1xuXHRyZXR1cm4gcmVzcDtcblx0fSxcblxuXHQvLyBQcm94eSB0byBfJ3MgY2hhaW4uIENhbid0IGJlIHByb3hpZWQgdGhlIHNhbWUgd2F5IHRoZSByZXN0IG9mIHRoZVxuXHQvLyB1bmRlcnNjb3JlIG1ldGhvZHMgYXJlIHByb3hpZWQgYmVjYXVzZSBpdCByZWxpZXMgb24gdGhlIHVuZGVyc2NvcmVcblx0Ly8gY29uc3RydWN0b3IuXG5cdGNoYWluOiBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBfKHRoaXMubW9kZWxzKS5jaGFpbigpO1xuXHR9LFxuXG5cdC8vIFJlc2V0IGFsbCBpbnRlcm5hbCBzdGF0ZS4gQ2FsbGVkIHdoZW4gdGhlIGNvbGxlY3Rpb24gaXMgcmVzZXQuXG5cdF9yZXNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuXHR0aGlzLmxlbmd0aCA9IDA7XG5cdHRoaXMubW9kZWxzID0gW107XG5cdHRoaXMuX2J5SWQgID0ge307XG5cdHRoaXMuX2J5Q2lkID0ge307XG5cdH0sXG5cblx0Ly8gUHJlcGFyZSBhIG1vZGVsIG9yIGhhc2ggb2YgYXR0cmlidXRlcyB0byBiZSBhZGRlZCB0byB0aGlzIGNvbGxlY3Rpb24uXG5cdF9wcmVwYXJlTW9kZWw6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdGlmICghKG1vZGVsIGluc3RhbmNlb2YgTW9kZWwpKSB7XG5cdFx0dmFyIGF0dHJzID0gbW9kZWw7XG5cdFx0b3B0aW9ucy5jb2xsZWN0aW9uID0gdGhpcztcblx0XHRtb2RlbCA9IG5ldyB0aGlzLm1vZGVsKGF0dHJzLCBvcHRpb25zKTtcblx0XHRpZiAoIW1vZGVsLl92YWxpZGF0ZShtb2RlbC5hdHRyaWJ1dGVzLCBvcHRpb25zKSkgbW9kZWwgPSBmYWxzZTtcblx0fSBlbHNlIGlmICghbW9kZWwuY29sbGVjdGlvbikge1xuXHRcdG1vZGVsLmNvbGxlY3Rpb24gPSB0aGlzO1xuXHR9XG5cdHJldHVybiBtb2RlbDtcblx0fSxcblxuXHQvLyBJbnRlcm5hbCBtZXRob2QgdG8gcmVtb3ZlIGEgbW9kZWwncyB0aWVzIHRvIGEgY29sbGVjdGlvbi5cblx0X3JlbW92ZVJlZmVyZW5jZTogZnVuY3Rpb24obW9kZWwpIHtcblx0aWYgKHRoaXMgPT0gbW9kZWwuY29sbGVjdGlvbikge1xuXHRcdGRlbGV0ZSBtb2RlbC5jb2xsZWN0aW9uO1xuXHR9XG5cdG1vZGVsLm9mZignYWxsJywgdGhpcy5fb25Nb2RlbEV2ZW50LCB0aGlzKTtcblx0fSxcblxuXHQvLyBJbnRlcm5hbCBtZXRob2QgY2FsbGVkIGV2ZXJ5IHRpbWUgYSBtb2RlbCBpbiB0aGUgc2V0IGZpcmVzIGFuIGV2ZW50LlxuXHQvLyBTZXRzIG5lZWQgdG8gdXBkYXRlIHRoZWlyIGluZGV4ZXMgd2hlbiBtb2RlbHMgY2hhbmdlIGlkcy4gQWxsIG90aGVyXG5cdC8vIGV2ZW50cyBzaW1wbHkgcHJveHkgdGhyb3VnaC4gXCJhZGRcIiBhbmQgXCJyZW1vdmVcIiBldmVudHMgdGhhdCBvcmlnaW5hdGVcblx0Ly8gaW4gb3RoZXIgY29sbGVjdGlvbnMgYXJlIGlnbm9yZWQuXG5cdF9vbk1vZGVsRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50LCBtb2RlbCwgY29sbGVjdGlvbiwgb3B0aW9ucykge1xuXHRpZiAoKGV2ZW50ID09ICdhZGQnIHx8IGV2ZW50ID09ICdyZW1vdmUnKSAmJiBjb2xsZWN0aW9uICE9IHRoaXMpIHJldHVybjtcblx0aWYgKGV2ZW50ID09ICdkZXN0cm95Jykge1xuXHRcdHRoaXMucmVtb3ZlKG1vZGVsLCBvcHRpb25zKTtcblx0fVxuXHRpZiAobW9kZWwgJiYgZXZlbnQgPT09ICdjaGFuZ2U6JyArIG1vZGVsLmlkQXR0cmlidXRlKSB7XG5cdFx0ZGVsZXRlIHRoaXMuX2J5SWRbbW9kZWwucHJldmlvdXMobW9kZWwuaWRBdHRyaWJ1dGUpXTtcblx0XHR0aGlzLl9ieUlkW21vZGVsLmlkXSA9IG1vZGVsO1xuXHR9XG5cdHRoaXMudHJpZ2dlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9XG5cbn0pO1xuXG4vLyBVbmRlcnNjb3JlIG1ldGhvZHMgdGhhdCB3ZSB3YW50IHRvIGltcGxlbWVudCBvbiB0aGUgQ29sbGVjdGlvbi5cbnZhciBtZXRob2RzID0gWydmb3JFYWNoJywgJ2VhY2gnLCAnbWFwJywgJ3JlZHVjZScsICdyZWR1Y2VSaWdodCcsICdmaW5kJyxcblx0J2RldGVjdCcsICdmaWx0ZXInLCAnc2VsZWN0JywgJ3JlamVjdCcsICdldmVyeScsICdhbGwnLCAnc29tZScsICdhbnknLFxuXHQnaW5jbHVkZScsICdjb250YWlucycsICdpbnZva2UnLCAnbWF4JywgJ21pbicsICdzb3J0QnknLCAnc29ydGVkSW5kZXgnLFxuXHQndG9BcnJheScsICdzaXplJywgJ2ZpcnN0JywgJ2luaXRpYWwnLCAncmVzdCcsICdsYXN0JywgJ3dpdGhvdXQnLCAnaW5kZXhPZicsXG5cdCdzaHVmZmxlJywgJ2xhc3RJbmRleE9mJywgJ2lzRW1wdHknLCAnZ3JvdXBCeSddO1xuXG4vLyBNaXggaW4gZWFjaCBVbmRlcnNjb3JlIG1ldGhvZCBhcyBhIHByb3h5IHRvIGBDb2xsZWN0aW9uI21vZGVsc2AuXG5fLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG5cdENvbGxlY3Rpb24ucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIF9bbWV0aG9kXS5hcHBseShfLCBbdGhpcy5tb2RlbHNdLmNvbmNhdChfLnRvQXJyYXkoYXJndW1lbnRzKSkpO1xuXHR9O1xufSk7XG5cbi8vIEJhY2tib25lLlJvdXRlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBSb3V0ZXJzIG1hcCBmYXV4LVVSTHMgdG8gYWN0aW9ucywgYW5kIGZpcmUgZXZlbnRzIHdoZW4gcm91dGVzIGFyZVxuLy8gbWF0Y2hlZC4gQ3JlYXRpbmcgYSBuZXcgb25lIHNldHMgaXRzIGByb3V0ZXNgIGhhc2gsIGlmIG5vdCBzZXQgc3RhdGljYWxseS5cbnZhciBSb3V0ZXIgPSBCYWNrYm9uZS5Sb3V0ZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdGlmIChvcHRpb25zLnJvdXRlcykgdGhpcy5yb3V0ZXMgPSBvcHRpb25zLnJvdXRlcztcblx0dGhpcy5fYmluZFJvdXRlcygpO1xuXHR0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbi8vIENhY2hlZCByZWd1bGFyIGV4cHJlc3Npb25zIGZvciBtYXRjaGluZyBuYW1lZCBwYXJhbSBwYXJ0cyBhbmQgc3BsYXR0ZWRcbi8vIHBhcnRzIG9mIHJvdXRlIHN0cmluZ3MuXG52YXIgbmFtZWRQYXJhbSAgICA9IC86XFx3Ky9nO1xudmFyIHNwbGF0UGFyYW0gICAgPSAvXFwqXFx3Ky9nO1xudmFyIGVzY2FwZVJlZ0V4cCAgPSAvWy1bXFxde30oKSs/LixcXFxcXiR8I1xcc10vZztcblxuLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKkJhY2tib25lLlJvdXRlcioqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG5fLmV4dGVuZChSb3V0ZXIucHJvdG90eXBlLCBFdmVudHMsIHtcblxuXHQvLyBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cblx0Ly8gaW5pdGlhbGl6YXRpb24gbG9naWMuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuXHQvLyBNYW51YWxseSBiaW5kIGEgc2luZ2xlIG5hbWVkIHJvdXRlIHRvIGEgY2FsbGJhY2suIEZvciBleGFtcGxlOlxuXHQvL1xuXHQvLyAgICAgdGhpcy5yb3V0ZSgnc2VhcmNoLzpxdWVyeS9wOm51bScsICdzZWFyY2gnLCBmdW5jdGlvbihxdWVyeSwgbnVtKSB7XG5cdC8vICAgICAgIC4uLlxuXHQvLyAgICAgfSk7XG5cdC8vXG5cdHJvdXRlOiBmdW5jdGlvbihyb3V0ZSwgbmFtZSwgY2FsbGJhY2spIHtcblx0QmFja2JvbmUuaGlzdG9yeSB8fCAoQmFja2JvbmUuaGlzdG9yeSA9IG5ldyBIaXN0b3J5KTtcblx0aWYgKCFfLmlzUmVnRXhwKHJvdXRlKSkgcm91dGUgPSB0aGlzLl9yb3V0ZVRvUmVnRXhwKHJvdXRlKTtcblx0aWYgKCFjYWxsYmFjaykgY2FsbGJhY2sgPSB0aGlzW25hbWVdO1xuXHRCYWNrYm9uZS5oaXN0b3J5LnJvdXRlKHJvdXRlLCBfLmJpbmQoZnVuY3Rpb24oZnJhZ21lbnQpIHtcblx0XHR2YXIgYXJncyA9IHRoaXMuX2V4dHJhY3RQYXJhbWV0ZXJzKHJvdXRlLCBmcmFnbWVudCk7XG5cdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG5cdFx0dGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIFsncm91dGU6JyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG5cdFx0QmFja2JvbmUuaGlzdG9yeS50cmlnZ2VyKCdyb3V0ZScsIHRoaXMsIG5hbWUsIGFyZ3MpO1xuXHR9LCB0aGlzKSk7XG5cdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIFNpbXBsZSBwcm94eSB0byBgQmFja2JvbmUuaGlzdG9yeWAgdG8gc2F2ZSBhIGZyYWdtZW50IGludG8gdGhlIGhpc3RvcnkuXG5cdG5hdmlnYXRlOiBmdW5jdGlvbihmcmFnbWVudCwgb3B0aW9ucykge1xuXHRCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKGZyYWdtZW50LCBvcHRpb25zKTtcblx0fSxcblxuXHQvLyBCaW5kIGFsbCBkZWZpbmVkIHJvdXRlcyB0byBgQmFja2JvbmUuaGlzdG9yeWAuIFdlIGhhdmUgdG8gcmV2ZXJzZSB0aGVcblx0Ly8gb3JkZXIgb2YgdGhlIHJvdXRlcyBoZXJlIHRvIHN1cHBvcnQgYmVoYXZpb3Igd2hlcmUgdGhlIG1vc3QgZ2VuZXJhbFxuXHQvLyByb3V0ZXMgY2FuIGJlIGRlZmluZWQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcm91dGUgbWFwLlxuXHRfYmluZFJvdXRlczogZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5yb3V0ZXMpIHJldHVybjtcblx0dmFyIHJvdXRlcyA9IFtdO1xuXHRmb3IgKHZhciByb3V0ZSBpbiB0aGlzLnJvdXRlcykge1xuXHRcdHJvdXRlcy51bnNoaWZ0KFtyb3V0ZSwgdGhpcy5yb3V0ZXNbcm91dGVdXSk7XG5cdH1cblx0Zm9yICh2YXIgaSA9IDAsIGwgPSByb3V0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0dGhpcy5yb3V0ZShyb3V0ZXNbaV1bMF0sIHJvdXRlc1tpXVsxXSwgdGhpc1tyb3V0ZXNbaV1bMV1dKTtcblx0fVxuXHR9LFxuXG5cdC8vIENvbnZlcnQgYSByb3V0ZSBzdHJpbmcgaW50byBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgc3VpdGFibGUgZm9yIG1hdGNoaW5nXG5cdC8vIGFnYWluc3QgdGhlIGN1cnJlbnQgbG9jYXRpb24gaGFzaC5cblx0X3JvdXRlVG9SZWdFeHA6IGZ1bmN0aW9uKHJvdXRlKSB7XG5cdHJvdXRlID0gcm91dGUucmVwbGFjZShlc2NhcGVSZWdFeHAsICdcXFxcJCYnKVxuXHRcdFx0XHQucmVwbGFjZShuYW1lZFBhcmFtLCAnKFteXFwvXSspJylcblx0XHRcdFx0LnJlcGxhY2Uoc3BsYXRQYXJhbSwgJyguKj8pJyk7XG5cdHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJvdXRlICsgJyQnKTtcblx0fSxcblxuXHQvLyBHaXZlbiBhIHJvdXRlLCBhbmQgYSBVUkwgZnJhZ21lbnQgdGhhdCBpdCBtYXRjaGVzLCByZXR1cm4gdGhlIGFycmF5IG9mXG5cdC8vIGV4dHJhY3RlZCBwYXJhbWV0ZXJzLlxuXHRfZXh0cmFjdFBhcmFtZXRlcnM6IGZ1bmN0aW9uKHJvdXRlLCBmcmFnbWVudCkge1xuXHRyZXR1cm4gcm91dGUuZXhlYyhmcmFnbWVudCkuc2xpY2UoMSk7XG5cdH1cblxufSk7XG5cbi8vIEJhY2tib25lLkhpc3Rvcnlcbi8vIC0tLS0tLS0tLS0tLS0tLS1cblxuLy8gSGFuZGxlcyBjcm9zcy1icm93c2VyIGhpc3RvcnkgbWFuYWdlbWVudCwgYmFzZWQgb24gVVJMIGZyYWdtZW50cy4gSWYgdGhlXG4vLyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYG9uaGFzaGNoYW5nZWAsIGZhbGxzIGJhY2sgdG8gcG9sbGluZy5cbnZhciBIaXN0b3J5ID0gQmFja2JvbmUuSGlzdG9yeSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmhhbmRsZXJzID0gW107XG5cdF8uYmluZEFsbCh0aGlzLCAnY2hlY2tVcmwnKTtcbn07XG5cbi8vIENhY2hlZCByZWdleCBmb3IgY2xlYW5pbmcgbGVhZGluZyBoYXNoZXMgYW5kIHNsYXNoZXMgLlxudmFyIHJvdXRlU3RyaXBwZXIgPSAvXlsjXFwvXS87XG5cbi8vIENhY2hlZCByZWdleCBmb3IgZGV0ZWN0aW5nIE1TSUUuXG52YXIgaXNFeHBsb3JlciA9IC9tc2llIFtcXHcuXSsvO1xuXG4vLyBIYXMgdGhlIGhpc3RvcnkgaGFuZGxpbmcgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQ/XG5IaXN0b3J5LnN0YXJ0ZWQgPSBmYWxzZTtcblxuLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKkJhY2tib25lLkhpc3RvcnkqKiBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuXy5leHRlbmQoSGlzdG9yeS5wcm90b3R5cGUsIEV2ZW50cywge1xuXG5cdC8vIFRoZSBkZWZhdWx0IGludGVydmFsIHRvIHBvbGwgZm9yIGhhc2ggY2hhbmdlcywgaWYgbmVjZXNzYXJ5LCBpc1xuXHQvLyB0d2VudHkgdGltZXMgYSBzZWNvbmQuXG5cdGludGVydmFsOiA1MCxcblxuXHQvLyBHZXRzIHRoZSB0cnVlIGhhc2ggdmFsdWUuIENhbm5vdCB1c2UgbG9jYXRpb24uaGFzaCBkaXJlY3RseSBkdWUgdG8gYnVnXG5cdC8vIGluIEZpcmVmb3ggd2hlcmUgbG9jYXRpb24uaGFzaCB3aWxsIGFsd2F5cyBiZSBkZWNvZGVkLlxuXHRnZXRIYXNoOiBmdW5jdGlvbih3aW5kb3dPdmVycmlkZSkge1xuXHR2YXIgbG9jID0gd2luZG93T3ZlcnJpZGUgPyB3aW5kb3dPdmVycmlkZS5sb2NhdGlvbiA6IHdpbmRvdy5sb2NhdGlvbjtcblx0dmFyIG1hdGNoID0gbG9jLmhyZWYubWF0Y2goLyMoLiopJC8pO1xuXHRyZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xuXHR9LFxuXG5cdC8vIEdldCB0aGUgY3Jvc3MtYnJvd3NlciBub3JtYWxpemVkIFVSTCBmcmFnbWVudCwgZWl0aGVyIGZyb20gdGhlIFVSTCxcblx0Ly8gdGhlIGhhc2gsIG9yIHRoZSBvdmVycmlkZS5cblx0Z2V0RnJhZ21lbnQ6IGZ1bmN0aW9uKGZyYWdtZW50LCBmb3JjZVB1c2hTdGF0ZSkge1xuXHRpZiAoZnJhZ21lbnQgPT0gbnVsbCkge1xuXHRcdGlmICh0aGlzLl9oYXNQdXNoU3RhdGUgfHwgZm9yY2VQdXNoU3RhdGUpIHtcblx0XHRmcmFnbWVudCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblx0XHR2YXIgc2VhcmNoID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcblx0XHRpZiAoc2VhcmNoKSBmcmFnbWVudCArPSBzZWFyY2g7XG5cdFx0fSBlbHNlIHtcblx0XHRmcmFnbWVudCA9IHRoaXMuZ2V0SGFzaCgpO1xuXHRcdH1cblx0fVxuXHRpZiAoIWZyYWdtZW50LmluZGV4T2YodGhpcy5vcHRpb25zLnJvb3QpKSBmcmFnbWVudCA9IGZyYWdtZW50LnN1YnN0cih0aGlzLm9wdGlvbnMucm9vdC5sZW5ndGgpO1xuXHRyZXR1cm4gZnJhZ21lbnQucmVwbGFjZShyb3V0ZVN0cmlwcGVyLCAnJyk7XG5cdH0sXG5cblx0Ly8gU3RhcnQgdGhlIGhhc2ggY2hhbmdlIGhhbmRsaW5nLCByZXR1cm5pbmcgYHRydWVgIGlmIHRoZSBjdXJyZW50IFVSTCBtYXRjaGVzXG5cdC8vIGFuIGV4aXN0aW5nIHJvdXRlLCBhbmQgYGZhbHNlYCBvdGhlcndpc2UuXG5cdHN0YXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdGlmIChIaXN0b3J5LnN0YXJ0ZWQpIHRocm93IG5ldyBFcnJvcihcIkJhY2tib25lLmhpc3RvcnkgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkXCIpO1xuXHRIaXN0b3J5LnN0YXJ0ZWQgPSB0cnVlO1xuXG5cdC8vIEZpZ3VyZSBvdXQgdGhlIGluaXRpYWwgY29uZmlndXJhdGlvbi4gRG8gd2UgbmVlZCBhbiBpZnJhbWU/XG5cdC8vIElzIHB1c2hTdGF0ZSBkZXNpcmVkIC4uLiBpcyBpdCBhdmFpbGFibGU/XG5cdHRoaXMub3B0aW9ucyAgICAgICAgICA9IF8uZXh0ZW5kKHt9LCB7cm9vdDogJy8nfSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblx0dGhpcy5fd2FudHNIYXNoQ2hhbmdlID0gdGhpcy5vcHRpb25zLmhhc2hDaGFuZ2UgIT09IGZhbHNlO1xuXHR0aGlzLl93YW50c1B1c2hTdGF0ZSAgPSAhIXRoaXMub3B0aW9ucy5wdXNoU3RhdGU7XG5cdHRoaXMuX2hhc1B1c2hTdGF0ZSAgICA9ICEhKHRoaXMub3B0aW9ucy5wdXNoU3RhdGUgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcblx0dmFyIGZyYWdtZW50ICAgICAgICAgID0gdGhpcy5nZXRGcmFnbWVudCgpO1xuXHR2YXIgZG9jTW9kZSAgICAgICAgICAgPSBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG5cdHZhciBvbGRJRSAgICAgICAgICAgICA9IChpc0V4cGxvcmVyLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAmJiAoIWRvY01vZGUgfHwgZG9jTW9kZSA8PSA3KSk7XG5cblx0aWYgKG9sZElFKSB7XG5cdFx0dGhpcy5pZnJhbWUgPSAkKCc8aWZyYW1lIHNyYz1cImphdmFzY3JpcHQ6MFwiIHRhYmluZGV4PVwiLTFcIiAvPicpLmhpZGUoKS5hcHBlbmRUbygnYm9keScpWzBdLmNvbnRlbnRXaW5kb3c7XG5cdFx0dGhpcy5uYXZpZ2F0ZShmcmFnbWVudCk7XG5cdH1cblxuXHQvLyBEZXBlbmRpbmcgb24gd2hldGhlciB3ZSdyZSB1c2luZyBwdXNoU3RhdGUgb3IgaGFzaGVzLCBhbmQgd2hldGhlclxuXHQvLyAnb25oYXNoY2hhbmdlJyBpcyBzdXBwb3J0ZWQsIGRldGVybWluZSBob3cgd2UgY2hlY2sgdGhlIFVSTCBzdGF0ZS5cblx0aWYgKHRoaXMuX2hhc1B1c2hTdGF0ZSkge1xuXHRcdCQod2luZG93KS5iaW5kKCdwb3BzdGF0ZScsIHRoaXMuY2hlY2tVcmwpO1xuXHR9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSAmJiAoJ29uaGFzaGNoYW5nZScgaW4gd2luZG93KSAmJiAhb2xkSUUpIHtcblx0XHQkKHdpbmRvdykuYmluZCgnaGFzaGNoYW5nZScsIHRoaXMuY2hlY2tVcmwpO1xuXHR9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSkge1xuXHRcdHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aGlzLmNoZWNrVXJsLCB0aGlzLmludGVydmFsKTtcblx0fVxuXG5cdC8vIERldGVybWluZSBpZiB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgYmFzZSB1cmwsIGZvciBhIHB1c2hTdGF0ZSBsaW5rXG5cdC8vIG9wZW5lZCBieSBhIG5vbi1wdXNoU3RhdGUgYnJvd3Nlci5cblx0dGhpcy5mcmFnbWVudCA9IGZyYWdtZW50O1xuXHR2YXIgbG9jID0gd2luZG93LmxvY2F0aW9uO1xuXHR2YXIgYXRSb290ICA9IGxvYy5wYXRobmFtZSA9PSB0aGlzLm9wdGlvbnMucm9vdDtcblxuXHQvLyBJZiB3ZSd2ZSBzdGFydGVkIG9mZiB3aXRoIGEgcm91dGUgZnJvbSBhIGBwdXNoU3RhdGVgLWVuYWJsZWQgYnJvd3Nlcixcblx0Ly8gYnV0IHdlJ3JlIGN1cnJlbnRseSBpbiBhIGJyb3dzZXIgdGhhdCBkb2Vzbid0IHN1cHBvcnQgaXQuLi5cblx0aWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSAmJiB0aGlzLl93YW50c1B1c2hTdGF0ZSAmJiAhdGhpcy5faGFzUHVzaFN0YXRlICYmICFhdFJvb3QpIHtcblx0XHR0aGlzLmZyYWdtZW50ID0gdGhpcy5nZXRGcmFnbWVudChudWxsLCB0cnVlKTtcblx0XHR3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh0aGlzLm9wdGlvbnMucm9vdCArICcjJyArIHRoaXMuZnJhZ21lbnQpO1xuXHRcdC8vIFJldHVybiBpbW1lZGlhdGVseSBhcyBicm93c2VyIHdpbGwgZG8gcmVkaXJlY3QgdG8gbmV3IHVybFxuXHRcdHJldHVybiB0cnVlO1xuXG5cdC8vIE9yIGlmIHdlJ3ZlIHN0YXJ0ZWQgb3V0IHdpdGggYSBoYXNoLWJhc2VkIHJvdXRlLCBidXQgd2UncmUgY3VycmVudGx5XG5cdC8vIGluIGEgYnJvd3NlciB3aGVyZSBpdCBjb3VsZCBiZSBgcHVzaFN0YXRlYC1iYXNlZCBpbnN0ZWFkLi4uXG5cdH0gZWxzZSBpZiAodGhpcy5fd2FudHNQdXNoU3RhdGUgJiYgdGhpcy5faGFzUHVzaFN0YXRlICYmIGF0Um9vdCAmJiBsb2MuaGFzaCkge1xuXHRcdHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEhhc2goKS5yZXBsYWNlKHJvdXRlU3RyaXBwZXIsICcnKTtcblx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCBsb2MucHJvdG9jb2wgKyAnLy8nICsgbG9jLmhvc3QgKyB0aGlzLm9wdGlvbnMucm9vdCArIHRoaXMuZnJhZ21lbnQpO1xuXHR9XG5cblx0aWYgKCF0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG5cdFx0cmV0dXJuIHRoaXMubG9hZFVybCgpO1xuXHR9XG5cdH0sXG5cblx0Ly8gRGlzYWJsZSBCYWNrYm9uZS5oaXN0b3J5LCBwZXJoYXBzIHRlbXBvcmFyaWx5LiBOb3QgdXNlZnVsIGluIGEgcmVhbCBhcHAsXG5cdC8vIGJ1dCBwb3NzaWJseSB1c2VmdWwgZm9yIHVuaXQgdGVzdGluZyBSb3V0ZXJzLlxuXHRzdG9wOiBmdW5jdGlvbigpIHtcblx0JCh3aW5kb3cpLnVuYmluZCgncG9wc3RhdGUnLCB0aGlzLmNoZWNrVXJsKS51bmJpbmQoJ2hhc2hjaGFuZ2UnLCB0aGlzLmNoZWNrVXJsKTtcblx0Y2xlYXJJbnRlcnZhbCh0aGlzLl9jaGVja1VybEludGVydmFsKTtcblx0SGlzdG9yeS5zdGFydGVkID0gZmFsc2U7XG5cdH0sXG5cblx0Ly8gQWRkIGEgcm91dGUgdG8gYmUgdGVzdGVkIHdoZW4gdGhlIGZyYWdtZW50IGNoYW5nZXMuIFJvdXRlcyBhZGRlZCBsYXRlclxuXHQvLyBtYXkgb3ZlcnJpZGUgcHJldmlvdXMgcm91dGVzLlxuXHRyb3V0ZTogZnVuY3Rpb24ocm91dGUsIGNhbGxiYWNrKSB7XG5cdHRoaXMuaGFuZGxlcnMudW5zaGlmdCh7cm91dGU6IHJvdXRlLCBjYWxsYmFjazogY2FsbGJhY2t9KTtcblx0fSxcblxuXHQvLyBDaGVja3MgdGhlIGN1cnJlbnQgVVJMIHRvIHNlZSBpZiBpdCBoYXMgY2hhbmdlZCwgYW5kIGlmIGl0IGhhcyxcblx0Ly8gY2FsbHMgYGxvYWRVcmxgLCBub3JtYWxpemluZyBhY3Jvc3MgdGhlIGhpZGRlbiBpZnJhbWUuXG5cdGNoZWNrVXJsOiBmdW5jdGlvbihlKSB7XG5cdHZhciBjdXJyZW50ID0gdGhpcy5nZXRGcmFnbWVudCgpO1xuXHRpZiAoY3VycmVudCA9PSB0aGlzLmZyYWdtZW50ICYmIHRoaXMuaWZyYW1lKSBjdXJyZW50ID0gdGhpcy5nZXRGcmFnbWVudCh0aGlzLmdldEhhc2godGhpcy5pZnJhbWUpKTtcblx0aWYgKGN1cnJlbnQgPT0gdGhpcy5mcmFnbWVudCkgcmV0dXJuIGZhbHNlO1xuXHRpZiAodGhpcy5pZnJhbWUpIHRoaXMubmF2aWdhdGUoY3VycmVudCk7XG5cdHRoaXMubG9hZFVybCgpIHx8IHRoaXMubG9hZFVybCh0aGlzLmdldEhhc2goKSk7XG5cdH0sXG5cblx0Ly8gQXR0ZW1wdCB0byBsb2FkIHRoZSBjdXJyZW50IFVSTCBmcmFnbWVudC4gSWYgYSByb3V0ZSBzdWNjZWVkcyB3aXRoIGFcblx0Ly8gbWF0Y2gsIHJldHVybnMgYHRydWVgLiBJZiBubyBkZWZpbmVkIHJvdXRlcyBtYXRjaGVzIHRoZSBmcmFnbWVudCxcblx0Ly8gcmV0dXJucyBgZmFsc2VgLlxuXHRsb2FkVXJsOiBmdW5jdGlvbihmcmFnbWVudE92ZXJyaWRlKSB7XG5cdHZhciBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEZyYWdtZW50KGZyYWdtZW50T3ZlcnJpZGUpO1xuXHR2YXIgbWF0Y2hlZCA9IF8uYW55KHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGhhbmRsZXIpIHtcblx0XHRpZiAoaGFuZGxlci5yb3V0ZS50ZXN0KGZyYWdtZW50KSkge1xuXHRcdGhhbmRsZXIuY2FsbGJhY2soZnJhZ21lbnQpO1xuXHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtYXRjaGVkO1xuXHR9LFxuXG5cdC8vIFNhdmUgYSBmcmFnbWVudCBpbnRvIHRoZSBoYXNoIGhpc3RvcnksIG9yIHJlcGxhY2UgdGhlIFVSTCBzdGF0ZSBpZiB0aGVcblx0Ly8gJ3JlcGxhY2UnIG9wdGlvbiBpcyBwYXNzZWQuIFlvdSBhcmUgcmVzcG9uc2libGUgZm9yIHByb3Blcmx5IFVSTC1lbmNvZGluZ1xuXHQvLyB0aGUgZnJhZ21lbnQgaW4gYWR2YW5jZS5cblx0Ly9cblx0Ly8gVGhlIG9wdGlvbnMgb2JqZWN0IGNhbiBjb250YWluIGB0cmlnZ2VyOiB0cnVlYCBpZiB5b3Ugd2lzaCB0byBoYXZlIHRoZVxuXHQvLyByb3V0ZSBjYWxsYmFjayBiZSBmaXJlZCAobm90IHVzdWFsbHkgZGVzaXJhYmxlKSwgb3IgYHJlcGxhY2U6IHRydWVgLCBpZlxuXHQvLyB5b3Ugd2lzaCB0byBtb2RpZnkgdGhlIGN1cnJlbnQgVVJMIHdpdGhvdXQgYWRkaW5nIGFuIGVudHJ5IHRvIHRoZSBoaXN0b3J5LlxuXHRuYXZpZ2F0ZTogZnVuY3Rpb24oZnJhZ21lbnQsIG9wdGlvbnMpIHtcblx0aWYgKCFIaXN0b3J5LnN0YXJ0ZWQpIHJldHVybiBmYWxzZTtcblx0aWYgKCFvcHRpb25zIHx8IG9wdGlvbnMgPT09IHRydWUpIG9wdGlvbnMgPSB7dHJpZ2dlcjogb3B0aW9uc307XG5cdHZhciBmcmFnID0gKGZyYWdtZW50IHx8ICcnKS5yZXBsYWNlKHJvdXRlU3RyaXBwZXIsICcnKTtcblx0aWYgKHRoaXMuZnJhZ21lbnQgPT0gZnJhZykgcmV0dXJuO1xuXG5cdC8vIElmIHB1c2hTdGF0ZSBpcyBhdmFpbGFibGUsIHdlIHVzZSBpdCB0byBzZXQgdGhlIGZyYWdtZW50IGFzIGEgcmVhbCBVUkwuXG5cdGlmICh0aGlzLl9oYXNQdXNoU3RhdGUpIHtcblx0XHRpZiAoZnJhZy5pbmRleE9mKHRoaXMub3B0aW9ucy5yb290KSAhPSAwKSBmcmFnID0gdGhpcy5vcHRpb25zLnJvb3QgKyBmcmFnO1xuXHRcdHRoaXMuZnJhZ21lbnQgPSBmcmFnO1xuXHRcdHdpbmRvdy5oaXN0b3J5W29wdGlvbnMucmVwbGFjZSA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSddKHt9LCBkb2N1bWVudC50aXRsZSwgZnJhZyk7XG5cblx0Ly8gSWYgaGFzaCBjaGFuZ2VzIGhhdmVuJ3QgYmVlbiBleHBsaWNpdGx5IGRpc2FibGVkLCB1cGRhdGUgdGhlIGhhc2hcblx0Ly8gZnJhZ21lbnQgdG8gc3RvcmUgaGlzdG9yeS5cblx0fSBlbHNlIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UpIHtcblx0XHR0aGlzLmZyYWdtZW50ID0gZnJhZztcblx0XHR0aGlzLl91cGRhdGVIYXNoKHdpbmRvdy5sb2NhdGlvbiwgZnJhZywgb3B0aW9ucy5yZXBsYWNlKTtcblx0XHRpZiAodGhpcy5pZnJhbWUgJiYgKGZyYWcgIT0gdGhpcy5nZXRGcmFnbWVudCh0aGlzLmdldEhhc2godGhpcy5pZnJhbWUpKSkpIHtcblx0XHQvLyBPcGVuaW5nIGFuZCBjbG9zaW5nIHRoZSBpZnJhbWUgdHJpY2tzIElFNyBhbmQgZWFybGllciB0byBwdXNoIGEgaGlzdG9yeSBlbnRyeSBvbiBoYXNoLXRhZyBjaGFuZ2UuXG5cdFx0Ly8gV2hlbiByZXBsYWNlIGlzIHRydWUsIHdlIGRvbid0IHdhbnQgdGhpcy5cblx0XHRpZighb3B0aW9ucy5yZXBsYWNlKSB0aGlzLmlmcmFtZS5kb2N1bWVudC5vcGVuKCkuY2xvc2UoKTtcblx0XHR0aGlzLl91cGRhdGVIYXNoKHRoaXMuaWZyYW1lLmxvY2F0aW9uLCBmcmFnLCBvcHRpb25zLnJlcGxhY2UpO1xuXHRcdH1cblxuXHQvLyBJZiB5b3UndmUgdG9sZCB1cyB0aGF0IHlvdSBleHBsaWNpdGx5IGRvbid0IHdhbnQgZmFsbGJhY2sgaGFzaGNoYW5nZS1cblx0Ly8gYmFzZWQgaGlzdG9yeSwgdGhlbiBgbmF2aWdhdGVgIGJlY29tZXMgYSBwYWdlIHJlZnJlc2guXG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbih0aGlzLm9wdGlvbnMucm9vdCArIGZyYWdtZW50KTtcblx0fVxuXHRpZiAob3B0aW9ucy50cmlnZ2VyKSB0aGlzLmxvYWRVcmwoZnJhZ21lbnQpO1xuXHR9LFxuXG5cdC8vIFVwZGF0ZSB0aGUgaGFzaCBsb2NhdGlvbiwgZWl0aGVyIHJlcGxhY2luZyB0aGUgY3VycmVudCBlbnRyeSwgb3IgYWRkaW5nXG5cdC8vIGEgbmV3IG9uZSB0byB0aGUgYnJvd3NlciBoaXN0b3J5LlxuXHRfdXBkYXRlSGFzaDogZnVuY3Rpb24obG9jYXRpb24sIGZyYWdtZW50LCByZXBsYWNlKSB7XG5cdGlmIChyZXBsYWNlKSB7XG5cdFx0bG9jYXRpb24ucmVwbGFjZShsb2NhdGlvbi50b1N0cmluZygpLnJlcGxhY2UoLyhqYXZhc2NyaXB0OnwjKS4qJC8sICcnKSArICcjJyArIGZyYWdtZW50KTtcblx0fSBlbHNlIHtcblx0XHRsb2NhdGlvbi5oYXNoID0gZnJhZ21lbnQ7XG5cdH1cblx0fVxufSk7XG5cbi8vIEJhY2tib25lLlZpZXdcbi8vIC0tLS0tLS0tLS0tLS1cblxuLy8gQ3JlYXRpbmcgYSBCYWNrYm9uZS5WaWV3IGNyZWF0ZXMgaXRzIGluaXRpYWwgZWxlbWVudCBvdXRzaWRlIG9mIHRoZSBET00sXG4vLyBpZiBhbiBleGlzdGluZyBlbGVtZW50IGlzIG5vdCBwcm92aWRlZC4uLlxudmFyIFZpZXcgPSBCYWNrYm9uZS5WaWV3ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR0aGlzLmNpZCA9IF8udW5pcXVlSWQoJ3ZpZXcnKTtcblx0dGhpcy5fY29uZmlndXJlKG9wdGlvbnMgfHwge30pO1xuXHR0aGlzLl9lbnN1cmVFbGVtZW50KCk7XG5cdHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG59O1xuXG4vLyBDYWNoZWQgcmVnZXggdG8gc3BsaXQga2V5cyBmb3IgYGRlbGVnYXRlYC5cbnZhciBkZWxlZ2F0ZUV2ZW50U3BsaXR0ZXIgPSAvXihcXFMrKVxccyooLiopJC87XG5cbi8vIExpc3Qgb2YgdmlldyBvcHRpb25zIHRvIGJlIG1lcmdlZCBhcyBwcm9wZXJ0aWVzLlxudmFyIHZpZXdPcHRpb25zID0gWydtb2RlbCcsICdjb2xsZWN0aW9uJywgJ2VsJywgJ2lkJywgJ2F0dHJpYnV0ZXMnLCAnY2xhc3NOYW1lJywgJ3RhZ05hbWUnXTtcblxuLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKkJhY2tib25lLlZpZXcqKiBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuXy5leHRlbmQoVmlldy5wcm90b3R5cGUsIEV2ZW50cywge1xuXG5cdC8vIFRoZSBkZWZhdWx0IGB0YWdOYW1lYCBvZiBhIFZpZXcncyBlbGVtZW50IGlzIGBcImRpdlwiYC5cblx0dGFnTmFtZTogJ2RpdicsXG5cblx0Ly8galF1ZXJ5IGRlbGVnYXRlIGZvciBlbGVtZW50IGxvb2t1cCwgc2NvcGVkIHRvIERPTSBlbGVtZW50cyB3aXRoaW4gdGhlXG5cdC8vIGN1cnJlbnQgdmlldy4gVGhpcyBzaG91bGQgYmUgcHJlZmVyZWQgdG8gZ2xvYmFsIGxvb2t1cHMgd2hlcmUgcG9zc2libGUuXG5cdCQ6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdHJldHVybiB0aGlzLiRlbC5maW5kKHNlbGVjdG9yKTtcblx0fSxcblxuXHQvLyBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cblx0Ly8gaW5pdGlhbGl6YXRpb24gbG9naWMuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuXHQvLyAqKnJlbmRlcioqIGlzIHRoZSBjb3JlIGZ1bmN0aW9uIHRoYXQgeW91ciB2aWV3IHNob3VsZCBvdmVycmlkZSwgaW4gb3JkZXJcblx0Ly8gdG8gcG9wdWxhdGUgaXRzIGVsZW1lbnQgKGB0aGlzLmVsYCksIHdpdGggdGhlIGFwcHJvcHJpYXRlIEhUTUwuIFRoZVxuXHQvLyBjb252ZW50aW9uIGlzIGZvciAqKnJlbmRlcioqIHRvIGFsd2F5cyByZXR1cm4gYHRoaXNgLlxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBSZW1vdmUgdGhpcyB2aWV3IGZyb20gdGhlIERPTS4gTm90ZSB0aGF0IHRoZSB2aWV3IGlzbid0IHByZXNlbnQgaW4gdGhlXG5cdC8vIERPTSBieSBkZWZhdWx0LCBzbyBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSBiZSBhIG5vLW9wLlxuXHRyZW1vdmU6IGZ1bmN0aW9uKCkge1xuXHR0aGlzLiRlbC5yZW1vdmUoKTtcblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gRm9yIHNtYWxsIGFtb3VudHMgb2YgRE9NIEVsZW1lbnRzLCB3aGVyZSBhIGZ1bGwtYmxvd24gdGVtcGxhdGUgaXNuJ3Rcblx0Ly8gbmVlZGVkLCB1c2UgKiptYWtlKiogdG8gbWFudWZhY3R1cmUgZWxlbWVudHMsIG9uZSBhdCBhIHRpbWUuXG5cdC8vXG5cdC8vICAgICB2YXIgZWwgPSB0aGlzLm1ha2UoJ2xpJywgeydjbGFzcyc6ICdyb3cnfSwgdGhpcy5tb2RlbC5lc2NhcGUoJ3RpdGxlJykpO1xuXHQvL1xuXHRtYWtlOiBmdW5jdGlvbih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjb250ZW50KSB7XG5cdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cdGlmIChhdHRyaWJ1dGVzKSAkKGVsKS5hdHRyKGF0dHJpYnV0ZXMpO1xuXHRpZiAoY29udGVudCkgJChlbCkuaHRtbChjb250ZW50KTtcblx0cmV0dXJuIGVsO1xuXHR9LFxuXG5cdC8vIENoYW5nZSB0aGUgdmlldydzIGVsZW1lbnQgKGB0aGlzLmVsYCBwcm9wZXJ0eSksIGluY2x1ZGluZyBldmVudFxuXHQvLyByZS1kZWxlZ2F0aW9uLlxuXHRzZXRFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50LCBkZWxlZ2F0ZSkge1xuXHRpZiAodGhpcy4kZWwpIHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuXHR0aGlzLiRlbCA9IChlbGVtZW50IGluc3RhbmNlb2YgJCkgPyBlbGVtZW50IDogJChlbGVtZW50KTtcblx0dGhpcy5lbCA9IHRoaXMuJGVsWzBdO1xuXHRpZiAoZGVsZWdhdGUgIT09IGZhbHNlKSB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG5cdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIFNldCBjYWxsYmFja3MsIHdoZXJlIGB0aGlzLmV2ZW50c2AgaXMgYSBoYXNoIG9mXG5cdC8vXG5cdC8vICp7XCJldmVudCBzZWxlY3RvclwiOiBcImNhbGxiYWNrXCJ9KlxuXHQvL1xuXHQvLyAgICAge1xuXHQvLyAgICAgICAnbW91c2Vkb3duIC50aXRsZSc6ICAnZWRpdCcsXG5cdC8vICAgICAgICdjbGljayAuYnV0dG9uJzogICAgICdzYXZlJ1xuXHQvLyAgICAgICAnY2xpY2sgLm9wZW4nOiAgICAgICBmdW5jdGlvbihlKSB7IC4uLiB9XG5cdC8vICAgICB9XG5cdC8vXG5cdC8vIHBhaXJzLiBDYWxsYmFja3Mgd2lsbCBiZSBib3VuZCB0byB0aGUgdmlldywgd2l0aCBgdGhpc2Agc2V0IHByb3Blcmx5LlxuXHQvLyBVc2VzIGV2ZW50IGRlbGVnYXRpb24gZm9yIGVmZmljaWVuY3kuXG5cdC8vIE9taXR0aW5nIHRoZSBzZWxlY3RvciBiaW5kcyB0aGUgZXZlbnQgdG8gYHRoaXMuZWxgLlxuXHQvLyBUaGlzIG9ubHkgd29ya3MgZm9yIGRlbGVnYXRlLWFibGUgZXZlbnRzOiBub3QgYGZvY3VzYCwgYGJsdXJgLCBhbmRcblx0Ly8gbm90IGBjaGFuZ2VgLCBgc3VibWl0YCwgYW5kIGByZXNldGAgaW4gSW50ZXJuZXQgRXhwbG9yZXIuXG5cdGRlbGVnYXRlRXZlbnRzOiBmdW5jdGlvbihldmVudHMpIHtcblx0aWYgKCEoZXZlbnRzIHx8IChldmVudHMgPSBnZXRWYWx1ZSh0aGlzLCAnZXZlbnRzJykpKSkgcmV0dXJuO1xuXHR0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcblx0Zm9yICh2YXIga2V5IGluIGV2ZW50cykge1xuXHRcdHZhciBtZXRob2QgPSBldmVudHNba2V5XTtcblx0XHRpZiAoIV8uaXNGdW5jdGlvbihtZXRob2QpKSBtZXRob2QgPSB0aGlzW2V2ZW50c1trZXldXTtcblx0XHRpZiAoIW1ldGhvZCkgdGhyb3cgbmV3IEVycm9yKCdNZXRob2QgXCInICsgZXZlbnRzW2tleV0gKyAnXCIgZG9lcyBub3QgZXhpc3QnKTtcblx0XHR2YXIgbWF0Y2ggPSBrZXkubWF0Y2goZGVsZWdhdGVFdmVudFNwbGl0dGVyKTtcblx0XHR2YXIgZXZlbnROYW1lID0gbWF0Y2hbMV0sIHNlbGVjdG9yID0gbWF0Y2hbMl07XG5cdFx0bWV0aG9kID0gXy5iaW5kKG1ldGhvZCwgdGhpcyk7XG5cdFx0ZXZlbnROYW1lICs9ICcuZGVsZWdhdGVFdmVudHMnICsgdGhpcy5jaWQ7XG5cdFx0aWYgKHNlbGVjdG9yID09PSAnJykge1xuXHRcdHRoaXMuJGVsLmJpbmQoZXZlbnROYW1lLCBtZXRob2QpO1xuXHRcdH0gZWxzZSB7XG5cdFx0dGhpcy4kZWwuZGVsZWdhdGUoc2VsZWN0b3IsIGV2ZW50TmFtZSwgbWV0aG9kKTtcblx0XHR9XG5cdH1cblx0fSxcblxuXHQvLyBDbGVhcnMgYWxsIGNhbGxiYWNrcyBwcmV2aW91c2x5IGJvdW5kIHRvIHRoZSB2aWV3IHdpdGggYGRlbGVnYXRlRXZlbnRzYC5cblx0Ly8gWW91IHVzdWFsbHkgZG9uJ3QgbmVlZCB0byB1c2UgdGhpcywgYnV0IG1heSB3aXNoIHRvIGlmIHlvdSBoYXZlIG11bHRpcGxlXG5cdC8vIEJhY2tib25lIHZpZXdzIGF0dGFjaGVkIHRvIHRoZSBzYW1lIERPTSBlbGVtZW50LlxuXHR1bmRlbGVnYXRlRXZlbnRzOiBmdW5jdGlvbigpIHtcblx0dGhpcy4kZWwudW5iaW5kKCcuZGVsZWdhdGVFdmVudHMnICsgdGhpcy5jaWQpO1xuXHR9LFxuXG5cdC8vIFBlcmZvcm1zIHRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24gb2YgYSBWaWV3IHdpdGggYSBzZXQgb2Ygb3B0aW9ucy5cblx0Ly8gS2V5cyB3aXRoIHNwZWNpYWwgbWVhbmluZyAqKG1vZGVsLCBjb2xsZWN0aW9uLCBpZCwgY2xhc3NOYW1lKSosIGFyZVxuXHQvLyBhdHRhY2hlZCBkaXJlY3RseSB0byB0aGUgdmlldy5cblx0X2NvbmZpZ3VyZTogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRpZiAodGhpcy5vcHRpb25zKSBvcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cdGZvciAodmFyIGkgPSAwLCBsID0gdmlld09wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0dmFyIGF0dHIgPSB2aWV3T3B0aW9uc1tpXTtcblx0XHRpZiAob3B0aW9uc1thdHRyXSkgdGhpc1thdHRyXSA9IG9wdGlvbnNbYXR0cl07XG5cdH1cblx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0fSxcblxuXHQvLyBFbnN1cmUgdGhhdCB0aGUgVmlldyBoYXMgYSBET00gZWxlbWVudCB0byByZW5kZXIgaW50by5cblx0Ly8gSWYgYHRoaXMuZWxgIGlzIGEgc3RyaW5nLCBwYXNzIGl0IHRocm91Z2ggYCQoKWAsIHRha2UgdGhlIGZpcnN0XG5cdC8vIG1hdGNoaW5nIGVsZW1lbnQsIGFuZCByZS1hc3NpZ24gaXQgdG8gYGVsYC4gT3RoZXJ3aXNlLCBjcmVhdGVcblx0Ly8gYW4gZWxlbWVudCBmcm9tIHRoZSBgaWRgLCBgY2xhc3NOYW1lYCBhbmQgYHRhZ05hbWVgIHByb3BlcnRpZXMuXG5cdF9lbnN1cmVFbGVtZW50OiBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLmVsKSB7XG5cdFx0dmFyIGF0dHJzID0gZ2V0VmFsdWUodGhpcywgJ2F0dHJpYnV0ZXMnKSB8fCB7fTtcblx0XHRpZiAodGhpcy5pZCkgYXR0cnMuaWQgPSB0aGlzLmlkO1xuXHRcdGlmICh0aGlzLmNsYXNzTmFtZSkgYXR0cnNbJ2NsYXNzJ10gPSB0aGlzLmNsYXNzTmFtZTtcblx0XHR0aGlzLnNldEVsZW1lbnQodGhpcy5tYWtlKHRoaXMudGFnTmFtZSwgYXR0cnMpLCBmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5zZXRFbGVtZW50KHRoaXMuZWwsIGZhbHNlKTtcblx0fVxuXHR9XG5cbn0pO1xuXG4vLyBUaGUgc2VsZi1wcm9wYWdhdGluZyBleHRlbmQgZnVuY3Rpb24gdGhhdCBCYWNrYm9uZSBjbGFzc2VzIHVzZS5cbnZhciBleHRlbmQgPSBmdW5jdGlvbiAocHJvdG9Qcm9wcywgY2xhc3NQcm9wcykge1xuXHR2YXIgY2hpbGQgPSBpbmhlcml0cyh0aGlzLCBwcm90b1Byb3BzLCBjbGFzc1Byb3BzKTtcblx0Y2hpbGQuZXh0ZW5kID0gdGhpcy5leHRlbmQ7XG5cdHJldHVybiBjaGlsZDtcbn07XG5cbi8vIFNldCB1cCBpbmhlcml0YW5jZSBmb3IgdGhlIG1vZGVsLCBjb2xsZWN0aW9uLCBhbmQgdmlldy5cbk1vZGVsLmV4dGVuZCA9IENvbGxlY3Rpb24uZXh0ZW5kID0gUm91dGVyLmV4dGVuZCA9IFZpZXcuZXh0ZW5kID0gZXh0ZW5kO1xuXG4vLyBCYWNrYm9uZS5zeW5jXG4vLyAtLS0tLS0tLS0tLS0tXG5cbi8vIE1hcCBmcm9tIENSVUQgdG8gSFRUUCBmb3Igb3VyIGRlZmF1bHQgYEJhY2tib25lLnN5bmNgIGltcGxlbWVudGF0aW9uLlxudmFyIG1ldGhvZE1hcCA9IHtcblx0J2NyZWF0ZSc6ICdQT1NUJyxcblx0J3VwZGF0ZSc6ICdQVVQnLFxuXHQnZGVsZXRlJzogJ0RFTEVURScsXG5cdCdyZWFkJzogICAnR0VUJ1xufTtcblxuLy8gT3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiB0byBjaGFuZ2UgdGhlIG1hbm5lciBpbiB3aGljaCBCYWNrYm9uZSBwZXJzaXN0c1xuLy8gbW9kZWxzIHRvIHRoZSBzZXJ2ZXIuIFlvdSB3aWxsIGJlIHBhc3NlZCB0aGUgdHlwZSBvZiByZXF1ZXN0LCBhbmQgdGhlXG4vLyBtb2RlbCBpbiBxdWVzdGlvbi4gQnkgZGVmYXVsdCwgbWFrZXMgYSBSRVNUZnVsIEFqYXggcmVxdWVzdFxuLy8gdG8gdGhlIG1vZGVsJ3MgYHVybCgpYC4gU29tZSBwb3NzaWJsZSBjdXN0b21pemF0aW9ucyBjb3VsZCBiZTpcbi8vXG4vLyAqIFVzZSBgc2V0VGltZW91dGAgdG8gYmF0Y2ggcmFwaWQtZmlyZSB1cGRhdGVzIGludG8gYSBzaW5nbGUgcmVxdWVzdC5cbi8vICogU2VuZCB1cCB0aGUgbW9kZWxzIGFzIFhNTCBpbnN0ZWFkIG9mIEpTT04uXG4vLyAqIFBlcnNpc3QgbW9kZWxzIHZpYSBXZWJTb2NrZXRzIGluc3RlYWQgb2YgQWpheC5cbi8vXG4vLyBUdXJuIG9uIGBCYWNrYm9uZS5lbXVsYXRlSFRUUGAgaW4gb3JkZXIgdG8gc2VuZCBgUFVUYCBhbmQgYERFTEVURWAgcmVxdWVzdHNcbi8vIGFzIGBQT1NUYCwgd2l0aCBhIGBfbWV0aG9kYCBwYXJhbWV0ZXIgY29udGFpbmluZyB0aGUgdHJ1ZSBIVFRQIG1ldGhvZCxcbi8vIGFzIHdlbGwgYXMgYWxsIHJlcXVlc3RzIHdpdGggdGhlIGJvZHkgYXMgYGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZGBcbi8vIGluc3RlYWQgb2YgYGFwcGxpY2F0aW9uL2pzb25gIHdpdGggdGhlIG1vZGVsIGluIGEgcGFyYW0gbmFtZWQgYG1vZGVsYC5cbi8vIFVzZWZ1bCB3aGVuIGludGVyZmFjaW5nIHdpdGggc2VydmVyLXNpZGUgbGFuZ3VhZ2VzIGxpa2UgKipQSFAqKiB0aGF0IG1ha2Vcbi8vIGl0IGRpZmZpY3VsdCB0byByZWFkIHRoZSBib2R5IG9mIGBQVVRgIHJlcXVlc3RzLlxuQmFja2JvbmUuc3luYyA9IGZ1bmN0aW9uKG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMpIHtcblx0dmFyIHR5cGUgPSBtZXRob2RNYXBbbWV0aG9kXTtcblxuXHQvLyBEZWZhdWx0IG9wdGlvbnMsIHVubGVzcyBzcGVjaWZpZWQuXG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cblx0Ly8gRGVmYXVsdCBKU09OLXJlcXVlc3Qgb3B0aW9ucy5cblx0dmFyIHBhcmFtcyA9IHt0eXBlOiB0eXBlLCBkYXRhVHlwZTogJ2pzb24nfTtcblxuXHQvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGEgVVJMLlxuXHRpZiAoIW9wdGlvbnMudXJsKSB7XG5cdHBhcmFtcy51cmwgPSBnZXRWYWx1ZShtb2RlbCwgJ3VybCcpIHx8IHVybEVycm9yKCk7XG5cdH1cblxuXHQvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIHRoZSBhcHByb3ByaWF0ZSByZXF1ZXN0IGRhdGEuXG5cdGlmICghb3B0aW9ucy5kYXRhICYmIG1vZGVsICYmIChtZXRob2QgPT0gJ2NyZWF0ZScgfHwgbWV0aG9kID09ICd1cGRhdGUnKSkge1xuXHRwYXJhbXMuY29udGVudFR5cGUgPSAnYXBwbGljYXRpb24vanNvbic7XG5cdHBhcmFtcy5kYXRhID0gSlNPTi5zdHJpbmdpZnkobW9kZWwudG9KU09OKCkpO1xuXHR9XG5cblx0Ly8gRm9yIG9sZGVyIHNlcnZlcnMsIGVtdWxhdGUgSlNPTiBieSBlbmNvZGluZyB0aGUgcmVxdWVzdCBpbnRvIGFuIEhUTUwtZm9ybS5cblx0aWYgKEJhY2tib25lLmVtdWxhdGVKU09OKSB7XG5cdHBhcmFtcy5jb250ZW50VHlwZSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnO1xuXHRwYXJhbXMuZGF0YSA9IHBhcmFtcy5kYXRhID8ge21vZGVsOiBwYXJhbXMuZGF0YX0gOiB7fTtcblx0fVxuXG5cdC8vIEZvciBvbGRlciBzZXJ2ZXJzLCBlbXVsYXRlIEhUVFAgYnkgbWltaWNraW5nIHRoZSBIVFRQIG1ldGhvZCB3aXRoIGBfbWV0aG9kYFxuXHQvLyBBbmQgYW4gYFgtSFRUUC1NZXRob2QtT3ZlcnJpZGVgIGhlYWRlci5cblx0aWYgKEJhY2tib25lLmVtdWxhdGVIVFRQKSB7XG5cdGlmICh0eXBlID09PSAnUFVUJyB8fCB0eXBlID09PSAnREVMRVRFJykge1xuXHRcdGlmIChCYWNrYm9uZS5lbXVsYXRlSlNPTikgcGFyYW1zLmRhdGEuX21ldGhvZCA9IHR5cGU7XG5cdFx0cGFyYW1zLnR5cGUgPSAnUE9TVCc7XG5cdFx0cGFyYW1zLmJlZm9yZVNlbmQgPSBmdW5jdGlvbih4aHIpIHtcblx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1IVFRQLU1ldGhvZC1PdmVycmlkZScsIHR5cGUpO1xuXHRcdH07XG5cdH1cblx0fVxuXG5cdC8vIERvbid0IHByb2Nlc3MgZGF0YSBvbiBhIG5vbi1HRVQgcmVxdWVzdC5cblx0aWYgKHBhcmFtcy50eXBlICE9PSAnR0VUJyAmJiAhQmFja2JvbmUuZW11bGF0ZUpTT04pIHtcblx0cGFyYW1zLnByb2Nlc3NEYXRhID0gZmFsc2U7XG5cdH1cblxuXHQvLyBNYWtlIHRoZSByZXF1ZXN0LCBhbGxvd2luZyB0aGUgdXNlciB0byBvdmVycmlkZSBhbnkgQWpheCBvcHRpb25zLlxuXHRyZXR1cm4gJC5hamF4KF8uZXh0ZW5kKHBhcmFtcywgb3B0aW9ucykpO1xufTtcblxuLy8gV3JhcCBhbiBvcHRpb25hbCBlcnJvciBjYWxsYmFjayB3aXRoIGEgZmFsbGJhY2sgZXJyb3IgZXZlbnQuXG5CYWNrYm9uZS53cmFwRXJyb3IgPSBmdW5jdGlvbihvbkVycm9yLCBvcmlnaW5hbE1vZGVsLCBvcHRpb25zKSB7XG5cdHJldHVybiBmdW5jdGlvbihtb2RlbCwgcmVzcCkge1xuXHRyZXNwID0gbW9kZWwgPT09IG9yaWdpbmFsTW9kZWwgPyByZXNwIDogbW9kZWw7XG5cdGlmIChvbkVycm9yKSB7XG5cdFx0b25FcnJvcihvcmlnaW5hbE1vZGVsLCByZXNwLCBvcHRpb25zKTtcblx0fSBlbHNlIHtcblx0XHRvcmlnaW5hbE1vZGVsLnRyaWdnZXIoJ2Vycm9yJywgb3JpZ2luYWxNb2RlbCwgcmVzcCwgb3B0aW9ucyk7XG5cdH1cblx0fTtcbn07XG5cbi8vIEhlbHBlcnNcbi8vIC0tLS0tLS1cblxuLy8gU2hhcmVkIGVtcHR5IGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGFpZCBpbiBwcm90b3R5cGUtY2hhaW4gY3JlYXRpb24uXG52YXIgY3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXG4vLyBTaW1pbGFyIHRvIGBnb29nLmluaGVyaXRzYCwgYnV0IHVzZXMgYSBoYXNoIG9mIHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFuZFxuLy8gY2xhc3MgcHJvcGVydGllcyB0byBiZSBleHRlbmRlZC5cbnZhciBpbmhlcml0cyA9IGZ1bmN0aW9uKHBhcmVudCwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcblx0dmFyIGNoaWxkO1xuXG5cdC8vIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgdGhlIG5ldyBzdWJjbGFzcyBpcyBlaXRoZXIgZGVmaW5lZCBieSB5b3Vcblx0Ly8gKHRoZSBcImNvbnN0cnVjdG9yXCIgcHJvcGVydHkgaW4geW91ciBgZXh0ZW5kYCBkZWZpbml0aW9uKSwgb3IgZGVmYXVsdGVkXG5cdC8vIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQncyBjb25zdHJ1Y3Rvci5cblx0aWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuXHRjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG5cdH0gZWxzZSB7XG5cdGNoaWxkID0gZnVuY3Rpb24oKXsgcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG5cdH1cblxuXHQvLyBJbmhlcml0IGNsYXNzIChzdGF0aWMpIHByb3BlcnRpZXMgZnJvbSBwYXJlbnQuXG5cdF8uZXh0ZW5kKGNoaWxkLCBwYXJlbnQpO1xuXG5cdC8vIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG5cdC8vIGBwYXJlbnRgJ3MgY29uc3RydWN0b3IgZnVuY3Rpb24uXG5cdGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcblx0Y2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTtcblxuXHQvLyBBZGQgcHJvdG90eXBlIHByb3BlcnRpZXMgKGluc3RhbmNlIHByb3BlcnRpZXMpIHRvIHRoZSBzdWJjbGFzcyxcblx0Ly8gaWYgc3VwcGxpZWQuXG5cdGlmIChwcm90b1Byb3BzKSBfLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuXG5cdC8vIEFkZCBzdGF0aWMgcHJvcGVydGllcyB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24sIGlmIHN1cHBsaWVkLlxuXHRpZiAoc3RhdGljUHJvcHMpIF8uZXh0ZW5kKGNoaWxkLCBzdGF0aWNQcm9wcyk7XG5cblx0Ly8gQ29ycmVjdGx5IHNldCBjaGlsZCdzIGBwcm90b3R5cGUuY29uc3RydWN0b3JgLlxuXHRjaGlsZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjaGlsZDtcblxuXHQvLyBTZXQgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSBpbiBjYXNlIHRoZSBwYXJlbnQncyBwcm90b3R5cGUgaXMgbmVlZGVkIGxhdGVyLlxuXHRjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG5cdHJldHVybiBjaGlsZDtcbn07XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgYSB2YWx1ZSBmcm9tIGEgQmFja2JvbmUgb2JqZWN0IGFzIGEgcHJvcGVydHlcbi8vIG9yIGFzIGEgZnVuY3Rpb24uXG52YXIgZ2V0VmFsdWUgPSBmdW5jdGlvbihvYmplY3QsIHByb3ApIHtcblx0aWYgKCEob2JqZWN0ICYmIG9iamVjdFtwcm9wXSkpIHJldHVybiBudWxsO1xuXHRyZXR1cm4gXy5pc0Z1bmN0aW9uKG9iamVjdFtwcm9wXSkgPyBvYmplY3RbcHJvcF0oKSA6IG9iamVjdFtwcm9wXTtcbn07XG5cbi8vIFRocm93IGFuIGVycm9yIHdoZW4gYSBVUkwgaXMgbmVlZGVkLCBhbmQgbm9uZSBpcyBzdXBwbGllZC5cbnZhciB1cmxFcnJvciA9IGZ1bmN0aW9uKCkge1xuXHR0aHJvdyBuZXcgRXJyb3IoJ0EgXCJ1cmxcIiBwcm9wZXJ0eSBvciBmdW5jdGlvbiBtdXN0IGJlIHNwZWNpZmllZCcpO1xufTtcblxufSkuY2FsbCh0aGlzKTtcbiJdLCJzb3VyY2VSb290IjoiZDpcXEdJQU5UXFx3dzJcXGJjLWRlYnVnXFxpbmV0dGliZWFjb25cXFJlc291cmNlc1xcYW5kcm9pZFxcYWxsb3kifQ==
