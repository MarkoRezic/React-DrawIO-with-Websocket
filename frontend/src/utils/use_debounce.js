import { useEffect, useMemo, useRef } from "react";
import { debounce } from 'lodash'

const useDebounce = (callback, delay) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = (...args) => {
            return ref.current?.(...args);
        };

        return debounce(func, delay);
    }, []);

    return debouncedCallback;
};

export default useDebounce