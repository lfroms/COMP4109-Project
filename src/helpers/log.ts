import 'colors';

type Severity = 'info' | 'warning' | 'error';

interface Options {
  title?: string;
  severity?: Severity;
}

export default function log(text: string, options?: Options) {
  const date = `[${new Date().toISOString()}]`.dim;

  switch (options?.severity) {
    case 'error':
      if (options.title) {
        console.log(date, `${options.title}:`.bold, text.red);
        break;
      }

      console.log(date, text.red);
      break;

    case 'warning':
      if (options.title) {
        console.log(date, `${options.title}:`.bold, text.yellow);
        break;
      }

      console.log(date, text.yellow);
      break;

    default:
      if (options?.title) {
        console.log(date, `${options.title}:`.bold, text);
        break;
      }

      console.log(date, text);
      break;
  }
}
