import React from 'react';
// import { WarehouseApi } from '../../../services/api-master';
import { UomApi } from '../../../services/api-master';
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
            label: 'Unit of Measurement',
            col: 2,
          },
        ]}
        columns={[
          { header: 'Code', value: 'code', copy: true, type: 'link' },
          { header: 'Unit of Measurement', value: 'name', copy: true },
          { header: 'Description', value: 'description', copy: true },
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
        api={UomApi}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
