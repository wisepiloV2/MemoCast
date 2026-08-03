import { useEffect, useRef, useState } from "react";

export function useClickOutside<T extends HTMLElement>(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { isOpen, setIsOpen, ref };
}

interface UseOptionsDropdownProps {
  initialOptions: string[];
}

export function useOptionsDropdown({ initialOptions }: UseOptionsDropdownProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  
  const { isOpen: showDropdown, setIsOpen: setShowDropdown, ref: containerRef } = useClickOutside<HTMLDivElement>(false);

  const filteredOptions = initialOptions.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    selected,
    setSelected,
    options: filteredOptions,
    showDropdown,
    setShowDropdown,
    containerRef
  };
}
