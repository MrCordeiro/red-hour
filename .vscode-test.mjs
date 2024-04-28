import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	label: 'unit-tests',
	files: 'out/test/**/*.test.js',
});
