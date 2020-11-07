const recipients = [
  //TODO: populate email(s)
  '???@gmail.com',
  '???@gmail.com',
];

//TODO: fill in your sheet Id
const sheetId = '???'
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`

function buildHtmlTable() {
  const soonExpiryNumDaysString = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("SoonExpiryNumDays").getCell(1,1).getValue();
  const soonExpiryNumDays = Number(soonExpiryNumDaysString);
  Logger.log(`soonExpiryNumDays: ${soonExpiryNumDays}`)
  if (isNaN(soonExpiryNumDays)) {
    const err = `Expected soonExpiryNumDays to be a number, value was: ${soonExpiryNumDaysString}`
    Logger.log(err)
    throw new Error(err)
  }
  
  var range = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("StockTable"); 
  
  const numRows = range.getNumRows()
  
  let htmlRows = []
  
  let today = new Date();
  let soon = new Date( Date.now() + soonExpiryNumDays * 24 * 60 * 60 * 1000)

  for (let row = 1; row <= numRows; row++) {
    const expiryCellValue = range.getCell(row, 2).getValue()
    const ignoreCellValue = range.getCell(row, 3).getValue()
    
    const mustIgnoreCell = ignoreCellValue && `${ignoreCellValue}`.trim().toLowerCase() === 'Ignore'.toLowerCase()
    
    if (!mustIgnoreCell && expiryCellValue && expiryCellValue.getTime) {
      if (expiryCellValue.getTime() < today.getTime()){
        const nameCellValue = range.getCell(row, 1).getValue()
        //Logger.log(`Expired (${expiryCellValue}): ${nameCellValue}`)
      
        htmlRows.push({
          name: `${nameCellValue}`,
          expiry: `${expiryCellValue.toDateString()}`,
          status: 'Expired',
        })
      } else if (expiryCellValue.getTime() < soon.getTime()) {
        const nameCellValue = range.getCell(row, 1).getValue()

        htmlRows.push({
          name: `${nameCellValue}`,
          expiry: `${expiryCellValue.toDateString()}`,
          status: 'Almost expired',
        })
      }
    }
  }
  
  Logger.log('htmlRows.length ' + htmlRows.length);
  Logger.log(JSON.stringify(htmlRows))
  
  return htmlRows
}

function emailExpiredStock() {
  const htmlRows = buildHtmlTable()  
  
  if (htmlRows.length > 0) {
    let htmlTable = ''

    htmlTable += '<table>'
    htmlTable += htmlRows.map(row => `<tr> <td>${row.name}</td> <td>${row.expiry}</td> <td>${row.status}</td> </tr>`).join('')
    htmlTable += `<tr><td colspan="20"> <a href="${sheetUrl}">Click to open sheet</a> </td> </tr>`
    htmlTable += '</table>'
    
    let htmlBody = '<div style="text-align:center;display: inline-block;font-family: arial,sans,sans-serif">'
    htmlBody += '<H1>'+ 'Fridge stock statuses ' +'</H1>';
    htmlBody += '<H2>'
    htmlBody += htmlTable;
    htmlBody += '</div>';
    
    const subject = `You have ${htmlRows.length} fridge items are expired or close to expiry`
    
    Logger.log(`Sending to recipients ${JSON.stringify(recipients)}`)
    recipients.forEach(recipient => {
      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        htmlBody: htmlBody,
      })
    })
  }
}