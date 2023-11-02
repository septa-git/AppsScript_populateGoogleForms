//Populate Options on Google Forms From Google Sheets
function populateGoogleForms() {
  const GOOGLE_SHEET_NAMES = ["INVOICES", "RIDERS"];
  const GOOGLE_FORM_ID = "1bMW68CSi7xFdb6wMivUSCOOSYqvvMPe3gMYM1bqKCoU";

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const choices = {};

  GOOGLE_SHEET_NAMES.forEach(sheetName => {
    const [header, ...data] = ss
      .getSheetByName(sheetName)
      .getDataRange()
      .getDisplayValues();

    header.forEach((title, i) => {
      if (!choices[title]) {
        choices[title] = [];
      }
      choices[title] = choices[title].concat(data.map((d) => d[i]).filter((e) => e));
      if (choices[title].length === 0) {
        choices[title] = ["Option 1"]; // set default value if empty
      }
    });
  });

  // Add each 'Invoice' and 'Rider' to the choices
  const invoicesAndRiders = [
    "Invoice Bogor / Trans Retail Yasmin",
    "Invoice Buaran",
    "Invoice TR BSD",
    "Invoice TRI Bekasi Juanda",
    "Invoice TRI Central Park",
    "Invoice TRI Depok Dewi Sartika",
    "Invoice TRI Lebak Bulus",
    "Rider Bogor / Trans Retail Yasmin",
    "Rider Buaran",
    "Rider TR BSD",
    "Rider TRI Bekasi Juanda",
    "Rider TRI Central Park",
    "Rider TRI Depok Dewi Sartika",
    "Rider TRI Lebak Bulus"
  ];

  invoicesAndRiders.forEach(invoiceOrRider => {
    if (!choices[invoiceOrRider]) {
      choices[invoiceOrRider] = [invoiceOrRider];
    }
  });

  // Remove 'Driver' from the choices
  if (choices['Driver']) {
    delete choices['Driver'];
  }

  FormApp.openById(GOOGLE_FORM_ID)
    .getItems()
    .map((item) => ({
      item,
      values: choices[item.getTitle()],
    }))
    .filter(({ values }) => values)
    .forEach(({ item, values }) => {
      let uniqueValues = [...new Set(values)]; // Menghapus nilai duplikat
      switch (item.getType()) {
        case FormApp.ItemType.CHECKBOX:
          item.asCheckboxItem().setChoiceValues(uniqueValues);
          break;
        case FormApp.ItemType.LIST:
          item.asListItem().setChoiceValues(uniqueValues);
          break;
        case FormApp.ItemType.MULTIPLE_CHOICE:
          item.asMultipleChoiceItem().setChoiceValues(uniqueValues);
          break;
        default:
      }
    });
  ss.toast("Google Form Updated !!");
}
