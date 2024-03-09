var bathrooms = [
  { id: 1, name: "Moderin Bathtime", image: "1.jpg", cost: 80, reward: 10 },
  { id: 2, name: "Blue Bathroom", image: "2.jpg", cost: 75, reward: 15 },
  { id: 3, name: "White but with spice bathroom", image: "3.jpg", cost: 100, reward: 20 },
  { id: 4, name: "Richie Rich Bathroom", image: "4.jpg", cost: 10000, reward: 500 },
  { id: 5, name: "Very Fancy Bathroom", image: "5.jpg", cost: 30000, reward: 200 },
  { id: 6, name: "You Know Who's Bathroom", image: "6.jpg", cost: 15, reward: 5 },
  { id: 7, name: "Earth's Top 5 Worse Bathrooms", image: "7.jpg", cost: 10, reward: 2 },
  { id: 8, name: "Honestly, the reality of every single reality tv show ever", image: "8.jpg", cost: 10, reward: 2 },
  { id: 9, name: "Richie Rich", image: "10.jpg", cost: 500000000, reward: 500000 },
  { id: 10, name: "Jeff Bazo's Bathroom", image: "11.jpg", cost: 100000000000000, reward: 5000000 }
];

var specialBathrooms = [
  { id: 11, name: "Fool's Bathroom", image: "fools-bathroom.jpeg", cost: 3000, reward: -200 },
  { id: 12, name: "Santa's Bathroom", image: "santas-bathroom.jpeg", cost: 10000, reward: 20000 },
  { id: 13, name: "Prime's Bathroom", image: "birthday-bathroom.jpeg", cost: 10, reward: 500 }
];

var bathroomImage = document.getElementById("bathroom-image");
var messageDiv = document.getElementById("message");
var currencyDiv = document.getElementById("currency");
var ownedBathroomsDiv = document.getElementById("owned-bathrooms");
var buyCostDiv = document.getElementById("buy-cost");

var coinsPerSecond = 0;
var coins = 200;
var currentBathroomIndex = 0;
var ownedBathrooms = [];
var ownedUpgrades = [];

function getSpecialBathroom(day, month) {
  if (day === 1 && month === 4) {
    // April Fools Day
    return specialBathrooms[0];
  } else if (day === 25 && month === 12) {
    // Christmas
    return specialBathrooms[1];
  } else if (day === 6 && month === 9) {
    // Prime's Birthday
    return specialBathrooms[2];
  }

  return null; // No special bathroom for the given day
}

function formatNumber(number) {
  var suffixes = ["", "k", "M", "B", "T", "Q"];
  var suffixIndex = 0;

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }

  return number.toFixed(2) + suffixes[suffixIndex];
}

function updateBathroomImage() {
  bathroomImage.src = bathrooms[currentBathroomIndex].image;
}

function updateOwnedBathrooms() {
  ownedBathroomsDiv.innerHTML = "";
  ownedBathrooms.forEach(function (bathroom) {
    var img = document.createElement("img");
    img.src = bathroom.image;
    img.title = bathroom.name;
    ownedBathroomsDiv.appendChild(img);
  });
}

function updateBuyCost() {
  if (buyCostDiv) {
    var index = currentBathroomIndex % bathrooms.length; // Correctly calculate the index
    buyCostDiv.innerText = "Buy Cost: " + formatNumber(bathrooms[index].cost);
  }
}

function updateCoins() {
  var totalReward = 0;
  ownedBathrooms.forEach(function (bathroom) {
    totalReward += bathroom.reward;
  });

  coins += totalReward / 1000; // Divide by 1000 to account for the per second value
  currencyDiv.innerText = "Coins: " + formatNumber(coins);
}

function buyBathroom() {
  var currentBathroom = bathrooms[currentBathroomIndex];
  if (coins >= currentBathroom.cost) {
    coins -= currentBathroom.cost;
    coinsPerSecond += currentBathroom.reward;

    var ownedBathroom = {
      id: currentBathroom.id,
      name: currentBathroom.name,
      image: currentBathroom.image,
      reward: currentBathroom.reward
    };

    ownedBathrooms.push(ownedBathroom);
    updateOwnedBathrooms();
    messageDiv.innerText = "You bought " + currentBathroom.name + "!";
    currencyDiv.innerText = "Coins: " + formatNumber(coins);
    updateBuyCost();

    // Randomize the current bathroom index
    currentBathroomIndex = Math.floor(Math.random() * bathrooms.length);
    updateBathroomImage();
  } else {
    messageDiv.innerText = "Not enough coins to buy this bathroom!";
  }
}

function skipBathroom() {
  // Randomize the current bathroom index
  currentBathroomIndex = Math.floor(Math.random() * bathrooms.length);
  updateBathroomImage();
  updateBuyCost();
}

function sellBathroom() {
  if (ownedBathrooms.length > 0) {
    var bathroomToSell = ownedBathrooms.pop();
    coins += bathroomToSell.reward;
    coinsPerSecond -= bathroomToSell.reward;

    updateOwnedBathrooms();
    messageDiv.innerText = "You sold " + bathroomToSell.name + "!";
    currencyDiv.innerText = "Coins: " + formatNumber(coins);
    updateBuyCost();
  } else {
    messageDiv.innerText = "You don't own any bathrooms to sell!";
  }
}

function saveGame() {
  var gameData = {
    coins: coins,
    coinsPerSecond: coinsPerSecond,
    currentBathroomIndex: currentBathroomIndex,
    ownedBathrooms: ownedBathrooms,
    ownedUpgrades: ownedUpgrades
  };

  var gameDataString = JSON.stringify(gameData);
  localStorage.setItem("bathroomGame", gameDataString);

  // Save the ownedUpgrades array separately
  var ownedUpgradesString = JSON.stringify(ownedUpgrades);
  localStorage.setItem("ownedUpgrades", ownedUpgradesString);

  messageDiv.innerText = "Game saved!";
}

function loadGame() {
  var gameDataString = localStorage.getItem("bathroomGame");
  var ownedUpgradesString = localStorage.getItem("ownedUpgrades");

  if (gameDataString && ownedUpgradesString) {
    var gameData = JSON.parse(gameDataString);
    ownedUpgrades = JSON.parse(ownedUpgradesString);

    coins = gameData.coins;
    coinsPerSecond = gameData.coinsPerSecond;
    currentBathroomIndex = gameData.currentBathroomIndex;
    ownedBathrooms = gameData.ownedBathrooms;

    updateOwnedBathrooms();
    updateBathroomImage();
    currencyDiv.innerText = "Coins: " + formatNumber(coins);

    messageDiv.innerText = "Game loaded!";
  } else {
    messageDiv.innerText = "No saved game found!";
  }
}

// Initialize the game
updateOwnedBathrooms();
updateBathroomImage();
currencyDiv.innerText = "Coins: " + formatNumber(coins);
updateBuyCost();

// Update coins every second
setInterval(updateCoins, 1000);
