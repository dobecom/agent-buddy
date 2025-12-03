import { ConsoleLogger, Inject, Injectable, LogLevel } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { appConfig } from '../configs';

@Injectable()
export class Logger extends ConsoleLogger {
  constructor(
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {
    super();
    super.setLogLevels([config.logLevel as LogLevel]);
  }

  msg(title: string, message: string[], context?: string): void {
    super.log(
      '\n' +
        (title ? '----------------------------------------------------------------\n' + `## ${title}\n` : '') +
        '----------------------------------------------------------------\n' +
        message.join('\n') +
        '\n----------------------------------------------------------------',
      context,
    );
  }
}
