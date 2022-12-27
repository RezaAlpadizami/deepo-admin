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
        <div className="flex gap-32 p-10 mt-6 bg-white rounded-[20px] w-full drop-shadow-md">
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
          <div className="w-[30%]">
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
        <div
          className={`flex gap-8 mt-6 bg-white rounded-[20px] w-full drop-shadow-md ${
            dataJourneyById.length === 0 ? 'justify-center py-[9%]' : 'p-10'
          }`}
        >
          <div className="items-center text-center flex justify-center">
            {dataJourneyById.length === 0 ? (
              <p className="text-xl font-bold">Product Journey is Empty</p>
            ) : (
              <ProgressStepBar dataApi={dataJourneyById} customStyleRequestNumber="absolute -right-28 top-2" />
            )}
          </div>
        </div>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
