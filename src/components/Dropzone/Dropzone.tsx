import React from 'react';
import { default as ReactDropzone } from 'react-dropzone';
import classNames from 'classnames';

import styles from './Dropzone.module.scss';

interface Props {
  currentFile?: File;
  onAcceptFile: (file: File) => void;
}

export default function Dropzone({ currentFile, onAcceptFile }: Props) {
  return (
    <ReactDropzone
      onDrop={acceptedFiles => onAcceptFile(acceptedFiles[0])}
      maxFiles={1}
      accept=".pem"
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className={classNames(styles.Dropzone, isDragActive && styles.active)}
        >
          <input {...getInputProps()} />
          <svg viewBox="0 0 38 38" width="38" height="38" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m511 472c10.49341 0 19 8.50659 19 19s-8.50659 19-19 19-19-8.50659-19-19 8.50659-19 19-19zm.034665 11.375035c-.234375 0-.433593.082031-.597655.246093l-6.820296 6.820296c-.164062.164063-.246093.36328-.246093.597655s.082031.433593.246093.597655l.773436.773436c.164062.187499.36328.275389.597654.263671.234375-.011719.433593-.099609.597655-.263671l4.042959-4.21874v10.089819c0 .234375.082031.433593.246093.597655.164063.164062.363281.246093.597655.246093h1.124998c.234374 0 .433592-.082031.597654-.246093.164063-.164062.246094-.36328.246094-.597655v-10.089819l4.042959 4.21874c.164062.164062.36328.251952.597655.263671.234374.011718.433592-.076172.597654-.263671l.773436-.773436c.164062-.164062.246093-.36328.246093-.597655s-.082031-.433592-.246093-.597655l-6.820296-6.820296c-.164062-.164062-.36328-.246093-.597655-.246093z"
              fill="#c4cdd5"
              fillRule="evenodd"
              transform="translate(-492 -472)"
            />
          </svg>

          <span className={styles.Text}>{currentFile ? currentFile.name : 'Drop private key'}</span>
        </div>
      )}
    </ReactDropzone>
  );
}
