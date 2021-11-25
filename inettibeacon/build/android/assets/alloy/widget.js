var Alloy=require("/alloy"),





widgets={};

function ucfirst(text){return(
text?
text[0].toUpperCase()+text.substr(1):text);
}

module.exports=function(widgetId){
var self=this;return(


widgets[widgetId]?
widgets[widgetId]:void(



this.widgetId=widgetId,
this.Collections={},
this.Models={},
this.Shared={},


this.createController=function(name,args){
return new(require("/alloy/widgets/"+widgetId+"/controllers/"+name))(args);
},
this.createCollection=function(name,args){
return new(require("/alloy/widgets/"+widgetId+"/models/"+ucfirst(name)).Collection)(args);
},
this.createModel=function(name,args){
return new(require("/alloy/widgets/"+widgetId+"/models/"+ucfirst(name)).Model)(args);
},
this.createWidget=Alloy.createWidget,
this.Collections.instance=function(name){
return self.Collections[name]||(self.Collections[name]=self.createCollection(name));
},
this.Models.instance=function(name){
return self.Models[name]||(self.Models[name]=self.createModel(name));
},


widgets[widgetId]=this));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpZGdldC5qcyJdLCJuYW1lcyI6WyJBbGxveSIsInJlcXVpcmUiLCJ3aWRnZXRzIiwidWNmaXJzdCIsInRleHQiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsIm1vZHVsZSIsImV4cG9ydHMiLCJ3aWRnZXRJZCIsInNlbGYiLCJDb2xsZWN0aW9ucyIsIk1vZGVscyIsIlNoYXJlZCIsImNyZWF0ZUNvbnRyb2xsZXIiLCJuYW1lIiwiYXJncyIsImNyZWF0ZUNvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwiY3JlYXRlTW9kZWwiLCJNb2RlbCIsImNyZWF0ZVdpZGdldCIsImluc3RhbmNlIl0sIm1hcHBpbmdzIjoiR0FBSUEsQ0FBQUEsS0FBSyxDQUFHQyxPQUFPLENBQUMsUUFBRCxDOzs7Ozs7QUFNZkMsT0FBTyxDQUFHLEU7O0FBRWQsUUFBU0MsQ0FBQUEsT0FBVCxDQUFpQkMsSUFBakIsQ0FBdUI7QUFDakJBLElBRGlCO0FBRWZBLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUUMsV0FBUixHQUF3QkQsSUFBSSxDQUFDRSxNQUFMLENBQVksQ0FBWixDQUZULENBQ0ZGLElBREU7QUFHdEI7O0FBRURHLE1BQU0sQ0FBQ0MsT0FBUCxDQUFpQixTQUFTQyxRQUFULENBQW1CO0FBQ25DLEdBQUlDLENBQUFBLElBQUksQ0FBRyxJQUFYLENBRG1DOzs7QUFJL0JSLE9BQU8sQ0FBQ08sUUFBRCxDQUp3QjtBQUszQlAsT0FBTyxDQUFDTyxRQUFELENBTG9COzs7O0FBU25DLEtBQUtBLFFBQUwsQ0FBZ0JBLFFBVG1CO0FBVW5DLEtBQUtFLFdBQUwsQ0FBbUIsRUFWZ0I7QUFXbkMsS0FBS0MsTUFBTCxDQUFjLEVBWHFCO0FBWW5DLEtBQUtDLE1BQUwsQ0FBYyxFQVpxQjs7O0FBZW5DLEtBQUtDLGdCQUFMLENBQXdCLFNBQVNDLElBQVQsQ0FBZUMsSUFBZixDQUFxQjtBQUM1QyxNQUFPLEtBQUtmLE9BQU8sQ0FBQyxrQkFBb0JRLFFBQXBCLENBQStCLGVBQS9CLENBQWlETSxJQUFsRCxDQUFaLEVBQXFFQyxJQUFyRSxDQUFQO0FBQ0EsQ0FqQmtDO0FBa0JuQyxLQUFLQyxnQkFBTCxDQUF3QixTQUFTRixJQUFULENBQWVDLElBQWYsQ0FBcUI7QUFDNUMsTUFBTyxLQUFLZixPQUFPLENBQUMsa0JBQW9CUSxRQUFwQixDQUErQixVQUEvQixDQUE0Q04sT0FBTyxDQUFDWSxJQUFELENBQXBELENBQVAsQ0FBbUVHLFVBQXhFLEVBQW9GRixJQUFwRixDQUFQO0FBQ0EsQ0FwQmtDO0FBcUJuQyxLQUFLRyxXQUFMLENBQW1CLFNBQVNKLElBQVQsQ0FBZUMsSUFBZixDQUFxQjtBQUN2QyxNQUFPLEtBQUtmLE9BQU8sQ0FBQyxrQkFBb0JRLFFBQXBCLENBQStCLFVBQS9CLENBQTRDTixPQUFPLENBQUNZLElBQUQsQ0FBcEQsQ0FBUCxDQUFtRUssS0FBeEUsRUFBK0VKLElBQS9FLENBQVA7QUFDQSxDQXZCa0M7QUF3Qm5DLEtBQUtLLFlBQUwsQ0FBb0JyQixLQUFLLENBQUNxQixZQXhCUztBQXlCbkMsS0FBS1YsV0FBTCxDQUFpQlcsUUFBakIsQ0FBNEIsU0FBU1AsSUFBVCxDQUFlO0FBQzFDLE1BQU9MLENBQUFBLElBQUksQ0FBQ0MsV0FBTCxDQUFpQkksSUFBakIsSUFBMkJMLElBQUksQ0FBQ0MsV0FBTCxDQUFpQkksSUFBakIsRUFBeUJMLElBQUksQ0FBQ08sZ0JBQUwsQ0FBc0JGLElBQXRCLENBQXBELENBQVA7QUFDQSxDQTNCa0M7QUE0Qm5DLEtBQUtILE1BQUwsQ0FBWVUsUUFBWixDQUF1QixTQUFTUCxJQUFULENBQWU7QUFDckMsTUFBT0wsQ0FBQUEsSUFBSSxDQUFDRSxNQUFMLENBQVlHLElBQVosSUFBc0JMLElBQUksQ0FBQ0UsTUFBTCxDQUFZRyxJQUFaLEVBQW9CTCxJQUFJLENBQUNTLFdBQUwsQ0FBaUJKLElBQWpCLENBQTFDLENBQVA7QUFDQSxDQTlCa0M7OztBQWlDbkNiLE9BQU8sQ0FBQ08sUUFBRCxDQUFQLENBQW9CLElBakNlO0FBa0NuQyxDIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEFsbG95ID0gcmVxdWlyZSgnL2FsbG95Jyk7XG5cbi8vIEhvbGQgYSBjb2xsZWN0aW9uIG9mIHdpZGdldCBvYmplY3RzIGluc3RhbmNlcy4gVGhlc2Vcbi8vIG9iamVjdHMgYXJlIG5vdCB0aGUgd2lkZ2V0cyB0aGVtc2VsdmVzLCBidXQgYSBzZXQgb2Zcbi8vIGF1dG8tcG9wdWxhdGVkIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyB0aGF0IG1ha2Vcbi8vIGRldmVsb3Bpbmcgd2lkZ2V0cyBlYXNpZXIuXG52YXIgd2lkZ2V0cyA9IHt9O1xuXG5mdW5jdGlvbiB1Y2ZpcnN0KHRleHQpIHtcblx0aWYgKCF0ZXh0KSB7IHJldHVybiB0ZXh0OyB9XG5cdHJldHVybiB0ZXh0WzBdLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnN1YnN0cigxKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3aWRnZXRJZCkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0Ly8gcmV0dXJuIGV4aXN0aW5nIHdpZGdldCBvYmplY3QsIGlmIHByZXNlbnRcblx0aWYgKHdpZGdldHNbd2lkZ2V0SWRdKSB7XG5cdFx0cmV0dXJuIHdpZGdldHNbd2lkZ2V0SWRdO1xuXHR9XG5cblx0Ly8gcHJvcGVydGllc1xuXHR0aGlzLndpZGdldElkID0gd2lkZ2V0SWQ7XG5cdHRoaXMuQ29sbGVjdGlvbnMgPSB7fTtcblx0dGhpcy5Nb2RlbHMgPSB7fTtcblx0dGhpcy5TaGFyZWQgPSB7fTtcblxuXHQvLyBmdW5jdGlvbnNcblx0dGhpcy5jcmVhdGVDb250cm9sbGVyID0gZnVuY3Rpb24obmFtZSwgYXJncykge1xuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy9hbGxveS93aWRnZXRzLycgKyB3aWRnZXRJZCArICcvY29udHJvbGxlcnMvJyArIG5hbWUpKShhcmdzKTtcblx0fTtcblx0dGhpcy5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24obmFtZSwgYXJncykge1xuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy9hbGxveS93aWRnZXRzLycgKyB3aWRnZXRJZCArICcvbW9kZWxzLycgKyB1Y2ZpcnN0KG5hbWUpKS5Db2xsZWN0aW9uKShhcmdzKTtcblx0fTtcblx0dGhpcy5jcmVhdGVNb2RlbCA9IGZ1bmN0aW9uKG5hbWUsIGFyZ3MpIHtcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcvYWxsb3kvd2lkZ2V0cy8nICsgd2lkZ2V0SWQgKyAnL21vZGVscy8nICsgdWNmaXJzdChuYW1lKSkuTW9kZWwpKGFyZ3MpO1xuXHR9O1xuXHR0aGlzLmNyZWF0ZVdpZGdldCA9IEFsbG95LmNyZWF0ZVdpZGdldDsgLy8ganVzdCB0byBiZSBjb21wbGV0ZVxuXHR0aGlzLkNvbGxlY3Rpb25zLmluc3RhbmNlID0gZnVuY3Rpb24obmFtZSkge1xuXHRcdHJldHVybiBzZWxmLkNvbGxlY3Rpb25zW25hbWVdIHx8IChzZWxmLkNvbGxlY3Rpb25zW25hbWVdID0gc2VsZi5jcmVhdGVDb2xsZWN0aW9uKG5hbWUpKTtcblx0fTtcblx0dGhpcy5Nb2RlbHMuaW5zdGFuY2UgPSBmdW5jdGlvbihuYW1lKSB7XG5cdFx0cmV0dXJuIHNlbGYuTW9kZWxzW25hbWVdIHx8IChzZWxmLk1vZGVsc1tuYW1lXSA9IHNlbGYuY3JlYXRlTW9kZWwobmFtZSkpO1xuXHR9O1xuXG5cdC8vIGFkZCB0byB3aWRnZXQgb2JqZWN0IGluc3RhbmNlc1xuXHR3aWRnZXRzW3dpZGdldElkXSA9IHRoaXM7XG59OyJdLCJzb3VyY2VSb290IjoiZDpcXEdJQU5UXFx3dzJcXGluZXR0aWJlYWNvblxcUmVzb3VyY2VzXFxhbmRyb2lkXFxhbGxveSJ9