"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

interface ProviderStoreProps {
  children: React.ReactNode;
}

const ProviderStore = ({ children }: ProviderStoreProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ProviderStore;
