




(function(){var _Mathfloor=





































































































































































































































































































































































































































































































































































































































































































Math.floor,_Mathmin=Math.min,_Mathmax=Math.max,root="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this||{},previousUnderscore=root._,ArrayProto=Array.prototype,ObjProto=Object.prototype,SymbolProto="undefined"==typeof Symbol?null:Symbol.prototype,push=ArrayProto.push,slice=ArrayProto.slice,toString=ObjProto.toString,hasOwnProperty=ObjProto.hasOwnProperty,nativeIsArray=Array.isArray,nativeKeys=Object.keys,nativeCreate=Object.create,Ctor=function(){},_=function(obj){return obj instanceof _?obj:this instanceof _?void(this._wrapped=obj):new _(obj)};"undefined"==typeof exports||exports.nodeType?root._=_:("undefined"!=typeof module&&!module.nodeType&&module.exports&&(exports=module.exports=_),exports._=_),_.VERSION="1.9.1";var builtinIteratee,optimizeCb=function(func,context,argCount){if(void 0===context)return func;switch(null==argCount?3:argCount){case 1:return function(value){return func.call(context,value)};case 3:return function(value,index,collection){return func.call(context,value,index,collection)};case 4:return function(accumulator,value,index,collection){return func.call(context,accumulator,value,index,collection)};}return function(){return func.apply(context,arguments)}},cb=function(value,context,argCount){return _.iteratee===builtinIteratee?null==value?_.identity:_.isFunction(value)?optimizeCb(value,context,argCount):_.isObject(value)&&!_.isArray(value)?_.matcher(value):_.property(value):_.iteratee(value,context)};_.iteratee=builtinIteratee=function(value,context){return cb(value,context,1/0)};var restArguments=function(func,startIndex){return startIndex=null==startIndex?func.length-1:+startIndex,function(){for(var length=_Mathmax(arguments.length-startIndex,0),rest=Array(length),index=0;index<length;index++)rest[index]=arguments[index+startIndex];switch(startIndex){case 0:return func.call(this,rest);case 1:return func.call(this,arguments[0],rest);case 2:return func.call(this,arguments[0],arguments[1],rest);}var args=Array(startIndex+1);for(index=0;index<startIndex;index++)args[index]=arguments[index];return args[startIndex]=rest,func.apply(this,args)}},baseCreate=function(prototype){if(!_.isObject(prototype))return{};if(nativeCreate)return nativeCreate(prototype);Ctor.prototype=prototype;var result=new Ctor;return Ctor.prototype=null,result},shallowProperty=function(key){return function(obj){return null==obj?void 0:obj[key]}},has=function(obj,path){return null!=obj&&hasOwnProperty.call(obj,path)},deepGet=function(obj,path){for(var length=path.length,i=0;i<length;i++){if(null==obj)return;obj=obj[path[i]]}return length?obj:void 0},MAX_ARRAY_INDEX=Math.pow(2,53)-1,getLength=shallowProperty("length"),isArrayLike=function(collection){var length=getLength(collection);return"number"==typeof length&&0<=length&&length<=MAX_ARRAY_INDEX};_.each=_.forEach=function(obj,iteratee,context){iteratee=optimizeCb(iteratee,context);var i,length;if(isArrayLike(obj))for(i=0,length=obj.length;i<length;i++)iteratee(obj[i],i,obj);else{var keys=_.keys(obj);for(i=0,length=keys.length;i<length;i++)iteratee(obj[keys[i]],keys[i],obj)}return obj},_.map=_.collect=function(obj,iteratee,context){iteratee=cb(iteratee,context);for(var currentKey,keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length,results=Array(length),index=0;index<length;index++)currentKey=keys?keys[index]:index,results[index]=iteratee(obj[currentKey],currentKey,obj);return results};var createReduce=function(dir){var reducer=function(obj,iteratee,memo,initial){var keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length,index=0<dir?0:length-1;for(initial||(memo=obj[keys?keys[index]:index],index+=dir);0<=index&&index<length;index+=dir){var currentKey=keys?keys[index]:index;memo=iteratee(memo,obj[currentKey],currentKey,obj)}return memo};return function(obj,iteratee,memo,context){var initial=3<=arguments.length;return reducer(obj,optimizeCb(iteratee,context,4),memo,initial)}};_.reduce=_.foldl=_.inject=createReduce(1),_.reduceRight=_.foldr=createReduce(-1),_.find=_.detect=function(obj,predicate,context){var keyFinder=isArrayLike(obj)?_.findIndex:_.findKey,key=keyFinder(obj,predicate,context);if(void 0!==key&&-1!==key)return obj[key]},_.filter=_.select=function(obj,predicate,context){var results=[];return predicate=cb(predicate,context),_.each(obj,function(value,index,list){predicate(value,index,list)&&results.push(value)}),results},_.reject=function(obj,predicate,context){return _.filter(obj,_.negate(cb(predicate)),context)},_.every=_.all=function(obj,predicate,context){predicate=cb(predicate,context);for(var currentKey,keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length,index=0;index<length;index++)if(currentKey=keys?keys[index]:index,!predicate(obj[currentKey],currentKey,obj))return!1;return!0},_.some=_.any=function(obj,predicate,context){predicate=cb(predicate,context);for(var currentKey,keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length,index=0;index<length;index++)if(currentKey=keys?keys[index]:index,predicate(obj[currentKey],currentKey,obj))return!0;return!1},_.contains=_.includes=_.include=function(obj,item,fromIndex,guard){return isArrayLike(obj)||(obj=_.values(obj)),("number"!=typeof fromIndex||guard)&&(fromIndex=0),0<=_.indexOf(obj,item,fromIndex)},_.invoke=restArguments(function(obj,path,args){var contextPath,func;return _.isFunction(path)?func=path:_.isArray(path)&&(contextPath=path.slice(0,-1),path=path[path.length-1]),_.map(obj,function(context){var method=func;if(!method){if(contextPath&&contextPath.length&&(context=deepGet(context,contextPath)),null==context)return;method=context[path]}return null==method?method:method.apply(context,args)})}),_.pluck=function(obj,key){return _.map(obj,_.property(key))},_.where=function(obj,attrs){return _.filter(obj,_.matcher(attrs))},_.findWhere=function(obj,attrs){return _.find(obj,_.matcher(attrs))},_.max=function(obj,iteratee,context){var value,computed,result=-Infinity,lastComputed=-Infinity;if(null==iteratee||"number"==typeof iteratee&&"object"!=typeof obj[0]&&null!=obj){obj=isArrayLike(obj)?obj:_.values(obj);for(var i=0,length=obj.length;i<length;i++)value=obj[i],null!=value&&value>result&&(result=value)}else iteratee=cb(iteratee,context),_.each(obj,function(v,index,list){computed=iteratee(v,index,list),(computed>lastComputed||computed===-Infinity&&result===-Infinity)&&(result=v,lastComputed=computed)});return result},_.min=function(obj,iteratee,context){var value,computed,result=1/0,lastComputed=1/0;if(null==iteratee||"number"==typeof iteratee&&"object"!=typeof obj[0]&&null!=obj){obj=isArrayLike(obj)?obj:_.values(obj);for(var i=0,length=obj.length;i<length;i++)value=obj[i],null!=value&&value<result&&(result=value)}else iteratee=cb(iteratee,context),_.each(obj,function(v,index,list){computed=iteratee(v,index,list),(computed<lastComputed||computed===1/0&&result===1/0)&&(result=v,lastComputed=computed)});return result},_.shuffle=function(obj){return _.sample(obj,1/0)},_.sample=function(obj,n,guard){if(null==n||guard)return isArrayLike(obj)||(obj=_.values(obj)),obj[_.random(obj.length-1)];var sample=isArrayLike(obj)?_.clone(obj):_.values(obj),length=getLength(sample);n=_Mathmax(_Mathmin(n,length),0);for(var last=length-1,index=0;index<n;index++){var rand=_.random(index,last),temp=sample[index];sample[index]=sample[rand],sample[rand]=temp}return sample.slice(0,n)},_.sortBy=function(obj,iteratee,context){var index=0;return iteratee=cb(iteratee,context),_.pluck(_.map(obj,function(value,key,list){return{value:value,index:index++,criteria:iteratee(value,key,list)}}).sort(function(left,right){var a=left.criteria,b=right.criteria;if(a!==b){if(a>b||void 0===a)return 1;if(a<b||void 0===b)return-1}return left.index-right.index}),"value")};var group=function(behavior,partition){return function(obj,iteratee,context){var result=partition?[[],[]]:{};return iteratee=cb(iteratee,context),_.each(obj,function(value,index){var key=iteratee(value,index,obj);behavior(result,value,key)}),result}};_.groupBy=group(function(result,value,key){has(result,key)?result[key].push(value):result[key]=[value]}),_.indexBy=group(function(result,value,key){result[key]=value}),_.countBy=group(function(result,value,key){has(result,key)?result[key]++:result[key]=1});var reStrSymbol=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;_.toArray=function(obj){return obj?_.isArray(obj)?slice.call(obj):_.isString(obj)?obj.match(reStrSymbol):isArrayLike(obj)?_.map(obj,_.identity):_.values(obj):[]},_.size=function(obj){return null==obj?0:isArrayLike(obj)?obj.length:_.keys(obj).length},_.partition=group(function(result,value,pass){result[pass?0:1].push(value)},!0),_.first=_.head=_.take=function(array,n,guard){return null==array||1>array.length?null==n?void 0:[]:null==n||guard?array[0]:_.initial(array,array.length-n)},_.initial=function(array,n,guard){return slice.call(array,0,_Mathmax(0,array.length-(null==n||guard?1:n)))},_.last=function(array,n,guard){return null==array||1>array.length?null==n?void 0:[]:null==n||guard?array[array.length-1]:_.rest(array,_Mathmax(0,array.length-n))},_.rest=_.tail=_.drop=function(array,n,guard){return slice.call(array,null==n||guard?1:n)},_.compact=function(array){return _.filter(array,Boolean)};var flatten=function(input,shallow,strict,output){output=output||[];for(var value,idx=output.length,i=0,length=getLength(input);i<length;i++)if(value=input[i],!(isArrayLike(value)&&(_.isArray(value)||_.isArguments(value))))strict||(output[idx++]=value);else if(shallow)for(var j=0,len=value.length;j<len;)output[idx++]=value[j++];else flatten(value,shallow,strict,output),idx=output.length;return output};_.flatten=function(array,shallow){return flatten(array,shallow,!1)},_.without=restArguments(function(array,otherArrays){return _.difference(array,otherArrays)}),_.uniq=_.unique=function(array,isSorted,iteratee,context){_.isBoolean(isSorted)||(context=iteratee,iteratee=isSorted,isSorted=!1),null!=iteratee&&(iteratee=cb(iteratee,context));for(var result=[],seen=[],i=0,length=getLength(array);i<length;i++){var value=array[i],computed=iteratee?iteratee(value,i,array):value;isSorted&&!iteratee?((!i||seen!==computed)&&result.push(value),seen=computed):iteratee?!_.contains(seen,computed)&&(seen.push(computed),result.push(value)):!_.contains(result,value)&&result.push(value)}return result},_.union=restArguments(function(arrays){return _.uniq(flatten(arrays,!0,!0))}),_.intersection=function(array){for(var item,result=[],argsLength=arguments.length,i=0,length=getLength(array);i<length;i++)if(item=array[i],!_.contains(result,item)){var j;for(j=1;j<argsLength&&!!_.contains(arguments[j],item);j++);j===argsLength&&result.push(item)}return result},_.difference=restArguments(function(array,rest){return rest=flatten(rest,!0,!0),_.filter(array,function(value){return!_.contains(rest,value)})}),_.unzip=function(array){for(var length=array&&_.max(array,getLength).length||0,result=Array(length),index=0;index<length;index++)result[index]=_.pluck(array,index);return result},_.zip=restArguments(_.unzip),_.object=function(list,values){for(var result={},i=0,length=getLength(list);i<length;i++)values?result[list[i]]=values[i]:result[list[i][0]]=list[i][1];return result};var createPredicateIndexFinder=function(dir){return function(array,predicate,context){predicate=cb(predicate,context);for(var length=getLength(array),index=0<dir?0:length-1;0<=index&&index<length;index+=dir)if(predicate(array[index],index,array))return index;return-1}};_.findIndex=createPredicateIndexFinder(1),_.findLastIndex=createPredicateIndexFinder(-1),_.sortedIndex=function(array,obj,iteratee,context){iteratee=cb(iteratee,context,1);for(var value=iteratee(obj),low=0,high=getLength(array);low<high;){var mid=_Mathfloor((low+high)/2);
iteratee(array[mid])<value?low=mid+1:high=mid;
}
return low;
};


var createIndexFinder=function(dir,predicateFind,sortedIndex){
return function(array,item,idx){
var i=0,length=getLength(array);
if("number"==typeof idx)
0<dir?
i=0<=idx?idx:_Mathmax(idx+length,i):

length=0<=idx?_Mathmin(idx+1,length):idx+length+1;else

if(sortedIndex&&idx&&length)

return idx=sortedIndex(array,item),array[idx]===item?idx:-1;

if(item!==item)

return idx=predicateFind(slice.call(array,i,length),_.isNaN),0<=idx?idx+i:-1;

for(idx=0<dir?i:length-1;0<=idx&&idx<length;idx+=dir)
if(array[idx]===item)return idx;

return-1;
};
};





_.indexOf=createIndexFinder(1,_.findIndex,_.sortedIndex),
_.lastIndexOf=createIndexFinder(-1,_.findLastIndex),




_.range=function(start,stop,step){
null==stop&&(
stop=start||0,
start=0),

step||(
step=stop<start?-1:1);





for(var length=_Mathmax(Math.ceil((stop-start)/step),0),range=Array(length),idx=0;idx<length;idx++,start+=step)
range[idx]=start;


return range;
},



_.chunk=function(array,count){
if(null==count||1>count)return[];for(var
result=[],
i=0,length=array.length;
i<length;)
result.push(slice.call(array,i,i+=count));

return result;
};






var executeBound=function(sourceFunc,boundFunc,context,callingContext,args){
if(!(callingContext instanceof boundFunc))return sourceFunc.apply(context,args);var
self=baseCreate(sourceFunc.prototype),
result=sourceFunc.apply(self,args);return(
_.isObject(result)?result:
self);
};




_.bind=restArguments(function(func,context,args){
if(!_.isFunction(func))throw new TypeError("Bind must be called on a function");
var bound=restArguments(function(callArgs){
return executeBound(func,bound,context,this,args.concat(callArgs));
});
return bound;
}),





_.partial=restArguments(function(func,boundArgs){var
placeholder=_.partial.placeholder,
bound=function(){


for(var position=0,length=boundArgs.length,args=Array(length),i=0;i<length;i++)
args[i]=boundArgs[i]===placeholder?arguments[position++]:boundArgs[i];for(;

position<arguments.length;)args.push(arguments[position++]);
return executeBound(func,bound,this,this,args);
};
return bound;
}),

_.partial.placeholder=_,




_.bindAll=restArguments(function(obj,keys){
keys=flatten(keys,!1,!1);
var index=keys.length;
if(1>index)throw new Error("bindAll must be passed function names");for(;
index--;){
var key=keys[index];
obj[key]=_.bind(obj[key],obj);
}
}),


_.memoize=function(func,hasher){
var memoize=function(key){var
cache=memoize.cache,
address=""+(hasher?hasher.apply(this,arguments):key);

return has(cache,address)||(cache[address]=func.apply(this,arguments)),cache[address];
};

return memoize.cache={},memoize;
},



_.delay=restArguments(function(func,wait,args){
return setTimeout(function(){
return func.apply(null,args);
},wait);
}),



_.defer=_.partial(_.delay,_,1),






_.throttle=function(func,wait,options){var
timeout,context,args,result,
previous=0;
options||(options={});var

later=function(){
previous=!1===options.leading?0:_.now(),
timeout=null,
result=func.apply(context,args),
timeout||(context=args=null);
},

throttled=function(){
var now=_.now();
previous||!1!==options.leading||(previous=now);
var remaining=wait-(now-previous);













return context=this,args=arguments,0>=remaining||remaining>wait?(timeout&&(clearTimeout(timeout),timeout=null),previous=now,result=func.apply(context,args),!timeout&&(context=args=null)):!timeout&&!1!==options.trailing&&(timeout=setTimeout(later,remaining)),result;
};







return throttled.cancel=function(){clearTimeout(timeout),previous=0,timeout=context=args=null},throttled;
},





_.debounce=function(func,wait,immediate){var
timeout,result,

later=function(context,args){
timeout=null,
args&&(result=func.apply(context,args));
},

debounced=restArguments(function(args){

if(timeout&&clearTimeout(timeout),immediate){
var callNow=!timeout;
timeout=setTimeout(later,wait),
callNow&&(result=func.apply(this,args));
}else
timeout=_.delay(later,wait,this,args);


return result;
});






return debounced.cancel=function(){clearTimeout(timeout),timeout=null},debounced;
},




_.wrap=function(func,wrapper){
return _.partial(wrapper,func);
},


_.negate=function(predicate){
return function(){
return!predicate.apply(this,arguments);
};
},



_.compose=function(){var
args=arguments,
start=args.length-1;
return function(){for(var
i=start,
result=args[start].apply(this,arguments);
i--;)result=args[i].call(this,result);
return result;
};
},


_.after=function(times,func){
return function(){
if(1>--times)
return func.apply(this,arguments);

};
},


_.before=function(times,func){
var memo;
return function(){




return 0<--times&&(memo=func.apply(this,arguments)),1>=times&&(func=null),memo;
};
},



_.once=_.partial(_.before,2),

_.restArguments=restArguments;var





hasEnumBug=!{toString:null}.propertyIsEnumerable("toString"),
nonEnumerableProps=["valueOf","isPrototypeOf","toString",
"propertyIsEnumerable","hasOwnProperty","toLocaleString"],

collectNonEnumProps=function(obj,keys){var
nonEnumIdx=nonEnumerableProps.length,
constructor=obj.constructor,
proto=_.isFunction(constructor)&&constructor.prototype||ObjProto,


prop="constructor";for(
has(obj,prop)&&!_.contains(keys,prop)&&keys.push(prop);

nonEnumIdx--;)
prop=nonEnumerableProps[nonEnumIdx],
prop in obj&&obj[prop]!==proto[prop]&&!_.contains(keys,prop)&&
keys.push(prop);


};



_.keys=function(obj){
if(!_.isObject(obj))return[];
if(nativeKeys)return nativeKeys(obj);
var keys=[];
for(var key in obj)has(obj,key)&&keys.push(key);


return hasEnumBug&&collectNonEnumProps(obj,keys),keys;
},


_.allKeys=function(obj){
if(!_.isObject(obj))return[];
var keys=[];
for(var key in obj)keys.push(key);


return hasEnumBug&&collectNonEnumProps(obj,keys),keys;
},


_.values=function(obj){



for(var keys=_.keys(obj),length=keys.length,values=Array(length),i=0;i<length;i++)
values[i]=obj[keys[i]];

return values;
},



_.mapObject=function(obj,iteratee,context){
iteratee=cb(iteratee,context);



for(var
currentKey,keys=_.keys(obj),length=keys.length,results={},index=0;index<length;index++)currentKey=keys[index],
results[currentKey]=iteratee(obj[currentKey],currentKey,obj);

return results;
},



_.pairs=function(obj){



for(var keys=_.keys(obj),length=keys.length,pairs=Array(length),i=0;i<length;i++)
pairs[i]=[keys[i],obj[keys[i]]];

return pairs;
},


_.invert=function(obj){


for(var result={},keys=_.keys(obj),i=0,length=keys.length;i<length;i++)
result[obj[keys[i]]]=keys[i];

return result;
},



_.functions=_.methods=function(obj){
var names=[];
for(var key in obj)
_.isFunction(obj[key])&&names.push(key);

return names.sort();
};


var createAssigner=function(keysFunc,defaults){
return function(obj){
var length=arguments.length;

if(defaults&&(obj=Object(obj)),2>length||null==obj)return obj;
for(var index=1;index<length;index++)



for(var
key,source=arguments[index],keys=keysFunc(source),l=keys.length,i=0;i<l;i++)key=keys[i],
defaults&&void 0!==obj[key]||(obj[key]=source[key]);


return obj;
};
};


_.extend=createAssigner(_.allKeys),



_.extendOwn=_.assign=createAssigner(_.keys),


_.findKey=function(obj,predicate,context){
predicate=cb(predicate,context);

for(var key,keys=_.keys(obj),i=0,length=keys.length;i<length;i++)

if(key=keys[i],predicate(obj[key],key,obj))return key;

};


var keyInObj=function(value,key,obj){
return key in obj;
};


_.pick=restArguments(function(obj,keys){
var result={},iteratee=keys[0];
if(null==obj)return result;
_.isFunction(iteratee)?(
1<keys.length&&(iteratee=optimizeCb(iteratee,keys[1])),
keys=_.allKeys(obj)):(

iteratee=keyInObj,
keys=flatten(keys,!1,!1),
obj=Object(obj));

for(var i=0,length=keys.length;i<length;i++){var
key=keys[i],
value=obj[key];
iteratee(value,key,obj)&&(result[key]=value);
}
return result;
}),


_.omit=restArguments(function(obj,keys){
var context,iteratee=keys[0];









return _.isFunction(iteratee)?(iteratee=_.negate(iteratee),1<keys.length&&(context=keys[1])):(keys=_.map(flatten(keys,!1,!1),String),iteratee=function(value,key){return!_.contains(keys,key)}),_.pick(obj,iteratee,context);
}),


_.defaults=createAssigner(_.allKeys,!0),




_.create=function(prototype,props){
var result=baseCreate(prototype);

return props&&_.extendOwn(result,props),result;
},


_.clone=function(obj){return(
_.isObject(obj)?
_.isArray(obj)?obj.slice():_.extend({},obj):obj);
},




_.tap=function(obj,interceptor){

return interceptor(obj),obj;
},


_.isMatch=function(object,attrs){
var keys=_.keys(attrs),length=keys.length;
if(null==object)return!length;

for(var
key,obj=Object(object),i=0;i<length;i++)
if(key=keys[i],attrs[key]!==obj[key]||!(key in obj))return!1;

return!0;
};



var eq,deepEq;
eq=function(a,b,aStack,bStack){


if(a===b)return 0!==a||1/a==1/b;

if(null==a||null==b)return!1;

if(a!==a)return b!==b;

var type=typeof a;return(
"function"==type||"object"===type||"object"==typeof b)&&
deepEq(a,b,aStack,bStack);
},


deepEq=function(a,b,aStack,bStack){

a instanceof _&&(a=a._wrapped),
b instanceof _&&(b=b._wrapped);

var className=toString.call(a);
if(className!==toString.call(b))return!1;
switch(className){

case"[object RegExp]":

case"[object String]":


return""+a==""+b;
case"[object Number]":return(


+a==+a?

0==+a?1/+a==1/b:+a==+b:+b!=+b);
case"[object Date]":
case"[object Boolean]":



return+a==+b;
case"[object Symbol]":
return SymbolProto.valueOf.call(a)===SymbolProto.valueOf.call(b);}


var areArrays="[object Array]"===className;
if(!areArrays){
if("object"!=typeof a||"object"!=typeof b)return!1;



var aCtor=a.constructor,bCtor=b.constructor;
if(aCtor!==bCtor&&!(_.isFunction(aCtor)&&aCtor instanceof aCtor&&
_.isFunction(bCtor)&&bCtor instanceof bCtor)&&
"constructor"in a&&"constructor"in b)
return!1;

}





aStack=aStack||[],
bStack=bStack||[];for(
var length=aStack.length;
length--;)


if(aStack[length]===a)return bStack[length]===b;







if(aStack.push(a),bStack.push(b),areArrays){


if(length=a.length,length!==b.length)return!1;for(;

length--;)
if(!eq(a[length],b[length],aStack,bStack))return!1;

}else{

var key,keys=_.keys(a);


if(length=keys.length,_.keys(b).length!==length)return!1;for(;
length--;)


if(key=keys[length],!(has(b,key)&&eq(a[key],b[key],aStack,bStack)))return!1;

}



return aStack.pop(),bStack.pop(),!0;
},


_.isEqual=function(a,b){
return eq(a,b);
},



_.isEmpty=function(obj){return!(
null!=obj)||(
isArrayLike(obj)&&(_.isArray(obj)||_.isString(obj)||_.isArguments(obj))?0===obj.length:
0===_.keys(obj).length);
},


_.isElement=function(obj){
return!!(obj&&1===obj.nodeType);
},



_.isArray=nativeIsArray||function(obj){
return"[object Array]"===toString.call(obj);
},


_.isObject=function(obj){
var type=typeof obj;
return"function"==type||"object"===type&&!!obj;
},


_.each(["Arguments","Function","String","Number","Date","RegExp","Error","Symbol","Map","WeakMap","Set","WeakSet"],function(name){
_["is"+name]=function(obj){
return toString.call(obj)==="[object "+name+"]";
};
}),



_.isArguments(arguments)||(
_.isArguments=function(obj){
return has(obj,"callee");
});




var nodelist=root.document&&root.document.childNodes;
"function"!=typeof /./&&"object"!=typeof Int8Array&&"function"!=typeof nodelist&&(
_.isFunction=function(obj){
return"function"==typeof obj||!1;
}),



_.isFinite=function(obj){
return!_.isSymbol(obj)&&isFinite(obj)&&!isNaN(parseFloat(obj));
},


_.isNaN=function(obj){
return _.isNumber(obj)&&isNaN(obj);
},


_.isBoolean=function(obj){
return!0===obj||!1===obj||"[object Boolean]"===toString.call(obj);
},


_.isNull=function(obj){
return null===obj;
},


_.isUndefined=function(obj){
return void 0===obj;
},



_.has=function(obj,path){
if(!_.isArray(path))
return has(obj,path);


for(var
key,length=path.length,i=0;i<length;i++){
if(key=path[i],null==obj||!hasOwnProperty.call(obj,key))
return!1;

obj=obj[key];
}
return!!length;
},






_.noConflict=function(){

return root._=previousUnderscore,this;
},


_.identity=function(value){
return value;
},


_.constant=function(value){
return function(){
return value;
};
},

_.noop=function(){},



_.property=function(path){return(
_.isArray(path)?


function(obj){
return deepGet(obj,path);
}:shallowProperty(path));
},


_.propertyOf=function(obj){return(
null==obj?
function(){}:

function(path){
return _.isArray(path)?deepGet(obj,path):obj[path];
});
},



_.matcher=_.matches=function(attrs){

return attrs=_.extendOwn({},attrs),function(obj){
return _.isMatch(obj,attrs);
};
},


_.times=function(n,iteratee,context){
var accum=Array(_Mathmax(0,n));
iteratee=optimizeCb(iteratee,context,1);
for(var i=0;i<n;i++)accum[i]=iteratee(i);
return accum;
},


_.random=function(min,max){




return null==max&&(max=min,min=0),min+_Mathfloor(Math.random()*(max-min+1));
},


_.now=Date.now||function(){
return new Date().getTime();
};var


escapeMap={
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#x27;",
"`":"&#x60;"},

unescapeMap=_.invert(escapeMap),


createEscaper=function(map){var
escaper=function(match){
return map[match];
},

source="(?:"+_.keys(map).join("|")+")",
testRegexp=RegExp(source),
replaceRegexp=RegExp(source,"g");
return function(string){

return string=null==string?"":""+string,testRegexp.test(string)?string.replace(replaceRegexp,escaper):string;
};
};
_.escape=createEscaper(escapeMap),
_.unescape=createEscaper(unescapeMap),




_.result=function(obj,path,fallback){
_.isArray(path)||(path=[path]);
var length=path.length;
if(!length)
return _.isFunction(fallback)?fallback.call(obj):fallback;

for(var
prop,i=0;i<length;i++)prop=null==obj?void 0:obj[path[i]],
void 0===prop&&(
prop=fallback,
i=length),

obj=_.isFunction(prop)?prop.call(obj):prop;

return obj;
};



var idCounter=0;
_.uniqueId=function(prefix){
var id=++idCounter+"";
return prefix?prefix+id:id;
},



_.templateSettings={
evaluate:/<%([\s\S]+?)%>/g,
interpolate:/<%=([\s\S]+?)%>/g,
escape:/<%-([\s\S]+?)%>/g};var





noMatch=/(.)^/,



escapes={
"'":"'",
"\\":"\\",
"\r":"r",
"\n":"n",
"\u2028":"u2028",
"\u2029":"u2029"},


escapeRegExp=/\\|'|\r|\n|\u2028|\u2029/g,

escapeChar=function(match){
return"\\"+escapes[match];
};





_.template=function(text,settings,oldSettings){
!settings&&oldSettings&&(settings=oldSettings),
settings=_.defaults({},settings,_.templateSettings);var


matcher=RegExp([
(settings.escape||noMatch).source,
(settings.interpolate||noMatch).source,
(settings.evaluate||noMatch).source].
join("|")+"|$","g"),


index=0,
source="__p+='";
text.replace(matcher,function(match,escape,interpolate,evaluate,offset){












return source+=text.slice(index,offset).replace(escapeRegExp,escapeChar),index=offset+match.length,escape?source+="'+\n((__t=("+escape+"))==null?'':_.escape(__t))+\n'":interpolate?source+="'+\n((__t=("+interpolate+"))==null?'':__t)+\n'":evaluate&&(source+="';\n"+evaluate+"\n__p+='"),match;
}),
source+="';\n",


settings.variable||(source="with(obj||{}){\n"+source+"}\n"),

source="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+

source+"return __p;\n";

var render;
try{
render=new Function(settings.variable||"obj","_",source);
}catch(e){

throw e.source=source,e;
}var

template=function(data){
return render.call(this,data,_);
},


argument=settings.variable||"obj";


return template.source="function("+argument+"){\n"+source+"}",template;
},


_.chain=function(obj){
var instance=_(obj);

return instance._chain=!0,instance;
};








var chainResult=function(instance,obj){
return instance._chain?_(obj).chain():obj;
};


_.mixin=function(obj){








return _.each(_.functions(obj),function(name){var func=_[name]=obj[name];_.prototype[name]=function(){var args=[this._wrapped];return push.apply(args,arguments),chainResult(this,func.apply(_,args))}}),_;
},


_.mixin(_),


_.each(["pop","push","reverse","shift","sort","splice","unshift"],function(name){
var method=ArrayProto[name];
_.prototype[name]=function(){
var obj=this._wrapped;


return method.apply(obj,arguments),("shift"===name||"splice"===name)&&0===obj.length&&delete obj[0],chainResult(this,obj);
};
}),


_.each(["concat","join","slice"],function(name){
var method=ArrayProto[name];
_.prototype[name]=function(){
return chainResult(this,method.apply(this._wrapped,arguments));
};
}),


_.prototype.value=function(){
return this._wrapped;
},



_.prototype.valueOf=_.prototype.toJSON=_.prototype.value,

_.prototype.toString=function(){
return this._wrapped+"";
},








"function"==typeof define&&define.amd&&
define("underscore",[],function(){
return _;
});

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVuZGVyc2NvcmUuanMiXSwibmFtZXMiOlsiTWF0aCIsImZsb29yIiwibWluIiwibWF4Iiwicm9vdCIsInNlbGYiLCJnbG9iYWwiLCJwcmV2aW91c1VuZGVyc2NvcmUiLCJfIiwiQXJyYXlQcm90byIsIkFycmF5IiwicHJvdG90eXBlIiwiT2JqUHJvdG8iLCJPYmplY3QiLCJTeW1ib2xQcm90byIsIlN5bWJvbCIsInB1c2giLCJzbGljZSIsInRvU3RyaW5nIiwiaGFzT3duUHJvcGVydHkiLCJuYXRpdmVJc0FycmF5IiwiaXNBcnJheSIsIm5hdGl2ZUtleXMiLCJrZXlzIiwibmF0aXZlQ3JlYXRlIiwiY3JlYXRlIiwiQ3RvciIsIm9iaiIsIl93cmFwcGVkIiwiZXhwb3J0cyIsIm5vZGVUeXBlIiwibW9kdWxlIiwiVkVSU0lPTiIsImJ1aWx0aW5JdGVyYXRlZSIsIm9wdGltaXplQ2IiLCJmdW5jIiwiY29udGV4dCIsImFyZ0NvdW50IiwidmFsdWUiLCJjYWxsIiwiaW5kZXgiLCJjb2xsZWN0aW9uIiwiYWNjdW11bGF0b3IiLCJhcHBseSIsImFyZ3VtZW50cyIsImNiIiwiaXRlcmF0ZWUiLCJpZGVudGl0eSIsImlzRnVuY3Rpb24iLCJpc09iamVjdCIsIm1hdGNoZXIiLCJwcm9wZXJ0eSIsInJlc3RBcmd1bWVudHMiLCJzdGFydEluZGV4IiwibGVuZ3RoIiwicmVzdCIsImFyZ3MiLCJiYXNlQ3JlYXRlIiwicmVzdWx0Iiwic2hhbGxvd1Byb3BlcnR5Iiwia2V5IiwiaGFzIiwicGF0aCIsImRlZXBHZXQiLCJpIiwiTUFYX0FSUkFZX0lOREVYIiwicG93IiwiZ2V0TGVuZ3RoIiwiaXNBcnJheUxpa2UiLCJlYWNoIiwiZm9yRWFjaCIsIm1hcCIsImNvbGxlY3QiLCJjdXJyZW50S2V5IiwicmVzdWx0cyIsImNyZWF0ZVJlZHVjZSIsImRpciIsInJlZHVjZXIiLCJtZW1vIiwiaW5pdGlhbCIsInJlZHVjZSIsImZvbGRsIiwiaW5qZWN0IiwicmVkdWNlUmlnaHQiLCJmb2xkciIsImZpbmQiLCJkZXRlY3QiLCJwcmVkaWNhdGUiLCJrZXlGaW5kZXIiLCJmaW5kSW5kZXgiLCJmaW5kS2V5IiwiZmlsdGVyIiwic2VsZWN0IiwibGlzdCIsInJlamVjdCIsIm5lZ2F0ZSIsImV2ZXJ5IiwiYWxsIiwic29tZSIsImFueSIsImNvbnRhaW5zIiwiaW5jbHVkZXMiLCJpbmNsdWRlIiwiaXRlbSIsImZyb21JbmRleCIsImd1YXJkIiwidmFsdWVzIiwiaW5kZXhPZiIsImludm9rZSIsImNvbnRleHRQYXRoIiwibWV0aG9kIiwicGx1Y2siLCJ3aGVyZSIsImF0dHJzIiwiZmluZFdoZXJlIiwiY29tcHV0ZWQiLCJJbmZpbml0eSIsImxhc3RDb21wdXRlZCIsInYiLCJzaHVmZmxlIiwic2FtcGxlIiwibiIsInJhbmRvbSIsImNsb25lIiwibGFzdCIsInJhbmQiLCJ0ZW1wIiwic29ydEJ5IiwiY3JpdGVyaWEiLCJzb3J0IiwibGVmdCIsInJpZ2h0IiwiYSIsImIiLCJncm91cCIsImJlaGF2aW9yIiwicGFydGl0aW9uIiwiZ3JvdXBCeSIsImluZGV4QnkiLCJjb3VudEJ5IiwicmVTdHJTeW1ib2wiLCJ0b0FycmF5IiwiaXNTdHJpbmciLCJtYXRjaCIsInNpemUiLCJwYXNzIiwiZmlyc3QiLCJoZWFkIiwidGFrZSIsImFycmF5IiwidGFpbCIsImRyb3AiLCJjb21wYWN0IiwiQm9vbGVhbiIsImZsYXR0ZW4iLCJpbnB1dCIsInNoYWxsb3ciLCJzdHJpY3QiLCJvdXRwdXQiLCJpZHgiLCJpc0FyZ3VtZW50cyIsImoiLCJsZW4iLCJ3aXRob3V0Iiwib3RoZXJBcnJheXMiLCJkaWZmZXJlbmNlIiwidW5pcSIsInVuaXF1ZSIsImlzU29ydGVkIiwiaXNCb29sZWFuIiwic2VlbiIsInVuaW9uIiwiYXJyYXlzIiwiaW50ZXJzZWN0aW9uIiwiYXJnc0xlbmd0aCIsInVuemlwIiwiemlwIiwib2JqZWN0IiwiY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIiLCJmaW5kTGFzdEluZGV4Iiwic29ydGVkSW5kZXgiLCJsb3ciLCJoaWdoIiwibWlkIiwiY3JlYXRlSW5kZXhGaW5kZXIiLCJwcmVkaWNhdGVGaW5kIiwiaXNOYU4iLCJsYXN0SW5kZXhPZiIsInJhbmdlIiwic3RhcnQiLCJzdG9wIiwic3RlcCIsImNlaWwiLCJjaHVuayIsImNvdW50IiwiZXhlY3V0ZUJvdW5kIiwic291cmNlRnVuYyIsImJvdW5kRnVuYyIsImNhbGxpbmdDb250ZXh0IiwiYmluZCIsIlR5cGVFcnJvciIsImJvdW5kIiwiY2FsbEFyZ3MiLCJjb25jYXQiLCJwYXJ0aWFsIiwiYm91bmRBcmdzIiwicGxhY2Vob2xkZXIiLCJwb3NpdGlvbiIsImJpbmRBbGwiLCJFcnJvciIsIm1lbW9pemUiLCJoYXNoZXIiLCJjYWNoZSIsImFkZHJlc3MiLCJkZWxheSIsIndhaXQiLCJzZXRUaW1lb3V0IiwiZGVmZXIiLCJ0aHJvdHRsZSIsIm9wdGlvbnMiLCJ0aW1lb3V0IiwicHJldmlvdXMiLCJsYXRlciIsImxlYWRpbmciLCJub3ciLCJ0aHJvdHRsZWQiLCJyZW1haW5pbmciLCJjbGVhclRpbWVvdXQiLCJ0cmFpbGluZyIsImNhbmNlbCIsImRlYm91bmNlIiwiaW1tZWRpYXRlIiwiZGVib3VuY2VkIiwiY2FsbE5vdyIsIndyYXAiLCJ3cmFwcGVyIiwiY29tcG9zZSIsImFmdGVyIiwidGltZXMiLCJiZWZvcmUiLCJvbmNlIiwiaGFzRW51bUJ1ZyIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwibm9uRW51bWVyYWJsZVByb3BzIiwiY29sbGVjdE5vbkVudW1Qcm9wcyIsIm5vbkVudW1JZHgiLCJjb25zdHJ1Y3RvciIsInByb3RvIiwicHJvcCIsImFsbEtleXMiLCJtYXBPYmplY3QiLCJwYWlycyIsImludmVydCIsImZ1bmN0aW9ucyIsIm1ldGhvZHMiLCJuYW1lcyIsImNyZWF0ZUFzc2lnbmVyIiwia2V5c0Z1bmMiLCJkZWZhdWx0cyIsInNvdXJjZSIsImwiLCJleHRlbmQiLCJleHRlbmRPd24iLCJhc3NpZ24iLCJrZXlJbk9iaiIsInBpY2siLCJvbWl0IiwiU3RyaW5nIiwicHJvcHMiLCJ0YXAiLCJpbnRlcmNlcHRvciIsImlzTWF0Y2giLCJlcSIsImRlZXBFcSIsImFTdGFjayIsImJTdGFjayIsInR5cGUiLCJjbGFzc05hbWUiLCJ2YWx1ZU9mIiwiYXJlQXJyYXlzIiwiYUN0b3IiLCJiQ3RvciIsInBvcCIsImlzRXF1YWwiLCJpc0VtcHR5IiwiaXNFbGVtZW50IiwibmFtZSIsIm5vZGVsaXN0IiwiZG9jdW1lbnQiLCJjaGlsZE5vZGVzIiwiSW50OEFycmF5IiwiaXNGaW5pdGUiLCJpc1N5bWJvbCIsInBhcnNlRmxvYXQiLCJpc051bWJlciIsImlzTnVsbCIsImlzVW5kZWZpbmVkIiwibm9Db25mbGljdCIsImNvbnN0YW50Iiwibm9vcCIsInByb3BlcnR5T2YiLCJtYXRjaGVzIiwiYWNjdW0iLCJEYXRlIiwiZ2V0VGltZSIsImVzY2FwZU1hcCIsInVuZXNjYXBlTWFwIiwiY3JlYXRlRXNjYXBlciIsImVzY2FwZXIiLCJqb2luIiwidGVzdFJlZ2V4cCIsIlJlZ0V4cCIsInJlcGxhY2VSZWdleHAiLCJzdHJpbmciLCJ0ZXN0IiwicmVwbGFjZSIsImVzY2FwZSIsInVuZXNjYXBlIiwiZmFsbGJhY2siLCJpZENvdW50ZXIiLCJ1bmlxdWVJZCIsInByZWZpeCIsImlkIiwidGVtcGxhdGVTZXR0aW5ncyIsImV2YWx1YXRlIiwiaW50ZXJwb2xhdGUiLCJub01hdGNoIiwiZXNjYXBlcyIsImVzY2FwZVJlZ0V4cCIsImVzY2FwZUNoYXIiLCJ0ZW1wbGF0ZSIsInRleHQiLCJzZXR0aW5ncyIsIm9sZFNldHRpbmdzIiwib2Zmc2V0IiwidmFyaWFibGUiLCJyZW5kZXIiLCJGdW5jdGlvbiIsImUiLCJkYXRhIiwiYXJndW1lbnQiLCJjaGFpbiIsImluc3RhbmNlIiwiX2NoYWluIiwiY2hhaW5SZXN1bHQiLCJtaXhpbiIsInRvSlNPTiIsImRlZmluZSIsImFtZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q0csU0FBRixDQUFZbVIsSUFBWixFQUFvQixVQUFXO0FBQzdCLE1BQU8wRCxDQUFBQSxXQUFXLENBQUMsSUFBRCxDQUFPMU8sTUFBTSxDQUFDbkUsS0FBUCxDQUFhLEtBQUtmLFFBQWxCLENBQTRCZ0IsU0FBNUIsQ0FBUCxDQUFsQjtBQUNELENBSmdEO0FBS2xELENBTEQsQ0F0bkRVOzs7QUE4bkRWcEMsQ0FBQyxDQUFDRyxTQUFGLENBQVkyQixLQUFaLENBQW9CLFVBQVc7QUFDN0IsTUFBTyxNQUFLVixRQUFaO0FBQ0QsQ0Fob0RTOzs7O0FBb29EVnBCLENBQUMsQ0FBQ0csU0FBRixDQUFZMlEsT0FBWixDQUFzQjlRLENBQUMsQ0FBQ0csU0FBRixDQUFZK1UsTUFBWixDQUFxQmxWLENBQUMsQ0FBQ0csU0FBRixDQUFZMkIsS0Fwb0Q3Qzs7QUFzb0RWOUIsQ0FBQyxDQUFDRyxTQUFGLENBQVlPLFFBQVosQ0FBdUIsVUFBVztBQUNoQyxNQUFjLE1BQUtVLFFBQW5CO0FBQ0QsQ0F4b0RTOzs7Ozs7Ozs7QUFpcERXLFVBQWpCLFFBQU8rVCxDQUFBQSxNQUFQLEVBQStCQSxNQUFNLENBQUNDLEdBanBEaEM7QUFrcERSRCxNQUFNLENBQUMsWUFBRCxDQUFlLEVBQWYsQ0FBbUIsVUFBVztBQUNsQyxNQUFPblYsQ0FBQUEsQ0FBUDtBQUNELENBRkssQ0FscERFOztBQXNwRFgsQ0F0cERBLEciLCJzb3VyY2VzQ29udGVudCI6WyIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjkuMVxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxOCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIChgc2VsZmApIGluIHRoZSBicm93c2VyLCBgZ2xvYmFsYFxuICAvLyBvbiB0aGUgc2VydmVyLCBvciBgdGhpc2AgaW4gc29tZSB2aXJ0dWFsIG1hY2hpbmVzLiBXZSB1c2UgYHNlbGZgXG4gIC8vIGluc3RlYWQgb2YgYHdpbmRvd2AgZm9yIGBXZWJXb3JrZXJgIHN1cHBvcnQuXG4gIHZhciByb290ID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcbiAgICAgICAgICAgIHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsICYmIGdsb2JhbCB8fFxuICAgICAgICAgICAgdGhpcyB8fFxuICAgICAgICAgICAge307XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgU3ltYm9sUHJvdG8gPSB0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyA/IFN5bWJvbC5wcm90b3R5cGUgOiBudWxsO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIHRvU3RyaW5nID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgICBoYXNPd25Qcm9wZXJ0eSA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyIG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5LFxuICAgICAgbmF0aXZlS2V5cyA9IE9iamVjdC5rZXlzLFxuICAgICAgbmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlaXIgb2xkIG1vZHVsZSBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgLy8gKGBub2RlVHlwZWAgaXMgY2hlY2tlZCB0byBlbnN1cmUgdGhhdCBgbW9kdWxlYFxuICAvLyBhbmQgYGV4cG9ydHNgIGFyZSBub3QgSFRNTCBlbGVtZW50cy4pXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiAhZXhwb3J0cy5ub2RlVHlwZSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuOS4xJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIG9wdGltaXplQ2IgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgLy8gVGhlIDItYXJndW1lbnQgY2FzZSBpcyBvbWl0dGVkIGJlY2F1c2Ugd2XigJlyZSBub3QgdXNpbmcgaXQuXG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgYnVpbHRpbkl0ZXJhdGVlO1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGVhY2hcbiAgLy8gZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlciBgaWRlbnRpdHlgLFxuICAvLyBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgdmFyIGNiID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKF8uaXRlcmF0ZWUgIT09IGJ1aWx0aW5JdGVyYXRlZSkgcmV0dXJuIF8uaXRlcmF0ZWUodmFsdWUsIGNvbnRleHQpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgIV8uaXNBcnJheSh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcblxuICAvLyBFeHRlcm5hbCB3cmFwcGVyIGZvciBvdXIgY2FsbGJhY2sgZ2VuZXJhdG9yLiBVc2VycyBtYXkgY3VzdG9taXplXG4gIC8vIGBfLml0ZXJhdGVlYCBpZiB0aGV5IHdhbnQgYWRkaXRpb25hbCBwcmVkaWNhdGUvaXRlcmF0ZWUgc2hvcnRoYW5kIHN0eWxlcy5cbiAgLy8gVGhpcyBhYnN0cmFjdGlvbiBoaWRlcyB0aGUgaW50ZXJuYWwtb25seSBhcmdDb3VudCBhcmd1bWVudC5cbiAgXy5pdGVyYXRlZSA9IGJ1aWx0aW5JdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gU29tZSBmdW5jdGlvbnMgdGFrZSBhIHZhcmlhYmxlIG51bWJlciBvZiBhcmd1bWVudHMsIG9yIGEgZmV3IGV4cGVjdGVkXG4gIC8vIGFyZ3VtZW50cyBhdCB0aGUgYmVnaW5uaW5nIGFuZCB0aGVuIGEgdmFyaWFibGUgbnVtYmVyIG9mIHZhbHVlcyB0byBvcGVyYXRlXG4gIC8vIG9uLiBUaGlzIGhlbHBlciBhY2N1bXVsYXRlcyBhbGwgcmVtYWluaW5nIGFyZ3VtZW50cyBwYXN0IHRoZSBmdW5jdGlvbuKAmXNcbiAgLy8gYXJndW1lbnQgbGVuZ3RoIChvciBhbiBleHBsaWNpdCBgc3RhcnRJbmRleGApLCBpbnRvIGFuIGFycmF5IHRoYXQgYmVjb21lc1xuICAvLyB0aGUgbGFzdCBhcmd1bWVudC4gU2ltaWxhciB0byBFUzbigJlzIFwicmVzdCBwYXJhbWV0ZXJcIi5cbiAgdmFyIHJlc3RBcmd1bWVudHMgPSBmdW5jdGlvbihmdW5jLCBzdGFydEluZGV4KSB7XG4gICAgc3RhcnRJbmRleCA9IHN0YXJ0SW5kZXggPT0gbnVsbCA/IGZ1bmMubGVuZ3RoIC0gMSA6ICtzdGFydEluZGV4O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChhcmd1bWVudHMubGVuZ3RoIC0gc3RhcnRJbmRleCwgMCksXG4gICAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHJlc3RbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4ICsgc3RhcnRJbmRleF07XG4gICAgICB9XG4gICAgICBzd2l0Y2ggKHN0YXJ0SW5kZXgpIHtcbiAgICAgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIHJlc3QpO1xuICAgICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJndW1lbnRzWzBdLCByZXN0KTtcbiAgICAgICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCByZXN0KTtcbiAgICAgIH1cbiAgICAgIHZhciBhcmdzID0gQXJyYXkoc3RhcnRJbmRleCArIDEpO1xuICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgc3RhcnRJbmRleDsgaW5kZXgrKykge1xuICAgICAgICBhcmdzW2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICB9XG4gICAgICBhcmdzW3N0YXJ0SW5kZXhdID0gcmVzdDtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIHNoYWxsb3dQcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGhhcyA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcGF0aCk7XG4gIH1cblxuICB2YXIgZGVlcEdldCA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xuICAgIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgICBvYmogPSBvYmpbcGF0aFtpXV07XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGggPyBvYmogOiB2b2lkIDA7XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3QuXG4gIC8vIFJlbGF0ZWQ6IGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIC8vIEF2b2lkcyBhIHZlcnkgbmFzdHkgaU9TIDggSklUIGJ1ZyBvbiBBUk0tNjQuICMyMDk0XG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgZ2V0TGVuZ3RoID0gc2hhbGxvd1Byb3BlcnR5KCdsZW5ndGgnKTtcbiAgdmFyIGlzQXJyYXlMaWtlID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIHZhciBjcmVhdGVSZWR1Y2UgPSBmdW5jdGlvbihkaXIpIHtcbiAgICAvLyBXcmFwIGNvZGUgdGhhdCByZWFzc2lnbnMgYXJndW1lbnQgdmFyaWFibGVzIGluIGEgc2VwYXJhdGUgZnVuY3Rpb24gdGhhblxuICAgIC8vIHRoZSBvbmUgdGhhdCBhY2Nlc3NlcyBgYXJndW1lbnRzLmxlbmd0aGAgdG8gYXZvaWQgYSBwZXJmIGhpdC4gKCMxOTkxKVxuICAgIHZhciByZWR1Y2VyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgaW5pdGlhbCkge1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMztcbiAgICAgIHJldHVybiByZWR1Y2VyKG9iaiwgb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgNCksIG1lbW8sIGluaXRpYWwpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGNyZWF0ZVJlZHVjZSgxKTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXlGaW5kZXIgPSBpc0FycmF5TGlrZShvYmopID8gXy5maW5kSW5kZXggOiBfLmZpbmRLZXk7XG4gICAgdmFyIGtleSA9IGtleUZpbmRlcihvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwICYmIGtleSAhPT0gLTEpIHJldHVybiBvYmpba2V5XTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubmVnYXRlKGNiKHByZWRpY2F0ZSkpLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZXNgIGFuZCBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGVzID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ICE9ICdudW1iZXInIHx8IGd1YXJkKSBmcm9tSW5kZXggPSAwO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCBpdGVtLCBmcm9tSW5kZXgpID49IDA7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihvYmosIHBhdGgsIGFyZ3MpIHtcbiAgICB2YXIgY29udGV4dFBhdGgsIGZ1bmM7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihwYXRoKSkge1xuICAgICAgZnVuYyA9IHBhdGg7XG4gICAgfSBlbHNlIGlmIChfLmlzQXJyYXkocGF0aCkpIHtcbiAgICAgIGNvbnRleHRQYXRoID0gcGF0aC5zbGljZSgwLCAtMSk7XG4gICAgICBwYXRoID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICB2YXIgbWV0aG9kID0gZnVuYztcbiAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgIGlmIChjb250ZXh0UGF0aCAmJiBjb250ZXh0UGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICBjb250ZXh0ID0gZGVlcEdldChjb250ZXh0LCBjb250ZXh0UGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRleHQgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgbWV0aG9kID0gY29udGV4dFtwYXRoXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZXRob2QgPT0gbnVsbCA/IG1ldGhvZCA6IG1ldGhvZC5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCB8fCB0eXBlb2YgaXRlcmF0ZWUgPT0gJ251bWJlcicgJiYgdHlwZW9mIG9ialswXSAhPSAnb2JqZWN0JyAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odiwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2LCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdjtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgfHwgdHlwZW9mIGl0ZXJhdGVlID09ICdudW1iZXInICYmIHR5cGVvZiBvYmpbMF0gIT0gJ29iamVjdCcgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHYsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodiwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2O1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbi5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uc2FtcGxlKG9iaiwgSW5maW5pdHkpO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHZhciBzYW1wbGUgPSBpc0FycmF5TGlrZShvYmopID8gXy5jbG9uZShvYmopIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKHNhbXBsZSk7XG4gICAgbiA9IE1hdGgubWF4KE1hdGgubWluKG4sIGxlbmd0aCksIDApO1xuICAgIHZhciBsYXN0ID0gbGVuZ3RoIC0gMTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbjsgaW5kZXgrKykge1xuICAgICAgdmFyIHJhbmQgPSBfLnJhbmRvbShpbmRleCwgbGFzdCk7XG4gICAgICB2YXIgdGVtcCA9IHNhbXBsZVtpbmRleF07XG4gICAgICBzYW1wbGVbaW5kZXhdID0gc2FtcGxlW3JhbmRdO1xuICAgICAgc2FtcGxlW3JhbmRdID0gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIHNhbXBsZS5zbGljZSgwLCBuKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCsrLFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0ZWUodmFsdWUsIGtleSwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yLCBwYXJ0aXRpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcnRpdGlvbiA/IFtbXSwgW11dIDoge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKGhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIHZhciByZVN0clN5bWJvbCA9IC9bXlxcdWQ4MDAtXFx1ZGZmZl18W1xcdWQ4MDAtXFx1ZGJmZl1bXFx1ZGMwMC1cXHVkZmZmXXxbXFx1ZDgwMC1cXHVkZmZmXS9nO1xuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoXy5pc1N0cmluZyhvYmopKSB7XG4gICAgICAvLyBLZWVwIHN1cnJvZ2F0ZSBwYWlyIGNoYXJhY3RlcnMgdG9nZXRoZXJcbiAgICAgIHJldHVybiBvYmoubWF0Y2gocmVTdHJTeW1ib2wpO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBwYXNzKSB7XG4gICAgcmVzdWx0W3Bhc3MgPyAwIDogMV0ucHVzaCh2YWx1ZSk7XG4gIH0sIHRydWUpO1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCB8fCBhcnJheS5sZW5ndGggPCAxKSByZXR1cm4gbiA9PSBudWxsID8gdm9pZCAwIDogW107XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwgfHwgYXJyYXkubGVuZ3RoIDwgMSkgcmV0dXJuIG4gPT0gbnVsbCA/IHZvaWQgMCA6IFtdO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gXy5yZXN0KGFycmF5LCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSBuKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgQm9vbGVhbik7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBzdHJpY3QsIG91dHB1dCkge1xuICAgIG91dHB1dCA9IG91dHB1dCB8fCBbXTtcbiAgICB2YXIgaWR4ID0gb3V0cHV0Lmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgIC8vIEZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0LlxuICAgICAgICBpZiAoc2hhbGxvdykge1xuICAgICAgICAgIHZhciBqID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgIHdoaWxlIChqIDwgbGVuKSBvdXRwdXRbaWR4KytdID0gdmFsdWVbaisrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QsIG91dHB1dCk7XG4gICAgICAgICAgaWR4ID0gb3V0cHV0Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghc3RyaWN0KSB7XG4gICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIGZhbHNlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihhcnJheSwgb3RoZXJBcnJheXMpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBvdGhlckFycmF5cyk7XG4gIH0pO1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gVGhlIGZhc3RlciBhbGdvcml0aG0gd2lsbCBub3Qgd29yayB3aXRoIGFuIGl0ZXJhdGVlIGlmIHRoZSBpdGVyYXRlZVxuICAvLyBpcyBub3QgYSBvbmUtdG8tb25lIGZ1bmN0aW9uLCBzbyBwcm92aWRpbmcgYW4gaXRlcmF0ZWUgd2lsbCBkaXNhYmxlXG4gIC8vIHRoZSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkICYmICFpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oYXJyYXlzKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFycmF5cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9KTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIHZhciBqO1xuICAgICAgZm9yIChqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGFycmF5LCByZXN0KSB7XG4gICAgcmVzdCA9IGZsYXR0ZW4ocmVzdCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlcy5cbiAgXy51bnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIF8ubWF4KGFycmF5LCBnZXRMZW5ndGgpLmxlbmd0aCB8fCAwO1xuICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IF8ucGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IHJlc3RBcmd1bWVudHMoXy51bnppcCk7XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLiBQYXNzaW5nIGJ5IHBhaXJzIGlzIHRoZSByZXZlcnNlIG9mIF8ucGFpcnMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgobGlzdCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGZpbmRJbmRleCBhbmQgZmluZExhc3RJbmRleCBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlciA9IGZ1bmN0aW9uKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICB2YXIgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3QuXG4gIF8uZmluZEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoMSk7XG4gIF8uZmluZExhc3RJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKC0xKTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBpbmRleE9mIGFuZCBsYXN0SW5kZXhPZiBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVJbmRleEZpbmRlciA9IGZ1bmN0aW9uKGRpciwgcHJlZGljYXRlRmluZCwgc29ydGVkSW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgICAgdmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgaWYgKHR5cGVvZiBpZHggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxlbmd0aCA9IGlkeCA+PSAwID8gTWF0aC5taW4oaWR4ICsgMSwgbGVuZ3RoKSA6IGlkeCArIGxlbmd0aCArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc29ydGVkSW5kZXggJiYgaWR4ICYmIGxlbmd0aCkge1xuICAgICAgICBpZHggPSBzb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgICBpZHggPSBwcmVkaWNhdGVGaW5kKHNsaWNlLmNhbGwoYXJyYXksIGksIGxlbmd0aCksIF8uaXNOYU4pO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoMSwgXy5maW5kSW5kZXgsIF8uc29ydGVkSW5kZXgpO1xuICBfLmxhc3RJbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEsIF8uZmluZExhc3RJbmRleCk7XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgaWYgKCFzdGVwKSB7XG4gICAgICBzdGVwID0gc3RvcCA8IHN0YXJ0ID8gLTEgOiAxO1xuICAgIH1cblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gQ2h1bmsgYSBzaW5nbGUgYXJyYXkgaW50byBtdWx0aXBsZSBhcnJheXMsIGVhY2ggY29udGFpbmluZyBgY291bnRgIG9yIGZld2VyXG4gIC8vIGl0ZW1zLlxuICBfLmNodW5rID0gZnVuY3Rpb24oYXJyYXksIGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPCAxKSByZXR1cm4gW107XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgICByZXN1bHQucHVzaChzbGljZS5jYWxsKGFycmF5LCBpLCBpICs9IGNvdW50KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzLlxuICB2YXIgZXhlY3V0ZUJvdW5kID0gZnVuY3Rpb24oc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gcmVzdEFyZ3VtZW50cyhmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBib3VuZCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oY2FsbEFyZ3MpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KGNhbGxBcmdzKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9KTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciBieSBkZWZhdWx0LCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlXG4gIC8vIHByZS1maWxsZWQuIFNldCBgXy5wYXJ0aWFsLnBsYWNlaG9sZGVyYCBmb3IgYSBjdXN0b20gcGxhY2Vob2xkZXIgYXJndW1lbnQuXG4gIF8ucGFydGlhbCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oZnVuYywgYm91bmRBcmdzKSB7XG4gICAgdmFyIHBsYWNlaG9sZGVyID0gXy5wYXJ0aWFsLnBsYWNlaG9sZGVyO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMCwgbGVuZ3RoID0gYm91bmRBcmdzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gcGxhY2Vob2xkZXIgPyBhcmd1bWVudHNbcG9zaXRpb24rK10gOiBib3VuZEFyZ3NbaV07XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIHRoaXMsIHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9KTtcblxuICBfLnBhcnRpYWwucGxhY2Vob2xkZXIgPSBfO1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKG9iaiwga2V5cykge1xuICAgIGtleXMgPSBmbGF0dGVuKGtleXMsIGZhbHNlLCBmYWxzZSk7XG4gICAgdmFyIGluZGV4ID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKGluZGV4IDwgMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIG9ialtrZXldID0gXy5iaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGFyZ3MpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9KTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IF8ucGFydGlhbChfLmRlbGF5LCBfLCAxKTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG5cbiAgICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRocm90dGxlZDtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBpZiAoYXJncykgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgdmFyIGRlYm91bmNlZCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24oYXJncykge1xuICAgICAgaWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgdmFyIGNhbGxOb3cgPSAhdGltZW91dDtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBfLmRlbGF5KGxhdGVyLCB3YWl0LCB0aGlzLCBhcmdzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcblxuICAgIGRlYm91bmNlZC5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVib3VuY2VkO1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgXy5yZXN0QXJndW1lbnRzID0gcmVzdEFyZ3VtZW50cztcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIHZhciBjb2xsZWN0Tm9uRW51bVByb3BzID0gZnVuY3Rpb24ob2JqLCBrZXlzKSB7XG4gICAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcHJvdG8gPSBfLmlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoaGFzKG9iaiwgcHJvcCkgJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYC5cbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChoYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgXy5hbGxLZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBvYmplY3QuXG4gIC8vIEluIGNvbnRyYXN0IHRvIF8ubWFwIGl0IHJldHVybnMgYW4gb2JqZWN0LlxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IHt9O1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5c1tpbmRleF07XG4gICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgLy8gVGhlIG9wcG9zaXRlIG9mIF8ub2JqZWN0LlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYC5cbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVBc3NpZ25lciA9IGZ1bmN0aW9uKGtleXNGdW5jLCBkZWZhdWx0cykge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGRlZmF1bHRzKSBvYmogPSBPYmplY3Qob2JqKTtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghZGVmYXVsdHMgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cyk7XG5cbiAgLy8gQXNzaWducyBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3duIHByb3BlcnRpZXMgaW4gdGhlIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3QuXG4gIF8uZmluZEtleSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtrZXldLCBrZXksIG9iaikpIHJldHVybiBrZXk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEludGVybmFsIHBpY2sgaGVscGVyIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBgb2JqYCBoYXMga2V5IGBrZXlgLlxuICB2YXIga2V5SW5PYmogPSBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICByZXR1cm4ga2V5IGluIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSByZXN0QXJndW1lbnRzKGZ1bmN0aW9uKG9iaiwga2V5cykge1xuICAgIHZhciByZXN1bHQgPSB7fSwgaXRlcmF0ZWUgPSBrZXlzWzBdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaWYgKGtleXMubGVuZ3RoID4gMSkgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBrZXlzWzFdKTtcbiAgICAgIGtleXMgPSBfLmFsbEtleXMob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBrZXlJbk9iajtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGtleXMsIGZhbHNlLCBmYWxzZSk7XG4gICAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IHJlc3RBcmd1bWVudHMoZnVuY3Rpb24ob2JqLCBrZXlzKSB7XG4gICAgdmFyIGl0ZXJhdGVlID0ga2V5c1swXSwgY29udGV4dDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBfLm5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgICBpZiAoa2V5cy5sZW5ndGggPiAxKSBjb250ZXh0ID0ga2V5c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IF8ubWFwKGZsYXR0ZW4oa2V5cywgZmFsc2UsIGZhbHNlKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIV8uY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBfLnBpY2sob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gIH0pO1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMsIHRydWUpO1xuXG4gIC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbiAgLy8gSWYgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0aGVuIHRoZXkgd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAgLy8gY3JlYXRlZCBvYmplY3QuXG4gIF8uY3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlLCBwcm9wcykge1xuICAgIHZhciByZXN1bHQgPSBiYXNlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgaWYgKHByb3BzKSBfLmV4dGVuZE93bihyZXN1bHQsIHByb3BzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5pc01hdGNoID0gZnVuY3Rpb24ob2JqZWN0LCBhdHRycykge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKGF0dHJzKSwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSwgZGVlcEVxO1xuICBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgLy8gYG51bGxgIG9yIGB1bmRlZmluZWRgIG9ubHkgZXF1YWwgdG8gaXRzZWxmIChzdHJpY3QgY29tcGFyaXNvbikuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgIGlmIChhICE9PSBhKSByZXR1cm4gYiAhPT0gYjtcbiAgICAvLyBFeGhhdXN0IHByaW1pdGl2ZSBjaGVja3NcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBhO1xuICAgIGlmICh0eXBlICE9PSAnZnVuY3Rpb24nICYmIHR5cGUgIT09ICdvYmplY3QnICYmIHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGRlZXBFcShhLCBiLCBhU3RhY2ssIGJTdGFjayk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgZGVlcEVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOLlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3ltYm9sXSc6XG4gICAgICAgIHJldHVybiBTeW1ib2xQcm90by52YWx1ZU9mLmNhbGwoYSkgPT09IFN5bWJvbFByb3RvLnZhbHVlT2YuY2FsbChiKTtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuXG4gICAgLy8gSW5pdGlhbGl6aW5nIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIC8vIEl0J3MgZG9uZSBoZXJlIHNpbmNlIHdlIG9ubHkgbmVlZCB0aGVtIGZvciBvYmplY3RzIGFuZCBhcnJheXMgY29tcGFyaXNvbi5cbiAgICBhU3RhY2sgPSBhU3RhY2sgfHwgW107XG4gICAgYlN0YWNrID0gYlN0YWNrIHx8IFtdO1xuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYjtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG5cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoYXJlQXJyYXlzKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFlcShhW2xlbmd0aF0sIGJbbGVuZ3RoXSwgYVN0YWNrLCBiU3RhY2spKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgdmFyIGtleXMgPSBfLmtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMgYmVmb3JlIGNvbXBhcmluZyBkZWVwIGVxdWFsaXR5LlxuICAgICAgaWYgKF8ua2V5cyhiKS5sZW5ndGggIT09IGxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICBrZXkgPSBrZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKGhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLCBpc01hcCwgaXNXZWFrTWFwLCBpc1NldCwgaXNXZWFrU2V0LlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvcicsICdTeW1ib2wnLCAnTWFwJywgJ1dlYWtNYXAnLCAnU2V0JywgJ1dlYWtTZXQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIGhhcyhvYmosICdjYWxsZWUnKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIHR5cGVvZiBidWdzIGluIG9sZCB2OCxcbiAgLy8gSUUgMTEgKCMxNjIxKSwgU2FmYXJpIDggKCMxOTI5KSwgYW5kIFBoYW50b21KUyAoIzIyMzYpLlxuICB2YXIgbm9kZWxpc3QgPSByb290LmRvY3VtZW50ICYmIHJvb3QuZG9jdW1lbnQuY2hpbGROb2RlcztcbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnICYmIHR5cGVvZiBub2RlbGlzdCAhPSAnZnVuY3Rpb24nKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gIV8uaXNTeW1ib2wob2JqKSAmJiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD9cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgaXNOYU4ob2JqKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xuICAgIGlmICghXy5pc0FycmF5KHBhdGgpKSB7XG4gICAgICByZXR1cm4gaGFzKG9iaiwgcGF0aCk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gcGF0aFtpXTtcbiAgICAgIGlmIChvYmogPT0gbnVsbCB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiAhIWxlbmd0aDtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9ucy4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5ub29wID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIHBhc3NlZCBhbiBvYmplY3QsIHdpbGwgdHJhdmVyc2UgdGhhdCBvYmplY3TigJlzXG4gIC8vIHByb3BlcnRpZXMgZG93biB0aGUgZ2l2ZW4gYHBhdGhgLCBzcGVjaWZpZWQgYXMgYW4gYXJyYXkgb2Yga2V5cyBvciBpbmRleGVzLlxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIGlmICghXy5pc0FycmF5KHBhdGgpKSB7XG4gICAgICByZXR1cm4gc2hhbGxvd1Byb3BlcnR5KHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gZGVlcEdldChvYmosIHBhdGgpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuICBfLnByb3BlcnR5T2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe307XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gIV8uaXNBcnJheShwYXRoKSA/IG9ialtwYXRoXSA6IGRlZXBHZXQob2JqLCBwYXRoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZXNjYXBlTWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjeDI3OycsXG4gICAgJ2AnOiAnJiN4NjA7J1xuICB9O1xuICB2YXIgdW5lc2NhcGVNYXAgPSBfLmludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIGNyZWF0ZUVzY2FwZXIgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgZXNjYXBlciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgICB9O1xuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZC5cbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBUcmF2ZXJzZXMgdGhlIGNoaWxkcmVuIG9mIGBvYmpgIGFsb25nIGBwYXRoYC4gSWYgYSBjaGlsZCBpcyBhIGZ1bmN0aW9uLCBpdFxuICAvLyBpcyBpbnZva2VkIHdpdGggaXRzIHBhcmVudCBhcyBjb250ZXh0LiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZmluYWxcbiAgLy8gY2hpbGQsIG9yIGBmYWxsYmFja2AgaWYgYW55IGNoaWxkIGlzIHVuZGVmaW5lZC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmosIHBhdGgsIGZhbGxiYWNrKSB7XG4gICAgaWYgKCFfLmlzQXJyYXkocGF0aCkpIHBhdGggPSBbcGF0aF07XG4gICAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKGZhbGxiYWNrKSA/IGZhbGxiYWNrLmNhbGwob2JqKSA6IGZhbGxiYWNrO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcHJvcCA9IG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW3BhdGhbaV1dO1xuICAgICAgaWYgKHByb3AgPT09IHZvaWQgMCkge1xuICAgICAgICBwcm9wID0gZmFsbGJhY2s7XG4gICAgICAgIGkgPSBsZW5ndGg7IC8vIEVuc3VyZSB3ZSBkb24ndCBjb250aW51ZSBpdGVyYXRpbmcuXG4gICAgICB9XG4gICAgICBvYmogPSBfLmlzRnVuY3Rpb24ocHJvcCkgPyBwcm9wLmNhbGwob2JqKSA6IHByb3A7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZTogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZTogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiBcIidcIixcbiAgICAnXFxcXCc6ICdcXFxcJyxcbiAgICAnXFxyJzogJ3InLFxuICAgICdcXG4nOiAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVSZWdFeHAgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgdmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfTtcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAvLyBOQjogYG9sZFNldHRpbmdzYCBvbmx5IGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVSZWdFeHAsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZnNldC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB2YXIgcmVuZGVyO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaic7XG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIGNoYWluUmVzdWx0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIG9iaikge1xuICAgIHJldHVybiBpbnN0YW5jZS5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGNoYWluUmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gXztcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIGNoYWluUmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNoYWluUmVzdWx0KHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBQcm92aWRlIHVud3JhcHBpbmcgcHJveHkgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcblxuICBfLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy5fd3JhcHBlZCk7XG4gIH07XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0oKSk7XG4iXSwic291cmNlUm9vdCI6ImQ6XFxHSUFOVFxcd3cyXFxpbmV0dGliZWFjb25cXFJlc291cmNlc1xcYW5kcm9pZFxcYWxsb3kifQ==
