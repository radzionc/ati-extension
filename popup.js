const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

const hideButton = button => {
  button.style.display = "none"
}

const showButton = button => {
  button.style.display = "block"
}

const sendQuestion = (question, onResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { question }, onResponse)
  })
}

sendQuestion('isRunning', isRunning => {
  hideButton(isRunning ? startButton : stopButton)
})

const sendCommand = command => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command })
  })
}

startButton.onclick = () => {
  sendCommand('start')
  hideButton(startButton)
  showButton(stopButton)
}

stopButton.onclick = () => {
  sendCommand('stop')
  hideButton(stopButton)
}