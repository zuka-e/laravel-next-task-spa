import { useState } from 'react';

import {
  ClickAwayListener,
  TextField,
  InputAdornment,
  IconButton,
  Popper,
  Card,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { SearchResult } from '.';

const SEARCH = 'search' as const;

const SearchField = () => {
  const [inputOpen, setInputOpen] = useState(false);
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState('');

  const handleClickAway = () => {
    setInputOpen(false);
    setPopperOpen(false);
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setInputOpen(true);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setValue(input);
  };

  if (!inputOpen)
    return (
      <IconButton onClick={handleOpen} title={SEARCH} size="large">
        <SearchIcon />
      </IconButton>
    );

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAway}>
      <div aria-labelledby="search-area">
        <TextField
          onFocus={handleFocus}
          onChange={handleChange}
          id={SEARCH}
          type={SEARCH}
          placeholder="Search..."
          defaultValue={value}
          autoFocus
          variant="outlined"
          className="w-80"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Popper
          open={popperOpen}
          anchorEl={anchorEl}
          placement="bottom-end"
          className="!top-1 rounded outline outline-primary"
        >
          <Card
            className="max-h-96 w-80 overflow-y-auto"
            aria-labelledby="search-result"
          >
            <SearchResult input={value} />
          </Card>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default SearchField;
