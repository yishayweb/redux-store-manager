import {
  createStore,
  combineReducers,
  applyMiddleware,
  Reducer,
  Store,
} from 'redux';
import thunk from 'redux-thunk';

type ReducersObj = {
  [k: string]: Reducer;
};

type ReducerListItem = {
  name: string;
  content: Reducer;
};

interface IStoreExtanded extends Store {
  staticReducers?: ReducersObj;
  asyncReducers?: ReducersObj;
  injectReducer?: (reducersList: ReducerListItem[]) => void;
  cleanReducers?: (reducersList: ReducerListItem[]) => void;
}

// Configure the store
export default function createExtandedStore(
  staticReducers: ReducersObj,
): IStoreExtanded {
  // const store: IStoreExtanded = createStore(rootReducer);
  const rootStaticReducer = createReducer(staticReducers, {});
  const store: IStoreExtanded = createStore(
    rootStaticReducer,
    {},
    applyMiddleware(thunk),
  );
  store.staticReducers = staticReducers;

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (reducersList) => {
    let newReducersAdded = false;
    reducersList.forEach((reducer) => {
      if (store?.asyncReducers?.hasOwnProperty(reducer.name)) {
        return;
      }
      newReducersAdded = true;
      if (store.asyncReducers) {
        store.asyncReducers[reducer.name] = reducer.content;
      }
    });
    if (newReducersAdded) {
      console.log('putting reducers');
      store.replaceReducer(
        createReducer(store.staticReducers, store?.asyncReducers) as Reducer<
          any,
          any
        >,
      );
    }
  };

  store.cleanReducers = (reducersList) => {
    let reducersRemoved = false;
    reducersList.forEach((reducer) => {
      if (store?.asyncReducers?.hasOwnProperty(reducer.name)) {
        reducersRemoved = true;
        delete store.asyncReducers[reducer.name];
      }
    });
    if (reducersRemoved) {
      console.log('cleaning reducers');
      store.replaceReducer(
        createReducer(store.staticReducers, store.asyncReducers) as Reducer<
          any,
          any
        >,
      );
    }
  };

  // Return the modified store
  return store;
}

function createReducer(
  staticReducers: ReducersObj | undefined,
  asyncReducers: ReducersObj | undefined,
) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
}
