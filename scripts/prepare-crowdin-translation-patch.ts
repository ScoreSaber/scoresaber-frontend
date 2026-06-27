import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

type Messages = { [key: string]: string | Messages };

const options = new Map<string, string>();
for (let index = 2; index < Bun.argv.length; index += 1) {
   const arg = Bun.argv[index];
   if (arg.startsWith('--')) options.set(arg, Bun.argv[index + 1]);
}

const baseRef = options.get('--base') ?? 'origin/l10n/crowdin';
const headRef = options.get('--head') ?? 'HEAD';
const outputDirectory = resolve(options.get('--out') ?? '.crowdin-translation-patch');
const outputDirectoryFromRoot = relative(process.cwd(), outputDirectory).replaceAll('\\', '/');
const basePathFromConfig = (relative(outputDirectory, process.cwd()) || '.').replaceAll('\\', '/');

const git = (args: string[]) => {
   const process = Bun.spawnSync(['git', ...args], { stdout: 'pipe', stderr: 'pipe' });
   if (process.exitCode === 0) return process.stdout.toString().trimEnd();

   console.error(process.stderr.toString());
   process.exit(process.exitCode);
};

const changedFiles = git(['diff', '--name-only', `${baseRef}..${headRef}`, '--', 'messages/*.json'])
   .split('\n')
   .filter((file) => /^messages\/(?!en\.json)[^/]+\.json$/.test(file));

rmSync(outputDirectory, { force: true, recursive: true });
mkdirSync(outputDirectory, { recursive: true });

let changedStrings = 0;
let generatedFiles = 0;

for (const file of changedFiles) {
   const baseMessages = JSON.parse(git(['show', `${baseRef}:${file}`])) as Messages;
   const headMessages = JSON.parse(git(['show', `${headRef}:${file}`])) as Messages;
   const partialMessages: Messages = {};
   const fileChangedStrings = copyChangedStrings(baseMessages, headMessages, partialMessages);

   if (fileChangedStrings === 0) continue;

   const outputPath = join(outputDirectory, file);
   mkdirSync(dirname(outputPath), { recursive: true });
   writeFileSync(outputPath, `${JSON.stringify(partialMessages, null, 3)}\n`);

   generatedFiles += 1;
   changedStrings += fileChangedStrings;
   console.log(`prepared ${fileChangedStrings} changed strings for ${file}`);
}

if (generatedFiles > 0) {
   writeFileSync(
      join(outputDirectory, 'crowdin.yml'),
      [
         'project_id_env: CROWDIN_PROJECT_ID',
         'api_token_env: CROWDIN_PERSONAL_TOKEN',
         `base_path: ${basePathFromConfig}`,
         'preserve_hierarchy: true',
         '',
         'files:',
         '   - source: /messages/en.json',
         `     translation: /${outputDirectoryFromRoot}/messages/%locale%.json`,
         '     update_option: update_as_unapproved',
         ''
      ].join('\n')
   );
}

if (process.env.GITHUB_OUTPUT) {
   writeFileSync(
      process.env.GITHUB_OUTPUT,
      [`has_changes=${generatedFiles > 0}`, `changed_files=${generatedFiles}`, `changed_strings=${changedStrings}`, ''].join('\n'),
      { flag: 'a' }
   );
}

console.log(
   generatedFiles > 0
      ? `prepared ${changedStrings} changed strings across ${generatedFiles} translation files`
      : `no changed translation strings found between ${baseRef} and ${headRef}`
);

function copyChangedStrings(baseMessages: Messages, headMessages: Messages, partialMessages: Messages) {
   let count = 0;

   for (const [key, value] of Object.entries(headMessages)) {
      if (typeof value === 'string') {
         if (baseMessages[key] === value) continue;

         partialMessages[key] = value;
         count += 1;
         continue;
      }

      const nestedMessages: Messages = {};
      const nestedCount = copyChangedStrings((baseMessages[key] as Messages) ?? {}, value, nestedMessages);
      if (nestedCount === 0) continue;

      partialMessages[key] = nestedMessages;
      count += nestedCount;
   }

   return count;
}
