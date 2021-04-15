/*! ACCORDION */

function accordion() {
  const accButtons = document.querySelectorAll('.accordion'),
        py = 48
  
  // Listen for click
  accButtons.forEach(button => {
    button.addEventListener('click', function () {
      button.classList.toggle('accordion-active')

      if (button.classList.contains('accordion-active')) {
        button.querySelector('.plus').style.setProperty('--plus-after', '90deg')
      } else {
        button.querySelector('.plus').style.setProperty('--plus-after', '0deg')
      }
      let content = button.nextElementSibling

      if (content.style.maxHeight) {
        content.style.maxHeight = null
        content.style.padding = '0px 16px'
      } else {
        content.style.maxHeight = `${content.scrollHeight + py}px`
        content.style.padding = '24px 16px'
      }
    })
  })
}

module.exports = { accordion }