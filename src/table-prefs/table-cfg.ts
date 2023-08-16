import { ColumnDef } from '@tanstack/react-table';
import { MoviesResponse } from './movies.ts';
import { Dispatch, SetStateAction } from 'react';

export interface ReactTableProps<T extends object> {
  data: T[];
  moviesInfo: MoviesResponse;
  setData: Dispatch<SetStateAction<MoviesResponse>>;
  columns: ColumnDef<T>[];
  showNavigation?: boolean;
}
