chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'addWordList',
    title: 'Add to word list',
    contexts: ['selection']
  });
  chrome.storage.local.get({ WordList: [] }, (result) => {
    if (result.WordList.length > 0) {
      updateBadge(result.WordList.length);
    }    
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get({ WordList: [] }, (result) => {
    if (result.WordList.length > 0) {
      updateBadge(result.WordList.length);
    }    
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'addWordList') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addToWordList
    });
  }
  chrome.storage.local.get({ WordList: [] }, (result) => {
    updateBadge(result.WordList.length + 1);
  });
});

function addToWordList() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.storage.local.get({ WordList: [] }, (result) => {
      const updatedList = [...result.WordList, selectedText];
      chrome.storage.local.set({ WordList: updatedList });
    });
  }
}
  
function updateBadge(count) {
  chrome.action.setBadgeText({ text: count.toString()});
  chrome.action.setBadgeTextColor({ color: [0, 255, 0, 255] });
  chrome.action.setBadgeBackgroundColor({ color: [75, 75, 75, 255] });
}