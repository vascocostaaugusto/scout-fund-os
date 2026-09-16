import { risks } from "@/lib/data";
import { SeverityBadge } from "./severity-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RiskRegisterTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[15%]">Category</TableHead>
            <TableHead className="w-[35%]">Risk</TableHead>
            <TableHead>Likelihood</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead className="w-[30%]">Mitigation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="text-xs font-medium text-muted-foreground">{r.category}</TableCell>
              <TableCell className="text-sm text-foreground">{r.risk}</TableCell>
              <TableCell>
                <SeverityBadge level={r.likelihood} />
              </TableCell>
              <TableCell>
                <SeverityBadge level={r.impact} />
              </TableCell>
              <TableCell className="text-xs leading-relaxed text-muted-foreground">{r.mitigation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
