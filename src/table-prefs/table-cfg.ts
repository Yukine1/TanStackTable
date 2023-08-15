import { ColumnDef } from '@tanstack/react-table';

export interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
}
