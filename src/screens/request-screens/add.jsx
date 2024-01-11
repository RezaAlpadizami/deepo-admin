import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import Input from '../../components/input-component';
import { ProductApi, WarehouseApi } from '../../services/api-master';
import Select from '../../components/select-component';
import { RequestApi } from '../../services/api-transit';
import TextArea from '../../components/textarea-component';
import DatePicker from '../../components/datepicker-component';
// import CookieService from '../../../services/cookies/cookie-service';
import LoadingHover from '../../components/loading-hover-component';
import Table from '../../components/table-support-component';

function Screen(props) {
  const { displayName } = props;
  const navigate = useNavigate();

  const [dataProduct, setDataProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataAdd, setDataAdd] = useState([]);
  const [warehouseData, setWarhouseData] = useState([]);

  const activityProduct = [{ activity_name: 'INBOUND' }, { activity_name: 'OUTBOUND' }];

  const schemaAddProduct = yup.object().shape({
    product_id: yup.string().nullable().required(),
    qty: yup.number().nullable().min(1, 'The minimum qty is one').typeError('please input quantity').required(),
  });

  const schemaSubmitRequest = yup.object().shape({
    activity_name: yup.string().nullable().required(),
    activity_date: yup.date().nullable().required(),
    notes: yup.string().nullable().max(255).required(),
    warehouse_id: yup.string().nullable().required(),
  });

  const {
    register: registerProd,
    control: controlProd,
    formState: { errors: errorsProd },
    reset,
    handleSubmit: handleSubmitProd,
  } = useForm({
    resolver: yupResolver(schemaAddProduct),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSubmitRequest),
  });

  useEffect(() => {
    WarehouseApi.get()
      .then(res => {
        setWarhouseData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, []);

  useEffect(() => {
    getData();
  }, [dataAdd]);

  useEffect(() => {
    setValue('activity_date', new Date());
  }, [setValue]);

  const getData = () => {
    ProductApi.get()
      .then(res => {
        setDataProduct(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  const onAddProdRequestDetail = dataInput => {
    const dataInputAddArray = [dataProduct.find(obj => obj.id === Number(dataInput.product_id))];
    const handleDataAdd = dataInputAddArray.map(data => {
      return {
        product_id: dataInput.product_id,
        product_sku: data.sku,
        product_name: data.product_name,
        qty: dataInput.qty,
      };
    });
    setDataAdd(state => [...state, ...handleDataAdd]);
    reset();
  };

  const handleRemove = product_id => {
    setDataAdd(dataAdd.filter(item => item.product_id !== product_id));
  };

  const updateDataAdd = Object.values(
    Array.isArray(dataAdd)
      ? dataAdd.reduce((accu, { product_id, ...item }) => {
          if (!accu[product_id])
            accu[product_id] = {
              qty: 0,
            };

          accu[product_id] = {
            product_id,
            ...accu[product_id],
            ...item,
            qty: accu[product_id].qty + item.qty,
          };

          return accu;
        }, {})
      : []
  );

  const onSubmitRequest = data => {
    setLoading(true);
    RequestApi.store({
      request_by: 'User',
      warehouse_id: data.warehouse_id,
      notes: data.notes,
      activity_date: data.activity_date,
      activity_name: data.activity_name,
      detail: updateDataAdd.map(data => {
        return {
          qty: data.qty,
          product_id: data.product_id,
        };
      }),
    })
      .then(() => {
        setLoading(false);
        Swal.fire({
          text: 'Request baru berhasil ditambahkan',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonColor: 'primarydeepo',
          confirmButtonText: `<p class="rounded bg-secondarydeepo text-[#fff] px-5 py-2 ml-5 font-bold">OK</p>`,
        });
        navigate('/request');
      })
      .catch(error => {
        setLoading(false);
        if (error.message === 'Validation Failed') {
          Swal.fire({ text: 'Product or Qty still empty', icon: 'error' });
        } else {
          Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
        }
      });
  };

  return (
    <div>
      <div className="px-5 py-4">
        <div className="flex mb-6">
          <button type="button">
            <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
          </button>
          <h1 className="font-bold text-xl">{displayName}</h1>
          <div className="flex-1" />
        </div>
        <div className="grid-cols-2 gap-4 flex max-[640px]:flex-col sm:flex-col lg:flex-row">
          <div className="w-full h-full">
            {/* <h5 className="text-gray-400 px-8 mb-1">Request</h5> */}
            <fieldset className="bg-white border border-[#C2C2C2] w-full min-h-[507px] py-12 rounded-md max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
              <legend className="px-2 text-lg text-gray-400">Request</legend>
              <div className="mb-6 justify-center max-[640px]:flex-col sm:flex-col lg:flex-row">
                <div className="w-full">
                  <Select
                    name="warehouse_id"
                    label="Warehouse"
                    placeholder="Warehouse"
                    options={warehouseData?.map(i => {
                      return {
                        value: i.id,
                        label: `${i.name} ${i.location}`,
                      };
                    })}
                    register={register}
                    errors={errors}
                  />
                  <Select
                    name="activity_name"
                    label="Activity"
                    options={activityProduct?.map(i => {
                      return {
                        value: i.activity_name,
                        label: i.activity_name,
                      };
                    })}
                    register={register}
                    errors={errors}
                    placeholder="Activity"
                  />
                </div>
                <div className="w-full">
                  <DatePicker
                    name="activity_date"
                    label="Date"
                    placeholder="Date / Month / Year"
                    register={register}
                    control={control}
                    errors={errors}
                  />
                </div>
              </div>
              <div>
                <TextArea name="notes" label="Notes" register={register} errors={errors} />
              </div>
            </fieldset>
          </div>
          <div className="w-full h-full">
            {/* <h6 className="text-gray-400 px-8 mb-1">Request Detail</h6> */}
            <fieldset className="bg-white border border-[#C2C2C2] w-full min-h-[507px] py-12 rounded-md max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
              <legend className="px-2 text-lg text-gray-400">Request Detail</legend>
              <form onSubmit={handleSubmitProd(onAddProdRequestDetail)}>
                <div className="justify-center max-[640px]:flex-col sm:flex-col lg:flex-row">
                  <div className="w-full col-span-2">
                    <Select
                      name="product_id"
                      label="Product"
                      options={dataProduct?.map(i => {
                        return {
                          value: i.id,
                          label: i.product_name,
                        };
                      })}
                      register={registerProd}
                      control={controlProd}
                      errors={errorsProd}
                      placeholder="Product"
                    />
                  </div>
                  <div className="">
                    <Input name="qty" label="QTY" register={registerProd} errors={errorsProd} control={controlProd} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button px={8} type="submit" size="sm" className="rounded-md bg-[#50B8C1] text-[#fff] mr-6">
                    + Add
                  </Button>
                </div>
              </form>
              <div className="border-b border-gray-400 my-6"> </div>

              <Table
                // loading={loadtable}
                data={updateDataAdd.map(data => {
                  return {
                    product_id: data.product_id,
                    product_name: data.product_name,
                    product_sku: data.product_sku,
                    qty: data.qty,
                  };
                })}
                register
                handleRemove={handleRemove}
                // isLarge={isLarge}
              />
            </fieldset>
          </div>
        </div>
        <div className="flex justify-end mt-12 max-[640px]:justify-start max-[640px]:mt-12">
          <div className="flex">
            <div>
              <Button
                onClick={() => navigate(-1)}
                px={8}
                size="sm"
                className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-bold"
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmitRequest)}
                px={8}
                size="sm"
                className="ml-4 rounded-md bg-gradient-to-r from-[#50B8C1] to-[#50B8C1] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-[#50B8C1] drop-shadow-md text-[#fff] font-bold  mr-14"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
