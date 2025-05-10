import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";
import debounce from "lodash/debounce";

type Prediction = {
  description: string;
  place_id: string;
};

type PlacesComboboxProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  types?: string[];
  errorMessage?: string;
};

export function PlacesCombobox({
  value,
  onChange,
  placeholder = "Enter a location",
  label = "Location",
  className,
  types = ["(cities)"],
  errorMessage = "Location search is currently unavailable",
}: PlacesComboboxProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value || ""); // Local input state
  const dropdownRef = useRef(false); // Ref to track dropdown interaction

  // Sync inputValue with the parent value when it changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounced function to fetch predictions
  const searchPlaces = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 2) {
        setPredictions([]);
        setIsOpen(false);
        return;
      }

      setIsSearching(true);
      setError(false);

      try {
        const params = new URLSearchParams({
          input: query,
          ...(types?.length && { types: types.join("|") }),
        });

        const url = `/api/places/autocomplete?${params}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }

        const data = await response.json();

        if (data.status === "OK") {
          setPredictions(data.predictions);
          setIsOpen(true);
        } else if (data.status === "REQUEST_DENIED") {
          setError(true);
          setPredictions([]);
          setIsOpen(false);
        } else {
          setPredictions([]);
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to search places:", error);
        setError(true);
        setPredictions([]);
        setIsOpen(false);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [types]
  );

  const handleSelected = useCallback(
    (newValue: string) => {
      setInputValue(newValue); // Update the local input value
      onChange(newValue || null); // Update the parent value
      setIsOpen(false); // Close the dropdown
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (newValue: string) => {
      setInputValue(newValue); // Update the local input value
      searchPlaces(newValue); // Fetch predictions
    },
    [searchPlaces]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onChange(inputValue); // Commit the current input value
        setIsOpen(false);
      } else if (event.key === "Escape") {
        setInputValue(value || ""); // Revert to the original value
        setIsOpen(false);
      }
    },
    [inputValue, onChange, value]
  );

  const handleBlur = useCallback(() => {
    if (!dropdownRef.current) {
      onChange(inputValue); // Commit the current input value on blur
      setIsOpen(false);
    }
  }, [inputValue, onChange]);

  const options = useMemo(
    () =>
      predictions.map((p) => ({
        label: p.description,
        value: p.description,
      })),
    [predictions]
  );

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        value={inputValue} // Controlled by local state
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter and Escape keys
        onFocus={() => setIsOpen(true)} // Open dropdown on focus
        onBlur={handleBlur} // Commit value on blur
      />
      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
          onMouseEnter={() => (dropdownRef.current = true)} // Track dropdown interaction
          onMouseLeave={() => (dropdownRef.current = false)} // Reset dropdown interaction
        >
          {isSearching && (
            <div className="p-2 text-sm text-gray-500">Searching...</div>
          )}
          {error && (
            <div className="p-2 text-sm text-red-500">{errorMessage}</div>
          )}
          {!isSearching && !error && options.length === 0 && (
            <div className="p-2 text-sm text-gray-500">No results found</div>
          )}
          {!isSearching &&
            !error &&
            options.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelected(option.value)} // Update the value when an option is selected
              >
                {option.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
