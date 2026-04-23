/**
 * Centralised TanStack Query key factory for every Lovable Cloud table.
 *
 * Why centralise?
 *   - Type-safe invalidation: `queryClient.invalidateQueries({ queryKey: qk.profiles.all })`
 *   - No accidental cache-key collisions across hooks.
 *   - Single place to audit "what cache buckets exist" when refactoring.
 *
 * Convention: `<domain>.<scope>(...args)` returns a tuple. The first element
 * is the domain string so a partial-match invalidation hits everything below.
 */
export const qk = {
  // Identity (P7.1)
  profiles: {
    all: ['profiles'] as const,
    byId: (id: string) => ['profiles', 'byId', id] as const,
    me: ['profiles', 'me'] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    byId: (id: string) => ['organizations', 'byId', id] as const,
    bySlug: (slug: string) => ['organizations', 'bySlug', slug] as const,
    mine: ['organizations', 'mine'] as const,
  },
  userSettings: {
    me: ['userSettings', 'me'] as const,
  },
  professionalProfiles: {
    all: ['professionalProfiles'] as const,
    byId: (id: string) => ['professionalProfiles', 'byId', id] as const,
    me: ['professionalProfiles', 'me'] as const,
    forHire: (filters?: Record<string, unknown>) =>
      ['professionalProfiles', 'forHire', filters ?? {}] as const,
  },

  // Marketplace (P7.2)
  jobs: {
    all: ['jobs'] as const,
    byId: (id: string) => ['jobs', 'byId', id] as const,
    list: (filters?: Record<string, unknown>) => ['jobs', 'list', filters ?? {}] as const,
    mine: ['jobs', 'mine'] as const,
  },
  gigs: {
    all: ['gigs'] as const,
    byId: (id: string) => ['gigs', 'byId', id] as const,
    list: (filters?: Record<string, unknown>) => ['gigs', 'list', filters ?? {}] as const,
    mine: ['gigs', 'mine'] as const,
  },
  services: {
    all: ['services'] as const,
    byId: (id: string) => ['services', 'byId', id] as const,
    list: (filters?: Record<string, unknown>) => ['services', 'list', filters ?? {}] as const,
    mine: ['services', 'mine'] as const,
  },
  projects: {
    all: ['projects'] as const,
    byId: (id: string) => ['projects', 'byId', id] as const,
    list: (filters?: Record<string, unknown>) => ['projects', 'list', filters ?? {}] as const,
    mine: ['projects', 'mine'] as const,
  },

  // Work execution (P7.3)
  tasks: {
    byProject: (projectId: string) => ['tasks', 'byProject', projectId] as const,
    byAssignee: (userId: string) => ['tasks', 'byAssignee', userId] as const,
  },
  milestones: {
    byProject: (projectId: string) => ['milestones', 'byProject', projectId] as const,
  },
  deliverables: {
    byProject: (projectId: string) => ['deliverables', 'byProject', projectId] as const,
  },
  timeEntries: {
    me: ['timeEntries', 'me'] as const,
    byProject: (projectId: string) => ['timeEntries', 'byProject', projectId] as const,
  },

  // Recruitment (P7.4) — recruiter-private
  candidates: {
    mine: (stage?: string) => ['candidates', 'mine', stage ?? 'all'] as const,
    byId: (id: string) => ['candidates', 'byId', id] as const,
  },
  applications: {
    byJob: (jobId: string) => ['applications', 'byJob', jobId] as const,
    byCandidate: (candidateId: string) => ['applications', 'byCandidate', candidateId] as const,
  },
  interviews: {
    upcoming: ['interviews', 'upcoming'] as const,
    byApplication: (id: string) => ['interviews', 'byApplication', id] as const,
  },
  scorecards: {
    byInterview: (id: string) => ['scorecards', 'byInterview', id] as const,
  },

  // Social (P7.5)
  posts: {
    feed: (filters?: Record<string, unknown>) => ['posts', 'feed', filters ?? {}] as const,
    byAuthor: (id: string) => ['posts', 'byAuthor', id] as const,
    byId: (id: string) => ['posts', 'byId', id] as const,
  },
  connections: {
    me: ['connections', 'me'] as const,
  },
  messages: {
    threads: ['messages', 'threads'] as const,
    byThread: (id: string) => ['messages', 'byThread', id] as const,
  },
  businessCards: {
    byShortcode: (s: string) => ['businessCards', 'byShortcode', s] as const,
    mine: ['businessCards', 'mine'] as const,
  },

  // Commerce (P7.6)
  orders: {
    asBuyer: ['orders', 'asBuyer'] as const,
    asSeller: ['orders', 'asSeller'] as const,
    byId: (id: string) => ['orders', 'byId', id] as const,
  },
  invoices: {
    issued: ['invoices', 'issued'] as const,
    received: ['invoices', 'received'] as const,
    byId: (id: string) => ['invoices', 'byId', id] as const,
  },
  payments: {
    mine: ['payments', 'mine'] as const,
  },
  payouts: {
    mine: ['payouts', 'mine'] as const,
  },

  // Trust (P7.7)
  mediaAssets: {
    mine: ['mediaAssets', 'mine'] as const,
    byId: (id: string) => ['mediaAssets', 'byId', id] as const,
  },
  reviews: {
    forUser: (id: string) => ['reviews', 'forUser', id] as const,
    forGig: (id: string) => ['reviews', 'forGig', id] as const,
  },
  disputes: {
    mine: ['disputes', 'mine'] as const,
    byId: (id: string) => ['disputes', 'byId', id] as const,
  },

  // Identity foundations (Phase 7 wave 1)
  legalAcceptances: {
    all: ['legalAcceptances'] as const,
    me: ['legalAcceptances', 'me'] as const,
    check: (kind: string, version: string) =>
      ['legalAcceptances', 'check', kind, version] as const,
  },
  auditLogs: {
    recent: (limit: number) => ['auditLogs', 'recent', limit] as const,
    forTarget: (table: string, id: string) =>
      ['auditLogs', 'forTarget', table, id] as const,
  },

  // Social / comms wave 2 (Phase 8)
  connectionRequests: {
    incoming: ['connectionRequests', 'incoming'] as const,
    outgoing: ['connectionRequests', 'outgoing'] as const,
    byId: (id: string) => ['connectionRequests', 'byId', id] as const,
  },
  follows: {
    followers: (userId: string) => ['follows', 'followers', userId] as const,
    following: (userId: string) => ['follows', 'following', userId] as const,
    isFollowing: (followee: string) => ['follows', 'isFollowing', followee] as const,
  },
  blocks: {
    mine: ['blocks', 'mine'] as const,
  },
  postReactions: {
    byPost: (postId: string) => ['postReactions', 'byPost', postId] as const,
    mineForPost: (postId: string) => ['postReactions', 'mineForPost', postId] as const,
  },
  postComments: {
    byPost: (postId: string) => ['postComments', 'byPost', postId] as const,
  },
  threads: {
    mine: ['threads', 'mine'] as const,
    byId: (id: string) => ['threads', 'byId', id] as const,
  },
  notifications: {
    mine: ['notifications', 'mine'] as const,
    unreadCount: ['notifications', 'unreadCount'] as const,
  },
  savedItems: {
    mine: (kind?: string) => ['savedItems', 'mine', kind ?? 'all'] as const,
    isSaved: (kind: string, id: string) => ['savedItems', 'isSaved', kind, id] as const,
  },

  // Phase 9.1 backfill domains
  proposals: {
    mine: ['proposals', 'mine'] as const,
    byProject: (projectId: string) => ['proposals', 'byProject', projectId] as const,
    byId: (id: string) => ['proposals', 'byId', id] as const,
  },
  contracts: {
    mine: ['contracts', 'mine'] as const,
    byId: (id: string) => ['contracts', 'byId', id] as const,
  },
  groups: {
    all: ['groups'] as const,
    list: (filters?: Record<string, unknown>) => ['groups', 'list', filters ?? {}] as const,
    byId: (id: string) => ['groups', 'byId', id] as const,
    mine: ['groups', 'mine'] as const,
    members: (groupId: string) => ['groups', 'members', groupId] as const,
  },
  webinars: {
    upcoming: ['webinars', 'upcoming'] as const,
    byId: (id: string) => ['webinars', 'byId', id] as const,
    mine: ['webinars', 'mine'] as const,
  },
  events: {
    upcoming: ['events', 'upcoming'] as const,
    byId: (id: string) => ['events', 'byId', id] as const,
    mine: ['events', 'mine'] as const,
  },
  calls: {
    mine: ['calls', 'mine'] as const,
    byId: (id: string) => ['calls', 'byId', id] as const,
  },
  webhooks: {
    mine: ['webhooks', 'mine'] as const,
    byId: (id: string) => ['webhooks', 'byId', id] as const,
  },
  mentorship: {
    asMentor: ['mentorship', 'asMentor'] as const,
    asMentee: ['mentorship', 'asMentee'] as const,
    byId: (id: string) => ['mentorship', 'byId', id] as const,
  },
} as const;
