import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingHover from '../../../components/loading-hover-component';
import { WarehouseApi } from '../../../services/api-master';
import Input from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';

function Screen(props) {
  const { displayName } = props;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().nullable().max(100).required(),
    code: yup.string().nullable().max(7).required(),
    address: yup.string().nullable().max(255).required(),
    phone: yup
      .string()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        'Phone number is not valid'
      ),
    capacity: yup.number().nullable().required(),
    last_stock_opname: yup.date().nullable().required(),
    location: yup.string().nullable().max(100).required(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitWarehouse = data => {
    setLoading(true);
    WarehouseApi.store({
      name: data.name,
      code: data.code,
      address: data.address,
      phone: data.phone,
      capacity: data.capacity,
      last_stock_opname: data.last_stock_opname,
      location: data.location,
    })
      .then(() => {
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate('/master/warehouse');
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmitWarehouse)}>
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
          <Input name="address" label="Address" register={register} errors={errors} />
          <Input name="name" label="Name" register={register} errors={errors} />
          <Input name="phone" label="Phone Number" register={register} errors={errors} />
          <Input name="capacity" label="Capacity" register={register} errors={errors} />
          <DatePicker
            name="last_stock_opname"
            label="Last Stock Opname"
            placeholder="Date / Month / Year"
            register={register}
            control={control}
            errors={errors}
          />
          <Input name="location" label="Location" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
