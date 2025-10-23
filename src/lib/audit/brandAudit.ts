interface AuditResult {
  page: string;
  issues: BrandIssue[];
  score: number; // 0-100
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

const BRAND_COLORS = [
  '#7AB547', // ka-green
  '#1E3A5F', // ka-navy
  '#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', // grays
  '#9CA3AF', '#6B7280', '#4B5563', '#374151',
  '#1F2937', '#111827',
  '#10B981', '#F59E0B', '#EF4444', '#3B82F6', // semantic
  '#25D366', '#EA4335', '#0088CC', '#00AFF0', // channels
  '#FFFFFF', '#000000', 'transparent', 'currentColor'
];

const TYPOGRAPHY_RULES = {
  h1: { fontSize: '1.875rem', fontWeight: '700', color: '#1E3A5F' },
  h2: { fontSize: '1.5rem', fontWeight: '700', color: '#1E3A5F' },
  h3: { fontSize: '1.25rem', fontWeight: '600', color: '#1E3A5F' },
  h4: { fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' },
  h5: { fontSize: '1rem', fontWeight: '600', color: '#374151' },
  h6: { fontSize: '0.875rem', fontWeight: '600', color: '#4B5563' },
};

export async function auditPageConsistency(pagePath: string): Promise<AuditResult> {
  const issues: BrandIssue[] = [];
  
  // Simulate audit checks (in real implementation, would inspect DOM)
  // For now, return mock data based on page
  const mockIssues = getMockIssuesForPage(pagePath);
  issues.push(...mockIssues);
  
  // Calculate score
  const score = calculateScore(issues);
  
  return { page: pagePath, issues, score };
}

function getMockIssuesForPage(pagePath: string): BrandIssue[] {
  const issues: BrandIssue[] = [];
  
  // Simulate some issues for demonstration
  if (pagePath === '/inbox') {
    issues.push({
      type: 'color',
      severity: 'warning',
      element: 'Button',
      issue: 'Custom color used instead of brand color',
      expected: 'bg-ka-green (hsl(var(--ka-green)))',
      actual: '#8BC34A',
      fix: 'Replace with className="bg-[hsl(var(--ka-green))]"',
    });
  }
  
  if (pagePath === '/projects') {
    issues.push({
      type: 'typography',
      severity: 'suggestion',
      element: 'h2',
      issue: 'Inconsistent heading style',
      expected: 'text-2xl font-bold text-[hsl(var(--ka-navy))]',
      actual: 'text-xl font-semibold',
      fix: 'Update className to match brand typography scale',
    });
  }
  
  return issues;
}

function calculateScore(issues: BrandIssue[]): number {
  const weights = {
    critical: 10,
    warning: 5,
    suggestion: 2,
  };
  
  const totalDeductions = issues.reduce((sum, issue) => {
    return sum + weights[issue.severity];
  }, 0);
  
  return Math.max(0, 100 - totalDeductions);
}

export function auditColors(elements: HTMLElement[]): BrandIssue[] {
  const issues: BrandIssue[] = [];
  
  elements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const bgColor = computedStyle.backgroundColor;
    const textColor = computedStyle.color;
    
    // Check if colors are from brand palette
    if (!isAllowedColor(bgColor) && bgColor !== 'rgba(0, 0, 0, 0)') {
      issues.push({
        type: 'color',
        severity: 'warning',
        element: el.tagName.toLowerCase(),
        issue: 'Non-brand background color detected',
        expected: 'Color from brand palette',
        actual: bgColor,
        fix: 'Use bg-[hsl(var(--ka-green))], bg-[hsl(var(--ka-navy))], or bg-[hsl(var(--ka-gray-*))]',
      });
    }
  });
  
  return issues;
}

function isAllowedColor(color: string): boolean {
  // Simple check - in production, would do proper color comparison
  return BRAND_COLORS.some(brandColor => color.includes(brandColor));
}

export function auditTypography(elements: HTMLElement[]): BrandIssue[] {
  const issues: BrandIssue[] = [];
  
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
    const headings = Array.from(document.getElementsByTagName(tag));
    const rule = TYPOGRAPHY_RULES[tag as keyof typeof TYPOGRAPHY_RULES];
    
    headings.forEach(heading => {
      const style = window.getComputedStyle(heading);
      
      if (style.fontSize !== rule.fontSize) {
        issues.push({
          type: 'typography',
          severity: 'suggestion',
          element: tag,
          issue: `Incorrect font size for ${tag}`,
          expected: rule.fontSize,
          actual: style.fontSize,
          fix: `Use proper typography class for ${tag}`,
        });
      }
    });
  });
  
  return issues;
}
