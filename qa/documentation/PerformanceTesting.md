# Performance Testing – SponsorConnect

## 1. Objective

The objective of performance testing was to evaluate the response time, throughput and stability of the SponsorConnect REST API under a basic simulated user workload.

## 2. Testing Tool

Apache JMeter 5.6.3 was used to simulate multiple virtual users accessing the application.

## 3. Test Configuration

| Parameter | Value |
|---|---|
| API Endpoint | GET /api/companies |
| Server | localhost |
| Port | 5000 |
| Virtual Users | 10 |
| Ramp-up Period | 5 seconds |
| Loop Count | 5 |
| Total Requests | 50 |

## 4. Test Results

| Performance Metric | Actual Result |
|---|---|
| Total Samples | 50 |
| Successful Requests | 50 |
| Failed Requests | 0 |
| Average Response Time | 80 ms |
| Minimum Response Time | 63 ms |
| Maximum Response Time | 126 ms |
| Standard Deviation | 11.24 ms |
| Error Rate | 0.00% |
| Throughput | 10.3 requests/second |
| Received Data | 33.41 KB/sec |
| Sent Data | 1.33 KB/sec |

## 5. Result Analysis

All 50 HTTP requests were executed successfully without recorded errors. The average response time was 80 milliseconds, while the maximum response time was 126 milliseconds.

The application demonstrated consistent performance under the selected workload. The measured throughput was 10.3 requests per second.

## 6. Recommendations

- Perform load testing with larger numbers of virtual users.
- Conduct stress testing to identify system capacity limits.
- Monitor server CPU, memory and database performance.
- Conduct endurance testing to evaluate long-term stability.

## 7. Limitations

The test was conducted in a local development environment using a single public API endpoint. The results do not establish maximum system capacity or production-level performance.

## 8. Conclusion

The basic load test was completed successfully. SponsorConnect demonstrated stable performance with a 0% recorded error rate under the selected testing conditions.