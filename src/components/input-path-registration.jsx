import React, { useState } from 'react';

function InputPathRegistration() {
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = async event => {
    const file = event.target.files[0];

    if (file) {
      try {
        const content = await readFileAsync(file);
        setFileContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const readFileAsync = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        resolve(event.target.result);
      };

      reader.onerror = error => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {fileContent && <div>File Content: {fileContent}</div>}
    </div>
  );
}

export default InputPathRegistration;
