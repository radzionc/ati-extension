const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

const hideButton = button => {
  button.style.display = "none"
}

const showButton = button => {
  button.style.display = "block"
}

const sendMessage = message => new Promise(resolve => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message, resolve)
  })
})

const sendQuestion = (question, onResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { question }, onResponse)
  })
}

startButton.onclick = () => {
  sendMessage({ command: 'start' })
  hideButton(startButton)
  showButton(stopButton)
}

stopButton.onclick = () => {
  sendMessage({ command: 'stop' })
  hideButton(stopButton)
  showButton(startButton)
}

(async () => {
  const isRunning = await sendMessage({ question: 'isRunning' })
  hideButton(isRunning ? startButton : stopButton)
})()
