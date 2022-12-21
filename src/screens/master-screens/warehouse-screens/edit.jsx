import React, { useState, useEffect } from 'react';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import Moment from 'moment';

import Input from '../../../components/input-component';
import { WarehouseApi } from '../../../services/api-master';
import DatePicker from '../../../components/datepicker-component';
import LoadingHover from '../../../components/loading-hover-component';

const schema = yup.object().shape({
  name: yup.string().nullable().max(100).required(),
  code: yup.string().nullable().max(7).required(),
  address: yup.string().nullable().max(255).required(),
  phone: yup
    .string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number is not valid'
    )
    .max(13)
    .required(),
  capacity: yup.number().nullable().required(),
  last_stock_opname: yup.string().nullable().required(),
  location: yup.string().nullable().max(100).required(),
});

function Screen(props) {
  const { displayName, route } = props;

  const {
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading] = useState(false);

  useEffect(() => {
    WarehouseApi.find(id)
      .then(res => {
        setValue('name', res.name);
        setValue('code', res.code);
        setValue('address', res.address);
        setValue('phone', res.phone);
        setValue('capacity', res.capacity);
        setValue('last_stock_opname', res.last_stock_opname ? Moment(res.start_date).toDate() : null);
        setValue('location', res.location);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  const onEditSaveWarehouse = data => {
    WarehouseApi.update(id, {
      name: data.name,
      address: data.address,
      phone: data.phone,
      level: data.level,
      capacity: Number(data.capacity),
      last_stock_opname: data.last_stock_opname ? Moment(data.last_stock_opname).format('YYYY-MM-DD') : null,
      location: data.location,
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
      <form onSubmit={handleSubmit(onEditSaveWarehouse)}>
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
          <Input name="code" label="Code" register={register} errors={errors} disabled />
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
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
