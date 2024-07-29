import { AfterTestSuite, BaseListener, ListenerContext, Logger, Runner } from '@codewave-ui/core';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import open from 'open';

export type StandardHTMLReporterConfig = {
  viewOnExit?: boolean;
};

export class StandardHTMLReporter extends BaseListener {
  private readonly viewOnExit;

  constructor(
    eventManager: never,
    logger: Logger,
    runner: Runner,
    config?: StandardHTMLReporterConfig,
  ) {
    super(eventManager, logger, runner);

    this.viewOnExit = config?.viewOnExit === undefined ? true : config.viewOnExit;
  }

  @AfterTestSuite
  public async ats(context: ListenerContext) {
    const template = await readFile(
      path.join('node_modules', '@codewave-ui/standard-html-reporter', 'dist', 'template.html'),
      { encoding: 'utf-8' },
    );
    const finalTemplate = template.replace(
      '// REPLACE DATA HERE',
      'const data = ' + JSON.stringify(context.runner),
    );

    let output = path.join(context.logFolder, 'report.html');
    await writeFile(output, finalTemplate);

    if (this.viewOnExit) {
      if (process.platform === 'win32') output = 'file:///' + output.replaceAll('\\', '/');
      await open(output, { wait: true });
    }
  }
}
