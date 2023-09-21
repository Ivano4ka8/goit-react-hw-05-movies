import { getTrendFilmsOnDay } from 'api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [films, setFilms] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getTrendFilms = async () => {
      try {
        const { page, results, total_pages, total_results } =
          await getTrendFilmsOnDay(signal);

        setFilms(results);
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          toast.error('Something went wrong');
        }
      }
    };

    getTrendFilms(controller);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h1>Trending today</h1>
      <ul films={films}>
        {films.map(({ title, id }) => (
          <li key={id}>
            <Link to="/movies/:movieId">{title}</Link>
          </li>
        ))}
      </ul>
      <Toaster
        position="top-center"
        reverseOrder={true}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
