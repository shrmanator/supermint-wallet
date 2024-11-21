"use client";

import React, { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type CharityUrlMap = Record<string, string>;

interface Charity {
  name: string;
  websiteUrl: string;
}

interface CharitiesResponse {
  charities: Charity[];
}

export const CharityContext = createContext<CharityUrlMap>({});

export const CharityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: charitiesData } = useSWR<CharitiesResponse>(
    "/api/charities",
    fetcher
  );

  const charityUrlMap = useMemo(() => {
    if (!charitiesData?.charities) {
      return {};
    }

    return charitiesData.charities.reduce((acc: CharityUrlMap, charity) => {
      if (charity && charity.name && charity.websiteUrl) {
        // Normalize the charity name: trim spaces and convert to consistent case
        const normalizedName = charity.name.trim();
        acc[normalizedName] = charity.websiteUrl;
      }
      return acc;
    }, {});
  }, [charitiesData]);

  return (
    <CharityContext.Provider value={charityUrlMap}>
      {children}
    </CharityContext.Provider>
  );
};

export const useCharityUrl = (charityName: string): string | undefined => {
  const charityMap = useContext(CharityContext);
  return charityMap[charityName.trim()];
};

export const useCharities = () => {
  const charityMap = useContext(CharityContext);
  return Object.entries(charityMap).map(([name, websiteUrl]) => ({
    name,
    websiteUrl,
  }));
};
