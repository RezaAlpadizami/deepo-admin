import { Flex, Text } from '@chakra-ui/react';
import * as React from 'react';

function Contents(props, { index, ...rest }) {
  const { warehouseName, bay, level, rack, qtyJourney, dataApi } = props;
  return (
    <Flex height="100%" rounded="md" width="100%" {...rest} position="relative" margin="0 0 2.5rem 2.2rem">
      <div className="flex flex-col text-left gap-y-4">
        <h2 className="text-gray-400">Warehouse</h2>
        <div className="flex relative font-bold">
          <h3>{warehouseName}</h3>
          <p className="font-bold absolute right-0">{dataApi.qty}</p>
        </div>
        <div className="flex gap-x-5">
          <div className="flex flex-col items-center gap-y-2">
            <h4 className="text-gray-400">Rack</h4>
            <div className="px-6 py-1 rounded-full font-bold bg-[#FFF5EB] outline outline-offset-2 outline-[#FFF5EB]">
              <Text>{rack}</Text>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <h4 className="text-gray-400">Bay</h4>
            <div className="px-6 py-1 rounded-full font-bold bg-[#DEEDF0] outline outline-offset-2 outline-[#DEEDF0]">
              <Text>{bay}</Text>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <h4 className="text-gray-400">Level</h4>
            <div className="px-6 py-1 rounded-full font-bold bg-[#F4C7AB] outline outline-offset-2 outline-[#F4C7AB]">
              <Text>{level}</Text>
            </div>
          </div>
          <p className="font-bold ml-[17rem] mt-11">{qtyJourney}</p>
        </div>
      </div>
    </Flex>
  );
}

export default Contents;
