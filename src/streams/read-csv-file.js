import fs from 'node:fs'
import { parse } from 'csv-parse'

//Ver como fazer p ele ler dados de um csv

function readCSVFile() {
  const csvFilePath = 'tasks.csv';

  const readableStream = fs.createReadStream(csvFilePath);

  const parser = parse({
    from_line: 2,
    delimiter: ',',
    skip_empty_lines: true
  });

  readableStream.pipe(parser);


  parser.on('data', async (line) => {

    //console.log(line);
    //console.log('handling data');
    const data = {
      title: line[0],
      description: line[1]
    }
    //console.log(data)

    const response = await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

  });




  parser.on('end', () => {

    console.log('cabou-se o csv')
  })
}
readCSVFile()