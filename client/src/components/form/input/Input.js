function Input({ labelFor, labelTitle, inputType, setChange, inputVal }) {
  return (
    <div className="form__group">
      <label htmlFor={labelFor}>{labelTitle}</label>
      <input
        type={inputType}
        onChange={(e) => {
          {
            setChange(e.target.value);
          }
        }}
        value={inputVal}
      />
    </div>
  );
}
export default Input;
