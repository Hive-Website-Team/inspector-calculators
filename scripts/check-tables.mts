/*
  Reference tables are hand-written strings; the calculators are code. Nothing
  stopped the two from drifting, and a table that quietly disagrees with the
  tool beside it is the worst possible defect on a site whose entire promise is
  that its numbers are checkable.

  So every cell of every derived table is recomputed here from the calculator's
  own compute() and compared exactly. This covers the tables produced by
  arithmetic. Code tables (IRC limits, DCA 6-15 spans) are transcriptions of a
  published source rather than outputs, so they are not checked here — they are
  covered by the sourced-assumption gate and by check:sources.
*/
import { record as attic, compute as aC } from '../src/calculators/attic-ventilation';
import { record as cpi, compute as cC } from '../src/calculators/cost-per-inspection';
import { record as tco, compute as tC } from '../src/calculators/software-tco';
import { record as sup, compute as sC } from '../src/calculators/startup-cost-planner';

let bad = 0;
const eq = (label: string, got: string, want: string) => {
  const ok = got === want;
  if (!ok) { bad++; console.log(`  MISMATCH ${label}: table says ${want}, compute says ${got}`); }
  return ok;
};
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// attic: col1 = NFA @150, col2 = NFA @300
for (const row of attic.referenceTable!.rows) {
  const area = Number(row[0].replace(/[^0-9.]/g, ''));
  for (const [idx, ratio] of [[1, 150], [2, 300]] as const) {
    const r = aC({ area, ratio });
    eq(`attic ${area}@1:${ratio}`, `${r.nfa.toFixed(2)} sq ft (${r.nfaIn.toLocaleString('en-US')} sq in)`, row[idx]);
  }
}

// cost per inspection: $6,000 costs, $450 ticket
for (const row of cpi.referenceTable!.rows) {
  const n = Number(row[0]);
  const r = cC({ monthlyCosts: 6000, inspectionsPerMonth: n, avgTicket: 450 });
  eq(`cpi ${n} cost`, money(r.costPerInspection), row[1]);
  const m = r.marginPerInspection < 0 ? `−${money(Math.abs(r.marginPerInspection))}` : money(r.marginPerInspection);
  eq(`cpi ${n} margin`, m, row[2]);
  const pct = r.marginPercent < 0 ? `−${Math.abs(r.marginPercent).toFixed(1)}%` : `${r.marginPercent.toFixed(1)}%`;
  eq(`cpi ${n} pct`, pct, row[3]);
}

// software tco: default stack
const base = { reportSoftware: 109, scheduling: 0, crm: 0, paymentsPercent: 3, monthlyRevenue: 8000, website: 58, phone: 30, ai: 0, extraSeats: 0 };
for (const row of tco.referenceTable!.rows) {
  const n = Number(row[0]);
  const r = tC({ ...base, inspectionsPerMonth: n });
  eq(`tco ${n} monthly`, money(r.monthlyTotal), row[1]);
  eq(`tco ${n} annual`, money(r.trueAnnualSoftwareSpend), row[2]);
  eq(`tco ${n} per-insp`, money(r.perInspectionSoftwareCost), row[3]);
}

// startup: default inputs, reserve months vary
const s0 = { equipmentCost: 3000, insuranceCost: 2500, trainingCost: 1500, licensingCost: 300, softwareCost: 1308, marketingCost: 2000, monthlyOverhead: 3000 };
const whole = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
for (const row of sup.referenceTable!.rows) {
  const m = Number(row[0]);
  const r = sC({ ...s0, workingCapitalMonths: m });
  eq(`startup ${m} startup`, whole(r.totalStartupCost), row[1]);
  eq(`startup ${m} reserve`, whole(r.workingCapitalReserve), row[2]);
  eq(`startup ${m} total`, whole(r.totalCashNeeded), row[3]);
}

if (bad === 0) {
  console.log(`\n  Table check passed — every derived reference-table cell reproduces from compute().`);
} else {
  console.error(`\n  Table check FAILED — ${bad} cell(s) do not match compute().`);
}
process.exit(bad === 0 ? 0 : 1);
