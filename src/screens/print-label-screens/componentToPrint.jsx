import * as React from 'react';
import Barcode from 'react-barcode';

const ComponentToPrint = React.forwardRef((props, ref) => {
  if (props.text.length > 0) {
    console.log(JSON.parse(props.text[0].product));
  }
  return (
    <div
      ref={ref}
      className="grid items-start mb-4 mt-4"
      style={{ gridTemplateColumns: 'repeat(2, minmax(0, max-content))', marginLeft: '116px' }}
    >
      {props.text &&
        props.text.map(value => (
          <div style={{ height: '96px', width: '291px' }}>
            <div style={{ paddingLeft: '25px' }}>{JSON.parse(value.product).product_name}</div>
            <div>
              <Barcode
                value={JSON.parse(value.product).sku}
                displayValue={false}
                margin={1}
                marginLeft={25}
                height={30}
              />
            </div>
            <div style={{ paddingLeft: '25px' }}>{JSON.parse(value.product).sku}</div>
          </div>
        ))}
    </div>
  );
});

export default ComponentToPrint;
