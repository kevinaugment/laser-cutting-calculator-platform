-- ============================================================================
-- Memory System Database Schema
-- Comprehensive database schema for the laser cutting calculator memory system
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSONB GIN indexing
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================================================
-- User Profiles and Preferences
-- ============================================================================

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    preferences JSONB NOT NULL DEFAULT '{}',
    learning_model JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for user profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_preferences ON user_profiles USING GIN(preferences);
CREATE INDEX idx_user_profiles_learning_model ON user_profiles USING GIN(learning_model);
CREATE INDEX idx_user_profiles_updated_at ON user_profiles(updated_at);

-- ============================================================================
-- Calculation History
-- ============================================================================

-- Calculation records table
CREATE TABLE calculation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    calculator_type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    results JSONB NOT NULL,
    context JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for calculation records
CREATE INDEX idx_calculation_records_user_id ON calculation_records(user_id);
CREATE INDEX idx_calculation_records_session_id ON calculation_records(session_id);
CREATE INDEX idx_calculation_records_calculator_type ON calculation_records(calculator_type);
CREATE INDEX idx_calculation_records_created_at ON calculation_records(created_at);
CREATE INDEX idx_calculation_records_parameters ON calculation_records USING GIN(parameters);
CREATE INDEX idx_calculation_records_context ON calculation_records USING GIN(context);

-- Composite indexes for common queries
CREATE INDEX idx_calculation_records_user_calculator ON calculation_records(user_id, calculator_type);
CREATE INDEX idx_calculation_records_user_date ON calculation_records(user_id, created_at);

-- ============================================================================
-- Parameter Presets
-- ============================================================================

-- Parameter presets table
CREATE TABLE parameter_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calculator_type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(50) NOT NULL DEFAULT 'custom',
    visibility JSONB NOT NULL DEFAULT '{"scope": "private"}',
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usage_stats JSONB NOT NULL DEFAULT '{}',
    validation JSONB NOT NULL DEFAULT '{}'
);

-- Indexes for parameter presets
CREATE INDEX idx_parameter_presets_name ON parameter_presets(name);
CREATE INDEX idx_parameter_presets_calculator_type ON parameter_presets(calculator_type);
CREATE INDEX idx_parameter_presets_category ON parameter_presets(category);
CREATE INDEX idx_parameter_presets_created_by ON parameter_presets(created_by);
CREATE INDEX idx_parameter_presets_created_at ON parameter_presets(created_at);
CREATE INDEX idx_parameter_presets_tags ON parameter_presets USING GIN(tags);
CREATE INDEX idx_parameter_presets_parameters ON parameter_presets USING GIN(parameters);
CREATE INDEX idx_parameter_presets_visibility ON parameter_presets USING GIN(visibility);

-- Full-text search index for presets
CREATE INDEX idx_parameter_presets_search ON parameter_presets USING GIN(
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
);

-- ============================================================================
-- Recommendations
-- ============================================================================

-- Recommendations table
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    calculator_type VARCHAR(100) NOT NULL,
    current_parameters JSONB NOT NULL,
    suggested_parameters JSONB NOT NULL,
    reasoning JSONB NOT NULL DEFAULT '{}',
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    potential_impact JSONB NOT NULL DEFAULT '{}',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    user_feedback JSONB DEFAULT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for recommendations
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_type ON recommendations(type);
CREATE INDEX idx_recommendations_calculator_type ON recommendations(calculator_type);
CREATE INDEX idx_recommendations_priority ON recommendations(priority);
CREATE INDEX idx_recommendations_status ON recommendations(status);
CREATE INDEX idx_recommendations_expires_at ON recommendations(expires_at);
CREATE INDEX idx_recommendations_created_at ON recommendations(created_at);
CREATE INDEX idx_recommendations_confidence ON recommendations(confidence);

-- Composite indexes for common queries
CREATE INDEX idx_recommendations_user_status ON recommendations(user_id, status);
CREATE INDEX idx_recommendations_user_priority ON recommendations(user_id, priority);

-- ============================================================================
-- Teams and Collaboration
-- ============================================================================

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    permissions JSONB NOT NULL DEFAULT '{}',
    contribution_stats JSONB NOT NULL DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- Indexes for teams
CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_teams_created_at ON teams(created_at);

-- Indexes for team members
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(role);
CREATE INDEX idx_team_members_joined_at ON team_members(joined_at);
CREATE INDEX idx_team_members_last_active ON team_members(last_active);

-- ============================================================================
-- Shared Library Resources
-- ============================================================================

-- Calculation templates table
CREATE TABLE calculation_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calculator_type VARCHAR(100) NOT NULL,
    parameter_template JSONB NOT NULL,
    usage_instructions TEXT,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Best practices table
CREATE TABLE best_practices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    applicable_calculators TEXT[] DEFAULT '{}',
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    author_id VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge articles table
CREATE TABLE knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner',
    estimated_read_time INTEGER DEFAULT 5,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    author_id VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for shared library resources
CREATE INDEX idx_calculation_templates_calculator_type ON calculation_templates(calculator_type);
CREATE INDEX idx_calculation_templates_team_id ON calculation_templates(team_id);
CREATE INDEX idx_calculation_templates_created_by ON calculation_templates(created_by);

CREATE INDEX idx_best_practices_category ON best_practices(category);
CREATE INDEX idx_best_practices_team_id ON best_practices(team_id);
CREATE INDEX idx_best_practices_tags ON best_practices USING GIN(tags);
CREATE INDEX idx_best_practices_rating ON best_practices(rating);

CREATE INDEX idx_knowledge_articles_category ON knowledge_articles(category);
CREATE INDEX idx_knowledge_articles_difficulty ON knowledge_articles(difficulty);
CREATE INDEX idx_knowledge_articles_team_id ON knowledge_articles(team_id);
CREATE INDEX idx_knowledge_articles_tags ON knowledge_articles USING GIN(tags);
CREATE INDEX idx_knowledge_articles_rating ON knowledge_articles(rating);
CREATE INDEX idx_knowledge_articles_view_count ON knowledge_articles(view_count);

-- Full-text search indexes
CREATE INDEX idx_best_practices_search ON best_practices USING GIN(
    to_tsvector('english', title || ' ' || content)
);

CREATE INDEX idx_knowledge_articles_search ON knowledge_articles USING GIN(
    to_tsvector('english', title || ' ' || content)
);

-- ============================================================================
-- Analytics and Performance Tracking
-- ============================================================================

-- Analytics snapshots table for aggregated data
CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    timeframe_start TIMESTAMP WITH TIME ZONE NOT NULL,
    timeframe_end TIMESTAMP WITH TIME ZONE NOT NULL,
    granularity VARCHAR(20) NOT NULL,
    metrics JSONB NOT NULL,
    trends JSONB NOT NULL DEFAULT '[]',
    insights JSONB NOT NULL DEFAULT '[]',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics
CREATE INDEX idx_analytics_snapshots_user_id ON analytics_snapshots(user_id);
CREATE INDEX idx_analytics_snapshots_team_id ON analytics_snapshots(team_id);
CREATE INDEX idx_analytics_snapshots_timeframe ON analytics_snapshots(timeframe_start, timeframe_end);
CREATE INDEX idx_analytics_snapshots_granularity ON analytics_snapshots(granularity);
CREATE INDEX idx_analytics_snapshots_generated_at ON analytics_snapshots(generated_at);

-- ============================================================================
-- System Performance and Monitoring
-- ============================================================================

-- Performance metrics table
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20),
    tags JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance metrics
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);
CREATE INDEX idx_performance_metrics_tags ON performance_metrics USING GIN(tags);

-- Composite index for time-series queries
CREATE INDEX idx_performance_metrics_type_name_time ON performance_metrics(metric_type, metric_name, recorded_at);

-- ============================================================================
-- Triggers for Updated Timestamps
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parameter_presets_updated_at BEFORE UPDATE ON parameter_presets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calculation_templates_updated_at BEFORE UPDATE ON calculation_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_best_practices_updated_at BEFORE UPDATE ON best_practices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Data Retention and Cleanup
-- ============================================================================

-- Function to clean up old data based on retention policies
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Clean up old calculation records (default: 2 years)
    DELETE FROM calculation_records 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '2 years';
    
    -- Clean up expired recommendations
    DELETE FROM recommendations 
    WHERE expires_at < CURRENT_TIMESTAMP;
    
    -- Clean up old performance metrics (default: 6 months)
    DELETE FROM performance_metrics 
    WHERE recorded_at < CURRENT_TIMESTAMP - INTERVAL '6 months';
    
    -- Clean up old analytics snapshots (default: 1 year)
    DELETE FROM analytics_snapshots 
    WHERE generated_at < CURRENT_TIMESTAMP - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Views for Common Queries
-- ============================================================================

-- View for active recommendations
CREATE VIEW active_recommendations AS
SELECT 
    r.*,
    up.preferences->>'confidenceThreshold' as user_confidence_threshold
FROM recommendations r
JOIN user_profiles up ON r.user_id = up.user_id
WHERE r.status = 'pending' 
    AND r.expires_at > CURRENT_TIMESTAMP
    AND r.confidence >= COALESCE((up.preferences->>'confidenceThreshold')::decimal, 0.5);

-- View for popular presets
CREATE VIEW popular_presets AS
SELECT 
    pp.*,
    (pp.usage_stats->>'totalUsage')::integer as total_usage,
    (pp.usage_stats->>'averageRating')::decimal as average_rating
FROM parameter_presets pp
WHERE (pp.usage_stats->>'totalUsage')::integer > 0
ORDER BY (pp.usage_stats->>'totalUsage')::integer DESC;

-- View for team statistics
CREATE VIEW team_statistics AS
SELECT 
    t.id,
    t.name,
    COUNT(tm.user_id) as member_count,
    COUNT(pp.id) as shared_presets_count,
    COUNT(ct.id) as templates_count,
    COUNT(bp.id) as best_practices_count,
    COUNT(ka.id) as knowledge_articles_count
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
LEFT JOIN parameter_presets pp ON (pp.visibility->>'scope' = 'team' OR pp.visibility->>'scope' = 'organization')
LEFT JOIN calculation_templates ct ON t.id = ct.team_id
LEFT JOIN best_practices bp ON t.id = bp.team_id
LEFT JOIN knowledge_articles ka ON t.id = ka.team_id
GROUP BY t.id, t.name;

-- ============================================================================
-- Comments and Documentation
-- ============================================================================

COMMENT ON TABLE user_profiles IS 'User profiles containing preferences and learning models for personalization';
COMMENT ON TABLE calculation_records IS 'Complete history of all calculations performed by users';
COMMENT ON TABLE parameter_presets IS 'Saved parameter configurations that can be reused and shared';
COMMENT ON TABLE recommendations IS 'AI-generated recommendations for parameter optimization';
COMMENT ON TABLE teams IS 'Teams or organizations for collaborative features';
COMMENT ON TABLE team_members IS 'Membership and roles within teams';
COMMENT ON TABLE analytics_snapshots IS 'Pre-aggregated analytics data for performance';
COMMENT ON TABLE performance_metrics IS 'System performance and monitoring data';

-- ============================================================================
-- Initial Data and Configuration
-- ============================================================================

-- Insert default system configuration
INSERT INTO performance_metrics (metric_type, metric_name, value, unit) VALUES
('system', 'schema_version', 1.0, 'version'),
('system', 'initialization_date', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP), 'timestamp');

-- Create indexes for better query performance
ANALYZE;
