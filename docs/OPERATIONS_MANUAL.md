# Operations Manual - Laser Cutting Calculator Platform

## Overview

This operations manual provides comprehensive guidance for maintaining, monitoring, and operating the Laser Cutting Calculator Platform in production environments. It covers daily operations, incident response, maintenance procedures, and troubleshooting guidelines.

**Platform**: Laser Cutting Calculator v1.0.0  
**Environment**: Production  
**Audience**: DevOps, SRE, System Administrators

---

## System Overview

### Architecture Summary
- **Frontend**: React 18 + TypeScript SPA
- **Hosting**: Static hosting with CDN distribution
- **Monitoring**: Prometheus + Grafana + AlertManager
- **Security**: HTTPS, security headers, input validation
- **Performance**: <200ms response times, 90+ Lighthouse score

### Key Components
- **Web Application**: Main calculator platform
- **CDN**: Global content delivery network
- **Monitoring Stack**: Metrics, logging, and alerting
- **Backup System**: Automated backup and recovery
- **Security System**: Continuous security monitoring

---

## Daily Operations

### Morning Checklist (9:00 AM)

#### System Health Check
```bash
# Check application availability
curl -f https://lasercalc.com/health || echo "ALERT: Application down"

# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://lasercalc.com/

# Check SSL certificate
openssl s_client -connect lasercalc.com:443 -servername lasercalc.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

#### Monitoring Dashboard Review
1. **Open Grafana Dashboard**: https://monitoring.lasercalc.com
2. **Check Key Metrics**:
   - Response times (target: <200ms)
   - Error rates (target: <0.1%)
   - Availability (target: 99.9%)
   - User activity and engagement

3. **Review Alerts**: Check for any overnight alerts or warnings

#### Log Review
```bash
# Check error logs for the last 24 hours
grep -i error /var/log/nginx/error.log | tail -50

# Check access patterns
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -20

# Check for security events
grep -i "403\|404\|500" /var/log/nginx/access.log | tail -20
```

### Evening Checklist (6:00 PM)

#### Performance Review
1. **Daily Performance Report**:
   - Average response times
   - Peak traffic periods
   - Error rate summary
   - User engagement metrics

2. **Capacity Planning**:
   - Resource utilization trends
   - Traffic growth patterns
   - Performance bottlenecks

#### Backup Verification
```bash
# Verify daily backup completion
ls -la /backups/$(date +%Y%m%d)/ || echo "ALERT: Backup missing"

# Test backup integrity
tar -tzf /backups/$(date +%Y%m%d)/app-backup.tar.gz > /dev/null || echo "ALERT: Backup corrupted"
```

---

## Monitoring and Alerting

### Key Performance Indicators (KPIs)

#### Application Metrics
- **Response Time**: <200ms (95th percentile)
- **Availability**: >99.9% uptime
- **Error Rate**: <0.1% of requests
- **Throughput**: Requests per second
- **User Engagement**: Session duration, page views

#### Infrastructure Metrics
- **CPU Usage**: <70% average
- **Memory Usage**: <80% average
- **Disk Usage**: <85% capacity
- **Network Latency**: <50ms
- **SSL Certificate**: >30 days until expiration

### Alert Thresholds

#### Critical Alerts (Immediate Response)
```yaml
alerts:
  - name: ApplicationDown
    condition: up == 0
    duration: 1m
    severity: critical
    
  - name: HighErrorRate
    condition: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    duration: 2m
    severity: critical
    
  - name: SlowResponseTime
    condition: histogram_quantile(0.95, http_request_duration_seconds) > 1.0
    duration: 5m
    severity: critical
```

#### Warning Alerts (Monitor Closely)
```yaml
alerts:
  - name: ModerateErrorRate
    condition: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
    duration: 5m
    severity: warning
    
  - name: HighCPUUsage
    condition: cpu_usage_percent > 70
    duration: 10m
    severity: warning
    
  - name: SSLCertificateExpiring
    condition: ssl_certificate_expiry_days < 30
    duration: 1h
    severity: warning
```

### Monitoring Dashboards

#### Main Dashboard Panels
1. **Application Health**:
   - Uptime percentage
   - Response time trends
   - Error rate over time
   - Active users

2. **Performance Metrics**:
   - Page load times
   - Calculator response times
   - Resource utilization
   - Cache hit rates

3. **Business Metrics**:
   - Calculator usage by type
   - User engagement metrics
   - Feature adoption rates
   - Geographic distribution

---

## Incident Response

### Incident Classification

#### Severity Levels
- **P0 (Critical)**: Complete service outage, data loss
- **P1 (High)**: Major functionality impaired, significant user impact
- **P2 (Medium)**: Minor functionality issues, limited user impact
- **P3 (Low)**: Cosmetic issues, no functional impact

### Incident Response Procedures

#### P0 - Critical Incidents

**Response Time**: 15 minutes  
**Resolution Target**: 1 hour

```bash
# Immediate Actions (First 15 minutes)
1. Acknowledge the incident
2. Assess the scope and impact
3. Implement immediate workaround if possible
4. Notify stakeholders

# Investigation and Resolution
1. Gather logs and metrics
2. Identify root cause
3. Implement fix
4. Verify resolution
5. Monitor for recurrence

# Post-Incident
1. Document incident details
2. Conduct post-mortem
3. Implement preventive measures
4. Update runbooks
```

#### Common Incident Scenarios

##### Application Outage
```bash
# Check application status
curl -f https://lasercalc.com/health

# Check server status
systemctl status nginx

# Check logs for errors
tail -f /var/log/nginx/error.log

# Restart services if needed
systemctl restart nginx

# Verify recovery
curl -f https://lasercalc.com/health
```

##### Performance Degradation
```bash
# Check resource usage
top
df -h
free -m

# Check network connectivity
ping -c 4 8.8.8.8

# Check CDN status
curl -I https://lasercalc.com/

# Review recent changes
git log --oneline -10

# Check for DDoS or unusual traffic
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -20
```

##### SSL Certificate Issues
```bash
# Check certificate expiration
openssl x509 -in /etc/ssl/certs/lasercalc.com.pem -text -noout | grep "Not After"

# Renew certificate
certbot renew --force-renewal

# Restart nginx
systemctl restart nginx

# Verify SSL
openssl s_client -connect lasercalc.com:443 -servername lasercalc.com
```

---

## Maintenance Procedures

### Scheduled Maintenance

#### Weekly Maintenance (Sundays 2:00 AM)

```bash
#!/bin/bash
# Weekly maintenance script

echo "Starting weekly maintenance..."

# Update system packages
apt update && apt upgrade -y

# Clean up logs older than 30 days
find /var/log -name "*.log" -mtime +30 -delete

# Optimize database (if applicable)
# mysql -e "OPTIMIZE TABLE calculator_history;"

# Clear temporary files
rm -rf /tmp/*

# Restart services
systemctl restart nginx

# Verify services
systemctl is-active nginx || echo "ALERT: nginx failed to start"

# Run security scan
npm audit --audit-level high

echo "Weekly maintenance completed"
```

#### Monthly Maintenance (First Sunday 2:00 AM)

```bash
#!/bin/bash
# Monthly maintenance script

echo "Starting monthly maintenance..."

# Security updates
apt update && apt upgrade -y

# SSL certificate renewal check
certbot renew --dry-run

# Backup configuration files
tar -czf /backups/config-$(date +%Y%m).tar.gz /etc/nginx/

# Performance optimization
# Clear CDN cache if needed
# curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache"

# Security audit
nmap -sS -O localhost
lynis audit system

# Capacity planning review
df -h
free -m
uptime

echo "Monthly maintenance completed"
```

### Emergency Maintenance

#### Rollback Procedures
```bash
# Rollback to previous version
git checkout HEAD~1
npm run build
systemctl restart nginx

# Verify rollback
curl -f https://lasercalc.com/health

# Update monitoring
# Notify team of rollback
```

#### Hotfix Deployment
```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix

# Apply fix and test
npm run test
npm run build

# Deploy hotfix
git push origin hotfix/critical-fix
# Trigger CI/CD pipeline

# Monitor deployment
watch curl -f https://lasercalc.com/health
```

---

## Security Operations

### Security Monitoring

#### Daily Security Checks
```bash
# Check for failed login attempts
grep "Failed" /var/log/auth.log | tail -20

# Check for suspicious network activity
netstat -tuln | grep LISTEN

# Check file integrity
aide --check

# Review security logs
grep -i "attack\|intrusion\|malware" /var/log/syslog
```

#### Security Incident Response
```bash
# Isolate affected systems
iptables -A INPUT -s SUSPICIOUS_IP -j DROP

# Collect evidence
cp /var/log/nginx/access.log /tmp/incident-$(date +%Y%m%d).log

# Analyze attack patterns
grep SUSPICIOUS_IP /var/log/nginx/access.log

# Update security rules
# Block malicious IPs in firewall/CDN
```

### Vulnerability Management

#### Regular Security Scans
```bash
# Dependency vulnerability scan
npm audit

# System vulnerability scan
nmap -sV localhost

# Web application security scan
nikto -h https://lasercalc.com

# SSL/TLS configuration test
testssl.sh lasercalc.com
```

#### Security Updates
```bash
# Apply security patches
apt update && apt list --upgradable
apt upgrade -y

# Update Node.js dependencies
npm update

# Restart affected services
systemctl restart nginx
```

---

## Backup and Recovery

### Backup Procedures

#### Daily Automated Backup
```bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app-backup.tar.gz /usr/share/nginx/html/

# Backup configuration
tar -czf $BACKUP_DIR/config-backup.tar.gz /etc/nginx/

# Backup logs
tar -czf $BACKUP_DIR/logs-backup.tar.gz /var/log/nginx/

# Upload to cloud storage
aws s3 sync $BACKUP_DIR s3://lasercalc-backups/$(date +%Y%m%d)/

# Cleanup old backups (keep 30 days)
find /backups -type d -mtime +30 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_DIR"
```

#### Recovery Procedures
```bash
#!/bin/bash
# Recovery script

RESTORE_DATE=$1
BACKUP_DIR="/backups/$RESTORE_DATE"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup not found for date: $RESTORE_DATE"
    exit 1
fi

# Stop services
systemctl stop nginx

# Restore application files
tar -xzf $BACKUP_DIR/app-backup.tar.gz -C /

# Restore configuration
tar -xzf $BACKUP_DIR/config-backup.tar.gz -C /

# Start services
systemctl start nginx

# Verify recovery
curl -f https://lasercalc.com/health

echo "Recovery completed from: $RESTORE_DATE"
```

---

## Performance Optimization

### Performance Monitoring

#### Key Performance Metrics
```bash
# Response time monitoring
curl -w "@curl-format.txt" -o /dev/null -s https://lasercalc.com/

# Resource utilization
top -b -n1 | head -20
free -m
df -h

# Network performance
iftop -t -s 10

# Application performance
# Monitor calculator response times
# Track user engagement metrics
```

#### Performance Tuning

##### Nginx Optimization
```nginx
# Worker processes optimization
worker_processes auto;
worker_connections 1024;

# Caching optimization
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Compression optimization
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
```

##### CDN Optimization
```javascript
// CloudFlare optimization settings
const optimizationSettings = {
  minify: {
    css: true,
    js: true,
    html: true
  },
  compression: "gzip",
  caching: {
    static: "1y",
    dynamic: "1h"
  }
};
```

---

## Troubleshooting Guide

### Common Issues

#### Application Not Loading
```bash
# Check service status
systemctl status nginx

# Check configuration
nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check memory
free -m
```

#### Slow Performance
```bash
# Check resource usage
top
iotop

# Check network
ping -c 4 8.8.8.8
traceroute lasercalc.com

# Check CDN
curl -I https://lasercalc.com/

# Check database (if applicable)
# SHOW PROCESSLIST;
```

#### SSL Issues
```bash
# Check certificate
openssl x509 -in /path/to/cert.pem -text -noout

# Test SSL configuration
testssl.sh lasercalc.com

# Renew certificate
certbot renew

# Restart nginx
systemctl restart nginx
```

### Diagnostic Commands

#### System Diagnostics
```bash
# System information
uname -a
lsb_release -a
uptime
who

# Resource usage
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10
lsof | wc -l

# Network diagnostics
netstat -tuln
ss -tuln
iptables -L
```

#### Application Diagnostics
```bash
# Check application health
curl -f https://lasercalc.com/health

# Check response times
time curl -s https://lasercalc.com/ > /dev/null

# Check headers
curl -I https://lasercalc.com/

# Check SSL
openssl s_client -connect lasercalc.com:443
```

---

## Contact Information

### Emergency Contacts
- **Primary On-Call**: +1-555-0123 (24/7)
- **Secondary On-Call**: +1-555-0124 (24/7)
- **Security Team**: security@lasercalc.com
- **DevOps Team**: devops@lasercalc.com

### Escalation Matrix
1. **Level 1**: On-call engineer (0-15 minutes)
2. **Level 2**: Senior engineer (15-30 minutes)
3. **Level 3**: Engineering manager (30-60 minutes)
4. **Level 4**: CTO/VP Engineering (1+ hours)

### External Vendors
- **CDN Provider**: CloudFlare Support
- **Hosting Provider**: AWS/Vercel Support
- **Monitoring**: Grafana Cloud Support
- **Security**: Security vendor contacts

---

## Documentation Updates

### Change Log
- **v1.0**: Initial operations manual
- **Next Review**: Monthly review scheduled

### Maintenance
- **Owner**: DevOps Team
- **Review Frequency**: Monthly
- **Update Process**: Git-based documentation updates

---

**Operations Manual Version**: 1.0  
**Last Updated**: $(date)  
**Next Review**: Monthly operations review
