import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import ProgressStepBar from '../../../components/stepper';
import LoadingHover from '../../../components/loading-hover-component';
import { ProductJourney } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';

function Screen(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName } = props;

  const [loading, setLoading] = useState(false);
  const [dataJourneyById, setDataJourneyById] = useState([]);

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
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <div className="flex mb-12">
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-10 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
      </div>

      <div>
        <h1 className="font-bold text-[20px]">Detail Product</h1>
        <div className="flex gap-32 p-10 mt-6 bg-white rounded-[20px] w-full">
          <div>
            <InputDetail
              value={dataJourneyById.product_name}
              label="Name"
              customStyleLabel="text-gray-400 text-xl"
              customStyleSpan="font-bold text-xl"
            />
            <InputDetail
              value={dataJourneyById.sku}
              label="SKU"
              customStyleLabel="text-gray-400 text-xl"
              customStyleSpan="font-bold text-xl"
            />
          </div>
          <div>
            <InputDetail
              value={dataJourneyById.product_category}
              label="Category"
              customStyleLabel="text-gray-400 text-xl"
              customStyleSpan="font-bold text-xl"
            />
            <InputDetail
              value={dataJourneyById.id}
              label="Desc"
              customStyleLabel="text-gray-400 text-xl"
              customStyleSpan="font-bold text-xl"
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h1 className="font-bold text-[20px]">Product Journey</h1>
        <div className="flex gap-8 p-10 mt-6 bg-white rounded-[20px] w-full">
          <div>
            <ProgressStepBar
              dataApi={dataJourneyById}
              customStyleRequestNumber="absolute -right-28 top-2 text-gray-400"
            />
          </div>
        </div>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
