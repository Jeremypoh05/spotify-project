"use client";

import qs from "query-string"; // used to stringify and parse URL query strings.(npm install query-string)
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from './Input';

const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState<string>("");//value and debouncedValue. The value state holds the current value of the search input, 
    const debouncedValue = useDebounce<string>(value, 500); //while the debouncedValue state represents the debounced value of the search input after a specified delay.

    // trigger the search functionality when the debouncedValue or router changes. 
    //This hook is responsible for constructing the search query URL using qs.stringifyUrl 
    //and updating the URL using router.push()
    useEffect(() => {
        //the query object is constructed with the title property set to the debouncedValue.
        const query = {
            title: debouncedValue,
        };

        //qs.stringifyUrl function is used to create a URL string by providing the base URL (url), which is /search in this case, and the query object.
        const url = qs.stringifyUrl({
            url: '/search',
            query: query
        });

        router.push(url); //used to navigate to the constructed URL, which triggers a page transition and updates the URL in the browser.
    }, [debouncedValue, router]);

    return ( 
        <div>
            {/* binds its value to the value state. The onChange event handler updates the value state as the user types. */}
           <Input 
              placeholder="What do you want to listen to?"
              value={value}
              onChange={(e) => setValue(e.target.value)}
           />
        </div>
     );
}
 
export default SearchInput;