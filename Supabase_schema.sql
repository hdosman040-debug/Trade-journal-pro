-- 1. Create Playbook Setups relational table
CREATE TABLE public.playbooks (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Trades transactional table
CREATE TABLE public.trades (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    asset TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED')),
    entry_price NUMERIC NOT NULL,
    exit_price NUMERIC,
    size NUMERIC NOT NULL,
    stop_loss NUMERIC,
    take_profit NUMERIC,
    pnl NUMERIC,
    pnl_percentage NUMERIC,
    playbook_id TEXT REFERENCES public.playbooks(id) ON DELETE SET NULL,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Psychological Logs checklist table
CREATE TABLE public.psychology_logs (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    mood TEXT NOT NULL CHECK (mood IN ('CALM', 'CONFIDENT', 'NEUTRAL', 'ANXIOUS', 'FRUSTRATED')),
    discipline_score INTEGER NOT NULL CHECK (discipline_score >= 1 AND discipline_score <= 10),
    focus_level INTEGER NOT NULL CHECK (focus_level >= 1 AND focus_level <= 10),
    notes TEXT NOT NULL,
    triggers TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychology_logs ENABLE ROW LEVEL SECURITY;

-- 5. Define private Access Policies (Users can only perform CRUD on their own UUID data)
CREATE POLICY "Allow users private access to playbooks" 
    ON public.playbooks FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users private access to trades" 
    ON public.trades FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users private access to psychology logs" 
    ON public.psychology_logs FOR ALL 
    USING (auth.uid() = user_id);

-- 6. Add indices on user_id to optimize visual layout queries
CREATE INDEX index_playbooks_user_id ON public.playbooks(user_id);
CREATE INDEX index_trades_user_id ON public.trades(user_id);
CREATE INDEX index_psychology_user_id ON public.psychology_logs(user_id);