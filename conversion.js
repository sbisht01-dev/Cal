// Function to parse each line and extract relevant information
function parseLine(line) {
  const parts = line.match(/\S+/g); // Split by non-space characters
  const SrNo = parts[0];
  const Date = parts[1];

  // Find the end index of the party name
  let partyEndIndex = 2;
  for (let i = 2; i < parts.length; i++) {
    if (parts[i].includes("*")) {
      partyEndIndex = i;
      break;
    }
  }

  const Party = parts.slice(2, partyEndIndex).join(" "); // Join party name without the last element
  const AccNo = parts[partyEndIndex].replace(/\*/g, ""); // Account number without asterisks
  const prefixIndex = partyEndIndex + 1; // Prefix starts after the account number
  const Prefix = parts[prefixIndex];

  // Bond number is immediately after prefix
  const BondNo = parts[prefixIndex + 1];

  // Denominations are immediately after bond number
  const Denominations = parts[prefixIndex + 2];

  // Branch code is immediately after denominations
  const BranchCode = parts[prefixIndex + 3];

  // Pay Teller is immediately after branch code
  const PayTeller = parts[prefixIndex + 4];

  return {
    SrNo,
    Date,
    Party,
    AccNo,
    Prefix,
    BondNo,
    Denominations,
    BranchCode,
    PayTeller, // Include Pay Teller field
  };
}

// Function to process the file
function processFile(inputData) {
  const lines = inputData.split("\n").filter((line) => line.trim() !== "");
  const parsedData = [];
  let skipNextLine = false; // Flag to skip the next line after encountering a page number line

  for (const line of lines) {
    if (line.match(/^Page \d+ of \d+$/)) {
      skipNextLine = true; // Set flag to true if it's a page number line
      continue;
    }

    if (skipNextLine) {
      skipNextLine = false; // Skip the next line if the flag is true
      continue;
    }

    parsedData.push(parseLine(line));
  }

  // console.log(parsedData);
}

// Function to read input data from a JSON file using fetch
function readInputFromFile(filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => processFile(data))
    .catch((error) => console.error("Error:", error));
}

// Usage: Replace 'input.json' with your JSON file name or path
readInputFromFile("280.json");

//
