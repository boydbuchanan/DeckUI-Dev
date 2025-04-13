import * as React from "react";
import { useCallback, useState, useMemo } from "react";
import debounce from "lodash/debounce";
// npm i --save-dev @types/lodash
import { Combobox, Input } from "@deckai/deck-ui";

export type PlacesComboboxProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  /** Restrict the search to specific place types (e.g. ['(cities)'], ['address']) */
  types?: string[];
  /** Error message to display when API key is missing */
  errorMessage?: string;
};

type Prediction = {
  description: string;
  place_id: string;
};

type PlacesAutocompleteResponse = {
  predictions: Array<{
    description: string;
    place_id: string;
  }>;
  status: string;
};

export function PlacesCombobox({
  value,
  onChange,
  placeholder = "Enter a location",
  label = "Location",
  className,
  types = ["(cities)"],
  errorMessage = "Location search is currently unavailable"
}: PlacesComboboxProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(false);

  const searchPlaces = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 2) {
        setPredictions([]);
        return;
      }

      //setIsSearching(true);
      setError(false);

      try {
        const params = new URLSearchParams({
          input: query,
          ...(types?.length && { types: types.join("|") })
        });

        const url = `/api/places/autocomplete?${params}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }

        const data: PlacesAutocompleteResponse = await response.json();

        if (data.status === "OK") {
          setPredictions(data.predictions);
        } else if (data.status === "REQUEST_DENIED") {
          setError(true);
          setPredictions([]);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.error("Failed to search places:", error);
        setError(true);
        setPredictions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [types]
  );

  const handleSelected = useCallback(
    (newValue: string) => {
      onChange(newValue || null);
    },
    [onChange]
  );
  const handleChange = useCallback(
    (newValue: string) => {
      searchPlaces(newValue);
    },
    [searchPlaces]
  );

  const options = useMemo(
    () =>
      predictions.map((p) => ({
        label: p.description,
        value: p.description
      })),
    [predictions]
  );

  return (
    <>
      <Combobox
        value={value || ""}
        onSelected={handleSelected}
        onChange={handleChange}
        options={options}
        label={label}
        placeholder={placeholder}
        loading={isSearching}
        className={className}
        autocomplete={true}
        error={error}
        errorMessage={errorMessage}
      />
    </>
  );
}
