// Function to fetch and parse JSON data from a file
async function fetchAndParseJSON(filePath) {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: Failed to fetch data");
    throw error;
  }
}

// Function to match bond buyers with party names
async function matchBondBuyers(partyName) {
  try {
    // Fetch party data
    const partyData = await fetchAndParseJSON("party.json");

    // Filter party data for the specified party name
    const partyMatches = partyData.filter((item) => item.Party === partyName);

    // Fetch bond buyers data
    const bondBuyersData = await fetchAndParseJSON("bondbuyers.json");

    // Match bond buyers with party matches based on bond numbers
    const matchedBuyers = partyMatches.map((party) => {
      const bondNumber = party.BondNo;
      const matchedBuyer = bondBuyersData.find(
        (buyer) => buyer.BondNumber === bondNumber
      );
      return {
        PurchaserName: matchedBuyer.PurchaserName,
        Denominations: matchedBuyer.Denominations,
        PurchaseDate: matchedBuyer.PurchaseDate,
      };
    });

    return matchedBuyers;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Example usage
const partyName = "BHARATIYA JANATA PARTY";
matchBondBuyers(partyName)
  .then((matchedBuyers) => {
    console.log("Matched buyers:", matchedBuyers);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
