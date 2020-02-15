const startButton = document.getElementById('start')

startButton.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'start' }, (response) => {
      console.log(response.farewell)
    })
  })
}