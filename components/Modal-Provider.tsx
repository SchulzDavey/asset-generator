"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import ProModal from "./ProModal";

const ModalProvider = ({ children }: PropsWithChildren) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ProModal />
    </>
  );
};

export default ModalProvider;
