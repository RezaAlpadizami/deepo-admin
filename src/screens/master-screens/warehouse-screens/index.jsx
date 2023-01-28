import React from 'react';
import { WarehouseApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;

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
            name: 'name',
            label: 'Name',
            col: 2,
          },
          {
            name: 'location',
            label: 'Location',
            col: 2,
          },
          {
            name: 'last_stock_opname_from',
            label: 'Last Stock Opname From',
            type: 'date_picker',
            col: 2,
          },
          {
            name: 'last_stock_opname_to',
            label: 'Last Stock Opname To',
            type: 'date_picker',
            col: 2,
          },
        ]}
        columns={[
          { header: 'Code', value: 'code', copy: true, type: 'link', width: '10%' },
          { header: 'Name', value: 'name', copy: true, width: '15%' },
          { header: 'Location', value: 'location', copy: true, width: '15%' },
          { header: 'Address', value: 'address', copy: true, width: '15%' },
          { header: 'Capacity', value: 'capacity', copy: true, width: '15%' },
          { header: 'Last Stock Opname', value: 'last_stock_opname', copy: true, type: 'date', width: '15%' },
          { header: 'Warehouse Phone', value: 'phone', copy: true, width: '25%' },
        ]}
        toolbar={{
          action: {
            add: true,
            edit: true,
            delete: true,
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={WarehouseApi}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
