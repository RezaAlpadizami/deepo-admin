import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';

import { ProductApi, ProductJourney, WarehouseApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { displayName, route } = props;
  const [warehouseData, setWarhouseData] = useState([]);
  const [productData, setProductData] = useState([]);

  const activityProduct = [
    { activity_name: 'INBOUND' },
    { activity_name: 'OUTBOUND' },
    { activity_name: 'RELOCATE-IN' },
    { activity_name: 'RELOCATE-OUT' },
  ];

  useEffect(() => {
    getDataWarehouse();
    getDataWProduct();
  }, []);

  const getDataWarehouse = () => {
    WarehouseApi.get()
      .then(res => {
        setWarhouseData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  const getDataWProduct = () => {
    ProductApi.get()
      .then(res => {
        setProductData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  return (
    <div className="">
      <Datatable
        identifierProperties="product_id"
        filters={[
          {
            name: 'request_number',
            label: 'Request Number',
            col: 2,
          },
          {
            name: 'product_sku',
            label: 'SKU',
            col: 2,
          },
          {
            name: 'product_name',
            label: 'Product Name',
            type: 'select',
            data: productData?.map(i => {
              return {
                value: i.product_name,
                label: i.product_name,
              };
            }),
            col: 2,
          },
          {
            name: 'activity_name',
            label: 'Activity',
            type: 'select',
            data: activityProduct?.map(i => {
              return {
                value: i.activity_name,
                label: i.activity_name,
              };
            }),
            col: 2,
          },
          {
            name: 'activity_date',
            label: 'Activity Date',
            type: 'date_picker',
            col: 2,
          },
          {
            name: 'warehouse_name',
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
          { header: 'Request Number', value: 'request_number', copy: true, type: 'link' },
          { header: 'Activity Name', value: 'activity_name', copy: true },
          { header: 'Activity Date', value: 'activity_date', copy: true, type: 'date' },
          { header: 'Notes', value: 'notes', copy: true },
          { header: 'Product ID', value: 'product_id', copy: true },
          { header: 'SKU', value: 'product_sku', copy: true },
          { header: 'Product Name', value: 'product_name', copy: true },
          { header: 'Product Category', value: 'product_category', copy: true },
          { header: 'QTY', value: 'qty', copy: true },
          { header: 'Warehouse ID', value: 'warehouse_id', copy: true },
          { header: 'Warehouse Code', value: 'warehouse_code', copy: true },
          { header: 'Warehouse Name', value: 'warehouse_name', copy: true },
          { header: 'Storage ID', value: 'storage_id', copy: true },
          { header: 'Rack', value: 'rack', copy: true },
          { header: 'Bay', value: 'bay', copy: true },
          { header: 'Level', value: 'level', copy: true },
          { header: 'Create at', value: 'create_at', copy: true, type: 'date' },
        ]}
        toolbar={{
          action: {
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={ProductJourney}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
