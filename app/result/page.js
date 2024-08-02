"use client"; // This directive is necessary for client components
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultPage from './ResultPage';
import Head from 'next/head';
import Loading from '../../components/loading/loading';



const Result = () => {
  const searchParams = useSearchParams();
  const a = searchParams.get('a');
  const b = searchParams.get('b');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (a && b) {
      fetch(`/api/search?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`)
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            setError(result.error);
          } else {
            setData(result);
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [a, b]);

  if (!a || !b) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div><Loading /></div>;
  }

  return (
    // <div>
    //   <h1>Result</h1>
    //   <p><strong>Laptop Name:</strong> {data.a}</p>
    //   <p><strong>Model:</strong> {data.b}</p>
    //   {/* Display other properties from the CSV file */}
    //   <p><strong>G3d_mark:</strong> {data.G3d_mark}</p>
    //   <p><strong>G2d_mark:</strong> {data.G2d_mark}</p>
    //   <p><strong>Price:</strong> {data.Price}</p>
    //   {/* Add more properties as needed */}
    // </div>
    <>
  <Head>
    <title>Result Page</title>
  </Head>
  <ResultPage name = {data.a}/>
</>

 );
};



export default Result;
