'use strict';

var searchInput;
var selectedDict;

// Search for translation in WordReference when the 'translateButton' button is clicked
$('#translateButton').on('click', function() {
  $('#searchedWord').text(searchInput);

  // if($('#searchInput').val()){
  //   searchInput = $('#searchInput').val();
  //   selectedDict = $('#dictionaries').find(":selected").val();

  //   //send msg to chrome to get wordref translation
  //   chrome.runtime.sendMessage({ method: "getTranslation", search: searchInput, dictionary: selectedDict});
    
  //   //listen for message to get word ref search results
  //   chrome.runtime.onMessage.addListener(searchResults);
  // } else {
  //   //send msg to chrome to handle bad input
  //   chrome.runtime.sendMessage({ method: "badInput" });
  // }
  
});

var tlInfo; //variable to hold translation information

// Get search results info from bg and update accordingly
searchResults = (msg) =>{
  if (msg.method == "searchResultsFound") {
    tlInfo = msg.results;
    var tlArr = tlInfo.translations[0].translations;
  
    $('#fromTranslation').querySelector('.fromWord').text(tlArr[0].from);
    $('#fromTranslation').querySelector('.info').text(tlArr[0].fromType);
    $('#toTranslation').querySelector('.toWord').text(tlArr[0].to);
    $('#toTranslation').querySelector('.info').text(tlArr[0].toType);
  }
}