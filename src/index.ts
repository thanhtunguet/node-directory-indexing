import chalk from 'chalk';
import program from 'commander';
import * as fs from 'fs';
import * as path from 'path';

program
  .command('update <directory>')
  .option('--language, -l <language>', 'Source language: Javascript (js) or Typescript (ts)?', 'ts')
  .option('--export-type, -e <exportType>', 'Export type: all (*) or named', 'all')
  .action((directory: string) => {
    const content: string = fs
      .readdirSync(directory)
      .map((entry: string) => {
        return entry.replace(/\.[jt]sx?$/, '');
      })
      .filter((entry: string) => {
        return entry !== 'index';
      })
      .map((name: string) => {
        let exportedValue: string;
        if (program.exportType === 'all') {
          exportedValue = '*';
        } else {
          exportedValue = `{${name}}`;
        }
        return `export ${exportedValue} from './${name}';`;
      })
      .join('\n\n')
      + '\n';

    let extension: string;
    switch (program.language?.toLowerCase()) {
      case 'javascript':
      case 'js':
        extension = 'js';
        break;

      case 'ts':
      case 'typescript':
      default:
        extension = 'ts';
        break;
    }

    fs.writeFileSync(path.join(directory, `index.${extension}`), content);
    console.log(chalk.green('Indexing directory %s success!'), directory);
  });

program.parse(process.argv);
