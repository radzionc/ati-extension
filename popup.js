const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const secondsInput = document.getElementById('seconds')
const secondsText = document.getElementById('secondsText')

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

secondsInput.onchange = ({ target: { value } }) => {
  localStorage.setItem('seconds', value)
  secondsText.innerText = `${value} s`
}

const seconds = Number(localStorage.getItem('seconds')) || 60
secondsInput.value = seconds
secondsText.innerText = `${seconds} s`

;(async () => {
  const isRunning = await sendMessage({ question: 'isRunning' })
  hideButton(isRunning ? startButton : stopButton)
})()
