import React, { useState, useEffect } from 'react';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

import Input from '../../../components/input-component';
import Select from '../../../components/select-component';
import LoadingHover from '../../../components/loading-hover-component';
import { StorageApi, WarehouseApi } from '../../../services/api-master';

const schema = yup.object().shape({
  bay: yup.string().nullable().max(2).required(),
  code: yup.string().nullable().max(7).required(),
  rack_number: yup.string().nullable().max(1).required(),
  warehouse_id: yup.number().nullable().required(),
  level: yup.string().nullable().max(1).required(),
});

function Screen(props) {
  const { displayName, route } = props;

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const [warehouseData, setWarhouseData] = useState([]);
  const [warehouseId, setWarhouseId] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    WarehouseApi.get()
      .then(res => {
        if (warehouseId) {
          setValue('warehouse_id', warehouseId, {
            value: warehouseId,
            label: `${res.data?.find(i => i.id === warehouseId)?.name} - ${
              res.data?.find(i => i.id === warehouseId)?.location
            }`,
          });
        }
        setWarhouseData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data.title, icon: 'error' });
      });
  }, [warehouseId]);

  useEffect(() => {
    setLoading(true);
    StorageApi.find(id)
      .then(res => {
        setValue('bay', res.bay);
        setValue('code', res.code);
        setValue('rack_number', res.rack_number);
        setValue('warehouse_id', res.warehouse_id);
        setValue('level', res.level);
        setWarhouseId(res.warehouse_id);
        setLoading(false);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  const onEditSaveStorage = data => {
    StorageApi.update(id, {
      bay: data.bay,
      code: data.code,
      rack_number: data.rack_number,
      warehouse_id: Number(data.warehouse_id),
      level: data.level,
    })
      .then(() => {
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate(route.split('/').slice(0, 3).join('/'));
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onEditSaveStorage)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">{displayName}</h1>
          <div className="flex-1" />
          <Button
            onClick={() => navigate(-1)}
            px={8}
            size="sm"
            className="rounded-full bg-[#aaa] outline outline-offset-0 outline-[#1F2022] text-[#fff] font-bold"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            px={8}
            type="submit"
            className="ml-4 rounded-full outline outline-offset-0 outline-[#232323] bg-[#232323] text-[#fff] font-bold"
          >
            Save
          </Button>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="level" label="Level" register={register} errors={errors} />
          <Input name="rack_number" label="Rack" register={register} errors={errors} />
          <Select
            name="warehouse_id"
            label="Warehouse"
            options={warehouseData?.map(i => {
              return {
                value: i.id,
                label: `${i.name} - ${i.location}`,
              };
            })}
            placeholder="Warehouse"
            register={register}
            errors={errors}
          />
          <Input name="bay" label="Bay" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
