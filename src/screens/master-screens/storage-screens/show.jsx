import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import InputDetail from '../../../components/input-detail-component';
import { StorageApi } from '../../../services/api-master';
import DeleteButton from '../../../components/delete-button-component';

function Screen(props) {
  const { displayName } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataStorageById, setDataStorageById] = useState([]);

  useEffect(() => {
    getDetailStorage();
  }, []);

  const getDetailStorage = () => {
    StorageApi.find(id)
      .then(res => {
        setDataStorageById(res);
      })
      .catch(error => {
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
        <DeleteButton api={StorageApi} id={id} redirectTo="master/storage" />
        <Button
          paddingX={12}
          type="submit"
          onClick={() => {
            navigate(`/master/storage/${id}/edit`);
          }}
          size="sm"
          className="ml-4 rounded-full outline outline-offset-0 outline-[#232323] bg-[#232323] text-[#fff] font-bold"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
        <InputDetail value={dataStorageById.code} label="Code" />
        <InputDetail value={dataStorageById.level} label="Level" />
        <InputDetail value={dataStorageById.rack_number} label="Rack" />
        <InputDetail
          value={`${dataStorageById?.warehouse?.name} ${dataStorageById?.warehouse?.location}`}
          label="Warehouse"
        />
        <InputDetail value={dataStorageById.bay} label="Bay" />
      </div>
    </div>
  );
}
export default Screen;
