import http from 'k6/http'
import { sleep, check } from 'k6'

const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:3000'

export const options = {
  vus: 10,         // 10 virtual users
  duration: '30s', // run for 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete < 2s
    http_req_failed: ['rate<0.01'],    // error rate must be < 1%
  },
}

export default function () {
  const res = http.get(`${BASE_URL}/`)
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 2000,
  })
  sleep(1)
}