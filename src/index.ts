import chalk from 'chalk';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
interface Options {
  exportType: 'all' | 'named';
  language: 'ts' | 'js';
}

program
  .option('-l, --language <language>', 'Source language: Javascript (js) or Typescript (ts)?', 'ts')
  .option('-e, --export-type <exportType>', 'Export type: all (*) or named', 'named')
  .command('update <directory>')
  .action((directory: string) => {
    const { exportType, language } = program.opts<Options>();
    console.log(exportType, language);
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
        if (exportType === 'all') {
          exportedValue = '*';
        } else {
          exportedValue = `{${name}}`;
        }
        return `export ${exportedValue} from './${name}';`;
      })
      .join('\n\n')
      + '\n';

    let extension: string;
    switch (language?.toLowerCase()) {
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
