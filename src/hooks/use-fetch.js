import { useEffect, useState } from 'react';

const useFetch = url => {
  const [data, setData] = useState({ loading: true, error: null, data: null });

  // Function to make the fetch() request
  const makeRequest = async () => {
    if (!data.loading) setData({ loading: true, error: null, data: null });

    try {
      const response = await fetch(url);
      const json = await response.json();
      setData({ loading: false, error: null, data: json.data });
    } catch (error) {
      setData({ loading: false, error, data: null });
    }
  };

  // Retry function incase something goes wrong
  const retry = () => makeRequest();

  // Called on component mount
  useEffect(() => {
    makeRequest();
  }, []);

  return { ...data, retry };
};

export default useFetch;
