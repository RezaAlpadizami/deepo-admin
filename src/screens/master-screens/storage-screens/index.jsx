import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';

import Datatable from '../../../components/datatable-component';
import { StorageApi, WarehouseApi } from '../../../services/api-master';

function Screen(props) {
  const { displayName, route } = props;
  const [warehouseData, setWarhouseData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    WarehouseApi.get()
      .then(res => {
        setWarhouseData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'code',
            label: 'Code',
            max: '7',
            col: 2,
          },
          {
            name: 'rack_number',
            label: 'Rack Number',
            max: '1',
            col: 2,
          },
          {
            name: 'bay',
            label: 'Bay',
            max: '2',
            col: 2,
          },
          {
            name: 'level',
            label: 'Level',
            max: '1',
            col: 2,
          },
          {
            name: 'warehouse_id',
            label: 'Warehouse',
            type: 'select',
            data: warehouseData?.map(i => {
              return {
                value: i.id,
                label: `${i.name} - ${i.location}`,
              };
            }),
            col: 2,
          },
        ]}
        columns={[
          { header: 'Code', value: 'code', copy: true, type: 'link' },
          { header: 'Rack Number', value: 'rack_number', copy: true },
          { header: 'Bay', value: 'bay', copy: true },
          { header: 'Level', value: 'level', copy: true },
          {
            header: 'Warehouse',
            value: 'warehouse.name',
            obj: 'warehouse',
            secondValue: 'location',
            type: 'multi-value',
            copy: true,
          },
        ]}
        toolbar={{
          action: {
            add: true,
            edit: true,
            view: true,
            delete: true,
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={StorageApi}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
