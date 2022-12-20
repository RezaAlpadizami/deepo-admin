import React from 'react';

import { ProductJourney } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { displayName, route } = props;

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
            col: 2,
          },
          {
            name: 'activity_name',
            label: 'Activity',
            placeholder: 'Input Activity',
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
