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



describe('parseJson', () => {
  test('returns expected object for valid JSON', () => {
    const jsonData = '{"users":[{"name":"Alice","age":30},{"name":"Bob","age":25}]}';
    const result = parseJson(jsonData);

    expect(result).toEqual({
      users: [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ]
    });
  });

  test('returns null for invalid JSON', () => {
    const badJson = '{"users":[{"name":"Alice""age":30}]}'; // missing comma
    const result = parseJson(badJson);

    expect(result).toBeNull();
  });

  test('returns null for non-JSON string', () => {
    const notJson = 'just a regular string';
    const result = parseJson(notJson);

    expect(result).toBeNull();
  });

  test('returns null for undefined input', () => {
    const result = parseJson(undefined);

    expect(result).toBeNull();
  });

  test('parses JSON with nested objects correctly', () => {
    const nestedJson = '{"config":{"theme":"dark","layout":{"header":true,"footer":false}}}';
    const result = parseJson(nestedJson);

    expect(result).toEqual({
      config: {
        theme: 'dark',
        layout: {
          header: true,
          footer: false
        }
      }
    });
  });
  test('parses JSON array correctly', () => {
    const jsonArray = '[1, 2, 3, 4]';
    const result = parseJson(jsonArray);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  test('parses stringified object with special characters', () => {
    const specialCharsJson = '{"message":"Hello, world! \\"Hi!\\" \\n New line."}';
    const result = parseJson(specialCharsJson);

    expect(result).toEqual({
      message: 'Hello, world! "Hi!" \n New line.'
    });
  });

  test('throws no error and returns null on malformed JSON', () => {
    const badJson = '{"a": [1, 2, {"b": }]}';
    const result = parseJson(badJson);
    expect(result).toBeNull();
  });

  test('returns null for empty string', () => {
    const result = parseJson('');
    expect(result).toBeNull();
  });

  test('returns null for non-string input (object)', () => {
    const result = parseJson({ key: 'value' }); // not a string
    expect(result).toBeNull();
  });
});


// test('parseTxt returns expected array of lines', () => {
//   const txtData = 'First line\nSecond line\nThird line';
//   const result = parseTxt(txtData);

//   expect(result).toEqual(['First line', 'Second line', 'Third line']);
// });

describe('parseXml', () => {
  test('returns expected object for valid XML', () => {
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
          { name: 'Alice', age: 30 },  // XML values are often strings by default
          { name: 'Bob', age: 25 }
        ]
      }
    });
  });

  test('parses XML with nested elements correctly', () => {
    const xmlData = `
      <config>
        <theme>dark</theme>
        <layout>
          <header>true</header>
          <footer>false</footer>
        </layout>
      </config>
    `;
    const result = parseXml(xmlData);

    expect(result).toEqual({
      config: {
        theme: 'dark',
        layout: {
          header: true,
          footer: false
        }
      }
    });
  });

  test('parses single element XML', () => {
    const xmlData = `<status>success</status>`;
    const result = parseXml(xmlData);

    expect(result).toEqual({ status: 'success' });
  });

  test('parses XML with attributes', () => {
    const xmlData = `
      <user id="1">
        <name>Alice</name>
        <age>30</age>
      </user>
    `;
    const result = parseXml(xmlData);

    expect(result).toEqual({
      user: {
        "@_id": '1',
        name: 'Alice',
        age: 30
      }
    });
  });

  test('handles XML with mixed content', () => {
    const xmlData = `
      <message>
        <text>Hello</text>
        <text>world!</text>
      </message>
    `;
    const result = parseXml(xmlData);

    expect(result).toEqual({
      message: {
        text: ['Hello', 'world!']
      }
    });
  });
});

