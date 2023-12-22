import React, { useState, useEffect, useContext } from 'react';
import { useMediaQuery } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ProductApi, ProductInfoApi, ProductJourney, WarehouseApi } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import LoadingComponent from '../../../components/loading-component';
// import Stepper from '../../../components/stepper-component';
import { toCalculate } from '../../../utils/helper';
import Context from '../../../context';
import ProgressStepBar from '../../../components/stepper';
import Select from '../../../components/select-component';

function ShowScreen(props) {
  const { displayName } = props;
  const { store } = useContext(Context);
  const [isLarge] = useMediaQuery('(min-width: 1224px)');
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();
  const [dataJourney, setDataJourney] = useState([]);
  const [storageDetails, setStorageDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJourney, setLoadingJourney] = useState(false);
  const [quantity, setQuantity] = useState();
  const [warehouseData, setWarhouseData] = useState([]);

  const {
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    store.setIsDrawerOpen(isLarge);
  }, [isLarge, store]);

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
    // setLoading(true);
    setLoadingJourney(true);
    Promise.allSettled([
      ProductJourney.find(id).then(res => {
        return res;
      }),
      ProductInfoApi.find(id).then(res => {
        return res;
      }),
      ProductApi.find(id).then(res => {
        return res;
      }),
    ])
      .then(result => {
        console.log('result', result);
        const dataInfo = result[1].value?.product?.product_info;
        console.log('dataInfo', dataInfo);
        if (result[0].status === 'fulfilled' && result[1].status === 'fulfilled' && result[2].status === 'fulfilled') {
          setData(result[2].value);

          setDataJourney(
            result[0].value.journey.map(i => {
              return {
                activity_name: i.activity_name,
                request_number: i.request_number,
                date: i.activity_date,
                qty: i.qty,
              };
            })
          );

          setLoadingJourney(false);

          const filterWarehouseInfo = [
            ...new Map(dataInfo.map(i => [JSON.stringify(i.warehouse_id), i.warehouse_id])).values(),
          ];

          const body = {
            storage_details: filterWarehouseInfo.map(f => {
              return {
                list: result[1].value?.product?.product_info
                  .filter(s => s.warehouse_id === f)
                  .map(i => {
                    return {
                      warehouse: i.warehouse_name,
                      warehouse_id: i.warehouse_id,

                      storage: [
                        {
                          rack: i.rack,
                          bay: i.bay,
                          level: i.level,
                          total: i.qty,
                        },
                      ],
                    };
                  }),
              };
            }),
          };

          if (body.storage_details.length > 0) {
            setQuantity(toCalculate(result[1]?.value?.product?.product_info, 'qty') || 0);

            setStorageDetails(
              body.storage_details.map(i => {
                return {
                  storage: i.list
                    // .filter(f => f.warehouse_id === filterWarehouseInfo[idx])
                    .map(m => {
                      return m.storage[0];
                    }),
                  warehouse: i.list.length > 0 ? i.list[0]?.warehouse : '',
                };
              })
            );
          }
          setLoading(false);
        } else if (result[0].status === 'rejected' || result[1].status === 'rejected') {
          if (result[0].status === 'rejected') {
            Swal.fire({ text: `${result[0].reason?.message}`, icon: 'error' });
          } else if (result[1].status === 'rejected') {
            Swal.fire({ text: `${result[1].reason?.message}`, icon: 'error' });
          } else {
            Swal.fire({ text: 'Something Went Wrong', icon: 'error' });
          }
        }
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  return (
    <>
      <div className={`flex ${isLarge ? 'mb-12' : 'mb-6'}`}>
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className={`${isLarge ? 'text-xl' : 'text-lg'} font-bold `}>{displayName}</h1>
        <div className="flex-1" />
      </div>
      <div className={`${isLarge ? 'grid-cols-4' : 'grid-cols-2'} grid grid-flow-row-dense`}>
        <div className="col-span-2">
          <div className="col-span-2 px-4">
            <fieldset className="bg-white border border-[#C2C2C2] w-full py-4 rounded-md max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
              <legend className="px-2 text-lg text-black font-semibold">Detail Product</legend>
              <div className="grid items-start justify-items-center grid-cols-2 pb-5 px-5">
                <InputDetail value={data?.product_name || '-'} label="Name" swapBold />
                <InputDetail value={data?.category?.name || '-'} label="Category" swapBold />
                <InputDetail value={data?.sku || '-'} label="SKU" swapBold />
                <InputDetail value={data?.product_desc || '-'} label="Desc" swapBold />
              </div>
            </fieldset>
            <div className="grid grid-row-2">
              <div>
                <fieldset className="bg-white border border-[#C2C2C2] w-full py-4 rounded-md max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
                  <legend className="px-2 text-lg text-black font-semibold">Storage Details</legend>
                  <div>
                    <div className={`flex ${isLarge ? 'text-md' : 'text-sm'} px-5`}>
                      <p>Total Product</p>
                      <div className="flex-1" />
                      <strong className="border px-2 rounded-md border-black">{quantity || '-'}</strong>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className=" pb-4">
                <div className="mt-5">
                  <fieldset className="bg-white border border-[#C2C2C2] w-full py-4 rounded-md max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
                    <legend className="px-2 text-lg text-black font-semibold">Product Journey</legend>
                    <LoadingComponent visible={loadingJourney} />
                    <div className="max-h-[400px] overflow-y-scroll overflow-x-hidden">
                      <div
                        className={`flex w-full ${dataJourney.length === 0 ? 'justify-center' : 'p-2 max-[640px]:p-6'}`}
                      >
                        <div className="items-center text-center flex justify-center">
                          {dataJourney.length === 0 ? (
                            <p className="text-xl font-bold">Product Journey is Empty</p>
                          ) : (
                            <div>
                              {dataJourney.map(({ activity_name, date, request_number, qty }, index) => (
                                <ProgressStepBar
                                  activity={activity_name}
                                  date={date}
                                  requestNumber={request_number}
                                  index={index}
                                  dataApi={dataJourney}
                                  key={index}
                                  qty={qty}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cols-span-2 w-max">
          <fieldset className="bg-white border border-[#C2C2C2] w-full py-4 rounded-md max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
            <legend className="px-2 text-lg text-black font-semibold">Warehouse</legend>
            <LoadingComponent visible={loading} />
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
            {storageDetails?.map((i, idx) => {
              return (
                <>
                  <div className="flex mb-2 mt-2 border-b-gray-200 border-b-2 pb-2" key={idx}>
                    <strong>{i.warehouse}</strong>
                    <div className="flex-1" />
                    <strong className="mr-4 font-bold border px-2 py-1 rounded-md text-white text-xs bg-[#50B8C1]">
                      {toCalculate(i.storage, 'total')}
                    </strong>
                  </div>
                  {i.storage.map((s, sIdx) => {
                    return (
                      <div className="grid grid-cols-6" key={sIdx}>
                        <div className="mb-3">
                          <p className={`${isLarge ? 'px-5' : 'px-1'} mb-2 text-gray-800`}>Rack</p>
                          <span
                            size="sm"
                            // px={8}
                            className={`${
                              isLarge ? 'ml-4 px-6' : 'px-4'
                            } rounded-md bg-[#fff] outline outline-[#50B8C1] text-[#50B8C1] font-bold`}
                          >
                            {s.rack}
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className={`${isLarge ? 'px-5' : 'px-1'} mb-2 text-gray-800 w-20 px-5`}>Bay</p>
                          <span
                            size="sm"
                            // px={8}
                            className={`${
                              isLarge ? 'ml-4 px-6' : 'ml-1 px-4'
                            } rounded-md bg-[#fff] outline outline-[#50B8C1] text-[#50B8C1] font-bold`}
                          >
                            {s.bay}
                          </span>
                        </div>
                        <div>
                          <p className={`${isLarge ? 'px-5' : 'px-1'} mb-2 text-gray-800 w-20 px-5`}>Level</p>
                          <span
                            size="sm"
                            // px={8}
                            className={`${
                              isLarge ? ' ml-4 px-6' : 'ml-2 px-4'
                            } rounded-md bg-[#fff] outline outline-[#50B8C1] text-[#50B8C1] font-bold`}
                          >
                            {s.level}
                          </span>
                        </div>
                        <div className="col-span-2" />
                        <div className="my-auto mr-5 flex">
                          <div className="flex-1" />
                          <strong className="text-md">{s.total}</strong>
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })}
          </fieldset>
        </div>
      </div>
    </>
  );
}

export default ShowScreen;
