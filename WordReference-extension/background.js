'use strict';
var wr = require('wordreference-api');

chrome.runtime.onMessage.addListener(checkTranslation);
  
checkTranslation = (msg) => {
  if (msg.method == "getTranslation") {
    var dictArr = msg.dictionary.split("-");
    var searchOutput = wr(msg.searchInput, dictArr[0], dictArr[1]);
    //error handling of search results
    chrome.runtime.sendMessage({ method: "searchResultsFound", results: searchOutput});
  }
}