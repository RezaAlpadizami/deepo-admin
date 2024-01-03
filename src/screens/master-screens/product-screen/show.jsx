import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import InputDetail from '../../../components/input-detail-component';
import DeleteButton from '../../../components/delete-button-component';
import { ProductApi } from '../../../services/api-master';

import Context from '../../../context';
import { capitalize } from '../../../utils/helper';

function ShowScreen(props) {
  const { displayName } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const { store } = useContext(Context);

  useEffect(() => {
    ProductApi.find(id)
      .then(res => {
        setData(res);
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
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
        <div>
          <DeleteButton api={ProductApi} id={id} redirectTo="master/product" />
          <Button
            onClick={() => {
              navigate(`/master/product/${id}/edit`);
              store.setIsLoadEdit(true);
            }}
            px={12}
            type="submit"
            size="sm"
            className="ml-4 rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="grid items-start justify-items-center gap-y-12 grid-cols-2 py-8 px-8 rounded-[30px]">
        <InputDetail label="SKU" value={capitalize(data?.sku) || '-'} />
        <InputDetail label="Name" value={capitalize(data?.product_name) || '-'} />
        <InputDetail label="Category" value={data?.category_id || '-'} />
        <InputDetail label="Description" value={capitalize(data?.product_desc) || '-'} />
        <InputDetail label="Unit of Measurement" value={capitalize(data?.qty_uom) || '-'} />
      </div>
    </div>
  );
}

export default ShowScreen;
