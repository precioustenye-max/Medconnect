import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  required = false,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-base font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}        // ✅ controlled input
        onChange={onChange}  // ✅ CRITICAL
        className="w-full px-4 py-3 border border-gray-300 rounded-md"
        {...rest}
      />
    </div>
  );
};

export default Input;

