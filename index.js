const $wr = document.querySelector('[data-wr]')

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
