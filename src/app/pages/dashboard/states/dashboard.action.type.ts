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
  ON_AIRCRAFT_TYPE_LOAD = '[Action:Aircraft Type] => On Load Aircraft Type',
  ON_AIRCRAFT_TYPE_CLEAR = '[Action:Aircraft Type] => On Clear Aircraft Type',

  // AIRCRAFT DETAIL HIL
  ON_AIRCRAFT_DETAIL_HIL_LOAD = '[Action:Detail Hil] => On Load Aircraft DETAIL_HIL',
  ON_AIRCRAFT_DETAIL_HIL_CLEAR = '[Action:Detail Hil] => On Clear Aircraft DETAIL_HIL',

  // AIRCRAFT SHOW MORE HIL ON MODAL
  ON_AIRCRAFT_SHOW_MORE_HIL_LOAD = '[Action:Show More Hil] => On Load Aircraft SHOW_MORE_HIL',
  ON_AIRCRAFT_SHOW_MORE_HIL_CLEAR = '[Action:Show More Hil] => On Clear Aircraft SHOW_MORE_HIL',

  // AIRCRACFT AVERAGE HEALTH
  ON_AIRCRAFT_AVERAGE_HEALTH_LOAD = '[Action:Average Health] => On Load Aircraft Average',
  ON_AIRCRAFT_AVERAGE_HEALTH_CLEAR = '[Action:Average Health] => On Clear Aircraft Average',

  // AIRCRACFT PERCENTAGE HEALTH
  ON_AIRCRAFT_PERCENTAGE_HEALTH_LOAD = '[Action:Average Health] => On Load Percentage Average',
  ON_AIRCRAFT_PERCENTAGE_HEALTH_CLEAR = '[Action:Average Health] => On Clear Percentage Average',
}
