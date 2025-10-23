import { useState } from 'react';
import { Check, AlertTriangle, XCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auditPageConsistency } from '@/lib/audit/brandAudit';

interface AuditResult {
  page: string;
  issues: BrandIssue[];
  score: number;
}

interface BrandIssue {
  type: 'color' | 'typography' | 'spacing' | 'component';
  severity: 'critical' | 'warning' | 'suggestion';
  element: string;
  issue: string;
  expected: string;
  actual: string;
  fix: string;
}

export default function BrandAuditPage() {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(false);

  const PAGES_TO_AUDIT = [
    '/inbox',
    '/projects',
    '/clients',
    '/assignments',
    '/tasks',
    '/settings',
    '/analytics',
    '/client-portal',
  ];

  const runAudit = async () => {
    setLoading(true);
    const results: AuditResult[] = [];
    
    for (const page of PAGES_TO_AUDIT) {
      const result = await auditPageConsistency(page);
      results.push(result);
      // Simulate delay for realistic loading
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setAuditResults(results);
    setLoading(false);
  };

  const averageScore = auditResults.length > 0
    ? Math.round(auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length)
    : 0;

  const excellentPages = auditResults.filter(r => r.score >= 90).length;
  const totalIssues = auditResults.reduce((sum, r) => sum + r.issues.length, 0);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--ka-navy))] mb-2">
            Brand Consistency Audit
          </h1>
          <p className="text-muted-foreground">
            Automatische controle van brand richtlijnen
          </p>
        </div>
        <Button
          onClick={runAudit}
          disabled={loading}
          className="bg-[hsl(var(--ka-green))] hover:bg-[hsl(var(--ka-green))]/90"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Scanning...' : 'Run Audit'}
        </Button>
      </div>

      {/* Overall Score */}
      {auditResults.length > 0 && (
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-[hsl(var(--ka-green))] mb-2">
                {averageScore}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                {excellentPages}/{auditResults.length}
              </div>
              <p className="text-sm text-muted-foreground">Excellent Pages</p>
              <p className="text-xs text-muted-foreground">(Score ≥ 90)</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                {totalIssues}
              </div>
              <p className="text-sm text-muted-foreground">Total Issues</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                {auditResults.length}
              </div>
              <p className="text-sm text-muted-foreground">Pages Scanned</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {auditResults.length === 0 && (
        <div className="bg-card rounded-lg shadow-sm p-8 border text-center">
          <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-2">
            Klaar om te scannen
          </h2>
          <p className="text-muted-foreground mb-4">
            Klik op "Run Audit" om alle pagina's te controleren op brand consistentie
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Palette className="w-4 h-4 mr-2 text-[hsl(var(--ka-green))]" />
                Kleuren
              </h3>
              <p className="text-sm text-muted-foreground">
                Controleert of alle kleuren uit het brand palette komen
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Type className="w-4 h-4 mr-2 text-[hsl(var(--ka-green))]" />
                Typografie
              </h3>
              <p className="text-sm text-muted-foreground">
                Valideert font sizes, weights en heading styles
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Layout className="w-4 h-4 mr-2 text-[hsl(var(--ka-green))]" />
                Componenten
              </h3>
              <p className="text-sm text-muted-foreground">
                Checkt of UI componenten consistent gebruikt worden
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Per-Page Results */}
      <div className="space-y-4">
        {auditResults.map((result) => (
          <PageAuditCard key={result.page} result={result} />
        ))}
      </div>
    </div>
  );
}

function PageAuditCard({ result }: { result: AuditResult }) {
  const { page, issues, score } = result;
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', className: 'bg-green-100 text-green-800' };
    if (score >= 70) return { text: 'Good', className: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Work', className: 'bg-red-100 text-red-800' };
  };

  const severityIcon = {
    critical: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    suggestion: <Check className="w-5 h-5 text-blue-500" />,
  };

  const badge = getScoreBadge(score);

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-[hsl(var(--ka-navy))]">{page}</h3>
            <Badge className={badge.className}>{badge.text}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {issues.length === 0
              ? 'Geen issues gevonden'
              : `${issues.length} issue${issues.length !== 1 ? 's' : ''} gevonden`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expanded ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {expanded && issues.length > 0 && (
        <div className="border-t p-6 space-y-4 bg-muted/30">
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-4 bg-card rounded-lg border"
            >
              {severityIcon[issue.severity]}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-[hsl(var(--ka-navy))]">{issue.issue}</h4>
                  <Badge variant="outline" className="capitalize">
                    {issue.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Element: <code className="bg-muted px-2 py-1 rounded">{issue.element}</code>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="font-medium text-red-800 mb-1">Actual:</p>
                    <code className="text-xs text-red-900 break-all">{issue.actual}</code>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="font-medium text-green-800 mb-1">Expected:</p>
                    <code className="text-xs text-green-900 break-all">{issue.expected}</code>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm font-medium text-blue-800 mb-1">💡 Fix:</p>
                  <code className="text-xs text-blue-900 block break-all">{issue.fix}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && issues.length === 0 && (
        <div className="border-t p-6 text-center">
          <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-[hsl(var(--ka-navy))] mb-1">
            Perfect! Geen issues gevonden
          </p>
          <p className="text-sm text-muted-foreground">
            Deze pagina voldoet volledig aan de brand richtlijnen
          </p>
        </div>
      )}
    </div>
  );
}

// Import icons at top
import { Palette, Type, Layout } from 'lucide-react';
