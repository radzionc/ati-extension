const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const secondsInput = document.getElementById('seconds')
const secondsText = document.getElementById('secondsText')

const hideElement = element => {
  element.style.display = "none"
}

const showElement = element => {
  element.style.display = "block"
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

const visibilityOnStart = () => {
  hideElement(startButton)
  hideElement(secondsInput)
  hideElement(secondsText)

  showElement(stopButton)
}

const visibilityOnStop = () => {
  hideElement(stopButton)

  showElement(startButton)
  showElement(secondsInput)
  showElement(secondsText)
}

startButton.onclick = () => {
  sendMessage({ command: 'start', seconds: Number(localStorage.seconds) })
  visibilityOnStart()
}

stopButton.onclick = () => {
  sendMessage({ command: 'stop' })
  visibilityOnStop()
}

const onSecondsInputChange = (value = secondsInput.value) => {
  secondsInput.value = value
  localStorage.setItem('seconds', value)
  secondsText.innerText = `Reload every: ${value} seconds` 
}

secondsInput.addEventListener('input', () => onSecondsInputChange())

const seconds = Number(localStorage.getItem('seconds')) || 60
onSecondsInputChange(seconds)

;(async () => {
  const isRunning = await sendMessage({ question: 'isRunning' })
  if (isRunning) {
    visibilityOnStart()
  } else {
    visibilityOnStop()
  }
})()
