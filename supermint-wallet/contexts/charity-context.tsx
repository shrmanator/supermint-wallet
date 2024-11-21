import React, { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type CharityUrlMap = Record<string, string>;

interface Charity {
  name: string;
  url: string;
}

const CharityContext = createContext<CharityUrlMap>({});

interface CharityProviderProps {
  children: React.ReactNode;
}

export const CharityProvider: React.FC<CharityProviderProps> = ({
  children,
}) => {
  const { data: charitiesData } = useSWR<Charity[]>("/api/charities", fetcher);

  const charityUrlMap = useMemo(
    () =>
      charitiesData?.reduce<CharityUrlMap>(
        (acc, charity) => ({
          ...acc,
          [charity.name]: charity.url,
        }),
        {}
      ) || {},
    [charitiesData]
  );

  return (
    <CharityContext.Provider value={charityUrlMap}>
      {children}
    </CharityContext.Provider>
  );
};

export const useCharityUrl = (charityName: string): string | undefined => {
  const charityMap = useContext(CharityContext);
  return charityMap[charityName];
};
