const fs = require('fs');
const path = require('path');
const { parseCsv, parseJson, parseTxt, parseXml } = require('../utils');


describe('parseCsv', () => {
  test('parseCsv returns expected data', () => {
    const csvData = 'name,age\nAlice,30\nBob,25';
    const result = parseCsv(csvData);

    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ]);
  });
  test('parses basic CSV with header', () => {
    const csvData = 'name,age\nAlice,30\nBob,25';
    const result = parseCsv(csvData);
    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ]);
  });

  // test('parses CSV with extra whitespace', () => {
  //   const csvData = ' name , age \n Alice , 30 \n Bob , 25 ';
  //   const result = parseCsv(csvData);
  //   expect(result).toEqual([
  //     { name: 'Alice', age: 30 },
  //     { name: 'Bob', age: 25 }
  //   ]);
  // });

  test('parses CSV with missing values', () => {
    const csvData = 'name,age\nAlice,\nBob,25';
    const result = parseCsv(csvData);
    expect(result).toEqual([
      { name: 'Alice', age: null },
      { name: 'Bob', age: 25 }
    ]);
  });

  test('parses CSV with quoted values', () => {
    const csvData = '"name","age"\n"Alice","30"\n"Bob","25"';
    const result = parseCsv(csvData);
    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ]);
  });

  test('parses CSV with commas in quotes', () => {
    const csvData = 'name,notes\n"Alice","Loves, hiking"\n"Bob","Plays, chess"';
    const result = parseCsv(csvData);
    expect(result).toEqual([
      { name: 'Alice', notes: 'Loves, hiking' },
      { name: 'Bob', notes: 'Plays, chess' }
    ]);
  });

  test('parses CSV with only header', () => {
    const csvData = 'name,age';
    const result = parseCsv(csvData);
    expect(result).toEqual([]);
  });

  test('returns empty array for empty input', () => {
    const csvData = '';
    const result = parseCsv(csvData);
    expect(result).toEqual([]);
  });

  test('parses large CSV dataset correctly', () => {
    const rows = Array.from({ length: 1000 }, (_, i) => `User${i},${20 + (i % 30)}`);
    const csvData = `name,age\n${rows.join('\n')}`;
    const result = parseCsv(csvData);

    expect(result.length).toBe(1000);
    expect(result[0]).toEqual({ name: 'User0', age: 20 });
    expect(result[999]).toEqual({ name: 'User999', age: 29 });
  });

  test('handles malformed CSV', () => {
    const csvData = 'name,age\nAlice,30\nBob\nCharlie,25,Extra';
    const result = parseCsv(csvData);

    expect(result[0]).toEqual({ name: 'Alice', age: 30 });
  });

  test('parses CSV file from disk', () => {
    const filePath = path.resolve(__dirname, 'fixtures/sample.scv');
    const csvData = fs.readFileSync(filePath, 'utf8');
    const result = parseCsv(csvData);
  
    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ]);
  });
});



test('parseJson returns expected object', () => {
  const jsonData = '{"users":[{"name":"Alice","age":30},{"name":"Bob","age":25}]}';
  const result = parseJson(jsonData);

  expect(result).toEqual({
    users: [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ]
  });
});

test('parseTxt returns expected array of lines', () => {
  const txtData = 'First line\nSecond line\nThird line';
  const result = parseTxt(txtData);

  expect(result).toEqual(['First line', 'Second line', 'Third line']);
});

test('parseXml returns expected object', () => {
  const xmlData = `
    <users>
      <user><name>Alice</name><age>30</age></user>
      <user><name>Bob</name><age>25</age></user>
    </users>
  `;
  const result = parseXml(xmlData);

  expect(result).toEqual({
    users: {
      user: [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ]
    }
  });
});
