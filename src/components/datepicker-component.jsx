import React from 'react';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import { Input, InputRightElement, InputGroup, useMediaQuery } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { CalendarIcon } from '@heroicons/react/outline';

import 'react-datepicker/dist/react-datepicker.css';

function InputElement(props) {
  const { errors, name, placeholder, isLarge } = props;

  return (
    <InputGroup size="sm">
      <Input
        {...props}
        bg="white"
        size="sm"
        width="auto"
        placeholder={placeholder}
        focusBorderColor="primarydeepo"
        type="text"
        isInvalid={errors[name]}
        className="w-full text-sm border-gray-400 py-5 rounded-full px-8"
      />
      <InputRightElement {...props} className={`${isLarge ? 'w-14' : ' w-10'}  rounded-r-full bg-primarydeepo h-full`}>
        <CalendarIcon color="white" className="w-5 h-5 mt-0.5" />
      </InputRightElement>
    </InputGroup>
  );
}

function SelectComponent(props) {
  const [isLarge] = useMediaQuery('(min-width: 1224px)');
  const { name, label, disabled, register, control, errors, placeholder = 'day / month / year' } = props;
  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-light text-black block ml-1">
          {label}
        </label>
        <div className="mt-1 flex">
          <Controller
            name={name}
            render={({ field: { onChange, value, name } }) => {
              return (
                <DatePicker
                  name={name}
                  disabled={disabled}
                  placeholderText={placeholder}
                  selected={value}
                  value={value ? Moment(value).format('DD / MMMM / YYYY') : value}
                  autoComplete="off"
                  onChange={onChange}
                  id={name}
                  customInput={<InputElement errors={errors} placeholder={placeholder} isLarge={isLarge} />}
                  className="py-6"
                />
              );
            }}
            refs={register}
            control={control}
          />
        </div>
      </div>
      {errors[name] && (
        <span className="text-red-700 ml-1">{errors[name]?.message.replace(name, label.toLowerCase())}</span>
      )}
    </div>
  );
}

export default SelectComponent;
