CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  two_factor_enabled boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE servers (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES users(id),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  node_id uuid,
  status text NOT NULL DEFAULT 'offline',
  cpu_limit integer NOT NULL,
  memory_mib integer NOT NULL,
  disk_mib integer NOT NULL,
  backup_limit integer NOT NULL DEFAULT 5,
  allocation_limit integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE server_permissions (
  server_id uuid NOT NULL REFERENCES servers(id),
  user_id uuid NOT NULL REFERENCES users(id),
  permission text NOT NULL,
  PRIMARY KEY (server_id, user_id, permission)
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY,
  actor_id uuid REFERENCES users(id),
  server_id uuid REFERENCES servers(id),
  action text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
