const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { lstatSync } = require('fs');


const isDirectory = source => lstatSync(source).isDirectory();

function getDirectoryInfo(dirPath) {
	let children = [];
	if (isDirectory(dirPath)) {
		children = fs.readdirSync(dirPath).map(a => {
			return getDirectoryInfo(path.join(dirPath, a));
		});
	}

	return { name: path.basename(dirPath), children };
}



const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let directories;
rl.question('Enter relative folder path: ', (answer) => {
	directories = getDirectoryInfo(answer);
	console.log(getDirectoryStructure(directories, 0, [true]));
});


function constructIndentation(depth, isLastInfo) {
	let str = '';
	for (let i in isLastInfo) {
		str += isLastInfo[i] ? '   ' : '│  ';
	}
	return str;
}

function getDirectoryStructure(directoryInfo, depth, isLastInfo) {
	let str = (isLastInfo[isLastInfo.length - 1] ? '└───' : '├───') +  ' ' + directoryInfo.name + (directoryInfo.children.length ? '/' : '') + '\n';

	for (let i in directoryInfo.children) {
		let isLast = i == directoryInfo.children.length - 1;

		str = str.concat(constructIndentation(depth, isLastInfo) + getDirectoryStructure(directoryInfo.children[i], depth + 1, isLastInfo.concat(isLast)));
	}


	return str;
}
