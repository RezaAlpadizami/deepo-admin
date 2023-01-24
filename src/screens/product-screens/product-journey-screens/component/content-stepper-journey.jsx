import { Flex, Text } from '@chakra-ui/react';
import * as React from 'react';

function Contents(props, { index, ...rest }) {
  const { warehouseName, bay, level, rack, qtyJourney, dataApi } = props;
  return (
    <Flex height="100%" rounded="md" width="100%" {...rest} position="relative" margin="0 0 1rem 2rem">
      <div className="flex flex-col text-left gap-y-3">
        <h2 className="text-gray-400 text-xl max-[640px]:text-xs">Warehouse</h2>
        <div className="flex relative font-bold">
          <h3 className="text-[16px] max-[640px]:text-xs">{warehouseName}</h3>
          <p className="font-bold absolute right-0 text-sm max-[640px]:block max-[640px]:text-xs">{dataApi.qty}</p>
        </div>
        <div className="flex gap-x-5">
          <div className="flex flex-col items-center gap-y-2 text-sm max-[640px]:text-xs">
            <h4 className="text-gray-400 font-bold">Rack</h4>
            <div className="px-6 py-1 rounded-full font-bold bg-[#FFF5EB] outline outline-offset-2 outline-[#FFF5EB]">
              <Text>{rack}</Text>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2 text-sm max-[640px]:text-xs">
            <h4 className="text-gray-400 font-bold">Bay</h4>
            <div className="px-6 py-1 rounded-full font-bold bg-[#DEEDF0] outline outline-offset-2 outline-[#DEEDF0]">
              <Text>{bay}</Text>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2 text-sm max-[640px]:text-xs">
            <h4 className="text-gray-400 font-bold">Level</h4>
            <div className="px-6 py-1 rounded-full font-bold bg-[#F4C7AB] outline outline-offset-2 outline-[#F4C7AB]">
              <Text>{level}</Text>
            </div>
          </div>
          <span className="font-bold ml-[17rem] mt-6 text-sm max-[640px]:ml-8 max-[640px]:text-xs">{qtyJourney}</span>
        </div>
      </div>
    </Flex>
  );
}

export default Contents;
