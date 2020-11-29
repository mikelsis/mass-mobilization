/**
 *
 * YearSlider
 *
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRanger } from 'react-ranger';
import styled from 'styled-components/macro';
import { actions } from 'app/containers/ActivityMap/slice';

interface Props {
  className: string;
  updateYear: any;
}

export const Track = styled('div')`
  display: inline-block;
  height: 8px;
  width: 90%;
  margin: 0 5%;
`;

export const Tick = styled('div')`
  :before {
    content: '';
    position: absolute;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    height: 5px;
    width: 2px;
    transform: translate(-50%, 0.7rem);
  }
`;

export const TickLabel = styled('div')`
  position: absolute;
  font-size: 0.7rem;
  color: rgb(181 0 0);
  font-weight: bold;
  top: 100%;
  transform: translate(-50%, 1.2rem);
  white-space: nowrap;
`;

export const Segment = styled('div')`
  background: ${(props: any) =>
    props.index === 0
      ? '#c60302'
      : props.index === 1
      ? '#a9a9a9'
      : props.index === 2
      ? '#f5c200'
      : '#ff6050'};
  height: 100%;
`;

export const Handle = styled('div')`
  background: #c70000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  font-size: 0.9rem;
  white-space: nowrap;
  color: white;
  font-weight: ${(props: any) => (props.active ? 'bold' : 'normal')};
  transform: ${(props: any) =>
    props.active ? 'translateY(-100%) scale(1.3)' : 'translateY(0) scale(0.9)'};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export function YearSlider({ className, updateYear }: Props) {
  const dispatch = useDispatch();
  const [values, setValues] = React.useState([1990]);

  const { getTrackProps, ticks, segments, handles } = useRanger({
    min: 1990,
    max: 2019,
    stepSize: 1,
    values,
    onDrag: setValues,
  });

  useEffect(() => {
    if (updateYear) {
      updateYear(values[0]);
    }
  }, [values, updateYear]);

  return (
    <Div className={className}>
      <Track {...getTrackProps()}>
        {ticks.map(({ value, getTickProps }) => (
          <Tick {...getTickProps()}>
            <TickLabel>{value}</TickLabel>
          </Tick>
        ))}
        {segments.map(({ getSegmentProps }, i) => (
          <Segment {...getSegmentProps()} index={i} />
        ))}
        {handles.map(({ value, active, getHandleProps }) => (
          <button
            {...getHandleProps({
              style: {
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                transition: 'left 100ms',
              },
            })}
          >
            <Handle>{value}</Handle>
          </button>
        ))}
      </Track>
    </Div>
  );
}

const Div = styled.div``;
