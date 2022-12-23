import React, { useEffect, useState, useContext } from 'react';

import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import Context from '../../../context';
import { CategoryApi } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import LoadingHover from '../../../components/loading-hover-component';
import DeleteButton from '../../../components/delete-button-component';

function Screen(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName } = props;
  const { store } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [dataCategoryById, setDataCategoryById] = useState([]);

  useEffect(() => {
    getDetailCategory();
  }, []);

  const getDetailCategory = () => {
    setLoading(true);
    CategoryApi.find(id)
      .then(res => {
        setLoading(false);
        setDataCategoryById(res);
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
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
        <DeleteButton api={CategoryApi} id={id} redirectTo="master/category" />
        <Button
          onClick={() => {
            navigate(`/master/category/${id}/edit`);
            store.setIsLoadEdit(true);
          }}
          px={8}
          size="sm"
          type="submit"
          className="ml-4 rounded-full bg-[#184D47] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-[50%] gap-y-12 grid-cols-2 bg-white py-8 px-8 rounded-[30px] drop-shadow-md">
        <InputDetail
          value={dataCategoryById.code}
          label="Code"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
        <InputDetail
          value={dataCategoryById.name}
          label="Category"
          customStyleLabel="text-md"
          customStyleSpan="text-md font-bold"
        />
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
