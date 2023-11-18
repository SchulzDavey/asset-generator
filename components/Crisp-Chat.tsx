"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("05997064-1652-45d7-bd3f-0a19ce9e5459");
  }, []);

  return null;
};
