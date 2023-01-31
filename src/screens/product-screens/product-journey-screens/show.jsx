import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import ProgressStepBar from '../../../components/stepper';
import LoadingHover from '../../../components/loading-hover-component';
import { ProductJourney, ProductApi } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';

function Screen(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName } = props;

  const [loading, setLoading] = useState(false);
  const [dataJourneyById, setDataJourneyById] = useState([]);
  const [dataDetailProduct, setDataDetailProduct] = useState([]);

  useEffect(() => {
    getDetailJourney();
  }, []);

  const getDetailJourney = () => {
    setLoading(true);
    ProductJourney.find(id)
      .then(res => {
        setLoading(false);
        setDataJourneyById(res);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getTotalQty = (data, activityName) => {
    if (Array.isArray(data?.journey)) {
      return data.journey.filter(i => i.activity_name === activityName).reduce((acc, obj) => acc + obj.qty, 0);
    }
    return '-';
  };

  useEffect(() => {
    ProductApi.find(id)
      .then(res => {
        setDataDetailProduct(res);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  return (
    <div className="mt-6">
      <div className="flex mb-6">
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className="font-bold pb-1 text-xl">{displayName}</h1>
        <div className="flex-1" />
      </div>

      <div>
        <h1 className="font-bold text-md">Detail Product</h1>
        <div className="flex gap-32 p-10 mt-6 bg-white rounded-[20px] w-full drop-shadow-md max-[640px]:grid max-[640px]:grid-cols-1 max-[640px]:gap-1 max-[640px]:p-[1.5rem]">
          <div>
            <InputDetail
              value={dataDetailProduct.product_name}
              label="Name"
              customStyleLabel="text-gray-400 text-md"
              customStyleSpan="font-bold text-md"
            />
            <InputDetail
              value={dataDetailProduct.sku}
              label="SKU"
              customStyleLabel="text-gray-400 text-md"
              customStyleSpan="font-bold text-md"
            />
          </div>
          <div className="w-[30%] max-[640px]:w-full">
            <InputDetail
              value={dataDetailProduct?.category?.name}
              label="Category"
              customStyleLabel="text-gray-400 text-md"
              customStyleSpan="font-bold text-md"
            />
            <InputDetail
              value={dataDetailProduct.product_desc}
              label="Desc"
              customStyleLabel="text-gray-400 text-md"
              customStyleSpan="font-bold text-md"
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h1 className="font-bold text-md">Product Journey</h1>
        <div className="bg-white flex flex-col px-2 gap-y-1 py-2 mt-4 drop-shadow-sm rounded-[20px]">
          {getTotalQty(dataJourneyById, 'INBOUND') > 0 && (
            <div className="flex">
              <p className="px-4  text-[13px] text-gray-400">Total INBOUND</p>
              <div className="flex-1" />
              <p className="text-sm px-8 max-[640px]:block max-[640px]:text-xs text-gray-30 text-gray-400">
                {getTotalQty(dataJourneyById, 'INBOUND')}
              </p>
            </div>
          )}
          {getTotalQty(dataJourneyById, 'OUTBOUND') > 0 && (
            <div className="flex">
              <p className="px-4 text-[13px] text-gray-400">Total OUTBOUND</p>
              <div className="flex-1" />
              <p className="text-sm px-8 max-[640px]:block max-[640px]:text-xs text-gray-400">
                {getTotalQty(dataJourneyById, 'OUTBOUND')}
              </p>
            </div>
          )}
          {dataJourneyById.qty > 0 && (
            <div>
              <div className="border border-grey-300 w-full" />
              <div className="flex">
                <p className="px-4 font-bold text-[13px]">Total Quantity</p>
                <div className="flex-1" />
                <p className="font-bold text-sm px-8 max-[640px]:block max-[640px]:text-xs ">
                  {dataJourneyById.qty || '-'}
                </p>
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex gap-8 mt-2 bg-white rounded-[20px] w-full drop-shadow-md ${
            dataJourneyById.length === 0 ? 'justify-center py-[9%]' : 'p-10 max-[640px]:p-6'
          }`}
        >
          <div className="items-center text-center flex justify-center">
            {dataJourneyById.length === 0 ? (
              <p className="text-xl font-bold">Product Journey is Empty</p>
            ) : (
              <div>
                {dataJourneyById.journey.map(
                  (
                    {
                      activity_name,
                      created_at,
                      request_number,
                      storage_level,
                      storage_rack,
                      storage_bay,
                      qty,
                      warehouse_name,
                    },
                    index
                  ) => (
                    <ProgressStepBar
                      activity={activity_name}
                      date={created_at}
                      requestNumber={request_number}
                      index={index}
                      dataApi={dataJourneyById}
                      key={index}
                      contents={`
                                <div class="flex flex-col text-left gap-y-3 mx-20">
                                  <h2 class="text-gray-400 text-xl max-[640px]:text-xs">Warehouse</h2>
                                  <div class="flex relative font-bold">
                                    <h3 class="text-[16px] max-[640px]:text-xs">${warehouse_name}</h3>
                                  </div>
                                  <div class="flex gap-x-5">
                                    <div class="flex flex-col items-center gap-y-2 text-sm max-[640px]:text-xs">
                                      <h4 class="text-gray-400 font-bold">Rack</h4>
                                      <div class="px-6 py-1 rounded-full font-bold bg-[#FFF5EB] outline outline-offset-2 outline-[#FFF5EB]">
                                        <Text>${storage_rack}</Text>
                                      </div>
                                    </div>
                                    <div class="flex flex-col items-center gap-y-2 text-sm max-[640px]:text-xs">
                                      <h4 class="text-gray-400 font-bold">Bay</h4>
                                      <div class="px-6 py-1 rounded-full font-bold bg-[#DEEDF0] outline outline-offset-2 outline-[#DEEDF0]">
                                        <Text>${storage_bay}</Text>
                                      </div>
                                    </div>
                                    <div class="flex flex-col items-center gap-y-2 text-sm max-[640px]:text-xs">
                                      <h4 class="text-gray-400 font-bold">Level</h4>
                                      <div class="px-6 py-1 rounded-full font-bold bg-[#F4C7AB] outline outline-offset-2 outline-[#F4C7AB]">
                                        <Text>${storage_level}</Text>
                                      </div>
                                    </div>
                                    <span class="font-bold ml-[6rem] mt-6 text-sm max-[640px]:ml-8 max-[640px]:text-xs">${qty}</span>
                                  </div>
                                </div>`}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
