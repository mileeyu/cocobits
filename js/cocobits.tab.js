/*! TAB */

function tab() {
  // Initialize variables
  const tabLinks = document.querySelector('.tab-menu').children,
    tabContents = document.querySelector('.tab-contents').children

  // Select first tab link by default
  tabLinks[0].classList.add('content--visible')
  // Show first tab content by default
  tabContents[0].classList.add('d-block')
  // Hide rest of content by default
  Array.from(tabContents).forEach(child => {
    if (child.classList.contains('d-block')) {
      return
    } else {
      child.classList.add('d-none')
    }
  })

  Array.from(tabLinks).forEach(link => {
    
    link.addEventListener('click', (e) => {
      Array.from(tabLinks).forEach(link => {
        link.classList.remove('content--visible')
      })
      // Change color of selected link
      if (e.target === link) {
        link.classList.add('content--visible')
      }
      // Show content of selected link
      Array.from(tabContents).forEach(content => {
        if (link.dataset.tab === content.dataset.tab) {
          content.classList.replace('d-none', 'd-block')
        } else {
          content.classList.replace('d-block', 'd-none')
        }
      })
    })
  })
}

module.exports = { tab }

