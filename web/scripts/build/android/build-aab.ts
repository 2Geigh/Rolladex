import exec from 'child_process';
import { buildCommand_BASE } from './build-base.ts';

const buildCommand_AAB = `${buildCommand_BASE} --androidreleasetype AAB`;

exec.exec(buildCommand_AAB, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.error(`stderr: ${stderr}`);
		return;
	}
	console.log(`stdout: ${stdout}`);
});
