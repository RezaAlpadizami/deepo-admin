import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import LoadingHover from '../../../components/loading-hover-component';
import TextArea from '../../../components/textarea-component';
import { ProductApi, CategoryApi } from '../../../services/api-master';
import Select from '../../../components/select-component';
import Input from '../../../components/input-component';

const schema = yup.object().shape({
  sku: yup.string().max(15).required(),
  product_name: yup.string().nullable().max(100).required(),
  category_id: yup.string().nullable().required(),
  product_desc: yup.string().max(255),
});

function Screen(props) {
  const { route, displayName } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    CategoryApi.get()
      .then(res => {
        setCategoryData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, []);

  const onSubmit = data => {
    setLoading(true);
    ProductApi.store({
      sku: data.sku,
      product_name: data.product_name,
      category_id: Number(data.category_id),
      product_desc: data.product_desc,
    })
      .then(() => {
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate(route.split('/').slice(0, 3).join('/'));
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mb-12">
          <button type="button">
            <ChevronLeftIcon className="pointer-events-auto h-10 stroke-2" onClick={() => navigate(-1)} />
          </button>
          <h1 className="font-bold text-3xl">{displayName}</h1>
          <div className="flex-1" />
          <div>
            <Button
              onClick={() => navigate(-1)}
              px={8}
              size="sm"
              className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#184D47] font-bold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              px={8}
              type="submit"
              className="ml-4 rounded-full bg-[#184D47] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="grid items-start justify-items-center gap-4 gap-y-12 pl-6 mb-4 grid-cols-2 mt-4">
          <Input name="sku" label="Sku" maxLength="15" register={register} errors={errors} />
          <Select
            name="category_id"
            label="Category"
            placeholder="Category"
            options={categoryData?.map(i => {
              return {
                value: i?.id,
                label: `${i.code} - ${i.name}`,
              };
            })}
            register={register}
            errors={errors}
          />
          <Input name="product_name" label="Name" register={register} errors={errors} />
          <TextArea name="product_desc" label="Description" register={register} errors={errors} maxLength="255" />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
