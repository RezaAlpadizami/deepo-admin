import React, { useState } from 'react';

import Moment from 'moment';
import { ViewGridAddIcon, SwitchHorizontalIcon, ShoppingCartIcon } from '@heroicons/react/solid';
import { Step, Steps } from 'chakra-ui-steps';
import Contents from '../screens/product-screens/product-journey-screens/component/content-stepper-journey';
import '../assets/styles/custom.css';

export default function ProgressStepBar(props) {
  const { dataApi } = props;
  const [show, setShow] = useState(false);

  const handleClickStep = () => {
    setShow(!show);
  };
  return (
    <div>
      {dataApi?.journey?.map(
        ({ activity_name, warehouse_name, storage_bay, storage_level, storage_rack, created_at, id, qty }, index) => (
          <Steps orientation="vertical" onClick={() => handleClickStep()} fontSize="24px">
            <Step
              width="100%"
              fontSize="20px"
              label={activity_name}
              description={`${Moment(created_at).format('DD-MMM-YYYY')}`}
              isCompletedStep={false}
              icon={
                activity_name === 'INBOUND'
                  ? ViewGridAddIcon
                  : activity_name === 'OUTBOUND'
                  ? ShoppingCartIcon
                  : SwitchHorizontalIcon
              }
              key={id}
              className="cursor-pointer"
            >
              {show && (
                <Contents
                  dataApi={dataApi}
                  warehouseName={warehouse_name}
                  bay={storage_bay}
                  level={storage_level}
                  rack={storage_rack}
                  qtyJourney={qty}
                  index={index}
                />
              )}
              <div
                className={`absolute border border-blue-400 w-0 top-4 left-5 ${
                  dataApi.journey.length - 1 === index ? 'h-0' : 'h-full'
                }`}
              />
            </Step>
          </Steps>
        )
      )}
    </div>
  );
}
