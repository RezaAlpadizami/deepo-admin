import React from 'react';
import { Input } from '@chakra-ui/react';

function InputComponent(props) {
  const {
    name,
    label,
    maxLength = 100,
    disabled,
    type = 'text',
    register,
    errors,
    hidden = false,
    placeholder,
  } = props;

  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-light text-black block ml-1">
          {label}
        </label>
        <div className="mt-1 flex">
          <Input
            {...register(name)}
            bg="white"
            size="sm"
            width="auto"
            type={type}
            isDisabled={disabled}
            maxLength={maxLength}
            hidden={hidden}
            name={name}
            id={name}
            isInvalid={errors[name]}
            className="w-full text-sm rounded-full border-gray-400 px-5 py-5"
            placeholder={placeholder}
          />
        </div>
      </div>
      {errors[name] && (
        <span className="text-red-700 text-xs ml-1">{errors[name]?.message.replace(name, label.toLowerCase())}</span>
      )}
    </div>
  );
}

export default InputComponent;
