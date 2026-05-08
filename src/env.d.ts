interface WindowEnv {
  API_BASE_URL: string
  API_RAW_PATH: string
  STREAM_URL: string
  APP_NAME: string
  APP_HOST: string
  DIVIDENDS_API_BASE_URL?: string
}

interface Window {
  _env_: WindowEnv
}
