import React from 'react';
import { Select } from '@chakra-ui/react';

function SelectComponent(props) {
  const { name, label, disabled, register, errors, placeholder, options, isDefaultOption } = props;

  const defaultOption = { label: 'None', value: null };

  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-semibold text-gray-600 block ml-1">
          {label}
        </label>
        <div className="mt-1 flex shadow-sm">
          <Select
            {...register(name)}
            bg="white"
            size="sm"
            name={name}
            id={name}
            className="w-full text-sm rounded-md border-gray-400 px-5 py-1.5 h-full"
            isDisabled={disabled}
            focusBorderColor="#184D47"
            placeholder={`Select ${placeholder}`}
          >
            {(isDefaultOption ? [defaultOption, ...options] || [] : options || []).map((el, idx) => (
              <option key={idx} value={el.value}>
                {el.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {errors &&
        (Array.isArray(errors[name]?.message) ? (
          errors[name]?.message.map(m => <span className="error d-block">{m.toLowerCase()}</span>)
        ) : (
          <span className="text-red-700 ml-1">
            {errors[name]?.message.replace(name, label?.toLowerCase() || name.toLowerCase())}
          </span>
        ))}
    </div>
  );
}

export default SelectComponent;
