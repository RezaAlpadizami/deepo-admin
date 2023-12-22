import React, { useRef } from 'react';
import Moment from 'moment';
import { ShoppingCartIcon, ArchiveIcon } from '@heroicons/react/outline';
import RightLeftIcon from '../assets/images/right-left-arrow.svg';
import LeftRightIcon from '../assets/images/left-right-arrow.svg';

function ProgressStepBar(props) {
  const { activity, date, requestNumber, index, dataApi, qty } = props;

  const content = useRef(null);

  return (
    <div className="flex flex-col">
      <div className="p-4 w-full flex flex-col items-center border-none outline-none transition-colors duration-200 ease-in">
        <div className="flex">
          <div className="h-10 w-10 relative">
            <div className="rounded-full bg-white h-full border-2 border-[#3F73EB] grid place-content-center">
              {activity?.toLowerCase() === 'inbound' ? (
                <ArchiveIcon className="h-5 stroke-[#3F73EB]" />
              ) : activity?.toLowerCase() === 'relocate - in' ? (
                <img className="h-5" style={{ transform: 'scaleX(-1)' }} alt="right" src={LeftRightIcon} />
              ) : activity?.toLowerCase() === 'relocate - out' ? (
                <img className="h-5" alt="right" src={RightLeftIcon} />
              ) : (
                <ShoppingCartIcon className="h-5 stroke-[#3F73EB]" />
              )}
              <div className="absolute right-0 top-10 left-5">
                <div
                  className={`${
                    dataApi.length - 1 === index
                      ? 'border-none'
                      : 'border-l-2 border-l-[#3F73EB] h-[80px] transition-all duration-500'
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="flex ml-4">
            <p className="font-semibold text-sm mr-36">{activity}</p>
            <p className="text-sm">{`${Moment(date).format('DD/MM/YYYY')}`}</p>
          </div>
        </div>
        <div className="-ml-20 -mt-1">
          <p className="text-sm">{requestNumber}</p>
        </div>
        <div className="-ml-[170px] mt-2">
          <p className="text-sm">qty : {qty}</p>
        </div>
      </div>
      <div
        ref={content}
        style={{ maxHeight: '200px' }}
        className="bg-white overflow-hidden transition-all duration-500 ease-in-out"
      >
        {/* Your content goes here */}
      </div>
    </div>
  );
}

export default ProgressStepBar;
