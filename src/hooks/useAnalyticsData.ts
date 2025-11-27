import { useMemo } from 'react';
import { mockInteracties, mockKlanten, mockTaken, mockOpdrachten } from '@/lib/mockData';
import { subDays, subMonths, subQuarters, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, parseISO, differenceInDays } from 'date-fns';

export type PeriodType = 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface AnalyticsFilters {
  period: PeriodType;
  startDate?: Date;
  endDate?: Date;
  compareWithPrevious?: boolean;
}

export interface ChannelBreakdown {
  channel: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TeamMemberPerformance {
  name: string;
  initials: string;
  interactions: number;
  clients: number;
  avgResponseTime: string;
  tasksCompleted: number;
}

export interface ClientHealth {
  healthy: number;
  needsAttention: number;
  atRisk: number;
  atRiskClients: Array<{
    id: string;
    name: string;
    score: number;
    lastContact: string;
    daysSinceContact: number;
  }>;
}

export interface OpdrachtenStatus {
  status: string;
  count: number;
  amount: number;
  color: string;
}

export function useAnalyticsData(filters: AnalyticsFilters) {
  const { period, startDate, endDate, compareWithPrevious } = filters;

  const dateRange = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'quarter':
        start = startOfQuarter(now);
        end = endOfQuarter(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'custom':
        start = startDate || subDays(now, 30);
        end = endDate || now;
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    return { start, end };
  }, [period, startDate, endDate]);

  const previousDateRange = useMemo(() => {
    const duration = differenceInDays(dateRange.end, dateRange.start) + 1;
    return {
      start: subDays(dateRange.start, duration),
      end: subDays(dateRange.start, 1),
    };
  }, [dateRange]);

  // Filter interacties within date range
  const currentInteracties = useMemo(() => {
    return mockInteracties.filter(i => {
      const date = parseISO(i.created_at);
      return isWithinInterval(date, { start: dateRange.start, end: dateRange.end });
    });
  }, [dateRange]);

  const previousInteracties = useMemo(() => {
    return mockInteracties.filter(i => {
      const date = parseISO(i.created_at);
      return isWithinInterval(date, { start: previousDateRange.start, end: previousDateRange.end });
    });
  }, [previousDateRange]);

  // Key Metrics
  const metrics = useMemo(() => {
    const totalInteractions = currentInteracties.length;
    const previousTotal = previousInteracties.length;
    const interactionChange = previousTotal > 0 
      ? Math.round(((totalInteractions - previousTotal) / previousTotal) * 100)
      : 0;

    // Active clients (unique)
    const activeClients = new Set(currentInteracties.map(i => i.klant_id)).size;
    const previousActiveClients = new Set(previousInteracties.map(i => i.klant_id)).size;
    const clientsChange = previousActiveClients > 0
      ? Math.round(((activeClients - previousActiveClients) / previousActiveClients) * 100)
      : 0;

    // Average response time (using duur from interacties)
    const interactiesWithDuration = currentInteracties.filter(i => i.duur && i.duur > 0);
    const avgResponseMinutes = interactiesWithDuration.length > 0
      ? Math.round(interactiesWithDuration.reduce((sum, i) => sum + (i.duur || 0), 0) / interactiesWithDuration.length)
      : 0;
    const avgResponseTime = avgResponseMinutes >= 60
      ? `${Math.floor(avgResponseMinutes / 60)}u ${avgResponseMinutes % 60}m`
      : `${avgResponseMinutes}m`;

    // Sentiment score (satisfaction)
    const sentimentScores = { 'Positief': 100, 'Neutraal': 70, 'Negatief': 30 };
    const interactiesWithSentiment = currentInteracties.filter(i => i.sentiment);
    const avgSentiment = interactiesWithSentiment.length > 0
      ? Math.round(interactiesWithSentiment.reduce((sum, i) => sum + (sentimentScores[i.sentiment] || 70), 0) / interactiesWithSentiment.length)
      : 70;
    const positivePercentage = interactiesWithSentiment.length > 0
      ? Math.round((interactiesWithSentiment.filter(i => i.sentiment === 'Positief').length / interactiesWithSentiment.length) * 100)
      : 0;

    return {
      totalInteractions,
      interactionChange,
      activeClients,
      clientsChange,
      avgResponseTime,
      satisfaction: avgSentiment,
      positivePercentage,
    };
  }, [currentInteracties, previousInteracties]);

  // Channel Breakdown
  const channelBreakdown = useMemo((): ChannelBreakdown[] => {
    const channelCounts: Record<string, number> = {};
    const channelColors: Record<string, string> = {
      'Telefoon': 'bg-blue-500',
      'E-mail': 'bg-amber-500',
      'WhatsApp': 'bg-green-500',
      'Zoom': 'bg-purple-500',
      'SMS': 'bg-cyan-500',
    };

    currentInteracties.forEach(i => {
      channelCounts[i.kanaal] = (channelCounts[i.kanaal] || 0) + 1;
    });

    const total = currentInteracties.length || 1;
    
    return Object.entries(channelCounts)
      .map(([channel, count]) => ({
        channel,
        count,
        percentage: Math.round((count / total) * 100),
        color: channelColors[channel] || 'bg-gray-500',
      }))
      .sort((a, b) => b.count - a.count);
  }, [currentInteracties]);

  // Team Performance
  const teamPerformance = useMemo((): TeamMemberPerformance[] => {
    const teamStats: Record<string, { 
      interactions: number; 
      clients: Set<string>; 
      totalDuration: number;
      durationCount: number;
    }> = {};

    currentInteracties.forEach(i => {
      const member = i.medewerker;
      if (!teamStats[member]) {
        teamStats[member] = { interactions: 0, clients: new Set(), totalDuration: 0, durationCount: 0 };
      }
      teamStats[member].interactions++;
      teamStats[member].clients.add(i.klant_id);
      if (i.duur) {
        teamStats[member].totalDuration += i.duur;
        teamStats[member].durationCount++;
      }
    });

    // Tasks completed per team member
    const tasksByMember: Record<string, number> = {};
    mockTaken.filter(t => t.status === 'Afgerond').forEach(t => {
      tasksByMember[t.toegewezen_aan] = (tasksByMember[t.toegewezen_aan] || 0) + 1;
    });

    return Object.entries(teamStats)
      .map(([name, stats]) => {
        const avgMinutes = stats.durationCount > 0 
          ? Math.round(stats.totalDuration / stats.durationCount)
          : 0;
        return {
          name,
          initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
          interactions: stats.interactions,
          clients: stats.clients.size,
          avgResponseTime: avgMinutes >= 60 
            ? `${(avgMinutes / 60).toFixed(1)}u`
            : `${avgMinutes}m`,
          tasksCompleted: tasksByMember[name] || 0,
        };
      })
      .sort((a, b) => b.interactions - a.interactions);
  }, [currentInteracties]);

  // Client Health Overview
  const clientHealth = useMemo((): ClientHealth => {
    const now = new Date();
    let healthy = 0;
    let needsAttention = 0;
    let atRisk = 0;
    const atRiskClients: ClientHealth['atRiskClients'] = [];

    mockKlanten.forEach(client => {
      const score = client.health_score || 70;
      const lastContactDate = client.last_contact_date ? parseISO(client.last_contact_date) : subMonths(now, 3);
      const daysSinceContact = differenceInDays(now, lastContactDate);

      if (score >= 75) {
        healthy++;
      } else if (score >= 50) {
        needsAttention++;
      } else {
        atRisk++;
        atRiskClients.push({
          id: client.id,
          name: client.naam,
          score,
          lastContact: client.last_contact_date || '',
          daysSinceContact,
        });
      }
    });

    return {
      healthy,
      needsAttention,
      atRisk,
      atRiskClients: atRiskClients.sort((a, b) => a.score - b.score).slice(0, 5),
    };
  }, []);

  // Opdrachten Status
  const opdrachtenStatus = useMemo((): OpdrachtenStatus[] => {
    const statusCounts: Record<string, { count: number; amount: number }> = {};
    const statusColors: Record<string, string> = {
      'Intake': 'bg-blue-500',
      'In behandeling': 'bg-cyan-500',
      'Wacht op klant': 'bg-orange-500',
      'Gereed voor controle': 'bg-purple-500',
      'Afgerond': 'bg-green-500',
      'Ingediend': 'bg-ka-green',
    };

    mockOpdrachten.forEach(o => {
      if (!statusCounts[o.status]) {
        statusCounts[o.status] = { count: 0, amount: 0 };
      }
      statusCounts[o.status].count++;
      statusCounts[o.status].amount += o.gefactureerd_bedrag || 0;
    });

    return Object.entries(statusCounts).map(([status, data]) => ({
      status,
      count: data.count,
      amount: data.amount,
      color: statusColors[status] || 'bg-gray-500',
    }));
  }, []);

  // Top Clients
  const topClients = useMemo(() => {
    const clientStats: Record<string, { interactions: number; opdrachten: number; revenue: number }> = {};

    currentInteracties.forEach(i => {
      if (!clientStats[i.klant_id]) {
        clientStats[i.klant_id] = { interactions: 0, opdrachten: 0, revenue: 0 };
      }
      clientStats[i.klant_id].interactions++;
    });

    mockOpdrachten.forEach(o => {
      if (!clientStats[o.klant_id]) {
        clientStats[o.klant_id] = { interactions: 0, opdrachten: 0, revenue: 0 };
      }
      clientStats[o.klant_id].opdrachten++;
      clientStats[o.klant_id].revenue += o.gefactureerd_bedrag || 0;
    });

    return Object.entries(clientStats)
      .map(([id, stats]) => {
        const client = mockKlanten.find(k => k.id === id);
        return {
          id,
          name: client?.naam || 'Onbekend',
          ...stats,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [currentInteracties]);

  // Task Metrics
  const taskMetrics = useMemo(() => {
    const created = mockTaken.length;
    const completed = mockTaken.filter(t => t.status === 'Afgerond').length;
    const overdue = mockTaken.filter(t => {
      if (t.status === 'Afgerond') return false;
      const deadline = parseISO(t.deadline);
      return differenceInDays(deadline, new Date()) < 0;
    }).length;
    
    const completedTasks = mockTaken.filter(t => t.completed_at && t.created_at);
    const avgDays = completedTasks.length > 0
      ? Math.round(completedTasks.reduce((sum, t) => {
          return sum + differenceInDays(parseISO(t.completed_at!), parseISO(t.created_at));
        }, 0) / completedTasks.length)
      : 0;

    return {
      created,
      completed,
      overdue,
      avgCompletionDays: avgDays,
    };
  }, []);

  // Time Series Data (for chart)
  const timeSeriesData = useMemo((): Array<{
    date: string;
    total: number;
    Telefoon?: number;
    'E-mail'?: number;
    WhatsApp?: number;
    Zoom?: number;
  }> => {
    const dataByDate: Record<string, { total: number; Telefoon: number; 'E-mail': number; WhatsApp: number; Zoom: number }> = {};
    
    currentInteracties.forEach(i => {
      const date = i.datum;
      if (!dataByDate[date]) {
        dataByDate[date] = { total: 0, Telefoon: 0, 'E-mail': 0, WhatsApp: 0, Zoom: 0 };
      }
      dataByDate[date].total++;
      if (i.kanaal === 'Telefoon') dataByDate[date].Telefoon++;
      else if (i.kanaal === 'E-mail') dataByDate[date]['E-mail']++;
      else if (i.kanaal === 'WhatsApp') dataByDate[date].WhatsApp++;
      else if (i.kanaal === 'Zoom') dataByDate[date].Zoom++;
    });

    return Object.entries(dataByDate)
      .map(([date, channels]) => ({ date, ...channels }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [currentInteracties]);

  return {
    dateRange,
    metrics,
    channelBreakdown,
    teamPerformance,
    clientHealth,
    opdrachtenStatus,
    topClients,
    taskMetrics,
    timeSeriesData,
  };
}
