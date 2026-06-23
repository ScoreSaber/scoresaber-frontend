'use client';

import { useEffect, useMemo, useState } from 'react';

import { Result } from 'better-result';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const CSV_TEXTAREA_CLASS = 'h-[min(52dvh,28rem)] min-h-48 field-sizing-fixed resize-none overflow-auto font-mono text-sm sm:min-h-64';

export type LivePlayerCsvRow = {
   playerId: string;
   displayName: string | null;
   teamName?: string | null;
};

export function LivePlayerCsvImportDialog({
   open,
   onOpenChangeAction,
   title,
   includeTeam,
   onImportAction
}: {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   title: string;
   includeTeam?: boolean;
   onImportAction: (rows: LivePlayerCsvRow[]) => boolean | Promise<boolean>;
}) {
   const t = useTranslations('live');
   const [csv, setCsv] = useState('');
   const [pending, setPending] = useState(false);

   useEffect(() => {
      if (!open) setCsv('');
   }, [open]);

   async function importRows() {
      const result = parsePlayerCsv(csv, Boolean(includeTeam));
      if (result.errors.length > 0) {
         toast.error(result.errors[0]);
         return;
      }

      if (result.rows.length === 0) {
         toast.error(t('csvNoPlayers'));
         return;
      }

      setPending(true);
      const importResult = Result.tapBoth(await Result.tryPromise(async () => onImportAction(result.rows)), {
         ok: () => setPending(false),
         err: () => setPending(false)
      });

      if (Result.isOk(importResult) && importResult.value) onOpenChangeAction(false);
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
         <DialogContent className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-2xl">
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <Textarea
               value={csv}
               onChange={(event) => setCsv(event.target.value)}
               placeholder={includeTeam ? t('playersCsvPlaceholder') : t('roomCsvPlaceholder')}
               disabled={pending}
               className={CSV_TEXTAREA_CLASS}
            />
            <DialogFooter>
               <Button type="button" variant="secondary" onClick={() => onOpenChangeAction(false)} disabled={pending}>
                  {t('cancel')}
               </Button>
               <Button type="button" className="cursor-pointer" onClick={importRows} disabled={pending}>
                  <Upload data-icon="inline-start" />
                  {t('importCsv')}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

export function LivePlayerCsvExportDialog({
   open,
   onOpenChangeAction,
   title,
   rows,
   includeTeam,
   fileName
}: {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   title: string;
   rows: LivePlayerCsvRow[];
   includeTeam?: boolean;
   fileName: string;
}) {
   const t = useTranslations('live');
   const csv = useMemo(() => buildPlayerCsv(rows, Boolean(includeTeam)), [includeTeam, rows]);

   function downloadCsv() {
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
         <DialogContent className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-2xl">
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <Textarea value={csv} readOnly className={CSV_TEXTAREA_CLASS} />
            <DialogFooter>
               <Button type="button" variant="secondary" onClick={() => onOpenChangeAction(false)}>
                  {t('closePicker')}
               </Button>
               <Button type="button" className="cursor-pointer" onClick={downloadCsv}>
                  <Download data-icon="inline-start" />
                  {t('downloadCsv')}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

function parsePlayerCsv(csv: string, includeTeam: boolean) {
   const errors: string[] = [];
   const records = parseCsvRecords(csv).filter((record) => record.some((cell) => cell.trim()));

   if (records.length === 0) return { rows: [], errors };

   const first = records[0] ?? [];
   const firstHeaders = first.map(normalizeHeader);
   const hasHeader = firstHeaders.some((header) => header === 'playerid' || header === 'team');
   const headers = hasHeader ? first.map(normalizeHeader) : [];
   const dataRecords = hasHeader ? records.slice(1) : records;
   const playerIdIndex = hasHeader ? headers.findIndex((header) => header === 'playerid') : -1;
   const teamIndex = hasHeader ? headers.findIndex((header) => header === 'team') : -1;
   const rows: LivePlayerCsvRow[] = [];
   const seen = new Set<string>();

   if (hasHeader && playerIdIndex === -1) {
      return { rows, errors: ['CSV is missing a playerId column'] };
   }

   for (const [index, cells] of dataRecords.entries()) {
      const playerId = getCsvPlayerId(cells, playerIdIndex);
      if (!/^\d+$/.test(playerId)) {
         errors.push(`Invalid player id on row ${index + (hasHeader ? 2 : 1)}`);
         continue;
      }

      if (seen.has(playerId)) continue;
      seen.add(playerId);

      rows.push({
         playerId,
         displayName: null,
         teamName: includeTeam ? getCsvTeamName(cells, teamIndex) : null
      });
   }

   return { rows, errors };
}

function buildPlayerCsv(rows: LivePlayerCsvRow[], includeTeam: boolean) {
   const header = includeTeam ? ['playerId', 'playerName', 'team'] : ['playerId', 'playerName'];
   const body = rows.map((row) =>
      (includeTeam ? [row.playerId, row.displayName ?? '', row.teamName ?? ''] : [row.playerId, row.displayName ?? '']).map(escapeCsvCell).join(',')
   );

   return [header.join(','), ...body].join('\n');
}

function parseCsvRecords(csv: string) {
   const records: string[][] = [];
   let cells: string[] = [];
   let current = '';
   let quoted = false;

   for (let index = 0; index < csv.length; index += 1) {
      const char = csv[index];
      const next = csv[index + 1];

      if (char === '"' && quoted && next === '"') {
         current += '"';
         index += 1;
         continue;
      }

      if (char === '"') {
         quoted = !quoted;
         continue;
      }

      if (char === ',' && !quoted) {
         cells.push(current);
         current = '';
         continue;
      }

      if ((char === '\n' || char === '\r') && !quoted) {
         cells.push(current);
         records.push(cells);
         cells = [];
         current = '';
         if (char === '\r' && next === '\n') index += 1;
         continue;
      }

      current += char;
   }

   cells.push(current);
   records.push(cells);

   return records;
}

function escapeCsvCell(value: string) {
   if (!/[",\n\r]/.test(value)) return value;
   return `"${value.replaceAll('"', '""')}"`;
}

function getCsvPlayerId(cells: string[], playerIdIndex: number) {
   if (playerIdIndex >= 0) return cells[playerIdIndex]?.trim() ?? '';
   return cells.find((cell) => /^\d+$/.test(cell.trim()))?.trim() ?? '';
}

function getCsvTeamName(cells: string[], teamIndex: number) {
   if (teamIndex >= 0) return cells[teamIndex]?.trim() || null;
   if (cells.length >= 3) return cells[2]?.trim() || null;
   return null;
}

function normalizeHeader(value: string) {
   const header = value
      .trim()
      .replace(/^\uFEFF/, '')
      .toLowerCase()
      .replaceAll(/[\s_-]/g, '');
   if (header === 'id' || header === 'publicplayerid') return 'playerid';
   if (header === 'name' || header === 'player' || header === 'playername') return 'displayname';
   if (header === 'teamname') return 'team';
   return header;
}
