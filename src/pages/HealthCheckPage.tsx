/**
 * Health Check Page
 * 
 * Administrative page for monitoring system health and status.
 * Accessible at /health for monitoring tools and administrators.
 */

import React from 'react';
import HealthCheck from '../components/monitoring/HealthCheck';
import SEOHead from '../components/seo/SEOHead';

const HealthCheckPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="System Health Check - Laser Cutting Calculator Platform"
        description="System health monitoring and status dashboard for the laser cutting calculator platform."
        robots="noindex, nofollow"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">System Health Check</h1>
            <p className="mt-2 text-gray-600">
              Monitor system status, performance metrics, and component health.
            </p>
          </div>

          <HealthCheck 
            autoRefresh={true}
            refreshInterval={30000}
            showDetails={true}
          />
        </div>
      </div>
    </>
  );
};

export default HealthCheckPage;
