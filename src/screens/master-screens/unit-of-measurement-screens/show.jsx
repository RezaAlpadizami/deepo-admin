import React, { useEffect, useState, useContext } from 'react';

import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import Context from '../../../context';
import { UomApi } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import LoadingHover from '../../../components/loading-hover-component';
import DeleteButton from '../../../components/delete-button-component';
import { capitalize } from '../../../utils/helper';

function Screen(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName } = props;
  const { store } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [dataUomById, setDataUomById] = useState([]);

  useEffect(() => {
    getDetailCategory();
  }, []);

  const getDetailCategory = () => {
    setLoading(true);
    UomApi.find(id)
      .then(res => {
        setLoading(false);
        setDataUomById(res);
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="mt-6">
      <div className="flex mb-6">
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className="font-bold text-xl max-[640px]:text-xs max-[640px]:mr-2">{displayName}</h1>
        <div className="flex-1" />
        <DeleteButton api={UomApi} id={id} redirectTo="master/unit-of-measurement" />
        <Button
          onClick={() => {
            navigate(`/master/unit-of-measurement/${id}/edit`);
            store.setIsLoadEdit(true);
          }}
          px={8}
          size="sm"
          type="submit"
          className="ml-4 rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center gap-y-12 grid-cols-2 py-8 px-8 rounded-[30px]">
        <InputDetail
          value={dataUomById.code || '-'}
          label="Code"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          label="Description"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
          value={capitalize(dataUomById?.description) || '-'}
        />
        <InputDetail
          value={dataUomById.name || '-'}
          label="Name"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
