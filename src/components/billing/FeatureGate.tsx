/**
 * Feature Gate Component
 * Controls access to features based on subscription tier
 */

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Crown,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Settings
} from 'lucide-react';
import { PricingTier } from '../../types/billing';
import { hasFeatureAccess, getUpgradeMessage, getPricingPlan } from '../../config/pricing';

interface FeatureGateProps {
  feature: string;
  userTier: PricingTier;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  className?: string;
}

interface UpgradePromptProps {
  feature: string;
  requiredTier: PricingTier;
  userTier: PricingTier;
  className?: string;
}

// Upgrade prompt component
function UpgradePrompt({ feature, requiredTier, userTier, className = '' }: UpgradePromptProps) {
  const requiredPlan = getPricingPlan(requiredTier);
  const upgradeMessage = getUpgradeMessage(feature);

  const getTierIcon = (tier: PricingTier) => {
    switch (tier) {
      case PricingTier.PRO:
        return <Star className="w-5 h-5" />;
      case PricingTier.ENTERPRISE:
        return <Crown className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getTierColor = (tier: PricingTier) => {
    switch (tier) {
      case PricingTier.PRO:
        return 'from-blue-500 to-purple-600';
      case PricingTier.ENTERPRISE:
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('team') || feature.includes('collaboration')) {
      return <Users className="w-6 h-6" />;
    }
    if (feature.includes('api') || feature.includes('integration')) {
      return <Settings className="w-6 h-6" />;
    }
    if (feature.includes('security') || feature.includes('sso')) {
      return <Shield className="w-6 h-6" />;
    }
    return <Lock className="w-6 h-6" />;
  };

  return (
    <div className={`relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 ${className}`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getTierColor(requiredTier)} opacity-5`} />
      
      <div className="relative p-6 text-center">
        {/* Feature icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          {getFeatureIcon(feature)}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Premium Feature
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600">
          {upgradeMessage}
        </p>

        {/* Required tier badge */}
        <div className="mb-4 inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
          {getTierIcon(requiredTier)}
          <span className="ml-2">Requires {requiredPlan.name}</span>
        </div>

        {/* Upgrade button */}
        <div className="space-y-2">
          <Link
            to="/pricing"
            className={`inline-flex items-center rounded-lg bg-gradient-to-r ${getTierColor(requiredTier)} px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-105`}
          >
            Upgrade to {requiredPlan.name}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          
          <div className="text-xs text-gray-500">
            Starting at ${requiredPlan.prices.monthly}/month
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-4 text-left">
          <div className="text-xs font-medium text-gray-700 mb-2">
            What you'll get:
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            {requiredPlan.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                {feature}
              </li>
            ))}
            {requiredPlan.features.length > 3 && (
              <li className="text-gray-500">
                + {requiredPlan.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Locked content overlay
function LockedOverlay({ feature, requiredTier, userTier }: { feature: string; requiredTier: PricingTier; userTier: PricingTier }) {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-center p-4">
        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700 mb-2">
          Premium Feature
        </p>
        <Link
          to="/pricing"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Upgrade to unlock
          <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  );
}

// Main FeatureGate component
export function FeatureGate({
  feature,
  userTier,
  children,
  fallback,
  showUpgradePrompt = true,
  className = ''
}: FeatureGateProps) {
  const hasAccess = hasFeatureAccess(userTier, feature);

  // If user has access, render children normally
  if (hasAccess) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Determine required tier for this feature
  const getRequiredTier = (feature: string): PricingTier => {
    // This is a simplified mapping - in a real app, you'd get this from your feature gates config
    if (feature.includes('team') || feature.includes('api') || feature.includes('sso') || feature.includes('enterprise')) {
      return PricingTier.ENTERPRISE;
    }
    return PricingTier.PRO;
  };

  const requiredTier = getRequiredTier(feature);

  // Show upgrade prompt
  if (showUpgradePrompt) {
    return (
      <UpgradePrompt
        feature={feature}
        requiredTier={requiredTier}
        userTier={userTier}
        className={className}
      />
    );
  }

  // Show locked overlay over children
  return (
    <div className={`relative ${className}`}>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <LockedOverlay
        feature={feature}
        requiredTier={requiredTier}
        userTier={userTier}
      />
    </div>
  );
}

// Hook for checking feature access
export function useFeatureAccess(userTier: PricingTier) {
  return {
    hasAccess: (feature: string) => hasFeatureAccess(userTier, feature),
    getUpgradeMessage: (feature: string) => getUpgradeMessage(feature),
    canAccessCalculator: (calculatorId: string) => {
      // Implementation would check calculator access based on tier
      return true; // Placeholder
    }
  };
}

// Higher-order component for feature gating
export function withFeatureGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  feature: string,
  fallbackComponent?: React.ComponentType<P>
) {
  return function FeatureGatedComponent(props: P & { userTier: PricingTier }) {
    const { userTier, ...restProps } = props;
    const hasAccess = hasFeatureAccess(userTier, feature);

    if (hasAccess) {
      return <WrappedComponent {...(restProps as P)} />;
    }

    if (fallbackComponent) {
      const FallbackComponent = fallbackComponent;
      return <FallbackComponent {...(restProps as P)} />;
    }

    return (
      <FeatureGate feature={feature} userTier={userTier} showUpgradePrompt={true}>
        <WrappedComponent {...(restProps as P)} />
      </FeatureGate>
    );
  };
}

// Utility components for common use cases
export function ProFeature({ children, userTier, className }: { children: ReactNode; userTier: PricingTier; className?: string }) {
  return (
    <FeatureGate feature="pro_feature" userTier={userTier} className={className}>
      {children}
    </FeatureGate>
  );
}

export function EnterpriseFeature({ children, userTier, className }: { children: ReactNode; userTier: PricingTier; className?: string }) {
  return (
    <FeatureGate feature="enterprise_feature" userTier={userTier} className={className}>
      {children}
    </FeatureGate>
  );
}

export default FeatureGate;
