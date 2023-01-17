import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Moment from 'moment';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import DeleteButton from '../../../components/delete-button-component';
import InputDetail from '../../../components/input-detail-component';
import { WarehouseApi } from '../../../services/api-master';

function Screen(props) {
  const { displayName } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataWarehouseById, setDataWarehouseById] = useState([]);

  useEffect(() => {
    getDetailWarehouse();
  }, []);

  const getDetailWarehouse = () => {
    WarehouseApi.find(id)
      .then(res => {
        console.log('res', res);
        setDataWarehouseById(res);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="mt-6">
      <div className="flex mb-6">
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
        <DeleteButton api={WarehouseApi} id={id} redirectTo="master/warehouse" />
        <Button
          paddingX={12}
          type="submit"
          onClick={() => {
            navigate(`/master/warehouse/${id}/edit`);
          }}
          size="sm"
          className="ml-4 rounded-full bg-[#184D47] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-full gap-y-12 grid-cols-2 bg-white py-8 px-8 rounded-[30px] drop-shadow-md">
        <InputDetail
          value={dataWarehouseById.code}
          label="Code"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataWarehouseById.address}
          label="Address"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataWarehouseById.name}
          label="Name"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataWarehouseById.phone}
          label="Phone Number"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataWarehouseById.capacity}
          label="Capacity"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={Moment(dataWarehouseById.last_stock_opname).format('DD MMM, YYYY')}
          label="Last Stock Opname"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataWarehouseById.location}
          label="Location"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
      </div>
    </div>
  );
}
export default Screen;
