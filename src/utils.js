import React from "react";
import * as axios from "axios";

const ENDPOINT_URL = "http://18.195.236.90:5001/v1/complete/gpt";

const useAsyncEndpoint = fn => {
    const [res, setRes] = React.useState({ data: null, complete: false, pending: false, error: false });
    const [req, setReq] = React.useState();

    React.useEffect(() => {
        if (!req) return;
        setRes({ data: null, pending: true, error: false, complete: false });
        axios(req)
            .then(res =>
                setRes({ data: res.data, pending: false, error: false, complete: true })
            )
            .catch(() =>
                setRes({ data: null, pending: false, error: true, complete: true })
            );
    }, [req]);

    return [res, (...args) => setReq(fn(...args))];
}
export const postGenerateTextEndpoint = () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    return useAsyncEndpoint(data => ({ url: ENDPOINT_URL, method: "POST", data }));
}

export const getPrefix = (line) => {
    const words = line.trim().split(" ")
    return words[words.length-1]
}

export const replaceTabs = (code) => {
    return code.replace("    ","\t")
}
