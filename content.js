const PERIOD = 10000
const WAIT_AFTER_CLICK = 2000

const getLoadsElements = () => Array.from(document.getElementsByClassName('grid-row ng-scope'))

const getLoadFromElement = element => {
  const rates = Array.from(element.getElementsByClassName('rate-bold'))
  const price = rates.length && rates[0].innerText
  const code = element.querySelector('[data-bo-text="e.firm.id"]').innerText
  const routeDistance = element.getElementsByClassName('route-distance').item(0).innerText
  return {
    price,
    id: `${code}-${routeDistance}`
  }
}

const sleep = m => new Promise(r => setTimeout(r, m))

const getLoads = () => {
  const elements = getLoadsElements()
  return elements.map(getLoadFromElement)
}

const clickOnSearch = async () => {
  const searchButton = document.getElementsByClassName("search-form-button").item(0)
  searchButton.click()
  await sleep(WAIT_AFTER_CLICK)
}

let intervalId = null

const updateLoadsView = async (initialLoads) => {
  await clickOnSearch()
  const elements = getLoadsElements()
  
  elements.forEach(element => {
    const load = getLoadFromElement(element)
    const same = initialLoads.find(il => il.price === load.price && il.id === load.id)
    if (same) {
      element.remove()
    }
  })
}

chrome.runtime.onMessage.addListener(async ({ command, question }, sender, sendResponse) => {
  if (command === 'start') {
    const initialLoads = getLoads()
    updateLoadsView(initialLoads)
    intervalId = setInterval(updateLoadsView, PERIOD, initialLoads)
  } else if (command === 'stop') {
    clearInterval(intervalId)
  }
  if (question === 'isRunning') {
    sendResponse(!!intervalId)
  }
})

