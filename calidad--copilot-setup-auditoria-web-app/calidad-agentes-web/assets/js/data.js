// Data Management Module
// Handles all data operations including authentication, teams, agents, audits, and metrics

const DataManager = {
  // Storage keys
  STORAGE_KEYS: {
    USER: 'calidad_user',
    AUDITS: 'calidad_audits',
    TEAMS: 'calidad_teams',
    METRICS: 'calidad_metrics',
    WEEKLY_METRICS: 'calidad_weekly_metrics',
    WEEK_CONFIG: 'calidad_week_config',
    AUDIT_VIEWS: 'calidad_audit_views',
    AUDIT_COMMENTS: 'calidad_audit_comments'
  },

  // Remove all persisted app data so every load starts clean
  resetStorage() {
    Object.values(this.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },

  // Team definitions
  TEAMS: [
    { id: 'soporte-usuarios', name: 'Soporte Usuarios', color: '#38CEA6', email: 'soporte.usuarios@ridery.com' },
    { id: 'soporte-conductores', name: 'Soporte Conductores', color: '#06b6d4', email: 'soporte.conductores@ridery.com' },
    { id: 'soporte-ecr', name: 'Soporte de ECR', color: '#a855f7', email: 'soporte.ecr@ridery.com' },
    { id: 'soporte-corporativo', name: 'Soporte de Corporativo', color: '#f59e0b', email: 'soporte.corporativo@ridery.com' },
    { id: 'soporte-delivery', name: 'Soporte de Delivery Zupper', color: '#ef4444', email: 'soporte.delivery@ridery.com' }
  ],

  // Default agents (Complete team examples with all shifts)
  DEFAULT_AGENTS: {
    'soporte-usuarios': [],
    'soporte-conductores': [
      { name: 'Adriana Rojas', email: 'adriana.rojas@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Nicole Serrano', email: 'nicole.serrano@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Maryolis Castillo', email: 'maryolis.castillo@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Yale', email: 'yale@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Saroaly Torres', email: 'saroaly.torres@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'María Serrano', email: 'maria.serrano@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Roibert Arteaga', email: 'roibert.arteaga@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Abraham Brito', email: 'abraham.brito@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Luzwaldo Sanz', email: 'luzwaldo.sanz@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Naygreth Darias', email: 'naygreth.darias@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Ignacio Queremel', email: 'ignacio.queremel@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Andrea Viadero', email: 'andrea.viadero@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Miguel Corena', email: 'miguel.corena@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Glorian Sierra', email: 'glorian.sierra@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Kevin', email: 'kevin@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Olga Fonseca', email: 'olga.fonseca@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Gabriel Codallo', email: 'gabriel.codallo@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Luz Aguilar', email: 'luz.aguilar@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Gianpiero Villalba', email: 'gianpiero.villalba@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Francis Serrano', email: 'francis.serrano@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Elizabeth Rodríguez', email: 'elizabeth.rodriguez@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Sara Villegas', email: 'sara.villegas@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Tiffany Urbina', email: 'tiffany.urbina@ridery.com', team: 'soporte-conductores', shift: 'AM' }
    ],
    'soporte-ecr': [],
    'soporte-corporativo': [],
    'soporte-delivery': []
  },

  // Test accounts with roles
  TEST_ACCOUNTS: {
    'editor@ridery.com': { email: 'editor@ridery.com', role: 'editor' },
    'lector@ridery.com': { email: 'lector@ridery.com', role: 'viewer' },
    // Team-specific accounts
    'soporte.usuarios@ridery.com': { email: 'soporte.usuarios@ridery.com', role: 'viewer', team: 'soporte-usuarios' },
    'soporte.conductores@ridery.com': { email: 'soporte.conductores@ridery.com', role: 'viewer', team: 'soporte-conductores' },
    'soporte.ecr@ridery.com': { email: 'soporte.ecr@ridery.com', role: 'viewer', team: 'soporte-ecr' },
    'soporte.corporativo@ridery.com': { email: 'soporte.corporativo@ridery.com', role: 'viewer', team: 'soporte-corporativo' },
    'soporte.delivery@ridery.com': { email: 'soporte.delivery@ridery.com', role: 'viewer', team: 'soporte-delivery' }
  },

  // Initialize data (non-destructive; only seeds missing stores)
  init() {
    if (!localStorage.getItem(this.STORAGE_KEYS.AUDITS)) {
      localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.TEAMS)) {
      const teamsData = {};
      this.TEAMS.forEach(team => {
        teamsData[team.id] = {
          ...team,
          members: this.DEFAULT_AGENTS[team.id] || []
        };
      });
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teamsData));
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.METRICS)) {
      localStorage.setItem(this.STORAGE_KEYS.METRICS, JSON.stringify({}));
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.WEEKLY_METRICS)) {
      localStorage.setItem(this.STORAGE_KEYS.WEEKLY_METRICS, JSON.stringify({}));
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG)) {
      localStorage.setItem(this.STORAGE_KEYS.WEEK_CONFIG, JSON.stringify({}));
    }
  },

  // Teams management
  getAllTeams() {
    const teamsStr = localStorage.getItem(this.STORAGE_KEYS.TEAMS);
    return teamsStr ? JSON.parse(teamsStr) : {};
  },

  getTeamById(teamId) {
    const teams = this.getAllTeams();
    return teams[teamId] || null;
  },

  getAllAgents() {
    const teams = this.getAllTeams();
    const agents = [];
    Object.values(teams).forEach(team => {
      team.members.forEach(member => {
        agents.push({ ...member, teamName: team.name, teamColor: team.color });
      });
    });
    return agents;
  },

  addTeamMember(teamId, memberData) {
    const teams = this.getAllTeams();
    if (teams[teamId]) {
      teams[teamId].members.push({
        ...memberData,
        team: teamId,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      return true;
    }
    return false;
  },

  removeTeamMember(teamId, memberEmail) {
    const teams = this.getAllTeams();
    if (teams[teamId]) {
      teams[teamId].members = teams[teamId].members.filter(m => m.email !== memberEmail);
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      return true;
    }
    return false;
  },

  // Authentication
  login(email) {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if it's a test account
    if (this.TEST_ACCOUNTS[normalizedEmail]) {
      const user = this.TEST_ACCOUNTS[normalizedEmail];
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    }
    
    // Check if user is a team member (editors only)
    const teams = this.getAllTeams();
    for (let teamId in teams) {
      const member = teams[teamId].members.find(m => m.email === normalizedEmail);
      if (member) {
        const user = { email: normalizedEmail, role: 'viewer', team: teamId };
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
        return user;
      }
    }
    
    // Default to viewer role for any other email
    const user = { email: normalizedEmail, role: 'viewer' };
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(this.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  isEditor() {
    const user = this.getCurrentUser();
    return user && user.role === 'editor';
  },

  getUserTeam() {
    const user = this.getCurrentUser();
    return user ? user.team : null;
  },

  // Audit CRUD operations with new structure
  getAllAudits() {
    const auditsStr = localStorage.getItem(this.STORAGE_KEYS.AUDITS);
    return auditsStr ? JSON.parse(auditsStr) : [];
  },

  getAuditById(id) {
    const audits = this.getAllAudits();
    return audits.find(audit => audit.id === id);
  },

  createAudit(auditData) {
    const audits = this.getAllAudits();
    const newAudit = {
      id: this.generateId(),
      ...auditData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    audits.push(newAudit);
    localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(audits));
    return newAudit;
  },

  updateAudit(id, auditData) {
    const audits = this.getAllAudits();
    const index = audits.findIndex(audit => audit.id === id);
    if (index !== -1) {
      audits[index] = {
        ...audits[index],
        ...auditData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(audits));
      return audits[index];
    }
    return null;
  },

  deleteAudit(id) {
    const audits = this.getAllAudits();
    const filtered = audits.filter(audit => audit.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(filtered));
    return true;
  },

  // Get audits by month
  getAuditsByMonth(year, month) {
    const audits = this.getAllAudits();
    let filteredAudits = audits.filter(audit => {
      const auditDate = new Date(audit.date);
      return auditDate.getFullYear() === year && auditDate.getMonth() === month;
    });
    
    // Apply team-based filtering for team users
    const userTeam = this.getUserTeam();
    if (userTeam) {
      filteredAudits = filteredAudits.filter(audit => audit.teamId === userTeam);
    }
    
    return filteredAudits;
  },

  // Search and filter
  searchAudits(searchTerm, teamFilter) {
    let audits = this.getAllAudits();
    
    // Apply team-based filtering for team users
    const userTeam = this.getUserTeam();
    if (userTeam) {
      // If user belongs to a specific team, only show audits from that team
      audits = audits.filter(audit => audit.teamId === userTeam);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      audits = audits.filter(audit => 
        audit.agentName.toLowerCase().includes(term) ||
        (audit.ticketId && audit.ticketId.toLowerCase().includes(term)) ||
        (audit.observations && audit.observations.toLowerCase().includes(term)) ||
        (audit.ticketSummary && audit.ticketSummary.toLowerCase().includes(term))
      );
    }
    
    if (teamFilter) {
      audits = audits.filter(audit => audit.teamId === teamFilter);
    }
    
    return audits;
  },

  // Calculate score based on new pillar system with STRICT 2-error rule
  // Rule: 2 or more errors = 0 points (no partial scores)
  calculateAuditScore(evaluationData) {
    // Count total errors (unchecked items)
    const empatiaCriteria = [
      'metodoRided', 'lenguajePositivo', 'acompanamiento', 
      'personalizacion', 'estructura', 'usoIaOrtografia'
    ];
    
    const gestionTicketCriteria = [
      'estadosTicket', 'ausenciaCliente', 'validacionHistorial', 
      'tipificacionCriterio', 'retencionTickets', 'tiempoRespuesta', 'tiempoGestion'
    ];
    
    const conocimientoCriteria = [
      'serviciosPromociones', 'informacionVeraz', 
      'parlamentosContingencia', 'honestidadTransparencia'
    ];
    
    const herramientasCriteria = [
      'rideryOffice', 'adminZendesk', 'driveManuales', 
      'slack', 'generacionReportes', 'cargaIncidencias'
    ];

    // Count errors (unchecked = error)
    let totalErrors = 0;
    
    empatiaCriteria.forEach(criterion => {
      if (!evaluationData.empatia?.[criterion]) totalErrors++;
    });
    
    gestionTicketCriteria.forEach(criterion => {
      if (!evaluationData.gestion?.ticket?.[criterion]) totalErrors++;
    });
    
    conocimientoCriteria.forEach(criterion => {
      if (!evaluationData.gestion?.conocimiento?.[criterion]) totalErrors++;
    });
    
    herramientasCriteria.forEach(criterion => {
      if (!evaluationData.gestion?.herramientas?.[criterion]) totalErrors++;
    });

    // STRICT RULE: 2 or more errors = 0 points
    if (totalErrors >= 2) {
      return 0;
    }

    // If 0 or 1 error, calculate normal score
    // Pilar Empatía (50%) - 6 criterios x 8.33 puntos = 50%
    const empatiaScore = empatiaCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.empatia?.[criterion] ? 8.33 : 0);
    }, 0);

    // Pilar Gestión (50%)
    // Gestión de ticket (33% of 50% = 16.67%)
    const gestionTicketScore = gestionTicketCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.gestion?.ticket?.[criterion] ? (16.67 / 7) : 0);
    }, 0);

    // Conocimiento Integral (33% of 50% = 16.67%)
    const conocimientoScore = conocimientoCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.gestion?.conocimiento?.[criterion] ? (16.67 / 4) : 0);
    }, 0);

    // Uso estratégico de herramientas (33% of 50% = 16.67%)
    const herramientasScore = herramientasCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.gestion?.herramientas?.[criterion] ? (16.67 / 6) : 0);
    }, 0);

    const totalScore = empatiaScore + gestionTicketScore + conocimientoScore + herramientasScore;
    return Math.round(totalScore * 100) / 100;
  },

  // Metrics calculations
  getWeeklyMetrics() {
    const audits = this.getAllAudits();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyAudits = audits.filter(audit => 
      new Date(audit.date) >= oneWeekAgo
    );
    
    return this.calculateMetrics(weeklyAudits);
  },

  getMonthlyMetrics() {
    const audits = this.getAllAudits();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const monthlyAudits = audits.filter(audit => {
      const auditDate = new Date(audit.date);
      return auditDate.getFullYear() === currentYear && auditDate.getMonth() === currentMonth;
    });
    
    return this.calculateMetrics(monthlyAudits);
  },

  getAnnualMetrics() {
    const audits = this.getAllAudits();
    const currentYear = new Date().getFullYear();
    
    const annualAudits = audits.filter(audit => 
      new Date(audit.date).getFullYear() === currentYear
    );
    
    return this.calculateMetrics(annualAudits);
  },

  calculateMetrics(audits) {
    const total = audits.length;
    
    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        uniqueAgents: 0,
        byAgent: {},
        byTeam: {},
        byDate: {}
      };
    }
    
    // Calculate average score
    const totalScore = audits.reduce((sum, audit) => sum + parseFloat(audit.score || 0), 0);
    const avgScore = (totalScore / total).toFixed(1);
    
    // Get unique agents
    const uniqueAgents = [...new Set(audits.map(audit => audit.agentName))];
    
    // Group by agent
    const byAgent = {};
    audits.forEach(audit => {
      if (!byAgent[audit.agentName]) {
        byAgent[audit.agentName] = {
          count: 0,
          totalScore: 0,
          lastAudit: audit.date,
          teamId: audit.teamId,
          audits: []
        };
      }
      byAgent[audit.agentName].count++;
      byAgent[audit.agentName].totalScore += parseFloat(audit.score || 0);
      byAgent[audit.agentName].audits.push(audit);
      if (new Date(audit.date) > new Date(byAgent[audit.agentName].lastAudit)) {
        byAgent[audit.agentName].lastAudit = audit.date;
      }
    });
    
    // Calculate average for each agent
    Object.keys(byAgent).forEach(agentName => {
      byAgent[agentName].avgScore = (byAgent[agentName].totalScore / byAgent[agentName].count).toFixed(1);
    });

    // Group by team
    const byTeam = {};
    audits.forEach(audit => {
      if (!audit.teamId) return;
      if (!byTeam[audit.teamId]) {
        byTeam[audit.teamId] = {
          count: 0,
          totalScore: 0,
          agents: new Set()
        };
      }
      byTeam[audit.teamId].count++;
      byTeam[audit.teamId].totalScore += parseFloat(audit.score || 0);
      byTeam[audit.teamId].agents.add(audit.agentName);
    });

    // Calculate average for each team
    Object.keys(byTeam).forEach(teamId => {
      byTeam[teamId].avgScore = (byTeam[teamId].totalScore / byTeam[teamId].count).toFixed(1);
      byTeam[teamId].uniqueAgents = byTeam[teamId].agents.size;
      delete byTeam[teamId].agents;
    });
    
    // Group by date
    const byDate = {};
    audits.forEach(audit => {
      const date = audit.date;
      if (!byDate[date]) {
        byDate[date] = { count: 0, totalScore: 0 };
      }
      byDate[date].count++;
      byDate[date].totalScore += parseFloat(audit.score || 0);
    });
    
    return {
      total,
      avgScore: parseFloat(avgScore),
      uniqueAgents: uniqueAgents.length,
      byAgent,
      byTeam,
      byDate,
      audits
    };
  },

  getMonthlyBreakdown() {
    const audits = this.getAllAudits();
    const currentYear = new Date().getFullYear();
    
    const monthlyData = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Initialize all months
    months.forEach((month, index) => {
      monthlyData[month] = { count: 0, totalScore: 0 };
    });
    
    // Populate with data
    audits.forEach(audit => {
      const auditDate = new Date(audit.date);
      if (auditDate.getFullYear() === currentYear) {
        const monthIndex = auditDate.getMonth();
        const monthName = months[monthIndex];
        monthlyData[monthName].count++;
        monthlyData[monthName].totalScore += parseFloat(audit.score || 0);
      }
    });
    
    return monthlyData;
  },

  // Get all weeks from January to current date (Monday-Friday only)
  getWeeksOfYear() {
    const currentYear = new Date().getFullYear();
    const weeks = [];
    let weekNumber = 1;
    
    // Start from January 1st
    let currentDate = new Date(currentYear, 0, 1);
    
    // Find the first Monday of the year
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const now = new Date();
    
    while (currentDate <= now) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 4); // Friday (Monday + 4 days)
      
      // Only add weeks that have started
      if (weekStart <= now) {
        weeks.push({
          weekNumber: weekNumber,
          startDate: weekStart.toISOString().split('T')[0],
          endDate: weekEnd > now ? now.toISOString().split('T')[0] : weekEnd.toISOString().split('T')[0],
          label: `Semana ${weekNumber}: ${weekStart.getDate()}-${weekStart.getMonth() + 1}-${currentYear} a ${(weekEnd > now ? now : weekEnd).getDate()}-${(weekEnd > now ? now : weekEnd).getMonth() + 1}-${currentYear}`
        });
        weekNumber++;
      }
      
      // Move to next Monday
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return weeks;
  },

  // Get weeks for a specific month (Monday-Sunday, 7 days, start on first Monday)
  getWeeksOfMonth(year, month) {
    const weeks = [];

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Find the first Monday of the month
    const firstMonday = new Date(firstDayOfMonth);
    while (firstMonday.getDay() !== 1) {
      firstMonday.setDate(firstMonday.getDate() + 1);
    }

    let currentStart = new Date(firstMonday);
    let weekNumber = 1;

    while (currentStart <= lastDayOfMonth) {
      const weekStart = new Date(currentStart);
      const weekEnd = new Date(currentStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // Always 7-day span

      weeks.push({
        weekNumber,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        label: `Semana ${weekStart.getDate()}/${month + 1} al ${weekEnd.getDate()}/${month + 1}`
      });

      weekNumber++;
      currentStart.setDate(currentStart.getDate() + 7);
    }

    return weeks;
  },

  // Get audits for a specific week
  getAuditsByWeek(weekStartDate, weekEndDate) {
    const audits = this.getAllAudits();
    return audits.filter(audit => {
      const auditDate = audit.date;
      return auditDate >= weekStartDate && auditDate <= weekEndDate;
    });
  },

  // Get metrics by week
  getWeeklyMetricsByWeek(weekStartDate, weekEndDate) {
    const weekAudits = this.getAuditsByWeek(weekStartDate, weekEndDate);
    return this.calculateMetrics(weekAudits);
  },

  getDailyBreakdownLastWeek() {
    const audits = this.getAllAudits();
    const dailyData = {};
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      
      dailyData[`${dayName} ${date.getDate()}`] = { 
        count: 0, 
        totalScore: 0,
        date: dateStr
      };
    }
    
    // Populate with data
    audits.forEach(audit => {
      const auditDate = new Date(audit.date);
      const dayName = days[auditDate.getDay()];
      const dayLabel = `${dayName} ${auditDate.getDate()}`;
      
      Object.keys(dailyData).forEach(key => {
        if (dailyData[key].date === audit.date) {
          dailyData[key].count++;
          dailyData[key].totalScore += parseFloat(audit.score || 0);
        }
      });
    });
    
    return dailyData;
  },

  // Get top agent per team
  getTopAgentsByTeam() {
    const metrics = this.calculateMetrics(this.getAllAudits());
    const topByTeam = {};

    Object.entries(metrics.byAgent).forEach(([agentName, data]) => {
      const teamId = data.teamId;
      if (!teamId) return;
      
      if (!topByTeam[teamId] || parseFloat(data.avgScore) > parseFloat(topByTeam[teamId].avgScore)) {
        topByTeam[teamId] = {
          agentName,
          avgScore: data.avgScore,
          count: data.count
        };
      }
    });

    return topByTeam;
  },

  // Weekly Metrics Management (Manual Input)
  getWeeklyMetricsData(year, month) {
    const key = `${year}-${month}`;
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEKLY_METRICS) || '{}');
    return allData[key] || {};
  },

  saveWeeklyMetricsData(year, month, data) {
    const key = `${year}-${month}`;
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEKLY_METRICS) || '{}');
    allData[key] = data;
    localStorage.setItem(this.STORAGE_KEYS.WEEKLY_METRICS, JSON.stringify(allData));
  },

  getWeekConfig(year, month) {
    const key = `${year}-${month}`;
    const allConfigs = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG) || '{}');
    return allConfigs[key] || [];
  },

  ensureWeekConfig(year, month) {
    const key = `${year}-${month}`;
    const allConfigs = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG) || '{}');
    if (!allConfigs[key] || !allConfigs[key].length) {
      allConfigs[key] = this.getWeeksOfMonth(year, month);
      localStorage.setItem(this.STORAGE_KEYS.WEEK_CONFIG, JSON.stringify(allConfigs));
    }
    return allConfigs[key];
  },

  getConfiguredMonths(year) {
    const allConfigs = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG) || '{}');
    return Object.keys(allConfigs)
      .map(key => key.split('-'))
      .filter(parts => parseInt(parts[0]) === year)
      .map(parts => parseInt(parts[1]))
      .sort((a, b) => a - b);
  },

  // Save a single week's metrics for one agent
  saveWeeklyMetric(agentName, meta, metrics) {
    const key = `${meta.year}-${meta.month}`;
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEKLY_METRICS) || '{}');
    if (!allData[key]) {
      allData[key] = {};
    }
    if (!allData[key][agentName]) {
      allData[key][agentName] = {};
    }
    allData[key][agentName][meta.week] = metrics;
    localStorage.setItem(this.STORAGE_KEYS.WEEKLY_METRICS, JSON.stringify(allData));
  },

  saveWeekConfig(year, month, weeks) {
    const key = `${year}-${month}`;
    const allConfigs = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG) || '{}');
    allConfigs[key] = weeks;
    localStorage.setItem(this.STORAGE_KEYS.WEEK_CONFIG, JSON.stringify(allConfigs));
  },

  // Audit Views Tracking
  markAuditAsViewed(auditId, viewerEmail) {
    const views = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_VIEWS) || '{}');
    const now = new Date().toISOString();
    if (!views[auditId]) {
      views[auditId] = [];
    }
    // Normalize legacy string entries to objects
    const normalized = views[auditId].map(v => typeof v === 'string' ? { email: v, timestamp: now } : v);
    const already = normalized.find(v => v.email === viewerEmail);
    if (!already) {
      normalized.push({ email: viewerEmail, timestamp: now });
      views[auditId] = normalized;
      localStorage.setItem(this.STORAGE_KEYS.AUDIT_VIEWS, JSON.stringify(views));
    }
  },

  hasViewedAudit(auditId, viewerEmail) {
    const views = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_VIEWS) || '{}');
    if (!views[auditId]) return false;
    return views[auditId].some(v => (typeof v === 'string' ? v === viewerEmail : v.email === viewerEmail));
  },

  getAuditViewEvents() {
    const views = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_VIEWS) || '{}');
    const events = [];
    Object.entries(views).forEach(([auditId, entries]) => {
      if (!Array.isArray(entries)) return;
      entries.forEach(entry => {
        if (typeof entry === 'string') return; // legacy without timestamp, skip to avoid unordered noise
        events.push({ auditId, email: entry.email, timestamp: entry.timestamp });
      });
    });
    return events;
  },

  // Audit Comments (Agent feedback on their audits)
  saveAuditComment(auditId, agentEmail, comment) {
    const comments = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_COMMENTS) || '{}');
    comments[auditId] = {
      agentEmail,
      comment,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.AUDIT_COMMENTS, JSON.stringify(comments));
  },

  getAuditComment(auditId) {
    const comments = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_COMMENTS) || '{}');
    return comments[auditId] || null;
  },

  getAllAuditComments() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_COMMENTS) || '{}');
  },

  // Add or update team member with shift information
  addTeamMemberWithShift(teamId, memberData) {
    const teams = this.getAllTeams();
    if (teams[teamId]) {
      // Ensure shift is included
      const member = {
        ...memberData,
        team: teamId,
        shift: memberData.shift || 'AM',
        addedAt: new Date().toISOString()
      };
      teams[teamId].members.push(member);
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      return true;
    }
    return false;
  },

  updateTeamMember(teamId, originalEmail, memberData) {
    const teams = this.getAllTeams();
    if (!teams[teamId] || !teams[teamId].members) return false;

    const memberIndex = teams[teamId].members.findIndex(m => m.email === originalEmail);
    if (memberIndex === -1) return false;

    const updatedMember = {
      ...teams[teamId].members[memberIndex],
      ...memberData,
      team: teamId
    };

    teams[teamId].members[memberIndex] = updatedMember;
    localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return true;
  },

  // Utility
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-VE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  },

  // Calculate satisfaction percentage for an agent based on weekly metrics
  calculateAgentSatisfaction(agentName, year, month) {
    const weeklyData = this.getWeeklyMetricsData(year, month);
    if (!weeklyData[agentName]) return 0;
    
    let totalTickets = 0;
    let totalGood = 0;
    
    Object.values(weeklyData[agentName]).forEach(weekData => {
      if (weekData.tickets) {
        totalTickets += weekData.tickets || 0;
        totalGood += weekData.ticketsGood || 0;
      }
    });
    
    if (totalTickets === 0) return 0;
    return Math.round((totalGood / totalTickets) * 100);
  },

  // Get agent email by name (from teams)
  getAgentEmailByName(agentName) {
    const teams = this.getAllTeams();
    for (const team of Object.values(teams)) {
      if (team.members) {
        const member = team.members.find(m => m.name === agentName);
        if (member) return member.email;
      }
    }
    return null;
  },

  // Delete a specific week from configuration
  deleteWeekFromConfig(year, month, weekIndex) {
    const key = `${year}-${month}`;
    const allConfigs = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG) || '{}');
    const weeks = allConfigs[key];

    if (!weeks || !Array.isArray(weeks)) {
      alert(`No se encontró configuración para ${month}/${year}. Por favor, configure las semanas primero.`);
      return false;
    }

    if (weeks.length <= 1) {
      alert('No se puede eliminar la última semana. Debe haber al menos una semana configurada.');
      return false;
    }

    if (weekIndex < 0 || weekIndex >= weeks.length) {
      alert(`Índice de semana inválido (${weekIndex + 1}). La configuración tiene ${weeks.length} semanas.`);
      return false;
    }

    weeks.splice(weekIndex, 1);
    allConfigs[key] = weeks;
    localStorage.setItem(this.STORAGE_KEYS.WEEK_CONFIG, JSON.stringify(allConfigs));
    return true;
  }
};

// Initialize on load
DataManager.init();
