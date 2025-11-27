import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Users, Clock, Smile, Download, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';

import { useAnalyticsData, PeriodType } from '@/hooks/useAnalyticsData';
import MetricCard from '@/components/analytics/MetricCard';
import ChannelBreakdownChart from '@/components/analytics/ChannelBreakdownChart';
import TimeSeriesChart from '@/components/analytics/TimeSeriesChart';
import TeamPerformanceTable from '@/components/analytics/TeamPerformanceTable';
import HealthDonutChart from '@/components/analytics/HealthDonutChart';
import OpdrachtenStatusChart from '@/components/analytics/OpdrachtenStatusChart';

export default function FlowbiteAnalytics() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [period, setPeriod] = useState<PeriodType>('month');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [compareWithPrevious, setCompareWithPrevious] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string | undefined>();

  const analyticsData = useAnalyticsData({
    period,
    startDate: customDateRange.from,
    endDate: customDateRange.to,
    compareWithPrevious,
  });

  const handleExportPDF = () => {
    toast({
      title: t('analytics.export.pdfTitle', 'PDF Export'),
      description: t('analytics.export.comingSoon', 'Deze functie komt binnenkort beschikbaar.'),
    });
  };

  const handleExportCSV = () => {
    // Create CSV content
    const csvContent = [
      ['Metric', 'Value'],
      ['Totaal Interacties', analyticsData.metrics.totalInteractions],
      ['Actieve Klanten', analyticsData.metrics.activeClients],
      ['Gem. Response Tijd', analyticsData.metrics.avgResponseTime],
      ['Tevredenheid', `${analyticsData.metrics.satisfaction}%`],
      [''],
      ['Kanaal', 'Aantal', 'Percentage'],
      ...analyticsData.channelBreakdown.map(c => [c.channel, c.count, `${c.percentage}%`]),
      [''],
      ['Medewerker', 'Interacties', 'Klanten', 'Taken Afgerond'],
      ...analyticsData.teamPerformance.map(m => [m.name, m.interactions, m.clients, m.tasksCompleted]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: t('analytics.export.csvSuccess', 'CSV geëxporteerd'),
      description: t('analytics.export.csvDescription', 'Het rapport is gedownload.'),
    });
  };

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-4 xs:mb-6">
        <Link to="/" className="inline-flex items-center text-xs xs:text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
          {t('common.back', 'Terug')}
        </Link>
        
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
          <div>
            <h1 className={responsiveHeading.h2}>
              {t('analytics.title', 'Analytics & Rapportage')}
            </h1>
            <p className={`${responsiveBody.small} mt-1`}>
              {t('analytics.subtitle', 'Inzicht in je communicatie performance')}
            </p>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-8 xs:h-9 text-xs xs:text-sm">
              <FileText className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8 xs:h-9 text-xs xs:text-sm">
              <Download className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-card border rounded-lg p-3 xs:p-4 mb-4 xs:mb-6">
        <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4">
          <div className="flex items-center gap-2 xs:gap-3">
            <Label className="text-xs xs:text-sm whitespace-nowrap">{t('analytics.period', 'Periode')}:</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as PeriodType)}>
              <SelectTrigger className="w-32 xs:w-40 h-8 xs:h-9 text-xs xs:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t('analytics.periods.week', 'Deze week')}</SelectItem>
                <SelectItem value="month">{t('analytics.periods.month', 'Deze maand')}</SelectItem>
                <SelectItem value="quarter">{t('analytics.periods.quarter', 'Dit kwartaal')}</SelectItem>
                <SelectItem value="year">{t('analytics.periods.year', 'Dit jaar')}</SelectItem>
                <SelectItem value="custom">{t('analytics.periods.custom', 'Aangepast')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === 'custom' && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 xs:h-9 text-xs xs:text-sm">
                    <Calendar className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5" />
                    {customDateRange.from ? format(customDateRange.from, 'dd MMM', { locale: nl }) : t('analytics.from', 'Van')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={customDateRange.from}
                    onSelect={(date) => setCustomDateRange(prev => ({ ...prev, from: date }))}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground text-xs">-</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 xs:h-9 text-xs xs:text-sm">
                    <Calendar className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5" />
                    {customDateRange.to ? format(customDateRange.to, 'dd MMM', { locale: nl }) : t('analytics.to', 'Tot')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={customDateRange.to}
                    onSelect={(date) => setCustomDateRange(prev => ({ ...prev, to: date }))}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex items-center gap-2 xs:ml-auto">
            <Switch
              id="compare"
              checked={compareWithPrevious}
              onCheckedChange={setCompareWithPrevious}
            />
            <Label htmlFor="compare" className="text-xs xs:text-sm">
              {t('analytics.comparePrevious', 'Vergelijk met vorige periode')}
            </Label>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-6">
        <MetricCard
          title={t('analytics.metrics.totalInteractions', 'Totaal interacties')}
          value={analyticsData.metrics.totalInteractions}
          change={compareWithPrevious ? analyticsData.metrics.interactionChange : undefined}
          changeType={analyticsData.metrics.interactionChange > 0 ? 'up' : analyticsData.metrics.interactionChange < 0 ? 'down' : 'neutral'}
          changeLabel={t('analytics.vsPrevious', 'vs vorige periode')}
          icon={MessageSquare}
          iconColor="text-blue-600"
        />
        <MetricCard
          title={t('analytics.metrics.activeClients', 'Actieve klanten')}
          value={analyticsData.metrics.activeClients}
          change={compareWithPrevious ? analyticsData.metrics.clientsChange : undefined}
          changeType={analyticsData.metrics.clientsChange > 0 ? 'up' : analyticsData.metrics.clientsChange < 0 ? 'down' : 'neutral'}
          changeLabel={t('analytics.vsPrevious', 'vs vorige periode')}
          icon={Users}
          iconColor="text-green-600"
        />
        <MetricCard
          title={t('analytics.metrics.avgResponseTime', 'Gem. gesprekstijd')}
          value={analyticsData.metrics.avgResponseTime}
          icon={Clock}
          iconColor="text-purple-600"
        />
        <MetricCard
          title={t('analytics.metrics.satisfaction', 'Tevredenheid')}
          value={`${analyticsData.metrics.satisfaction}%`}
          subtitle={`${analyticsData.metrics.positivePercentage}% ${t('analytics.positive', 'positief')}`}
          icon={Smile}
          iconColor="text-yellow-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 mb-4 xs:mb-6">
        <ChannelBreakdownChart
          data={analyticsData.channelBreakdown}
          selectedChannel={selectedChannel}
          onChannelClick={(channel) => setSelectedChannel(prev => prev === channel ? undefined : channel)}
        />
        <TimeSeriesChart data={analyticsData.timeSeriesData} />
      </div>

      {/* Team Performance */}
      <div className="mb-4 xs:mb-6">
        <TeamPerformanceTable data={analyticsData.teamPerformance} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 mb-4 xs:mb-6">
        <HealthDonutChart data={analyticsData.clientHealth} />
        <OpdrachtenStatusChart data={analyticsData.opdrachtenStatus} />
      </div>

      {/* Top Clients & Task Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6">
        {/* Top Clients */}
        <div className="bg-card border rounded-lg p-4 xs:p-6 shadow-sm">
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-foreground mb-4">
            {t('analytics.topClients', 'Top Klanten')}
          </h3>
          
          <div className="overflow-x-auto -mx-4 xs:-mx-6 px-4 xs:px-6">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="text-[10px] xs:text-xs text-muted-foreground border-b">
                  <th className="text-left py-2 font-medium">#</th>
                  <th className="text-left py-2 font-medium">{t('analytics.client', 'Klant')}</th>
                  <th className="text-right py-2 font-medium">{t('analytics.interactions', 'Interacties')}</th>
                  <th className="text-right py-2 font-medium">{t('analytics.assignments', 'Opdrachten')}</th>
                  <th className="text-right py-2 font-medium">{t('analytics.revenue', 'Omzet')}</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topClients.slice(0, 5).map((client, index) => (
                  <tr key={client.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 xs:py-2.5 text-xs xs:text-sm text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="py-2 xs:py-2.5">
                      <Link
                        to={`/clients/${client.id}`}
                        className="text-xs xs:text-sm font-medium text-foreground hover:underline"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="py-2 xs:py-2.5 text-right text-xs xs:text-sm">
                      {client.interactions}
                    </td>
                    <td className="py-2 xs:py-2.5 text-right text-xs xs:text-sm">
                      {client.opdrachten}
                    </td>
                    <td className="py-2 xs:py-2.5 text-right text-xs xs:text-sm font-medium">
                      €{client.revenue.toLocaleString('nl-NL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Metrics */}
        <div className="bg-card border rounded-lg p-4 xs:p-6 shadow-sm">
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-foreground mb-4">
            {t('analytics.taskMetrics', 'Opvolging Metrics')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-xs xs:text-sm text-foreground">
                {t('analytics.tasksCreated', 'Taken aangemaakt')}
              </span>
              <span className="text-sm xs:text-base font-bold text-foreground">
                {analyticsData.taskMetrics.created}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-xs xs:text-sm text-foreground">
                {t('analytics.tasksCompleted', 'Taken afgerond')}
              </span>
              <span className="text-sm xs:text-base font-bold text-green-600">
                {analyticsData.taskMetrics.completed}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-xs xs:text-sm text-foreground">
                {t('analytics.tasksOverdue', 'Achterstallig')}
              </span>
              <span className="text-sm xs:text-base font-bold text-red-600">
                {analyticsData.taskMetrics.overdue}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-xs xs:text-sm text-foreground">
                {t('analytics.avgCompletionTime', 'Gem. doorlooptijd')}
              </span>
              <span className="text-sm xs:text-base font-bold text-foreground">
                {analyticsData.taskMetrics.avgCompletionDays} {t('analytics.days', 'dagen')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
