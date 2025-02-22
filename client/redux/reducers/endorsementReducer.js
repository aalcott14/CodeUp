/* global processSpecial */
import { REHYDRATE } from 'redux-persist/constants';
import {
  POSTING_ENDORSMENT,
  POSTED_ENDORSEMENT,
  FAILED_POSTING_ENDORSEMENT,
} from '../actions/endorsementActions';

const postEndorsement = (state = {
  status: null,
  endorsement: null,
}, action) => {
  switch (action.type) {
    case POSTING_ENDORSMENT:
      return { ...state, status: 'LOADING' };
    case POSTED_ENDORSEMENT:
      return { ...state, status: 'POST SUCCESS', endorsement: action.end };
    case FAILED_POSTING_ENDORSEMENT:
      return { ...state, status: 'ERROR' };
    case REHYDRATE: {
      const incoming = action.payload.eventsReducer;
      if (incoming) {
        return { ...state, ...incoming, specialKey: processSpecial(incoming.specialKey) };
      }
      return state;
    }
    default :
      return state;
  }
};

export default postEndorsement;
