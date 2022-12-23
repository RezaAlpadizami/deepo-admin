import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';

import { ProductApi, CategoryApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { displayName, route } = props;
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    getDataCategory();
  }, []);

  const getDataCategory = () => {
    CategoryApi.get()
      .then(res => {
        setCategoryData(res.data);
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
            data: categoryData?.map(i => {
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
          { header: 'Product Name', value: 'product_name', copy: true },
          { header: 'Category', value: 'category.name', copy: true },
          { header: 'Product Description', value: 'product_desc', copy: true, width: 'auto' },
        ]}
        toolbar={{
          action: {
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
