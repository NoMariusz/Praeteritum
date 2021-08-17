import { useRef, useEffect } from "react";

const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
};

export const getCSRF = () => {
    return getCookie("csrftoken");
};

export const formatIfTooLong = (toFormat, maxLen) => {
    // formatting too long strings in format looking like tooLongSt...
    if (toFormat.length > maxLen) {
        return toFormat.slice(0, maxLen - 3) + "...";
    }
    return toFormat;
};

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const usePrevious = (value) => {
    /* Custom hook to get previous value of state */
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useClearState = (
    state,
    setState,
    valueWhenChange,
    newValue,
    timeout
) => {
    /**
     * Custom hook to change value of state to resetValue when state value is
     * valueWhenReset after some timeout
     *
     * @param state state to modify
     * @param setState function to enable modify state
     * @param valueWhenChange value which state could have when state should be changed
     * @param newValue value of state which would be set
     * @param timeout number of ms after which state would be changed
     */
    return useEffect(async () => {
        if (state == valueWhenChange) {
            await sleep(timeout);
            if (state == valueWhenChange) setState(newValue);
        }
    }, [state]);
};
