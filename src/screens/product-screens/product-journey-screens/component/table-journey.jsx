import React from 'react';
import Moment from 'moment/moment';
import LottiesAnimation from '../../../../components/lotties-animation-component';
import Loading from '../../../../assets/lotties/Loading.json';

function JourneyTable(props) {
  const { data, isLarge, loading } = props;
  console.log('data', data);

  const th = `${isLarge ? 'px-8 text-sm' : 'px-4 text-xs'} text-bold text-[#000] text-center py-1.5 tracking-wide`;
  const td = 'text-[#000] text-center py-1.5 break-words';

  if (loading) {
    return (
      <div className="w-full h-full max-h-[453px] overflow-y-auto overflow-x-hidden">
        <LottiesAnimation
          animationsData={Loading}
          visible={loading}
          classCustom={`absolute z-[999] ${
            isLarge ? 'right-7 left-[60%] top-[42%]' : 'right-8 left-8'
          } opacity-100 flex flex-col items-center justify-center`}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full my-6 max-h-[453px] overflow-y-auto overflow-x-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F5F5] text-bold mx-auto [&>*]:text-md">
            <th className={`${th}`}>Activity</th>
            <th className={`${th}`}>ID</th>
            <th className={`${th}`}>Date</th>
            <th className={`${th}`}>Qty</th>
            <th className={`${th}`}>Location</th>
            <th className={`${th}`}>Rack</th>
            <th className={`${th}`}>Bay</th>
            <th className={`${th}`}>Level</th>
          </tr>
        </thead>

        <tbody className="h-16">
          {data?.journey?.length > 0 ? (
            data?.journey?.map((d, i) => {
              return (
                <tr key={i} className={`${i % 2 ? 'bg-[#f3f4f6]' : 'bg-[#ffff]'} [&>*]:text-xs`}>
                  <td className={`${td} w-[5%]`}>{d?.activity_name}</td>
                  <td className={`${td} w-[20%]`}>{d?.request_number}</td>
                  <td className={`${td} w-[20%]`}>{Moment(d?.activity_date).format('DD/MM/YYYY')}</td>
                  <td className="w-[5%] text-center">{d?.qty}</td>
                  <td className="w-[20%] text-center">{d?.warehouse_name}</td>
                  <td className="w-[5%] text-center">{d?.storage_rack}</td>
                  <td className="w-[5%] text-center">{d?.storage_bay}</td>
                  <td className="w-[5%] text-center">{d?.storage_level}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="text-center bg-[#fff] py-1.5 text-[#868689] tracking-wide">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default JourneyTable;
