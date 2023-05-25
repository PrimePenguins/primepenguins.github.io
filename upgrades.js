var upgrades = [
    { id: 1, name: "Improved Faucets", cost: 1000, description: "Increases coins per second by 10%", upgradeFunction: function () { coinsPerSecond *= 1.1; } },
    { id: 2, name: "Luxury Tiles", cost: 5000, description: "Increases coins per second by 25%", upgradeFunction: function () { coinsPerSecond *= 1.25; } },
    { id: 3, name: "Golden Toilet Seat", cost: 10000, description: "Increases coins per second by 50%", upgradeFunction: function () { coinsPerSecond *= 1.5; } }
  ];
  
  var upgradesDiv = document.getElementById("upgrades");
  
  function updateUpgrades() {
    upgradesDiv.innerHTML = "<h2>Upgrades</h2>";
  
    upgrades.forEach(function (upgrade) {
      var upgradeItem = document.createElement("div");
      upgradeItem.innerHTML = "<strong>" + upgrade.name + "</strong><br>" +
                              "Cost: " + upgrade.cost.toFixed(2) + "<br>" +
                              "Description: " + upgrade.description + "<br>" +
                              '<button onclick="buyUpgrade(' + upgrade.id + ')">Buy</button>';
      upgradesDiv.appendChild(upgradeItem);
    });
  }
  
  function buyUpgrade(upgradeId) {
    var upgrade = upgrades.find(function (upgrade) {
      return upgrade.id === upgradeId;
    });
  
    if (coins >= upgrade.cost) {
      coins -= upgrade.cost;
      upgrade.upgradeFunction();
      currencyDiv.innerText = "Coins: " + coins.toFixed(2);
      messageDiv.innerText = "You bought the upgrade: " + upgrade.name;
      updateBuyCost();
      updateCoins();
      updateUpgrades();
    } else {
      messageDiv.innerText = "Not enough coins to buy this upgrade!";
    }
  }
  
  // Call the updateUpgrades function after updating the sidebar
  updateUpgrades();