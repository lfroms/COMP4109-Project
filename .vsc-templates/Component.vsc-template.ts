export function Template(_path: string, _templatePath: string) {
  return {
    userInputs: [
      {
        title: "Enter the component's name.",
        argumentName: 'name',
        defaultValue: 'Component',
      },
    ],
    template: [
      {
        type: 'folder',
        name: (inputs: any) => inputs.name,
        children: [
          {
            type: 'file',
            name: (inputs: any) => `${inputs.name}.tsx`,
            content: (inputs: any) => createReactFile(inputs.name),
          },
          {
            type: 'file',
            name: (_: any) => 'index.ts',
            content: (inputs: any) => createIndexFile(inputs.name),
          },
          {
            type: 'file',
            name: (inputs: any) => `${inputs.name}.module.scss`,
            content: (_: any) => '',
          },
        ],
      },
    ],
  };
}

function createReactFile(componentName: string) {
  return `import React from 'react';

import styles from './${componentName}.module.scss';

export default function ${componentName}() {
  return null;
}
`;
}

function createIndexFile(componentName: string) {
  return `export { default as ${componentName} } from './${componentName}';
`;
}
