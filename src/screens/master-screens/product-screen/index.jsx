import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ProductApi, CategoryApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;
  const [category, setCategory] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    CategoryApi.get()
      .then(res => {
        setCategory(res.data);
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
            max: '15',
            col: 2,
          },
          {
            name: 'product_name',
            label: 'Name',
            col: 2,
          },
          {
            name: 'category_id',
            label: 'Category',
            type: 'select',
            data: category?.map(i => {
              return {
                value: i.id,
                label: `${i.code} - ${i.name}`,
              };
            }),
            col: 2,
          },
        ]}
        columns={[
          { header: 'SKU', value: 'sku', copy: true, type: 'link' },
          { header: 'Name', value: 'product_name', copy: true },
          {
            header: 'Category',
            value: 'category.code',
            obj: 'category',
            secondValue: 'name',
            type: 'multi-value',
            copy: true,
          },

          { header: 'Product Description', value: 'product_desc', copy: true, width: '30%' },
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
        api={ProductApi}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
