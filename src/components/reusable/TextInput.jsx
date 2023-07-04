export default function TextInput({
  register,
  errors,
  fieldName,
  label,
  placeholder,
  required = false,
  validate = {},
}) {
  const requiredMessage = required ? `${label} is required` : false;

  return (
    <div className="form-control w-full">
      <label className="label" htmlFor={label}>
        <span className="label-text">{label}</span>
      </label>
      <input
        id={label}
        placeholder={placeholder}
        className={`input w-full max-w-none input-bordered ${
          errors[`${fieldName}`] ? "input-error" : "input-primary"
        } w-full`}
        {...register(`${fieldName}`, { required: requiredMessage, validate })}
      />
      {errors[`${fieldName}`]?.message && (
        <span className="text-xs text-red-500 pt-1">
          {errors[`${fieldName}`]?.message}
        </span>
      )}
    </div>
  );
}
