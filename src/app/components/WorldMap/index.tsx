/**
 *
 * WorldMap
 *
 */
import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  RefObject,
} from 'react';
import * as d3 from 'd3';
// import * as topojson from 'topojson';
// import * as topojson from 'topojson-client';

import { zoom } from 'd3-zoom';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import cities from 'cities.json';
import _ from 'lodash';

import styled from 'styled-components/macro';
// import countriesJson from './countries.json';
import countriesJson from './countriesSansAntartica.json';
import { useSvg } from '../Stage';
import dialogs from '../../containers/DialogWindow/dialogs.json';
// import lim from './lim.json';

interface Props {
  calculatedActivityByYear: any;
  updateYearSignal: any;
  year: number;
  history: any;
}

const width = window.innerWidth;
const height = window.innerHeight;

export function WorldMap({
  calculatedActivityByYear,
  year,
  updateYearSignal,
  history,
}: Props) {
  const svgElement = useSvg();
  const zoomGroup = useRef(null);
  const zoomAspect = useRef(1);
  const dialogsIdList = useRef(Object.keys(dialogs));

  const zoomRef = useRef(d3.zoom().scaleExtent([1, 8]));
  const yearRef = useRef(0);

  const transform = {
    k: 0,
  };

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  const countriesRefMap = {};

  useEffectOnMount(() => {
    // const zoom = d3.zoom().on('zoom', function (event) {
    //   d3.select(svg).attr('transform', event.transform);
    // });
    // d3.select(svg).call(zoom);
  });

  useEffect(() => {
    return () => {
      console.log('Unmount world map');
      updateYearSignal.remove(updateYear);
    };
  }, []);

  useEffect(() => {
    updateYearSignal.add(updateYear);
  }, [calculatedActivityByYear, updateYearSignal]);

  const zoomColour = d3
    .scaleLinear()
    .domain([1, 8])
    .clamp(true)
    .range(['#5d925d', '#212121']);

  const zoomCountryColour = d3
    .scaleLinear()
    .domain([1, 8])
    .clamp(true)
    .range(['#ff1414', '#5d0000']);

  const updateYear = (year: number) => {
    if (!_.isEmpty(calculatedActivityByYear)) {
      if (yearRef.current === year) return;
      const adjustedCol = d3
        .scaleLinear()
        .domain([0, 100])
        .clamp(true)
        .range([
          zoomColour(zoomAspect.current),
          zoomCountryColour(zoomAspect.current),
        ]);

      d3.select('#marker-container').selectAll('*').remove();
      yearRef.current = year;
      Object.keys(calculatedActivityByYear[year]).forEach((country: string) => {
        const color = adjustedCol(
          calculatedActivityByYear[year][country].length,
        );
        if (countriesRefMap[country]) {
          countriesRefMap[country].setAttribute('fill', color);
          countriesRefMap[country].setAttribute(
            'data-heat',
            calculatedActivityByYear[year][country].length,
          );
        }
      });
    }
  };

  useEffect(() => {
    if (!svgElement) return;
    const selection = d3.select(svgElement);

    const group = d3.select(zoomGroup.current);
    const paths = group.selectAll('path');

    const body: any = document.querySelector('body');

    const backgroundColorFunc = d3
      .scaleLinear()
      .domain([1, 8])
      .clamp(true)
      .range(['#e8e8e8', '#ff1414']);

    const countryPaths = d3.selectAll('path.country');
    console.log(countryPaths);

    zoomRef.current.on('zoom', function (event) {
      const { x, y, k } = event.transform;
      // console.log(k);
      zoomAspect.current = k;
      transform[k] = k;
      group.attr('transform', event.transform);
      paths.attr('stroke-width', 1 / k);
      countryPaths.attr('fill', function () {
        //@ts-ignore
        const heat: number = this.getAttribute('data-heat') * 1;

        //#5d0000

        const adjustedCol = d3
          .scaleLinear()
          .domain([0, 100])
          .clamp(true)
          .range([zoomColour(k), zoomCountryColour(k)]);
        return adjustedCol(heat);
      });
      body.style.backgroundColor = `${backgroundColorFunc(k)}`;
    });
    selection.call(zoomRef.current);
    return () => selection.on('.zoom', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgElement]);

  const geographies = feature(countriesJson, countriesJson.objects.countries1)
    .features;

  const projection = d3.geoMercator().translate([width / 2, height / 2]);
  // .scale(160)
  // .scale(height / Math.PI);
  // .center([2.8, 41.9])

  const handleCountryClick = (event: any, country: string) => {
    const { width, height, x, y } = d3.select(event.target).node().getBBox();
    const x1 = x + width;
    const y1 = y + height;
    const svg = d3.select(svgElement);

    svg
      .transition()
      .duration(750)
      .call(
        zoomRef.current.transform,
        d3.zoomIdentity
          .translate(window.innerWidth / 2, window.innerHeight / 2)
          .scale(
            Math.min(
              8,
              0.9 /
                Math.max(
                  (x1 - x) / window.innerWidth,
                  (y1 - y) / window.innerHeight,
                ),
            ),
          )
          .translate(-(x + x1) / 2, -(y + y1) / 2),
        d3.pointer(event, svg.node()),
      );
    drawMarkers(calculatedActivityByYear[yearRef.current][country]);
  };

  const sortActivitiesByMonth = (data: any[]) => {
    if (!data) return [];
    const sortedData = {};
    data.forEach((activity: any) => {
      if (!sortedData[activity.location]) {
        const coordinates = (cities as any[]).find(
          city => city.name === activity.location,
        );
        if (coordinates) {
          const [x, y] = projection([coordinates.lng, coordinates.lat]);
          sortedData[activity.location] = {
            data: [],
            coords: { x, y },
          };
        } else {
          sortedData[activity.location] = {
            data: [],
          };
        }
      }
      sortedData[activity.location].data.push(activity);
    });
    return sortedData;
  };

  const markerSize = d3.scaleLinear().domain([1, 50]).clamp(true).range([2, 8]);

  const drawMarkers = (data: any[]) => {
    // console.log(sortActivitiesByMonth(data));
    const sortedData: any = sortActivitiesByMonth(data);
    const cleanedDataArray: any[] = Object.keys(sortedData)
      .filter((city: string) => !!sortedData[city].coords)
      .map((city: string) => sortedData[city]);
    console.log(cleanedDataArray);
    const markerContainer = d3.select('#marker-container');
    markerContainer
      .selectAll('*')
      .transition()
      .duration(500)
      .delay(function (d, i) {
        return i * 100;
      })
      .attr('opacity', '0')
      .remove();
    markerContainer
      .selectAll('circle.marker')
      .data(cleanedDataArray)
      .enter()
      .append('circle')
      .attr('r', d => markerSize(d.data.length) - 2)
      .attr('cx', d => d.coords.x)
      .attr('cy', d => d.coords.y)
      .attr('fill', d => {
        const hasDialog: boolean = !!d.data.filter(
          activity => !!activity.hasDialog,
        ).length;

        if (hasDialog) return '#8787fd45';
        return '#ffffff47';
      })
      .attr('stroke', '#b9b9b9')
      .attr('stroke-width', 0.2)
      .attr('opacity', '0')
      .on('mouseover', (event, d) => {
        const { country, location } = d.data[0];
        d3.select('#country-name').text(country);
        d3.select('#location-name').text(location);
      })
      .on('mouseout', (event, d) => {
        d3.select('#country-name').text('');
        d3.select('#location-name').text('');
      })
      .on('click', (event, d) => {
        const withDialog = d.data.filter(activity => !!activity.hasDialog);
        history.push(!_.isEmpty(withDialog) ? withDialog[0].id : 'nodata');
      })
      .transition()
      .duration(1000)
      .delay(function (d, i) {
        return i * 100;
      })
      .attr('r', d => markerSize(d.data.length))
      .attr('opacity', '1');
  };

  const handleMouseEnter = (event: any, name: string) => {
    d3.select('#country-name').text(name);
  };

  const handleMouseLeave = (event: any) => {
    d3.select('#country-name').text('');
  };

  return (
    <React.Fragment>
      <g ref={zoomGroup}>
        <g>
          {geographies.map((d, i) => {
            const path = geoPath().projection(projection)(d);

            return (
              <g key={`group-${i}`}>
                <Path
                  ref={(ref: any) => {
                    if (ref) {
                      countriesRefMap[d.properties.name] = ref;
                    }
                  }}
                  id={`path-${i}`}
                  d={path}
                  className="country"
                  fill="#5d925d"
                  stroke="#e8e8e8"
                  onClick={event =>
                    handleCountryClick(event, d.properties.name)
                  }
                  onMouseEnter={event =>
                    handleMouseEnter(event, d.properties.name)
                  }
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            );
          })}
        </g>
        <G id="marker-container">
          {/* <circle r="5" fill="red" cx={testX} cy={testY} /> */}
        </G>
      </g>
      <g>
        <text
          id="country-name"
          textAnchor="middle"
          dy="40px"
          fill="#e8e8e8"
          fontSize="40"
          fontWeight="bold"
          dx={window.innerWidth / 2}
          style={{ mixBlendMode: 'difference' }}
        />
        <text
          id="location-name"
          textAnchor="middle"
          dy="68px"
          fill="#e8e8e8"
          fontSize="26"
          fontWeight="bold"
          dx={window.innerWidth / 2}
          style={{ mixBlendMode: 'difference' }}
        />
      </g>
    </React.Fragment>
  );
}

const Path = styled.path`
  opacity: 1;
  transition: opacity 200ms ease, fill 0.4s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const G = styled.g`
  circle {
    transition: opacity 200ms ease;
    cursor: pointer;
  }
  circle:hover {
    opacity: 0.8;
  }
`;
