import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductApi, ProductInfoApi, ProductJourney } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import LoadingComponent from '../../../components/loading-component';
import Stepper from '../../../components/stepper-component';

function ShowScreen(props) {
  const { displayName } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();
  const [dataJourney, setDataJourney] = useState([]);
  const [storageDetails, setStorageDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJourney, setLoadingJourney] = useState(false);

  useEffect(() => {
    setLoading(true);
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
        if (result[0].status === 'fulfilled' && result[1].status === 'fulfilled' && result[2].status === 'fulfilled') {
          setData(result[2].value);
          setDataJourney(
            result[0].value.journey.map(i => {
              return {
                activity_name: i.activity_name,
                request_number: i.request_number,
                date: i.activity_date,
              };
            })
          );
          setLoadingJourney(false);

          const filterWarehouseInfo = [
            ...new Map(
              result[1].value?.product.product_info.map(i => [JSON.stringify(i.warehouse_id), i.warehouse_id])
            ).values(),
          ];

          const body = {
            storage_details: filterWarehouseInfo.map(f => {
              return {
                list: result[1].value.product.product_info
                  .filter(s => s.warehouse_id === f)
                  .map((i, idx) => {
                    return {
                      warehouse: i.warehouse_name,
                      warehouse_id: i.warehouse_id,
                      total_item: idx + 1,
                      storage: [
                        {
                          rack: i.rack,
                          bay: i.bay,
                          level: i.level,
                          total: i.qty || 2,
                        },
                      ],
                    };
                  }),
              };
            }),
          };

          if (body.storage_details.length > 0) {
            setStorageDetails(
              body.storage_details.map((i, idx) => {
                return {
                  storage: i.list
                    .filter(f => f.warehouse_id === filterWarehouseInfo[idx])
                    .map(m => {
                      return m.storage[0];
                    }),
                  warehouse: i.list.length > 0 ? i.list[idx]?.warehouse : '',
                  total: i.list.length > 0 ? i.list[idx]?.total_item : 0,
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
      <div className="flex mb-12">
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
      </div>
      <div className="grid grid-flow-row-dense grid-cols-3">
        <div className="col-span-2">
          <div className="col-span-2 px-4">
            <strong>Detail Product</strong>
            <div className="h-full rounded-2xl mt-3">
              <div className="grid items-start justify-items-center bg-white rounded-[30px] drop-shadow-md grid-cols-2 pb-5 px-5">
                <InputDetail value={data?.product_name || '-'} label="Name" swapBold />
                <InputDetail value={data?.category?.name || '-'} label="Category" swapBold />
                <InputDetail value={data?.sku || '-'} label="SKU" swapBold />
                <InputDetail value={data?.product_desc || '-'} label="Desc" swapBold />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 px-4 mt-4">
          <div className="grid grid-row-2">
            <strong>Storage Details</strong>
            <div>
              <div className="flex bg-white rounded-[30px] drop-shadow-md h-10 mt-2 px-5 py-2">
                <p>Total Product</p>
                <div className="flex-1" />
                <strong className="mr-5">{123}</strong>
              </div>
            </div>
            <div className="h-[300px] pb-4">
              <div
                className={`bg-white rounded-[30px] drop-shadow-md mt-5 p-5 h-full ${
                  storageDetails.length > 1 ? 'overflow-y-scroll' : ''
                }`}
              >
                <strong className="text-gray-400 tracking-wide">Warehouse</strong>
                <LoadingComponent visible={loading} />
                {storageDetails.map((i, idx) => {
                  return (
                    <>
                      <div className="flex mb-2 mt-2 border-b-gray-200 border-b-2 pb-2" key={idx}>
                        <strong>{i.warehouse}</strong>
                        <div className="flex-1" />
                        <strong className="mr-5 font-bold">{i.total}</strong>
                      </div>
                      {i.storage.map((s, sIdx) => {
                        return (
                          <div className="grid grid-cols-6" key={sIdx}>
                            <div className="mb-3">
                              <p className="mb-2 text-gray-800 px-5">Rack</p>
                              <span
                                size="sm"
                                px={8}
                                className="ml-4 rounded-full bg-[#288278] outline outline-[#1b5952] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold px-6"
                              >
                                {s.rack}
                              </span>
                            </div>
                            <div className="mb-3">
                              <p className="mb-2 text-gray-800 w-20 px-5">Bay</p>
                              <span
                                size="sm"
                                px={8}
                                className="ml-4 rounded-full bg-[#288278] outline outline-[#1b5952]  drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold px-6"
                              >
                                {s.bay}
                              </span>
                            </div>
                            <div>
                              <p className="mb-2 text-gray-800 w-20 px-5">Level</p>
                              <span
                                size="sm"
                                px={8}
                                className="ml-4 rounded-full bg-[#288278] outline outline-[#1b5952]  drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold px-6"
                              >
                                {s.level}
                              </span>
                            </div>
                            <div className="col-span-2" />
                            <div className="my-auto mr-5 flex">
                              <div className="flex-1" />
                              <strong>{s.total}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-2 pl-1">
          <strong>Product Journey</strong>
          <div className="bg-white rounded-[30px] drop-shadow-md h-[95%] rounded-3xl mt-2 pt-10 pl-3 pr-3">
            <LoadingComponent visible={loadingJourney} />
            <Stepper data={dataJourney} />
            {dataJourney.length >= 5 && (
              <div className="flex justify-center">
                <Button
                  _hover={{
                    shadow: 'md',
                    transform: 'translateY(-5px)',
                    transitionDuration: '0.2s',
                    transitionTimingFunction: 'ease-in-out',
                  }}
                  type="submit"
                  size="sm"
                  px={8}
                  className="ml-4 rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold"
                  onClick={() => navigate(`/product/product-journey/${id}/show`)}
                >
                  More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowScreen;
