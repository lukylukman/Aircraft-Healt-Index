export enum DashboardActionType {
  ON_DASHBOARD_DATA_LOAD = '[Action: Dashboard] => On Dashboard Loaded',
  ON_DASHBOARD_DATA_LOAD_TODAY = '[Action: Home] => On Dashboard Loaded Today',
  ON_DASHBOARD_DATA_SELECTED_CLEAR = '[Action: Dashboard] => On Dasboard Clear',
  ON_DASHBOARD_DATA_SELECTED = '[Action: Dashboard] => On Dashboard Data Selected',

  ON_DASHBOARD_LIST_LOAD = '[Action: Dashboard] => On Load Dashboard List',
  ON_DASHBOARD_LIST_CLEAR = '[Action: Dashboard] => On Clear Dashboard List',

  // SET SUMMARY SCORE
  ON_SUMMARY_SCORE_LOAD = '[Action:Summary Score] => On Load Summary Score',
  ON_SUMMARY_SCORE_CLEAR = '[Action:Summary Score] => On Clear Summary Score',

  // AIRCRAFT TYPE
  ON_AIRCRAFT_TYPE_LOAD = '[Action:Aircraft Type] => On Load Aircraft Type',
  ON_AIRCRAFT_TYPE_CLEAR = '[Action:Aircraft Type] => On Clear Aircraft Type',

  // AIRCRAFT DETAIL HIL
  ON_AIRCRAFT_DETAIL_HIL_LOAD = '[Action:Detail Hil] => On Load Aircraft DETAIL_HIL',
  ON_AIRCRAFT_DETAIL_HIL_CLEAR = '[Action:Detail Hil] => On Clear Aircraft DETAIL_HIL',

  // AIRCRACFT AVERAGE HEALTH
  ON_AIRCRAFT_AVERAGE_HEALTH_LOAD = '[Action:Average Health] => On Load Aircraft Average',
  ON_AIRCRAFT_AVERAGE_HEALTH_CLEAR = '[Action:Average Health] => On Clear Aircraft Average',

  // AIRCRACFT PERCENTAGE HEALTH
  ON_AIRCRAFT_PERCENTAGE_HEALTH_LOAD = '[Action:Average Health] => On Load Percentage Average',
  ON_AIRCRAFT_PERCENTAGE_HEALTH_CLEAR = '[Action:Average Health] => On Clear Percentage Average',

  // AIRCRACFT DIFFERENCE
  ON_AIRCRAFT_DIFFERENCE_LOAD = '[Action:Average Difference] => On Load Difference',
  ON_AIRCRAFT_DIFFERENCE_CLEAR = '[Action:Average Difference] => On Clear Difference',

  // APU
  ON_APU_LOAD = '[Action: APU] => On APU Load',
  ON_APU_CLEAR = '[Action: APU] => On APU Clear',

  // ENGINE TREND
  ON_ENGINE_TREND_LOAD = '[Action: Engine Tren] => On Engine Trend Load',
  ON_ENGINE_TREND_CLEAR = '[Action: Engine Tren] => On Engine Trend Clear',

  // ENGINE TREND
  ON_ENGINE_GE_LOAD = '[Action: Engine Ge] => On Engine Ge Load',
  ON_ENGINE_GE_CLEAR = '[Action: Engine Ge] => On Engine Ge Clear',

  // BLEED
  ON_BLEED_LOAD = '[Action: Bleed] => On Bleed Load',
  ON_BLEED_CLEAR = '[Action: Bleed] => On Bleed Clear',

  // REPETITIVE
  ON_REPETITIVE_LOAD = '[Action: Repetitive] => On Repetitive Load',
  ON_REPETITIVE_CLEAR = '[Action: Repetitive] => On Repetitive Clear',

  // PACK
  ON_PACK_LOAD = '[Action: Pack] => On Pack Load',
  ON_PACK_CLEAR = '[Action: Pack] => On Pack Clear',

  // SETTING CONFIG VALUE
  ON_CONFIG_DATA_CLEAR = '[Action: CONFIG] => On CONFIG DATA Clear',
  ON_CONFIG_DATA_LOAD = '[Action: CONFIG] => On CONFIG DATA Load',
}
