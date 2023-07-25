
// Sheet ID: 1XaG0-SngVMoOiRgGh-mPJLRZ9SOrPs_2ggHE08RP77Q
// API: AIzaSyCc8SQRJ1imr2vAjhRxuoF9VHOVE6rNRmU

// Replace 'YOUR_API_KEY' with your actual API key.
const apiKey = 'AIzaSyCc8SQRJ1imr2vAjhRxuoF9VHOVE6rNRmU';

// Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheets spreadsheet ID.
const spreadsheetId = '1XaG0-SngVMoOiRgGh-mPJLRZ9SOrPs_2ggHE08RP77Q';

// Function to fetch categories from Google Sheets API
async function fetchCategories() {
  try {
    const range = 'Speedrun!A2:A'; // Replace 'Speedrun' with your sheet name and 'A2:A' with the range containing the categories.
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const categories = response.result.values.map(row => row[0]);
    return categories;
  } catch (error) {
    console.error('Error fetching categories from Google Sheets:', error);
    return [];
  }
}

// Function to fetch data from Google Sheets API based on the selected category
async function fetchDataFromSheet(selectedCategory) {
  try {
    const range = `${selectedCategory}!A2:B`; // Use the selected category as the sheet name and 'A2:B' as the desired range.
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const allData = response.result.values;
    return allData;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}

// Function to render the leaderboard data
function renderLeaderboard(leaderboardData) {
  const leaderboard = document.getElementById('leaderboard');

  // Clear any existing content in the leaderboard
  leaderboard.innerHTML = '';

  // Create a table to display the leaderboard
  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Time</th>
    </tr>
  `;

  // Loop through the data and create table rows for each entry
  leaderboardData.forEach((entry, index) => {
    const [rank, name, time] = entry;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${rank}</td>
      <td>${name}</td>
      <td>${time}</td>
    `;
    row.addEventListener('mouseover', () => showRunInfoOverlay(row));
    row.addEventListener('mouseout', hideRunInfoOverlay);
    table.appendChild(row);
  });

  // Append the table to the leaderboard element
  leaderboard.appendChild(table);
}

// Function to show the overlay for each name and run time
function showRunInfoOverlay(row) {
  const overlay = document.createElement('div');
  overlay.className = 'run-info-overlay';
  const name = row.cells[1].innerText;
  const time = row.cells[2].innerText;
  overlay.innerHTML = `
    <h3>${name}</h3>
    <p>${time}</p>
  `;
  row.appendChild(overlay);
}

// Function to hide the overlay
function hideRunInfoOverlay(event) {
  const overlay = event.currentTarget.querySelector('.run-info-overlay');
  overlay.remove();
}

// Function to handle category selection
async function handleCategorySelection(event) {
  const selectedCategory = event.target.value;
  const leaderboardData = await fetchDataFromSheet(selectedCategory);
  renderLeaderboard(leaderboardData);
}

// Initialize the Google Sheets API
function initGoogleSheetsAPI() {
  gapi.client.init({
    apiKey,
  });
  gapi.client.load('sheets', 'v4').then(() => {
    // Fetch categories and render them in the dropdown menu
    fetchCategories().then(categories => {
      const categoryList = document.getElementById('categoryList');
      categories.forEach(category => {
        const option = document.createElement('option');
        option.textContent = category;
        categoryList.appendChild(option);
      });

      // Fetch data and render the leaderboard with the default category
      fetchDataFromSheet(categories[0]).then(data => {
        renderLeaderboard(data);
      });
    });
  });
}

// Initialize the page
function initPage() {
  const categoryList = document.getElementById('categoryList');
  categoryList.addEventListener('change', handleCategorySelection);

  // Load the Google Sheets API client
  gapi.load('client', initGoogleSheetsAPI);
}

initPage();
