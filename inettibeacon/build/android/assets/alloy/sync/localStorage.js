


var _=require("/alloy/underscore")._;

function S4(){
return(0|65536*(1+Math.random())).toString(16).substring(1);
}

function guid(){
return S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();
}

function InitAdapter(){
if(!0)
throw"localStorage persistence supported only with MobileWeb.";

}

function Sync(method,model,opts){




function storeModel(data){
localStorage.setItem(name,JSON.stringify(data));
}var name=model.config.adapter.collection_name,data=model.config.data,resp=null;

switch(method){

case"create":
model.id||(
model.id=guid(),
model.set(model.idAttribute,model.id)),

data[model.id]=model,
storeModel(data),
resp=model.toJSON();
break;

case"read":var
store=localStorage.getItem(name),
store_data=store&&JSON.parse(store)||{},

len=0;
for(var key in store_data){
var m=new model.config.Model(store_data[key]);
model.models.push(m),
len++;
}

model.length=len,

resp=1===len?model.models[0]:

model.models;

break;

case"update":
data[model.id]=model,
storeModel(data),
resp=model.toJSON();
break;

case"delete":
delete data[model.id],
storeModel(data),
resp=model.toJSON();}




resp?(
_.isFunction(opts.success)&&opts.success(resp),
"read"===method&&model.trigger("fetch")):

_.isFunction(opts.error)&&opts.error(resp);

}

module.exports.sync=Sync,

module.exports.beforeModelCreate=function(config){






return config=config||{},config.data={},InitAdapter(),config;
},

module.exports.afterModelCreate=function(Model){




return Model=Model||{},Model.prototype.config.Model=Model,Model;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6WyJfIiwicmVxdWlyZSIsIlM0IiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwic3Vic3RyaW5nIiwiZ3VpZCIsIkluaXRBZGFwdGVyIiwiU3luYyIsIm1ldGhvZCIsIm1vZGVsIiwib3B0cyIsInN0b3JlTW9kZWwiLCJkYXRhIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIm5hbWUiLCJKU09OIiwic3RyaW5naWZ5IiwiY29uZmlnIiwiYWRhcHRlciIsImNvbGxlY3Rpb25fbmFtZSIsInJlc3AiLCJpZCIsInNldCIsImlkQXR0cmlidXRlIiwidG9KU09OIiwic3RvcmUiLCJnZXRJdGVtIiwic3RvcmVfZGF0YSIsInBhcnNlIiwibGVuIiwia2V5IiwibSIsIk1vZGVsIiwibW9kZWxzIiwicHVzaCIsImxlbmd0aCIsImlzRnVuY3Rpb24iLCJzdWNjZXNzIiwidHJpZ2dlciIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsInN5bmMiLCJiZWZvcmVNb2RlbENyZWF0ZSIsImFmdGVyTW9kZWxDcmVhdGUiLCJwcm90b3R5cGUiXSwibWFwcGluZ3MiOiI7OztBQUdBLEdBQUlBLENBQUFBLENBQUMsQ0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELENBQXJDOztBQUVBLFFBQVNFLENBQUFBLEVBQVQsRUFBYztBQUNaLE1BQU8sQ0FBaUMsQ0FBaEMsQ0FBc0IsS0FBdEIsRUFBQyxFQUFJQyxJQUFJLENBQUNDLE1BQUwsRUFBTCxDQUFELEVBQW9DQyxRQUFwQyxDQUE2QyxFQUE3QyxFQUFpREMsU0FBakQsQ0FBMkQsQ0FBM0QsQ0FBUDtBQUNEOztBQUVELFFBQVNDLENBQUFBLElBQVQsRUFBZ0I7QUFDZCxNQUFPTCxDQUFBQSxFQUFFLEdBQUtBLEVBQUUsRUFBVCxDQUFjLEdBQWQsQ0FBb0JBLEVBQUUsRUFBdEIsQ0FBMkIsR0FBM0IsQ0FBaUNBLEVBQUUsRUFBbkMsQ0FBd0MsR0FBeEMsQ0FBOENBLEVB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QUM4QixLQUFsQixDQTFEMkIsRUEwREE5QixJQUFJLENBQUM4QixLQUFMLENBQVduQixJQUFYLENBMURBOztBQTREbEM7O0FBRURvQixNQUFNLENBQUNDLE9BQVAsQ0FBZUMsSUFBZixDQUFzQnBDLEk7O0FBRXRCa0MsTUFBTSxDQUFDQyxPQUFQLENBQWVFLGlCQUFmLENBQW1DLFNBQVUxQixNQUFWLENBQWtCOzs7Ozs7O0FBT25ELE1BTkFBLENBQUFBLE1BQU0sQ0FBR0EsTUFBTSxFQUFJLEVBTW5CLENBSkFBLE1BQU0sQ0FBQ04sSUFBUCxDQUFjLEVBSWQsQ0FGQU4sV0FBVyxFQUVYLENBQU9ZLE1BQVA7QUFDRCxDOztBQUVEdUIsTUFBTSxDQUFDQyxPQUFQLENBQWVHLGdCQUFmLENBQWtDLFNBQVVaLEtBQVYsQ0FBaUI7Ozs7O0FBS2pELE1BSkFBLENBQUFBLEtBQUssQ0FBR0EsS0FBSyxFQUFJLEVBSWpCLENBRkFBLEtBQUssQ0FBQ2EsU0FBTixDQUFnQjVCLE1BQWhCLENBQXVCZSxLQUF2QixDQUErQkEsS0FFL0IsQ0FBT0EsS0FBUDtBQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogSFRNTDUgbG9jYWxTdG9yYWdlIHN5bmMgYWRhcHRlclxuICovXG52YXIgXyA9IHJlcXVpcmUoJy9hbGxveS91bmRlcnNjb3JlJykuXztcblxuZnVuY3Rpb24gUzQoKSB7XG4gIHJldHVybiAoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDAgfCAwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xufVxuXG5mdW5jdGlvbiBndWlkKCkge1xuICByZXR1cm4gUzQoKSArIFM0KCkgKyAnLScgKyBTNCgpICsgJy0nICsgUzQoKSArICctJyArIFM0KCkgKyAnLScgKyBTNCgpICsgUzQoKSArIFM0KCk7XG59XG5cbmZ1bmN0aW9uIEluaXRBZGFwdGVyKCkge1xuICBpZiAoIWZhbHNlKSB7XG4gICAgdGhyb3cgJ2xvY2FsU3RvcmFnZSBwZXJzaXN0ZW5jZSBzdXBwb3J0ZWQgb25seSB3aXRoIE1vYmlsZVdlYi4nO1xuICB9XG59XG5cbmZ1bmN0aW9uIFN5bmMobWV0aG9kLCBtb2RlbCwgb3B0cykge1xuICB2YXIgbmFtZSA9IG1vZGVsLmNvbmZpZy5hZGFwdGVyLmNvbGxlY3Rpb25fbmFtZSxcbiAgZGF0YSA9IG1vZGVsLmNvbmZpZy5kYXRhLFxuICByZXNwID0gbnVsbDtcblxuICBmdW5jdGlvbiBzdG9yZU1vZGVsKGRhdGEpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShuYW1lLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cblxuICBzd2l0Y2ggKG1ldGhvZCkge1xuXG4gICAgY2FzZSAnY3JlYXRlJzpcbiAgICAgIGlmICghbW9kZWwuaWQpIHtcbiAgICAgICAgbW9kZWwuaWQgPSBndWlkKCk7XG4gICAgICAgIG1vZGVsLnNldChtb2RlbC5pZEF0dHJpYnV0ZSwgbW9kZWwuaWQpO1xuICAgICAgfVxuICAgICAgZGF0YVttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgIHN0b3JlTW9kZWwoZGF0YSk7XG4gICAgICByZXNwID0gbW9kZWwudG9KU09OKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgdmFyIHN0b3JlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obmFtZSk7XG4gICAgICB2YXIgc3RvcmVfZGF0YSA9IHN0b3JlICYmIEpTT04ucGFyc2Uoc3RvcmUpIHx8IHt9O1xuXG4gICAgICB2YXIgbGVuID0gMDtcbiAgICAgIGZvciAodmFyIGtleSBpbiBzdG9yZV9kYXRhKSB7XG4gICAgICAgIHZhciBtID0gbmV3IG1vZGVsLmNvbmZpZy5Nb2RlbChzdG9yZV9kYXRhW2tleV0pO1xuICAgICAgICBtb2RlbC5tb2RlbHMucHVzaChtKTtcbiAgICAgICAgbGVuKys7XG4gICAgICB9XG5cbiAgICAgIG1vZGVsLmxlbmd0aCA9IGxlbjtcbiAgICAgIGlmIChsZW4gPT09IDEpIHtcbiAgICAgICAgcmVzcCA9IG1vZGVsLm1vZGVsc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3AgPSBtb2RlbC5tb2RlbHM7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3VwZGF0ZSc6XG4gICAgICBkYXRhW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgICAgc3RvcmVNb2RlbChkYXRhKTtcbiAgICAgIHJlc3AgPSBtb2RlbC50b0pTT04oKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgIGRlbGV0ZSBkYXRhW21vZGVsLmlkXTtcbiAgICAgIHN0b3JlTW9kZWwoZGF0YSk7XG4gICAgICByZXNwID0gbW9kZWwudG9KU09OKCk7XG4gICAgICBicmVhazt9XG5cblxuICAvLyBwcm9jZXNzIHN1Y2Nlc3MvZXJyb3IgaGFuZGxlcnMsIGlmIHByZXNlbnRcbiAgaWYgKHJlc3ApIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9wdHMuc3VjY2VzcykpIHtvcHRzLnN1Y2Nlc3MocmVzcCk7fVxuICAgIGlmIChtZXRob2QgPT09ICdyZWFkJykge21vZGVsLnRyaWdnZXIoJ2ZldGNoJyk7fVxuICB9IGVsc2Uge1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob3B0cy5lcnJvcikpIHtvcHRzLmVycm9yKHJlc3ApO31cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zeW5jID0gU3luYztcblxubW9kdWxlLmV4cG9ydHMuYmVmb3JlTW9kZWxDcmVhdGUgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICBjb25maWcuZGF0YSA9IHt9OyAvLyBmb3IgbG9jYWxTdG9yYWdlIG9yIGNhc2Ugd2hlcmUgZW50aXJlIGNvbGxlY3Rpb24gaXMgbmVlZGVkIHRvIG1haW50YWluIHN0b3JlXG5cbiAgSW5pdEFkYXB0ZXIoKTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcblxubW9kdWxlLmV4cG9ydHMuYWZ0ZXJNb2RlbENyZWF0ZSA9IGZ1bmN0aW9uIChNb2RlbCkge1xuICBNb2RlbCA9IE1vZGVsIHx8IHt9O1xuXG4gIE1vZGVsLnByb3RvdHlwZS5jb25maWcuTW9kZWwgPSBNb2RlbDsgLy8gbmVlZGVkIGZvciBmZXRjaCBvcGVyYXRpb25zIHRvIGluaXRpYWxpemUgdGhlIGNvbGxlY3Rpb24gZnJvbSBwZXJzaXN0ZW50IHN0b3JlXG5cbiAgcmV0dXJuIE1vZGVsO1xufTsiXSwic291cmNlUm9vdCI6ImQ6XFxHSUFOVFxcd3cyXFxpbmV0dGliZWFjb25cXFJlc291cmNlc1xcYW5kcm9pZFxcYWxsb3lcXHN5bmMifQ==