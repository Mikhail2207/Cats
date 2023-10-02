const $wr = document.querySelector('[data-wr]')
const $createCatForm = document.forms.createCatForm
const $modalWr = document.querySelector('[data-modalWr]')
const $modalContent = document.querySelector('[data-modalContent]')
console.log($modalWr, $modalContent)
const ACTIONS = {
  DETAIL: 'detail',
  DELETE: 'delete',
}

const path = 'https://cats.petiteweb.dev/api/single/'
const person = 'Mikhail'

const getCatHTML = (cat) => {
  return `
  <div data-cat-id="${cat.id}" class="card mb-2 mx-1" style="width: 18rem;">
    <img src="${cat.image}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${cat.name}</h5>
      <p class="card-text">${cat.description}</p>
      <button data-action="${ACTIONS.DETAIL}" type="button" class="btn btn-primary">Detail</button>
      <button data-action="${ACTIONS.DELETE}" type="button" class="btn btn-danger">Delete</button>
    </div>
  </div>
  `
}

fetch(`${path}${person}/show/`)
  .then((res) => res.json())
  .then((data) => {
    $wr.insertAdjacentHTML(
      'afterbegin',
      data.map((cat) => getCatHTML(cat)).join('')
    )
  })

$wr.addEventListener('click', (e) => {
  if (e.target.dataset.action == ACTIONS.DELETE) {
    const $catWr = e.target.closest('[data-cat-id]')
    const { catId } = $catWr.dataset

    fetch(`${path}${person}/delete/${catId}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.status === 200) {
        return $catWr.remove()
      }

      alert(`Удаление кота с ID ${catId} не удалось`)
    })
  }
})

const submitCreateCatHandler = (e) => {
  e.preventDefault()

  let formDataObject = Object.fromEntries(new FormData(e.target).entries())
  console.log(formDataObject)

  formDataObject = {
    ...formDataObject,
    id: +formDataObject.id,
    age: +formDataObject.age,
    rate: +formDataObject.rate,
    favorite: !!formDataObject.favorite,
  }

  $modalWr.classList.add('hidden')

  fetch(`${path}${person}/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject),
  }).then((res) => {
    if (res.status === 200) {
      $wr.insertAdjacentHTML('beforeend', getCatHTML(formDataObject))
    }
  })
}

const clickModalWrHandler = (e) => {
  if (e.target === $modalWr) {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $createCatForm.removeEventListener('submit', submitCreateCatHandler)
  }
}

const openModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'createCat') {
    $modalWr.classList.remove('hidden')

    $modalWr.addEventListener('click', clickModalWrHandler)
    $createCatForm.addEventListener('submit', submitCreateCatHandler)
  }
}

document.addEventListener('click', openModalHandler)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $createCatForm.removeEventListener('submit', submitCreateCatHandler)
  }
})
