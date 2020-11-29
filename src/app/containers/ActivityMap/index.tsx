/**
 *
 * ActivityMap
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Signal } from 'signals';
import styled from 'styled-components/macro';
import _ from 'lodash';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import {
  selectActivityMap,
  selectDataset,
  selectLoading,
  selectYear,
} from './selectors';
import { activityMapSaga } from './saga';
import { WorldMap } from 'app/components/WorldMap';
import { Stage } from 'app/components/Stage';
import { YearSlider } from 'app/components/YearSlider';
import { useHistory } from 'react-router-dom';
import dialogs from '../DialogWindow/dialogs.json';

interface Props {}

export function ActivityMap(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: activityMapSaga });
  const dialogsIdList = useRef(Object.keys(dialogs));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activityMap = useSelector(selectActivityMap);
  const [selectedYear, setSelectedYear] = useState(1990);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const history = useHistory();

  const isLoading = useSelector(selectLoading);
  const activityDataset = useSelector(selectDataset);

  const [activitiesByCountry, setActivitiesByCountry] = useState({});

  const updateYearSignal = new Signal();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    if (_.isEmpty(activityDataset)) {
      dispatch(actions.loadDataset());
    }
  });

  useEffect(() => {
    if (activityDataset?.length) {
      const byCountry = {};
      activityDataset.forEach(activity => {
        const { startyear, country, id } = activity;
        const clActivity = {
          ...activity,
          hasDialog: dialogsIdList.current.indexOf(id) > -1,
        };
        if (!byCountry[startyear]) byCountry[startyear] = {};
        if (!byCountry[startyear][country]) {
          byCountry[startyear][country] = [clActivity];
        } else {
          byCountry[startyear][country].push(clActivity);
        }
      });
      setActivitiesByCountry(byCountry);
    }
  }, [activityDataset]);

  // console.log(isLoading, activityDataset);

  return (
    <>
      <Div>
        {isLoading ? (
          <div className="loading-panel">Loading data</div>
        ) : (
          <div></div>
        )}
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <WorldMap
            history={history}
            updateYearSignal={updateYearSignal}
            calculatedActivityByYear={activitiesByCountry}
            year={selectedYear}
          />
        </Stage>
        <YearSlider
          className="year-slider"
          updateYear={(year: number) => {
            // setSelectedYear(year);
            updateYearSignal.dispatch(year);
          }}
        />
      </Div>
    </>
  );
}

const Div = styled.div`
  .year-slider {
    position: absolute;
    bottom: 30px;
    width: 100%;
  }
  .loading-panel {
    position: absolute;
  }
`;
