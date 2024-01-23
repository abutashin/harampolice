'use strict';
let rules = [];
// Define the URL of the text file
let url = "https://raw.githubusercontent.com/abutashin/harampolice/main/websites.txt";
let websites = []
// Use the fetch API to get the text file
fetch(url)
  .then(response => response.text()) // Convert the response to text
  .then(text => {
    // Parse the website list by splitting the text by line breaks
    let websitess = text.split("\r\n"); // Use \n instead of \r\n

    // Do something with the website list
    for (let i = 0; i < websitess.length-1; i++){
        websites.push(websitess[i]);
    }
    console.log(websites);

    // Generate an array of rule IDs to remove
    let removeRuleIds = [];
    for (let i = 1; i <= websites.length; i++) {
      removeRuleIds.push(i);
    }
    // Define the rule object
    websites.forEach((website, index) => {
      // Generate a unique ID for each rule
      let id = index + 1;
      // Define the rule object
      let rule = {
        "id": id,
        "priority": 1,
        "action": {
          "type": "redirect",
          "redirect": {
            "url": chrome.runtime.getURL("/block.html")
          }
        },
        "condition": {
          "urlFilter": website,
          "resourceTypes": ["main_frame"]
        }
      };
      // Add the rule to the array
      rules.push(rule);
    });


    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: removeRuleIds // To avoid duplicate IDs
    }, () => {
      // Check for errors
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log("Rule added/removed successfully");
      }
    });

    chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
      const msg = `Navigation to ${e.request.url} redirected on tab ${e.request.tabId}.`;
      console.log(msg);
    });

  })
  .catch(error => {
    // Handle any errors
    console.error(error);
  });

console.log('Service worker started.');