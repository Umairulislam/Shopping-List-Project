// DOM Elements
const itemForm = document.getElementById("item-form")
const itemInput = document.getElementById("item-input")
const itemList = document.getElementById("item-list")
const itemFilter = document.getElementById("filter")
const clearBtn = document.getElementById("clear")
const filterIcon = document.querySelector("div > i")
const formBtn = document.getElementById("form-btn")
let isEditMode = false

// 10. Function to display items from local storage on page load
function displayItemsFromStorage() {
  const itemsFromStorage = getItemsFromStorage()
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item)
  })
  resetUI()
}

// 1. Function to handle form submission
function handleFormSubmit(e) {
  e.preventDefault()
  const newItem = itemInput.value.trim()

  // Check if the input is empty
  if (!newItem) {
    alert("Please enter an item")
    return
  }

  // Check if the input is in edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode")
    removeItemFromStorage(itemToEdit.textContent)
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
  itemInput.value = ""
  resetUI()
}

// 2. Function to add an item to the DOM
function addItemToDOM(item) {
  const li = document.createElement("li")
  const text = document.createTextNode(item)
  li.appendChild(text)
  const button = createButton("remove-item btn-link text-red")
  li.appendChild(button)
  itemList.appendChild(li)
}

// 3. Function to create a button with specific classes
function createButton(classes) {
  const button = document.createElement("button")
  button.className = classes
  const icon = createIcon("fa-solid fa-xmark")
  button.appendChild(icon)
  return button
}

// 4. Function to create an icon with specific classes
function createIcon(classes) {
  const icon = document.createElement("i")
  icon.className = classes
  return icon
}

// 11. Function to add an item to local storage
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

// 5. Function to handle item click
function handleItemClick(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement)
    resetUI()
  } else {
    activateEditMode(e.target)
  }
}

// 15. Function to handle duplicate item
function isItemDuplicate(item) {
  const itemsFromStorage = getItemsFromStorage()
  return itemsFromStorage.includes(item)
}

// 14.  Function to activate edit mode for a specific item
function activateEditMode(item) {
  isEditMode = true
  itemList.querySelectorAll("li").forEach((li) => {
    li.classList.remove("edit-mode")
  })
  item.classList.add("edit-mode")
  formBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update Item`
  formBtn.style.backgroundColor = "lightcoral"
  itemInput.value = item.textContent
  itemForm.scrollIntoView({ behavior: "smooth", block: "start" })
}

// 6. Function to remove an item from the DOM and local storage
function removeItem(item) {
  if (confirm("Are you sure you want to remove this item?")) {
    item.remove()
    removeItemFromStorage(item.textContent)
  }
  resetUI()
}

// 13. Function to remove an item from local storage
function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage()
  const updateItems = itemsFromStorage.filter((i) => {
    return i !== item
  })
  localStorage.setItem("items", JSON.stringify(updateItems))
}

// 7. Function to clear all items
function handleClearItems() {
  while (itemList.firstChild) {
    itemList.firstChild.remove()
  }
  localStorage.removeItem("items")
  resetUI()
}

// 8. Function to reset the UI
function resetUI() {
  itemInput.value = ""
  const items = itemList.querySelectorAll("li")
  itemFilter.style.display = items.length === 0 ? "none" : ""
  filterIcon.style.display = items.length === 0 ? "none" : ""
  clearBtn.style.display = items.length === 0 ? "none" : ""

  formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`
  formBtn.style.backgroundColor = "lightblue"
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
