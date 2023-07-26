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

    // Determine the correct header based on the category
    let headerText = 'Player - Time';
    if (category === 'Mimic Colors') {
      headerText = 'Players - Rounds';
    }

    // Add the header as the first item in the list
    const headerItem = document.createElement('li');
    headerItem.textContent = headerText;
    speedrunList.appendChild(headerItem);

    // Iterate over the speedrun data and create list items
    for (let i = 0; i < data.length; i++) {
      const [player, time] = data[i];
      const listItem = document.createElement('li');
      listItem.textContent = `${i + 1}. ${player} - ${time}`;
      speedrunList.appendChild(listItem);

      // Set different colors for the first three items (Gold, Silver, Bronze)
      if (i === 0) {
        listItem.style.color = 'gold';
      } else if (i === 1) {
        listItem.style.color = 'silver';
      } else if (i === 2) {
        listItem.style.color = '#cd7f32'; // Bronze color
      }
    }
  } catch (error) {
    console.error('Error fetching speedrun data:', error);
  }
}

// Function to fetch categories from Google Sheets API
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
function populateCategoryDropdown(categories) {
  const categorySelect = document.getElementById('category-select');
  categories.forEach(category => {
    const option = document.createElement('option');
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Function to handle category selection
function handleCategorySelection() {
  const categorySelect = document.getElementById('category-select');
  const selectedCategory = categorySelect.value;

  // Fetch speedrun data for the selected category (tab name)
  fetchSpeedrunData(selectedCategory);
}

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch categories and populate the category select dropdown
  const categories = await fetchCategories();
  populateCategoryDropdown(categories);

  // Add event listener to the category select dropdown
  const categorySelect = document.getElementById('category-select');
  categorySelect.addEventListener('change', handleCategorySelection);

  // Call the fetchSpeedrunData function with the initial category selection
  fetchSpeedrunData('Code Red'); // Replace 'Code Red' with the initial category name
});
