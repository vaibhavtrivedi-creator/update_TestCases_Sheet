const ExcelJs = require('exceljs');

async function readExcel(filePath) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1'); // Get the first sheet
    const testCases = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const testCase = {
            rowNumber: rowNumber,
            tc_ID: row.getCell(1).value,
            module: row.getCell(2).value,
            test_Scenarios: row.getCell(3).value,
            priority: row.getCell(4).value,
            pre_Condition: row.getCell(5).value,
            testcase: row.getCell(6).value,
            test_Steps: row.getCell(7).value,
            test_Data: row.getCell(8).value,
            expected_Result: row.getCell(9).value,
            actual_Result: row.getCell(10).value,
            status: row.getCell(11).value


        };
        testCases.push(testCase);
    });
    return testCases;
}
module.exports = readExcel;