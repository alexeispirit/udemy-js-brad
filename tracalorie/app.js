// Storage Controller
const StorageCtrl = (function() {
  // public methods
  return {
    storeItem: function(item) {
      let items;
      // check if any items in localStorage
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items = items.filter(item => item.id !== id);
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   { id: 1, name: "Cookie", calories: 400 },
    //   { id: 2, name: "Eggs", calories: 300 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let id;
      // create id
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      // calories to number
      calories = parseInt(calories);

      // create new item
      const newItem = new Item(id, name, calories);
      // add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = data.items.find(item => item.id === id);
      return found;
    },
    updateItem: function(name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = data.items.find(item => item.id === data.currentItem.id);
      found.name = name;
      found.calories = calories;

      return found;
    },
    deleteItem: function(id) {
      data.items = [...data.items.filter(item => item.id !== id)];
    },
    clearAllItems: function() {
      data.items = [];
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getTotalCalories: function() {
      const total = data.items.reduce(
        (accumulator, item) => accumulator + item.calories,
        0
      );
      return total;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  // public methods
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(item => {
        html += `
          <li id="item-${item.id}" class="collection-item">
            <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // show list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // convert to array
      listItems = Array.from(listItems);

      listItems.map(listItem => {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      const { name, calories } = ItemCtrl.getCurrentItem();
      document.querySelector(UISelectors.itemNameInput).value = name;
      document.querySelector(UISelectors.itemCaloriesInput).value = calories;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => listItem.remove());
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // add item to UI list
      UICtrl.addListItem(newItem);
      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // store in localStorage
      StorageCtrl.storeItem(newItem);
      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // item edit click
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // get list item id
      const listId = e.target.parentNode.parentNode.id;
      // break into an array
      const listIdArr = listId.split("-");
      // get actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update ui
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    // clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from ui
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // clear items event
  const clearAllItemsClick = function(e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();
    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // Clear ui list
    UICtrl.removeItems();
    // clear from localStorage
    StorageCtrl.clearItemsFromStorage();
    // hide ul
    UICtrl.hideList();
  };

  // public methods
  return {
    init: function() {
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list with items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
