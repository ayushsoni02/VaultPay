import React, { forwardRef } from "react";

export const InputBox = forwardRef(({ placeholder, label, type = "text" }, ref) => {
  return (
    <div className="flex flex-col mb-2">
      <label className="text-sm font-medium">{label}</label>
      <input ref={ref} type={type} placeholder={placeholder} className="border p-2 rounded-md" />
    </div>
  );
});