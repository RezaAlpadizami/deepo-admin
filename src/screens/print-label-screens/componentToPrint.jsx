import * as React from 'react';

const ComponentToPrint = React.forwardRef((props, ref) => {
  console.log(props);
  return (
    <div ref={ref} className="grid items-start justify-items-center gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
      {props.text && props.text.map(value => <div>{value.product_name}</div>)}
    </div>
  );
});

export default ComponentToPrint;
