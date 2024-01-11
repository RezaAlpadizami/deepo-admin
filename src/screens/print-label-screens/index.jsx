import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import ReactToPrint from 'react-to-print';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@chakra-ui/react';
import { ProductApi } from '../../services/api-master';
import LottiesAnimation from '../../components/lotties-animation-component';
import Loading from '../../assets/lotties/Loading.json';
import Select from '../../components/select-component';
import Input from '../../components/input-component';
import ComponentToPrint from './componentToPrint';

const schema = yup.object().shape({
  product: yup.string().nullable().required(),
  copies: yup.string().required(),
});

function Screen() {
  const [productData, setProductData] = useState([]);
  const [listData, setListData] = useState([]);
  const { isLarge, loading, isRegister } = true;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const th = `${isLarge ? 'px-8 text-sm' : 'px-4 text-xs'} text-bold text-[#000]  py-1.5 tracking-wide`;
  const td = 'text-[#000] py-1.5 break-words';

  useEffect(() => {
    getDataCategory();
  }, []);

  const getDataCategory = () => {
    ProductApi.get()
      .then(res => {
        setProductData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };
  const onSubmit = value => {
    const data = [...listData];
    for (let index = 0; index < parseInt(value.copies, 10); index += 1) {
      data.push({ product: value.product });
    }
    setListData(data);
  };
  const componentRef = React.useRef(null);
  const handleAfterPrint = React.useCallback(() => {
    console.log('`onAfterPrint` called');
  }, []);
  const handleBeforePrint = React.useCallback(() => {
    console.log('`onBeforePrint` called');
  }, []);
  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log('`onBeforeGetContent` called');
  }, []);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button
        size="sm"
        px={8}
        type="submit"
        className="ml-4 rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
      >
        Print
      </Button>
    );
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid items-center justify-items-end gap-4 gap-y-12 ml-6 mb-4 grid-cols-3 mt-4">
          <Select
            name="product"
            label="Product"
            placeholder="Product"
            options={productData?.map(i => {
              return {
                value: JSON.stringify(i),
                label: `${i.product_name}`,
              };
            })}
            register={register}
            errors={errors}
          />
          <Input name="copies" label="Copies" maxLength="15" register={register} errors={errors} />
          <Button
            size="sm"
            px={8}
            type="submit"
            className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-semibold"
          >
            + Add
          </Button>
        </div>
      </form>
      <div className="border border-[#C2C2C2] rounded-md p-6">
        <div className="w-full h-full max-h-80 overflow-y-auto overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F5F5] text-bold mx-auto">
                {/* {!register && ( */}
                <th className={`text-bold text-[#000] text-center w-[5%] ${isLarge ? 'px-9 text-sm' : 'px-4 text-xs'}`}>
                  {`${!isRegister ? 'NO' : ''}`}
                </th>
                {/* )} */}
                <th className={`${th} w-[60%] text-left`}>PRODUCT</th>
                <th className={`${th} w-[35%] text-left`}>SKU</th>
              </tr>
            </thead>

            <tbody className="h-16">
              {/* <Loading visible={loadi
              ng} isLarge={isLarge} /> */}
              <LottiesAnimation
                animationsData={Loading}
                isLarge={isLarge}
                visible={loading}
                classCustom={`absolute bg-white z-[999] ${
                  isLarge ? 'right-7 left-[52%]' : 'right-8 left-8'
                } opacity-100 flex flex-col items-center justify-center`}
              />
              {listData.length > 0 ? (
                listData?.map((d, i) => {
                  return (
                    <tr key={i} className={i % 2 ? 'bg-[#f3f4f6]' : 'bg-[#ffff]'}>
                      <td className={`${td} px-4 text-sm text-center`}>{i + 1}</td>
                      <td className={`${td} px-4 text-sm text-left`}>{JSON.parse(d.product).product_name}</td>
                      <td className={`${td} px-4 text-sm text-left`}>{JSON.parse(d.product).sku}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center bg-[#fff] py-1.5 text-[#868689] tracking-wide">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end gap-y-12 ml-6 mb-4 mt-4">
        <Button
          size="sm"
          px={8}
          type="submit"
          className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-semibold"
          onClick={() => {
            setListData([]);
          }}
        >
          Reset
        </Button>
        <ReactToPrint
          content={reactToPrintContent}
          documentTitle="AwesomeFileName"
          onAfterPrint={handleAfterPrint}
          onBeforeGetContent={handleOnBeforeGetContent}
          onBeforePrint={handleBeforePrint}
          removeAfterPrint
          trigger={reactToPrintTrigger}
        />
      </div>
      <div style={{ display: 'none' }}>
        <ComponentToPrint ref={componentRef} text={listData} />
      </div>
    </div>
  );
}
export default Screen;
