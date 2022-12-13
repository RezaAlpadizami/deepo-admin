import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Moment from 'moment';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';

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
        setDataWarehouseById(res);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <div className="flex mb-12">
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
        <DeleteButton api={WarehouseApi} id={id} redirectTo="master/warehouse" />
        <Button
          paddingX={12}
          type="submit"
          onClick={() => {
            navigate(`/master/warehouse/${id}/edit`);
          }}
          size="sm"
          className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
        <InputDetail value={dataWarehouseById.code} label="Code" />
        <InputDetail value={dataWarehouseById.address} label="Address" />
        <InputDetail value={dataWarehouseById.name} label="Name" />
        <InputDetail value={dataWarehouseById.phone} label="Phone Number" />
        <InputDetail value={dataWarehouseById.capacity} label="Capacity" />
        <InputDetail
          value={Moment(dataWarehouseById.last_stock_opname).format('DD MMM, YYYY')}
          label="Last Stock Opname"
        />
        <InputDetail value={dataWarehouseById.location} label="Location" />
      </div>
    </div>
  );
}
export default Screen;
