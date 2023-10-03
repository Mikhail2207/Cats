const $wr = document.querySelector('[data-wr]')
const $modalWr = document.querySelector('[data-modalWr]')
const $modalContent = document.querySelector('[data-modalContent]')

const CREATE_FORM_LS_KEY = 'createCatForm'

const getCreateCatFormHTML =
  () => `<h4 class="text-center mb-4">Create new cat</h4>
  <form name="createCatForm">
    <div class="mb-3">
      <input
        type="number"
        class="form-control"
        name="id"
        placeholder="Id"
      />
    </div>

    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        name="name"
        placeholder="Name"
      />
    </div>

    <div class="mb-3">
      <input
        type="number"
        class="form-control"
        name="age"
        placeholder="Age"
      />
    </div>

    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        name="description"
        placeholder="Description"
      />
    </div>

    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        name="image"
        placeholder="Image url"
      />
    </div>

    <div class="mb-3">
      <input type="range" name="rate" min="1" max="10" />
    </div>
    <div class="mb-3 form-check">
      <input type="checkbox" class="form-check-input" name="favorite" />
      <label class="form-check-label" for="exampleCheck1">Favorite</label>
    </div>
    <button type="submit" class="btn btn-primary">Add</button>
  </form>`

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
      <h5 class="card-title">${cat.name} ${cat.age}</h5>
      <p class="card-text">${cat.description}</p>
      <p>${cat.favorite ? 'Любимчик :)' : 'Обычный'}</p>
      <button data-action="${
        ACTIONS.DETAIL
      }" type="button" class="btn btn-primary">Detail</button>
      <button data-action="${
        ACTIONS.DELETE
      }" type="button" class="btn btn-danger">Delete</button>
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

const formatCreateFormData = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  age: +formDataObject.age,
  rate: +formDataObject.rate,
  favorite: !!formDataObject.favorite,
})

const submitCreateCatHandler = (e) => {
  e.preventDefault()

  let formDataObject = formatCreateFormData(
    Object.fromEntries(new FormData(e.target).entries())
  )

  $modalWr.classList.add('hidden')
  $modalContent.innerHTML = ''
  localStorage.removeItem(CREATE_FORM_LS_KEY)

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
    $modalContent.innerHTML = ''
  }
}

const openModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'createCat') {
    $modalWr.classList.remove('hidden')
    $modalWr.addEventListener('click', clickModalWrHandler)

    $modalContent.insertAdjacentHTML('afterbegin', getCreateCatFormHTML())
    const $createCatForm = document.forms.createCatForm

    const dataFromLS = localStorage.getItem(CREATE_FORM_LS_KEY)

    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS)

    if (preparedDataFromLS) {
      Object.keys(preparedDataFromLS).forEach((key) => {
        $createCatForm[key].value = preparedDataFromLS[key]
      })
    }

    $createCatForm.addEventListener('submit', submitCreateCatHandler)
    $createCatForm.addEventListener('change', (changeEvent) => {
      let formattedData = formatCreateFormData(
        Object.fromEntries(new FormData($createCatForm).entries())
      )

      localStorage.setItem(CREATE_FORM_LS_KEY, JSON.stringify(formattedData))
    })
  }
}

document.addEventListener('click', openModalHandler)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $modalContent.innerHTML = ''
  }
})
