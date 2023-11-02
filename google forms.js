//Google Form - Using Apps Script to Populate Google Sheet
function onFormSubmit(event) {
  var record_array = [];

  var form = FormApp.openById('1bMW68CSi7xFdb6wMivUSCOOSYqvvMPe3gMYM1bqKCoU'); // Form ID
  var formResponses = form.getResponses();
  var formCount = formResponses.length;

  var formResponse = formResponses[formCount - 1];
  var itemResponses = formResponse.getItemResponses();

  for (var j = 0; j < itemResponses.length; j++) {
    var itemResponse = itemResponses[j];
    var title = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();

    Logger.log(title);
    Logger.log(answer);

    // Jika jawaban adalah array (misalnya dari checkbox), gabungkan menjadi string
    if (Array.isArray(answer)) {
      answer = answer.join(", ");
    }
    // Jika respons adalah tipe file upload, ubah ID menjadi URL
    if (itemResponse.getItem().getType() === FormApp.ItemType.FILE_UPLOAD) {
      answer = "https://drive.google.com/open?id=" + answer;
    }
    record_array.push(answer);
  }
  AddRecord(record_array);
}

function AddRecord(record_array) {
  var url = 'https://docs.google.com/spreadsheets/d/1PDD1G0Ef2xNVni-XMoxr-J7s5LAsZKcOkCbn9KIfUpI/edit#gid=766570919';   //URL OF GOOGLE SHEET;
  var ss= SpreadsheetApp.openByUrl(url);
  var dataSheet = ss.getSheetByName("OUTPUT_GFORM");
  
  // Menambahkan tanggal dan waktu saat ini ke array
  record_array.push(new Date());
  
  // Menambahkan baris baru ke lembar data dengan semua nilai input pengguna
  dataSheet.appendRow(record_array);
}
