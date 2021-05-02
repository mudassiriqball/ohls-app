import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../utils/urls';
import { getBearerTokenFromStorage } from '../utils/auth';

export default function getAllCases(assigned, reload) {
  const [DATA, setData] = useState(true)
  const [IS_LOADING, setLoading] = useState('');

  useEffect(() => {
    setData([]);
  }, [reload]);

  useEffect(() => {
    const getData = async () => {
      let _token = await getBearerTokenFromStorage();
      setLoading(true)
      await axios({
        method: 'GET',
        headers: {
          'authorization': _token,
        },
        url: urls.GET_ALL_CASES,
        params: { assigned },
      }).then(res => {
        setLoading(false)
        setData(res.data.data.reverse());
      }).catch(err => {
        setLoading(false)
        console.log('getAllCases Error:', err);
      })
    }
    getData();
    return () => {
      getData;
    };
  }, [reload]);

  return {
    IS_LOADING,
    DATA,
  }
}