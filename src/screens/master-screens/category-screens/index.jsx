import React from 'react';

import { CategoryApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { displayName, route } = props;

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'code',
            label: 'Code',
            max: '7',
            placeholder: 'Input Code',
            col: 2,
          },
          {
            name: 'name',
            label: 'Name',
            placeholder: 'Input Name',
            col: 2,
          },
        ]}
        columns={[
          { header: 'Code', value: 'code', copy: true, type: 'link', width: '30%' },
          { header: 'Name', value: 'name', copy: true, width: '50%' },
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
        api={CategoryApi}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
