(function(){
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath',"https://pure-fjord-49819.herokuapp.com")
.directive('searchItem', searchItemDirective);

function searchItemDirective(){
var ddo ={
  templateUrl: 'SearchResults.html',
  scope :{
    menu : '=myList',
    foundArray :'<',
    onRemove: '&'
  }

};
return ddo;

}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var menu = this;
  var message ="";
  var foundArray =[];
  
 
menu.getMatchedItems= function(searchTerm){
    console.log(foundArray);
    var promise = MenuSearchService.getMatchedSearchItems(searchTerm);
    promise.then(function(response){
      menu.foundArray =response;
      console.log("response.data :",response[0].description);
      console.log("found array :",menu.foundArray);
    })
    .catch(function(error){
      menu.message= "No items match your search";
        console.log("Something went wrong !!");

    });

    menu.getItems = function(){
      console.log("array length :",menu.foundArray[0].name);
      console.log("foundArray in controller:",menu.foundArray);
    }

    menu.removeItem = function(itemIndex){
      console.log("in remove method with index:",itemIndex);
     
      menu.foundArray.splice(itemIndex,1);
      console.log("foundArray after removing:",menu.foundArray);
    }

    
   
     
 
};

 

 

}
//end of NarrowItDownController

MenuSearchService.$inject = ['$http','ApiBasePath'];
function MenuSearchService($http,ApiBasePath){

var service = this;


 
service.getMatchedSearchItems = function(searchTerm){
  
  
  return $http({
      method :"GET",
      url :(ApiBasePath+"/menu_items.json")
  })
  .then(function success(result){
        var foundItems = [];
        var menuArray = result.data.menu_items;
        // console.log("in service :", menuArray ,"searchTerm :",searchTerm , "menuArray length :",menuArray.length);
        for( var i=0 ; i< menuArray.length ; i++){
            var temp = menuArray[i].description;
            if(temp.indexOf(searchTerm) > 0 ){
               
                 foundItems.push(menuArray[i]);
         
            }
      
        }
        console.log("found item :",foundItems);
        return foundItems;
        
  }); 
 
}


}
//end of MenuSearchService


})();