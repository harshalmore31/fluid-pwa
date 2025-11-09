-- Hackathon Team Formation Platform Database Schema
-- This SQL file should be run in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    roll_no TEXT UNIQUE NOT NULL,
    branch TEXT NOT NULL,
    year INTEGER NOT NULL,
    bio TEXT,
    profile_picture_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    performance_score NUMERIC DEFAULT 0,
    total_hackathons INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT false,
    looking_for_team BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills (Many-to-Many)
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    endorsed_by UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Hackathons table
CREATE TABLE hackathons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    organizer TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline DATE,
    min_team_size INTEGER DEFAULT 1,
    max_team_size INTEGER DEFAULT 4,
    external_link TEXT,
    banner_url TEXT,
    status TEXT CHECK (status IN ('upcoming', 'active', 'completed')) DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hackathon required skills
CREATE TABLE hackathon_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(hackathon_id, skill_id)
);

-- User hackathon participation
CREATE TABLE user_hackathons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
    participation_status TEXT CHECK (participation_status IN ('interested', 'participating', 'completed')) DEFAULT 'interested',
    round_reached INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    final_rank TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hackathon_id)
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 4,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Team applications
CREATE TABLE team_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team invites
CREATE TABLE team_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    inviter_id UUID REFERENCES users(id),
    invitee_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections (Friends/Previous teammates)
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (user1_id < user2_id)
);

-- Team chat messages
CREATE TABLE team_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_roll_no ON users(roll_no);
CREATE INDEX idx_users_performance_score ON users(performance_score DESC);
CREATE INDEX idx_users_looking_for_team ON users(looking_for_team) WHERE looking_for_team = true;

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

CREATE INDEX idx_hackathons_status ON hackathons(status);
CREATE INDEX idx_hackathons_start_date ON hackathons(start_date);

CREATE INDEX idx_user_hackathons_user_id ON user_hackathons(user_id);
CREATE INDEX idx_user_hackathons_hackathon_id ON user_hackathons(hackathon_id);

CREATE INDEX idx_teams_hackathon_id ON teams(hackathon_id);
CREATE INDEX idx_teams_leader_id ON teams(leader_id);
CREATE INDEX idx_teams_is_open ON teams(is_open) WHERE is_open = true;

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

CREATE INDEX idx_team_applications_team_id ON team_applications(team_id);
CREATE INDEX idx_team_applications_user_id ON team_applications(user_id);
CREATE INDEX idx_team_applications_status ON team_applications(status);

CREATE INDEX idx_team_invites_invitee_id ON team_invites(invitee_id);
CREATE INDEX idx_team_invites_status ON team_invites(status);

CREATE INDEX idx_team_chat_team_id_created ON team_chat_messages(team_id, created_at DESC);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hackathons_updated_at BEFORE UPDATE ON hackathons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_hackathons_updated_at BEFORE UPDATE ON user_hackathons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_applications_updated_at BEFORE UPDATE ON team_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_invites_updated_at BEFORE UPDATE ON team_invites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate performance score
CREATE OR REPLACE FUNCTION calculate_performance_score(user_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_points NUMERIC;
    total_hackathons INTEGER;
    score NUMERIC;
BEGIN
    SELECT
        COALESCE(SUM(points_earned), 0),
        COUNT(*)
    INTO total_points, total_hackathons
    FROM user_hackathons
    WHERE user_id = user_uuid;

    IF total_hackathons = 0 THEN
        RETURN 0;
    END IF;

    score := (total_points / total_hackathons) + (total_hackathons * 2);

    -- Update user's performance score
    UPDATE users
    SET
        performance_score = score,
        total_hackathons = total_hackathons
    WHERE id = user_uuid;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate performance score when user_hackathons updated
CREATE OR REPLACE FUNCTION update_performance_score()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM calculate_performance_score(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_performance_score
AFTER INSERT OR UPDATE ON user_hackathons
FOR EACH ROW
EXECUTE FUNCTION update_performance_score();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Skills policies (read-only for all, admins can manage)
CREATE POLICY "Anyone can view skills" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage skills" ON skills
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_admin = true)
    );

-- User skills policies
CREATE POLICY "Anyone can view user skills" ON user_skills
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own skills" ON user_skills
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Hackathons policies
CREATE POLICY "Anyone can view hackathons" ON hackathons
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage hackathons" ON hackathons
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_admin = true)
    );

-- Hackathon skills policies
CREATE POLICY "Anyone can view hackathon skills" ON hackathon_skills
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage hackathon skills" ON hackathon_skills
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_admin = true)
    );

-- User hackathons policies
CREATE POLICY "Users can view own hackathon participation" ON user_hackathons
    FOR SELECT USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can manage own hackathon participation" ON user_hackathons
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own participation" ON user_hackathons
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can update hackathon results" ON user_hackathons
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_admin = true)
    );

-- Teams policies
CREATE POLICY "Anyone can view teams" ON teams
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid()::text = leader_id::text);

CREATE POLICY "Team leaders can update teams" ON teams
    FOR UPDATE USING (auth.uid()::text = leader_id::text);

CREATE POLICY "Team leaders can delete teams" ON teams
    FOR DELETE USING (auth.uid()::text = leader_id::text);

-- Team members policies
CREATE POLICY "Anyone can view team members" ON team_members
    FOR SELECT USING (true);

CREATE POLICY "Team leaders can manage members" ON team_members
    FOR ALL USING (
        EXISTS (SELECT 1 FROM teams WHERE id = team_members.team_id AND leader_id::text = auth.uid()::text)
    );

CREATE POLICY "Users can leave teams" ON team_members
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Team applications policies
CREATE POLICY "Users can view own applications" ON team_applications
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR
        EXISTS (SELECT 1 FROM teams WHERE id = team_applications.team_id AND leader_id::text = auth.uid()::text)
    );

CREATE POLICY "Users can create applications" ON team_applications
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Team leaders can update applications" ON team_applications
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM teams WHERE id = team_applications.team_id AND leader_id::text = auth.uid()::text)
    );

-- Team invites policies
CREATE POLICY "Users can view own invites" ON team_invites
    FOR SELECT USING (
        auth.uid()::text = invitee_id::text OR
        EXISTS (SELECT 1 FROM teams WHERE id = team_invites.team_id AND leader_id::text = auth.uid()::text)
    );

CREATE POLICY "Team leaders can create invites" ON team_invites
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM teams WHERE id = team_invites.team_id AND leader_id::text = auth.uid()::text)
    );

CREATE POLICY "Invitees can update invites" ON team_invites
    FOR UPDATE USING (auth.uid()::text = invitee_id::text);

-- Connections policies
CREATE POLICY "Users can view all connections" ON connections
    FOR SELECT USING (true);

CREATE POLICY "Users can create connections" ON connections
    FOR INSERT WITH CHECK (
        auth.uid()::text = user1_id::text OR auth.uid()::text = user2_id::text
    );

-- Team chat policies
CREATE POLICY "Team members can view team chat" ON team_chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = team_chat_messages.team_id
            AND team_members.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Team members can send messages" ON team_chat_messages
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id::text AND
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = team_chat_messages.team_id
            AND team_members.user_id::text = auth.uid()::text
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert some default skills
INSERT INTO skills (name, category) VALUES
    ('React', 'Frontend'),
    ('Next.js', 'Frontend'),
    ('TypeScript', 'Language'),
    ('JavaScript', 'Language'),
    ('Python', 'Language'),
    ('Node.js', 'Backend'),
    ('Machine Learning', 'AI/ML'),
    ('Deep Learning', 'AI/ML'),
    ('TensorFlow', 'AI/ML'),
    ('PyTorch', 'AI/ML'),
    ('Blockchain', 'Web3'),
    ('Solidity', 'Web3'),
    ('Docker', 'DevOps'),
    ('Kubernetes', 'DevOps'),
    ('AWS', 'Cloud'),
    ('Azure', 'Cloud'),
    ('GCP', 'Cloud'),
    ('PostgreSQL', 'Database'),
    ('MongoDB', 'Database'),
    ('Redis', 'Database'),
    ('GraphQL', 'API'),
    ('REST API', 'API'),
    ('Flutter', 'Mobile'),
    ('React Native', 'Mobile'),
    ('UI/UX Design', 'Design'),
    ('Figma', 'Design'),
    ('Tailwind CSS', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('Angular', 'Frontend'),
    ('Django', 'Backend'),
    ('Flask', 'Backend'),
    ('FastAPI', 'Backend'),
    ('Spring Boot', 'Backend'),
    ('Java', 'Language'),
    ('C++', 'Language'),
    ('Go', 'Language'),
    ('Rust', 'Language'),
    ('Data Science', 'AI/ML'),
    ('Computer Vision', 'AI/ML'),
    ('NLP', 'AI/ML'),
    ('Cybersecurity', 'Security'),
    ('Penetration Testing', 'Security'),
    ('IoT', 'Hardware'),
    ('Arduino', 'Hardware'),
    ('Raspberry Pi', 'Hardware'),
    ('Game Development', 'Gaming'),
    ('Unity', 'Gaming'),
    ('Unreal Engine', 'Gaming');

-- Note: To create a sample admin user, run this after the first user signs up:
-- UPDATE users SET is_admin = true WHERE email = 'your-admin@vit.edu.in';
