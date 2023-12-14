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
    <div className="mt-6">
      <div className="flex mb-6">
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className="font-bold pb-1 text-xl max-[640px]:text-xs max-[640px]:mr-2">{displayName}</h1>
        <div className="flex-1" />
        <DeleteButton api={StorageApi} id={id} redirectTo="master/storage" />
        <Button
          paddingX={12}
          type="submit"
          onClick={() => {
            navigate(`/master/storage/${id}/edit`);
          }}
          size="sm"
          className="ml-4 rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-full gap-y-12 grid-cols-2 py-8 px-8 rounded-[30px] max-[640px]:grid-cols-1 max-[640px]:gap-y-8">
        <InputDetail
          value={dataStorageById.code}
          label="Code"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataStorageById.level}
          label="Level"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataStorageById.rack_number}
          label="Rack"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={`${dataStorageById?.warehouse?.name} ${dataStorageById?.warehouse?.location}`}
          label="Warehouse"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataStorageById.bay}
          label="Bay"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
      </div>
    </div>
  );
}
export default Screen;
