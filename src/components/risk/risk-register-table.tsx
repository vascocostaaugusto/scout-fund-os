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
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[13%]">Category</TableHead>
            <TableHead className="w-[32%]">Risk</TableHead>
            <TableHead className="w-[11%]">Likelihood</TableHead>
            <TableHead className="w-[11%]">Impact</TableHead>
            <TableHead className="w-[33%]">Mitigation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-normal text-xs font-medium text-muted-foreground">{r.category}</TableCell>
              <TableCell className="whitespace-normal text-sm leading-relaxed text-foreground">{r.risk}</TableCell>
              <TableCell>
                <SeverityBadge level={r.likelihood} />
              </TableCell>
              <TableCell>
                <SeverityBadge level={r.impact} />
              </TableCell>
              <TableCell className="whitespace-normal text-xs leading-relaxed text-muted-foreground">{r.mitigation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
