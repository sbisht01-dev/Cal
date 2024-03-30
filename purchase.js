// Function to download JSON data as a file
function downloadJSONData(data, filename) {
  // Create a Blob object containing the JSON data
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  // Create a temporary anchor element
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);

  // Set the filename for the downloaded file
  anchor.download = filename;

  // Append the anchor to the document body and simulate a click to trigger the download
  document.body.appendChild(anchor);
  anchor.click();

  // Remove the anchor from the document body
  document.body.removeChild(anchor);
}

// Function to parse each line for the new format and extract relevant information
function parseLineNewFormat(line) {
  const parts = line.match(/\S+/g); // Split by non-space characters

  if (!parts) {
    return {}; // Return empty object if line is empty
  }

  const SrNo = parts[0];
  const URN = parts[1];
  const JournalDate = parts[2];
  const PurchaseDate = parts[3];
  const ExpiryDate = parts[4];

  // Join the purchaser name, which may contain multiple words
  const PurchaserName = parts.slice(5, -6).join(" ");

  const Prefix = parts[parts.length - 6];
  const BondNumber = parts[parts.length - 5];
  const Denominations = parts[parts.length - 4];
  const IssueBranchCode = parts[parts.length - 3];
  const IssueTeller = parts[parts.length - 2];
  const Status = parts[parts.length - 1];

  return {
    SrNo,
    URN,
    JournalDate,
    PurchaseDate,
    ExpiryDate,
    PurchaserName,
    Prefix,
    BondNumber,
    Denominations,
    IssueBranchCode,
    IssueTeller,
    Status,
  };
}

// Function to process the file for the new format
function processFileForNewFormat(inputData) {
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

    parsedData.push(parseLineNewFormat(line));
  }

  // Download the parsed data as a JSON file
  downloadJSONData(parsedData, "parsed_data.json");
}

// Function to read input data from a JSON file for the new format using fetch
function readInputFromFileForNewFormat(filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => processFileForNewFormat(data))
    .catch((error) => console.error("Error:", error));
}

// Usage: Replace 'buyers.json' with your JSON file name or path
readInputFromFileForNewFormat("buyers.json");
