function saveGame() {
    var gameData = {
      coins: coins,
      coinsPerSecond: coinsPerSecond,
      currentBathroomIndex: currentBathroomIndex,
      ownedBathrooms: ownedBathrooms,
      ownedUpgrades: ownedUpgrades,
      upgradesAmount: [] // New property to store the upgrade amounts
    };
  
    // Save the amount of each upgrade
    upgrades.forEach(function (upgrade) {
      gameData.upgradesAmount.push(upgrade.amount);
    });
  
    var gameDataString = JSON.stringify(gameData);
    localStorage.setItem("bathroomGame", gameDataString);
    messageDiv.innerText = "Game saved!";
  }
  
  function loadGame() {
    var gameDataString = localStorage.getItem("bathroomGame");
    if (gameDataString) {
      var gameData = JSON.parse(gameDataString);
  
      coins = gameData.coins;
      coinsPerSecond = gameData.coinsPerSecond;
      currentBathroomIndex = gameData.currentBathroomIndex;
      ownedBathrooms = gameData.ownedBathrooms;
      ownedUpgrades = gameData.ownedUpgrades;
  
      // Load the upgrade amounts
      for (var i = 0; i < gameData.upgradesAmount.length; i++) {
        upgrades[i].amount = gameData.upgradesAmount[i];
      }
  
      updateBathroomImage();
      updateOwnedBathrooms();
      currencyDiv.innerText = "Coins: " + coins.toFixed(2);
      messageDiv.innerText = "Game loaded!";
      updateBuyCost();
  
      if (gameData.darkMode) {
        document.body.classList.add('dark-mode');
      }
  
      // Update the upgrade counters on the sidebar
      updateOwnedUpgrades();
    } else {
      messageDiv.innerText = "No saved game found!";
    }
  }
  