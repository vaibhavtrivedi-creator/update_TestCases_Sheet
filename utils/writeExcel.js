const ExcelJS = require('exceljs');

async function writeExcel(filePath, updates, sheetName = 'Sheet1') {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
    }

    const headerRow = worksheet.getRow(1);

    const findCol = (headerText) => {
        for (let i = 1; i <= headerRow.cellCount; i++) {
            const value = String(headerRow.getCell(i).value || '').trim().toLowerCase();
            if (value === headerText.toLowerCase()) return i;
        }
        return -1;
    };

    const actualCol = findCol('Actual Result');
    const qaCol = findCol('QA Result');

    if (actualCol === -1 || qaCol === -1) {
        throw new Error('Required columns not found: TC_ID / Actual Result / QA Result');
    }

    updates.forEach(update => {

        const row = worksheet.getRow(update.rowNumber);
        row.getCell(actualCol).value = update.actual_Result;
        row.getCell(qaCol).value = update.status;
        row.commit();

    });


    await workbook.xlsx.writeFile(filePath);
}

module.exports = writeExcel;
