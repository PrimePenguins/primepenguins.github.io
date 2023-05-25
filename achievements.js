var achievements = [
  { id: 1, name: "Bathroom Collector", description: "Own 10 different bathrooms", reward: 500, claimed: false, condition: has10Bathrooms },
  { id: 2, name: "Bathroom Tycoon", description: "Own 20 different bathrooms", reward: 1000, claimed: false, condition: has20Bathrooms },
  { id: 3, name: "Wealthy Restroom", description: "Reach a total of 10,000 coins", reward: 2000, claimed: false, condition: has10000Coins },
  { id: 4, name: "Bathroom Collector Plus", description: "Own 10+ different bathrooms", reward: 1000, claimed: false, condition: has10PlusBathrooms }
];

var achievementsDiv = document.getElementById("owned-achievements"); // Updated to match the HTML element ID

function updateAchievements() {
  achievementsDiv.innerHTML = "<h2>Achievements</h2>";

  achievements.forEach(function (achievement) {
    var achievementItem = document.createElement("div");
    achievementItem.innerHTML = "<strong>" + achievement.name + "</strong><br>" +
                                "Description: " + achievement.description + "<br>" +
                                "Reward: " + achievement.reward.toFixed(2) + " coins<br>" +
                                '<button onclick="claimAchievement(' + achievement.id + ')">Claim</button>';
    achievementsDiv.appendChild(achievementItem);
  });
}

function claimAchievement(achievementId) {
  var achievement = achievements.find(function (achievement) {
    return achievement.id === achievementId;
  });

  if (!achievement.claimed) {
    achievement.claimed = true;
    coins += achievement.reward;
    currencyDiv.innerText = "Coins: " + coins.toFixed(2);
    messageDiv.innerText = "You claimed the achievement: " + achievement.name + "! You earned " + achievement.reward.toFixed(2) + " coins.";
    updateAchievements();
  } else {
    messageDiv.innerText = "This achievement has already been claimed!";
  }
}

// Achievement check
function checkAchievements() {
  // Remove duplicate achievements
  var uniqueAchievements = [];
  var achievementIds = [];

  for (var i = 0; i < achievements.length; i++) {
    var achievement = achievements[i];
    if (!achievementIds.includes(achievement.id)) {
      uniqueAchievements.push(achievement);
      achievementIds.push(achievement.id);
    }
  }

  // Check each unique achievement condition
  for (var j = 0; j < uniqueAchievements.length; j++) {
    var uniqueAchievement = uniqueAchievements[j];
    if (!uniqueAchievement.claimed && uniqueAchievement.condition()) {
      uniqueAchievement.claimed = true;
      coins += uniqueAchievement.reward;
      currencyDiv.innerText = "Coins: " + coins.toFixed(2);
      messageDiv.innerText = "You claimed the achievement: " + uniqueAchievement.name + "! You earned " + uniqueAchievement.reward.toFixed(2) + " coins.";
      updateAchievements();
    }
  }
}

// Example achievement conditions
function has10Bathrooms() {
  return ownedBathrooms.length >= 10;
}

function has20Bathrooms() {
  return ownedBathrooms.length >= 20;
}

function has10000Coins() {
  return coins >= 10000;
}

function has10PlusBathrooms() {
  return ownedBathrooms.length >= 10;
}

// Call the updateAchievements function after updating the sidebar
updateAchievements();

// Call the checkAchievements function whenever necessary to check for achievements
checkAchievements();
