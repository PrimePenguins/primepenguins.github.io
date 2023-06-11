// Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheets spreadsheet ID
const spreadsheetId = '1XaG0-SngVMoOiRgGh-mPJLRZ9SOrPs_2ggHE08RP77Q';

// Replace 'YOUR_API_KEY' with your actual Google Sheets API key
const apiKey = 'AIzaSyCs3AUMMCfSsMaj3I6KSdyuoDAuV2e8LKE';

// Function to fetch speedrun data from Google Sheets API
async function fetchSpeedrunData(category) {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${category}!A:B?key=${apiKey}`
    );

    const data = response.data.values;

    // Clear the existing speedrun list
    const speedrunList = document.querySelector('.speedrun-list');
    speedrunList.innerHTML = '';

    // Iterate over the speedrun data and create list items
    for (const row of data) {
      const listItem = document.createElement('li');
      listItem.textContent = `${row[0]} - ${row[1]}`;
      speedrunList.appendChild(listItem);
    }
  } catch (error) {
    console.error('Error fetching speedrun data:', error);
  }
}

// Function to handle category selection
function handleCategorySelection() {
  const categorySelect = document.querySelector('#category-select');
  const selectedCategory = categorySelect.value;

  // Fetch speedrun data for the selected category (tab name)
  fetchSpeedrunData(selectedCategory);
}

// Call the fetchSpeedrunData function with the initial category selection
fetchSpeedrunData('Code Red'); // Replace 'CATEGORY_1' with the initial category name

// Add event listener to the category select dropdown
const categorySelect = document.querySelector('#category-select');
categorySelect.addEventListener('change', handleCategorySelection);
