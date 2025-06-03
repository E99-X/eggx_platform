import { useState } from "react";

export function usePositiveNumberInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validate = (val) => {
    if (val === "") {
      setError("");
      setIsValid(true);
      return true;
    }
    const valid = /^[0-9]*\.?[0-9]*$/.test(val);
    if (!valid) {
      setError("Please enter a valid positive number");
      setIsValid(false);
      return false;
    }
    setError("");
    setIsValid(true);
    return true;
  };

  const onChange = (e) => {
    const val = e.target.value;
    if (validate(val)) {
      setValue(val);
    }
  };

  const onBlur = () => {
    if (value.endsWith(".")) {
      const cleaned = value.slice(0, -1);
      setValue(cleaned);
      validate(cleaned);
    }
  };

  return {
    value,
    onChange,
    onBlur,
    error,
    isValid,
    setValue,
  };
}
