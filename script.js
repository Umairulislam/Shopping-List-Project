// DOM Elements
const itemForm = document.getElementById("item-form")
const itemInput = document.getElementById("item-input")
const itemList = document.getElementById("item-list")
const itemFilter = document.getElementById("filter")
const clearBtn = document.getElementById("clear")
const formBtn = document.getElementById("form-btn")
let isEditMode = false

// 10. Function to display items from local storage
function displayItemsFromStorage() {
  const itemsFromStorage = getItemsFromStorage()
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item)
  })
  resetUI()
}

// 1. Function to handle form submition
function handleFormSubmit(e) {
  e.preventDefault()
  const newItem = itemInput.value.trim()
  if (!newItem) {
    alert("Please enter a an item")
    return
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode")
    removeItemFromStorage(itemToEdit)
    itemToEdit.classList.remove("edit-mode")
    itemToEdit.remove()
    isEditMode = false
  } else {
    if (isItemDuplicate(newItem)) {
      alert("Item already exists")
      return
    }
  }

  // Add item to the DOM, local storage, and reset UI
  addItemToDOM(newItem)
  addItemToStorage(newItem)
  resetUI()
  itemInput.value = ""
}

// 2. Function to add item to the DOM
function addItemToDOM(itemName) {
  const li = document.createElement("li")
  li.textContent = itemName

  // Create btn container div
  const btnContainer = document.createElement("div")
  btnContainer.classList.add("btn-container")

  // Create edit button
  const editButton = createButton(
    "edit-item btn-link",
    "fa-solid fa-pen-to-square"
  )

  // Create remove button
  const removeButton = createButton("remove-item btn-link", "fa-solid fa-trash")

  // Append buttons to btn container
  btnContainer.appendChild(editButton)
  btnContainer.appendChild(removeButton)

  // Append btn container to list item
  li.appendChild(btnContainer)

  // Append list item to list
  itemList.appendChild(li)
}

// 3. Function to create button and icon
function createButton(classes, iconClass) {
  const button = document.createElement("button")
  button.className = classes

  const icon = document.createElement("i")
  icon.className = iconClass

  button.appendChild(icon)
  return button
}

// 8. Function to add an item to local storage
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage()
  itemsFromStorage.push(item)
  localStorage.setItem("items", JSON.stringify(itemsFromStorage))
}

// 12. Function to get items from local storage
function getItemsFromStorage(item) {
  const itemsFromStorage = localStorage.getItem("items")
  return itemsFromStorage ? JSON.parse(itemsFromStorage) : []
}

// 11. Function to handle item click
function handleItemClick(e) {
  const list = e.target.parentElement
  if (list.classList.contains("remove-item")) {
    removeItem(list.parentElement.parentElement)
  }
  if (list.classList.contains("edit-item")) {
    activateEditMode(list.parentElement.parentElement)
  }
}

// 13. Function to activate edit mode for a specific item
function activateEditMode(item) {
  isEditMode = true
  itemList.querySelectorAll("li").forEach((li) => {
    li.classList.remove("edit-mode")
  })
  item.classList.add("edit-mode")
  formBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i> Update Item"
  formBtn.classList.add("update-btn")
  itemInput.value = item.textContent
}

// 14. Function to check if an item is a duplicate
function isItemDuplicate(item) {
  const itemsFromStorage = getItemsFromStorage()
  return itemsFromStorage.includes(item)
}

// 4. Function to remove item from the DOM and local storage
function removeItem(item) {
  if (confirm("Are you sure?")) {
    item.remove()
    removeItemFromStorage(item)
    resetUI()
  }
}

// 12. Function to remove item from local storage
function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage()
  const updatedItems = itemsFromStorage.filter((li) => {
    return li !== item.textContent
  })
  localStorage.setItem("items", JSON.stringify(updatedItems))
}

// 5. Function to clear all items
function handleClearItems() {
  while (itemList.firstChild) {
    itemList.firstChild.remove()
  }
  localStorage.removeItem("items")
  resetUI()
}

// 6. Function to reset UI
function resetUI() {
  const items = itemList.querySelectorAll("li")
  if (items.length === 0) {
    itemFilter.style.display = "none"
    clearBtn.style.display = "none"
  } else {
    itemFilter.style.display = "block"
    clearBtn.style.display = "block"
  }
  formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item"
  formBtn.classList.remove("update-btn")
  isEditMode = false
}
resetUI()

// 9. Function to handle filter items based on user inputs
function handleitemFilters(e) {
  const text = e.target.value.toLowerCase()
  const items = itemList.querySelectorAll("li")
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase()
    item.style.display = itemName.indexOf(text) !== -1 ? "flex" : "none"
  })
}

// Event Listeners
itemForm.addEventListener("submit", handleFormSubmit)
itemList.addEventListener("click", handleItemClick)
clearBtn.addEventListener("click", handleClearItems)
itemFilter.addEventListener("keyup", handleitemFilters)
document.addEventListener("DOMContentLoaded", displayItemsFromStorage)
