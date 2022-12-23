import React from 'react';
import { Spinner } from '@chakra-ui/react';

export default function LoadingHoverComponent(props) {
  const { fixed, text = 'Loading...' } = props;
  return (
    <div
      className={`${
        fixed ? 'fixed' : 'absolute'
      } z-[9999] right-0 top-[8%] left-[21%] bottom-0 overflow-hidden bg-transparent opacity-50 flex flex-col items-center justify-center`}
    >
      <Spinner color="blue.600" size="xl" thickness={5} />
      <h2 className="text-center text-black text-md mt-3">{text}</h2>
    </div>
  );
}
