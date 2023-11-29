import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@chakra-ui/react';

function FilePicker({ onFileSelect }) {
  const [selected, setSelected] = useState(null);
  const [pollRate] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const lastCachedContent = useRef(null);

  useEffect(() => {
    if (selected) {
      startWatching();
    }
    return () => stopWatching();
  }, [selected]);

  useEffect(() => {
    const cachedContent = localStorage.getItem('fileContent');

    if (cachedContent && cachedContent !== lastCachedContent.current) {
      onFileSelect(cachedContent);
      lastCachedContent.current = cachedContent;
    }
  }, [onFileSelect]);

  const accessFile = async () => {
    stopWatching();

    try {
      const [fileHandle] = await window.showOpenFilePicker();
      if (fileHandle) {
        const file = await fileHandle.getFile();
        if (!file) {
          console.log('Failed accessing file');
          return;
        }
        setSelected({ handle: fileHandle, file });
        readFile(file);
      } else {
        console.log('No file selected');
      }
    } catch (error) {
      console.error('Error accessing file:', error);
    }
  };

  const checkFile = async () => {
    if (!selected) return;

    try {
      const file = await selected.handle.getFile();
      if (file.lastModified > selected.file.lastModified) {
        console.log(selected.file.name, 'was updated');
        selected.file = file;
        readFile(file);
      } else {
        console.log(selected.file.name, 'had no changes');
      }
    } catch (error) {
      console.error('Error checking file:', error);
    }
  };

  const readFile = file => {
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target.result;
      localStorage.setItem('fileContent', content);
      onFileSelect(content);
    };
    reader.readAsText(file);
  };

  const startWatching = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    const newIntervalId = setInterval(() => checkFile(), pollRate * 500);
    setIntervalId(newIntervalId);
  };

  const stopWatching = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        _hover={{
          shadow: 'md',
          transform: 'translateY(-5px)',
          transitionDuration: '0.2s',
          transitionTimingFunction: 'ease-in-out',
        }}
        type="button"
        size="sm"
        px={12}
        className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-semibold"
        onClick={accessFile}
      >
        Local Path
      </Button>
      <Button
        _hover={{
          shadow: 'md',
          transform: 'translateY(-5px)',
          transitionDuration: '0.2s',
          transitionTimingFunction: 'ease-in-out',
        }}
        type="button"
        size="sm"
        px={12}
        className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-semibold"
        onClick={stopWatching}
      >
        Stop Watching
      </Button>
    </div>
  );
}

export default FilePicker;
