






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
!options.silent&&(
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tib25lLmpzIl0sIm5hbWVzIjpbIkJhY2tib25lIiwicm9vdCIsInByZXZpb3VzQmFja2JvbmUiLCJzbGljZSIsIkFycmF5IiwicHJvdG90eXBlIiwic3BsaWNlIiwiZXhwb3J0cyIsIlZFUlNJT04iLCJfIiwicmVxdWlyZSIsIiQiLCJqUXVlcnkiLCJaZXB0byIsImVuZGVyIiwic2V0RG9tTGlicmFyeSIsImxpYiIsIm5vQ29uZmxpY3QiLCJlbXVsYXRlSFRUUCIsImVtdWxhdGVKU09OIiwiZXZlbnRTcGxpdHRlciIsIkV2ZW50cyIsIm9uIiwiZXZlbnRzIiwiY2FsbGJhY2siLCJjb250ZXh0IiwiY2FsbHMiLCJldmVudCIsIm5vZGUiLCJ0YWlsIiwibGlzdCIsInNwbGl0IiwiX2NhbGxiYWNrcyIsInNoaWZ0IiwibmV4dCIsIm9mZiIsImNiIiwiY3R4Iiwia2V5cyIsInRyaWdnZXIiLCJhcmdzIiwiYWxsIiwicmVzdCIsImNhbGwiLCJhcmd1bWVudHMiLCJhcHBseSIsImNvbmNhdCIsImJpbmQiLCJ1bmJpbmQiLCJNb2RlbCIsImF0dHJpYnV0ZXMiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJwYXJzZSIsImdldFZhbHVlIiwiZXh0ZW5kIiwiY29sbGVjdGlvbiIsIl9lc2NhcGVkQXR0cmlidXRlcyIsImNpZCIsInVuaXF1ZUlkIiwiY2hhbmdlZCIsIl9zaWxlbnQiLCJfcGVuZGluZyIsInNldCIsInNpbGVudCIsIl9wcmV2aW91c0F0dHJpYnV0ZXMiLCJjbG9uZSIsImluaXRpYWxpemUiLCJpZEF0dHJpYnV0ZSIsInRvSlNPTiIsImdldCIsImF0dHIiLCJlc2NhcGUiLCJodG1sIiwidmFsIiwiaGFzIiwia2V5IiwidmFsdWUiLCJhdHRycyIsImlzT2JqZWN0IiwidW5zZXQiLCJfdmFsaWRhdGUiLCJpZCIsImNoYW5nZXMiLCJub3ciLCJlc2NhcGVkIiwicHJldiIsImlzRXF1YWwiLCJjaGFuZ2UiLCJjbGVhciIsImZldGNoIiwibW9kZWwiLCJzdWNjZXNzIiwicmVzcCIsInN0YXR1cyIsInhociIsImVycm9yIiwid3JhcEVycm9yIiwic3luYyIsInNhdmUiLCJjdXJyZW50Iiwid2FpdCIsInNpbGVudE9wdGlvbnMiLCJzZXJ2ZXJBdHRycyIsIm1ldGhvZCIsImlzTmV3IiwiZGVzdHJveSIsInRyaWdnZXJEZXN0cm95IiwidXJsIiwiYmFzZSIsInVybEVycm9yIiwiY2hhckF0IiwibGVuZ3RoIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJjaGFuZ2luZyIsIl9jaGFuZ2luZyIsImlzRW1wdHkiLCJoYXNDaGFuZ2VkIiwiY2hhbmdlZEF0dHJpYnV0ZXMiLCJkaWZmIiwib2xkIiwicHJldmlvdXMiLCJwcmV2aW91c0F0dHJpYnV0ZXMiLCJpc1ZhbGlkIiwidmFsaWRhdGUiLCJDb2xsZWN0aW9uIiwibW9kZWxzIiwiY29tcGFyYXRvciIsIl9yZXNldCIsInJlc2V0IiwibWFwIiwiYWRkIiwiaSIsImluZGV4IiwiY2lkcyIsImlkcyIsImR1cHMiLCJpc0FycmF5IiwiX3ByZXBhcmVNb2RlbCIsIkVycm9yIiwiX2J5Q2lkIiwiX2J5SWQiLCJwdXNoIiwiX29uTW9kZWxFdmVudCIsImF0Iiwic29ydCIsInJlbW92ZSIsImwiLCJnZXRCeUNpZCIsImluZGV4T2YiLCJfcmVtb3ZlUmVmZXJlbmNlIiwicG9wIiwidW5zaGlmdCIsIndoZXJlIiwiZmlsdGVyIiwiYm91bmRDb21wYXJhdG9yIiwic29ydEJ5IiwicGx1Y2siLCJjcmVhdGUiLCJjb2xsIiwibmV4dE1vZGVsIiwiY2hhaW4iLCJtZXRob2RzIiwiZWFjaCIsInRvQXJyYXkiLCJSb3V0ZXIiLCJyb3V0ZXMiLCJfYmluZFJvdXRlcyIsIm5hbWVkUGFyYW0iLCJzcGxhdFBhcmFtIiwiZXNjYXBlUmVnRXhwIiwicm91dGUiLCJuYW1lIiwiaGlzdG9yeSIsIkhpc3RvcnkiLCJpc1JlZ0V4cCIsIl9yb3V0ZVRvUmVnRXhwIiwiZnJhZ21lbnQiLCJfZXh0cmFjdFBhcmFtZXRlcnMiLCJuYXZpZ2F0ZSIsInJlcGxhY2UiLCJSZWdFeHAiLCJleGVjIiwiaGFuZGxlcnMiLCJiaW5kQWxsIiwicm91dGVTdHJpcHBlciIsImlzRXhwbG9yZXIiLCJzdGFydGVkIiwiaW50ZXJ2YWwiLCJnZXRIYXNoIiwid2luZG93T3ZlcnJpZGUiLCJsb2MiLCJsb2NhdGlvbiIsIndpbmRvdyIsIm1hdGNoIiwiaHJlZiIsImdldEZyYWdtZW50IiwiZm9yY2VQdXNoU3RhdGUiLCJfaGFzUHVzaFN0YXRlIiwicGF0aG5hbWUiLCJzZWFyY2giLCJzdWJzdHIiLCJzdGFydCIsIl93YW50c0hhc2hDaGFuZ2UiLCJoYXNoQ2hhbmdlIiwiX3dhbnRzUHVzaFN0YXRlIiwicHVzaFN0YXRlIiwiZG9jTW9kZSIsImRvY3VtZW50IiwiZG9jdW1lbnRNb2RlIiwib2xkSUUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImlmcmFtZSIsImhpZGUiLCJhcHBlbmRUbyIsImNvbnRlbnRXaW5kb3ciLCJjaGVja1VybCIsIl9jaGVja1VybEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJhdFJvb3QiLCJoYXNoIiwicmVwbGFjZVN0YXRlIiwidGl0bGUiLCJwcm90b2NvbCIsImhvc3QiLCJsb2FkVXJsIiwic3RvcCIsImNsZWFySW50ZXJ2YWwiLCJlIiwiZnJhZ21lbnRPdmVycmlkZSIsIm1hdGNoZWQiLCJhbnkiLCJoYW5kbGVyIiwidGVzdCIsImZyYWciLCJfdXBkYXRlSGFzaCIsIm9wZW4iLCJjbG9zZSIsImFzc2lnbiIsInRvU3RyaW5nIiwiVmlldyIsIl9jb25maWd1cmUiLCJfZW5zdXJlRWxlbWVudCIsImRlbGVnYXRlRXZlbnRzIiwiZGVsZWdhdGVFdmVudFNwbGl0dGVyIiwidmlld09wdGlvbnMiLCJ0YWdOYW1lIiwic2VsZWN0b3IiLCIkZWwiLCJmaW5kIiwicmVuZGVyIiwibWFrZSIsImNvbnRlbnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRFbGVtZW50IiwiZWxlbWVudCIsImRlbGVnYXRlIiwidW5kZWxlZ2F0ZUV2ZW50cyIsImlzRnVuY3Rpb24iLCJldmVudE5hbWUiLCJjbGFzc05hbWUiLCJwcm90b1Byb3BzIiwiY2xhc3NQcm9wcyIsImNoaWxkIiwiaW5oZXJpdHMiLCJtZXRob2RNYXAiLCJ0eXBlIiwicGFyYW1zIiwiZGF0YVR5cGUiLCJkYXRhIiwiY29udGVudFR5cGUiLCJKU09OIiwic3RyaW5naWZ5IiwiX21ldGhvZCIsImJlZm9yZVNlbmQiLCJzZXRSZXF1ZXN0SGVhZGVyIiwicHJvY2Vzc0RhdGEiLCJhamF4Iiwib25FcnJvciIsIm9yaWdpbmFsTW9kZWwiLCJjdG9yIiwicGFyZW50Iiwic3RhdGljUHJvcHMiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fc3VwZXJfXyIsIm9iamVjdCIsInByb3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFPQSxDQUFDLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQlBBLFFBbkJPLENBT1BDLElBQUksQ0FBRyxJQVBBLENBV1BDLGdCQUFnQixDQUFHRCxJQUFJLENBQUNELFFBWGpCLENBY1BHLEtBQUssQ0FBR0MsS0FBSyxDQUFDQyxTQUFOLENBQWdCRixLQWRqQixDQWVQRyxNQUFNLENBQUdGLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsTUFmbEI7Ozs7QUF1QlZOLFFBdkJVLENBb0JZLFdBQW5CLFFBQU9PLENBQUFBLE9BcEJBLENBdUJDTixJQUFJLENBQUNELFFBQUwsQ0FBZ0IsRUF2QmpCLENBcUJDTyxPQXJCRDs7OztBQTJCWFAsUUFBUSxDQUFDUSxPQUFULENBQW1CLE9BM0JSOzs7QUE4QlgsR0FBSUMsQ0FBQUEsQ0FBQyxDQUFHUixJQUFJLENBQUNRLENBQWI7QUFDS0EsQ0FBRCxFQUEwQixXQUFuQixRQUFPQyxDQUFBQSxPQS9CUCxHQStCaUNELENBQUMsQ0FBR0MsT0FBTyxDQUFDLG1CQUFELENBL0I1Qzs7O0FBa0NYLEdBQUlDLENBQUFBLENBQUMsQ0FBR1YsSUFBSSxDQUFDVyxNQUFMLEVBQWVYLElBQUksQ0FBQ1ksS0FBcEIsRUFBNkJaLElBQUks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SThCLENBQUFBLEtBQUosQ0FBVSxrREFBVixDQUFOO0FBQ0EsQ0E3NENVOztBQSs0Q1YsQ0EvNENELEVBKzRDR2pHLElBLzRDSCxRIiwic291cmNlc0NvbnRlbnQiOlsiLy8gICAgIEJhY2tib25lLmpzIDAuOS4yXG5cbi8vICAgICAoYykgMjAxMC0yMDEyIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBJbmMuXG4vLyAgICAgQmFja2JvbmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly9iYWNrYm9uZWpzLm9yZ1xuXG4oZnVuY3Rpb24oKXtcblxuLy8gSW5pdGlhbCBTZXR1cFxuLy8gLS0tLS0tLS0tLS0tLVxuXG4vLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IChgd2luZG93YCBpbiB0aGUgYnJvd3NlciwgYGdsb2JhbGBcbi8vIG9uIHRoZSBzZXJ2ZXIpLlxudmFyIHJvb3QgPSB0aGlzO1xuXG4vLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYEJhY2tib25lYCB2YXJpYWJsZSwgc28gdGhhdCBpdCBjYW4gYmVcbi8vIHJlc3RvcmVkIGxhdGVyIG9uLCBpZiBgbm9Db25mbGljdGAgaXMgdXNlZC5cbnZhciBwcmV2aW91c0JhY2tib25lID0gcm9vdC5CYWNrYm9uZTtcblxuLy8gQ3JlYXRlIGEgbG9jYWwgcmVmZXJlbmNlIHRvIHNsaWNlL3NwbGljZS5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBzcGxpY2UgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlO1xuXG4vLyBUaGUgdG9wLWxldmVsIG5hbWVzcGFjZS4gQWxsIHB1YmxpYyBCYWNrYm9uZSBjbGFzc2VzIGFuZCBtb2R1bGVzIHdpbGxcbi8vIGJlIGF0dGFjaGVkIHRvIHRoaXMuIEV4cG9ydGVkIGZvciBib3RoIENvbW1vbkpTIGFuZCB0aGUgYnJvd3Nlci5cbnZhciBCYWNrYm9uZTtcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0QmFja2JvbmUgPSBleHBvcnRzO1xufSBlbHNlIHtcblx0QmFja2JvbmUgPSByb290LkJhY2tib25lID0ge307XG59XG5cbi8vIEN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgbGlicmFyeS4gS2VlcCBpbiBzeW5jIHdpdGggYHBhY2thZ2UuanNvbmAuXG5CYWNrYm9uZS5WRVJTSU9OID0gJzAuOS4yJztcblxuLy8gUmVxdWlyZSBVbmRlcnNjb3JlLCBpZiB3ZSdyZSBvbiB0aGUgc2VydmVyLCBhbmQgaXQncyBub3QgYWxyZWFkeSBwcmVzZW50LlxudmFyIF8gPSByb290Ll87XG5pZiAoIV8gJiYgKHR5cGVvZiByZXF1aXJlICE9PSAndW5kZWZpbmVkJykpIF8gPSByZXF1aXJlKCcvYWxsb3kvdW5kZXJzY29yZScpO1xuXG4vLyBGb3IgQmFja2JvbmUncyBwdXJwb3NlcywgalF1ZXJ5LCBaZXB0bywgb3IgRW5kZXIgb3ducyB0aGUgYCRgIHZhcmlhYmxlLlxudmFyICQgPSByb290LmpRdWVyeSB8fCByb290LlplcHRvIHx8IHJvb3QuZW5kZXI7XG5cbi8vIFNldCB0aGUgSmF2YVNjcmlwdCBsaWJyYXJ5IHRoYXQgd2lsbCBiZSB1c2VkIGZvciBET00gbWFuaXB1bGF0aW9uIGFuZFxuLy8gQWpheCBjYWxscyAoYS5rLmEuIHRoZSBgJGAgdmFyaWFibGUpLiBCeSBkZWZhdWx0IEJhY2tib25lIHdpbGwgdXNlOiBqUXVlcnksXG4vLyBaZXB0bywgb3IgRW5kZXI7IGJ1dCB0aGUgYHNldERvbUxpYnJhcnkoKWAgbWV0aG9kIGxldHMgeW91IGluamVjdCBhblxuLy8gYWx0ZXJuYXRlIEphdmFTY3JpcHQgbGlicmFyeSAob3IgYSBtb2NrIGxpYnJhcnkgZm9yIHRlc3RpbmcgeW91ciB2aWV3c1xuLy8gb3V0c2lkZSBvZiBhIGJyb3dzZXIpLlxuQmFja2JvbmUuc2V0RG9tTGlicmFyeSA9IGZ1bmN0aW9uKGxpYikge1xuXHQkID0gbGliO1xufTtcblxuLy8gUnVucyBCYWNrYm9uZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgQmFja2JvbmVgIHZhcmlhYmxlXG4vLyB0byBpdHMgcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhpcyBCYWNrYm9uZSBvYmplY3QuXG5CYWNrYm9uZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG5cdHJvb3QuQmFja2JvbmUgPSBwcmV2aW91c0JhY2tib25lO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8vIFR1cm4gb24gYGVtdWxhdGVIVFRQYCB0byBzdXBwb3J0IGxlZ2FjeSBIVFRQIHNlcnZlcnMuIFNldHRpbmcgdGhpcyBvcHRpb25cbi8vIHdpbGwgZmFrZSBgXCJQVVRcImAgYW5kIGBcIkRFTEVURVwiYCByZXF1ZXN0cyB2aWEgdGhlIGBfbWV0aG9kYCBwYXJhbWV0ZXIgYW5kXG4vLyBzZXQgYSBgWC1IdHRwLU1ldGhvZC1PdmVycmlkZWAgaGVhZGVyLlxuQmFja2JvbmUuZW11bGF0ZUhUVFAgPSBmYWxzZTtcblxuLy8gVHVybiBvbiBgZW11bGF0ZUpTT05gIHRvIHN1cHBvcnQgbGVnYWN5IHNlcnZlcnMgdGhhdCBjYW4ndCBkZWFsIHdpdGggZGlyZWN0XG4vLyBgYXBwbGljYXRpb24vanNvbmAgcmVxdWVzdHMgLi4uIHdpbGwgZW5jb2RlIHRoZSBib2R5IGFzXG4vLyBgYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkYCBpbnN0ZWFkIGFuZCB3aWxsIHNlbmQgdGhlIG1vZGVsIGluIGFcbi8vIGZvcm0gcGFyYW0gbmFtZWQgYG1vZGVsYC5cbkJhY2tib25lLmVtdWxhdGVKU09OID0gZmFsc2U7XG5cbi8vIEJhY2tib25lLkV2ZW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gc3BsaXQgZXZlbnQgc3RyaW5nc1xudmFyIGV2ZW50U3BsaXR0ZXIgPSAvXFxzKy87XG5cbi8vIEEgbW9kdWxlIHRoYXQgY2FuIGJlIG1peGVkIGluIHRvICphbnkgb2JqZWN0KiBpbiBvcmRlciB0byBwcm92aWRlIGl0IHdpdGhcbi8vIGN1c3RvbSBldmVudHMuIFlvdSBtYXkgYmluZCB3aXRoIGBvbmAgb3IgcmVtb3ZlIHdpdGggYG9mZmAgY2FsbGJhY2sgZnVuY3Rpb25zXG4vLyB0byBhbiBldmVudDsgdHJpZ2dlcmAtaW5nIGFuIGV2ZW50IGZpcmVzIGFsbCBjYWxsYmFja3MgaW4gc3VjY2Vzc2lvbi5cbi8vXG4vLyAgICAgdmFyIG9iamVjdCA9IHt9O1xuLy8gICAgIF8uZXh0ZW5kKG9iamVjdCwgQmFja2JvbmUuRXZlbnRzKTtcbi8vICAgICBvYmplY3Qub24oJ2V4cGFuZCcsIGZ1bmN0aW9uKCl7IGFsZXJ0KCdleHBhbmRlZCcpOyB9KTtcbi8vICAgICBvYmplY3QudHJpZ2dlcignZXhwYW5kJyk7XG4vL1xudmFyIEV2ZW50cyA9IEJhY2tib25lLkV2ZW50cyA9IHtcblxuXHQvLyBCaW5kIG9uZSBvciBtb3JlIHNwYWNlIHNlcGFyYXRlZCBldmVudHMsIGBldmVudHNgLCB0byBhIGBjYWxsYmFja2Bcblx0Ly8gZnVuY3Rpb24uIFBhc3NpbmcgYFwiYWxsXCJgIHdpbGwgYmluZCB0aGUgY2FsbGJhY2sgdG8gYWxsIGV2ZW50cyBmaXJlZC5cblx0b246IGZ1bmN0aW9uKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcblxuXHR2YXIgY2FsbHMsIGV2ZW50LCBub2RlLCB0YWlsLCBsaXN0O1xuXHRpZiAoIWNhbGxiYWNrKSByZXR1cm4gdGhpcztcblx0ZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuXHRjYWxscyA9IHRoaXMuX2NhbGxiYWNrcyB8fCAodGhpcy5fY2FsbGJhY2tzID0ge30pO1xuXG5cdC8vIENyZWF0ZSBhbiBpbW11dGFibGUgY2FsbGJhY2sgbGlzdCwgYWxsb3dpbmcgdHJhdmVyc2FsIGR1cmluZ1xuXHQvLyBtb2RpZmljYXRpb24uICBUaGUgdGFpbCBpcyBhbiBlbXB0eSBvYmplY3QgdGhhdCB3aWxsIGFsd2F5cyBiZSB1c2VkXG5cdC8vIGFzIHRoZSBuZXh0IG5vZGUuXG5cdHdoaWxlIChldmVudCA9IGV2ZW50cy5zaGlmdCgpKSB7XG5cdFx0bGlzdCA9IGNhbGxzW2V2ZW50XTtcblx0XHRub2RlID0gbGlzdCA/IGxpc3QudGFpbCA6IHt9O1xuXHRcdG5vZGUubmV4dCA9IHRhaWwgPSB7fTtcblx0XHRub2RlLmNvbnRleHQgPSBjb250ZXh0O1xuXHRcdG5vZGUuY2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRjYWxsc1tldmVudF0gPSB7dGFpbDogdGFpbCwgbmV4dDogbGlzdCA/IGxpc3QubmV4dCA6IG5vZGV9O1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gUmVtb3ZlIG9uZSBvciBtYW55IGNhbGxiYWNrcy4gSWYgYGNvbnRleHRgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrc1xuXHQvLyB3aXRoIHRoYXQgZnVuY3Rpb24uIElmIGBjYWxsYmFja2AgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgY2FsbGJhY2tzIGZvciB0aGVcblx0Ly8gZXZlbnQuIElmIGBldmVudHNgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGJvdW5kIGNhbGxiYWNrcyBmb3IgYWxsIGV2ZW50cy5cblx0b2ZmOiBmdW5jdGlvbihldmVudHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG5cdHZhciBldmVudCwgY2FsbHMsIG5vZGUsIHRhaWwsIGNiLCBjdHg7XG5cblx0Ly8gTm8gZXZlbnRzLCBvciByZW1vdmluZyAqYWxsKiBldmVudHMuXG5cdGlmICghKGNhbGxzID0gdGhpcy5fY2FsbGJhY2tzKSkgcmV0dXJuO1xuXHRpZiAoIShldmVudHMgfHwgY2FsbGJhY2sgfHwgY29udGV4dCkpIHtcblx0XHRkZWxldGUgdGhpcy5fY2FsbGJhY2tzO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Ly8gTG9vcCB0aHJvdWdoIHRoZSBsaXN0ZWQgZXZlbnRzIGFuZCBjb250ZXh0cywgc3BsaWNpbmcgdGhlbSBvdXQgb2YgdGhlXG5cdC8vIGxpbmtlZCBsaXN0IG9mIGNhbGxiYWNrcyBpZiBhcHByb3ByaWF0ZS5cblx0ZXZlbnRzID0gZXZlbnRzID8gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpIDogXy5rZXlzKGNhbGxzKTtcblx0d2hpbGUgKGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCkpIHtcblx0XHRub2RlID0gY2FsbHNbZXZlbnRdO1xuXHRcdGRlbGV0ZSBjYWxsc1tldmVudF07XG5cdFx0aWYgKCFub2RlIHx8ICEoY2FsbGJhY2sgfHwgY29udGV4dCkpIGNvbnRpbnVlO1xuXHRcdC8vIENyZWF0ZSBhIG5ldyBsaXN0LCBvbWl0dGluZyB0aGUgaW5kaWNhdGVkIGNhbGxiYWNrcy5cblx0XHR0YWlsID0gbm9kZS50YWlsO1xuXHRcdHdoaWxlICgobm9kZSA9IG5vZGUubmV4dCkgIT09IHRhaWwpIHtcblx0XHRjYiA9IG5vZGUuY2FsbGJhY2s7XG5cdFx0Y3R4ID0gbm9kZS5jb250ZXh0O1xuXHRcdGlmICgoY2FsbGJhY2sgJiYgY2IgIT09IGNhbGxiYWNrKSB8fCAoY29udGV4dCAmJiBjdHggIT09IGNvbnRleHQpKSB7XG5cdFx0XHR0aGlzLm9uKGV2ZW50LCBjYiwgY3R4KTtcblx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gVHJpZ2dlciBvbmUgb3IgbWFueSBldmVudHMsIGZpcmluZyBhbGwgYm91bmQgY2FsbGJhY2tzLiBDYWxsYmFja3MgYXJlXG5cdC8vIHBhc3NlZCB0aGUgc2FtZSBhcmd1bWVudHMgYXMgYHRyaWdnZXJgIGlzLCBhcGFydCBmcm9tIHRoZSBldmVudCBuYW1lXG5cdC8vICh1bmxlc3MgeW91J3JlIGxpc3RlbmluZyBvbiBgXCJhbGxcImAsIHdoaWNoIHdpbGwgY2F1c2UgeW91ciBjYWxsYmFjayB0b1xuXHQvLyByZWNlaXZlIHRoZSB0cnVlIG5hbWUgb2YgdGhlIGV2ZW50IGFzIHRoZSBmaXJzdCBhcmd1bWVudCkuXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50cykge1xuXHR2YXIgZXZlbnQsIG5vZGUsIGNhbGxzLCB0YWlsLCBhcmdzLCBhbGwsIHJlc3Q7XG5cdGlmICghKGNhbGxzID0gdGhpcy5fY2FsbGJhY2tzKSkgcmV0dXJuIHRoaXM7XG5cdGFsbCA9IGNhbGxzLmFsbDtcblx0ZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuXHRyZXN0ID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdC8vIEZvciBlYWNoIGV2ZW50LCB3YWxrIHRocm91Z2ggdGhlIGxpbmtlZCBsaXN0IG9mIGNhbGxiYWNrcyB0d2ljZSxcblx0Ly8gZmlyc3QgdG8gdHJpZ2dlciB0aGUgZXZlbnQsIHRoZW4gdG8gdHJpZ2dlciBhbnkgYFwiYWxsXCJgIGNhbGxiYWNrcy5cblx0d2hpbGUgKGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCkpIHtcblx0XHRpZiAobm9kZSA9IGNhbGxzW2V2ZW50XSkge1xuXHRcdHRhaWwgPSBub2RlLnRhaWw7XG5cdFx0d2hpbGUgKChub2RlID0gbm9kZS5uZXh0KSAhPT0gdGFpbCkge1xuXHRcdFx0bm9kZS5jYWxsYmFjay5hcHBseShub2RlLmNvbnRleHQgfHwgdGhpcywgcmVzdCk7XG5cdFx0fVxuXHRcdH1cblx0XHRpZiAobm9kZSA9IGFsbCkge1xuXHRcdHRhaWwgPSBub2RlLnRhaWw7XG5cdFx0YXJncyA9IFtldmVudF0uY29uY2F0KHJlc3QpO1xuXHRcdHdoaWxlICgobm9kZSA9IG5vZGUubmV4dCkgIT09IHRhaWwpIHtcblx0XHRcdG5vZGUuY2FsbGJhY2suYXBwbHkobm9kZS5jb250ZXh0IHx8IHRoaXMsIGFyZ3MpO1xuXHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcblx0fVxuXG59O1xuXG4vLyBBbGlhc2VzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbkV2ZW50cy5iaW5kICAgPSBFdmVudHMub247XG5FdmVudHMudW5iaW5kID0gRXZlbnRzLm9mZjtcblxuLy8gQmFja2JvbmUuTW9kZWxcbi8vIC0tLS0tLS0tLS0tLS0tXG5cbi8vIENyZWF0ZSBhIG5ldyBtb2RlbCwgd2l0aCBkZWZpbmVkIGF0dHJpYnV0ZXMuIEEgY2xpZW50IGlkIChgY2lkYClcbi8vIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGFuZCBhc3NpZ25lZCBmb3IgeW91LlxudmFyIE1vZGVsID0gQmFja2JvbmUuTW9kZWwgPSBmdW5jdGlvbihhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cdHZhciBkZWZhdWx0cztcblx0YXR0cmlidXRlcyB8fCAoYXR0cmlidXRlcyA9IHt9KTtcblx0aWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wYXJzZSkgYXR0cmlidXRlcyA9IHRoaXMucGFyc2UoYXR0cmlidXRlcyk7XG5cdGlmIChkZWZhdWx0cyA9IGdldFZhbHVlKHRoaXMsICdkZWZhdWx0cycpKSB7XG5cdGF0dHJpYnV0ZXMgPSBfLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXHR9XG5cdGlmIChvcHRpb25zICYmIG9wdGlvbnMuY29sbGVjdGlvbikgdGhpcy5jb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuXHR0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcblx0dGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXMgPSB7fTtcblx0dGhpcy5jaWQgPSBfLnVuaXF1ZUlkKCdjJyk7XG5cdHRoaXMuY2hhbmdlZCA9IHt9O1xuXHR0aGlzLl9zaWxlbnQgPSB7fTtcblx0dGhpcy5fcGVuZGluZyA9IHt9O1xuXHR0aGlzLnNldChhdHRyaWJ1dGVzLCB7c2lsZW50OiB0cnVlfSk7XG5cdC8vIFJlc2V0IGNoYW5nZSB0cmFja2luZy5cblx0dGhpcy5jaGFuZ2VkID0ge307XG5cdHRoaXMuX3NpbGVudCA9IHt9O1xuXHR0aGlzLl9wZW5kaW5nID0ge307XG5cdHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcblx0dGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG4vLyBBdHRhY2ggYWxsIGluaGVyaXRhYmxlIG1ldGhvZHMgdG8gdGhlIE1vZGVsIHByb3RvdHlwZS5cbl8uZXh0ZW5kKE1vZGVsLnByb3RvdHlwZSwgRXZlbnRzLCB7XG5cblx0Ly8gQSBoYXNoIG9mIGF0dHJpYnV0ZXMgd2hvc2UgY3VycmVudCBhbmQgcHJldmlvdXMgdmFsdWUgZGlmZmVyLlxuXHRjaGFuZ2VkOiBudWxsLFxuXG5cdC8vIEEgaGFzaCBvZiBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSBzaWxlbnRseSBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHRpbWVcblx0Ly8gYGNoYW5nZWAgd2FzIGNhbGxlZC4gIFdpbGwgYmVjb21lIHBlbmRpbmcgYXR0cmlidXRlcyBvbiB0aGUgbmV4dCBjYWxsLlxuXHRfc2lsZW50OiBudWxsLFxuXG5cdC8vIEEgaGFzaCBvZiBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGAnY2hhbmdlJ2AgZXZlbnRcblx0Ly8gYmVnYW4uXG5cdF9wZW5kaW5nOiBudWxsLFxuXG5cdC8vIFRoZSBkZWZhdWx0IG5hbWUgZm9yIHRoZSBKU09OIGBpZGAgYXR0cmlidXRlIGlzIGBcImlkXCJgLiBNb25nb0RCIGFuZFxuXHQvLyBDb3VjaERCIHVzZXJzIG1heSB3YW50IHRvIHNldCB0aGlzIHRvIGBcIl9pZFwiYC5cblx0aWRBdHRyaWJ1dGU6ICdpZCcsXG5cblx0Ly8gSW5pdGlhbGl6ZSBpcyBhbiBlbXB0eSBmdW5jdGlvbiBieSBkZWZhdWx0LiBPdmVycmlkZSBpdCB3aXRoIHlvdXIgb3duXG5cdC8vIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cblx0Ly8gUmV0dXJuIGEgY29weSBvZiB0aGUgbW9kZWwncyBgYXR0cmlidXRlc2Agb2JqZWN0LlxuXHR0b0pTT046IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0cmV0dXJuIF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcblx0fSxcblxuXHQvLyBHZXQgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cblx0Z2V0OiBmdW5jdGlvbihhdHRyKSB7XG5cdHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG5cdH0sXG5cblx0Ly8gR2V0IHRoZSBIVE1MLWVzY2FwZWQgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuXHRlc2NhcGU6IGZ1bmN0aW9uKGF0dHIpIHtcblx0dmFyIGh0bWw7XG5cdGlmIChodG1sID0gdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl0pIHJldHVybiBodG1sO1xuXHR2YXIgdmFsID0gdGhpcy5nZXQoYXR0cik7XG5cdHJldHVybiB0aGlzLl9lc2NhcGVkQXR0cmlidXRlc1thdHRyXSA9IF8uZXNjYXBlKHZhbCA9PSBudWxsID8gJycgOiAnJyArIHZhbCk7XG5cdH0sXG5cblx0Ly8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGF0dHJpYnV0ZSBjb250YWlucyBhIHZhbHVlIHRoYXQgaXMgbm90IG51bGxcblx0Ly8gb3IgdW5kZWZpbmVkLlxuXHRoYXM6IGZ1bmN0aW9uKGF0dHIpIHtcblx0cmV0dXJuIHRoaXMuZ2V0KGF0dHIpICE9IG51bGw7XG5cdH0sXG5cblx0Ly8gU2V0IGEgaGFzaCBvZiBtb2RlbCBhdHRyaWJ1dGVzIG9uIHRoZSBvYmplY3QsIGZpcmluZyBgXCJjaGFuZ2VcImAgdW5sZXNzXG5cdC8vIHlvdSBjaG9vc2UgdG8gc2lsZW5jZSBpdC5cblx0c2V0OiBmdW5jdGlvbihrZXksIHZhbHVlLCBvcHRpb25zKSB7XG5cdHZhciBhdHRycywgYXR0ciwgdmFsO1xuXG5cdC8vIEhhbmRsZSBib3RoXG5cdGlmIChfLmlzT2JqZWN0KGtleSkgfHwga2V5ID09IG51bGwpIHtcblx0XHRhdHRycyA9IGtleTtcblx0XHRvcHRpb25zID0gdmFsdWU7XG5cdH0gZWxzZSB7XG5cdFx0YXR0cnMgPSB7fTtcblx0XHRhdHRyc1trZXldID0gdmFsdWU7XG5cdH1cblxuXHQvLyBFeHRyYWN0IGF0dHJpYnV0ZXMgYW5kIG9wdGlvbnMuXG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdGlmICghYXR0cnMpIHJldHVybiB0aGlzO1xuXHRpZiAoYXR0cnMgaW5zdGFuY2VvZiBNb2RlbCkgYXR0cnMgPSBhdHRycy5hdHRyaWJ1dGVzO1xuXHRpZiAob3B0aW9ucy51bnNldCkgZm9yIChhdHRyIGluIGF0dHJzKSBhdHRyc1thdHRyXSA9IHZvaWQgMDtcblxuXHQvLyBSdW4gdmFsaWRhdGlvbi5cblx0aWYgKCF0aGlzLl92YWxpZGF0ZShhdHRycywgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcblxuXHQvLyBDaGVjayBmb3IgY2hhbmdlcyBvZiBgaWRgLlxuXHRpZiAodGhpcy5pZEF0dHJpYnV0ZSBpbiBhdHRycykgdGhpcy5pZCA9IGF0dHJzW3RoaXMuaWRBdHRyaWJ1dGVdO1xuXG5cdHZhciBjaGFuZ2VzID0gb3B0aW9ucy5jaGFuZ2VzID0ge307XG5cdHZhciBub3cgPSB0aGlzLmF0dHJpYnV0ZXM7XG5cdHZhciBlc2NhcGVkID0gdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXM7XG5cdHZhciBwcmV2ID0gdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzIHx8IHt9O1xuXG5cdC8vIEZvciBlYWNoIGBzZXRgIGF0dHJpYnV0ZS4uLlxuXHRmb3IgKGF0dHIgaW4gYXR0cnMpIHtcblx0XHR2YWwgPSBhdHRyc1thdHRyXTtcblxuXHRcdC8vIElmIHRoZSBuZXcgYW5kIGN1cnJlbnQgdmFsdWUgZGlmZmVyLCByZWNvcmQgdGhlIGNoYW5nZS5cblx0XHRpZiAoIV8uaXNFcXVhbChub3dbYXR0cl0sIHZhbCkgfHwgKG9wdGlvbnMudW5zZXQgJiYgXy5oYXMobm93LCBhdHRyKSkpIHtcblx0XHRkZWxldGUgZXNjYXBlZFthdHRyXTtcblx0XHQob3B0aW9ucy5zaWxlbnQgPyB0aGlzLl9zaWxlbnQgOiBjaGFuZ2VzKVthdHRyXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gVXBkYXRlIG9yIGRlbGV0ZSB0aGUgY3VycmVudCB2YWx1ZS5cblx0XHRvcHRpb25zLnVuc2V0ID8gZGVsZXRlIG5vd1thdHRyXSA6IG5vd1thdHRyXSA9IHZhbDtcblxuXHRcdC8vIElmIHRoZSBuZXcgYW5kIHByZXZpb3VzIHZhbHVlIGRpZmZlciwgcmVjb3JkIHRoZSBjaGFuZ2UuICBJZiBub3QsXG5cdFx0Ly8gdGhlbiByZW1vdmUgY2hhbmdlcyBmb3IgdGhpcyBhdHRyaWJ1dGUuXG5cdFx0aWYgKCFfLmlzRXF1YWwocHJldlthdHRyXSwgdmFsKSB8fCAoXy5oYXMobm93LCBhdHRyKSAhPSBfLmhhcyhwcmV2LCBhdHRyKSkpIHtcblx0XHR0aGlzLmNoYW5nZWRbYXR0cl0gPSB2YWw7XG5cdFx0aWYgKCFvcHRpb25zLnNpbGVudCkgdGhpcy5fcGVuZGluZ1thdHRyXSA9IHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRkZWxldGUgdGhpcy5jaGFuZ2VkW2F0dHJdO1xuXHRcdGRlbGV0ZSB0aGlzLl9wZW5kaW5nW2F0dHJdO1xuXHRcdH1cblx0fVxuXG5cdC8vIEZpcmUgdGhlIGBcImNoYW5nZVwiYCBldmVudHMuXG5cdGlmICghb3B0aW9ucy5zaWxlbnQpIHRoaXMuY2hhbmdlKG9wdGlvbnMpO1xuXHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBSZW1vdmUgYW4gYXR0cmlidXRlIGZyb20gdGhlIG1vZGVsLCBmaXJpbmcgYFwiY2hhbmdlXCJgIHVubGVzcyB5b3UgY2hvb3NlXG5cdC8vIHRvIHNpbGVuY2UgaXQuIGB1bnNldGAgaXMgYSBub29wIGlmIHRoZSBhdHRyaWJ1dGUgZG9lc24ndCBleGlzdC5cblx0dW5zZXQ6IGZ1bmN0aW9uKGF0dHIsIG9wdGlvbnMpIHtcblx0KG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSkpLnVuc2V0ID0gdHJ1ZTtcblx0cmV0dXJuIHRoaXMuc2V0KGF0dHIsIG51bGwsIG9wdGlvbnMpO1xuXHR9LFxuXG5cdC8vIENsZWFyIGFsbCBhdHRyaWJ1dGVzIG9uIHRoZSBtb2RlbCwgZmlyaW5nIGBcImNoYW5nZVwiYCB1bmxlc3MgeW91IGNob29zZVxuXHQvLyB0byBzaWxlbmNlIGl0LlxuXHRjbGVhcjogZnVuY3Rpb24ob3B0aW9ucykge1xuXHQob3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KSkudW5zZXQgPSB0cnVlO1xuXHRyZXR1cm4gdGhpcy5zZXQoXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpLCBvcHRpb25zKTtcblx0fSxcblxuXHQvLyBGZXRjaCB0aGUgbW9kZWwgZnJvbSB0aGUgc2VydmVyLiBJZiB0aGUgc2VydmVyJ3MgcmVwcmVzZW50YXRpb24gb2YgdGhlXG5cdC8vIG1vZGVsIGRpZmZlcnMgZnJvbSBpdHMgY3VycmVudCBhdHRyaWJ1dGVzLCB0aGV5IHdpbGwgYmUgb3ZlcnJpZGVuLFxuXHQvLyB0cmlnZ2VyaW5nIGEgYFwiY2hhbmdlXCJgIGV2ZW50LlxuXHRmZXRjaDogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcblx0dmFyIG1vZGVsID0gdGhpcztcblx0dmFyIHN1Y2Nlc3MgPSBvcHRpb25zLnN1Y2Nlc3M7XG5cdG9wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG5cdFx0aWYgKCFtb2RlbC5zZXQobW9kZWwucGFyc2UocmVzcCwgeGhyKSwgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcblx0XHRpZiAoc3VjY2Vzcykgc3VjY2Vzcyhtb2RlbCwgcmVzcCk7XG5cdH07XG5cdG9wdGlvbnMuZXJyb3IgPSBCYWNrYm9uZS53cmFwRXJyb3Iob3B0aW9ucy5lcnJvciwgbW9kZWwsIG9wdGlvbnMpO1xuXHRyZXR1cm4gKHRoaXMuc3luYyB8fCBCYWNrYm9uZS5zeW5jKS5jYWxsKHRoaXMsICdyZWFkJywgdGhpcywgb3B0aW9ucyk7XG5cdH0sXG5cblx0Ly8gU2V0IGEgaGFzaCBvZiBtb2RlbCBhdHRyaWJ1dGVzLCBhbmQgc3luYyB0aGUgbW9kZWwgdG8gdGhlIHNlcnZlci5cblx0Ly8gSWYgdGhlIHNlcnZlciByZXR1cm5zIGFuIGF0dHJpYnV0ZXMgaGFzaCB0aGF0IGRpZmZlcnMsIHRoZSBtb2RlbCdzXG5cdC8vIHN0YXRlIHdpbGwgYmUgYHNldGAgYWdhaW4uXG5cdHNhdmU6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcblx0dmFyIGF0dHJzLCBjdXJyZW50O1xuXG5cdC8vIEhhbmRsZSBib3RoIGAoXCJrZXlcIiwgdmFsdWUpYCBhbmQgYCh7a2V5OiB2YWx1ZX0pYCAtc3R5bGUgY2FsbHMuXG5cdGlmIChfLmlzT2JqZWN0KGtleSkgfHwga2V5ID09IG51bGwpIHtcblx0XHRhdHRycyA9IGtleTtcblx0XHRvcHRpb25zID0gdmFsdWU7XG5cdH0gZWxzZSB7XG5cdFx0YXR0cnMgPSB7fTtcblx0XHRhdHRyc1trZXldID0gdmFsdWU7XG5cdH1cblx0b3B0aW9ucyA9IG9wdGlvbnMgPyBfLmNsb25lKG9wdGlvbnMpIDoge307XG5cblx0Ly8gSWYgd2UncmUgXCJ3YWl0XCItaW5nIHRvIHNldCBjaGFuZ2VkIGF0dHJpYnV0ZXMsIHZhbGlkYXRlIGVhcmx5LlxuXHRpZiAob3B0aW9ucy53YWl0KSB7XG5cdFx0aWYgKCF0aGlzLl92YWxpZGF0ZShhdHRycywgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcblx0XHRjdXJyZW50ID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuXHR9XG5cblx0Ly8gUmVndWxhciBzYXZlcyBgc2V0YCBhdHRyaWJ1dGVzIGJlZm9yZSBwZXJzaXN0aW5nIHRvIHRoZSBzZXJ2ZXIuXG5cdHZhciBzaWxlbnRPcHRpb25zID0gXy5leHRlbmQoe30sIG9wdGlvbnMsIHtzaWxlbnQ6IHRydWV9KTtcblx0aWYgKGF0dHJzICYmICF0aGlzLnNldChhdHRycywgb3B0aW9ucy53YWl0ID8gc2lsZW50T3B0aW9ucyA6IG9wdGlvbnMpKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gQWZ0ZXIgYSBzdWNjZXNzZnVsIHNlcnZlci1zaWRlIHNhdmUsIHRoZSBjbGllbnQgaXMgKG9wdGlvbmFsbHkpXG5cdC8vIHVwZGF0ZWQgd2l0aCB0aGUgc2VydmVyLXNpZGUgc3RhdGUuXG5cdHZhciBtb2RlbCA9IHRoaXM7XG5cdHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuXHRvcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuXHRcdHZhciBzZXJ2ZXJBdHRycyA9IG1vZGVsLnBhcnNlKHJlc3AsIHhocik7XG5cdFx0aWYgKG9wdGlvbnMud2FpdCkge1xuXHRcdGRlbGV0ZSBvcHRpb25zLndhaXQ7XG5cdFx0c2VydmVyQXR0cnMgPSBfLmV4dGVuZChhdHRycyB8fCB7fSwgc2VydmVyQXR0cnMpO1xuXHRcdH1cblx0XHRpZiAoIW1vZGVsLnNldChzZXJ2ZXJBdHRycywgb3B0aW9ucykpIHJldHVybiBmYWxzZTtcblx0XHRpZiAoc3VjY2Vzcykge1xuXHRcdHN1Y2Nlc3MobW9kZWwsIHJlc3ApO1xuXHRcdH0gZWxzZSB7XG5cdFx0bW9kZWwudHJpZ2dlcignc3luYycsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRmluaXNoIGNvbmZpZ3VyaW5nIGFuZCBzZW5kaW5nIHRoZSBBamF4IHJlcXVlc3QuXG5cdG9wdGlvbnMuZXJyb3IgPSBCYWNrYm9uZS53cmFwRXJyb3Iob3B0aW9ucy5lcnJvciwgbW9kZWwsIG9wdGlvbnMpO1xuXHR2YXIgbWV0aG9kID0gdGhpcy5pc05ldygpID8gJ2NyZWF0ZScgOiAndXBkYXRlJztcblx0dmFyIHhociA9ICh0aGlzLnN5bmMgfHwgQmFja2JvbmUuc3luYykuY2FsbCh0aGlzLCBtZXRob2QsIHRoaXMsIG9wdGlvbnMpO1xuXHRpZiAob3B0aW9ucy53YWl0KSB0aGlzLnNldChjdXJyZW50LCBzaWxlbnRPcHRpb25zKTtcblx0cmV0dXJuIHhocjtcblx0fSxcblxuXHQvLyBEZXN0cm95IHRoaXMgbW9kZWwgb24gdGhlIHNlcnZlciBpZiBpdCB3YXMgYWxyZWFkeSBwZXJzaXN0ZWQuXG5cdC8vIE9wdGltaXN0aWNhbGx5IHJlbW92ZXMgdGhlIG1vZGVsIGZyb20gaXRzIGNvbGxlY3Rpb24sIGlmIGl0IGhhcyBvbmUuXG5cdC8vIElmIGB3YWl0OiB0cnVlYCBpcyBwYXNzZWQsIHdhaXRzIGZvciB0aGUgc2VydmVyIHRvIHJlc3BvbmQgYmVmb3JlIHJlbW92YWwuXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgPyBfLmNsb25lKG9wdGlvbnMpIDoge307XG5cdHZhciBtb2RlbCA9IHRoaXM7XG5cdHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuXG5cdHZhciB0cmlnZ2VyRGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXHRcdG1vZGVsLnRyaWdnZXIoJ2Rlc3Ryb3knLCBtb2RlbCwgbW9kZWwuY29sbGVjdGlvbiwgb3B0aW9ucyk7XG5cdH07XG5cblx0aWYgKHRoaXMuaXNOZXcoKSkge1xuXHRcdHRyaWdnZXJEZXN0cm95KCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0b3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcCkge1xuXHRcdGlmIChvcHRpb25zLndhaXQpIHRyaWdnZXJEZXN0cm95KCk7XG5cdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRzdWNjZXNzKG1vZGVsLCByZXNwKTtcblx0XHR9IGVsc2Uge1xuXHRcdG1vZGVsLnRyaWdnZXIoJ3N5bmMnLCBtb2RlbCwgcmVzcCwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9O1xuXG5cdG9wdGlvbnMuZXJyb3IgPSBCYWNrYm9uZS53cmFwRXJyb3Iob3B0aW9ucy5lcnJvciwgbW9kZWwsIG9wdGlvbnMpO1xuXHR2YXIgeGhyID0gKHRoaXMuc3luYyB8fCBCYWNrYm9uZS5zeW5jKS5jYWxsKHRoaXMsICdkZWxldGUnLCB0aGlzLCBvcHRpb25zKTtcblx0aWYgKCFvcHRpb25zLndhaXQpIHRyaWdnZXJEZXN0cm95KCk7XG5cdHJldHVybiB4aHI7XG5cdH0sXG5cblx0Ly8gRGVmYXVsdCBVUkwgZm9yIHRoZSBtb2RlbCdzIHJlcHJlc2VudGF0aW9uIG9uIHRoZSBzZXJ2ZXIgLS0gaWYgeW91J3JlXG5cdC8vIHVzaW5nIEJhY2tib25lJ3MgcmVzdGZ1bCBtZXRob2RzLCBvdmVycmlkZSB0aGlzIHRvIGNoYW5nZSB0aGUgZW5kcG9pbnRcblx0Ly8gdGhhdCB3aWxsIGJlIGNhbGxlZC5cblx0dXJsOiBmdW5jdGlvbigpIHtcblx0dmFyIGJhc2UgPSBnZXRWYWx1ZSh0aGlzLCAndXJsUm9vdCcpIHx8IGdldFZhbHVlKHRoaXMuY29sbGVjdGlvbiwgJ3VybCcpIHx8IHVybEVycm9yKCk7XG5cdGlmICh0aGlzLmlzTmV3KCkpIHJldHVybiBiYXNlO1xuXHRyZXR1cm4gYmFzZSArIChiYXNlLmNoYXJBdChiYXNlLmxlbmd0aCAtIDEpID09ICcvJyA/ICcnIDogJy8nKSArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmlkKTtcblx0fSxcblxuXHQvLyAqKnBhcnNlKiogY29udmVydHMgYSByZXNwb25zZSBpbnRvIHRoZSBoYXNoIG9mIGF0dHJpYnV0ZXMgdG8gYmUgYHNldGAgb25cblx0Ly8gdGhlIG1vZGVsLiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBpcyBqdXN0IHRvIHBhc3MgdGhlIHJlc3BvbnNlIGFsb25nLlxuXHRwYXJzZTogZnVuY3Rpb24ocmVzcCwgeGhyKSB7XG5cdHJldHVybiByZXNwO1xuXHR9LFxuXG5cdC8vIENyZWF0ZSBhIG5ldyBtb2RlbCB3aXRoIGlkZW50aWNhbCBhdHRyaWJ1dGVzIHRvIHRoaXMgb25lLlxuXHRjbG9uZTogZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLmF0dHJpYnV0ZXMpO1xuXHR9LFxuXG5cdC8vIEEgbW9kZWwgaXMgbmV3IGlmIGl0IGhhcyBuZXZlciBiZWVuIHNhdmVkIHRvIHRoZSBzZXJ2ZXIsIGFuZCBsYWNrcyBhbiBpZC5cblx0aXNOZXc6IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5pZCA9PSBudWxsO1xuXHR9LFxuXG5cdC8vIENhbGwgdGhpcyBtZXRob2QgdG8gbWFudWFsbHkgZmlyZSBhIGBcImNoYW5nZVwiYCBldmVudCBmb3IgdGhpcyBtb2RlbCBhbmRcblx0Ly8gYSBgXCJjaGFuZ2U6YXR0cmlidXRlXCJgIGV2ZW50IGZvciBlYWNoIGNoYW5nZWQgYXR0cmlidXRlLlxuXHQvLyBDYWxsaW5nIHRoaXMgd2lsbCBjYXVzZSBhbGwgb2JqZWN0cyBvYnNlcnZpbmcgdGhlIG1vZGVsIHRvIHVwZGF0ZS5cblx0Y2hhbmdlOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdHZhciBjaGFuZ2luZyA9IHRoaXMuX2NoYW5naW5nO1xuXHR0aGlzLl9jaGFuZ2luZyA9IHRydWU7XG5cblx0Ly8gU2lsZW50IGNoYW5nZXMgYmVjb21lIHBlbmRpbmcgY2hhbmdlcy5cblx0Zm9yICh2YXIgYXR0ciBpbiB0aGlzLl9zaWxlbnQpIHRoaXMuX3BlbmRpbmdbYXR0cl0gPSB0cnVlO1xuXG5cdC8vIFNpbGVudCBjaGFuZ2VzIGFyZSB0cmlnZ2VyZWQuXG5cdHZhciBjaGFuZ2VzID0gXy5leHRlbmQoe30sIG9wdGlvbnMuY2hhbmdlcywgdGhpcy5fc2lsZW50KTtcblx0dGhpcy5fc2lsZW50ID0ge307XG5cdGZvciAodmFyIGF0dHIgaW4gY2hhbmdlcykge1xuXHRcdHRoaXMudHJpZ2dlcignY2hhbmdlOicgKyBhdHRyLCB0aGlzLCB0aGlzLmdldChhdHRyKSwgb3B0aW9ucyk7XG5cdH1cblx0aWYgKGNoYW5naW5nKSByZXR1cm4gdGhpcztcblxuXHQvLyBDb250aW51ZSBmaXJpbmcgYFwiY2hhbmdlXCJgIGV2ZW50cyB3aGlsZSB0aGVyZSBhcmUgcGVuZGluZyBjaGFuZ2VzLlxuXHR3aGlsZSAoIV8uaXNFbXB0eSh0aGlzLl9wZW5kaW5nKSkge1xuXHRcdHRoaXMuX3BlbmRpbmcgPSB7fTtcblx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZScsIHRoaXMsIG9wdGlvbnMpO1xuXHRcdC8vIFBlbmRpbmcgYW5kIHNpbGVudCBjaGFuZ2VzIHN0aWxsIHJlbWFpbi5cblx0XHRmb3IgKHZhciBhdHRyIGluIHRoaXMuY2hhbmdlZCkge1xuXHRcdGlmICh0aGlzLl9wZW5kaW5nW2F0dHJdIHx8IHRoaXMuX3NpbGVudFthdHRyXSkgY29udGludWU7XG5cdFx0ZGVsZXRlIHRoaXMuY2hhbmdlZFthdHRyXTtcblx0XHR9XG5cdFx0dGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuXHR9XG5cblx0dGhpcy5fY2hhbmdpbmcgPSBmYWxzZTtcblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gRGV0ZXJtaW5lIGlmIHRoZSBtb2RlbCBoYXMgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBgXCJjaGFuZ2VcImAgZXZlbnQuXG5cdC8vIElmIHlvdSBzcGVjaWZ5IGFuIGF0dHJpYnV0ZSBuYW1lLCBkZXRlcm1pbmUgaWYgdGhhdCBhdHRyaWJ1dGUgaGFzIGNoYW5nZWQuXG5cdGhhc0NoYW5nZWQ6IGZ1bmN0aW9uKGF0dHIpIHtcblx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gIV8uaXNFbXB0eSh0aGlzLmNoYW5nZWQpO1xuXHRyZXR1cm4gXy5oYXModGhpcy5jaGFuZ2VkLCBhdHRyKTtcblx0fSxcblxuXHQvLyBSZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSBjaGFuZ2VkLCBvclxuXHQvLyBmYWxzZSBpZiB0aGVyZSBhcmUgbm8gY2hhbmdlZCBhdHRyaWJ1dGVzLiBVc2VmdWwgZm9yIGRldGVybWluaW5nIHdoYXRcblx0Ly8gcGFydHMgb2YgYSB2aWV3IG5lZWQgdG8gYmUgdXBkYXRlZCBhbmQvb3Igd2hhdCBhdHRyaWJ1dGVzIG5lZWQgdG8gYmVcblx0Ly8gcGVyc2lzdGVkIHRvIHRoZSBzZXJ2ZXIuIFVuc2V0IGF0dHJpYnV0ZXMgd2lsbCBiZSBzZXQgdG8gdW5kZWZpbmVkLlxuXHQvLyBZb3UgY2FuIGFsc28gcGFzcyBhbiBhdHRyaWJ1dGVzIG9iamVjdCB0byBkaWZmIGFnYWluc3QgdGhlIG1vZGVsLFxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGVyZSAqd291bGQgYmUqIGEgY2hhbmdlLlxuXHRjaGFuZ2VkQXR0cmlidXRlczogZnVuY3Rpb24oZGlmZikge1xuXHRpZiAoIWRpZmYpIHJldHVybiB0aGlzLmhhc0NoYW5nZWQoKSA/IF8uY2xvbmUodGhpcy5jaGFuZ2VkKSA6IGZhbHNlO1xuXHR2YXIgdmFsLCBjaGFuZ2VkID0gZmFsc2UsIG9sZCA9IHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcztcblx0Zm9yICh2YXIgYXR0ciBpbiBkaWZmKSB7XG5cdFx0aWYgKF8uaXNFcXVhbChvbGRbYXR0cl0sICh2YWwgPSBkaWZmW2F0dHJdKSkpIGNvbnRpbnVlO1xuXHRcdChjaGFuZ2VkIHx8IChjaGFuZ2VkID0ge30pKVthdHRyXSA9IHZhbDtcblx0fVxuXHRyZXR1cm4gY2hhbmdlZDtcblx0fSxcblxuXHQvLyBHZXQgdGhlIHByZXZpb3VzIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZSwgcmVjb3JkZWQgYXQgdGhlIHRpbWUgdGhlIGxhc3Rcblx0Ly8gYFwiY2hhbmdlXCJgIGV2ZW50IHdhcyBmaXJlZC5cblx0cHJldmlvdXM6IGZ1bmN0aW9uKGF0dHIpIHtcblx0aWYgKCFhcmd1bWVudHMubGVuZ3RoIHx8ICF0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMpIHJldHVybiBudWxsO1xuXHRyZXR1cm4gdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzW2F0dHJdO1xuXHR9LFxuXG5cdC8vIEdldCBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIG1vZGVsIGF0IHRoZSB0aW1lIG9mIHRoZSBwcmV2aW91c1xuXHQvLyBgXCJjaGFuZ2VcImAgZXZlbnQuXG5cdHByZXZpb3VzQXR0cmlidXRlczogZnVuY3Rpb24oKSB7XG5cdHJldHVybiBfLmNsb25lKHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyk7XG5cdH0sXG5cblx0Ly8gQ2hlY2sgaWYgdGhlIG1vZGVsIGlzIGN1cnJlbnRseSBpbiBhIHZhbGlkIHN0YXRlLiBJdCdzIG9ubHkgcG9zc2libGUgdG9cblx0Ly8gZ2V0IGludG8gYW4gKmludmFsaWQqIHN0YXRlIGlmIHlvdSdyZSB1c2luZyBzaWxlbnQgY2hhbmdlcy5cblx0aXNWYWxpZDogZnVuY3Rpb24oKSB7XG5cdHJldHVybiAhdGhpcy52YWxpZGF0ZSh0aGlzLmF0dHJpYnV0ZXMpO1xuXHR9LFxuXG5cdC8vIFJ1biB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIG5leHQgY29tcGxldGUgc2V0IG9mIG1vZGVsIGF0dHJpYnV0ZXMsXG5cdC8vIHJldHVybmluZyBgdHJ1ZWAgaWYgYWxsIGlzIHdlbGwuIElmIGEgc3BlY2lmaWMgYGVycm9yYCBjYWxsYmFjayBoYXNcblx0Ly8gYmVlbiBwYXNzZWQsIGNhbGwgdGhhdCBpbnN0ZWFkIG9mIGZpcmluZyB0aGUgZ2VuZXJhbCBgXCJlcnJvclwiYCBldmVudC5cblx0X3ZhbGlkYXRlOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5zaWxlbnQgfHwgIXRoaXMudmFsaWRhdGUpIHJldHVybiB0cnVlO1xuXHRhdHRycyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJzKTtcblx0dmFyIGVycm9yID0gdGhpcy52YWxpZGF0ZShhdHRycywgb3B0aW9ucyk7XG5cdGlmICghZXJyb3IpIHJldHVybiB0cnVlO1xuXHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVycm9yKSB7XG5cdFx0b3B0aW9ucy5lcnJvcih0aGlzLCBlcnJvciwgb3B0aW9ucyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy50cmlnZ2VyKCdlcnJvcicsIHRoaXMsIGVycm9yLCBvcHRpb25zKTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG5cdH1cblxufSk7XG5cbi8vIEJhY2tib25lLkNvbGxlY3Rpb25cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUHJvdmlkZXMgYSBzdGFuZGFyZCBjb2xsZWN0aW9uIGNsYXNzIGZvciBvdXIgc2V0cyBvZiBtb2RlbHMsIG9yZGVyZWRcbi8vIG9yIHVub3JkZXJlZC4gSWYgYSBgY29tcGFyYXRvcmAgaXMgc3BlY2lmaWVkLCB0aGUgQ29sbGVjdGlvbiB3aWxsIG1haW50YWluXG4vLyBpdHMgbW9kZWxzIGluIHNvcnQgb3JkZXIsIGFzIHRoZXkncmUgYWRkZWQgYW5kIHJlbW92ZWQuXG52YXIgQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24gPSBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblx0aWYgKG9wdGlvbnMubW9kZWwpIHRoaXMubW9kZWwgPSBvcHRpb25zLm1vZGVsO1xuXHRpZiAob3B0aW9ucy5jb21wYXJhdG9yKSB0aGlzLmNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3I7XG5cdHRoaXMuX3Jlc2V0KCk7XG5cdHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRpZiAobW9kZWxzKSB0aGlzLnJlc2V0KG1vZGVscywge3NpbGVudDogdHJ1ZSwgcGFyc2U6IG9wdGlvbnMucGFyc2V9KTtcbn07XG5cbi8vIERlZmluZSB0aGUgQ29sbGVjdGlvbidzIGluaGVyaXRhYmxlIG1ldGhvZHMuXG5fLmV4dGVuZChDb2xsZWN0aW9uLnByb3RvdHlwZSwgRXZlbnRzLCB7XG5cblx0Ly8gVGhlIGRlZmF1bHQgbW9kZWwgZm9yIGEgY29sbGVjdGlvbiBpcyBqdXN0IGEgKipCYWNrYm9uZS5Nb2RlbCoqLlxuXHQvLyBUaGlzIHNob3VsZCBiZSBvdmVycmlkZGVuIGluIG1vc3QgY2FzZXMuXG5cdG1vZGVsOiBNb2RlbCxcblxuXHQvLyBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cblx0Ly8gaW5pdGlhbGl6YXRpb24gbG9naWMuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuXHQvLyBUaGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiBhIENvbGxlY3Rpb24gaXMgYW4gYXJyYXkgb2YgdGhlXG5cdC8vIG1vZGVscycgYXR0cmlidXRlcy5cblx0dG9KU09OOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihtb2RlbCl7IHJldHVybiBtb2RlbC50b0pTT04ob3B0aW9ucyk7IH0pO1xuXHR9LFxuXG5cdC8vIEFkZCBhIG1vZGVsLCBvciBsaXN0IG9mIG1vZGVscyB0byB0aGUgc2V0LiBQYXNzICoqc2lsZW50KiogdG8gYXZvaWRcblx0Ly8gZmlyaW5nIHRoZSBgYWRkYCBldmVudCBmb3IgZXZlcnkgbmV3IG1vZGVsLlxuXHRhZGQ6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuXHR2YXIgaSwgaW5kZXgsIGxlbmd0aCwgbW9kZWwsIGNpZCwgaWQsIGNpZHMgPSB7fSwgaWRzID0ge30sIGR1cHMgPSBbXTtcblx0b3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblx0bW9kZWxzID0gXy5pc0FycmF5KG1vZGVscykgPyBtb2RlbHMuc2xpY2UoKSA6IFttb2RlbHNdO1xuXG5cdC8vIEJlZ2luIGJ5IHR1cm5pbmcgYmFyZSBvYmplY3RzIGludG8gbW9kZWwgcmVmZXJlbmNlcywgYW5kIHByZXZlbnRpbmdcblx0Ly8gaW52YWxpZCBtb2RlbHMgb3IgZHVwbGljYXRlIG1vZGVscyBmcm9tIGJlaW5nIGFkZGVkLlxuXHRmb3IgKGkgPSAwLCBsZW5ndGggPSBtb2RlbHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoIShtb2RlbCA9IG1vZGVsc1tpXSA9IHRoaXMuX3ByZXBhcmVNb2RlbChtb2RlbHNbaV0sIG9wdGlvbnMpKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGFkZCBhbiBpbnZhbGlkIG1vZGVsIHRvIGEgY29sbGVjdGlvblwiKTtcblx0XHR9XG5cdFx0Y2lkID0gbW9kZWwuY2lkO1xuXHRcdGlkID0gbW9kZWwuaWQ7XG5cdFx0aWYgKGNpZHNbY2lkXSB8fCB0aGlzLl9ieUNpZFtjaWRdIHx8ICgoaWQgIT0gbnVsbCkgJiYgKGlkc1tpZF0gfHwgdGhpcy5fYnlJZFtpZF0pKSkge1xuXHRcdGR1cHMucHVzaChpKTtcblx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0Y2lkc1tjaWRdID0gaWRzW2lkXSA9IG1vZGVsO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMuXG5cdGkgPSBkdXBzLmxlbmd0aDtcblx0d2hpbGUgKGktLSkge1xuXHRcdG1vZGVscy5zcGxpY2UoZHVwc1tpXSwgMSk7XG5cdH1cblxuXHQvLyBMaXN0ZW4gdG8gYWRkZWQgbW9kZWxzJyBldmVudHMsIGFuZCBpbmRleCBtb2RlbHMgZm9yIGxvb2t1cCBieVxuXHQvLyBgaWRgIGFuZCBieSBgY2lkYC5cblx0Zm9yIChpID0gMCwgbGVuZ3RoID0gbW9kZWxzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0KG1vZGVsID0gbW9kZWxzW2ldKS5vbignYWxsJywgdGhpcy5fb25Nb2RlbEV2ZW50LCB0aGlzKTtcblx0XHR0aGlzLl9ieUNpZFttb2RlbC5jaWRdID0gbW9kZWw7XG5cdFx0aWYgKG1vZGVsLmlkICE9IG51bGwpIHRoaXMuX2J5SWRbbW9kZWwuaWRdID0gbW9kZWw7XG5cdH1cblxuXHQvLyBJbnNlcnQgbW9kZWxzIGludG8gdGhlIGNvbGxlY3Rpb24sIHJlLXNvcnRpbmcgaWYgbmVlZGVkLCBhbmQgdHJpZ2dlcmluZ1xuXHQvLyBgYWRkYCBldmVudHMgdW5sZXNzIHNpbGVuY2VkLlxuXHR0aGlzLmxlbmd0aCArPSBsZW5ndGg7XG5cdGluZGV4ID0gb3B0aW9ucy5hdCAhPSBudWxsID8gb3B0aW9ucy5hdCA6IHRoaXMubW9kZWxzLmxlbmd0aDtcblx0c3BsaWNlLmFwcGx5KHRoaXMubW9kZWxzLCBbaW5kZXgsIDBdLmNvbmNhdChtb2RlbHMpKTtcblx0aWYgKHRoaXMuY29tcGFyYXRvcikgdGhpcy5zb3J0KHtzaWxlbnQ6IHRydWV9KTtcblx0aWYgKG9wdGlvbnMuc2lsZW50KSByZXR1cm4gdGhpcztcblx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdGhpcy5tb2RlbHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoIWNpZHNbKG1vZGVsID0gdGhpcy5tb2RlbHNbaV0pLmNpZF0pIGNvbnRpbnVlO1xuXHRcdG9wdGlvbnMuaW5kZXggPSBpO1xuXHRcdG1vZGVsLnRyaWdnZXIoJ2FkZCcsIG1vZGVsLCB0aGlzLCBvcHRpb25zKTtcblx0fVxuXHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBSZW1vdmUgYSBtb2RlbCwgb3IgYSBsaXN0IG9mIG1vZGVscyBmcm9tIHRoZSBzZXQuIFBhc3Mgc2lsZW50IHRvIGF2b2lkXG5cdC8vIGZpcmluZyB0aGUgYHJlbW92ZWAgZXZlbnQgZm9yIGV2ZXJ5IG1vZGVsIHJlbW92ZWQuXG5cdHJlbW92ZTogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG5cdHZhciBpLCBsLCBpbmRleCwgbW9kZWw7XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdG1vZGVscyA9IF8uaXNBcnJheShtb2RlbHMpID8gbW9kZWxzLnNsaWNlKCkgOiBbbW9kZWxzXTtcblx0Zm9yIChpID0gMCwgbCA9IG1vZGVscy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRtb2RlbCA9IHRoaXMuZ2V0QnlDaWQobW9kZWxzW2ldKSB8fCB0aGlzLmdldChtb2RlbHNbaV0pO1xuXHRcdGlmICghbW9kZWwpIGNvbnRpbnVlO1xuXHRcdGRlbGV0ZSB0aGlzLl9ieUlkW21vZGVsLmlkXTtcblx0XHRkZWxldGUgdGhpcy5fYnlDaWRbbW9kZWwuY2lkXTtcblx0XHRpbmRleCA9IHRoaXMuaW5kZXhPZihtb2RlbCk7XG5cdFx0dGhpcy5tb2RlbHMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHR0aGlzLmxlbmd0aC0tO1xuXHRcdGlmICghb3B0aW9ucy5zaWxlbnQpIHtcblx0XHRvcHRpb25zLmluZGV4ID0gaW5kZXg7XG5cdFx0bW9kZWwudHJpZ2dlcigncmVtb3ZlJywgbW9kZWwsIHRoaXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHR0aGlzLl9yZW1vdmVSZWZlcmVuY2UobW9kZWwpO1xuXHR9XG5cdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIEFkZCBhIG1vZGVsIHRvIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG5cdHB1c2g6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG5cdG1vZGVsID0gdGhpcy5fcHJlcGFyZU1vZGVsKG1vZGVsLCBvcHRpb25zKTtcblx0dGhpcy5hZGQobW9kZWwsIG9wdGlvbnMpO1xuXHRyZXR1cm4gbW9kZWw7XG5cdH0sXG5cblx0Ly8gUmVtb3ZlIGEgbW9kZWwgZnJvbSB0aGUgZW5kIG9mIHRoZSBjb2xsZWN0aW9uLlxuXHRwb3A6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIG1vZGVsID0gdGhpcy5hdCh0aGlzLmxlbmd0aCAtIDEpO1xuXHR0aGlzLnJlbW92ZShtb2RlbCwgb3B0aW9ucyk7XG5cdHJldHVybiBtb2RlbDtcblx0fSxcblxuXHQvLyBBZGQgYSBtb2RlbCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBjb2xsZWN0aW9uLlxuXHR1bnNoaWZ0OiBmdW5jdGlvbihtb2RlbCwgb3B0aW9ucykge1xuXHRtb2RlbCA9IHRoaXMuX3ByZXBhcmVNb2RlbChtb2RlbCwgb3B0aW9ucyk7XG5cdHRoaXMuYWRkKG1vZGVsLCBfLmV4dGVuZCh7YXQ6IDB9LCBvcHRpb25zKSk7XG5cdHJldHVybiBtb2RlbDtcblx0fSxcblxuXHQvLyBSZW1vdmUgYSBtb2RlbCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGNvbGxlY3Rpb24uXG5cdHNoaWZ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHZhciBtb2RlbCA9IHRoaXMuYXQoMCk7XG5cdHRoaXMucmVtb3ZlKG1vZGVsLCBvcHRpb25zKTtcblx0cmV0dXJuIG1vZGVsO1xuXHR9LFxuXG5cdC8vIEdldCBhIG1vZGVsIGZyb20gdGhlIHNldCBieSBpZC5cblx0Z2V0OiBmdW5jdGlvbihpZCkge1xuXHRpZiAoaWQgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcblx0cmV0dXJuIHRoaXMuX2J5SWRbaWQuaWQgIT0gbnVsbCA/IGlkLmlkIDogaWRdO1xuXHR9LFxuXG5cdC8vIEdldCBhIG1vZGVsIGZyb20gdGhlIHNldCBieSBjbGllbnQgaWQuXG5cdGdldEJ5Q2lkOiBmdW5jdGlvbihjaWQpIHtcblx0cmV0dXJuIGNpZCAmJiB0aGlzLl9ieUNpZFtjaWQuY2lkIHx8IGNpZF07XG5cdH0sXG5cblx0Ly8gR2V0IHRoZSBtb2RlbCBhdCB0aGUgZ2l2ZW4gaW5kZXguXG5cdGF0OiBmdW5jdGlvbihpbmRleCkge1xuXHRyZXR1cm4gdGhpcy5tb2RlbHNbaW5kZXhdO1xuXHR9LFxuXG5cdC8vIFJldHVybiBtb2RlbHMgd2l0aCBtYXRjaGluZyBhdHRyaWJ1dGVzLiBVc2VmdWwgZm9yIHNpbXBsZSBjYXNlcyBvZiBgZmlsdGVyYC5cblx0d2hlcmU6IGZ1bmN0aW9uKGF0dHJzKSB7XG5cdGlmIChfLmlzRW1wdHkoYXR0cnMpKSByZXR1cm4gW107XG5cdHJldHVybiB0aGlzLmZpbHRlcihmdW5jdGlvbihtb2RlbCkge1xuXHRcdGZvciAodmFyIGtleSBpbiBhdHRycykge1xuXHRcdGlmIChhdHRyc1trZXldICE9PSBtb2RlbC5nZXQoa2V5KSkgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSk7XG5cdH0sXG5cblx0Ly8gRm9yY2UgdGhlIGNvbGxlY3Rpb24gdG8gcmUtc29ydCBpdHNlbGYuIFlvdSBkb24ndCBuZWVkIHRvIGNhbGwgdGhpcyB1bmRlclxuXHQvLyBub3JtYWwgY2lyY3Vtc3RhbmNlcywgYXMgdGhlIHNldCB3aWxsIG1haW50YWluIHNvcnQgb3JkZXIgYXMgZWFjaCBpdGVtXG5cdC8vIGlzIGFkZGVkLlxuXHRzb3J0OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cdGlmICghdGhpcy5jb21wYXJhdG9yKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzb3J0IGEgc2V0IHdpdGhvdXQgYSBjb21wYXJhdG9yJyk7XG5cdHZhciBib3VuZENvbXBhcmF0b3IgPSBfLmJpbmQodGhpcy5jb21wYXJhdG9yLCB0aGlzKTtcblx0aWYgKHRoaXMuY29tcGFyYXRvci5sZW5ndGggPT0gMSkge1xuXHRcdHRoaXMubW9kZWxzID0gdGhpcy5zb3J0QnkoYm91bmRDb21wYXJhdG9yKTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLm1vZGVscy5zb3J0KGJvdW5kQ29tcGFyYXRvcik7XG5cdH1cblx0aWYgKCFvcHRpb25zLnNpbGVudCkgdGhpcy50cmlnZ2VyKCdyZXNldCcsIHRoaXMsIG9wdGlvbnMpO1xuXHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBQbHVjayBhbiBhdHRyaWJ1dGUgZnJvbSBlYWNoIG1vZGVsIGluIHRoZSBjb2xsZWN0aW9uLlxuXHRwbHVjazogZnVuY3Rpb24oYXR0cikge1xuXHRyZXR1cm4gXy5tYXAodGhpcy5tb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKXsgcmV0dXJuIG1vZGVsLmdldChhdHRyKTsgfSk7XG5cdH0sXG5cblx0Ly8gV2hlbiB5b3UgaGF2ZSBtb3JlIGl0ZW1zIHRoYW4geW91IHdhbnQgdG8gYWRkIG9yIHJlbW92ZSBpbmRpdmlkdWFsbHksXG5cdC8vIHlvdSBjYW4gcmVzZXQgdGhlIGVudGlyZSBzZXQgd2l0aCBhIG5ldyBsaXN0IG9mIG1vZGVscywgd2l0aG91dCBmaXJpbmdcblx0Ly8gYW55IGBhZGRgIG9yIGByZW1vdmVgIGV2ZW50cy4gRmlyZXMgYHJlc2V0YCB3aGVuIGZpbmlzaGVkLlxuXHRyZXNldDogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG5cdG1vZGVscyAgfHwgKG1vZGVscyA9IFtdKTtcblx0b3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLm1vZGVscy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHR0aGlzLl9yZW1vdmVSZWZlcmVuY2UodGhpcy5tb2RlbHNbaV0pO1xuXHR9XG5cdHRoaXMuX3Jlc2V0KCk7XG5cdHRoaXMuYWRkKG1vZGVscywgXy5leHRlbmQoe3NpbGVudDogdHJ1ZX0sIG9wdGlvbnMpKTtcblx0aWYgKCFvcHRpb25zLnNpbGVudCkgdGhpcy50cmlnZ2VyKCdyZXNldCcsIHRoaXMsIG9wdGlvbnMpO1xuXHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBGZXRjaCB0aGUgZGVmYXVsdCBzZXQgb2YgbW9kZWxzIGZvciB0aGlzIGNvbGxlY3Rpb24sIHJlc2V0dGluZyB0aGVcblx0Ly8gY29sbGVjdGlvbiB3aGVuIHRoZXkgYXJyaXZlLiBJZiBgYWRkOiB0cnVlYCBpcyBwYXNzZWQsIGFwcGVuZHMgdGhlXG5cdC8vIG1vZGVscyB0byB0aGUgY29sbGVjdGlvbiBpbnN0ZWFkIG9mIHJlc2V0dGluZy5cblx0ZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgPyBfLmNsb25lKG9wdGlvbnMpIDoge307XG5cdGlmIChvcHRpb25zLnBhcnNlID09PSB1bmRlZmluZWQpIG9wdGlvbnMucGFyc2UgPSB0cnVlO1xuXHR2YXIgY29sbGVjdGlvbiA9IHRoaXM7XG5cdHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuXHRvcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuXHRcdGNvbGxlY3Rpb25bb3B0aW9ucy5hZGQgPyAnYWRkJyA6ICdyZXNldCddKGNvbGxlY3Rpb24ucGFyc2UocmVzcCwgeGhyKSwgb3B0aW9ucyk7XG5cdFx0aWYgKHN1Y2Nlc3MpIHN1Y2Nlc3MoY29sbGVjdGlvbiwgcmVzcCk7XG5cdH07XG5cdG9wdGlvbnMuZXJyb3IgPSBCYWNrYm9uZS53cmFwRXJyb3Iob3B0aW9ucy5lcnJvciwgY29sbGVjdGlvbiwgb3B0aW9ucyk7XG5cdHJldHVybiAodGhpcy5zeW5jIHx8IEJhY2tib25lLnN5bmMpLmNhbGwodGhpcywgJ3JlYWQnLCB0aGlzLCBvcHRpb25zKTtcblx0fSxcblxuXHQvLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBtb2RlbCBpbiB0aGlzIGNvbGxlY3Rpb24uIEFkZCB0aGUgbW9kZWwgdG8gdGhlXG5cdC8vIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHksIHVubGVzcyBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCBpbiB3aGljaCBjYXNlIHdlXG5cdC8vIHdhaXQgZm9yIHRoZSBzZXJ2ZXIgdG8gYWdyZWUuXG5cdGNyZWF0ZTogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcblx0dmFyIGNvbGwgPSB0aGlzO1xuXHRvcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcblx0bW9kZWwgPSB0aGlzLl9wcmVwYXJlTW9kZWwobW9kZWwsIG9wdGlvbnMpO1xuXHRpZiAoIW1vZGVsKSByZXR1cm4gZmFsc2U7XG5cdGlmICghb3B0aW9ucy53YWl0KSBjb2xsLmFkZChtb2RlbCwgb3B0aW9ucyk7XG5cdHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuXHRvcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihuZXh0TW9kZWwsIHJlc3AsIHhocikge1xuXHRcdGlmIChvcHRpb25zLndhaXQpIGNvbGwuYWRkKG5leHRNb2RlbCwgb3B0aW9ucyk7XG5cdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRzdWNjZXNzKG5leHRNb2RlbCwgcmVzcCk7XG5cdFx0fSBlbHNlIHtcblx0XHRuZXh0TW9kZWwudHJpZ2dlcignc3luYycsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcblx0XHR9XG5cdH07XG5cdG1vZGVsLnNhdmUobnVsbCwgb3B0aW9ucyk7XG5cdHJldHVybiBtb2RlbDtcblx0fSxcblxuXHQvLyAqKnBhcnNlKiogY29udmVydHMgYSByZXNwb25zZSBpbnRvIGEgbGlzdCBvZiBtb2RlbHMgdG8gYmUgYWRkZWQgdG8gdGhlXG5cdC8vIGNvbGxlY3Rpb24uIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGlzIGp1c3QgdG8gcGFzcyBpdCB0aHJvdWdoLlxuXHRwYXJzZTogZnVuY3Rpb24ocmVzcCwgeGhyKSB7XG5cdHJldHVybiByZXNwO1xuXHR9LFxuXG5cdC8vIFByb3h5IHRvIF8ncyBjaGFpbi4gQ2FuJ3QgYmUgcHJveGllZCB0aGUgc2FtZSB3YXkgdGhlIHJlc3Qgb2YgdGhlXG5cdC8vIHVuZGVyc2NvcmUgbWV0aG9kcyBhcmUgcHJveGllZCBiZWNhdXNlIGl0IHJlbGllcyBvbiB0aGUgdW5kZXJzY29yZVxuXHQvLyBjb25zdHJ1Y3Rvci5cblx0Y2hhaW46IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIF8odGhpcy5tb2RlbHMpLmNoYWluKCk7XG5cdH0sXG5cblx0Ly8gUmVzZXQgYWxsIGludGVybmFsIHN0YXRlLiBDYWxsZWQgd2hlbiB0aGUgY29sbGVjdGlvbiBpcyByZXNldC5cblx0X3Jlc2V0OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMubGVuZ3RoID0gMDtcblx0dGhpcy5tb2RlbHMgPSBbXTtcblx0dGhpcy5fYnlJZCAgPSB7fTtcblx0dGhpcy5fYnlDaWQgPSB7fTtcblx0fSxcblxuXHQvLyBQcmVwYXJlIGEgbW9kZWwgb3IgaGFzaCBvZiBhdHRyaWJ1dGVzIHRvIGJlIGFkZGVkIHRvIHRoaXMgY29sbGVjdGlvbi5cblx0X3ByZXBhcmVNb2RlbDogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblx0aWYgKCEobW9kZWwgaW5zdGFuY2VvZiBNb2RlbCkpIHtcblx0XHR2YXIgYXR0cnMgPSBtb2RlbDtcblx0XHRvcHRpb25zLmNvbGxlY3Rpb24gPSB0aGlzO1xuXHRcdG1vZGVsID0gbmV3IHRoaXMubW9kZWwoYXR0cnMsIG9wdGlvbnMpO1xuXHRcdGlmICghbW9kZWwuX3ZhbGlkYXRlKG1vZGVsLmF0dHJpYnV0ZXMsIG9wdGlvbnMpKSBtb2RlbCA9IGZhbHNlO1xuXHR9IGVsc2UgaWYgKCFtb2RlbC5jb2xsZWN0aW9uKSB7XG5cdFx0bW9kZWwuY29sbGVjdGlvbiA9IHRoaXM7XG5cdH1cblx0cmV0dXJuIG1vZGVsO1xuXHR9LFxuXG5cdC8vIEludGVybmFsIG1ldGhvZCB0byByZW1vdmUgYSBtb2RlbCdzIHRpZXMgdG8gYSBjb2xsZWN0aW9uLlxuXHRfcmVtb3ZlUmVmZXJlbmNlOiBmdW5jdGlvbihtb2RlbCkge1xuXHRpZiAodGhpcyA9PSBtb2RlbC5jb2xsZWN0aW9uKSB7XG5cdFx0ZGVsZXRlIG1vZGVsLmNvbGxlY3Rpb247XG5cdH1cblx0bW9kZWwub2ZmKCdhbGwnLCB0aGlzLl9vbk1vZGVsRXZlbnQsIHRoaXMpO1xuXHR9LFxuXG5cdC8vIEludGVybmFsIG1ldGhvZCBjYWxsZWQgZXZlcnkgdGltZSBhIG1vZGVsIGluIHRoZSBzZXQgZmlyZXMgYW4gZXZlbnQuXG5cdC8vIFNldHMgbmVlZCB0byB1cGRhdGUgdGhlaXIgaW5kZXhlcyB3aGVuIG1vZGVscyBjaGFuZ2UgaWRzLiBBbGwgb3RoZXJcblx0Ly8gZXZlbnRzIHNpbXBseSBwcm94eSB0aHJvdWdoLiBcImFkZFwiIGFuZCBcInJlbW92ZVwiIGV2ZW50cyB0aGF0IG9yaWdpbmF0ZVxuXHQvLyBpbiBvdGhlciBjb2xsZWN0aW9ucyBhcmUgaWdub3JlZC5cblx0X29uTW9kZWxFdmVudDogZnVuY3Rpb24oZXZlbnQsIG1vZGVsLCBjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG5cdGlmICgoZXZlbnQgPT0gJ2FkZCcgfHwgZXZlbnQgPT0gJ3JlbW92ZScpICYmIGNvbGxlY3Rpb24gIT0gdGhpcykgcmV0dXJuO1xuXHRpZiAoZXZlbnQgPT0gJ2Rlc3Ryb3knKSB7XG5cdFx0dGhpcy5yZW1vdmUobW9kZWwsIG9wdGlvbnMpO1xuXHR9XG5cdGlmIChtb2RlbCAmJiBldmVudCA9PT0gJ2NoYW5nZTonICsgbW9kZWwuaWRBdHRyaWJ1dGUpIHtcblx0XHRkZWxldGUgdGhpcy5fYnlJZFttb2RlbC5wcmV2aW91cyhtb2RlbC5pZEF0dHJpYnV0ZSldO1xuXHRcdHRoaXMuX2J5SWRbbW9kZWwuaWRdID0gbW9kZWw7XG5cdH1cblx0dGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH1cblxufSk7XG5cbi8vIFVuZGVyc2NvcmUgbWV0aG9kcyB0aGF0IHdlIHdhbnQgdG8gaW1wbGVtZW50IG9uIHRoZSBDb2xsZWN0aW9uLlxudmFyIG1ldGhvZHMgPSBbJ2ZvckVhY2gnLCAnZWFjaCcsICdtYXAnLCAncmVkdWNlJywgJ3JlZHVjZVJpZ2h0JywgJ2ZpbmQnLFxuXHQnZGV0ZWN0JywgJ2ZpbHRlcicsICdzZWxlY3QnLCAncmVqZWN0JywgJ2V2ZXJ5JywgJ2FsbCcsICdzb21lJywgJ2FueScsXG5cdCdpbmNsdWRlJywgJ2NvbnRhaW5zJywgJ2ludm9rZScsICdtYXgnLCAnbWluJywgJ3NvcnRCeScsICdzb3J0ZWRJbmRleCcsXG5cdCd0b0FycmF5JywgJ3NpemUnLCAnZmlyc3QnLCAnaW5pdGlhbCcsICdyZXN0JywgJ2xhc3QnLCAnd2l0aG91dCcsICdpbmRleE9mJyxcblx0J3NodWZmbGUnLCAnbGFzdEluZGV4T2YnLCAnaXNFbXB0eScsICdncm91cEJ5J107XG5cbi8vIE1peCBpbiBlYWNoIFVuZGVyc2NvcmUgbWV0aG9kIGFzIGEgcHJveHkgdG8gYENvbGxlY3Rpb24jbW9kZWxzYC5cbl8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcblx0Q29sbGVjdGlvbi5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gX1ttZXRob2RdLmFwcGx5KF8sIFt0aGlzLm1vZGVsc10uY29uY2F0KF8udG9BcnJheShhcmd1bWVudHMpKSk7XG5cdH07XG59KTtcblxuLy8gQmFja2JvbmUuUm91dGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFJvdXRlcnMgbWFwIGZhdXgtVVJMcyB0byBhY3Rpb25zLCBhbmQgZmlyZSBldmVudHMgd2hlbiByb3V0ZXMgYXJlXG4vLyBtYXRjaGVkLiBDcmVhdGluZyBhIG5ldyBvbmUgc2V0cyBpdHMgYHJvdXRlc2AgaGFzaCwgaWYgbm90IHNldCBzdGF0aWNhbGx5LlxudmFyIFJvdXRlciA9IEJhY2tib25lLlJvdXRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0b3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblx0aWYgKG9wdGlvbnMucm91dGVzKSB0aGlzLnJvdXRlcyA9IG9wdGlvbnMucm91dGVzO1xuXHR0aGlzLl9iaW5kUm91dGVzKCk7XG5cdHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuLy8gQ2FjaGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIG1hdGNoaW5nIG5hbWVkIHBhcmFtIHBhcnRzIGFuZCBzcGxhdHRlZFxuLy8gcGFydHMgb2Ygcm91dGUgc3RyaW5ncy5cbnZhciBuYW1lZFBhcmFtICAgID0gLzpcXHcrL2c7XG52YXIgc3BsYXRQYXJhbSAgICA9IC9cXCpcXHcrL2c7XG52YXIgZXNjYXBlUmVnRXhwICA9IC9bLVtcXF17fSgpKz8uLFxcXFxeJHwjXFxzXS9nO1xuXG4vLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqQmFja2JvbmUuUm91dGVyKiogcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbl8uZXh0ZW5kKFJvdXRlci5wcm90b3R5cGUsIEV2ZW50cywge1xuXG5cdC8vIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuXHQvLyBpbml0aWFsaXphdGlvbiBsb2dpYy5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXt9LFxuXG5cdC8vIE1hbnVhbGx5IGJpbmQgYSBzaW5nbGUgbmFtZWQgcm91dGUgdG8gYSBjYWxsYmFjay4gRm9yIGV4YW1wbGU6XG5cdC8vXG5cdC8vICAgICB0aGlzLnJvdXRlKCdzZWFyY2gvOnF1ZXJ5L3A6bnVtJywgJ3NlYXJjaCcsIGZ1bmN0aW9uKHF1ZXJ5LCBudW0pIHtcblx0Ly8gICAgICAgLi4uXG5cdC8vICAgICB9KTtcblx0Ly9cblx0cm91dGU6IGZ1bmN0aW9uKHJvdXRlLCBuYW1lLCBjYWxsYmFjaykge1xuXHRCYWNrYm9uZS5oaXN0b3J5IHx8IChCYWNrYm9uZS5oaXN0b3J5ID0gbmV3IEhpc3RvcnkpO1xuXHRpZiAoIV8uaXNSZWdFeHAocm91dGUpKSByb3V0ZSA9IHRoaXMuX3JvdXRlVG9SZWdFeHAocm91dGUpO1xuXHRpZiAoIWNhbGxiYWNrKSBjYWxsYmFjayA9IHRoaXNbbmFtZV07XG5cdEJhY2tib25lLmhpc3Rvcnkucm91dGUocm91dGUsIF8uYmluZChmdW5jdGlvbihmcmFnbWVudCkge1xuXHRcdHZhciBhcmdzID0gdGhpcy5fZXh0cmFjdFBhcmFtZXRlcnMocm91dGUsIGZyYWdtZW50KTtcblx0XHRjYWxsYmFjayAmJiBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHR0aGlzLnRyaWdnZXIuYXBwbHkodGhpcywgWydyb3V0ZTonICsgbmFtZV0uY29uY2F0KGFyZ3MpKTtcblx0XHRCYWNrYm9uZS5oaXN0b3J5LnRyaWdnZXIoJ3JvdXRlJywgdGhpcywgbmFtZSwgYXJncyk7XG5cdH0sIHRoaXMpKTtcblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gU2ltcGxlIHByb3h5IHRvIGBCYWNrYm9uZS5oaXN0b3J5YCB0byBzYXZlIGEgZnJhZ21lbnQgaW50byB0aGUgaGlzdG9yeS5cblx0bmF2aWdhdGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBvcHRpb25zKSB7XG5cdEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUoZnJhZ21lbnQsIG9wdGlvbnMpO1xuXHR9LFxuXG5cdC8vIEJpbmQgYWxsIGRlZmluZWQgcm91dGVzIHRvIGBCYWNrYm9uZS5oaXN0b3J5YC4gV2UgaGF2ZSB0byByZXZlcnNlIHRoZVxuXHQvLyBvcmRlciBvZiB0aGUgcm91dGVzIGhlcmUgdG8gc3VwcG9ydCBiZWhhdmlvciB3aGVyZSB0aGUgbW9zdCBnZW5lcmFsXG5cdC8vIHJvdXRlcyBjYW4gYmUgZGVmaW5lZCBhdCB0aGUgYm90dG9tIG9mIHRoZSByb3V0ZSBtYXAuXG5cdF9iaW5kUm91dGVzOiBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLnJvdXRlcykgcmV0dXJuO1xuXHR2YXIgcm91dGVzID0gW107XG5cdGZvciAodmFyIHJvdXRlIGluIHRoaXMucm91dGVzKSB7XG5cdFx0cm91dGVzLnVuc2hpZnQoW3JvdXRlLCB0aGlzLnJvdXRlc1tyb3V0ZV1dKTtcblx0fVxuXHRmb3IgKHZhciBpID0gMCwgbCA9IHJvdXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHR0aGlzLnJvdXRlKHJvdXRlc1tpXVswXSwgcm91dGVzW2ldWzFdLCB0aGlzW3JvdXRlc1tpXVsxXV0pO1xuXHR9XG5cdH0sXG5cblx0Ly8gQ29udmVydCBhIHJvdXRlIHN0cmluZyBpbnRvIGEgcmVndWxhciBleHByZXNzaW9uLCBzdWl0YWJsZSBmb3IgbWF0Y2hpbmdcblx0Ly8gYWdhaW5zdCB0aGUgY3VycmVudCBsb2NhdGlvbiBoYXNoLlxuXHRfcm91dGVUb1JlZ0V4cDogZnVuY3Rpb24ocm91dGUpIHtcblx0cm91dGUgPSByb3V0ZS5yZXBsYWNlKGVzY2FwZVJlZ0V4cCwgJ1xcXFwkJicpXG5cdFx0XHRcdC5yZXBsYWNlKG5hbWVkUGFyYW0sICcoW15cXC9dKyknKVxuXHRcdFx0XHQucmVwbGFjZShzcGxhdFBhcmFtLCAnKC4qPyknKTtcblx0cmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcm91dGUgKyAnJCcpO1xuXHR9LFxuXG5cdC8vIEdpdmVuIGEgcm91dGUsIGFuZCBhIFVSTCBmcmFnbWVudCB0aGF0IGl0IG1hdGNoZXMsIHJldHVybiB0aGUgYXJyYXkgb2Zcblx0Ly8gZXh0cmFjdGVkIHBhcmFtZXRlcnMuXG5cdF9leHRyYWN0UGFyYW1ldGVyczogZnVuY3Rpb24ocm91dGUsIGZyYWdtZW50KSB7XG5cdHJldHVybiByb3V0ZS5leGVjKGZyYWdtZW50KS5zbGljZSgxKTtcblx0fVxuXG59KTtcblxuLy8gQmFja2JvbmUuSGlzdG9yeVxuLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBIYW5kbGVzIGNyb3NzLWJyb3dzZXIgaGlzdG9yeSBtYW5hZ2VtZW50LCBiYXNlZCBvbiBVUkwgZnJhZ21lbnRzLiBJZiB0aGVcbi8vIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBgb25oYXNoY2hhbmdlYCwgZmFsbHMgYmFjayB0byBwb2xsaW5nLlxudmFyIEhpc3RvcnkgPSBCYWNrYm9uZS5IaXN0b3J5ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuaGFuZGxlcnMgPSBbXTtcblx0Xy5iaW5kQWxsKHRoaXMsICdjaGVja1VybCcpO1xufTtcblxuLy8gQ2FjaGVkIHJlZ2V4IGZvciBjbGVhbmluZyBsZWFkaW5nIGhhc2hlcyBhbmQgc2xhc2hlcyAuXG52YXIgcm91dGVTdHJpcHBlciA9IC9eWyNcXC9dLztcblxuLy8gQ2FjaGVkIHJlZ2V4IGZvciBkZXRlY3RpbmcgTVNJRS5cbnZhciBpc0V4cGxvcmVyID0gL21zaWUgW1xcdy5dKy87XG5cbi8vIEhhcyB0aGUgaGlzdG9yeSBoYW5kbGluZyBhbHJlYWR5IGJlZW4gc3RhcnRlZD9cbkhpc3Rvcnkuc3RhcnRlZCA9IGZhbHNlO1xuXG4vLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqQmFja2JvbmUuSGlzdG9yeSoqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG5fLmV4dGVuZChIaXN0b3J5LnByb3RvdHlwZSwgRXZlbnRzLCB7XG5cblx0Ly8gVGhlIGRlZmF1bHQgaW50ZXJ2YWwgdG8gcG9sbCBmb3IgaGFzaCBjaGFuZ2VzLCBpZiBuZWNlc3NhcnksIGlzXG5cdC8vIHR3ZW50eSB0aW1lcyBhIHNlY29uZC5cblx0aW50ZXJ2YWw6IDUwLFxuXG5cdC8vIEdldHMgdGhlIHRydWUgaGFzaCB2YWx1ZS4gQ2Fubm90IHVzZSBsb2NhdGlvbi5oYXNoIGRpcmVjdGx5IGR1ZSB0byBidWdcblx0Ly8gaW4gRmlyZWZveCB3aGVyZSBsb2NhdGlvbi5oYXNoIHdpbGwgYWx3YXlzIGJlIGRlY29kZWQuXG5cdGdldEhhc2g6IGZ1bmN0aW9uKHdpbmRvd092ZXJyaWRlKSB7XG5cdHZhciBsb2MgPSB3aW5kb3dPdmVycmlkZSA/IHdpbmRvd092ZXJyaWRlLmxvY2F0aW9uIDogd2luZG93LmxvY2F0aW9uO1xuXHR2YXIgbWF0Y2ggPSBsb2MuaHJlZi5tYXRjaCgvIyguKikkLyk7XG5cdHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XG5cdH0sXG5cblx0Ly8gR2V0IHRoZSBjcm9zcy1icm93c2VyIG5vcm1hbGl6ZWQgVVJMIGZyYWdtZW50LCBlaXRoZXIgZnJvbSB0aGUgVVJMLFxuXHQvLyB0aGUgaGFzaCwgb3IgdGhlIG92ZXJyaWRlLlxuXHRnZXRGcmFnbWVudDogZnVuY3Rpb24oZnJhZ21lbnQsIGZvcmNlUHVzaFN0YXRlKSB7XG5cdGlmIChmcmFnbWVudCA9PSBudWxsKSB7XG5cdFx0aWYgKHRoaXMuX2hhc1B1c2hTdGF0ZSB8fCBmb3JjZVB1c2hTdGF0ZSkge1xuXHRcdGZyYWdtZW50ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXHRcdHZhciBzZWFyY2ggPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuXHRcdGlmIChzZWFyY2gpIGZyYWdtZW50ICs9IHNlYXJjaDtcblx0XHR9IGVsc2Uge1xuXHRcdGZyYWdtZW50ID0gdGhpcy5nZXRIYXNoKCk7XG5cdFx0fVxuXHR9XG5cdGlmICghZnJhZ21lbnQuaW5kZXhPZih0aGlzLm9wdGlvbnMucm9vdCkpIGZyYWdtZW50ID0gZnJhZ21lbnQuc3Vic3RyKHRoaXMub3B0aW9ucy5yb290Lmxlbmd0aCk7XG5cdHJldHVybiBmcmFnbWVudC5yZXBsYWNlKHJvdXRlU3RyaXBwZXIsICcnKTtcblx0fSxcblxuXHQvLyBTdGFydCB0aGUgaGFzaCBjaGFuZ2UgaGFuZGxpbmcsIHJldHVybmluZyBgdHJ1ZWAgaWYgdGhlIGN1cnJlbnQgVVJMIG1hdGNoZXNcblx0Ly8gYW4gZXhpc3Rpbmcgcm91dGUsIGFuZCBgZmFsc2VgIG90aGVyd2lzZS5cblx0c3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0aWYgKEhpc3Rvcnkuc3RhcnRlZCkgdGhyb3cgbmV3IEVycm9yKFwiQmFja2JvbmUuaGlzdG9yeSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcIik7XG5cdEhpc3Rvcnkuc3RhcnRlZCA9IHRydWU7XG5cblx0Ly8gRmlndXJlIG91dCB0aGUgaW5pdGlhbCBjb25maWd1cmF0aW9uLiBEbyB3ZSBuZWVkIGFuIGlmcmFtZT9cblx0Ly8gSXMgcHVzaFN0YXRlIGRlc2lyZWQgLi4uIGlzIGl0IGF2YWlsYWJsZT9cblx0dGhpcy5vcHRpb25zICAgICAgICAgID0gXy5leHRlbmQoe30sIHtyb290OiAnLyd9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXHR0aGlzLl93YW50c0hhc2hDaGFuZ2UgPSB0aGlzLm9wdGlvbnMuaGFzaENoYW5nZSAhPT0gZmFsc2U7XG5cdHRoaXMuX3dhbnRzUHVzaFN0YXRlICA9ICEhdGhpcy5vcHRpb25zLnB1c2hTdGF0ZTtcblx0dGhpcy5faGFzUHVzaFN0YXRlICAgID0gISEodGhpcy5vcHRpb25zLnB1c2hTdGF0ZSAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuXHR2YXIgZnJhZ21lbnQgICAgICAgICAgPSB0aGlzLmdldEZyYWdtZW50KCk7XG5cdHZhciBkb2NNb2RlICAgICAgICAgICA9IGRvY3VtZW50LmRvY3VtZW50TW9kZTtcblx0dmFyIG9sZElFICAgICAgICAgICAgID0gKGlzRXhwbG9yZXIuZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmICghZG9jTW9kZSB8fCBkb2NNb2RlIDw9IDcpKTtcblxuXHRpZiAob2xkSUUpIHtcblx0XHR0aGlzLmlmcmFtZSA9ICQoJzxpZnJhbWUgc3JjPVwiamF2YXNjcmlwdDowXCIgdGFiaW5kZXg9XCItMVwiIC8+JykuaGlkZSgpLmFwcGVuZFRvKCdib2R5JylbMF0uY29udGVudFdpbmRvdztcblx0XHR0aGlzLm5hdmlnYXRlKGZyYWdtZW50KTtcblx0fVxuXG5cdC8vIERlcGVuZGluZyBvbiB3aGV0aGVyIHdlJ3JlIHVzaW5nIHB1c2hTdGF0ZSBvciBoYXNoZXMsIGFuZCB3aGV0aGVyXG5cdC8vICdvbmhhc2hjaGFuZ2UnIGlzIHN1cHBvcnRlZCwgZGV0ZXJtaW5lIGhvdyB3ZSBjaGVjayB0aGUgVVJMIHN0YXRlLlxuXHRpZiAodGhpcy5faGFzUHVzaFN0YXRlKSB7XG5cdFx0JCh3aW5kb3cpLmJpbmQoJ3BvcHN0YXRlJywgdGhpcy5jaGVja1VybCk7XG5cdH0gZWxzZSBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlICYmICgnb25oYXNoY2hhbmdlJyBpbiB3aW5kb3cpICYmICFvbGRJRSkge1xuXHRcdCQod2luZG93KS5iaW5kKCdoYXNoY2hhbmdlJywgdGhpcy5jaGVja1VybCk7XG5cdH0gZWxzZSBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlKSB7XG5cdFx0dGhpcy5fY2hlY2tVcmxJbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMuY2hlY2tVcmwsIHRoaXMuaW50ZXJ2YWwpO1xuXHR9XG5cblx0Ly8gRGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gY2hhbmdlIHRoZSBiYXNlIHVybCwgZm9yIGEgcHVzaFN0YXRlIGxpbmtcblx0Ly8gb3BlbmVkIGJ5IGEgbm9uLXB1c2hTdGF0ZSBicm93c2VyLlxuXHR0aGlzLmZyYWdtZW50ID0gZnJhZ21lbnQ7XG5cdHZhciBsb2MgPSB3aW5kb3cubG9jYXRpb247XG5cdHZhciBhdFJvb3QgID0gbG9jLnBhdGhuYW1lID09IHRoaXMub3B0aW9ucy5yb290O1xuXG5cdC8vIElmIHdlJ3ZlIHN0YXJ0ZWQgb2ZmIHdpdGggYSByb3V0ZSBmcm9tIGEgYHB1c2hTdGF0ZWAtZW5hYmxlZCBicm93c2VyLFxuXHQvLyBidXQgd2UncmUgY3VycmVudGx5IGluIGEgYnJvd3NlciB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBpdC4uLlxuXHRpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlICYmIHRoaXMuX3dhbnRzUHVzaFN0YXRlICYmICF0aGlzLl9oYXNQdXNoU3RhdGUgJiYgIWF0Um9vdCkge1xuXHRcdHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEZyYWdtZW50KG51bGwsIHRydWUpO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHRoaXMub3B0aW9ucy5yb290ICsgJyMnICsgdGhpcy5mcmFnbWVudCk7XG5cdFx0Ly8gUmV0dXJuIGltbWVkaWF0ZWx5IGFzIGJyb3dzZXIgd2lsbCBkbyByZWRpcmVjdCB0byBuZXcgdXJsXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0Ly8gT3IgaWYgd2UndmUgc3RhcnRlZCBvdXQgd2l0aCBhIGhhc2gtYmFzZWQgcm91dGUsIGJ1dCB3ZSdyZSBjdXJyZW50bHlcblx0Ly8gaW4gYSBicm93c2VyIHdoZXJlIGl0IGNvdWxkIGJlIGBwdXNoU3RhdGVgLWJhc2VkIGluc3RlYWQuLi5cblx0fSBlbHNlIGlmICh0aGlzLl93YW50c1B1c2hTdGF0ZSAmJiB0aGlzLl9oYXNQdXNoU3RhdGUgJiYgYXRSb290ICYmIGxvYy5oYXNoKSB7XG5cdFx0dGhpcy5mcmFnbWVudCA9IHRoaXMuZ2V0SGFzaCgpLnJlcGxhY2Uocm91dGVTdHJpcHBlciwgJycpO1xuXHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsIGxvYy5wcm90b2NvbCArICcvLycgKyBsb2MuaG9zdCArIHRoaXMub3B0aW9ucy5yb290ICsgdGhpcy5mcmFnbWVudCk7XG5cdH1cblxuXHRpZiAoIXRoaXMub3B0aW9ucy5zaWxlbnQpIHtcblx0XHRyZXR1cm4gdGhpcy5sb2FkVXJsKCk7XG5cdH1cblx0fSxcblxuXHQvLyBEaXNhYmxlIEJhY2tib25lLmhpc3RvcnksIHBlcmhhcHMgdGVtcG9yYXJpbHkuIE5vdCB1c2VmdWwgaW4gYSByZWFsIGFwcCxcblx0Ly8gYnV0IHBvc3NpYmx5IHVzZWZ1bCBmb3IgdW5pdCB0ZXN0aW5nIFJvdXRlcnMuXG5cdHN0b3A6IGZ1bmN0aW9uKCkge1xuXHQkKHdpbmRvdykudW5iaW5kKCdwb3BzdGF0ZScsIHRoaXMuY2hlY2tVcmwpLnVuYmluZCgnaGFzaGNoYW5nZScsIHRoaXMuY2hlY2tVcmwpO1xuXHRjbGVhckludGVydmFsKHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWwpO1xuXHRIaXN0b3J5LnN0YXJ0ZWQgPSBmYWxzZTtcblx0fSxcblxuXHQvLyBBZGQgYSByb3V0ZSB0byBiZSB0ZXN0ZWQgd2hlbiB0aGUgZnJhZ21lbnQgY2hhbmdlcy4gUm91dGVzIGFkZGVkIGxhdGVyXG5cdC8vIG1heSBvdmVycmlkZSBwcmV2aW91cyByb3V0ZXMuXG5cdHJvdXRlOiBmdW5jdGlvbihyb3V0ZSwgY2FsbGJhY2spIHtcblx0dGhpcy5oYW5kbGVycy51bnNoaWZ0KHtyb3V0ZTogcm91dGUsIGNhbGxiYWNrOiBjYWxsYmFja30pO1xuXHR9LFxuXG5cdC8vIENoZWNrcyB0aGUgY3VycmVudCBVUkwgdG8gc2VlIGlmIGl0IGhhcyBjaGFuZ2VkLCBhbmQgaWYgaXQgaGFzLFxuXHQvLyBjYWxscyBgbG9hZFVybGAsIG5vcm1hbGl6aW5nIGFjcm9zcyB0aGUgaGlkZGVuIGlmcmFtZS5cblx0Y2hlY2tVcmw6IGZ1bmN0aW9uKGUpIHtcblx0dmFyIGN1cnJlbnQgPSB0aGlzLmdldEZyYWdtZW50KCk7XG5cdGlmIChjdXJyZW50ID09IHRoaXMuZnJhZ21lbnQgJiYgdGhpcy5pZnJhbWUpIGN1cnJlbnQgPSB0aGlzLmdldEZyYWdtZW50KHRoaXMuZ2V0SGFzaCh0aGlzLmlmcmFtZSkpO1xuXHRpZiAoY3VycmVudCA9PSB0aGlzLmZyYWdtZW50KSByZXR1cm4gZmFsc2U7XG5cdGlmICh0aGlzLmlmcmFtZSkgdGhpcy5uYXZpZ2F0ZShjdXJyZW50KTtcblx0dGhpcy5sb2FkVXJsKCkgfHwgdGhpcy5sb2FkVXJsKHRoaXMuZ2V0SGFzaCgpKTtcblx0fSxcblxuXHQvLyBBdHRlbXB0IHRvIGxvYWQgdGhlIGN1cnJlbnQgVVJMIGZyYWdtZW50LiBJZiBhIHJvdXRlIHN1Y2NlZWRzIHdpdGggYVxuXHQvLyBtYXRjaCwgcmV0dXJucyBgdHJ1ZWAuIElmIG5vIGRlZmluZWQgcm91dGVzIG1hdGNoZXMgdGhlIGZyYWdtZW50LFxuXHQvLyByZXR1cm5zIGBmYWxzZWAuXG5cdGxvYWRVcmw6IGZ1bmN0aW9uKGZyYWdtZW50T3ZlcnJpZGUpIHtcblx0dmFyIGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudCA9IHRoaXMuZ2V0RnJhZ21lbnQoZnJhZ21lbnRPdmVycmlkZSk7XG5cdHZhciBtYXRjaGVkID0gXy5hbnkodGhpcy5oYW5kbGVycywgZnVuY3Rpb24oaGFuZGxlcikge1xuXHRcdGlmIChoYW5kbGVyLnJvdXRlLnRlc3QoZnJhZ21lbnQpKSB7XG5cdFx0aGFuZGxlci5jYWxsYmFjayhmcmFnbWVudCk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG1hdGNoZWQ7XG5cdH0sXG5cblx0Ly8gU2F2ZSBhIGZyYWdtZW50IGludG8gdGhlIGhhc2ggaGlzdG9yeSwgb3IgcmVwbGFjZSB0aGUgVVJMIHN0YXRlIGlmIHRoZVxuXHQvLyAncmVwbGFjZScgb3B0aW9uIGlzIHBhc3NlZC4gWW91IGFyZSByZXNwb25zaWJsZSBmb3IgcHJvcGVybHkgVVJMLWVuY29kaW5nXG5cdC8vIHRoZSBmcmFnbWVudCBpbiBhZHZhbmNlLlxuXHQvL1xuXHQvLyBUaGUgb3B0aW9ucyBvYmplY3QgY2FuIGNvbnRhaW4gYHRyaWdnZXI6IHRydWVgIGlmIHlvdSB3aXNoIHRvIGhhdmUgdGhlXG5cdC8vIHJvdXRlIGNhbGxiYWNrIGJlIGZpcmVkIChub3QgdXN1YWxseSBkZXNpcmFibGUpLCBvciBgcmVwbGFjZTogdHJ1ZWAsIGlmXG5cdC8vIHlvdSB3aXNoIHRvIG1vZGlmeSB0aGUgY3VycmVudCBVUkwgd2l0aG91dCBhZGRpbmcgYW4gZW50cnkgdG8gdGhlIGhpc3RvcnkuXG5cdG5hdmlnYXRlOiBmdW5jdGlvbihmcmFnbWVudCwgb3B0aW9ucykge1xuXHRpZiAoIUhpc3Rvcnkuc3RhcnRlZCkgcmV0dXJuIGZhbHNlO1xuXHRpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucyA9PT0gdHJ1ZSkgb3B0aW9ucyA9IHt0cmlnZ2VyOiBvcHRpb25zfTtcblx0dmFyIGZyYWcgPSAoZnJhZ21lbnQgfHwgJycpLnJlcGxhY2Uocm91dGVTdHJpcHBlciwgJycpO1xuXHRpZiAodGhpcy5mcmFnbWVudCA9PSBmcmFnKSByZXR1cm47XG5cblx0Ly8gSWYgcHVzaFN0YXRlIGlzIGF2YWlsYWJsZSwgd2UgdXNlIGl0IHRvIHNldCB0aGUgZnJhZ21lbnQgYXMgYSByZWFsIFVSTC5cblx0aWYgKHRoaXMuX2hhc1B1c2hTdGF0ZSkge1xuXHRcdGlmIChmcmFnLmluZGV4T2YodGhpcy5vcHRpb25zLnJvb3QpICE9IDApIGZyYWcgPSB0aGlzLm9wdGlvbnMucm9vdCArIGZyYWc7XG5cdFx0dGhpcy5mcmFnbWVudCA9IGZyYWc7XG5cdFx0d2luZG93Lmhpc3Rvcnlbb3B0aW9ucy5yZXBsYWNlID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sIGRvY3VtZW50LnRpdGxlLCBmcmFnKTtcblxuXHQvLyBJZiBoYXNoIGNoYW5nZXMgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZGlzYWJsZWQsIHVwZGF0ZSB0aGUgaGFzaFxuXHQvLyBmcmFnbWVudCB0byBzdG9yZSBoaXN0b3J5LlxuXHR9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSkge1xuXHRcdHRoaXMuZnJhZ21lbnQgPSBmcmFnO1xuXHRcdHRoaXMuX3VwZGF0ZUhhc2god2luZG93LmxvY2F0aW9uLCBmcmFnLCBvcHRpb25zLnJlcGxhY2UpO1xuXHRcdGlmICh0aGlzLmlmcmFtZSAmJiAoZnJhZyAhPSB0aGlzLmdldEZyYWdtZW50KHRoaXMuZ2V0SGFzaCh0aGlzLmlmcmFtZSkpKSkge1xuXHRcdC8vIE9wZW5pbmcgYW5kIGNsb3NpbmcgdGhlIGlmcmFtZSB0cmlja3MgSUU3IGFuZCBlYXJsaWVyIHRvIHB1c2ggYSBoaXN0b3J5IGVudHJ5IG9uIGhhc2gtdGFnIGNoYW5nZS5cblx0XHQvLyBXaGVuIHJlcGxhY2UgaXMgdHJ1ZSwgd2UgZG9uJ3Qgd2FudCB0aGlzLlxuXHRcdGlmKCFvcHRpb25zLnJlcGxhY2UpIHRoaXMuaWZyYW1lLmRvY3VtZW50Lm9wZW4oKS5jbG9zZSgpO1xuXHRcdHRoaXMuX3VwZGF0ZUhhc2godGhpcy5pZnJhbWUubG9jYXRpb24sIGZyYWcsIG9wdGlvbnMucmVwbGFjZSk7XG5cdFx0fVxuXG5cdC8vIElmIHlvdSd2ZSB0b2xkIHVzIHRoYXQgeW91IGV4cGxpY2l0bHkgZG9uJ3Qgd2FudCBmYWxsYmFjayBoYXNoY2hhbmdlLVxuXHQvLyBiYXNlZCBoaXN0b3J5LCB0aGVuIGBuYXZpZ2F0ZWAgYmVjb21lcyBhIHBhZ2UgcmVmcmVzaC5cblx0fSBlbHNlIHtcblx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKHRoaXMub3B0aW9ucy5yb290ICsgZnJhZ21lbnQpO1xuXHR9XG5cdGlmIChvcHRpb25zLnRyaWdnZXIpIHRoaXMubG9hZFVybChmcmFnbWVudCk7XG5cdH0sXG5cblx0Ly8gVXBkYXRlIHRoZSBoYXNoIGxvY2F0aW9uLCBlaXRoZXIgcmVwbGFjaW5nIHRoZSBjdXJyZW50IGVudHJ5LCBvciBhZGRpbmdcblx0Ly8gYSBuZXcgb25lIHRvIHRoZSBicm93c2VyIGhpc3RvcnkuXG5cdF91cGRhdGVIYXNoOiBmdW5jdGlvbihsb2NhdGlvbiwgZnJhZ21lbnQsIHJlcGxhY2UpIHtcblx0aWYgKHJlcGxhY2UpIHtcblx0XHRsb2NhdGlvbi5yZXBsYWNlKGxvY2F0aW9uLnRvU3RyaW5nKCkucmVwbGFjZSgvKGphdmFzY3JpcHQ6fCMpLiokLywgJycpICsgJyMnICsgZnJhZ21lbnQpO1xuXHR9IGVsc2Uge1xuXHRcdGxvY2F0aW9uLmhhc2ggPSBmcmFnbWVudDtcblx0fVxuXHR9XG59KTtcblxuLy8gQmFja2JvbmUuVmlld1xuLy8gLS0tLS0tLS0tLS0tLVxuXG4vLyBDcmVhdGluZyBhIEJhY2tib25lLlZpZXcgY3JlYXRlcyBpdHMgaW5pdGlhbCBlbGVtZW50IG91dHNpZGUgb2YgdGhlIERPTSxcbi8vIGlmIGFuIGV4aXN0aW5nIGVsZW1lbnQgaXMgbm90IHByb3ZpZGVkLi4uXG52YXIgVmlldyA9IEJhY2tib25lLlZpZXcgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMuY2lkID0gXy51bmlxdWVJZCgndmlldycpO1xuXHR0aGlzLl9jb25maWd1cmUob3B0aW9ucyB8fCB7fSk7XG5cdHRoaXMuX2Vuc3VyZUVsZW1lbnQoKTtcblx0dGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbn07XG5cbi8vIENhY2hlZCByZWdleCB0byBzcGxpdCBrZXlzIGZvciBgZGVsZWdhdGVgLlxudmFyIGRlbGVnYXRlRXZlbnRTcGxpdHRlciA9IC9eKFxcUyspXFxzKiguKikkLztcblxuLy8gTGlzdCBvZiB2aWV3IG9wdGlvbnMgdG8gYmUgbWVyZ2VkIGFzIHByb3BlcnRpZXMuXG52YXIgdmlld09wdGlvbnMgPSBbJ21vZGVsJywgJ2NvbGxlY3Rpb24nLCAnZWwnLCAnaWQnLCAnYXR0cmlidXRlcycsICdjbGFzc05hbWUnLCAndGFnTmFtZSddO1xuXG4vLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqQmFja2JvbmUuVmlldyoqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG5fLmV4dGVuZChWaWV3LnByb3RvdHlwZSwgRXZlbnRzLCB7XG5cblx0Ly8gVGhlIGRlZmF1bHQgYHRhZ05hbWVgIG9mIGEgVmlldydzIGVsZW1lbnQgaXMgYFwiZGl2XCJgLlxuXHR0YWdOYW1lOiAnZGl2JyxcblxuXHQvLyBqUXVlcnkgZGVsZWdhdGUgZm9yIGVsZW1lbnQgbG9va3VwLCBzY29wZWQgdG8gRE9NIGVsZW1lbnRzIHdpdGhpbiB0aGVcblx0Ly8gY3VycmVudCB2aWV3LiBUaGlzIHNob3VsZCBiZSBwcmVmZXJlZCB0byBnbG9iYWwgbG9va3VwcyB3aGVyZSBwb3NzaWJsZS5cblx0JDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0cmV0dXJuIHRoaXMuJGVsLmZpbmQoc2VsZWN0b3IpO1xuXHR9LFxuXG5cdC8vIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuXHQvLyBpbml0aWFsaXphdGlvbiBsb2dpYy5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXt9LFxuXG5cdC8vICoqcmVuZGVyKiogaXMgdGhlIGNvcmUgZnVuY3Rpb24gdGhhdCB5b3VyIHZpZXcgc2hvdWxkIG92ZXJyaWRlLCBpbiBvcmRlclxuXHQvLyB0byBwb3B1bGF0ZSBpdHMgZWxlbWVudCAoYHRoaXMuZWxgKSwgd2l0aCB0aGUgYXBwcm9wcmlhdGUgSFRNTC4gVGhlXG5cdC8vIGNvbnZlbnRpb24gaXMgZm9yICoqcmVuZGVyKiogdG8gYWx3YXlzIHJldHVybiBgdGhpc2AuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8vIFJlbW92ZSB0aGlzIHZpZXcgZnJvbSB0aGUgRE9NLiBOb3RlIHRoYXQgdGhlIHZpZXcgaXNuJ3QgcHJlc2VudCBpbiB0aGVcblx0Ly8gRE9NIGJ5IGRlZmF1bHQsIHNvIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IGJlIGEgbm8tb3AuXG5cdHJlbW92ZTogZnVuY3Rpb24oKSB7XG5cdHRoaXMuJGVsLnJlbW92ZSgpO1xuXHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBGb3Igc21hbGwgYW1vdW50cyBvZiBET00gRWxlbWVudHMsIHdoZXJlIGEgZnVsbC1ibG93biB0ZW1wbGF0ZSBpc24ndFxuXHQvLyBuZWVkZWQsIHVzZSAqKm1ha2UqKiB0byBtYW51ZmFjdHVyZSBlbGVtZW50cywgb25lIGF0IGEgdGltZS5cblx0Ly9cblx0Ly8gICAgIHZhciBlbCA9IHRoaXMubWFrZSgnbGknLCB7J2NsYXNzJzogJ3Jvdyd9LCB0aGlzLm1vZGVsLmVzY2FwZSgndGl0bGUnKSk7XG5cdC8vXG5cdG1ha2U6IGZ1bmN0aW9uKHRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNvbnRlbnQpIHtcblx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcblx0aWYgKGF0dHJpYnV0ZXMpICQoZWwpLmF0dHIoYXR0cmlidXRlcyk7XG5cdGlmIChjb250ZW50KSAkKGVsKS5odG1sKGNvbnRlbnQpO1xuXHRyZXR1cm4gZWw7XG5cdH0sXG5cblx0Ly8gQ2hhbmdlIHRoZSB2aWV3J3MgZWxlbWVudCAoYHRoaXMuZWxgIHByb3BlcnR5KSwgaW5jbHVkaW5nIGV2ZW50XG5cdC8vIHJlLWRlbGVnYXRpb24uXG5cdHNldEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGRlbGVnYXRlKSB7XG5cdGlmICh0aGlzLiRlbCkgdGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdHRoaXMuJGVsID0gKGVsZW1lbnQgaW5zdGFuY2VvZiAkKSA/IGVsZW1lbnQgOiAkKGVsZW1lbnQpO1xuXHR0aGlzLmVsID0gdGhpcy4kZWxbMF07XG5cdGlmIChkZWxlZ2F0ZSAhPT0gZmFsc2UpIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcblx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Ly8gU2V0IGNhbGxiYWNrcywgd2hlcmUgYHRoaXMuZXZlbnRzYCBpcyBhIGhhc2ggb2Zcblx0Ly9cblx0Ly8gKntcImV2ZW50IHNlbGVjdG9yXCI6IFwiY2FsbGJhY2tcIn0qXG5cdC8vXG5cdC8vICAgICB7XG5cdC8vICAgICAgICdtb3VzZWRvd24gLnRpdGxlJzogICdlZGl0Jyxcblx0Ly8gICAgICAgJ2NsaWNrIC5idXR0b24nOiAgICAgJ3NhdmUnXG5cdC8vICAgICAgICdjbGljayAub3Blbic6ICAgICAgIGZ1bmN0aW9uKGUpIHsgLi4uIH1cblx0Ly8gICAgIH1cblx0Ly9cblx0Ly8gcGFpcnMuIENhbGxiYWNrcyB3aWxsIGJlIGJvdW5kIHRvIHRoZSB2aWV3LCB3aXRoIGB0aGlzYCBzZXQgcHJvcGVybHkuXG5cdC8vIFVzZXMgZXZlbnQgZGVsZWdhdGlvbiBmb3IgZWZmaWNpZW5jeS5cblx0Ly8gT21pdHRpbmcgdGhlIHNlbGVjdG9yIGJpbmRzIHRoZSBldmVudCB0byBgdGhpcy5lbGAuXG5cdC8vIFRoaXMgb25seSB3b3JrcyBmb3IgZGVsZWdhdGUtYWJsZSBldmVudHM6IG5vdCBgZm9jdXNgLCBgYmx1cmAsIGFuZFxuXHQvLyBub3QgYGNoYW5nZWAsIGBzdWJtaXRgLCBhbmQgYHJlc2V0YCBpbiBJbnRlcm5ldCBFeHBsb3Jlci5cblx0ZGVsZWdhdGVFdmVudHM6IGZ1bmN0aW9uKGV2ZW50cykge1xuXHRpZiAoIShldmVudHMgfHwgKGV2ZW50cyA9IGdldFZhbHVlKHRoaXMsICdldmVudHMnKSkpKSByZXR1cm47XG5cdHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRmb3IgKHZhciBrZXkgaW4gZXZlbnRzKSB7XG5cdFx0dmFyIG1ldGhvZCA9IGV2ZW50c1trZXldO1xuXHRcdGlmICghXy5pc0Z1bmN0aW9uKG1ldGhvZCkpIG1ldGhvZCA9IHRoaXNbZXZlbnRzW2tleV1dO1xuXHRcdGlmICghbWV0aG9kKSB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBcIicgKyBldmVudHNba2V5XSArICdcIiBkb2VzIG5vdCBleGlzdCcpO1xuXHRcdHZhciBtYXRjaCA9IGtleS5tYXRjaChkZWxlZ2F0ZUV2ZW50U3BsaXR0ZXIpO1xuXHRcdHZhciBldmVudE5hbWUgPSBtYXRjaFsxXSwgc2VsZWN0b3IgPSBtYXRjaFsyXTtcblx0XHRtZXRob2QgPSBfLmJpbmQobWV0aG9kLCB0aGlzKTtcblx0XHRldmVudE5hbWUgKz0gJy5kZWxlZ2F0ZUV2ZW50cycgKyB0aGlzLmNpZDtcblx0XHRpZiAoc2VsZWN0b3IgPT09ICcnKSB7XG5cdFx0dGhpcy4kZWwuYmluZChldmVudE5hbWUsIG1ldGhvZCk7XG5cdFx0fSBlbHNlIHtcblx0XHR0aGlzLiRlbC5kZWxlZ2F0ZShzZWxlY3RvciwgZXZlbnROYW1lLCBtZXRob2QpO1xuXHRcdH1cblx0fVxuXHR9LFxuXG5cdC8vIENsZWFycyBhbGwgY2FsbGJhY2tzIHByZXZpb3VzbHkgYm91bmQgdG8gdGhlIHZpZXcgd2l0aCBgZGVsZWdhdGVFdmVudHNgLlxuXHQvLyBZb3UgdXN1YWxseSBkb24ndCBuZWVkIHRvIHVzZSB0aGlzLCBidXQgbWF5IHdpc2ggdG8gaWYgeW91IGhhdmUgbXVsdGlwbGVcblx0Ly8gQmFja2JvbmUgdmlld3MgYXR0YWNoZWQgdG8gdGhlIHNhbWUgRE9NIGVsZW1lbnQuXG5cdHVuZGVsZWdhdGVFdmVudHM6IGZ1bmN0aW9uKCkge1xuXHR0aGlzLiRlbC51bmJpbmQoJy5kZWxlZ2F0ZUV2ZW50cycgKyB0aGlzLmNpZCk7XG5cdH0sXG5cblx0Ly8gUGVyZm9ybXMgdGhlIGluaXRpYWwgY29uZmlndXJhdGlvbiBvZiBhIFZpZXcgd2l0aCBhIHNldCBvZiBvcHRpb25zLlxuXHQvLyBLZXlzIHdpdGggc3BlY2lhbCBtZWFuaW5nICoobW9kZWwsIGNvbGxlY3Rpb24sIGlkLCBjbGFzc05hbWUpKiwgYXJlXG5cdC8vIGF0dGFjaGVkIGRpcmVjdGx5IHRvIHRoZSB2aWV3LlxuXHRfY29uZmlndXJlOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdGlmICh0aGlzLm9wdGlvbnMpIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSB2aWV3T3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHR2YXIgYXR0ciA9IHZpZXdPcHRpb25zW2ldO1xuXHRcdGlmIChvcHRpb25zW2F0dHJdKSB0aGlzW2F0dHJdID0gb3B0aW9uc1thdHRyXTtcblx0fVxuXHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHR9LFxuXG5cdC8vIEVuc3VyZSB0aGF0IHRoZSBWaWV3IGhhcyBhIERPTSBlbGVtZW50IHRvIHJlbmRlciBpbnRvLlxuXHQvLyBJZiBgdGhpcy5lbGAgaXMgYSBzdHJpbmcsIHBhc3MgaXQgdGhyb3VnaCBgJCgpYCwgdGFrZSB0aGUgZmlyc3Rcblx0Ly8gbWF0Y2hpbmcgZWxlbWVudCwgYW5kIHJlLWFzc2lnbiBpdCB0byBgZWxgLiBPdGhlcndpc2UsIGNyZWF0ZVxuXHQvLyBhbiBlbGVtZW50IGZyb20gdGhlIGBpZGAsIGBjbGFzc05hbWVgIGFuZCBgdGFnTmFtZWAgcHJvcGVydGllcy5cblx0X2Vuc3VyZUVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXRoaXMuZWwpIHtcblx0XHR2YXIgYXR0cnMgPSBnZXRWYWx1ZSh0aGlzLCAnYXR0cmlidXRlcycpIHx8IHt9O1xuXHRcdGlmICh0aGlzLmlkKSBhdHRycy5pZCA9IHRoaXMuaWQ7XG5cdFx0aWYgKHRoaXMuY2xhc3NOYW1lKSBhdHRyc1snY2xhc3MnXSA9IHRoaXMuY2xhc3NOYW1lO1xuXHRcdHRoaXMuc2V0RWxlbWVudCh0aGlzLm1ha2UodGhpcy50YWdOYW1lLCBhdHRycyksIGZhbHNlKTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLnNldEVsZW1lbnQodGhpcy5lbCwgZmFsc2UpO1xuXHR9XG5cdH1cblxufSk7XG5cbi8vIFRoZSBzZWxmLXByb3BhZ2F0aW5nIGV4dGVuZCBmdW5jdGlvbiB0aGF0IEJhY2tib25lIGNsYXNzZXMgdXNlLlxudmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChwcm90b1Byb3BzLCBjbGFzc1Byb3BzKSB7XG5cdHZhciBjaGlsZCA9IGluaGVyaXRzKHRoaXMsIHByb3RvUHJvcHMsIGNsYXNzUHJvcHMpO1xuXHRjaGlsZC5leHRlbmQgPSB0aGlzLmV4dGVuZDtcblx0cmV0dXJuIGNoaWxkO1xufTtcblxuLy8gU2V0IHVwIGluaGVyaXRhbmNlIGZvciB0aGUgbW9kZWwsIGNvbGxlY3Rpb24sIGFuZCB2aWV3LlxuTW9kZWwuZXh0ZW5kID0gQ29sbGVjdGlvbi5leHRlbmQgPSBSb3V0ZXIuZXh0ZW5kID0gVmlldy5leHRlbmQgPSBleHRlbmQ7XG5cbi8vIEJhY2tib25lLnN5bmNcbi8vIC0tLS0tLS0tLS0tLS1cblxuLy8gTWFwIGZyb20gQ1JVRCB0byBIVFRQIGZvciBvdXIgZGVmYXVsdCBgQmFja2JvbmUuc3luY2AgaW1wbGVtZW50YXRpb24uXG52YXIgbWV0aG9kTWFwID0ge1xuXHQnY3JlYXRlJzogJ1BPU1QnLFxuXHQndXBkYXRlJzogJ1BVVCcsXG5cdCdkZWxldGUnOiAnREVMRVRFJyxcblx0J3JlYWQnOiAgICdHRVQnXG59O1xuXG4vLyBPdmVycmlkZSB0aGlzIGZ1bmN0aW9uIHRvIGNoYW5nZSB0aGUgbWFubmVyIGluIHdoaWNoIEJhY2tib25lIHBlcnNpc3RzXG4vLyBtb2RlbHMgdG8gdGhlIHNlcnZlci4gWW91IHdpbGwgYmUgcGFzc2VkIHRoZSB0eXBlIG9mIHJlcXVlc3QsIGFuZCB0aGVcbi8vIG1vZGVsIGluIHF1ZXN0aW9uLiBCeSBkZWZhdWx0LCBtYWtlcyBhIFJFU1RmdWwgQWpheCByZXF1ZXN0XG4vLyB0byB0aGUgbW9kZWwncyBgdXJsKClgLiBTb21lIHBvc3NpYmxlIGN1c3RvbWl6YXRpb25zIGNvdWxkIGJlOlxuLy9cbi8vICogVXNlIGBzZXRUaW1lb3V0YCB0byBiYXRjaCByYXBpZC1maXJlIHVwZGF0ZXMgaW50byBhIHNpbmdsZSByZXF1ZXN0LlxuLy8gKiBTZW5kIHVwIHRoZSBtb2RlbHMgYXMgWE1MIGluc3RlYWQgb2YgSlNPTi5cbi8vICogUGVyc2lzdCBtb2RlbHMgdmlhIFdlYlNvY2tldHMgaW5zdGVhZCBvZiBBamF4LlxuLy9cbi8vIFR1cm4gb24gYEJhY2tib25lLmVtdWxhdGVIVFRQYCBpbiBvcmRlciB0byBzZW5kIGBQVVRgIGFuZCBgREVMRVRFYCByZXF1ZXN0c1xuLy8gYXMgYFBPU1RgLCB3aXRoIGEgYF9tZXRob2RgIHBhcmFtZXRlciBjb250YWluaW5nIHRoZSB0cnVlIEhUVFAgbWV0aG9kLFxuLy8gYXMgd2VsbCBhcyBhbGwgcmVxdWVzdHMgd2l0aCB0aGUgYm9keSBhcyBgYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkYFxuLy8gaW5zdGVhZCBvZiBgYXBwbGljYXRpb24vanNvbmAgd2l0aCB0aGUgbW9kZWwgaW4gYSBwYXJhbSBuYW1lZCBgbW9kZWxgLlxuLy8gVXNlZnVsIHdoZW4gaW50ZXJmYWNpbmcgd2l0aCBzZXJ2ZXItc2lkZSBsYW5ndWFnZXMgbGlrZSAqKlBIUCoqIHRoYXQgbWFrZVxuLy8gaXQgZGlmZmljdWx0IHRvIHJlYWQgdGhlIGJvZHkgb2YgYFBVVGAgcmVxdWVzdHMuXG5CYWNrYm9uZS5zeW5jID0gZnVuY3Rpb24obWV0aG9kLCBtb2RlbCwgb3B0aW9ucykge1xuXHR2YXIgdHlwZSA9IG1ldGhvZE1hcFttZXRob2RdO1xuXG5cdC8vIERlZmF1bHQgb3B0aW9ucywgdW5sZXNzIHNwZWNpZmllZC5cblx0b3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblxuXHQvLyBEZWZhdWx0IEpTT04tcmVxdWVzdCBvcHRpb25zLlxuXHR2YXIgcGFyYW1zID0ge3R5cGU6IHR5cGUsIGRhdGFUeXBlOiAnanNvbid9O1xuXG5cdC8vIEVuc3VyZSB0aGF0IHdlIGhhdmUgYSBVUkwuXG5cdGlmICghb3B0aW9ucy51cmwpIHtcblx0cGFyYW1zLnVybCA9IGdldFZhbHVlKG1vZGVsLCAndXJsJykgfHwgdXJsRXJyb3IoKTtcblx0fVxuXG5cdC8vIEVuc3VyZSB0aGF0IHdlIGhhdmUgdGhlIGFwcHJvcHJpYXRlIHJlcXVlc3QgZGF0YS5cblx0aWYgKCFvcHRpb25zLmRhdGEgJiYgbW9kZWwgJiYgKG1ldGhvZCA9PSAnY3JlYXRlJyB8fCBtZXRob2QgPT0gJ3VwZGF0ZScpKSB7XG5cdHBhcmFtcy5jb250ZW50VHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uJztcblx0cGFyYW1zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShtb2RlbC50b0pTT04oKSk7XG5cdH1cblxuXHQvLyBGb3Igb2xkZXIgc2VydmVycywgZW11bGF0ZSBKU09OIGJ5IGVuY29kaW5nIHRoZSByZXF1ZXN0IGludG8gYW4gSFRNTC1mb3JtLlxuXHRpZiAoQmFja2JvbmUuZW11bGF0ZUpTT04pIHtcblx0cGFyYW1zLmNvbnRlbnRUeXBlID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc7XG5cdHBhcmFtcy5kYXRhID0gcGFyYW1zLmRhdGEgPyB7bW9kZWw6IHBhcmFtcy5kYXRhfSA6IHt9O1xuXHR9XG5cblx0Ly8gRm9yIG9sZGVyIHNlcnZlcnMsIGVtdWxhdGUgSFRUUCBieSBtaW1pY2tpbmcgdGhlIEhUVFAgbWV0aG9kIHdpdGggYF9tZXRob2RgXG5cdC8vIEFuZCBhbiBgWC1IVFRQLU1ldGhvZC1PdmVycmlkZWAgaGVhZGVyLlxuXHRpZiAoQmFja2JvbmUuZW11bGF0ZUhUVFApIHtcblx0aWYgKHR5cGUgPT09ICdQVVQnIHx8IHR5cGUgPT09ICdERUxFVEUnKSB7XG5cdFx0aWYgKEJhY2tib25lLmVtdWxhdGVKU09OKSBwYXJhbXMuZGF0YS5fbWV0aG9kID0gdHlwZTtcblx0XHRwYXJhbXMudHlwZSA9ICdQT1NUJztcblx0XHRwYXJhbXMuYmVmb3JlU2VuZCA9IGZ1bmN0aW9uKHhocikge1xuXHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLUhUVFAtTWV0aG9kLU92ZXJyaWRlJywgdHlwZSk7XG5cdFx0fTtcblx0fVxuXHR9XG5cblx0Ly8gRG9uJ3QgcHJvY2VzcyBkYXRhIG9uIGEgbm9uLUdFVCByZXF1ZXN0LlxuXHRpZiAocGFyYW1zLnR5cGUgIT09ICdHRVQnICYmICFCYWNrYm9uZS5lbXVsYXRlSlNPTikge1xuXHRwYXJhbXMucHJvY2Vzc0RhdGEgPSBmYWxzZTtcblx0fVxuXG5cdC8vIE1ha2UgdGhlIHJlcXVlc3QsIGFsbG93aW5nIHRoZSB1c2VyIHRvIG92ZXJyaWRlIGFueSBBamF4IG9wdGlvbnMuXG5cdHJldHVybiAkLmFqYXgoXy5leHRlbmQocGFyYW1zLCBvcHRpb25zKSk7XG59O1xuXG4vLyBXcmFwIGFuIG9wdGlvbmFsIGVycm9yIGNhbGxiYWNrIHdpdGggYSBmYWxsYmFjayBlcnJvciBldmVudC5cbkJhY2tib25lLndyYXBFcnJvciA9IGZ1bmN0aW9uKG9uRXJyb3IsIG9yaWdpbmFsTW9kZWwsIG9wdGlvbnMpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKG1vZGVsLCByZXNwKSB7XG5cdHJlc3AgPSBtb2RlbCA9PT0gb3JpZ2luYWxNb2RlbCA/IHJlc3AgOiBtb2RlbDtcblx0aWYgKG9uRXJyb3IpIHtcblx0XHRvbkVycm9yKG9yaWdpbmFsTW9kZWwsIHJlc3AsIG9wdGlvbnMpO1xuXHR9IGVsc2Uge1xuXHRcdG9yaWdpbmFsTW9kZWwudHJpZ2dlcignZXJyb3InLCBvcmlnaW5hbE1vZGVsLCByZXNwLCBvcHRpb25zKTtcblx0fVxuXHR9O1xufTtcblxuLy8gSGVscGVyc1xuLy8gLS0tLS0tLVxuXG4vLyBTaGFyZWQgZW1wdHkgY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gYWlkIGluIHByb3RvdHlwZS1jaGFpbiBjcmVhdGlvbi5cbnZhciBjdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29ycmVjdGx5IHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLCBmb3Igc3ViY2xhc3Nlcy5cbi8vIFNpbWlsYXIgdG8gYGdvb2cuaW5oZXJpdHNgLCBidXQgdXNlcyBhIGhhc2ggb2YgcHJvdG90eXBlIHByb3BlcnRpZXMgYW5kXG4vLyBjbGFzcyBwcm9wZXJ0aWVzIHRvIGJlIGV4dGVuZGVkLlxudmFyIGluaGVyaXRzID0gZnVuY3Rpb24ocGFyZW50LCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuXHR2YXIgY2hpbGQ7XG5cblx0Ly8gVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuXHQvLyAodGhlIFwiY29uc3RydWN0b3JcIiBwcm9wZXJ0eSBpbiB5b3VyIGBleHRlbmRgIGRlZmluaXRpb24pLCBvciBkZWZhdWx0ZWRcblx0Ly8gYnkgdXMgdG8gc2ltcGx5IGNhbGwgdGhlIHBhcmVudCdzIGNvbnN0cnVjdG9yLlxuXHRpZiAocHJvdG9Qcm9wcyAmJiBwcm90b1Byb3BzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XG5cdGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3Rvcjtcblx0fSBlbHNlIHtcblx0Y2hpbGQgPSBmdW5jdGlvbigpeyBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcblx0fVxuXG5cdC8vIEluaGVyaXQgY2xhc3MgKHN0YXRpYykgcHJvcGVydGllcyBmcm9tIHBhcmVudC5cblx0Xy5leHRlbmQoY2hpbGQsIHBhcmVudCk7XG5cblx0Ly8gU2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gaW5oZXJpdCBmcm9tIGBwYXJlbnRgLCB3aXRob3V0IGNhbGxpbmdcblx0Ly8gYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cblx0Y3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuXHRjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpO1xuXG5cdC8vIEFkZCBwcm90b3R5cGUgcHJvcGVydGllcyAoaW5zdGFuY2UgcHJvcGVydGllcykgdG8gdGhlIHN1YmNsYXNzLFxuXHQvLyBpZiBzdXBwbGllZC5cblx0aWYgKHByb3RvUHJvcHMpIF8uZXh0ZW5kKGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG5cblx0Ly8gQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgaWYgc3VwcGxpZWQuXG5cdGlmIChzdGF0aWNQcm9wcykgXy5leHRlbmQoY2hpbGQsIHN0YXRpY1Byb3BzKTtcblxuXHQvLyBDb3JyZWN0bHkgc2V0IGNoaWxkJ3MgYHByb3RvdHlwZS5jb25zdHJ1Y3RvcmAuXG5cdGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuXG5cdC8vIFNldCBhIGNvbnZlbmllbmNlIHByb3BlcnR5IGluIGNhc2UgdGhlIHBhcmVudCdzIHByb3RvdHlwZSBpcyBuZWVkZWQgbGF0ZXIuXG5cdGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cblx0cmV0dXJuIGNoaWxkO1xufTtcblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhIHZhbHVlIGZyb20gYSBCYWNrYm9uZSBvYmplY3QgYXMgYSBwcm9wZXJ0eVxuLy8gb3IgYXMgYSBmdW5jdGlvbi5cbnZhciBnZXRWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcCkge1xuXHRpZiAoIShvYmplY3QgJiYgb2JqZWN0W3Byb3BdKSkgcmV0dXJuIG51bGw7XG5cdHJldHVybiBfLmlzRnVuY3Rpb24ob2JqZWN0W3Byb3BdKSA/IG9iamVjdFtwcm9wXSgpIDogb2JqZWN0W3Byb3BdO1xufTtcblxuLy8gVGhyb3cgYW4gZXJyb3Igd2hlbiBhIFVSTCBpcyBuZWVkZWQsIGFuZCBub25lIGlzIHN1cHBsaWVkLlxudmFyIHVybEVycm9yID0gZnVuY3Rpb24oKSB7XG5cdHRocm93IG5ldyBFcnJvcignQSBcInVybFwiIHByb3BlcnR5IG9yIGZ1bmN0aW9uIG11c3QgYmUgc3BlY2lmaWVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMpO1xuIl0sInNvdXJjZVJvb3QiOiJkOlxcR0lBTlRcXHd3MlxcaW5ldHRpYmVhY29uXFxSZXNvdXJjZXNcXGFuZHJvaWRcXGFsbG95In0=
