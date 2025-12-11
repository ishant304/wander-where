import { createContext, useState } from "react";


export const SearchContext = createContext();



function SearchProvider({ children }) {

    const [selectedPlace, setSelectedPlace] = useState(null)

    return (
        <SearchContext.Provider value={{ selectedPlace, setSelectedPlace }}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchProvider
