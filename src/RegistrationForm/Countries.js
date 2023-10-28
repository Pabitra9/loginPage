import React from 'react';

const CountrySelect = ({ countries, onChange }) => {
  return (
    <div>
      {/* <h1>Select a Country</h1> */}
      <select onChange={onChange} className="w-full px-3 py-2 border-[#E2E8F0] border-[1px] rounded-md focus:outline-none focus:outline-4 focus:outline-[#bfd3e8] transition-all duration-75 ease-linear" required>
        <option value="">-Select-</option>
        {countries.map((country, index) => (
          <option key={index} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
