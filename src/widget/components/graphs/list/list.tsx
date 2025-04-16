import { GraphEmptyMessage, Link } from '@/components/common';

export interface ListData {
  id: string;
  name: string;
  link: string;
}

interface ListProps {
  id?: string;
  data: ListData[];
}

export const List = (props: ListProps) => {
  const { id, data } = props;

  if (data.length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <ul id={id}>
      {data.map(item => {
        return (
          <li key={item.id}>
            <Link href={item.link}>{item.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};
