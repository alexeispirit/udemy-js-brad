// Storage Controller

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
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 }
    ],
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
    addBtn: ".add-btn",
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
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
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
      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // public methods
  return {
    init: function() {
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
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
