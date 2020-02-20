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

const getLoads = () => {
  const elements = getLoadsElements()
  return elements.map(getLoadFromElement)
}

const clickOnSearch = () => {
  const searchButton = document.getElementsByClassName("search-form-button").item(0)
  searchButton.click()
}

let intervalId = null

chrome.runtime.onMessage.addListener(({ command, question }, sender, sendResponse) => {
  if (command === 'start') {
    const initialLoads = getLoads()
    intervalId = setInterval(() => {
      clickOnSearch()
      setTimeout(() => {
        const elements = getLoadsElements()
        elements.forEach(element => {
          const load = getLoadFromElement(element)
          const same = initialLoads.find(il => il.price === load.price && il.id === load.id)
          if (same) {
            element.remove()
          }
        })
      }, WAIT_AFTER_CLICK)
    }, PERIOD)
  } else if (command === 'stop') {
    clearInterval(intervalId)
  }
  if (question === 'isRunning') {
    sendResponse(!!intervalId)
  }
})

