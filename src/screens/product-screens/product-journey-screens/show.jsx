import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import LoadingHover from '../../../components/loading-hover-component';
import { ProductJourney, ProductApi } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import JourneyTable from './component/table-journey';

function Screen(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName } = props;

  const [loading, setLoading] = useState(false);
  const [dataJourneyById, setDataJourneyById] = useState([]);
  const [dataDetailProduct, setDataDetailProduct] = useState([]);
  const [isLarge] = useMediaQuery('(min-width: 1150px)');

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
        <fieldset
          className={`${
            isLarge ? 'min-h-full pb-6' : 'h-1/2 py-2'
          } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
        >
          <legend className="px-2 sm:text- xl:text-xl text-[#1F2937] font-semibold">Detail Product</legend>
          <div className="flex gap-32 px-10 my-2  rounded-[20px] w-full max-[640px]:grid max-[640px]:grid-cols-1 max-[640px]:gap-1 max-[640px]:p-[1.5rem]">
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
        </fieldset>
      </div>
      <div className="mt-8">
        <fieldset
          className={`${
            isLarge ? 'min-h-full pb-6' : 'h-1/2 py-2'
          } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
        >
          <legend className="px-2 sm:text- xl:text-xl text-[#1F2937] font-semibold">Journey</legend>
          <JourneyTable data={dataJourneyById} loading={loading} isLarge={isLarge} />
        </fieldset>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
