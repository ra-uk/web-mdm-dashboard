import GetMode from '../Utils/GetMode'
import Animations from '../Utils/Animations'
import ItemList from './ItemList'
import Routers from './Routers'
import * as api from './Api'
import WinJS from 'winjs'

const display = localStorage.getItem('display') ? JSON.parse(localStorage.getItem('display')) : {}
Animations()
const INITIAL_STATE = {
    splitViewId: 'rootSplitView',
    paneOpened: false,
    animation: display.animations !== undefined ? display.animations : true,
    mode: GetMode(),
    index: 0,
    location: [Routers[0].label],
    router: Routers,
    splitViewConfigs: {
        small: {
            closedDisplayMode: 'none',
            openedDisplayMode: 'overlay'
        },
        medium: {
            closedDisplayMode: 'inline',
            openedDisplayMode: 'overlay'
        },
        large: {
            closedDisplayMode: 'inline',
            openedDisplayMode: 'inline'
        }
    },
    actionList: null,
    currentItem: null,
    endpoint: null,
    dataSource: { itemList: new WinJS.Binding.List([]), sort: true},
    isLoading: true,
    isError: false ,
    passwordConfiguration: {}
}

// Constants
const HANDLE_TOGGLE_PANE = 'flyve-mdm-web-ui/AdminDashboard/handleTogglePane'
const CLOSE_PANE = 'flyve-mdm-web-ui/AdminDashboard/closePane'
const HANDLE_TOGGLE_ANIMATION = 'flyve-mdm-web-ui/AdminDashboard/handleToggleAnimation'
const CHANGE_MODE = 'flyve-mdm-web-ui/AdminDashboard/changeMode'
const CHANGE_LOCATION = 'flyve-mdm-web-ui/AdminDashboard/changeLocation'
const CHANGE_INDEX = 'flyve-mdm-web-ui/AdminDashboard/changeIndex'
const HANDLE_BACK = 'flyve-mdm-web-ui/AdminDashboard/handleBack'
const CHANGE_ENDPOINT = 'flyve-mdm-web-ui/AdminDashboard/changeEndpoint'
const CHANGE_DATA_SOURCE = 'flyve-mdm-web-ui/AdminDashboard/changeDataSource'
const CHANGE_ACTION_LIST = 'flyve-mdm-web-ui/AdminDashboard/changeActionList'
const CHANGE_CURRENT_ITEM = 'flyve-mdm-web-ui/AdminDashboard/changeCurrentItem'
const CHANGE_LOADING = 'flyve-mdm-web-ui/AdminDashboard/changeLoading'
const FETCHING_DATA_SUCCESS = 'flyve-mdm-web-ui/AdminDashboard/fetchingDataSuccess'
const FETCHING_DATA_FAILURE = 'flyve-mdm-web-ui/AdminDashboard/fetchingDataFailure'
const CHANGE_PASSWORD_CONFIGURATION = 'flyve-mdm-web-ui/AdminDashboard/changePasswordConfiguration'

// Reducers
export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {

        case HANDLE_TOGGLE_PANE:
            return {
               ...state,
               paneOpened: !state.paneOpened
            }

        case CLOSE_PANE:
            return {
               ...state,
               paneOpened: false
            }

        case HANDLE_TOGGLE_ANIMATION:
            return {
                ...state,
                animation: !state.animation
            }
        
        case CHANGE_MODE:
            return {
               ...state,
               mode: action.nexMode
            }
        
        case CHANGE_LOCATION:
            return {
               ...state,
               location: action.newLocation
            }
        
        case CHANGE_INDEX:
            return {
                ...state,
                index: action.newIndex
            }

        case HANDLE_BACK:
            return {
               ...state,
               location: [...state.location.slice(0, 1)]
            }
        
        case CHANGE_ENDPOINT:
            return {
                ...state,
                endpoint: action.newEndpoint
            }
        
        case CHANGE_DATA_SOURCE:
            return {
                ...state,
                dataSource: action.newDataSource
            }
        
        case CHANGE_ACTION_LIST:
            return {
                ...state,
                actionList: action.newActionList
            }
        
        case CHANGE_CURRENT_ITEM:
            return {
                ...state,
                currentItem: action.newCurrentItem
            }
        case CHANGE_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case FETCHING_DATA_SUCCESS:
            return {
                ...state,
                data: action.newData,
                dataSource: { itemList: ItemList(state.endpoint, action.newData.data), sort: true } 
            }
        case FETCHING_DATA_FAILURE:
            return {
                ...state,
                error: action.newError
            }
        case CHANGE_PASSWORD_CONFIGURATION: 
            return {
                ...state,
                passwordConfiguration: action.newConfiguration
            }
        default: return state
    }
}

// Action Creators
export function handleTogglePane () {
  return { 
      type: HANDLE_TOGGLE_PANE
    }
}
export function closePane () {
  return { 
      type: CLOSE_PANE
    }
}
export function handleToggleAnimation() {
    Animations()
    return {
        type: HANDLE_TOGGLE_ANIMATION
    }
}
export function changeMode (nexMode) {
  return { 
      type: CHANGE_MODE,
      nexMode
    }
}
export function changeLocation (newLocation) {
  return { 
      type: CHANGE_LOCATION,
      newLocation
    }
}
export function changeIndex (newIndex) {
    return { 
        type: CHANGE_INDEX,
        newIndex
      }
  }
export function handleBack () {
  return { 
      type: HANDLE_BACK
    }
}
export function changeEndpoint(newEndpoint) {
    return {
        type: CHANGE_ENDPOINT,
        newEndpoint
    }
}
export function changeDataSource(location, newDataSource) {
    return {
        type: CHANGE_DATA_SOURCE,
        newDataSource,
        location: location[0].toLowerCase()
    }
}
export function changeActionList(newActionList) {
    return {
        type: CHANGE_ACTION_LIST,
        newActionList

    }
}
export function changeCurrentItem(newCurrentItem) {
    return {
        type: CHANGE_CURRENT_ITEM,
        newCurrentItem

    }
}
export function changeLoading(bool) {
    return {
        type: CHANGE_LOADING,
        isLoading: bool
    }
}
export function fetchDataSuccess(data) {
    return {
        type: FETCHING_DATA_SUCCESS,
        newData: data,
    }
}
export function fetchDataFailure() {
    return {
        type: FETCHING_DATA_FAILURE
    }
}
export function fetchData(endpoint) {
    return (dispatch) => {
        dispatch(changeEndpoint(endpoint))
        dispatch(changeLoading(true))
        api[endpoint.toLowerCase()].getAll()
        .then(([response, json]) => {
            dispatch(fetchDataSuccess(json))
            dispatch(changeLoading(false))
        })
        .catch((error) => {
            dispatch(fetchDataFailure())
            dispatch(changeLoading(false))
        })
    }
}
export function sendFeedback () {
    return (dispatch) => {
        dispatch(changeEndpoint('feedback'))
        dispatch(changeLoading(true))
        api.feedback.sendFeedback()
        .then(([response, json]) => {
            dispatch(fetchDataSuccess(json))
            dispatch(changeLoading(false))
        })
        .catch((error) => {
            dispatch(fetchDataFailure())
            dispatch(changeLoading(false))
        })
    }
}
export function changePasswordConfiguration (newConfiguration) {
    return {
        type: CHANGE_PASSWORD_CONFIGURATION,
        newConfiguration
    }
}

export function getPasswordConfiguration () {
    return (dispatch) => {
        dispatch(changeLoading(true))
        api.configurationPassword.getAll()
            .then(([response, json]) => {
                dispatch(changePasswordConfiguration(json))
                dispatch(changeLoading(false))
            })
            .catch((error) => {
                dispatch(fetchDataFailure())
                dispatch(changeLoading(false))
            })
    }
}
