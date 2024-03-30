// Function to parse each line for the second file and extract relevant information
function parseLineFile2(line) {
  const parts = line.match(/\S+/g); // Split by non-space characters

  // Check if 'parts' is not null before accessing its elements
  if (parts !== null) {
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
  } else {
    // Return default values if 'parts' is null
    return {
      SrNo: "",
      Date: "",
      Party: "",
      AccNo: "",
      Prefix: "",
      BondNo: "",
      Denominations: "",
      BranchCode: "",
      PayTeller: "",
    };
  }
}

// Function to process the second file
function processFileForSecondFile(inputData) {
  const lines = inputData.split("\n").filter((line) => line.trim() !== "");
  const parsedData = [];

  for (const line of lines) {
    parsedData.push(parseLineFile2(line));
  }

  // Convert parsedData to JSON string with indentation
  const jsonData = JSON.stringify(parsedData, null, 2);

  // Create a Blob object containing the JSON data
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Create a link element
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'parsedData.json';

  // Append the link to the document body and trigger a click event to download the file
  document.body.appendChild(a);
  a.click();

  // Remove the link from the document body
  document.body.removeChild(a);
}

// Function to read input data from a JSON file for the second file using fetch
function readInputFromFileForSecondFile(filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => processFileForSecondFile(data))
    .catch((error) => console.error("Error:", error));
}

// Usage: Replace 'Party.json' with your JSON file name or path
readInputFromFileForSecondFile("Party.json");
