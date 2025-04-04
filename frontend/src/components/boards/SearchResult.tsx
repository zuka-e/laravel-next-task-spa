import { memo, type JSX } from 'react';

import { skipToken } from '@reduxjs/toolkit/query';
import {
  List,
  ListItem,
  ListItemText,
  CardContent,
  Stack,
  Skeleton,
} from '@mui/material';

import { useSearchTaskCardsByBoardQuery } from '@/store/api';
import { useRoute } from '@/utils/hooks';
import { repeatMap } from '@/utils';
import { useTaskDetails } from '@/lib/hooks';

/**
 * Highlight the matched text.
 */
const highlightText = (text: string, query: string): JSX.Element => {
  if (!query) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-400">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

type SearchResultProps = {
  input: string;
};

const SearchResult = memo(function SearchResult(
  props: SearchResultProps,
): JSX.Element {
  const { input } = props;
  const { pathParams } = useRoute();
  const { showTaskDetails } = useTaskDetails();

  const { data, isFetching } = useSearchTaskCardsByBoardQuery(
    pathParams ? { boardId: pathParams['boardId' ?? ''], q: input } : skipToken,
  );

  if (!input) {
    return (
      <CardContent>{'Search results will be displayed here.'}</CardContent>
    );
  }

  if (isFetching) {
    return (
      <Stack spacing={2} className="m-4">
        {repeatMap(5, (i) => (
          <Skeleton key={i} variant="rectangular" height={40} />
        ))}
      </Stack>
    );
  }

  if (!data?.data.length) {
    return <CardContent>{'No results.'}</CardContent>;
  }

  return (
    <List dense className="p-0">
      {data?.data.map((card) => (
        <ListItem
          key={card.id}
          button
          onClick={() => showTaskDetails('c', card.id)}
        >
          <ListItemText
            primary={highlightText(card.title, input)}
            secondary={card.content && highlightText(card.content, input)}
            primaryTypographyProps={{
              className: 'font-bold',
            }}
            secondaryTypographyProps={{
              className: 'line-clamp-5',
            }}
          />
        </ListItem>
      ))}
    </List>
  );
});

export default SearchResult;
