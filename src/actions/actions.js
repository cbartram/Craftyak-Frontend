/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import { post } from '../util';

/**
 * Updates the name of the video the user is currently
 * watching
 * @param video Object the video object to make active
 * @returns {Function}
 */
export const updateActiveVideo = (video) => dispatch => {
    dispatch({
        type: constants.LOGIN_FAILURE,
        payload: video
    });
};

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @returns {Function}
 */
export const ping = (payload) => async (dispatch, getState) => {
    await post(payload, constants.LOGIN_REQUEST, constants.LOGIN_REQUEST, constants.LOGIN_SUCCESS, constants.LOGIN_FAILURE, dispatch, getState);
};
