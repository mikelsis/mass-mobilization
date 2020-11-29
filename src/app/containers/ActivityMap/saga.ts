import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import { parse } from 'papaparse';

const parseDaataset = () => {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    parse('data/dataset.csv', {
      download: true,
      header: true,
      step: function (row) {
        data.push(row.data);
      },
      complete: function () {
        console.log('Finished loading');
        resolve(data);
      },
    });
  });
};

// export function* doSomething() {}
export function* getDataset() {
  const dataset: any[] = yield call(parseDaataset);
  yield put(actions.datasetLoaded(dataset));
}

export function* activityMapSaga() {
  yield takeLatest(actions.loadDataset.type, getDataset);
}
