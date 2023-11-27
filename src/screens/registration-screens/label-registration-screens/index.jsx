import React, { useState, useEffect } from 'react';
import { useMediaQuery, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '../../../components/select-component';
import InputComponent from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import { ProductApi } from '../../../services/api-master';
import SimpleTable from '../../../components/table-registration-component';

const dummyProductRegistered = [
  {
    product_id: 12412,
    product_sku: 'ABC1234',
    product_name: 'Batik',
    qty: 10,
  },
  {
    product_id: 4312,
    product_sku: 'CBD123',
    product_name: 'Celana',
    qty: 10,
  },
  {
    product_id: 3423,
    product_sku: 'NVAM12',
    product_name: 'Jaket',
    qty: 10,
  },
  {
    product_id: 5432,
    product_sku: 'MVA23',
    product_name: 'Sempak',
    qty: 10,
  },
];
const dummyRfidRegister = [
  {
    rfid_number: '123wqerfc5nw123',
    product_id: 9834,
    product_sku: 'ABC1234',
    product_name: 'Batik',
    in_stock: true,
  },
  {
    rfid_number: '122efasdfdfanw123',
    product_id: undefined,
    product_sku: undefined,
    product_name: undefined,
    in_stock: false,
  },
  {
    rfid_number: '123adfanw1fgq23',
    product_id: 10394,
    product_sku: 'NVAM12',
    product_name: 'Jaket',
    in_stock: true,
  },
  {
    rfid_number: '123sdffanw0odfd3',
    product_id: 49821,
    product_sku: 'MVA23',
    product_name: 'Sempak',
    in_stock: true,
  },
];

const schemaSubmitRegistration = yup.object().shape({
  product_id: yup.string().nullable().required(),
  registration_date: yup.date().nullable().required(),
  notes: yup.string().nullable().max(255),
});

function Screen() {
  const [dataProduct, setDataProduct] = useState([]);
  //   const [error, setErrors] = useState(false);
  //   const [loadingRFID, setLoadingRFID] = useState(false);
  const [isLarge] = useMediaQuery('(min-width: 1150px)');

  const {
    // handleSubmit,
    // reset,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSubmitRegistration),
  });
  useEffect(() => {
    ProductApi.get()
      .then(res => {
        setDataProduct(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, []);
  return (
    <div>
      <div className="px-5">
        <div className={`${isLarge ? 'grid grid-cols-3' : ''} w-full pb-2`}>
          <DatePicker name="registration_date" label="Date" register={register} control={control} errors={errors} />
        </div>
        <div className="grid grid-cols-3 space-x-[53%]">
          <InputComponent name="notes" label="Notes" register={register} control={control} errors={errors} />
          <Select
            name="product_id"
            label="Product"
            placeholder="Select Product"
            options={dataProduct?.map(i => {
              return {
                value: i.id,
                label: i.product_name,
              };
            })}
            register={register}
            errors={errors}
          />
        </div>
      </div>
      <div className="grid grid-rows-2 px-5 py-1">
        <div className={`${isLarge ? 'flex gap-6' : ''} row-span-2 justify-center`}>
          <div className="w-full mb-6">
            {/* <h1 className="px-3 text-gray-400">Request Detail</h1> */}
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text- xl:text-xl text-[#1F2937] font-semibold">Product Registered</legend>
              {/* <LoadingComponent visible={loadingRequest} /> */}
              {/* <LottiesAnimation
                animationsData={Loading}
                visible={loadingRequest}
                classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
              /> */}
              {/* {!loadingRequest ?  */}
              <SimpleTable data={dummyProductRegistered} isLarge={isLarge} />
              {/* //    : null} */}
            </fieldset>
          </div>
          <div className="w-full mb-6">
            {/* <h2 className="px-3 text-gray-400">RFID Detected</h2> */}
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text-xl xl:text-xl text-[#1F2937] font-semibold">RFID Detected</legend>
              {/* <LoadingComponent visible={loadingRFID} /> */}
              {/* <LottiesAnimation
                visible={loadingRFID}
                animationsData={Loading}
                classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
              /> */}
              {/* {!loadingRFID ? ( */}
              <SimpleTable
                //   loading={loadtable}
                data={dummyRfidRegister.map(i => {
                  return {
                    rfid_number: i.rfid_number,
                    product_id: i.product_id,
                    product_name: i.product_name,
                    product_sku: i.sku,
                    in_stock: i.in_stock,
                  };
                })}
                isLarge={isLarge}
                rfidTable
              />
              {/* ) : null} */}
            </fieldset>
          </div>
        </div>

        <div className="">
          <div className="w-full rounded-md">
            <div className="flex w-full py-2">
              <div className="grid grid-cols-2 gap-28 sm:space-x-[20%] md:space-x-[60%] xl:space-x-[70%] w-full bg-white px-4 py-6 rounded-md border border-[#C2C2C2]">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="max-sm:text-xs xl:text-lg w-1/2 flex-1">Total Product Registered</div>
                    <div className="font-bold">12</div>
                  </div>
                  <div className="flex">
                    <div className="max-sm:text-xs xl:text-lg w-1/2 flex-1">
                      {isLarge ? 'Total RFID Detected' : 'Total RFID'}
                    </div>
                    <div className="font-bold">10</div>
                  </div>
                </div>
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
                    onClick={() => {}}
                  >
                    Scan
                  </Button>
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="submit"
                    size="sm"
                    px={12}
                    className="rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-semibold"
                    onClick={() => {}}
                  >
                    Submit
                  </Button>
                </div>
              </div>
              {/* 
              <div className="grid w-1/2">
                <div
                  className={`${isLarge ? 'grid grid-cols-3 justify-place-end pl-8' : 'flex flex-wrap my-2 '} my-auto `}
                >
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 5 : 2}
                    className="rounded-full border border-gray-300 bg-[#fff] hover:bg-[#E4E4E4] text-primarydeepo font-bold"
                    onClick={scanning ? stopScanning : startScanning}
                    isDisabled={requestDetailData.length === 0}
                  >
                    {scanning ? <StopIcon className="h-6 animate-pulse" /> : <p className="tracking-wide">Scan</p>}
                  </Button>

                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 6 : 2}
                    className={`rounded-full border border-gray-300 bg-[#fff] hover:bg-[#E4E4E4] text-[#2f3e46] font-bold ${
                      isLarge ? 'mx-4' : 'mx-2'
                    } `}
                    onClick={onReset}
                    isDisabled={scanning}
                  >
                    <p className="tracking-wide">Reset</p>
                  </Button>

                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="submit"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 6 : 3}
                    className={`rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold ${
                      isLarge ? '' : 'mt-2'
                    } `}
                    onClick={onSubmitRFID}
                    isDisabled={onDisabled()}
                  >
                    Next
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
          {/* {error && (
            <p className="text-[#a2002d] text-xs w-full pl-4">
              {totalRequest !== totalRFID
                ? 'The amount of data in Request Detail does not match the data in RFID Detected.'
                : ''}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Screen;