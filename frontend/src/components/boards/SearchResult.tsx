import { useEffect, useMemo, useState } from 'react';

import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  CardContent,
} from '@mui/material';

import { useAppDispatch, useDeepEqualSelector, useRoute } from 'utils/hooks';
import { openInfoBox } from 'store/slices';

type SearchResultProps = {
  input: string;
};

const SearchResult = (props: SearchResultProps) => {
  const { input } = props;
  const route = useRoute();
  const dispatch = useAppDispatch();
  const lists = useDeepEqualSelector(
    (state) => state.boards.docs[route.queryParams.boardId?.toString()].lists
  );
  // `useMemo`: `useEffect`依存配列による無限ループを防止
  const cards = useMemo(() => {
    return lists.reduce(
      (prev: typeof lists[0]['cards'], current) => [...prev, ...current.cards],
      []
    );
  }, [lists]);

  // 検索に合致したデータ
  const [results, setResults] = useState({
    lists: [] as typeof lists,
    cards: [] as typeof cards,
  });

  useEffect(() => {
    if (!input) {
      setResults({ lists: [], cards: [] });
      return;
    }

    const queryParam = input.toLowerCase();

    setResults({
      lists: lists.filter(
        (list) =>
          (list.title || '').toLowerCase().indexOf(queryParam) !== -1 ||
          (list.description || '').toLowerCase().indexOf(queryParam) !== -1
      ),
      cards: cards.filter(
        (card) =>
          (card.title || '').toLowerCase().indexOf(queryParam) !== -1 ||
          (card.content || '').toLowerCase().indexOf(queryParam) !== -1
      ),
    });
  }, [cards, lists, input]);

  const handleClick = (payload: Parameters<typeof openInfoBox>[0]) => () => {
    dispatch(openInfoBox(payload));
  };

  if (Object.values(results).every((result) => result.length === 0))
    return <CardContent>{'ここに検索結果が表示されます。'}</CardContent>;

  return (
    <>
      {results.lists.length > 0 && (
        <List
          dense
          className="p-0"
          subheader={
            <ListSubheader className="border border-l-4 border-r-0 border-solid border-primary py-2 leading-5">
              {'リスト'}
            </ListSubheader>
          }
        >
          {results.lists.map((list) => (
            <ListItem
              key={list.id}
              button
              onClick={handleClick({ model: 'list', data: list })}
            >
              <ListItemText
                primary={list.title}
                secondary={list.description}
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
      )}

      {results.cards.length > 0 && (
        <List
          dense
          className="p-0"
          subheader={
            <ListSubheader className="border border-l-4 border-r-0 border-solid border-primary py-2 leading-5">
              {'カード'}
            </ListSubheader>
          }
        >
          {results.cards.map((card) => (
            <ListItem
              key={card.id}
              button
              onClick={handleClick({ model: 'card', data: card })}
            >
              <ListItemText
                primary={card.title}
                secondary={card.content}
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
      )}
    </>
  );
};

export default SearchResult;
