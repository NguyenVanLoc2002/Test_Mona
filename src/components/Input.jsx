const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  return (
    <input
      min={1}
      type={type}
      className={`input input-bordered w-full ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange} // Thêm onChange để cập nhật state
    />
  );
};
export { Input };
