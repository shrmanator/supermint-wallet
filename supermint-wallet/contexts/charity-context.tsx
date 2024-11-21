"use client";

import React, { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type CharityUrlMap = Record<string, string>;

const CharityContext = createContext<CharityUrlMap>({});

export const CharityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: charitiesData } = useSWR("/api/charities", fetcher);

  const charityUrlMap = useMemo(() => {
    if (!charitiesData || !Array.isArray(charitiesData)) {
      return {};
    }

    return charitiesData.reduce((acc, charity) => {
      if (charity && charity.name && charity.url) {
        acc[charity.name] = charity.url;
      }
      return acc;
    }, {} as CharityUrlMap);
  }, [charitiesData]);

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
