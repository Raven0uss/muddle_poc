import React from "react";

const useEffectUpdate = (effect, deps) => {
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (!isFirstRender.current) {
      effect();
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);
};

export default useEffectUpdate;
