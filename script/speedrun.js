// Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheets spreadsheet ID
const spreadsheetId = '1XaG0-SngVMoOiRgGh-mPJLRZ9SOrPs_2ggHE08RP77Q';

// Replace 'YOUR_API_KEY' with your actual Google Sheets API key
const apiKey = 'AIzaSyCs3AUMMCfSsMaj3I6KSdyuoDAuV2e8LKE';

// Function to convert time in the format 'mm:ss' to seconds
function timeToSeconds(time) {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
}

// Function to fetch speedrun data from Google Sheets API
async function fetchSpeedrunData(category) {
  try {
    // Fetch categories and check if the selected category should be ignored
    const categories = await fetchCategories();
    const selectedCategory = categories.find(cat => cat === category);
    if (selectedCategory.startsWith('!Ignore')) {
      return;
    }

    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${category}!A:C?key=${apiKey}`
    );

    const data = response.data.values;

    // Clear the existing speedrun list
    const speedrunList = document.querySelector('.speedrun-list');
    speedrunList.innerHTML = '';

    // Determine the correct header based on the category
    let headerText = 'Player -   Time - Runs';
    if (category === 'Mimic Colors') {
      headerText = 'Players - Rounds - Runs';
    }

    // Add the header as the first item in the list
    const headerItem = document.createElement('li');
    headerItem.textContent = headerText;
    speedrunList.appendChild(headerItem);

    // Sort the speedrun data by time or score (depending on the category)
    let sortedData = data.slice(0); // Include all rows for sorting
    if (category === 'Mimic Colors') {
      sortedData.sort((a, b) => Number(b[2]) - Number(a[2])); // Sort by highest score (column C)
    } else {
      sortedData.sort((a, b) => timeToSeconds(a[1]) - timeToSeconds(b[1])); // Sort by lowest time (column B)
    }

    // Iterate over the sorted speedrun data and create list items
    let rank = 1;
    for (let i = 0; i < sortedData.length; i++) {
      const [player, time, link] = sortedData[i];

      // Check if the row starts with '!Ignore', if yes, skip this row
      if (player.startsWith('!Ignore')) {
        continue;
      }

      const listItem = document.createElement('li');
      listItem.textContent = `${rank}. ${player} - ${time}`;
      speedrunList.appendChild(listItem);

      // Set different colors for the first three items (Gold, Silver, Bronze)
      if (rank === 1) {
        listItem.style.color = 'gold';
      } else if (rank === 2) {
        listItem.style.color = 'silver';
      } else if (rank === 3) {
        listItem.style.color = '#cd7f32'; // Bronze color
      }

      // Check if there's a link and add the 'View Run' link
      if (link) {
        const runLink = document.createElement('a');
        runLink.textContent = 'View Run';
        runLink.href = link;
        runLink.target = '_blank'; // To open the link in a new tab
        runLink.style.color = 'yellow'; // Change the link text color to yellow
        runLink.style.textDecoration = 'underline'; // Underline the link
        listItem.appendChild(document.createTextNode(' ')); // Add some space between player and link
        listItem.appendChild(runLink);
      }

      rank++;
    }
  } catch (error) {
    console.error('Error fetching speedrun data:', error);
  }
}

// Helper function to fetch categories from Google Sheets API
async function fetchCategories() {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title&key=${apiKey}`
    );

    const categories = response.data.sheets.map(sheet => sheet.properties.title);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Function to populate the category select dropdown
async function populateCategoryDropdown() {
  try {
    const categories = await fetchCategories();
    const categorySelect = document.getElementById('category-select');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating category dropdown:', error);
  }
}

// Function to handle category selection
function handleCategorySelection() {
  const categorySelect = document.getElementById('category-select');
  const selectedCategory = categorySelect.value;
  fetchSpeedrunData(selectedCategory);
}

document.addEventListener('DOMContentLoaded', async () => {
  populateCategoryDropdown();

  const categorySelect = document.getElementById('category-select');
  categorySelect.addEventListener('change', handleCategorySelection);

  // Call the fetchSpeedrunData function with the initial category selection
  fetchSpeedrunData('Code Red'); // Replace 'Code Red' with the initial category name
});
