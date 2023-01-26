import React, { useState, useRef } from 'react';
import Moment from 'moment';
import { ShoppingCartIcon, ArchiveIcon } from '@heroicons/react/outline';
import { Chevron } from '../assets/images';
import RightLeftIcon from '../assets/images/right-left-arrow.svg';
import LeftRightIcon from '../assets/images/left-right-arrow.svg';

function ProgressStepBar(props) {
  const { activity, date, requestNumber, contents, index, dataApi } = props;

  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');
  const [setRotate, setRotateState] = useState('accordion__icon');

  const content = useRef(null);

  const toggleAccordion = () => {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(setActive === 'active' ? '0px' : `${content.current.scrollHeight}px`);
    setRotateState(
      setActive === 'active'
        ? 'ml-auto transition-transform duration-500 ease-out'
        : 'ml-auto transition-transform duration-500 ease-out rotate-90'
    );
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        className={`${setActive} p-4 cursor-pointer w-full flex items-center border-none outline-none transition-colors duration-200 ease-in`}
        onClick={toggleAccordion}
      >
        <div className="h-10 w-10 relative">
          <div className="rounded-full bg-white h-full border-2 border-[#3F73EB] grid place-content-center">
            {activity.toLowerCase() === 'inbound' ? (
              <ArchiveIcon className="h-5 stroke-[#3F73EB]" />
            ) : activity.toLowerCase() === 'relocate - in' ? (
              <img className="h-5" style={{ transform: 'scaleX(-1)' }} alt="right" src={LeftRightIcon} />
            ) : activity.toLowerCase() === 'relocate - out' ? (
              <img className="h-5" alt="right" src={RightLeftIcon} />
            ) : (
              <ShoppingCartIcon className="h-5 stroke-[#3F73EB]" />
            )}
            <div className="absolute right-0 top-10 left-5">
              <div className="pr-5" />
              <div
                className={`${
                  dataApi.journey.length - 1 === index
                    ? 'border-none'
                    : setActive === 'active'
                    ? 'border-l-2 border-l-[#3F73EB] h-[200px] transition-all duration-1000 '
                    : 'border-l-2 border-l-[#3F73EB] h-[40px] transition-all duration-500'
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-x-5 mx-6">
          <p className="font-semibold text-sm">{activity}</p>
          <p className="text-sm text-gray-400">{`${Moment(date).format('DD-MMM-YYYY')}`}</p>
        </div>
        <div className="flex-1" />
        <p className="text-sm text-gray-400">{requestNumber}</p>
        <Chevron className={`${setRotate} ml-12`} width={10} fill="#DCDCDC" />
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="bg-white overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="font-medium text-sm px-4 pb-6" dangerouslySetInnerHTML={{ __html: contents }} />
      </div>
    </div>
  );
}

export default ProgressStepBar;
