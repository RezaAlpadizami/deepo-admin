import React, { useState, useEffect, useContext } from 'react';
import { Button, useMediaQuery } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductApi, ProductInfoApi, ProductJourney } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import LoadingComponent from '../../../components/loading-component';
import Stepper from '../../../components/stepper-component';
import { toCalculate } from '../../../utils/helper';
import Context from '../../../context';

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

  console.log('storageDetails', storageDetails);
  console.log('loading', loading);

  useEffect(() => {
    store.setIsDrawerOpen(isLarge);
  }, [isLarge, store]);

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
        const dataInfo = JSON.parse(result[1].value?.product?.product_info);
        console.log('dataInfo', dataInfo);
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
            ...new Map(dataInfo.map(i => [JSON.stringify(i.warehouse_id), i.warehouse_id])).values(),
          ];

          console.log('filterWarehouse', filterWarehouseInfo);

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

          console.log('filterWarehouse', body);
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
      <div className={`${isLarge ? 'grid-cols-3' : 'grid-cols-2'} grid grid-flow-row-dense`}>
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
              <div
                className={`flex ${
                  isLarge ? 'text-md mt-2' : 'text-sm mt-4'
                } bg-white rounded-[30px] drop-shadow-md h-10 px-5 py-2`}
              >
                <p>Total Product</p>
                <div className="flex-1" />
                <strong className="mr-5">{quantity || '-'}</strong>
              </div>
            </div>
            <div className="h-[300px] pb-4">
              <div className={`bg-white rounded-[30px] drop-shadow-md mt-5 p-5 h-full w-full overflow-y-auto `}>
                <strong>Product Journey</strong>
                <div className="bg-white rounded-[30px] drop-shadow-md h-[95%] mt-2 pt-10 pl-3 pr-3">
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
                {/* <strong className="text-gray-400 tracking-wide">Warehouse</strong>
                <LoadingComponent visible={loading} />
                {storageDetails?.map((i, idx) => {
                  return (
                    <>
                      <div className="flex mb-2 mt-2 border-b-gray-200 border-b-2 pb-2" key={idx}>
                        <strong>{i.warehouse}</strong>
                        <div className="flex-1" />
                        <strong className="mr-5 font-bold">{toCalculate(i.storage, 'total')}</strong>
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
                                } rounded-full bg-[#288278] outline outline-[#1b5952] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold`}
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
                                } rounded-full bg-[#288278] outline outline-[#1b5952]  drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold`}
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
                                } rounded-full bg-[#288278] outline outline-[#1b5952]  drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold`}
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
                      })} */}
                {/* </> */}
                {/* ); */}
                {/* })} */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className={`${isLarge ? 'pl-1' : 'mt-4 ml-6 mx-auto'} row-span-2`}></div> */}
      </div>
    </>
  );
}

export default ShowScreen;
