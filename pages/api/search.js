import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export default function handler(req, res) {
  const { a, b } = req.query;
  
  if (!a || !b) {
    return res.status(400).json({ error: 'Missing parameters a or b' });
  }

  const results = [];
  const filePath = path.join(process.cwd(), 'components/Python_code/output.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      if (data.a === a && data.b === b) {
        results.push(data);
      }
    })
    .on('end', () => {
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ error: 'No matching records found' });
      }
    });
}
