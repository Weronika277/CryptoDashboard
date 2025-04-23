const baseUrl = "https://rest.coincap.io/v3/assets";
const apiKey =
  "781d8e90a6691715aed02ee660381df62788628875f12fd0c0bd8bac6d5a6296";

const container = document.getElementById("cryptoContainer");
const searchInput = document.getElementById("searchInput");
const fetchBatchSize = 5;

let offset = 0;
let cryptos = [];

document.addEventListener("DOMContentLoaded", function () {
  const loadMoreButton = document.getElementById("loadMoreBtn");
  loadMoreButton.addEventListener("click", loadMore);
});

function handleInputChange(value) {
  const lowerCaseValue = value.toLowerCase();
  cryptos.forEach((crypto) => {
    const lowerCaseName = crypto.name.toLowerCase();
    const lowerCaseSymbol = crypto.symbol.toLowerCase();
    if (
      lowerCaseName.includes(lowerCaseValue) ||
      lowerCaseSymbol.includes(lowerCaseValue)
    ) {
      crypto.shouldBeDisplayed = true;
    } else {
      crypto.shouldBeDisplayed = false;
    }
  });

  displayCryptoData();
}

document
  .getElementById("searchInput")
  .addEventListener("input", function (event) {
    handleInputChange(event.target.value);
  });

document.getElementById("searchButton").addEventListener("click", function () {
  const inputValue = document.getElementById("searchInput").value;
  handleInputChange(inputValue);
});

window.onload = async function () {
  const cryptoJson = await fetchCrypto(fetchBatchSize, offset);
  populateCryptos(cryptoJson);
  displayCryptoData();
};

function populateCryptos(cryptoResponseJson) {
  cryptoResponseJson.data.forEach((crypto) => {
    cryptos.push({
      name: crypto.name,
      symbol: crypto.symbol,
      priceUsd: crypto.priceUsd,
      changePercent24Hr: crypto.changePercent24Hr,
      shouldBeDisplayed: true,
    });
  });
}

async function fetchCrypto(limit, offset) {
  const url = `${baseUrl}?limit=${limit}&offset=${offset}&apiKey=${apiKey}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

function clearCurrenciesBeforeDisplaying() {
  const dataRows = container.querySelectorAll(".box");
  dataRows.forEach((row) => row.remove());
}

function displayCryptoData() {
  clearCurrenciesBeforeDisplaying();
  cryptos.forEach((crypto) => {
    if (crypto.shouldBeDisplayed == true) {
      const box = document.createElement("div");
      box.classList.add("box");

      box.innerHTML = `
          <div class="data" id=data1>${crypto.name}</div>
          <div class="data" id=data2>${crypto.symbol}</div>
          <div class="data" id=data3>${parseFloat(crypto.priceUsd).toFixed(2)} $</div>
          <div class="data" id=data4 style="color: ${
            crypto.changePercent24Hr < 0
              ? "rgb(156, 27, 27)"
              : "rgb(106, 168, 111)"
          }">
              ${parseFloat(crypto.changePercent24Hr).toFixed(2)}%
          </div>`;

      container.appendChild(box);
    }
  });
}

async function loadMore() {
  offset += fetchBatchSize;
  const json = await fetchCrypto(fetchBatchSize, offset);
  populateCryptos(json);
  displayCryptoData();
}
