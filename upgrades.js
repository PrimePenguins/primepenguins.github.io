var coinsPerSecond = 1; // Initialize the coinsPerSecond variable

var upgrades = [
  { id: 1, name: "Improved Faucets", cost: 1000, description: "Increases coins per second by 10%", upgradeFunction: function () { coinsPerSecond *= 1.1; }, percentage: 10, maxBuy: 3, currentBuy: 0 },
  { id: 2, name: "Luxury Tiles", cost: 5000, description: "Increases coins per second by 25%", upgradeFunction: function () { coinsPerSecond *= 1.25; }, percentage: 25, maxBuy: 2, currentBuy: 0 },
  { id: 3, name: "Golden Toilet Seat", cost: 10000, description: "Increases coins per second by 50%", upgradeFunction: function () { coinsPerSecond *= 1.5; }, percentage: 50, maxBuy: 1, currentBuy: 0 }
];

var ownedUpgrades = []; // Initialize the ownedUpgrades array

var upgradesDiv = document.getElementById("upgrades");

function updateUpgradePercentage() {
  var totalPercentage = upgrades.reduce(function (total, upgrade) {
    return total + upgrade.percentage * upgrade.currentBuy; // Multiply the percentage by the current number of purchases
  }, 0);
  var upgradePercentage = document.getElementById("upgrade-percentage");
  upgradePercentage.innerText = "Total Upgrade Percentage: " + totalPercentage.toFixed(2) + "%";
}

function updateUpgrades() {
  upgradesDiv.innerHTML = "<h2>Upgrades</h2>";

  upgrades.forEach(function (upgrade) {
    var upgradeItem = document.createElement("div");
    upgradeItem.innerHTML = "<strong>" + upgrade.name + "</strong><br>" +
                            "Cost: " + upgrade.cost.toFixed(2) + "<br>" +
                            "Description: " + upgrade.description + "<br>" +
                            "Purchased: " + upgrade.currentBuy + " / " + upgrade.maxBuy + "<br>" +
                            '<button onclick="buyUpgrade(' + upgrade.id + ')">Buy</button>';
    upgradesDiv.appendChild(upgradeItem);
  });

  updateUpgradePercentage(); // Update the upgrade percentage
}

function buyUpgrade(upgradeId) {
  var upgrade = upgrades.find(function (upgrade) {
    return upgrade.id === upgradeId;
  });

  if (coins >= upgrade.cost && upgrade.currentBuy < upgrade.maxBuy) { // Check if the current number of purchases is less than the maximum
    coins -= upgrade.cost;
    upgrade.upgradeFunction();
    currencyDiv.innerText = "Coins: " + coins.toFixed(2);
    messageDiv.innerText = "You bought the upgrade: " + upgrade.name;
    upgrade.currentBuy++; // Increment the number of purchases
    ownedUpgrades.push(upgrade.id); // Add the upgrade to the ownedUpgrades array
    updateBuyCost();
    updateCoins();
    updateUpgrades();
    updateUpgradePercentage(); // Update the upgrade percentage

    // Save the ownedUpgrades array to local storage
    localStorage.setItem("ownedUpgrades", JSON.stringify(ownedUpgrades));
  } else {
    messageDiv.innerText = "Not enough coins or maximum purchases reached for this upgrade!";
  }
}

// Load the ownedUpgrades array from local storage
var storedOwnedUpgrades = localStorage.getItem("ownedUpgrades");
if (storedOwnedUpgrades) {
  ownedUpgrades = JSON.parse(storedOwnedUpgrades);
}

// Call the updateUpgrades function after updating the sidebar
updateUpgrades();
updateUpgradePercentage(); // Update the upgrade percentage initially


  