document.documentElement.classList.add('js-enabled')

document.querySelectorAll('.hero-name-line').forEach((line, wordIndex) => {
  const word = line.textContent
  line.replaceChildren(...Array.from(word, (letter, letterIndex) => {
    const character = document.createElement('span')
    character.className = 'hero-letter'
    character.style.setProperty('--letter-index', letterIndex)
    character.setAttribute('aria-hidden', 'true')
    character.textContent = letter
    return character
  }))
  line.style.setProperty('--word-index', wordIndex)
})

const menuToggle = document.querySelector('.menu-toggle')
const navigation = document.querySelector('.primary-navigation')

function closeNavigation() {
  if (!menuToggle || !navigation) return
  menuToggle.setAttribute('aria-expanded', 'false')
  navigation.classList.remove('is-open')
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true'
    menuToggle.setAttribute('aria-expanded', String(!isOpen))
    navigation.classList.toggle('is-open', !isOpen)
  })

  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation))
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNavigation()
  })
}

const motionToggle = document.querySelector('.motion-toggle')
if (motionToggle) {
  motionToggle.addEventListener('click', () => {
    const motionIsOn = motionToggle.getAttribute('aria-pressed') === 'true'
    motionToggle.setAttribute('aria-pressed', String(!motionIsOn))
    motionToggle.setAttribute('aria-label', motionIsOn ? 'Turn motion effects on' : 'Turn motion effects off')
    motionToggle.querySelector('.motion-label').textContent = motionIsOn ? 'Motion off' : 'Motion on'
    document.documentElement.classList.toggle('motion-off', motionIsOn)
  })
}

const projectSearch = document.getElementById('project-search')
const projectCards = Array.from(document.querySelectorAll('.work-card'))
const emptySearch = document.getElementById('empty-search')

if (projectSearch) {
  projectSearch.addEventListener('input', () => {
    const query = projectSearch.value.trim().toLocaleLowerCase()
    let visibleCount = 0

    projectCards.forEach(card => {
      const matches = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase().includes(query)
      card.hidden = !matches
      if (matches) visibleCount += 1
    })

    if (emptySearch) emptySearch.hidden = visibleCount > 0
  })
}

const navigationLinks = Array.from(document.querySelectorAll('.primary-navigation a'))
const sections = navigationLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(section => section)

const revealSelector = [
  '.work-card',
  '.timeline-item',
  '.about-story',
  '.skills-panel',
  '.service-card',
  '.section-top > div:first-child',
  '.about-lead',
  '.section-aside',
  '.service-notes p',
  '.work-footer',
  '.quick-facts .fact',
  '.contact-heading',
  '.contact-form'
].join(', ')
const revealTargets = Array.from(document.querySelectorAll(revealSelector))

revealTargets.forEach(element => element.classList.add('build-reveal'))

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  revealTargets.forEach(element => revealObserver.observe(element))

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      navigationLinks.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`
        link.classList.toggle('is-active', isCurrent)
      })
    })
  }, { rootMargin: '-25% 0px -65% 0px' })

  sections.forEach(section => sectionObserver.observe(section))
} else {
  revealTargets.forEach(element => element.classList.add('is-visible'))
}

const contactForm = document.getElementById('contact-form')
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault()
    if (!contactForm.reportValidity()) return

    const formData = new FormData(contactForm)
    const name = formData.get('name').toString().trim()
    const email = formData.get('email').toString().trim()
    const subject = formData.get('subject').toString().trim()
    const message = formData.get('message').toString().trim()
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    const mailto = `mailto:baldoarman7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    document.getElementById('form-status').textContent = 'Your email app will open with a draft ready to send.'
    window.location.href = mailto
  })
}
