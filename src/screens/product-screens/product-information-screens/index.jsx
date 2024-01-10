import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ProductInfoApi, WarehouseApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;

  const [warehouse, setWarehouse] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    WarehouseApi.get()
      .then(res => {
        setWarehouse(res.data);
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
            name: 'sku',
            label: 'SKU',
            max: 15,
            col: 2,
          },
          {
            name: 'product_name',
            label: 'Product Name',
            col: 2,
          },
          {
            name: 'warehouse_id',
            label: 'Warehouse',
            type: 'select',
            data: warehouse?.map(i => {
              return {
                value: i.id,
                label: `${i.name} - ${i.location}`,
              };
            }),
            col: 2,
          },
        ]}
        columns={[
          { header: 'SKU', value: 'product_sku', copy: true, type: 'link' },
          { header: 'Name', value: 'product_name', copy: true },
          {
            header: 'Warehouse',
            value: 'warehouse.name',
            obj: 'warehouse',
            secondValue: 'location',
            type: 'multi-value',
            copy: true,
            width: '30%',
          },
          { header: 'Description', value: 'product_desc', copy: true, width: '30%' },
          { header: 'Total Qty', value: 'qty', copy: true },
        ]}
        toolbar={{
          action: {
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={ProductInfoApi}
        to={route}
        displayName={displayName}
        checkbox
        info
      />
    </div>
  );
}
export default Screen;
