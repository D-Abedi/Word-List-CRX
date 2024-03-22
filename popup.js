
document.getElementById('ExportBtn').addEventListener('click', () => {
  chrome.storage.local.get({ WordList: [] }, (result) => {
    if (result.WordList.length > 0) {
      const blob = new Blob([result.WordList.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: 'Word List.txt',
        conflictAction: 'uniquify'
      }, () => {
        chrome.storage.local.set({ WordList: [] });
      });
    } else {
      alert('No words to export.');
    }
  });
  updateBadge(''); // Reset the badge count to 0
});

chrome.storage.local.get({ WordList: [] }, (result) => {
  var i = 0
  if (result.WordList.length > 0) {
    var tRow = document.createElement("tr");
    tRow.setAttribute("id","tRow"); 
    document.getElementById("myTable").appendChild(tRow);
    result.WordList.forEach((item) => {
      var tData = document.createElement("td");
      tData.setAttribute("id","tData"+ i);
      tData.textContent = item;
      document.getElementById("tRow").appendChild(tData);
      document.getElementById("tData" + i).addEventListener("click", rDel(i));
      i++ 
    });
  }   
});

function rDel(i) {
  document.getElementById("tData" + i).addEventListener('click', function() {
    this.remove();
    chrome.storage.local.get({ WordList: [] }, (result) => {
      result.WordList.splice(i, 1);
      chrome.storage.local.set({ WordList: result.WordList });
      if (result.WordList.length == 0) {
        updateBadge('');
      } else {
        updateBadge(result.WordList.length);
      };
    });
  });
}


document.querySelector('a').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default anchor behavior
    var url = this.href;
    chrome.tabs.create({ url: url }); // Open the URL in a new tab
});

function updateBadge(count) {
  chrome.action.setBadgeText({ text: count.toString()});
  chrome.action.setBadgeTextColor({ color: [0, 255, 0, 255] });
  chrome.action.setBadgeBackgroundColor({ color: [75, 75, 75, 255] });
}



