/**
 *
 * Stage
 *
 */
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  width: number;
  height: number;
  children: any;
}

const Context = React.createContext(null);

export function Stage({ width, height, children }: Props) {
  const svgRef = useRef(null);
  const [svg, setSvg] = useState(null);
  useEffect(() => setSvg(svgRef.current), []);
  return (
    <svg ref={svgRef} width={width} height={height}>
      <Context.Provider value={svg}>{children}</Context.Provider>
    </svg>
  );
}

export function useSvg() {
  return React.useContext(Context);
}
