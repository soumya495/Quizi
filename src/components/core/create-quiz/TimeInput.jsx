export default function TimeInput({
  register,
  errors,
  label,
  fieldName,
  setValue,
}) {
  return (
    <div className="form-control">
      <label className="label" htmlFor={label}>
        <span className="label-text">{label}</span>
      </label>
      <input
        type="number"
        id={label}
        placeholder={`${label}...`}
        className={`input w-full max-w-none input-bordered ${
          errors[`${fieldName}`] ? "input-error" : "input-primary"
        } w-full`}
        {...register(`${fieldName}`, {
          required: `${label} is required`,
          min: {
            value: 0,
            message: `${label} cannot be less than 1`,
          },
          maxLength: {
            value: 2,
            message: `${label} cannot be more than 2 digits`,
          },
        })}
        onChange={(e) => {
          if (e.target.value.length > 2) {
            e.target.value = e.target.value.slice(0, 2);
          }
          setValue(`${fieldName}`, e.target.value);
        }}
      />
      {errors[`${fieldName}`] && (
        <span className="text-xs text-red-500 pt-1">
          {errors[`${fieldName}`].message}
        </span>
      )}
    </div>
  );
}
