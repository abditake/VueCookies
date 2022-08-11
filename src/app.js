// generates a random number, given a min and max number
function randomNumber(min, max) {
  // (next line) was grabbed from MDN documentation
  return Math.random() * (max - min + 1) + min;
}
// create window into DOM
let tableElem = document.getElementById('city-schedule');

// EVENT HANDLING STEP ONE >>> get user-submitted form, from the DOM
let userSubmittedForm = document.getElementById('add-city');

// holds values from Store objects
let storeValues = [];

// object constructor for making stores
function Store(city, minCust, maxCust, avgCook) {
  this.cityName = city;
  this.minCustomersPerHour = minCust;
  this.maxCustomersPerHour = maxCust;
  this.avgCookiesPerSale = avgCook;
  this.cookiesForGivenHour = [];
  this.totalCookies = 0;

  storeValues.push(this);
}

// function to render header row to HTML page
function renderHeaderRow() {
  // create a row
  let headerRow = document.createElement('tr');
  // add to DOM
  tableElem.appendChild(headerRow);

  // create empty top-left cell
  let topLeftEmptyCell = document.createElement('th');
  // no context needed
  // add to DOM
  headerRow.appendChild(topLeftEmptyCell);

  // array for holding each header
  let hourOfTheDay = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', 'Daily Location Total'];
  // render each header
  for (let i = 0; i < hourOfTheDay.length; i++) {
    // create header
    let headers = document.createElement('th');
    // add context
    headers.innerText = `${hourOfTheDay[i]}`;
    // add to DOM
    headerRow.appendChild(headers);
  }
}

// method to calculate cookies needed for each hour, given customer guesstimate
Store.prototype.calculateCookieSchedule = function () {
  for (let i = 0; i < 14; i++) {
    let tempRandomNum = Math.floor(randomNumber(this.minCustomersPerHour, this.maxCustomersPerHour));
    this.cookiesForGivenHour[i] = Math.floor(tempRandomNum * this.avgCookiesPerSale);
    this.totalCookies = this.totalCookies + this.cookiesForGivenHour[i];
  }
};

// method for rendering one row to the table, that contains cookie guesstimates
Store.prototype.renderStore = function () {

  // create a row
  let row = document.createElement('tr');
  // add to DOM
  tableElem.appendChild(row);

  // create td for city name
  let tdName = document.createElement('td');
  // add context
  tdName.innerText = `${this.cityName}`;
  // add to DOM
  row.appendChild(tdName);

  // render each td, which contains a cookie guesstimate
  for (let i = 0; i < this.cookiesForGivenHour.length; i++) {
    // create td
    let tdTag = document.createElement('td');
    // add context
    tdTag.innerText = `${this.cookiesForGivenHour[i]}`;
    // add to DOM
    row.appendChild(tdTag);
  }

  // create td, for daily cookie total
  let tdTagTotal = document.createElement('td');
  // add context
  tdTagTotal.innerText = `${this.totalCookies}`;
  // add to DOM
  row.appendChild(tdTagTotal);
};

// function for rendering footer ("Grandaddy of Totals") row
function renderFooterRow () {
  // create a row
  let row = document.createElement('tr');
  // add to DOM
  tableElem.appendChild(row);

  // create td that labels this row
  let tdTotals = document.createElement('td');
  // add context
  tdTotals.innerText = 'Totals';
  // add to DOM
  row.appendChild(tdTotals);

  // render each td, which contains hourly totals
  for (let i = 0; i < 14; i++) {
    let hourlyTotal = 0;
    for (let j = 0; j < storeValues.length; j++) {
      hourlyTotal += storeValues[j].cookiesForGivenHour[i];
    }
    // create td
    let tdTag = document.createElement('td');
    // add context
    tdTag.innerText = `${hourlyTotal}`;
    // add to DOM
    row.appendChild(tdTag);
  }

  // render the bottom-right "Grandaddy of Totals"
  let grandTotal = 0;
  for (let i = 0; i < storeValues.length; i++) {
    grandTotal += storeValues[i].totalCookies;
  }
  // create td
  let tdGrandaddy = document.createElement('td');
  // add context
  tdGrandaddy.innerText = `${grandTotal}`;
  // add to DOM
  row.appendChild(tdGrandaddy);
}

// creating an object for each store
new Store('Seattle', 23, 65, 6.3);
new Store('Tokyo', 3, 24, 1.2);
new Store('Dubai', 11, 38, 3.7);
new Store('Paris', 20, 38, 2.3);
new Store('Lima', 2, 16, 4.6);

function displayStores() {
  renderHeaderRow();
  for (let i = 0; i < storeValues.length; i++) {
    storeValues[i].calculateCookieSchedule();
    storeValues[i].renderStore();
  }
  renderFooterRow();
}

displayStores();

// EVENT HANDLING STEP 3 >>> define event handler function
function handleSubmit (event) {
  event.preventDefault();

  let cityName = event.target.cityName.value;
  let minCust = 1 * event.target.minCust.value;
  let maxCust = 1 * event.target.maxCust.value;
  let avgCook = 1 * event.target.avgCook.value;

  let newStore = new Store (cityName, minCust, maxCust, avgCook);

  let bottomRow = document.getElementById('city-schedule').rows.length - 1;
  document.getElementById('city-schedule').deleteRow(bottomRow);

  newStore.calculateCookieSchedule();
  newStore.renderStore();
  renderFooterRow();
}

// EVENT HANDLING STEP 2 >>> add event listener
userSubmittedForm.addEventListener('submit', handleSubmit);

