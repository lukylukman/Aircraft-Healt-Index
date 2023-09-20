export enum DashboardActionType {
  ON_DASHBOARD_DATA_LOAD = '[Action: Dashboard] => On Dashboard Loaded',
  ON_DASHBOARD_DATA_LOAD_TODAY = '[Action: Home] => On Dashboard Loaded Today',
  ON_DASHBOARD_DATA_SELECTED_CLEAR = '[Action: Dashboard] => On Dasboard Clear',
  ON_DASHBOARD_DATA_SELECTED = '[Action: Dashboard] => On Dashboard Data Selected',

  ON_DASHBOARD_LIST_LOAD = '[Action: Dashboard] => On Load Dashboard List',
  ON_DASHBOARD_LIST_CLEAR = '[Action: Dashboard] => On Clear Dashboard List',

  // SET SUMMARY SCORE
  ON_SUMMARY_SCORE_LOAD = '[Action:Summary Score] => On Load Summary Score',

  // AIRCRAFT TYPE
  ON_AIRCRAFT_TYPE_LOAD = '[Action:Summary Score] => On Load Aircraft Type',
  ON_AIRCRAFT_TYPE_CLEAR = '[Action:Summary Score] => On Clear Aircraft Type',

  // AIRCRAFT DETAIL HIL
  ON_AIRCRAFT_DETAIL_HIL_LOAD = '[Action:Summary Score] => On Load Aircraft DETAIL_HIL',
  ON_AIRCRAFT_DETAIL_HIL_CLEAR = '[Action:Summary Score] => On Clear Aircraft DETAIL_HIL',
}
