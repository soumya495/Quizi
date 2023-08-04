import { useEffect } from "react";
import { useState } from "react";
import TextInput from "../../reusable/TextInput";

export default function Option({
  register,
  errors,
  fieldName,
  checkFieldName,
  label,
  placeholder,
  required,
  setValue,
  watch,
}) {
  const [checkDisabled, setCheckDisabled] = useState(true);

  const optionValue = watch([`${fieldName}`]);

  useEffect(() => {
    setValue(fieldName, "");
    setValue(checkFieldName, false);
  }, []);

  useEffect(() => {
    if (optionValue[0]) {
      setCheckDisabled(false);
    } else {
      setCheckDisabled(true);
    }
  }, [optionValue]);

  return (
    <div className="flex gap-x-4">
      <input
        type="checkbox"
        disabled={checkDisabled}
        id={checkFieldName}
        {...register(checkFieldName, {})}
        className="checkbox checkbox-primary mt-12"
      />
      <TextInput
        register={register}
        errors={errors}
        fieldName={fieldName}
        label={label}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
