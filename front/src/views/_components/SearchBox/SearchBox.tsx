import React from 'react'

import { rem } from 'polished'
import styled from 'styled-components'

import { colors, size } from '../../../ui/theme'

interface Props {
  onSearch(s: string): void
}

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${rem(32)};
`

const SearchInput = styled.input`
  width: 100%;
  height: ${rem(70)};
  border: none;
  padding-top: ${rem(16)};
  padding-bottom: ${rem(16)};
  padding-left: ${rem(24)};
  ::placeholder {
    font-size: ${rem(size.small)};
    color: ${colors.grey};
  }
`

const SearchButton = styled.button`
  width: ${rem(70)};
  background-image: linear-gradient(
    150deg,
    ${colors.yellow} 1.21%,
    ${colors.lightBlue} 45%,
    ${colors.lightGreen} 96%
  );
  border: none;
`

export const SearchBox: React.FC<Props> = ({ onSearch }) => {
  const handleSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(ev.target.value)
  }
  return (
    <>
      <form onSubmit={() => {}}>
        <SearchWrapper>
          <SearchInput
            type="search"
            name="search"
            placeholder="¿Qué quieres buscar? ¡Encuéntralo!"
            onChange={handleSearch}
          />
          <SearchButton />
        </SearchWrapper>
      </form>
    </>
  )
}
