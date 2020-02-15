chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'start') {
    const elements = document.getElementsByClassName('grid-row ng-scope')
    const loads = Array.from(elements).map(element => {
      const rates = Array.from(element.getElementsByClassName('rate-bold'))
      const price = rates.length && rates[0].innerText
      const code = element.querySelector('[data-bo-text="e.firm.id"]').innerText
      const routeDistance = element.getElementsByClassName('route-distance').item(0).innerText
      return {
        price,
        id: `${code}-${routeDistance}`
      }
    })
    console.log(elements, loads)
  }
})