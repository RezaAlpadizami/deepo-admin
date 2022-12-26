import React from 'react';

import Moment from 'moment';
import { ViewGridAddIcon, SwitchHorizontalIcon, ShoppingCartIcon } from '@heroicons/react/solid';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import Contents from '../screens/product-screens/product-journey-screens/component/content-stepper-journey';
import '../assets/styles/custom.css';

export default function ProgressStepBar(props) {
  const { dataApi, customStyleRequestNumber } = props;
  const { activeStep, setStep } = useSteps({
    initialStep: dataApi.journey.length - 1,
  });
  return (
    <Steps orientation="vertical" activeStep={activeStep} onClickStep={step => setStep(step)} fontSize="24px">
      {dataApi?.journey?.map(
        (
          {
            activity_name,
            warehouse_name,
            storage_bay,
            storage_level,
            storage_rack,
            created_at,
            id,
            qty,
            request_number,
          },
          index
        ) => (
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
            position="relative"
          >
            <div className={customStyleRequestNumber}>
              <p>{request_number}</p>
            </div>
            <Contents
              dataApi={dataApi}
              warehouseName={warehouse_name}
              bay={storage_bay}
              level={storage_level}
              rack={storage_rack}
              my={1}
              qtyJourney={qty}
              index={index}
            />
          </Step>
        )
      )}
    </Steps>
  );
}
