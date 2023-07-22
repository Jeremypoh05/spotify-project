import { useEffect, useState } from "react";

/* 
purpose of this hook is to prevent frequent updates or API calls when a value is rapidly changing. 
It allows for a delay period before updating the debounced value, which can be useful in scenarios 
such as search inputs or filtering data

When a value changes in React, it typically causes a re-render of the component. 
This can be problematic in scenarios where the value changes rapidly, such as when typing in an input field. 
Each keystroke would trigger a re-render, and if there is an API call associated with that value change, 
it could result in multiple unnecessary requests.

useDebounce hook is to introduce a delay before updating the debounced value. It waits for a certain period of inactivity 
(specified by the delay parameter) before considering the value as stable and updating the debounced value

*/

//This function delays the update of the value until a certain delay period has passed without any further changes.//
//Two parameters. value: The value to be debounced. It can be of any type (<T> is a generic type).
//delay (optional): The delay period in milliseconds. If not provided, it defaults to 500 milliseconds.
function useDebounce<T>(value: T, delay?: number): T {
    //The hook initializes the debouncedValue state variable using the useState hook,  set to the value passed as an argument.
    const [debouncedValue, setDebouncedValue] = useState<T>(value); 

    //The useEffect hook is used to set up a timer that updates the debouncedValue after the 
    //specified delay period has passed. It runs whenever value or delay changes.
    useEffect(() => {
        //setTimeout function delays the execution of a callback function for the specified delay period.
        //The callback function sets the debouncedValue to the current value.
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay || 500);

        //returns a cleanup function that is executed when the component unmounts or when value or delay changes. 
        //The cleanup function clears the previously set timer using the clearTimeout function
        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

    //The hook returns the debouncedValue, which represents the debounced version of the value provided as an argument.
    return debouncedValue; 
}

export default useDebounce;