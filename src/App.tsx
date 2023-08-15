import './App.css';
import {
  getMovies,
  MoviesResponse,
  SimplifiedMovie,
  simplifyMoviesData,
} from './table-prefs/movies.ts';
import { useEffect, useMemo, useState } from 'react';
import Table from './components/Table.tsx';
import { ColumnDef } from '@tanstack/react-table';

function App() {
  const [data, setData] = useState<MoviesResponse>([]);

  const titleColumns = useMemo<ColumnDef<SimplifiedMovie>[]>(
    () => [
      {
        header: 'ID',
        cell: row => row.renderValue(),
        accessorKey: 'id',
      },
      {
        header: 'Title',
        cell: row => row.renderValue(),
        accessorKey: 'titleText',
      },
      {
        header: 'Release Year',
        cell: row => row.renderValue(),
        accessorKey: 'releaseYear',
      },
      {
        header: 'Title Type',
        cell: row => row.renderValue(),
        accessorKey: 'titleType',
      },
    ],
    [],
  );

  useEffect(() => {
    getMovies('')
      .then(mov => {
        if (!mov) return console.log('no movies');
        setData(mov);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  if (!data?.results?.length || !data?.results[0]) {
    return <div>Loading...</div>;
  }
  const simplifiedData = simplifyMoviesData(data.results);

  return (
    <div>
      <Table data={simplifiedData} columns={titleColumns} />
    </div>
  );
}
export default App;
