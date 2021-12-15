var Alloy=require("/alloy"),
_=require("/alloy/underscore")._,
TAP=Ti.App.Properties;

function S4(){
return(0|65536*(1+Math.random())).toString(16).substring(1);
}

function guid(){
return S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();
}

function Sync(method,model,opts){var
prefix=model.config.adapter.collection_name?model.config.adapter.collection_name:"default",
regex=new RegExp("^("+prefix+")\\-(.+)$"),
resp=null;

if(!("read"===method))
















"create"===method||"update"===method?(
model.id||(
model.id=guid(),
model.set(model.idAttribute,model.id)),

TAP.setObject(prefix+"-"+model.id,model.toJSON()||{}),
resp=model.toJSON()):
"delete"===method&&(
TAP.removeProperty(prefix+"-"+model.id),
model.clear(),
resp=model.toJSON());else if(model instanceof Backbone.Collection){var list=[];_.each(TAP.listProperties(),function(prop){var match=prop.match(regex);null!==match&&list.push(TAP.getObject(prop))}),resp=list}else{var obj=TAP.getObject(prefix+"-"+model.id);model.set(obj),resp=model.toJSON()}



resp?(
_.isFunction(opts.success)&&opts.success(resp),
"read"===method&&model.trigger("fetch")):

_.isFunction(opts.error)&&opts.error(resp);

}

module.exports.sync=Sync,
module.exports.beforeModelCreate=function(config){










return config=config||{},config.columns=config.columns||{},config.defaults=config.defaults||{},("undefined"==typeof config.columns.id||null===config.columns.id)&&(config.columns.id="String"),config;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb3BlcnRpZXMuanMiXSwibmFtZXMiOlsiQWxsb3kiLCJyZXF1aXJlIiwiXyIsIlRBUCIsIlRpIiwiQXBwIiwiUHJvcGVydGllcyIsIlM0IiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwic3Vic3RyaW5nIiwiZ3VpZCIsIlN5bmMiLCJtZXRob2QiLCJtb2RlbCIsIm9wdHMiLCJwcmVmaXgiLCJjb25maWciLCJhZGFwdGVyIiwiY29sbGVjdGlvbl9uYW1lIiwicmVnZXgiLCJSZWdFeHAiLCJyZXNwIiwiaWQiLCJzZXQiLCJpZEF0dHJpYnV0ZSIsInNldE9iamVjdCIsInRvSlNPTiIsInJlbW92ZVByb3BlcnR5IiwiY2xlYXIiLCJCYWNrYm9uZSIsIkNvbGxlY3Rpb24iLCJsaXN0IiwiZWFjaCIsImxpc3RQcm9wZXJ0aWVzIiwicHJvcCIsIm1hdGNoIiwicHVzaCIsImdldE9iamVjdCIsIm9iaiIsImlzRnVuY3Rpb24iLCJzdWNjZXNzIiwidHJpZ2dlciIsImVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsInN5bmMiLCJiZWZvcmVNb2RlbENyZWF0ZSIsImNvbHVtbnMiLCJkZWZhdWx0cyJdLCJtYXBwaW5ncyI6IkFBQUEsR0FBSUEsQ0FBQUEsS0FBSyxDQUFHQyxPQUFPLENBQUMsUUFBRCxDQUFuQjtBQUNBQyxDQUFDLENBQUdELE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCQyxDQURqQztBQUVBQyxHQUFHLENBQUdDLEVBQUUsQ0FBQ0MsR0FBSCxDQUFPQyxVQUZiOztBQUlBLFFBQVNDLENBQUFBLEVBQVQsRUFBYztBQUNaLE1BQU8sQ0FBaUMsQ0FBaEMsQ0FBc0IsS0FBdEIsRUFBQyxFQUFJQyxJQUFJLENBQUNDLE1BQUwsRUFBTCxDQUFELEVBQW9DQyxRQUFwQyxDQUE2QyxFQUE3QyxFQUFpREMsU0FBakQsQ0FBMkQsQ0FBM0QsQ0FBUDtBQUNEOztBQUVELFFBQVNDLENBQUFBLElBQVQsRUFBZ0I7QUFDZCxNQUFPTCxDQUFBQSxFQUFFLEdBQUtB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QUFYLENBeENBOztBQTBDbEM7O0FBRURzQixNQUFNLENBQUNDLE9BQVAsQ0FBZUMsSUFBZixDQUFzQmxDLEk7QUFDdEJnQyxNQUFNLENBQUNDLE9BQVAsQ0FBZUUsaUJBQWYsQ0FBbUMsU0FBVTlCLE1BQVYsQ0FBa0I7Ozs7Ozs7Ozs7O0FBV25ELE1BVEFBLENBQUFBLE1BQU0sQ0FBR0EsTUFBTSxFQUFJLEVBU25CLENBUkFBLE1BQU0sQ0FBQytCLE9BQVAsQ0FBaUIvQixNQUFNLENBQUMrQixPQUFQLEVBQWtCLEVBUW5DLENBUEEvQixNQUFNLENBQUNnQyxRQUFQLENBQWtCaEMsTUFBTSxDQUFDZ0MsUUFBUCxFQUFtQixFQU9yQyxFQUppQyxXQUE3QixRQUFPaEMsQ0FBQUEsTUFBTSxDQUFDK0IsT0FBUCxDQUFlekIsRUFBdEIsRUFBa0UsSUFBdEIsR0FBQU4sTUFBTSxDQUFDK0IsT0FBUCxDQUFlekIsRUFJL0QsSUFIRU4sTUFBTSxDQUFDK0IsT0FBUCxDQUFlekIsRUFBZixDQUFvQixRQUd0QixFQUFPTixNQUFQO0FBQ0QsQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBBbGxveSA9IHJlcXVpcmUoJy9hbGxveScpLFxuXyA9IHJlcXVpcmUoJy9hbGxveS91bmRlcnNjb3JlJykuXyxcblRBUCA9IFRpLkFwcC5Qcm9wZXJ0aWVzO1xuXG5mdW5jdGlvbiBTNCgpIHtcbiAgcmV0dXJuICgoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMCB8IDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG59XG5cbmZ1bmN0aW9uIGd1aWQoKSB7XG4gIHJldHVybiBTNCgpICsgUzQoKSArICctJyArIFM0KCkgKyAnLScgKyBTNCgpICsgJy0nICsgUzQoKSArICctJyArIFM0KCkgKyBTNCgpICsgUzQoKTtcbn1cblxuZnVuY3Rpb24gU3luYyhtZXRob2QsIG1vZGVsLCBvcHRzKSB7XG4gIHZhciBwcmVmaXggPSBtb2RlbC5jb25maWcuYWRhcHRlci5jb2xsZWN0aW9uX25hbWUgPyBtb2RlbC5jb25maWcuYWRhcHRlci5jb2xsZWN0aW9uX25hbWUgOiAnZGVmYXVsdCc7XG4gIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIHByZWZpeCArICcpXFxcXC0oLispJCcpO1xuICB2YXIgcmVzcCA9IG51bGw7XG5cbiAgaWYgKG1ldGhvZCA9PT0gJ3JlYWQnKSB7XG4gICAgaWYgKG1vZGVsIGluc3RhbmNlb2YgQmFja2JvbmUuQ29sbGVjdGlvbikge1xuICAgICAgLy8gaXMgY29sbGVjdGlvblxuICAgICAgdmFyIGxpc3QgPSBbXTtcbiAgICAgIF8uZWFjaChUQVAubGlzdFByb3BlcnRpZXMoKSwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcHJvcC5tYXRjaChyZWdleCk7XG4gICAgICAgIGlmIChtYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgIGxpc3QucHVzaChUQVAuZ2V0T2JqZWN0KHByb3ApKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXNwID0gbGlzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaXMgbW9kZWxcbiAgICAgIHZhciBvYmogPSBUQVAuZ2V0T2JqZWN0KHByZWZpeCArICctJyArIG1vZGVsLmlkKTtcbiAgICAgIG1vZGVsLnNldChvYmopO1xuICAgICAgcmVzcCA9IG1vZGVsLnRvSlNPTigpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdjcmVhdGUnIHx8IG1ldGhvZCA9PT0gJ3VwZGF0ZScpIHtcbiAgICBpZiAoIW1vZGVsLmlkKSB7XG4gICAgICBtb2RlbC5pZCA9IGd1aWQoKTtcbiAgICAgIG1vZGVsLnNldChtb2RlbC5pZEF0dHJpYnV0ZSwgbW9kZWwuaWQpO1xuICAgIH1cbiAgICBUQVAuc2V0T2JqZWN0KHByZWZpeCArICctJyArIG1vZGVsLmlkLCBtb2RlbC50b0pTT04oKSB8fCB7fSk7XG4gICAgcmVzcCA9IG1vZGVsLnRvSlNPTigpO1xuICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ2RlbGV0ZScpIHtcbiAgICBUQVAucmVtb3ZlUHJvcGVydHkocHJlZml4ICsgJy0nICsgbW9kZWwuaWQpO1xuICAgIG1vZGVsLmNsZWFyKCk7XG4gICAgcmVzcCA9IG1vZGVsLnRvSlNPTigpO1xuICB9XG5cbiAgLy8gcHJvY2VzcyBzdWNjZXNzL2Vycm9yIGhhbmRsZXJzLCBpZiBwcmVzZW50XG4gIGlmIChyZXNwKSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvcHRzLnN1Y2Nlc3MpKSB7b3B0cy5zdWNjZXNzKHJlc3ApO31cbiAgICBpZiAobWV0aG9kID09PSAncmVhZCcpIHttb2RlbC50cmlnZ2VyKCdmZXRjaCcpO31cbiAgfSBlbHNlIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9wdHMuZXJyb3IpKSB7b3B0cy5lcnJvcihyZXNwKTt9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuc3luYyA9IFN5bmM7XG5tb2R1bGUuZXhwb3J0cy5iZWZvcmVNb2RlbENyZWF0ZSA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgLy8gbWFrZSBzdXJlIHdlIGhhdmUgYSBwb3B1bGF0ZWQgbW9kZWwgb2JqZWN0XG4gIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgY29uZmlnLmNvbHVtbnMgPSBjb25maWcuY29sdW1ucyB8fCB7fTtcbiAgY29uZmlnLmRlZmF1bHRzID0gY29uZmlnLmRlZmF1bHRzIHx8IHt9O1xuXG4gIC8vIGdpdmUgaXQgYSBkZWZhdWx0IGlkIGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxuICBpZiAodHlwZW9mIGNvbmZpZy5jb2x1bW5zLmlkID09PSAndW5kZWZpbmVkJyB8fCBjb25maWcuY29sdW1ucy5pZCA9PT0gbnVsbCkge1xuICAgIGNvbmZpZy5jb2x1bW5zLmlkID0gJ1N0cmluZyc7XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufTsiXSwic291cmNlUm9vdCI6ImQ6XFxHSUFOVFxcd3cyXFxiYy1kZWJ1Z1xcaW5ldHRpYmVhY29uXFxSZXNvdXJjZXNcXGFuZHJvaWRcXGFsbG95XFxzeW5jIn0=
